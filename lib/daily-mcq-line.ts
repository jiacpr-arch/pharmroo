import { db } from "@/lib/db";
import { dailyQuizAnswers, mcqAttempts, mcqQuestions, users } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import type { LineMessage } from "@/lib/line";
import { buildDailyMcqFlex, buildDailyMcqResultFlex } from "@/lib/line-flex-templates";

/** New LINE links get this many days before their daily quiz is "expected" — long enough not to guilt-trip someone who just joined mid-week. */
export const DAILY_GRACE_DAYS = 14;

type ExamCategory = "pharmacy" | "nursing" | null;
type McqExamType = "PLE-PC" | "PLE-CC1" | "NLE";

/** Today's date as YYYY-MM-DD in Asia/Bangkok — the day boundary the daily quiz and its postback answers are keyed on. */
export function bangkokToday(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

/** True while a user is still within their post-link grace period (new linkers aren't treated as having missed days before they joined). */
export function isWithinGrace(linkedAt: string | null | undefined, now: Date = new Date()): boolean {
  if (!linkedAt) return true;
  const linked = new Date(linkedAt);
  if (Number.isNaN(linked.getTime())) return true;
  return now.getTime() - linked.getTime() <= DAILY_GRACE_DAYS * 24 * 60 * 60 * 1000;
}

/** Small, deterministic (non-cryptographic) string hash — same input always picks the same question for a given day. */
function hashStringToInt(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(h, 31) + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function examTypesFor(category: ExamCategory): McqExamType[] {
  return category === "nursing" ? ["NLE"] : ["PLE-CC1", "PLE-PC"];
}

export interface DailyQuestion {
  id: string;
  scenario: string;
  choices: { label: string; text: string }[];
  correct_answer: string;
  explanation: string | null;
  difficulty: "easy" | "medium" | "hard";
}

/**
 * Picks the same active question for everyone in a category on a given
 * Bangkok day — deterministic from (examTypes, seed), so no state needs to
 * be persisted ahead of time and every recipient (and the postback grader)
 * derives the identical question independently.
 */
async function pickDeterministic(
  examTypes: McqExamType[],
  seed: string,
  difficulty?: "easy" | "medium" | "hard"
): Promise<DailyQuestion | null> {
  const candidates = await db
    .select({ id: mcqQuestions.id })
    .from(mcqQuestions)
    .where(
      and(
        eq(mcqQuestions.status, "active"),
        inArray(mcqQuestions.exam_type, examTypes),
        ...(difficulty ? [eq(mcqQuestions.difficulty, difficulty)] : [])
      )
    )
    .orderBy(mcqQuestions.id);

  if (candidates.length === 0) return null;

  const idx = hashStringToInt(seed) % candidates.length;
  const picked = await db
    .select()
    .from(mcqQuestions)
    .where(eq(mcqQuestions.id, candidates[idx].id))
    .then((rows) => rows[0]);

  if (!picked) return null;
  return {
    id: picked.id,
    scenario: picked.scenario,
    choices: picked.choices as { label: string; text: string }[],
    correct_answer: picked.correct_answer,
    explanation: picked.explanation,
    difficulty: picked.difficulty,
  };
}

/** Monday–Thursday: the regular daily question, medium difficulty by default. */
export async function loadDailyQuestion(category: ExamCategory, date: string): Promise<DailyQuestion | null> {
  return pickDeterministic(examTypesFor(category), `daily:${category ?? "pharmacy"}:${date}`);
}

/** Friday: a harder question to close out the week. */
export async function loadHardQuestion(category: ExamCategory, date: string): Promise<DailyQuestion | null> {
  return pickDeterministic(examTypesFor(category), `hard:${category ?? "pharmacy"}:${date}`, "hard");
}

export interface ActiveAudienceUser {
  id: string;
  name: string;
  line_user_id: string;
  exam_category: ExamCategory;
  line_linked_at: string | null;
}

/** LINE-linked users eligible for the daily push — anyone who's connected their account. */
export async function getActiveDailyAudience(): Promise<ActiveAudienceUser[]> {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      line_user_id: users.line_user_id,
      exam_category: users.exam_category,
      line_linked_at: users.line_linked_at,
    })
    .from(users)
    .where(eq(users.role, "user"));

  return rows.filter((r): r is ActiveAudienceUser => !!r.line_user_id);
}

export function toDailyMcqMessage(
  question: DailyQuestion,
  date: string,
  category: ExamCategory,
  isHard = false
): LineMessage {
  return buildDailyMcqFlex(question, date, category ?? "pharmacy", isHard);
}

/**
 * Grades a tap on the daily-quiz postback button. The question is always
 * re-derived server-side from (category, date) — the tapped answer label is
 * the only thing trusted from the client — so a forged postback can't claim
 * a different question's answer as correct.
 */
export async function handleDailyMcqPostback(params: {
  lineUserId: string;
  userId: string | null;
  date: string;
  category: ExamCategory;
  selectedLabel: string;
  isHard: boolean;
}): Promise<LineMessage> {
  const question = params.isHard
    ? await loadHardQuestion(params.category, params.date)
    : await loadDailyQuestion(params.category, params.date);

  if (!question) {
    return { type: "text", text: "ขออภัยครับ วันนี้ยังไม่มีข้อสอบประจำวันในระบบ" };
  }

  const isCorrect = question.correct_answer === params.selectedLabel;

  // Idempotent: a duplicate tap (double-tap, retried delivery) hits the
  // unique (line_user_id, quiz_date) index and is silently ignored.
  await db
    .insert(dailyQuizAnswers)
    .values({
      line_user_id: params.lineUserId,
      user_id: params.userId,
      question_id: question.id,
      quiz_date: params.date,
      selected_answer: params.selectedLabel,
      is_correct: isCorrect,
    })
    .onConflictDoNothing();

  if (params.userId) {
    await db.insert(mcqAttempts).values({
      user_id: params.userId,
      question_id: question.id,
      selected_answer: params.selectedLabel,
      is_correct: isCorrect,
      mode: "practice",
    });
  }

  return buildDailyMcqResultFlex(question, params.selectedLabel, isCorrect);
}

/** How many of the last 7 Bangkok days a LINE user answered the daily quiz. */
export async function getWeeklyAnswerCounts(lineUserId: string, sinceDate: string): Promise<number> {
  const rows = await db
    .select({ quiz_date: dailyQuizAnswers.quiz_date })
    .from(dailyQuizAnswers)
    .where(eq(dailyQuizAnswers.line_user_id, lineUserId));
  return rows.filter((r) => r.quiz_date >= sinceDate).length;
}
