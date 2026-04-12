import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * MCQ Explanation Chat — AI explains a question in more detail.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { question, userAnswer, correctAnswer, explanation, userQuestion } =
    (await request.json()) as {
      question: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
      userQuestion: string;
    };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey });

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

  return NextResponse.json({ answer: text });
}
