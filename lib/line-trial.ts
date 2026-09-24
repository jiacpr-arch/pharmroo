import { and, eq, isNull, TransactionRollbackError } from "drizzle-orm";
import { db } from "@/lib/db";
import { lineTrialClaims, users } from "@/lib/db/schema";
import { isPaidMember } from "@/lib/credits-gate";
import { LINE_TRIAL_DAYS } from "@/lib/limits";

export type LineTrialResult =
  | { granted: true; expiresAt: string }
  | { granted: false; reason: "paid_member" | "already_claimed" };

/**
 * Grant the one-time link-LINE Premium trial. Each web account and each LINE
 * userId can claim it at most once; paid members are skipped without using
 * up the claim.
 */
export async function claimLineTrial(
  userId: string,
  lineUserId: string
): Promise<LineTrialResult> {
  try {
    return await db.transaction(async (tx) => {
    const user = await tx
      .select({
        membership_type: users.membership_type,
        line_trial_expires_at: users.line_trial_expires_at,
      })
      .from(users)
      .where(eq(users.id, userId))
      .then((rows) => rows[0]);

    if (!user) return { granted: false, reason: "already_claimed" } as const;
    if (isPaidMember(user.membership_type)) {
      return { granted: false, reason: "paid_member" } as const;
    }
    if (user.line_trial_expires_at) {
      return { granted: false, reason: "already_claimed" } as const;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + LINE_TRIAL_DAYS);
    const expiresAt = expires.toISOString();

    // Conditional update so two concurrent claims for one account can't both win.
    const updated = await tx
      .update(users)
      .set({ line_trial_expires_at: expiresAt })
      .where(and(eq(users.id, userId), isNull(users.line_trial_expires_at)))
      .returning({ id: users.id });
    if (updated.length === 0) {
      return { granted: false, reason: "already_claimed" } as const;
    }

    const claimed = await tx
      .insert(lineTrialClaims)
      .values({ line_user_id: lineUserId, user_id: userId })
      .onConflictDoNothing()
      .returning({ line_user_id: lineTrialClaims.line_user_id });
    if (claimed.length === 0) {
      // This LINE account already claimed on another web account: undo the grant.
      tx.rollback();
    }

    return { granted: true, expiresAt } as const;
    });
  } catch (err) {
    if (err instanceof TransactionRollbackError) {
      return { granted: false, reason: "already_claimed" };
    }
    throw err;
  }
}
