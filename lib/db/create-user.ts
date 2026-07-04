import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { randomUUID } from "crypto";
import { grantWelcomeCredits } from "@/lib/db/queries-credits";
import { sendWelcomeEmail } from "@/lib/email";

/** Placeholder domain for accounts created via LINE login without an email. */
const SYNTHETIC_EMAIL_DOMAIN = "@line.pharmroo.com";

/**
 * Single choke point for creating a user account. Every signup path
 * (credentials register, Google OAuth, LINE login) goes through here so
 * per-signup side effects — welcome credits, welcome email — apply uniformly
 * and can't be forgotten by a new provider.
 */
export async function createUser(input: {
  email: string;
  name: string;
  password_hash?: string | null;
  line_user_id?: string | null;
}): Promise<string> {
  const id = randomUUID();

  await db.insert(users).values({
    id,
    email: input.email,
    name: input.name,
    password_hash: input.password_hash ?? null,
    role: "user",
    membership_type: "free",
    ...(input.line_user_id && {
      line_user_id: input.line_user_id,
      line_linked_at: new Date().toISOString(),
    }),
  });

  // Never block signup on side effects.
  await grantWelcomeCredits(id);
  if (!input.email.endsWith(SYNTHETIC_EMAIL_DOMAIN)) {
    sendWelcomeEmail({ email: input.email, name: input.name }).catch((err) =>
      console.error("[createUser] welcome email error:", err)
    );
  }

  return id;
}
