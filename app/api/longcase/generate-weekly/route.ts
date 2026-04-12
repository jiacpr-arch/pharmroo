import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { longCases } from "@/lib/db/schema";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 300;

const SPECIALTIES = [
  "Internal Medicine (อายุรกรรม)",
  "Cardiology (หัวใจ)",
  "Infectious Disease (โรคติดเชื้อ)",
  "Oncology (มะเร็ง)",
  "Nephrology (ไต)",
  "Endocrinology (ต่อมไร้ท่อ)",
];

function isAuthorized(request: NextRequest): boolean {
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron: Generate 1 Long Case (OSCE-style) weekly.
 * Uses Claude Sonnet to create patient case with full details.
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
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const specialty = SPECIALTIES[weekNumber % SPECIALTIES.length];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 12000,
      messages: [
        {
          role: "user",
          content: `คุณเป็นอาจารย์เภสัชกรรมผู้เชี่ยวชาญ สาขา ${specialty}

สร้าง Long Case (OSCE-style) สำหรับฝึกเภสัชกรเชิงคลินิก

ตอบเป็น JSON:
{
  "title": "ชื่อเคส (ภาษาไทย)",
  "patient_info": {
    "name": "ชื่อคนไข้สมมุติ",
    "age": 55,
    "gender": "ชาย",
    "chief_complaint": "อาการนำ",
    "brief_history": "ประวัติโดยย่อ"
  },
  "history_script": {
    "present_illness": "ประวัติการเจ็บป่วยปัจจุบัน (ตอบเมื่อถูกถาม)",
    "past_medical": "โรคประจำตัว ยาที่ใช้",
    "medications": ["ยา 1", "ยา 2"],
    "allergies": "ประวัติแพ้ยา",
    "social": "สูบบุหรี่ ดื่มเหล้า อาชีพ",
    "family": "ประวัติครอบครัว"
  },
  "pe_findings": {
    "vital_signs": { "BP": "140/90", "HR": 88, "RR": 20, "Temp": 37.2 },
    "general": "ลักษณะทั่วไป",
    "specific": { "system_name": "findings" }
  },
  "lab_results": {
    "CBC": { "WBC": 12000, "Hb": 10.5, "Plt": 200000 },
    "chemistry": { "BUN": 25, "Cr": 1.8, "K": 5.2 },
    "other": {}
  },
  "correct_diagnosis": "การวินิจฉัยที่ถูกต้อง",
  "accepted_ddx": ["DDx 1", "DDx 2", "DDx 3"],
  "management_plan": "แผนการจัดการ/ยาที่ควรใช้",
  "scoring_rubric": {
    "history_taking": { "max": 25, "criteria": ["ถามประวัติครบ", "ถามยาที่ใช้"] },
    "pe_selection": { "max": 20, "criteria": ["เลือก PE ที่เหมาะสม"] },
    "lab_interpretation": { "max": 15, "criteria": ["แปลผล lab ถูกต้อง"] },
    "diagnosis": { "max": 20, "criteria": ["วินิจฉัยถูกต้อง", "DDx สมเหตุผล"] },
    "management": { "max": 20, "criteria": ["เลือกยาเหมาะสม", "ปรับขนาดยา"] }
  }
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

    const data = JSON.parse(jsonMatch[0]);
    const caseId = randomUUID();

    await db.insert(longCases).values({
      id: caseId,
      title: data.title,
      specialty,
      difficulty: "medium",
      patient_info: data.patient_info,
      history_script: data.history_script,
      pe_findings: data.pe_findings,
      lab_results: data.lab_results,
      correct_diagnosis: data.correct_diagnosis,
      accepted_ddx: data.accepted_ddx,
      management_plan: data.management_plan,
      scoring_rubric: data.scoring_rubric,
      status: "published",
    });

    return NextResponse.json({
      ok: true,
      caseId,
      title: data.title,
      specialty,
    });
  } catch (err) {
    console.error("[longcase-generate] error:", err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
