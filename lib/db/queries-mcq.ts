import { db } from "./index";
import { mcqSubjects, mcqQuestions, mcqAttempts, mcqSessions, questionSets, setPurchases, setQuestions } from "./schema";
import { eq, and, sql, desc } from "drizzle-orm";
import type { McqSubject, McqQuestion, QuestionSet, SetPurchase } from "../types-mcq";

export async function getMcqSubjects(): Promise<McqSubject[]> {
  const rows = await db.select().from(mcqSubjects).orderBy(mcqSubjects.name_th);
  return rows.map(toMcqSubject);
}

export async function getMcqQuestions(options?: {
  subjectId?: string;
  examType?: string;
  examDay?: 1 | 2;
  setId?: string;
  limit?: number;
  randomize?: boolean;
}): Promise<McqQuestion[]> {
  if (options?.setId) {
    const rows = await db
      .select({ q: mcqQuestions, s: mcqSubjects, sort: setQuestions.sort_order })
      .from(setQuestions)
      .innerJoin(mcqQuestions, eq(setQuestions.question_id, mcqQuestions.id))
      .leftJoin(mcqSubjects, eq(mcqQuestions.subject_id, mcqSubjects.id))
      .where(eq(setQuestions.set_id, options.setId))
      .orderBy(setQuestions.sort_order)
      .limit(options.limit || 300);

    let questions = rows.map((r) => toMcqQuestion(r.q, r.s ?? undefined));
    if (options.randomize) questions = questions.sort(() => Math.random() - 0.5);
    return questions;
  }

  const conditions = [eq(mcqQuestions.status, "active")];
  if (options?.subjectId) conditions.push(eq(mcqQuestions.subject_id, options.subjectId));
  if (options?.examType) conditions.push(eq(mcqQuestions.exam_type, options.examType as "PLE-PC" | "PLE-CC1"));
  if (options?.examDay) conditions.push(eq(mcqQuestions.exam_day, options.examDay));

  const rows = await db
    .select({ q: mcqQuestions, s: mcqSubjects })
    .from(mcqQuestions)
    .leftJoin(mcqSubjects, eq(mcqQuestions.subject_id, mcqSubjects.id))
    .where(and(...conditions))
    .limit(options?.limit || 50);

  let questions = rows.map((r) => toMcqQuestion(r.q, r.s ?? undefined));
  if (options?.randomize) questions = questions.sort(() => Math.random() - 0.5);
  return questions;
}

export async function getMcqQuestion(id: string): Promise<McqQuestion | null> {
  const row = await db
    .select({ q: mcqQuestions, s: mcqSubjects })
    .from(mcqQuestions)
    .leftJoin(mcqSubjects, eq(mcqQuestions.subject_id, mcqSubjects.id))
    .where(and(eq(mcqQuestions.id, id), eq(mcqQuestions.status, "active")))
    .then(rows => rows[0]);

  if (!row) return null;
  return toMcqQuestion(row.q, row.s ?? undefined);
}

export async function getQuestionSets(userId?: string): Promise<QuestionSet[]> {
  const rows = await db
    .select()
    .from(questionSets)
    .where(eq(questionSets.is_active, true))
    .orderBy(questionSets.sort_order);

  if (!userId) return rows.map(toQuestionSet);

  const purchases = await db
    .select({ set_id: setPurchases.set_id })
    .from(setPurchases)
    .where(and(eq(setPurchases.user_id, userId), eq(setPurchases.status, "active")));

  const purchasedIds = new Set(purchases.map((p) => p.set_id));
  return rows.map((s) => ({ ...toQuestionSet(s), user_purchased: purchasedIds.has(s.id) }));
}

export async function getQuestionSet(id: string): Promise<QuestionSet | null> {
  const row = await db
    .select()
    .from(questionSets)
    .where(and(eq(questionSets.id, id), eq(questionSets.is_active, true)))
    .then(rows => rows[0]);

  if (!row) return null;
  return toQuestionSet(row);
}

export async function getUserSetPurchases(userId: string): Promise<SetPurchase[]> {
  const rows = await db
    .select()
    .from(setPurchases)
    .where(and(eq(setPurchases.user_id, userId), eq(setPurchases.status, "active")));
  return rows.map(toSetPurchase);
}

export async function getNewQuestionsStats(): Promise<{
  totalActive: number;
  newThisWeek: number;
  nextReleaseAt: string; // ISO string — next Sunday 00:00 Bangkok
}> {
  const [totalRow, newRow] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(mcqQuestions)
      .where(eq(mcqQuestions.status, "active")),
    db
      .select({ count: sql<number>`count(*)` })
      .from(mcqQuestions)
      .where(
        and(
          eq(mcqQuestions.status, "active"),
          sql`${mcqQuestions.created_at} >= to_char(now() - interval '7 days', 'YYYY-MM-DD HH24:MI:SS')`
        )
      ),
  ]);

  // Next Sunday 00:00 Bangkok (UTC+7)
  const now = new Date();
  const bangkokOffset = 7 * 60; // minutes
  const localMs = now.getTime() + (bangkokOffset + now.getTimezoneOffset()) * 60000;
  const localNow = new Date(localMs);
  const daysUntilSunday = (7 - localNow.getDay()) % 7 || 7;
  const nextSunday = new Date(localMs + daysUntilSunday * 86400000);
  nextSunday.setHours(0, 0, 0, 0);
  const nextReleaseAt = new Date(nextSunday.getTime() - bangkokOffset * 60000).toISOString();

  return {
    totalActive: Number(totalRow[0]?.count ?? 0),
    newThisWeek: Number(newRow[0]?.count ?? 0),
    nextReleaseAt,
  };
}

export async function getMcqSubjectCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ subject_id: mcqQuestions.subject_id })
    .from(mcqQuestions)
    .where(eq(mcqQuestions.status, "active"));

  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (row.subject_id) counts[row.subject_id] = (counts[row.subject_id] || 0) + 1;
  }
  return counts;
}

// ========================================
// Student Stats Queries
// ========================================

export async function getStudentOverallStats(userId: string) {
  const rows = await db
    .select({
      total: sql<number>`count(*)`,
      correct: sql<number>`sum(case when ${mcqAttempts.is_correct} then 1 else 0 end)`,
      total_time: sql<number>`coalesce(sum(${mcqAttempts.time_spent_seconds}), 0)`,
    })
    .from(mcqAttempts)
    .where(eq(mcqAttempts.user_id, userId));

  const sessionRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(mcqSessions)
    .where(and(eq(mcqSessions.user_id, userId), sql`${mcqSessions.completed_at} is not null`));

  const r = rows[0];
  const total = Number(r?.total ?? 0);
  const correct = Number(r?.correct ?? 0);

  return {
    total_attempts: total,
    correct_count: correct,
    accuracy_pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    total_time_seconds: Number(r?.total_time ?? 0),
    total_sessions: Number(sessionRows[0]?.count ?? 0),
  };
}

export async function getStudentSubjectBreakdown(userId: string) {
  const rows = await db
    .select({
      subject_id: mcqQuestions.subject_id,
      name_th: mcqSubjects.name_th,
      icon: mcqSubjects.icon,
      total: sql<number>`count(*)`,
      correct: sql<number>`sum(case when ${mcqAttempts.is_correct} then 1 else 0 end)`,
    })
    .from(mcqAttempts)
    .innerJoin(mcqQuestions, eq(mcqAttempts.question_id, mcqQuestions.id))
    .leftJoin(mcqSubjects, eq(mcqQuestions.subject_id, mcqSubjects.id))
    .where(eq(mcqAttempts.user_id, userId))
    .groupBy(mcqQuestions.subject_id, mcqSubjects.name_th, mcqSubjects.icon);

  return rows.map((r) => {
    const total = Number(r.total);
    const correct = Number(r.correct);
    return {
      subject_id: r.subject_id ?? "",
      name_th: r.name_th ?? "ไม่ระบุ",
      icon: r.icon ?? "📝",
      total,
      correct,
      accuracy_pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }).sort((a, b) => a.accuracy_pct - b.accuracy_pct); // weakest first
}

export async function getStudentRecentSessions(userId: string, limit = 10) {
  const rows = await db
    .select({
      id: mcqSessions.id,
      mode: mcqSessions.mode,
      exam_type: mcqSessions.exam_type,
      total_questions: mcqSessions.total_questions,
      correct_count: mcqSessions.correct_count,
      completed_at: mcqSessions.completed_at,
      created_at: mcqSessions.created_at,
      subject_name_th: mcqSubjects.name_th,
      subject_icon: mcqSubjects.icon,
    })
    .from(mcqSessions)
    .leftJoin(mcqSubjects, eq(mcqSessions.subject_id, mcqSubjects.id))
    .where(and(eq(mcqSessions.user_id, userId), sql`${mcqSessions.completed_at} is not null`))
    .orderBy(desc(mcqSessions.created_at))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    mode: r.mode,
    exam_type: r.exam_type,
    total_questions: r.total_questions,
    correct_count: r.correct_count,
    pct: r.total_questions > 0 ? Math.round((r.correct_count / r.total_questions) * 100) : 0,
    completed_at: r.completed_at,
    created_at: r.created_at,
    subject_name_th: r.subject_name_th,
    subject_icon: r.subject_icon,
  }));
}

export async function getStudentStreak(userId: string): Promise<number> {
  const result = await db.execute(sql`
    WITH daily AS (
      SELECT DISTINCT DATE(created_at::timestamp) AS day
      FROM mcq_attempts
      WHERE user_id = ${userId}
    ),
    with_gaps AS (
      SELECT day, LAG(day, 1) OVER (ORDER BY day ASC) AS prev_day
      FROM daily
    ),
    grouped AS (
      SELECT day,
        SUM(CASE WHEN prev_day IS NULL OR day - prev_day > 1 THEN 1 ELSE 0 END)
          OVER (ORDER BY day ASC) AS grp
      FROM with_gaps
    ),
    group_stats AS (
      SELECT grp, COUNT(*) AS days, MAX(day) AS last_day
      FROM grouped
      GROUP BY grp
    )
    SELECT COALESCE(
      (SELECT days FROM group_stats
       WHERE last_day >= CURRENT_DATE - 1
       ORDER BY last_day DESC LIMIT 1),
      0
    ) AS streak
  `);
  const row = result.rows[0] as { streak: number } | undefined;
  return Number(row?.streak ?? 0);
}

export async function getStudentAccuracyTrend(userId: string) {
  const result = await db.execute(sql`
    SELECT
      DATE_TRUNC('week', created_at::timestamp)::date AS week_start,
      COUNT(*)::int AS total_attempts,
      SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::int AS correct_count,
      ROUND(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)::float AS accuracy
    FROM mcq_attempts
    WHERE user_id = ${userId}
    GROUP BY week_start
    ORDER BY week_start ASC
    LIMIT 12
  `);
  return (result.rows as Array<{
    week_start: string;
    total_attempts: number;
    correct_count: number;
    accuracy: number;
  }>).map((r) => ({
    week_start: String(r.week_start).slice(0, 10),
    total_attempts: Number(r.total_attempts),
    correct_count: Number(r.correct_count),
    accuracy: Number(r.accuracy),
  }));
}

export async function getStudentVsGlobalAvg(userId: string) {
  const result = await db.execute(sql`
    SELECT
      s.id AS subject_id,
      s.name_th AS subject_name_th,
      s.icon AS subject_icon,
      ROUND(
        SUM(CASE WHEN a.user_id = ${userId} AND a.is_correct THEN 1 ELSE 0 END) * 100.0 /
        NULLIF(SUM(CASE WHEN a.user_id = ${userId} THEN 1 ELSE 0 END), 0)
      )::int AS user_accuracy,
      ROUND(
        SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
      )::int AS global_accuracy
    FROM mcq_subjects s
    INNER JOIN mcq_questions q ON q.subject_id = s.id AND q.status = 'active'
    INNER JOIN mcq_attempts a ON a.question_id = q.id
    GROUP BY s.id, s.name_th, s.icon
    HAVING SUM(CASE WHEN a.user_id = ${userId} THEN 1 ELSE 0 END) > 0
    ORDER BY s.name_th
  `);
  return (result.rows as Array<{
    subject_id: string;
    subject_name_th: string;
    subject_icon: string;
    user_accuracy: number;
    global_accuracy: number;
  }>).map((r) => ({
    subject_id: String(r.subject_id),
    subject_name_th: String(r.subject_name_th),
    subject_icon: String(r.subject_icon),
    user_accuracy: Number(r.user_accuracy ?? 0),
    global_accuracy: Number(r.global_accuracy ?? 0),
    diff: Number(r.user_accuracy ?? 0) - Number(r.global_accuracy ?? 0),
  }));
}

export async function getStudentStatsForAdmin(userId: string) {
  const [overall, subjects, recentSessions, streak, trend, comparison] = await Promise.all([
    getStudentOverallStats(userId),
    getStudentSubjectBreakdown(userId),
    getStudentRecentSessions(userId),
    getStudentStreak(userId),
    getStudentAccuracyTrend(userId),
    getStudentVsGlobalAvg(userId),
  ]);

  return {
    overall,
    subjects,
    weakAreas: subjects.filter((s) => s.accuracy_pct < 60),
    recentSessions,
    streak,
    trend,
    comparison,
  };
}

// ---- mappers ----

function toMcqSubject(row: typeof mcqSubjects.$inferSelect): McqSubject {
  return {
    id: row.id,
    name: row.name,
    name_th: row.name_th,
    icon: row.icon,
    exam_type: row.exam_type,
    question_count: row.question_count,
    created_at: row.created_at,
  };
}

function toMcqQuestion(
  row: typeof mcqQuestions.$inferSelect,
  subject?: typeof mcqSubjects.$inferSelect
): McqQuestion {
  return {
    id: row.id,
    subject_id: row.subject_id ?? "",
    exam_type: row.exam_type,
    exam_source: row.exam_source,
    exam_day: row.exam_day as 1 | 2 | null,
    question_number: row.question_number,
    scenario: row.scenario,
    image_url: row.image_url,
    choices: row.choices as McqQuestion["choices"],
    correct_answer: row.correct_answer,
    explanation: row.explanation,
    detailed_explanation: row.detailed_explanation as McqQuestion["detailed_explanation"],
    difficulty: row.difficulty,
    is_ai_enhanced: row.is_ai_enhanced,
    ai_notes: row.ai_notes,
    status: row.status,
    created_at: row.created_at,
    mcq_subjects: subject ? toMcqSubject(subject) : undefined,
  };
}

function toQuestionSet(row: typeof questionSets.$inferSelect): QuestionSet {
  return {
    id: row.id,
    name: row.name,
    name_th: row.name_th,
    description: row.description,
    exam_type: row.exam_type as QuestionSet["exam_type"],
    exam_day: row.exam_day as 1 | 2 | null,
    question_count: row.question_count,
    price: row.price,
    original_price: row.original_price,
    is_bundle: row.is_bundle,
    is_active: row.is_active,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function toSetPurchase(row: typeof setPurchases.$inferSelect): SetPurchase {
  return {
    id: row.id,
    user_id: row.user_id ?? "",
    set_id: row.set_id ?? "",
    payment_order_id: row.payment_order_id,
    status: row.status,
    purchased_at: row.purchased_at,
    created_at: row.created_at,
  };
}
