import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { longCases, longCaseSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * AI Patient Simulation — for Long Case history taking phase.
 * The AI acts as a patient, answering questions based on the case script.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { sessionId, message } = (await request.json()) as {
    sessionId: string;
    message: string;
  };

  // Get session and case data
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
  const historyScript = longCase.history_script as Record<string, unknown>;
  const patientInfo = longCase.patient_info as Record<string, unknown>;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 1000,
    system: `คุณเป็นคนไข้ที่มาพบเภสัชกร ตอบคำถามตามข้อมูลด้านล่างเท่านั้น
ถ้าถูกถามสิ่งที่ไม่มีในข้อมูล ให้ตอบว่า "ไม่แน่ใจ" หรือ "จำไม่ได้"
อย่าบอกข้อมูลที่ไม่ได้ถูกถาม ตอบสั้นๆ เหมือนคนไข้จริง

ข้อมูลคนไข้:
${JSON.stringify(patientInfo, null, 2)}

สคริปต์ประวัติ:
${JSON.stringify(historyScript, null, 2)}`,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Save to session history
  const history = (lcSession.history_messages as unknown[]) ?? [];
  history.push({ role: "user", content: message });
  history.push({ role: "patient", content: text });

  await db
    .update(longCaseSessions)
    .set({ history_messages: history })
    .where(eq(longCaseSessions.id, sessionId));

  return NextResponse.json({ reply: text });
}
