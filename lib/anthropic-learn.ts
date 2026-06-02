import Anthropic from "@anthropic-ai/sdk";
import type { LessonCard } from "./types-learn";

export interface LessonContext {
  subjectName: string | null;
  lessonTitle: string;
  cards: Pick<LessonCard, "card_type" | "title_th" | "body_md">[];
}

/**
 * Answer a student's question about a lesson using Claude.
 * Used by /api/learn/ask — the answer is then auto-appended to the lesson as a
 * "qa" card so the content grows richer over time.
 */
export async function answerStudentQuestion(
  context: LessonContext,
  question: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }

  const anthropic = new Anthropic({ apiKey });

  const lessonText = context.cards
    .map((c) => {
      const heading = c.title_th ? `[${c.title_th}]\n` : "";
      return `${heading}${c.body_md}`;
    })
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1200,
    system: `คุณเป็นอาจารย์เภสัชกรรมที่ติวนักศึกษาเตรียมสอบใบประกอบวิชาชีพเภสัชกรรม (PLE)
ตอบคำถามของนักศึกษาให้กระชับ ถูกต้องตามหลักวิชาการ และเข้าใจง่าย เป็นภาษาไทย
- อ้างอิงเนื้อหาบทเรียนที่ให้มาเป็นหลัก และเสริมความรู้ที่จำเป็นต่อการสอบ
- ถ้าคำถามอยู่นอกขอบเขตวิชาเภสัชกรรม/บทเรียน ให้ตอบสุภาพว่าอยู่นอกขอบเขตและแนะนำให้ถามเรื่องที่เกี่ยวข้อง
- ใช้ markdown ได้ (หัวข้อ **ตัวหนา**, รายการ -) แต่ให้สั้น ไม่เกิน ~250 คำ
- ห้ามแต่งข้อมูลที่ไม่แน่ใจ ถ้าไม่แน่ใจให้บอกตรงๆ`,
    messages: [
      {
        role: "user",
        content: `วิชา: ${context.subjectName ?? "เภสัชกรรม"}
บทเรียน: ${context.lessonTitle}

เนื้อหาบทเรียน:
${lessonText || "(ไม่มีเนื้อหาการ์ด)"}

คำถามจากนักศึกษา: ${question}`,
      },
    ],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";
  if (!text.trim()) {
    throw new Error("Empty answer from model");
  }
  return text.trim();
}
