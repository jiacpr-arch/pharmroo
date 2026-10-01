import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lineMessagesSent, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { checkLineQuota, sendLineMessage } from "@/lib/line";
import { buildExamCountdownFlex } from "@/lib/line-flex-templates";
import { getResend, fromEmail } from "@/lib/email/resend";
import { bangkokToday } from "@/lib/daily-mcq-line";
import {
  COUNTDOWN_COPY,
  EXAM_SCHEDULE,
  daysUntil,
  milestoneFor,
  type CountdownMilestone,
  type ExamRound,
} from "@/lib/exam-countdown";

export const runtime = "nodejs";

const KIND = "exam_countdown";

function isAuthorized(request: NextRequest): boolean {
  // Vercel Cron auto-injects Authorization: Bearer $CRON_SECRET
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;

  // Fallback: query param
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron: remind users 30, 14, 7, 3 and 1 day(s) before their target exam,
 * once per (user, round, milestone). LINE-linked users get a LINE push;
 * everyone else gets an email.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = bangkokToday();
  const due = EXAM_SCHEDULE.flatMap((round) => {
    const milestone = milestoneFor(daysUntil(round.examDate, today));
    return milestone ? [{ round, milestone }] : [];
  });
  if (due.length === 0) {
    return NextResponse.json({ ok: true, today, sent: 0, skipped: "no_milestone" });
  }

  const quota = await checkLineQuota();

  let sent = 0;
  let checked = 0;
  for (const { round, milestone } of due) {
    const result = await sendForRound(round, milestone, quota.throttled);
    sent += result.sent;
    checked += result.checked;
  }

  return NextResponse.json({
    ok: true,
    today,
    due: due.map((d) => `${d.round.id}:${d.milestone}`),
    sent,
    checked,
    lineThrottled: quota.throttled,
  });
}

async function sendForRound(
  round: ExamRound,
  milestone: CountdownMilestone,
  lineThrottled: boolean
): Promise<{ sent: number; checked: number }> {
  const ref = `${round.id}:${milestone}`;
  const copy = COUNTDOWN_COPY[milestone];

  const audience = await db
    .select({
      id: users.id,
      email: users.email,
      line_user_id: users.line_user_id,
    })
    .from(users)
    .where(and(eq(users.role, "user"), eq(users.target_exam, round.targetExam)));
  if (audience.length === 0) return { sent: 0, checked: 0 };

  // Dedupe: one query for everyone already notified for this (round, milestone).
  const alreadySent = new Set(
    (
      await db
        .select({ user_id: lineMessagesSent.user_id })
        .from(lineMessagesSent)
        .where(and(eq(lineMessagesSent.kind, KIND), eq(lineMessagesSent.ref, ref)))
    ).map((r) => r.user_id)
  );

  let sent = 0;
  for (const user of audience) {
    if (alreadySent.has(user.id)) continue;
    // When LINE quota is low, skip LINE users so the reserve stays free for
    // critical sends (payment confirmations, replies) — same policy as the
    // other bulk crons.
    if (user.line_user_id && lineThrottled) continue;

    try {
      const channel = user.line_user_id ? "line" : "email";
      if (user.line_user_id) {
        await sendLineMessage(user.line_user_id, [
          buildExamCountdownFlex({
            examLabel: round.label,
            examDate: round.examDate,
            daysLeft: milestone,
            ...copy,
          }),
        ]);
      } else {
        const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pharmru.com").trim();
        await getResend().emails.send({
          from: fromEmail,
          to: user.email,
          subject: `${copy.title} — ${round.label}`,
          html: `<p><strong>เหลืออีก ${milestone} วันสอบ ${round.label}</strong></p><p>${copy.body}</p><p><a href="${site}${copy.path}">${copy.buttonLabel}</a></p>`,
        });
      }

      await db.insert(lineMessagesSent).values({
        user_id: user.id,
        kind: KIND,
        ref,
        channel,
      });
      sent++;
    } catch (err) {
      console.error(`[exam-countdown] failed for user ${user.id} (${ref}):`, err);
    }
  }

  return { sent, checked: audience.length };
}
