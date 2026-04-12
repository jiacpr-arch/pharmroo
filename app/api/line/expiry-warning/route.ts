import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isNotNull, and, lte, gt } from "drizzle-orm";
import { sendLineMessage } from "@/lib/line";

export const runtime = "nodejs";

/**
 * Cron: Send LINE expiry warnings to users whose membership expires within 3 days.
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET && bearer !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  // Find users with LINE linked and membership expiring within 3 days
  const expiringUsers = await db
    .select({
      id: users.id,
      name: users.name,
      line_user_id: users.line_user_id,
      membership_expires_at: users.membership_expires_at,
    })
    .from(users)
    .where(
      and(
        isNotNull(users.line_user_id),
        isNotNull(users.membership_expires_at),
        lte(users.membership_expires_at, threeDaysLater.toISOString()),
        gt(users.membership_expires_at, now.toISOString())
      )
    );

  let sent = 0;
  for (const user of expiringUsers) {
    if (!user.line_user_id) continue;

    try {
      const expiryDate = new Date(user.membership_expires_at!);
      await sendLineMessage(
        user.line_user_id,
        [
          `⚠️ สมาชิก PharmRoo ของคุณจะหมดอายุ`,
          `วันที่: ${expiryDate.toLocaleDateString("th-TH")}`,
          ``,
          `ต่ออายุตอนนี้เพื่อไม่พลาดข้อสอบใหม่ทุกวัน!`,
          `👉 https://pharmroo.com/pricing`,
        ].join("\n")
      );
      sent++;
    } catch (err) {
      console.error(`[expiry-warning] failed for user ${user.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, total: expiringUsers.length });
}
