import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userChallenges, mcqAttempts, mcqSessions } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/challenges — returns completed challenge IDs for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const completed = await db
    .select({ challenge_id: userChallenges.challenge_id })
    .from(userChallenges)
    .where(eq(userChallenges.user_id, userId));

  return NextResponse.json({ completed: completed.map((r) => r.challenge_id) });
}

// POST /api/challenges — mark a challenge as complete (after verifying conditions)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { challenge_id } = (await req.json()) as { challenge_id: string };
  if (!challenge_id) {
    return NextResponse.json({ error: "challenge_id required" }, { status: 400 });
  }

  // Verify the condition server-side before marking complete
  const eligible = await checkEligible(userId, challenge_id);
  if (!eligible) {
    return NextResponse.json({ error: "Condition not met" }, { status: 403 });
  }

  await db
    .insert(userChallenges)
    .values({ user_id: userId, challenge_id })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}

// ── Condition checkers ────────────────────────────────────────────────────────

async function checkEligible(userId: string, challengeId: string): Promise<boolean> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStr = todayStart.toISOString().replace("T", " ").slice(0, 19);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);
  const weekStr = weekStart.toISOString().replace("T", " ").slice(0, 19);

  switch (challengeId) {
    case "daily_10": {
      const [row] = await db
        .select({ cnt: sql<number>`count(*)` })
        .from(mcqAttempts)
        .where(and(eq(mcqAttempts.user_id, userId), gte(mcqAttempts.created_at, todayStr)));
      return Number(row?.cnt ?? 0) >= 10;
    }

    case "daily_accuracy": {
      // Any session today with ≥10 questions and accuracy ≥80%
      const sessions = await db
        .select({
          total: mcqSessions.total_questions,
          correct: mcqSessions.correct_count,
        })
        .from(mcqSessions)
        .where(and(eq(mcqSessions.user_id, userId), gte(mcqSessions.created_at, todayStr)));
      return sessions.some(
        (s) => s.total >= 10 && s.total > 0 && s.correct / s.total >= 0.8
      );
    }

    case "daily_mock": {
      const [row] = await db
        .select({ cnt: sql<number>`count(*)` })
        .from(mcqSessions)
        .where(
          and(
            eq(mcqSessions.user_id, userId),
            eq(mcqSessions.mode, "mock"),
            gte(mcqSessions.created_at, todayStr),
            sql`${mcqSessions.completed_at} is not null`
          )
        );
      return Number(row?.cnt ?? 0) >= 1;
    }

    case "week_streak_5": {
      const result = await db.execute(sql`
        WITH daily AS (
          SELECT DISTINCT DATE(created_at::timestamp) AS day
          FROM mcq_attempts WHERE user_id = ${userId}
        ),
        with_gaps AS (
          SELECT day, LAG(day,1) OVER (ORDER BY day ASC) AS prev_day FROM daily
        ),
        grouped AS (
          SELECT day,
            SUM(CASE WHEN prev_day IS NULL OR day - prev_day > 1 THEN 1 ELSE 0 END)
              OVER (ORDER BY day ASC) AS grp
          FROM with_gaps
        ),
        group_stats AS (
          SELECT MAX(day) AS last_day, COUNT(*) AS days FROM grouped GROUP BY grp
        )
        SELECT COALESCE(
          (SELECT days FROM group_stats WHERE last_day >= CURRENT_DATE - 1
           ORDER BY last_day DESC LIMIT 1), 0
        ) AS streak
      `);
      return Number((result.rows[0] as { streak: number })?.streak ?? 0) >= 5;
    }

    case "week_all_subjects": {
      const r1 = await db.execute(sql`
        SELECT COUNT(DISTINCT q.subject_id) AS subjects
        FROM mcq_attempts a
        JOIN mcq_questions q ON q.id = a.question_id
        WHERE a.user_id = ${userId} AND a.created_at >= ${weekStr}
      `);
      return Number((r1.rows[0] as { subjects: number })?.subjects ?? 0) >= 5;
    }

    case "week_100": {
      const [row] = await db
        .select({ cnt: sql<number>`count(*)` })
        .from(mcqAttempts)
        .where(and(eq(mcqAttempts.user_id, userId), gte(mcqAttempts.created_at, weekStr)));
      return Number(row?.cnt ?? 0) >= 100;
    }

    case "special_pharma_chem": {
      const r2 = await db.execute(sql`
        SELECT COUNT(*) AS total,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct
        FROM mcq_attempts a
        JOIN mcq_questions q ON q.id = a.question_id
        JOIN mcq_subjects s  ON s.id = q.subject_id
        WHERE a.user_id = ${userId} AND s.name = 'pharma_chem'
      `);
      const r = r2.rows[0] as { total: number; correct: number };
      return Number(r?.total ?? 0) >= 50 && Number(r?.correct ?? 0) / Number(r?.total ?? 1) >= 0.7;
    }

    case "special_pharm_law": {
      const r3 = await db.execute(sql`
        SELECT COUNT(*) AS total
        FROM mcq_attempts a
        JOIN mcq_questions q ON q.id = a.question_id
        JOIN mcq_subjects s  ON s.id = q.subject_id
        WHERE a.user_id = ${userId} AND s.name = 'pharm_law'
      `);
      return Number((r3.rows[0] as { total: number })?.total ?? 0) >= 30;
    }

    case "special_mock_pass": {
      const sessions = await db
        .select({ total: mcqSessions.total_questions, correct: mcqSessions.correct_count })
        .from(mcqSessions)
        .where(
          and(
            eq(mcqSessions.user_id, userId),
            eq(mcqSessions.mode, "mock"),
            sql`${mcqSessions.completed_at} is not null`
          )
        );
      return sessions.some((s) => s.total > 0 && s.correct / s.total >= 0.6);
    }

    case "special_500": {
      const [row] = await db
        .select({ cnt: sql<number>`count(*)` })
        .from(mcqAttempts)
        .where(eq(mcqAttempts.user_id, userId));
      return Number(row?.cnt ?? 0) >= 500;
    }

    // ── NLE (nursing) challenges ─────────────────────────────────────────────
    // Conditions check against NLE-tagged questions broadly. Subject-specific
    // filtering (e.g. "การพยาบาลผู้ใหญ่") will land once subject naming for
    // nursing is finalized.
    case "nle_adult_master": {
      const r = await db.execute(sql`
        SELECT COUNT(*) AS total,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct
        FROM mcq_attempts a
        JOIN mcq_questions q ON q.id = a.question_id
        WHERE a.user_id = ${userId} AND q.exam_type = 'NLE'
      `);
      const stats = r.rows[0] as { total: number; correct: number };
      const total = Number(stats?.total ?? 0);
      const correct = Number(stats?.correct ?? 0);
      return total >= 50 && correct / total >= 0.7;
    }

    case "nle_obstetric": {
      const r = await db.execute(sql`
        SELECT COUNT(*) AS total
        FROM mcq_attempts a
        JOIN mcq_questions q ON q.id = a.question_id
        WHERE a.user_id = ${userId} AND q.exam_type = 'NLE'
      `);
      return Number((r.rows[0] as { total: number })?.total ?? 0) >= 30;
    }

    case "special_500_nle": {
      const [row] = await db
        .select({ cnt: sql<number>`count(*)` })
        .from(mcqAttempts)
        .where(eq(mcqAttempts.user_id, userId));
      return Number(row?.cnt ?? 0) >= 500;
    }

    default:
      return false;
  }
}
