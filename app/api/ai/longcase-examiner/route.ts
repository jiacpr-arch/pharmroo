import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { longCases, longCaseSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * AI Examiner + Scorer — for Long Case examiner phase and final scoring.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { sessionId, action, message } = (await request.json()) as {
    sessionId: string;
    action: "question" | "score";
    message?: string;
  };

  const lcSession = await db
    .select()
    .from(longCaseSessions)
    .where(eq(longCaseSessions.id, sessionId))
    .then((rows) => rows[0]);

  if (!lcSession || lcSession.user_id !== session.user.id) {
    return NextResponse.json({ error: "session not found" }, { status: 404 });
  }

  const longCase = await db
    .select()
    .from(longCases)
    .where(eq(longCases.id, lcSession.long_case_id))
    .then((rows) => rows[0]);

  if (!longCase) {
    return NextResponse.json({ error: "case not found" }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey });

  if (action === "question" && message) {
    // Examiner asks follow-up questions
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1000,
      system: `คุณเป็นกรรมการสอบเภสัชกรรมคลินิก ถามคำถามติดตามผลจากคำตอบของผู้สอบ
ถามเชิงลึกเพื่อทดสอบความเข้าใจ ไม่ใช่แค่ท่องจำ`,
      messages: [
        {
          role: "user",
          content: `ข้อมูลเคส: ${longCase.correct_diagnosis}
แผนการจัดการ: ${longCase.management_plan}
คำตอบผู้สอบ: ${message}

ถามคำถามติดตาม 1 คำถาม:`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  }

  if (action === "score") {
    // Final scoring with Claude Opus for highest accuracy
    const rubric = longCase.scoring_rubric as Record<string, unknown>;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514", // Use Sonnet for prototype; Opus for production
      max_tokens: 3000,
      system: `คุณเป็นกรรมการสอบเภสัชกรรมคลินิก ให้คะแนนตาม rubric อย่างเป็นธรรม`,
      messages: [
        {
          role: "user",
          content: `เกณฑ์การให้คะแนน:
${JSON.stringify(rubric, null, 2)}

ข้อมูลเคส:
- การวินิจฉัยที่ถูก: ${longCase.correct_diagnosis}
- DDx ที่ยอมรับ: ${JSON.stringify(longCase.accepted_ddx)}
- แผนการจัดการ: ${longCase.management_plan}

ผลงานผู้สอบ:
- ประวัติที่ซัก: ${JSON.stringify(lcSession.history_messages)}
- PE ที่เลือก: ${JSON.stringify(lcSession.selected_pe)}
- Lab ที่สั่ง: ${JSON.stringify(lcSession.selected_labs)}
- การวินิจฉัย: ${JSON.stringify(lcSession.diagnosis_submission)}
- คำถามกรรมการ: ${JSON.stringify(lcSession.examiner_messages)}

ให้คะแนนเป็น JSON:
{
  "history_taking": { "score": 0, "max": 25, "feedback": "..." },
  "pe_selection": { "score": 0, "max": 20, "feedback": "..." },
  "lab_interpretation": { "score": 0, "max": 15, "feedback": "..." },
  "diagnosis": { "score": 0, "max": 20, "feedback": "..." },
  "management": { "score": 0, "max": 20, "feedback": "..." },
  "total": 0,
  "overall_feedback": "..."
}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const scores = JSON.parse(jsonMatch[0]);
      const totalScore = scores.total ?? 0;

      await db
        .update(longCaseSessions)
        .set({
          scores,
          total_score: totalScore,
          phase: "completed",
          completed_at: new Date().toISOString(),
        })
        .where(eq(longCaseSessions.id, sessionId));

      return NextResponse.json({ scores });
    }

    return NextResponse.json(
      { error: "Failed to parse scores" },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "invalid action" }, { status: 400 });
}
