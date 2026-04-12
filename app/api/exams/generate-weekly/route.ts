import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { exams, examParts } from "@/lib/db/schema";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 300;

const PHARMACY_CATEGORIES = [
  "Pharmacotherapy",
  "Pharmaceutical Chemistry",
  "Pharmacokinetics",
  "Pharmaceutical Technology",
  "Pharmaceutical Analysis",
  "Pharmacy Law & Ethics",
];

function isAuthorized(request: NextRequest): boolean {
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron: Generate 1 MEQ (Progressive Case) 2x/week.
 * Mon + Thu → 6-part pharmacy case using Claude Sonnet.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey });

  // Pick category by rotation
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const category =
    PHARMACY_CATEGORIES[dayOfYear % PHARMACY_CATEGORIES.length];

  const difficulties = ["easy", "medium", "hard"];
  const difficulty = difficulties[dayOfYear % 3];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `คุณเป็นอาจารย์เภสัชกรรมผู้เชี่ยวชาญ สาขา ${category}

สร้างข้อสอบ MEQ แบบ Progressive Case 6 ตอน สำหรับสอบใบประกอบวิชาชีพเภสัชกรรม
ระดับ: ${difficulty}

แต่ละตอนประกอบด้วย:
- scenario: สถานการณ์ (ค่อยๆ เปิดเผยข้อมูลเพิ่ม)
- question: คำถาม
- answer: คำตอบที่สมบูรณ์
- key_points: ประเด็นสำคัญ (array of strings)
- time_minutes: เวลาที่แนะนำ (นาที)

โครงสร้าง 6 ตอน:
1. Initial assessment (ประเมินเบื้องต้น)
2. Lab/Drug interpretation (แปลผล lab/ยา)
3. Differential diagnosis (วินิจฉัยแยกโรค)
4. Definitive diagnosis & Drug selection (การเลือกยา)
5. Management & Monitoring (การจัดการและติดตาม)
6. Long-term care & Patient counseling (การดูแลระยะยาว)

ตอบเป็น JSON เท่านั้น:
{
  "title": "ชื่อเคส",
  "parts": [
    { "scenario": "...", "question": "...", "answer": "...", "key_points": ["..."], "time_minutes": 10 }
  ]
}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const data = JSON.parse(jsonMatch[0]) as {
      title: string;
      parts: Array<{
        scenario: string;
        question: string;
        answer: string;
        key_points: string[];
        time_minutes: number;
      }>;
    };

    // Insert exam
    const examId = randomUUID();
    await db.insert(exams).values({
      id: examId,
      title: data.title,
      category,
      difficulty: difficulty as "easy" | "medium" | "hard",
      status: "published",
      is_free: false,
      publish_date: new Date().toISOString().slice(0, 10),
    });

    // Insert parts
    for (let i = 0; i < data.parts.length; i++) {
      const part = data.parts[i];
      await db.insert(examParts).values({
        id: randomUUID(),
        exam_id: examId,
        part_number: i + 1,
        scenario: part.scenario,
        question: part.question,
        answer: part.answer,
        key_points: part.key_points,
        time_minutes: part.time_minutes,
      });
    }

    return NextResponse.json({
      ok: true,
      examId,
      title: data.title,
      category,
      difficulty,
      parts: data.parts.length,
    });
  } catch (err) {
    console.error("[meq-generate] error:", err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
