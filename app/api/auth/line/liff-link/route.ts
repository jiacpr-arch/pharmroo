import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyLineIdToken } from "@/lib/line-id-token";
import { grantLineBonus, lineBonusMessage } from "@/lib/line-bonus";

export const runtime = "nodejs";

/**
 * Links the LIFF-verified LINE account to the currently logged-in pharmroo
 * user — the one-tap alternative to typing a PHARMROO-XXXXXX code. Requires
 * an existing NextAuth session; signing a *new* session in from the LIFF
 * page isn't supported here, callers should send an unauthenticated visitor
 * through the normal LINE Login flow instead.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) {
    return NextResponse.json({ error: "LINE Login not configured" }, { status: 500 });
  }

  const { idToken } = (await request.json().catch(() => ({}))) as { idToken?: string };
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  const payload = await verifyLineIdToken(idToken, channelId);
  if (!payload?.sub) {
    return NextResponse.json({ error: "Invalid LINE token" }, { status: 401 });
  }
  const lineUserId = payload.sub;

  const ownedByAnother = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.line_user_id, lineUserId))
    .then((rows) => rows[0]);

  if (ownedByAnother && ownedByAnother.id !== session.user.id) {
    return NextResponse.json(
      { error: "บัญชี LINE นี้เชื่อมต่อกับบัญชี PharmRoo อื่นแล้ว" },
      { status: 409 }
    );
  }

  if (!ownedByAnother) {
    await db
      .update(users)
      .set({ line_user_id: lineUserId, line_linked_at: new Date().toISOString() })
      .where(eq(users.id, session.user.id));
  }

  const bonusExpiresAt = await grantLineBonus(session.user.id);

  return NextResponse.json({
    ok: true,
    alreadyLinked: !!ownedByAnother,
    bonusMessage: bonusExpiresAt ? lineBonusMessage(bonusExpiresAt) : null,
  });
}
