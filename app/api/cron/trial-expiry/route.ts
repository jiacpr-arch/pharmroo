import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, trialMessagesSent } from "@/lib/db/schema";
import { eq, and, isNotNull, sql } from "drizzle-orm";
import { sendTrialExpiryEmail } from "@/lib/email/templates";
import { sendLineMessage } from "@/lib/line";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCron(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = request.nextUrl.searchParams.get("secret");
  return (
    auth === `Bearer ${process.env.CRON_SECRET}` ||
    secret === process.env.BLOG_GENERATE_SECRET
  );
}

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: string[] = [];

  for (const daysBeforeExpiry of [3, 1] as const) {
    const target = new Date(now);
    target.setDate(target.getDate() + daysBeforeExpiry);
    const targetDate = target.toISOString().replace("T", " ").slice(0, 10);

    const expiring = await db
      .select()
      .from(users)
      .where(
        and(
          isNotNull(users.membership_expires_at),
          sql`substr(${users.membership_expires_at}, 1, 10) = ${targetDate}`,
          sql`${users.id} NOT IN (
            SELECT user_id FROM trial_messages_sent
            WHERE days_before_expiry = ${daysBeforeExpiry}
          )`
        )
      );

    for (const user of expiring) {
      const channels: ("email" | "line")[] = [];

      if (user.email) {
        try {
          await sendTrialExpiryEmail(user.email, user.name, daysBeforeExpiry);
          channels.push("email");
        } catch (err) {
          console.error("[trial-expiry] email failed:", err);
        }
      }

      if (user.line_user_id) {
        try {
          const msg =
            daysBeforeExpiry === 3
              ? `สวัสดีครับ ${user.name || ""} 🕐 Trial PharmRoo จะหมดอีก 3 วันนะครับ\nต่ออายุได้เลยที่ https://pharmroo.com/pricing`
              : `สวัสดีครับ ${user.name || ""} ⚡ Trial PharmRoo จะหมดพรุ่งนี้!\nต่ออายุได้เลยครับ https://pharmroo.com/pricing`;
          await sendLineMessage(user.line_user_id, msg);
          channels.push("line");
        } catch (err) {
          console.error("[trial-expiry] LINE failed:", err);
        }
      }

      for (const channel of channels) {
        await db
          .insert(trialMessagesSent)
          .values({ user_id: user.id, days_before_expiry: daysBeforeExpiry, channel })
          .onConflictDoNothing();
      }

      results.push(`user:${user.id} days:${daysBeforeExpiry} channels:${channels.join(",")}`);
    }
  }

  return NextResponse.json({ ok: true, processed: results });
}
