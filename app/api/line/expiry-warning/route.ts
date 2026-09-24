import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lineMessagesSent, users } from "@/lib/db/schema";
import { and, eq, gt, isNotNull, lte } from "drizzle-orm";
import { sendLineMessage } from "@/lib/line";
import { buildExpiryWarningMessage } from "@/lib/line-flex-templates";
import { getResend, fromEmail } from "@/lib/email/resend";

export const runtime = "nodejs";

/** Warn at 7, 3 and 1 days before expiry — matching morroo's schedule. */
const WARNING_DAYS = [7, 3, 1] as const;
const KIND = "expiry_warning";

function isAuthorized(request: NextRequest): boolean {
  // Vercel Cron auto-injects Authorization: Bearer $CRON_SECRET
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;

  // Fallback: query param
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron: warn members whose membership expires within 7, 3, or 1 day(s),
 * once per (user, days-before-expiry) so the same warning never repeats.
 * LINE-linked users get a LINE push; everyone else gets an email.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const candidates = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      line_user_id: users.line_user_id,
      membership_expires_at: users.membership_expires_at,
    })
    .from(users)
    .where(
      and(
        isNotNull(users.membership_expires_at),
        gt(users.membership_expires_at, now.toISOString()),
        // widest window we care about (7 days) — narrowed per-user below
        lte(
          users.membership_expires_at,
          new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        )
      )
    );

  let sent = 0;
  for (const user of candidates) {
    if (!user.membership_expires_at) continue;
    const expiresAt = new Date(user.membership_expires_at);
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    const bucket = WARNING_DAYS.find((d) => daysLeft === d);
    if (bucket === undefined) continue;

    // Dedupe: skip if we've already sent this (user, bucket) warning.
    const alreadySent = await db
      .select({ id: lineMessagesSent.id })
      .from(lineMessagesSent)
      .where(
        and(
          eq(lineMessagesSent.user_id, user.id),
          eq(lineMessagesSent.kind, KIND),
          eq(lineMessagesSent.ref, String(bucket))
        )
      )
      .then((rows) => rows[0]);
    if (alreadySent) continue;

    try {
      const channel = user.line_user_id ? "line" : "email";
      if (user.line_user_id) {
        await sendLineMessage(
          user.line_user_id,
          [buildExpiryWarningMessage({ daysLeft, expiresAt })]
        );
      } else {
        await getResend().emails.send({
          from: fromEmail,
          to: user.email,
          subject: `⏰ สมาชิก PharmRoo ของคุณจะหมดอายุใน ${daysLeft} วัน`,
          html: `<p>สมาชิกของคุณจะหมดอายุวันที่ ${expiresAt.toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" })}</p><p>ต่ออายุได้ที่ <a href="${(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pharmru.com").trim()}/pricing">หน้าราคา</a></p>`,
        });
      }

      await db.insert(lineMessagesSent).values({
        user_id: user.id,
        kind: KIND,
        ref: String(bucket),
        channel,
      });
      sent++;
    } catch (err) {
      console.error(`[expiry-warning] failed for user ${user.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, checked: candidates.length });
}
