import { db } from "./index";
import { mcqSubjects, mcqQuestions, questionSets, setPurchases, setQuestions } from "./schema";
import { eq, and, inArray } from "drizzle-orm";
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
    .get();

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
    .get();

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
