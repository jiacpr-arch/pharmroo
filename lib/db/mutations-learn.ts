import { db } from "./index";
import {
  learningUnits,
  learningLessons,
  lessonCards,
  lessonProgress,
  lessonQuestions,
} from "./schema";
import { eq, and, sql } from "drizzle-orm";
import type {
  LearningUnit,
  LearningLesson,
  LessonCard,
  CardType,
  ProgressStatus,
} from "../types-learn";

// ========================================
// Progress (learner-facing)
// ========================================

/** Upsert progress on the uq_user_lesson unique index. Used for resume + completion. */
export async function upsertLessonProgress(input: {
  user_id: string;
  lesson_id: string;
  status?: ProgressStatus;
  last_card_index?: number;
  score?: number;
  quiz_total?: number;
  completed_at?: string | null;
}): Promise<void> {
  const id = crypto.randomUUID();
  const insertValues: typeof lessonProgress.$inferInsert = {
    id,
    user_id: input.user_id,
    lesson_id: input.lesson_id,
    status: input.status ?? "in_progress",
    last_card_index: input.last_card_index ?? 0,
    score: input.score ?? 0,
    quiz_total: input.quiz_total ?? 0,
    completed_at: input.completed_at ?? null,
  };

  const setOnConflict: Record<string, unknown> = {};
  if (input.status !== undefined) setOnConflict.status = input.status;
  if (input.last_card_index !== undefined)
    setOnConflict.last_card_index = input.last_card_index;
  if (input.score !== undefined) setOnConflict.score = input.score;
  if (input.quiz_total !== undefined)
    setOnConflict.quiz_total = input.quiz_total;
  if (input.completed_at !== undefined)
    setOnConflict.completed_at = input.completed_at;

  await db
    .insert(lessonProgress)
    .values(insertValues)
    .onConflictDoUpdate({
      target: [lessonProgress.user_id, lessonProgress.lesson_id],
      set: setOnConflict,
    });
}

export async function completeLessonProgress(input: {
  user_id: string;
  lesson_id: string;
  score: number;
  quiz_total: number;
}): Promise<void> {
  const completedAt = new Date().toISOString();
  await upsertLessonProgress({
    user_id: input.user_id,
    lesson_id: input.lesson_id,
    status: "completed",
    score: input.score,
    quiz_total: input.quiz_total,
    completed_at: completedAt,
  });
}

// ========================================
// Student Q&A (auto-append, no approval)
// ========================================

/** Append a Q&A card to the end of a lesson and return it. */
export async function appendQaCard(input: {
  lesson_id: string;
  title_th: string;
  body_md: string;
}): Promise<LessonCard | null> {
  const maxRow = await db
    .select({ max: sql<number>`coalesce(max(${lessonCards.sort_order}), -1)` })
    .from(lessonCards)
    .where(eq(lessonCards.lesson_id, input.lesson_id))
    .then((rows) => rows[0]);
  const nextOrder = Number(maxRow?.max ?? -1) + 1;

  const id = crypto.randomUUID();
  await db.insert(lessonCards).values({
    id,
    lesson_id: input.lesson_id,
    card_type: "qa",
    title_th: input.title_th,
    body_md: input.body_md,
    sort_order: nextOrder,
    source: "student_qa",
  });
  const row = await db
    .select()
    .from(lessonCards)
    .where(eq(lessonCards.id, id))
    .then((rows) => rows[0]);
  return row ? toCard(row) : null;
}

export async function recordLessonQuestion(input: {
  user_id: string;
  lesson_id: string;
  question: string;
  answer_md?: string | null;
  card_id?: string | null;
  status: "answered" | "failed";
}): Promise<void> {
  const id = crypto.randomUUID();
  await db.insert(lessonQuestions).values({
    id,
    user_id: input.user_id,
    lesson_id: input.lesson_id,
    question: input.question,
    answer_md: input.answer_md ?? null,
    card_id: input.card_id ?? null,
    status: input.status,
  });
}

/** Count student questions a user has asked on a lesson within the last `withinSeconds`. */
export async function countRecentQuestions(
  userId: string,
  lessonId: string,
  withinSeconds: number
): Promise<number> {
  const since = sql`to_char(now() - (${withinSeconds} || ' seconds')::interval, 'YYYY-MM-DD HH24:MI:SS')`;
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(lessonQuestions)
    .where(
      and(
        eq(lessonQuestions.user_id, userId),
        eq(lessonQuestions.lesson_id, lessonId),
        sql`${lessonQuestions.created_at} >= ${since}`
      )
    )
    .then((rows) => rows[0]);
  return Number(row?.count ?? 0);
}

// ========================================
// Admin CRUD — Units
// ========================================

export async function createUnit(input: {
  subject_id?: string | null;
  title_th: string;
  description_th?: string | null;
  icon?: string;
  sort_order?: number;
  status?: "draft" | "published";
}): Promise<LearningUnit | null> {
  const id = crypto.randomUUID();
  await db.insert(learningUnits).values({
    id,
    subject_id: input.subject_id ?? null,
    title_th: input.title_th,
    description_th: input.description_th ?? null,
    icon: input.icon ?? "📘",
    sort_order: input.sort_order ?? 0,
    status: input.status ?? "draft",
  });
  const row = await db
    .select()
    .from(learningUnits)
    .where(eq(learningUnits.id, id))
    .then((rows) => rows[0]);
  return row ? toUnit(row) : null;
}

export async function updateUnit(
  id: string,
  updates: Partial<{
    subject_id: string | null;
    title_th: string;
    description_th: string | null;
    icon: string;
    sort_order: number;
    status: "draft" | "published";
  }>
): Promise<void> {
  await db.update(learningUnits).set(updates).where(eq(learningUnits.id, id));
}

export async function deleteUnit(id: string): Promise<void> {
  await db.delete(learningUnits).where(eq(learningUnits.id, id));
}

// ========================================
// Admin CRUD — Lessons
// ========================================

export async function createLesson(input: {
  unit_id: string;
  title_th: string;
  subtitle_th?: string | null;
  icon?: string;
  sort_order?: number;
  est_minutes?: number;
  xp_reward?: number;
  quiz_count?: number;
  status?: "draft" | "published";
}): Promise<LearningLesson | null> {
  const id = crypto.randomUUID();
  await db.insert(learningLessons).values({
    id,
    unit_id: input.unit_id,
    title_th: input.title_th,
    subtitle_th: input.subtitle_th ?? null,
    icon: input.icon ?? "⭐",
    sort_order: input.sort_order ?? 0,
    est_minutes: input.est_minutes ?? 5,
    xp_reward: input.xp_reward ?? 10,
    quiz_count: input.quiz_count ?? 3,
    status: input.status ?? "draft",
  });
  const row = await db
    .select()
    .from(learningLessons)
    .where(eq(learningLessons.id, id))
    .then((rows) => rows[0]);
  return row ? toLesson(row) : null;
}

export async function updateLesson(
  id: string,
  updates: Partial<{
    title_th: string;
    subtitle_th: string | null;
    icon: string;
    sort_order: number;
    est_minutes: number;
    xp_reward: number;
    quiz_count: number;
    status: "draft" | "published";
  }>
): Promise<void> {
  await db
    .update(learningLessons)
    .set(updates)
    .where(eq(learningLessons.id, id));
}

export async function setLessonQuizQuestions(
  id: string,
  quizQuestionIds: string[]
): Promise<void> {
  await db
    .update(learningLessons)
    .set({ quiz_question_ids: quizQuestionIds })
    .where(eq(learningLessons.id, id));
}

export async function deleteLesson(id: string): Promise<void> {
  await db.delete(learningLessons).where(eq(learningLessons.id, id));
}

// ========================================
// Admin CRUD — Cards
// ========================================

export async function createCard(input: {
  lesson_id: string;
  card_type?: CardType;
  title_th?: string | null;
  body_md?: string;
  image_url?: string | null;
  sort_order?: number;
}): Promise<LessonCard | null> {
  let order = input.sort_order;
  if (order === undefined) {
    const maxRow = await db
      .select({
        max: sql<number>`coalesce(max(${lessonCards.sort_order}), -1)`,
      })
      .from(lessonCards)
      .where(eq(lessonCards.lesson_id, input.lesson_id))
      .then((rows) => rows[0]);
    order = Number(maxRow?.max ?? -1) + 1;
  }
  const id = crypto.randomUUID();
  await db.insert(lessonCards).values({
    id,
    lesson_id: input.lesson_id,
    card_type: input.card_type ?? "concept",
    title_th: input.title_th ?? null,
    body_md: input.body_md ?? "",
    image_url: input.image_url ?? null,
    sort_order: order,
    source: "authored",
  });
  const row = await db
    .select()
    .from(lessonCards)
    .where(eq(lessonCards.id, id))
    .then((rows) => rows[0]);
  return row ? toCard(row) : null;
}

export async function updateCard(
  id: string,
  updates: Partial<{
    card_type: CardType;
    title_th: string | null;
    body_md: string;
    image_url: string | null;
    sort_order: number;
  }>
): Promise<void> {
  await db.update(lessonCards).set(updates).where(eq(lessonCards.id, id));
}

export async function deleteCard(id: string): Promise<void> {
  await db.delete(lessonCards).where(eq(lessonCards.id, id));
}

/** Persist a new card ordering (array of card ids in desired order). */
export async function reorderCards(
  lessonId: string,
  orderedIds: string[]
): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(lessonCards)
      .set({ sort_order: i })
      .where(
        and(
          eq(lessonCards.id, orderedIds[i]),
          eq(lessonCards.lesson_id, lessonId)
        )
      );
  }
}

// ---- mappers ----

function toUnit(row: typeof learningUnits.$inferSelect): LearningUnit {
  return {
    id: row.id,
    subject_id: row.subject_id,
    title_th: row.title_th,
    description_th: row.description_th,
    icon: row.icon,
    sort_order: row.sort_order,
    status: row.status,
    created_at: row.created_at,
  };
}

function toLesson(row: typeof learningLessons.$inferSelect): LearningLesson {
  return {
    id: row.id,
    unit_id: row.unit_id,
    title_th: row.title_th,
    subtitle_th: row.subtitle_th,
    icon: row.icon,
    sort_order: row.sort_order,
    est_minutes: row.est_minutes,
    xp_reward: row.xp_reward,
    quiz_question_ids: (Array.isArray(row.quiz_question_ids)
      ? row.quiz_question_ids
      : []) as string[],
    quiz_count: row.quiz_count,
    status: row.status,
    created_at: row.created_at,
  };
}

function toCard(row: typeof lessonCards.$inferSelect): LessonCard {
  return {
    id: row.id,
    lesson_id: row.lesson_id,
    card_type: row.card_type,
    title_th: row.title_th,
    body_md: row.body_md,
    image_url: row.image_url,
    sort_order: row.sort_order,
    source: row.source,
    created_at: row.created_at,
  };
}
