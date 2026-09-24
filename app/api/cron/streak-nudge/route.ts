import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lineMessagesSent, mcqAttempts, users } from "@/lib/db/schema";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { checkLineQuota, sendLineMessage } from "@/lib/line";
import { buildStreakNudgeFlex } from "@/lib/line-flex-templates";
import { bangkokToday } from "@/lib/daily-mcq-line";

export const runtime = "nodejs";

const KIND = "streak_nudge";
/** Nudge once a user has gone quiet this many days — long enough not to bother someone mid-break. */
const INACTIVE_DAYS_THRESHOLD = 3;

function isAuthorized(request: NextRequest): boolean {
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron: nudge LINE-linked users who haven't attempted a question in a few
 * days. Sent at most once per (user, day) via line_messages_sent.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quota = await checkLineQuota();
  if (quota.throttled) {
    return NextResponse.json({ ok: true, sent: 0, skipped: "quota_throttled" });
  }

  const linkedUsers = await db
    .select({ id: users.id, name: users.name, line_user_id: users.line_user_id })
    .from(users)
    .where(isNotNull(users.line_user_id));

  const today = bangkokToday();
  let sent = 0;
  let skipped = 0;

  for (const user of linkedUsers) {
    if (!user.line_user_id) continue;

    try {
      const last = await db
        .select({ last_at: sql<string | null>`max(${mcqAttempts.created_at})` })
        .from(mcqAttempts)
        .where(eq(mcqAttempts.user_id, user.id))
        .then((rows) => rows[0]?.last_at ?? null);

      if (!last) {
        skipped++; // never attempted anything — nothing to nudge back to
        continue;
      }

      const daysSince = Math.floor(
        (Date.now() - new Date(last.replace(" ", "T") + "Z").getTime()) / (24 * 60 * 60 * 1000)
      );
      if (daysSince < INACTIVE_DAYS_THRESHOLD) {
        skipped++;
        continue;
      }

      const alreadySent = await db
        .select({ id: lineMessagesSent.id })
        .from(lineMessagesSent)
        .where(
          and(
            eq(lineMessagesSent.user_id, user.id),
            eq(lineMessagesSent.kind, KIND),
            eq(lineMessagesSent.ref, today)
          )
        )
        .then((rows) => rows[0]);
      if (alreadySent) {
        skipped++;
        continue;
      }

      await sendLineMessage(user.line_user_id, [
        buildStreakNudgeFlex({ userName: user.name, daysSinceLastAttempt: daysSince }),
      ]);
      await db.insert(lineMessagesSent).values({
        user_id: user.id,
        kind: KIND,
        ref: today,
        channel: "line",
      });
      sent++;
    } catch (err) {
      console.error(`[streak-nudge] failed for user ${user.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, checked: linkedUsers.length });
}
