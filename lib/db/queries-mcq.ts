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

export async function getStudentStatsForAdmin(userId: string) {
  const [overall, subjects, recentSessions] = await Promise.all([
    getStudentOverallStats(userId),
    getStudentSubjectBreakdown(userId),
    getStudentRecentSessions(userId),
  ]);

  return {
    overall,
    subjects,
    weakAreas: subjects.filter((s) => s.accuracy_pct < 60),
    recentSessions,
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
