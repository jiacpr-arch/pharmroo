import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createUser } from "@/lib/db/create-user";

/** Placeholder email for LINE accounts whose email LINE didn't share. */
export function linePlaceholderEmail(lineUserId: string): string {
  return `line_${lineUserId}@line.pharmroo.com`;
}

/**
 * Find the pharmroo account for a LINE userId — or create one. Shared by the
 * LINE Login OAuth provider and the LIFF sign-in provider so both resolve a
 * LINE identity to the same account:
 *
 *   1. an account already linked to this LINE userId;
 *   2. otherwise an account with the same email (then link it);
 *   3. otherwise a new account (placeholder email when LINE gave none).
 */
export async function resolveOrCreateLineUser(input: {
  lineUserId: string;
  email?: string | null;
  name?: string | null;
}): Promise<User> {
  const byLine = await db
    .select()
    .from(users)
    .where(eq(users.line_user_id, input.lineUserId))
    .then((rows) => rows[0]);
  if (byLine) return byLine;

  if (input.email) {
    const byEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .then((rows) => rows[0]);
    if (byEmail) {
      const [linked] = await db
        .update(users)
        .set({ line_user_id: input.lineUserId, line_linked_at: new Date().toISOString() })
        .where(eq(users.id, byEmail.id))
        .returning();
      return linked ?? byEmail;
    }
  }

  const id = await createUser({
    email: input.email || linePlaceholderEmail(input.lineUserId),
    name: input.name || "LINE User",
    line_user_id: input.lineUserId,
  });
  const created = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((rows) => rows[0]);
  if (!created) throw new Error(`[line-auth] user ${id} vanished after create`);
  return created;
}
