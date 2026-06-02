import { db } from "./index";
import {
  learningUnits,
  learningLessons,
  lessonCards,
  lessonProgress,
  mcqSubjects,
} from "./schema";
import { eq, and, inArray, asc } from "drizzle-orm";
import { getMcqQuestions } from "./queries-mcq";
import type { ExamCategory } from "./queries-mcq";
import type {
  PathUnitSection,
  PathLessonNode,
  LessonForPlayer,
  LearningLesson,
  LearningUnit,
  LessonCard,
  ProgressStatus,
  UnitWithLessons,
} from "../types-learn";

const PHARMACY_SUBJECT_EXAM_TYPES = ["PLE-PC", "PLE-CC1", "both"] as const;
const NURSING_SUBJECT_EXAM_TYPES = ["NLE"] as const;

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

/**
 * The learning path: published units (filtered to the user's exam category)
 * with their published lessons, each annotated with the user's progress and a
 * computed `locked` flag. A lesson is unlocked when it's the first lesson of
 * its unit or the previous lesson (by sort_order) is completed.
 */
export async function getLearningPath(
  userId: string | null,
  examCategory?: ExamCategory
): Promise<PathUnitSection[]> {
  const allowed =
    examCategory === "pharmacy"
      ? [...PHARMACY_SUBJECT_EXAM_TYPES]
      : examCategory === "nursing"
        ? [...NURSING_SUBJECT_EXAM_TYPES]
        : null;

  // Units (optionally filtered by subject exam_type)
  const unitRows = allowed
    ? await db
        .select({ u: learningUnits })
        .from(learningUnits)
        .leftJoin(mcqSubjects, eq(learningUnits.subject_id, mcqSubjects.id))
        .where(
          and(
            eq(learningUnits.status, "published"),
            inArray(mcqSubjects.exam_type, allowed)
          )
        )
        .orderBy(asc(learningUnits.sort_order))
        .then((rows) => rows.map((r) => r.u))
    : await db
        .select()
        .from(learningUnits)
        .where(eq(learningUnits.status, "published"))
        .orderBy(asc(learningUnits.sort_order));

  if (unitRows.length === 0) return [];

  const unitIds = unitRows.map((u) => u.id);

  const lessonRows = await db
    .select()
    .from(learningLessons)
    .where(
      and(
        inArray(learningLessons.unit_id, unitIds),
        eq(learningLessons.status, "published")
      )
    )
    .orderBy(asc(learningLessons.sort_order));

  // Progress map for this user
  const progressByLesson = new Map<
    string,
    { status: ProgressStatus; score: number; quiz_total: number }
  >();
  if (userId && lessonRows.length > 0) {
    const progressRows = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.user_id, userId),
          inArray(
            lessonProgress.lesson_id,
            lessonRows.map((l) => l.id)
          )
        )
      );
    for (const p of progressRows) {
      progressByLesson.set(p.lesson_id, {
        status: p.status,
        score: p.score,
        quiz_total: p.quiz_total,
      });
    }
  }

  const lessonsByUnit = new Map<string, typeof lessonRows>();
  for (const l of lessonRows) {
    const arr = lessonsByUnit.get(l.unit_id) ?? [];
    arr.push(l);
    lessonsByUnit.set(l.unit_id, arr);
  }

  return unitRows.map((u) => {
    const lessons = (lessonsByUnit.get(u.id) ?? []).sort(
      (a, b) => a.sort_order - b.sort_order
    );
    let prevCompleted = true; // first lesson is always unlocked
    const nodes: PathLessonNode[] = lessons.map((l) => {
      const prog = progressByLesson.get(l.id);
      const status: PathLessonNode["progress_status"] =
        prog?.status ?? "not_started";
      const locked = !prevCompleted;
      prevCompleted = status === "completed";
      return {
        id: l.id,
        title_th: l.title_th,
        subtitle_th: l.subtitle_th,
        icon: l.icon,
        est_minutes: l.est_minutes,
        xp_reward: l.xp_reward,
        sort_order: l.sort_order,
        progress_status: status,
        score: prog?.score ?? 0,
        quiz_total: prog?.quiz_total ?? 0,
        locked,
      };
    });
    return {
      id: u.id,
      subject_id: u.subject_id,
      title_th: u.title_th,
      description_th: u.description_th,
      icon: u.icon,
      sort_order: u.sort_order,
      lessons: nodes,
    };
  });
}

/** Whether a given lesson is unlocked for the user (first lesson or prev completed). */
export async function isLessonUnlocked(
  lessonId: string,
  userId: string
): Promise<boolean> {
  const lesson = await db
    .select()
    .from(learningLessons)
    .where(eq(learningLessons.id, lessonId))
    .then((rows) => rows[0]);
  if (!lesson) return false;

  const siblings = await db
    .select({ id: learningLessons.id, sort_order: learningLessons.sort_order })
    .from(learningLessons)
    .where(
      and(
        eq(learningLessons.unit_id, lesson.unit_id),
        eq(learningLessons.status, "published")
      )
    )
    .orderBy(asc(learningLessons.sort_order));

  const idx = siblings.findIndex((s) => s.id === lessonId);
  if (idx <= 0) return true; // first lesson (or not found among published → allow)

  const prev = siblings[idx - 1];
  const prog = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.user_id, userId),
        eq(lessonProgress.lesson_id, prev.id)
      )
    )
    .then((rows) => rows[0]);
  return prog?.status === "completed";
}

/** Full lesson payload for the player: lesson + unit + ordered cards + resolved quiz questions. */
export async function getLessonForPlayer(
  lessonId: string,
  userId: string | null
): Promise<LessonForPlayer | null> {
  const lessonRow = await db
    .select()
    .from(learningLessons)
    .where(eq(learningLessons.id, lessonId))
    .then((rows) => rows[0]);
  if (!lessonRow) return null;

  const lesson = toLesson(lessonRow);

  const unitRow = await db
    .select()
    .from(learningUnits)
    .where(eq(learningUnits.id, lesson.unit_id))
    .then((rows) => rows[0]);
  const unit = unitRow ? toUnit(unitRow) : null;

  const cardRows = await db
    .select()
    .from(lessonCards)
    .where(eq(lessonCards.lesson_id, lessonId))
    .orderBy(asc(lessonCards.sort_order));
  const cards = cardRows.map(toCard);

  // Resolve quiz questions: explicit ids first, else fall back to subject pull.
  let questions: LessonForPlayer["questions"] = [];
  if (lesson.quiz_question_ids.length > 0) {
    const all = await getMcqQuestions({ limit: 300 });
    const byId = new Map(all.map((q) => [q.id, q]));
    questions = lesson.quiz_question_ids
      .map((id) => byId.get(id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
    // If the broad fetch missed some (large bank), fetch the remaining directly.
    if (questions.length < lesson.quiz_question_ids.length && unit?.subject_id) {
      const bySubject = await getMcqQuestions({
        subjectId: unit.subject_id,
        limit: 300,
      });
      const byId2 = new Map(bySubject.map((q) => [q.id, q]));
      questions = lesson.quiz_question_ids
        .map((id) => byId.get(id) ?? byId2.get(id))
        .filter((q): q is NonNullable<typeof q> => Boolean(q));
    }
  } else if (unit?.subject_id && lesson.quiz_count > 0) {
    questions = await getMcqQuestions({
      subjectId: unit.subject_id,
      limit: lesson.quiz_count,
      randomize: true,
    });
  }

  let progress: LessonForPlayer["progress"] = null;
  if (userId) {
    const p = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.user_id, userId),
          eq(lessonProgress.lesson_id, lessonId)
        )
      )
      .then((rows) => rows[0]);
    if (p) {
      progress = { status: p.status, last_card_index: p.last_card_index };
    }
  }

  return { lesson, unit, cards, questions, progress };
}

/** The user's most recent in-progress lesson, for the "continue learning" dashboard card. */
export async function getContinueLesson(userId: string): Promise<{
  lesson_id: string;
  title_th: string;
  icon: string;
} | null> {
  const row = await db
    .select({
      lesson_id: learningLessons.id,
      title_th: learningLessons.title_th,
      icon: learningLessons.icon,
      created_at: lessonProgress.created_at,
    })
    .from(lessonProgress)
    .innerJoin(
      learningLessons,
      eq(lessonProgress.lesson_id, learningLessons.id)
    )
    .where(
      and(
        eq(lessonProgress.user_id, userId),
        eq(lessonProgress.status, "in_progress"),
        eq(learningLessons.status, "published")
      )
    )
    .orderBy(asc(lessonProgress.created_at))
    .then((rows) => rows[rows.length - 1]);
  if (!row) return null;
  return { lesson_id: row.lesson_id, title_th: row.title_th, icon: row.icon };
}

// ========================================
// Admin getters
// ========================================

export async function getAllUnitsWithLessons(): Promise<UnitWithLessons[]> {
  const unitRows = await db
    .select({ u: learningUnits, subject_name_th: mcqSubjects.name_th })
    .from(learningUnits)
    .leftJoin(mcqSubjects, eq(learningUnits.subject_id, mcqSubjects.id))
    .orderBy(asc(learningUnits.sort_order));

  const lessonRows = await db
    .select()
    .from(learningLessons)
    .orderBy(asc(learningLessons.sort_order));

  const lessonsByUnit = new Map<string, LearningLesson[]>();
  for (const l of lessonRows) {
    const arr = lessonsByUnit.get(l.unit_id) ?? [];
    arr.push(toLesson(l));
    lessonsByUnit.set(l.unit_id, arr);
  }

  return unitRows.map((r) => ({
    ...toUnit(r.u),
    subject_name_th: r.subject_name_th,
    lessons: lessonsByUnit.get(r.u.id) ?? [],
  }));
}

export async function getUnitWithLessons(
  unitId: string
): Promise<UnitWithLessons | null> {
  const r = await db
    .select({ u: learningUnits, subject_name_th: mcqSubjects.name_th })
    .from(learningUnits)
    .leftJoin(mcqSubjects, eq(learningUnits.subject_id, mcqSubjects.id))
    .where(eq(learningUnits.id, unitId))
    .then((rows) => rows[0]);
  if (!r) return null;

  const lessons = await db
    .select()
    .from(learningLessons)
    .where(eq(learningLessons.unit_id, unitId))
    .orderBy(asc(learningLessons.sort_order));

  return {
    ...toUnit(r.u),
    subject_name_th: r.subject_name_th,
    lessons: lessons.map(toLesson),
  };
}

export async function getLessonCards(lessonId: string): Promise<LessonCard[]> {
  const rows = await db
    .select()
    .from(lessonCards)
    .where(eq(lessonCards.lesson_id, lessonId))
    .orderBy(asc(lessonCards.sort_order));
  return rows.map(toCard);
}

export async function getLessonById(
  lessonId: string
): Promise<LearningLesson | null> {
  const row = await db
    .select()
    .from(learningLessons)
    .where(eq(learningLessons.id, lessonId))
    .then((rows) => rows[0]);
  return row ? toLesson(row) : null;
}
