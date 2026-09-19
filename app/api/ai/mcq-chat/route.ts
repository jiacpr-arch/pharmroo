import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import {
  countRecentAiChats,
  recordAiChatQuestion,
} from "@/lib/db/mutations-ai-chat";

export const runtime = "nodejs";

const MAX_FIELD_LEN = 2000;
const MAX_QUESTION_LEN = 500;
const RATE_LIMIT_PER_HOUR = 10;

/**
 * MCQ Explanation Chat — AI explains a question in more detail.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = (await request.json()) as {
    question?: string;
    userAnswer?: string;
    correctAnswer?: string;
    explanation?: string;
    userQuestion?: string;
    questionId?: string;
  };

  const question = typeof body.question === "string" ? body.question : "";
  const userAnswer = typeof body.userAnswer === "string" ? body.userAnswer : "";
  const correctAnswer =
    typeof body.correctAnswer === "string" ? body.correctAnswer : "";
  const explanation =
    typeof body.explanation === "string" ? body.explanation : "";
  const userQuestion =
    typeof body.userQuestion === "string" ? body.userQuestion.trim() : "";

  if (!userQuestion) {
    return NextResponse.json(
      { error: "Missing userQuestion" },
      { status: 400 }
    );
  }
  if (
    userQuestion.length > MAX_QUESTION_LEN ||
    question.length > MAX_FIELD_LEN ||
    userAnswer.length > MAX_FIELD_LEN ||
    correctAnswer.length > MAX_FIELD_LEN ||
    explanation.length > MAX_FIELD_LEN
  ) {
    return NextResponse.json(
      { error: `คำถามยาวเกินไป (จำกัด ${MAX_QUESTION_LEN} ตัวอักษร)` },
      { status: 400 }
    );
  }

  // Rate-limit to keep API spend and spam under control.
  const recent = await countRecentAiChats(userId, 3600);
  if (recent >= RATE_LIMIT_PER_HOUR) {
    return NextResponse.json(
      { error: "ถามครบจำนวนต่อชั่วโมงแล้ว ลองใหม่ภายหลัง" },
      { status: 429 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system:
        "คุณเป็นอาจารย์เภสัชกรรม ตอบคำถามเกี่ยวกับข้อสอบอย่างละเอียด เข้าใจง่าย เป็นภาษาไทย",
      messages: [
        {
          role: "user",
          content: `ข้อสอบ: ${question}
คำตอบของผู้ใช้: ${userAnswer}
คำตอบที่ถูก: ${correctAnswer}
คำอธิบาย: ${explanation}

คำถามเพิ่มเติม: ${userQuestion}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    await recordAiChatQuestion({
      user_id: userId,
      question_id: body.questionId ?? null,
      user_question: userQuestion,
      status: "answered",
    });

    return NextResponse.json({ answer: text });
  } catch (err) {
    await recordAiChatQuestion({
      user_id: userId,
      question_id: body.questionId ?? null,
      user_question: userQuestion,
      status: "failed",
    });
    console.error("ai/mcq-chat failed:", err);
    return NextResponse.json(
      { error: "ตอบคำถามไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 502 }
    );
  }
}
