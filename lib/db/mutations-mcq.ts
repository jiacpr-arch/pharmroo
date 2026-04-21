import { db } from "./index";
import { mcqAttempts, mcqSessions } from "./schema";
import { eq, sql } from "drizzle-orm";
import type { McqAttempt, McqSession } from "../types-mcq";

export async function saveMcqAttempt(attempt: {
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_spent_seconds?: number | null;
  mode: "practice" | "mock";
  session_id?: string | null;
}): Promise<McqAttempt | null> {
  const id = crypto.randomUUID();
  await db.insert(mcqAttempts).values({
    id,
    user_id: attempt.user_id,
    question_id: attempt.question_id,
    selected_answer: attempt.selected_answer,
    is_correct: attempt.is_correct,
    time_spent_seconds: attempt.time_spent_seconds ?? null,
    mode: attempt.mode,
    session_id: attempt.session_id ?? null,
  });

  const row = await db.select().from(mcqAttempts).where(eq(mcqAttempts.id, id)).then(rows => rows[0]);
  if (!row) return null;
  return toMcqAttempt(row);
}

export async function createMcqSession(session: {
  user_id: string;
  mode: "practice" | "mock";
  exam_type: "PLE-PC" | "PLE-CC1" | "NLE";
  exam_day?: 1 | 2 | null;
  subject_id?: string | null;
  total_questions: number;
  time_limit_minutes?: number | null;
}): Promise<McqSession | null> {
  const id = crypto.randomUUID();
  await db.insert(mcqSessions).values({
    id,
    user_id: session.user_id,
    mode: session.mode,
    exam_type: session.exam_type,
    exam_day: session.exam_day ?? null,
    subject_id: session.subject_id ?? null,
    total_questions: session.total_questions,
    correct_count: 0,
    time_limit_minutes: session.time_limit_minutes ?? null,
  });

  const row = await db.select().from(mcqSessions).where(eq(mcqSessions.id, id)).then(rows => rows[0]);
  if (!row) return null;
  return toMcqSession(row);
}

export async function updateMcqSession(
  id: string,
  updates: { correct_count?: number; completed_at?: string }
): Promise<McqSession | null> {
  await db.update(mcqSessions).set(updates).where(eq(mcqSessions.id, id));
  const row = await db.select().from(mcqSessions).where(eq(mcqSessions.id, id)).then(rows => rows[0]);
  if (!row) return null;
  return toMcqSession(row);
}

// ---- mappers ----

function toMcqAttempt(row: typeof mcqAttempts.$inferSelect): McqAttempt {
  return {
    id: row.id,
    user_id: row.user_id ?? "",
    question_id: row.question_id ?? "",
    selected_answer: row.selected_answer,
    is_correct: row.is_correct,
    time_spent_seconds: row.time_spent_seconds,
    mode: row.mode,
    session_id: row.session_id,
    created_at: row.created_at,
  };
}

function toMcqSession(row: typeof mcqSessions.$inferSelect): McqSession {
  return {
    id: row.id,
    user_id: row.user_id ?? "",
    mode: row.mode,
    exam_type: row.exam_type,
    exam_day: row.exam_day as 1 | 2 | null,
    subject_id: row.subject_id,
    total_questions: row.total_questions,
    correct_count: row.correct_count,
    time_limit_minutes: row.time_limit_minutes,
    completed_at: row.completed_at,
    created_at: row.created_at,
  };
}
