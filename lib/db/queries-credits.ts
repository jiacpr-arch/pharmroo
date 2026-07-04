import { db } from "./index";
import {
  users,
  creditPacks,
  creditLedger,
  questionUnlocks,
} from "./schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { CreditPack } from "./schema";

export type CreditLedgerType =
  | "welcome"
  | "purchase"
  | "spend"
  | "refund"
  | "admin"
  | "referral";

/** `db` or a transaction handle — both expose the same query/transaction API. */
type DbExecutor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export type UnlockResult =
  | { status: "unlocked"; balance: number }
  | { status: "already"; balance: number }
  | { status: "insufficient"; balance: number };

class InsufficientCreditsError extends Error {}

/** drizzle wraps driver errors (DrizzleQueryError); the pg code sits on `cause`. */
function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code === "23505" || e?.cause?.code === "23505";
}

/** Active credit packs, cheapest first. */
export async function getCreditPacks(): Promise<CreditPack[]> {
  return db
    .select()
    .from(creditPacks)
    .where(eq(creditPacks.is_active, true))
    .orderBy(creditPacks.sort_order);
}

export async function getUserCreditBalance(userId: string): Promise<number> {
  const row = await db
    .select({ balance: users.credit_balance })
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => rows[0]);
  return row?.balance ?? 0;
}

/**
 * Question ids the user has unlocked. Pass the ids being served to keep the
 * result bounded — without it the row count grows with every unlock the user
 * ever made.
 */
export async function getUserUnlockedQuestionIds(
  userId: string,
  questionIds?: string[]
): Promise<string[]> {
  if (questionIds && questionIds.length === 0) return [];
  const conditions = [eq(questionUnlocks.user_id, userId)];
  if (questionIds) {
    conditions.push(inArray(questionUnlocks.question_id, questionIds));
  }
  const rows = await db
    .select({ question_id: questionUnlocks.question_id })
    .from(questionUnlocks)
    .where(and(...conditions));
  return rows.map((r) => r.question_id);
}

/**
 * Add credits to a user and record a ledger entry, atomically.
 * Used by top-up fulfillment (Stripe + manual approval) and welcome grants.
 * Pass a transaction as `executor` to compose with an enclosing transaction
 * (runs as a savepoint).
 */
export async function addCredits(
  userId: string,
  amount: number,
  opts: { type: CreditLedgerType; relatedId?: string | null; note?: string | null },
  executor: DbExecutor = db
): Promise<number> {
  return executor.transaction(async (tx) => {
    const upd = await tx
      .update(users)
      .set({ credit_balance: sql`${users.credit_balance} + ${amount}` })
      .where(eq(users.id, userId))
      .returning({ balance: users.credit_balance });

    const balance = upd[0]?.balance ?? 0;

    await tx.insert(creditLedger).values({
      id: randomUUID(),
      user_id: userId,
      type: opts.type,
      amount,
      balance_after: balance,
      related_id: opts.relatedId ?? null,
      note: opts.note ?? null,
    });

    return balance;
  });
}

/** Grant one-time welcome credits to a brand-new user. */
export async function grantWelcomeCredits(
  userId: string,
  amount = 3
): Promise<void> {
  try {
    await addCredits(userId, amount, {
      type: "welcome",
      note: "welcome credits",
    });
  } catch (err) {
    // Never block signup on a credit grant.
    console.error("[credits] welcome grant failed:", err);
  }
}

/**
 * Spend exactly 1 credit to unlock a question's detailed explanation.
 *
 * Correctness guarantees:
 *  - The unique index on (user_id, question_id) means a question is charged at
 *    most once, even under concurrent requests — the loser's insert fails with
 *    a unique violation, mapped to "already".
 *  - The balance is decremented with a `>= 1` guard so it can never go negative.
 *  - Claiming the unlock row and decrementing happen in one transaction, so a
 *    failed decrement rolls back the claim (no free unlocks, no lost credits).
 */
export async function spendCreditForUnlock(
  userId: string,
  questionId: string
): Promise<UnlockResult> {
  try {
    return await db.transaction(async (tx) => {
      const ledgerId = randomUUID();

      // Claim the unlock first; the unique index rejects duplicates.
      await tx.insert(questionUnlocks).values({
        id: randomUUID(),
        user_id: userId,
        question_id: questionId,
        credit_ledger_id: ledgerId,
      });

      // Decrement guarded by balance >= 1.
      const dec = await tx
        .update(users)
        .set({ credit_balance: sql`${users.credit_balance} - 1` })
        .where(and(eq(users.id, userId), gte(users.credit_balance, 1)))
        .returning({ balance: users.credit_balance });

      if (dec.length === 0) {
        throw new InsufficientCreditsError();
      }

      const balance = dec[0].balance;

      await tx.insert(creditLedger).values({
        id: ledgerId,
        user_id: userId,
        type: "spend",
        amount: -1,
        balance_after: balance,
        related_id: questionId,
        note: "unlock question",
      });

      return { status: "unlocked" as const, balance };
    });
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return { status: "insufficient", balance: await getUserCreditBalance(userId) };
    }
    if (isUniqueViolation(err)) {
      // A concurrent (or earlier) request already unlocked it — no charge.
      return { status: "already", balance: await getUserCreditBalance(userId) };
    }
    throw err;
  }
}
