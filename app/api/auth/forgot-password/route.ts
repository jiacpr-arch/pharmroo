import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { passwordResetTokens, users } from "@/lib/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";
import {
  formatDbTimestamp,
  generateResetToken,
  hashResetToken,
  RESET_TOKEN_TTL_MS,
} from "@/lib/password-reset";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://pharmru.com"
).trim();

// Same response whether or not the email exists, so this can't be used to
// enumerate accounts.
const OK = { success: true };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email) {
    return NextResponse.json({ error: "กรุณากรอกอีเมล" }, { status: 400 });
  }

  const user = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0]);

  // Social-only accounts (no password) can't reset one; LINE placeholder
  // emails aren't deliverable.
  if (!user || user.email.endsWith("@line.pharmroo.com")) return NextResponse.json(OK);

  // Invalidate earlier unused links so only the latest works.
  await db
    .update(passwordResetTokens)
    .set({ used_at: formatDbTimestamp(new Date()) })
    .where(and(eq(passwordResetTokens.user_id, user.id), isNull(passwordResetTokens.used_at)));

  const token = generateResetToken();
  await db.insert(passwordResetTokens).values({
    user_id: user.id,
    token_hash: hashResetToken(token),
    expires_at: formatDbTimestamp(new Date(Date.now() + RESET_TOKEN_TTL_MS)),
  });

  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;
  try {
    await sendPasswordResetEmail({ email: user.email, name: user.name, resetUrl });
  } catch (err) {
    console.error("[forgot-password] email error:", err);
  }

  return NextResponse.json(OK);
}
