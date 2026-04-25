import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, mcqAttempts } from "@/lib/db/schema";
import { isNotNull, and, gte, eq, sql } from "drizzle-orm";
import { sendLineMessage } from "@/lib/line";

export const runtime = "nodejs";

/**
 * Cron: Send weekly stats summary to LINE-linked users.
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET && bearer !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get LINE-linked users
  const linkedUsers = await db
    .select({
      id: users.id,
      name: users.name,
      line_user_id: users.line_user_id,
      exam_category: users.exam_category,
    })
    .from(users)
    .where(isNotNull(users.line_user_id));

  let sent = 0;
  for (const user of linkedUsers) {
    if (!user.line_user_id) continue;

    try {
      // Get weekly stats
      const stats = await db
        .select({
          total: sql<number>`count(*)`,
          correct: sql<number>`count(*) filter (where ${mcqAttempts.is_correct} = true)`,
        })
        .from(mcqAttempts)
        .where(
          and(
            eq(mcqAttempts.user_id, user.id),
            gte(mcqAttempts.created_at, sevenDaysAgo.toISOString())
          )
        )
        .then((rows) => rows[0]);

      const total = Number(stats?.total ?? 0);
      if (total === 0) continue; // Skip inactive users

      const correct = Number(stats?.correct ?? 0);
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      const practiceUrl =
        user.exam_category === "nursing"
          ? "https://pharmroo.com/nursing/practice"
          : "https://pharmroo.com/ple/practice";

      await sendLineMessage(
        user.line_user_id,
        [
          `📊 สรุปผลสัปดาห์ของ ${user.name}`,
          ``,
          `ทำข้อสอบ: ${total} ข้อ`,
          `ถูกต้อง: ${correct} ข้อ (${accuracy}%)`,
          ``,
          `💪 สู้ต่อไปนะ! ทำข้อสอบเพิ่มได้ที่`,
          `👉 ${practiceUrl}`,
        ].join("\n")
      );
      sent++;
    } catch (err) {
      console.error(`[weekly-summary] failed for user ${user.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, total: linkedUsers.length });
}
