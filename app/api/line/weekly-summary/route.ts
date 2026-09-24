import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, mcqAttempts } from "@/lib/db/schema";
import { isNotNull, and, gte, eq, sql } from "drizzle-orm";
import { sendLineMessage, checkLineQuota } from "@/lib/line";
import { buildWeeklySummaryFlex } from "@/lib/line-flex-templates";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest): boolean {
  // Vercel Cron auto-injects Authorization: Bearer $CRON_SECRET
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;

  // Fallback: query param
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron: Send weekly stats summary to LINE-linked users.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // This is a bulk send across every linked user — check quota headroom first.
  const quota = await checkLineQuota();
  if (quota.throttled) {
    return NextResponse.json({ ok: true, sent: 0, skipped: "quota_throttled" });
  }

  // Get LINE-linked users
  const linkedUsers = await db
    .select({ id: users.id, name: users.name, line_user_id: users.line_user_id })
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

      await sendLineMessage(user.line_user_id, [
        buildWeeklySummaryFlex({
          userName: user.name,
          totalQuestions: total,
          correctCount: correct,
          accuracy,
        }),
      ]);
      sent++;
    } catch (err) {
      console.error(`[weekly-summary] failed for user ${user.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, total: linkedUsers.length });
}
