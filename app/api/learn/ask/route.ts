import { auth } from "@/lib/auth";
import { getLessonForPlayer } from "@/lib/db/queries-learn";
import {
  appendQaCard,
  recordLessonQuestion,
  countRecentQuestions,
} from "@/lib/db/mutations-learn";
import { answerStudentQuestion } from "@/lib/anthropic-learn";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_QUESTION_LEN = 500;
const RATE_LIMIT_PER_HOUR = 10;

/**
 * Student Q&A: answers a question about a lesson via the Anthropic API and
 * auto-appends the answer as a "qa" card on the lesson (no approval step), so
 * the lesson content grows richer over time.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const lessonId: string | undefined = body.lesson_id;
  const question: string =
    typeof body.question === "string" ? body.question.trim() : "";

  if (!lessonId || !question) {
    return NextResponse.json(
      { error: "Missing lesson_id or question" },
      { status: 400 }
    );
  }
  if (question.length > MAX_QUESTION_LEN) {
    return NextResponse.json(
      { error: `คำถามยาวเกินไป (จำกัด ${MAX_QUESTION_LEN} ตัวอักษร)` },
      { status: 400 }
    );
  }

  // Rate-limit to keep API spend and spam under control.
  const recent = await countRecentQuestions(userId, lessonId, 3600);
  if (recent >= RATE_LIMIT_PER_HOUR) {
    return NextResponse.json(
      { error: "ถามครบจำนวนต่อชั่วโมงแล้ว ลองใหม่ภายหลัง" },
      { status: 429 }
    );
  }

  const data = await getLessonForPlayer(lessonId, userId);
  if (!data || data.lesson.status !== "published") {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  try {
    const answer = await answerStudentQuestion(
      {
        subjectName: data.unit?.title_th ?? null,
        lessonTitle: data.lesson.title_th,
        cards: data.cards.map((c) => ({
          card_type: c.card_type,
          title_th: c.title_th,
          body_md: c.body_md,
        })),
      },
      question
    );

    const card = await appendQaCard({
      lesson_id: lessonId,
      title_th: question,
      body_md: answer,
    });

    await recordLessonQuestion({
      user_id: userId,
      lesson_id: lessonId,
      question,
      answer_md: answer,
      card_id: card?.id ?? null,
      status: "answered",
    });

    return NextResponse.json({ answer_md: answer, card_id: card?.id ?? null });
  } catch (err) {
    await recordLessonQuestion({
      user_id: userId,
      lesson_id: lessonId,
      question,
      status: "failed",
    });
    console.error("learn/ask failed:", err);
    return NextResponse.json(
      { error: "ตอบคำถามไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 502 }
    );
  }
}
