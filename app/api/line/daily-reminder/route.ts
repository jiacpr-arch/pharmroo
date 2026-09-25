import { NextRequest, NextResponse } from "next/server";
import { checkLineQuota, sendLineMessage } from "@/lib/line";
import {
  bangkokToday,
  getActiveDailyAudience,
  loadDailyQuestion,
  loadHardQuestion,
  toDailyMcqMessage,
} from "@/lib/daily-mcq-line";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest): boolean {
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

function bangkokWeekday(now: Date = new Date()): number {
  const short = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", weekday: "short" }).format(now);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[short] ?? now.getDay();
}

/**
 * Cron: daily LINE push of the daily MCQ to every linked user, Monday–Friday
 * (Fri gets the harder weekly question). Weekends are skipped — the weekly
 * stats recap is already covered by the separate /api/line/weekly-summary
 * cron on Sundays.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekday = bangkokWeekday();
  if (weekday === 0 || weekday === 6) {
    return NextResponse.json({ ok: true, weekday, sent: 0, skipped: "weekend" });
  }

  const quota = await checkLineQuota();
  if (quota.throttled) {
    return NextResponse.json({ ok: true, sent: 0, skipped: "quota_throttled" });
  }

  const date = bangkokToday();
  const audience = await getActiveDailyAudience();
  const isHard = weekday === 5;

  let sent = 0;
  let skipped = 0;

  // The same question is shown to everyone in a category, so cache it once
  // per category instead of re-deriving it per user.
  const questionCache = new Map<string, Awaited<ReturnType<typeof loadDailyQuestion>>>();

  for (const user of audience) {
    const category = user.exam_category ?? "pharmacy";
    if (!questionCache.has(category)) {
      questionCache.set(
        category,
        isHard ? await loadHardQuestion(category, date) : await loadDailyQuestion(category, date)
      );
    }
    const question = questionCache.get(category);
    if (!question) {
      skipped++;
      continue;
    }

    try {
      await sendLineMessage(user.line_user_id, [toDailyMcqMessage(question, date, category, isHard)]);
      sent++;
    } catch (err) {
      console.error(`[daily-reminder] failed for user ${user.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, weekday, sent, skipped, checked: audience.length });
}
