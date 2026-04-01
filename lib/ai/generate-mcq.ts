import Anthropic from "@anthropic-ai/sdk";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubjectConfig {
  name: string;
  name_th: string;
  exam_type: "PLE-CC1" | "PLE-PC1";
  exam_day: 1 | 2;
  topic_areas: string[];
}

export interface GeneratedQuestion {
  subject_id: string;
  exam_type: string;
  exam_day: number;
  scenario: string;
  choices: { label: string; text: string }[];
  correct_answer: string;
  difficulty: "easy" | "medium" | "hard";
  detailed_explanation: {
    summary: string;
    reason: string;
    choices: { label: string; text: string; is_correct: boolean; explanation: string }[];
    key_takeaway: string;
    calculation_steps?: string[];
  };
  is_ai_enhanced: true;
  ai_notes: string;
  status: "active";
}

// ─── Subject definitions (คละหมวดวิชา) ────────────────────────────────────────

export const SUBJECT_CONFIGS: SubjectConfig[] = [
  {
    name: "pharmacotherapy",
    name_th: "Pharmacotherapy",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "การเลือกยาที่เหมาะสมสำหรับโรคเรื้อรัง (DM, HT, HF, AF, CKD)",
      "Drug interactions และ contraindications",
      "Adverse drug reactions (ADR) และการจัดการ",
      "การปรับขนาดยาในผู้ป่วย renal/hepatic impairment",
      "Antibiotic stewardship: การเลือก ATB ตามเชื้อและ sensitivity",
      "ยาในหญิงตั้งครรภ์และให้นมบุตร (FDA category, ยา avoid)",
      "ยาในผู้สูงอายุ: Beer's criteria, polypharmacy",
      "การรักษา acute conditions: ACS, stroke, sepsis, anaphylaxis",
      "Oncology: ยา chemo พื้นฐาน, supportive care, side effects",
      "Psychiatry: antidepressants, antipsychotics, mood stabilizers",
    ],
  },
  {
    name: "pharma_tech",
    name_th: "เทคโนโลยีเภสัชกรรม",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Dosage forms: tablets, capsules, injections, topical, inhalation",
      "Pharmaceutical calculations: dilution, concentration, % w/v, % w/w",
      "Sterile preparations: IV admixture, aseptic technique, laminar flow",
      "Stability: การเก็บรักษายา, การเปลี่ยนแปลงทางเคมี/กายภาพ",
      "Excipients: binders, disintegrants, preservatives, surfactants",
      "Biopharmaceutics: dissolution, bioavailability, BCS classification",
      "Controlled release systems: matrix, reservoir, osmotic pump",
      "GMP: cleanroom classification, validation, quality control",
      "Compounding: ointments, suspensions, solutions, suppositories",
    ],
  },
  {
    name: "pharma_chem",
    name_th: "เภสัชเคมี",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "โครงสร้างยาและกลไก: Beta-lactams, Fluoroquinolones, Statins",
      "Structure-Activity Relationship (SAR)",
      "Prodrug: การ activation, ตัวอย่างยา (Codeine, Enalapril, Levodopa)",
      "Stereochemistry: enantiomers, ผลทาง pharmacological",
      "Drug metabolism: phase I, phase II",
      "Cytochrome P450: inducers, inhibitors, drug interactions",
      "Ionization: pKa, pH-partition theory, Henderson-Hasselbalch",
    ],
  },
  {
    name: "pharma_analysis",
    name_th: "เภสัชวิเคราะห์",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "UV-Vis spectrophotometry: Beer-Lambert law, การคำนวณ concentration",
      "HPLC: principle, components, validation parameters (LOD, LOQ)",
      "Titrimetry: acid-base, redox, complexometric",
      "Dissolution testing: apparatus, acceptance criteria",
      "Validation: accuracy, precision, specificity, robustness",
      "Statistical analysis: mean, SD, RSD, confidence interval",
    ],
  },
  {
    name: "pharmacokinetics",
    name_th: "เภสัชจลนศาสตร์",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "One-compartment model: oral/IV, AUC, Cmax, Tmax",
      "Bioavailability: absolute F, relative F, bioequivalence",
      "Volume of distribution (Vd) และ clinical significance",
      "Clearance: renal, hepatic, total body clearance",
      "Half-life: t1/2 = 0.693/k และการประยุกต์ใช้",
      "Multiple dosing: steady state, loading dose",
      "TDM: Vancomycin, Aminoglycosides, Phenytoin, Digoxin",
    ],
  },
  {
    name: "pharma_law",
    name_th: "กฎหมายยา/จริยธรรม",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "พ.ร.บ.ยา พ.ศ. 2510: ประเภทยา, ใบอนุญาต, บทลงโทษ",
      "ยาควบคุมพิเศษ vs ยาอันตราย vs ยาสามัญ",
      "GPP/GMP มาตรฐาน",
      "พ.ร.บ.วัตถุออกฤทธิ์ต่อจิตและประสาท: schedule I-IV",
      "จรรยาบรรณวิชาชีพเภสัชกรรม",
      "Pharmacovigilance: ADR reporting",
    ],
  },
  {
    name: "herbal",
    name_th: "สมุนไพร/ผลิตภัณฑ์สุขภาพ",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "ยาสมุนไพรในบัญชียาหลักแห่งชาติ: ฟ้าทะลายโจร, ขมิ้นชัน, กระชาย",
      "Herb-drug interactions: St. John's Wort, Warfarin + herbs",
      "สารสำคัญในสมุนไพร: alkaloids, flavonoids, terpenes",
      "ผลิตภัณฑ์เสริมอาหาร: Omega-3, Vitamin D, Probiotics",
      "ฤทธิ์ทางเภสัชวิทยา: anti-inflammatory, antimicrobial",
    ],
  },
];

// ─── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(subject: SubjectConfig, count: number, batchIndex: number): string {
  // Rotate topics per batch for diversity
  const n = subject.topic_areas.length;
  const start = (batchIndex * 3) % n;
  const rotated = [
    ...subject.topic_areas.slice(start),
    ...subject.topic_areas.slice(0, start),
  ];
  const topics = rotated.slice(0, Math.min(4, n));

  return `สร้างข้อสอบ PLE (Pharmacy Licensing Examination) ไทย จำนวน ${count} ข้อ
หมวดวิชา: ${subject.name_th}
หัวข้อที่ครอบคลุม:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

กฎ:
- ข้อสอบ 5 ตัวเลือก (A-E) แบบ MCQ เหมือนข้อสอบ PLE จริง
- เขียนเป็นภาษาไทยทั้งหมด ยกเว้นชื่อยา/คำศัพท์ทางวิชาชีพ
- โจทย์ realistic: ชื่อยา generic ที่ถูกต้อง, ขนาดยาที่ถูกต้อง
- difficulty: 40% easy, 40% medium, 20% hard (ระบุใน field)
- ตัวเลือกที่ผิดต้องสมเหตุสมผล (plausible distractors)
- ครอบคลุมหลาย topic ไม่ซ้ำกันในชุดนี้

ตอบเป็น JSON array เท่านั้น ห้ามใส่ข้อความอื่น:
[
  {
    "scenario": "โจทย์ข้อสอบ",
    "choices": [
      {"label": "A", "text": "..."},
      {"label": "B", "text": "..."},
      {"label": "C", "text": "..."},
      {"label": "D", "text": "..."},
      {"label": "E", "text": "..."}
    ],
    "correct_answer": "B",
    "difficulty": "medium",
    "topic_tag": "Drug interaction",
    "detailed_explanation": {
      "summary": "คำตอบที่ถูกต้อง: B. [ชื่อคำตอบ] — อธิบายสั้น 1 ประโยค",
      "reason": "อธิบายเหตุผล 2-3 ย่อหน้า: วิเคราะห์โจทย์ + หลักการทางวิทยาศาสตร์",
      "choices": [
        {"label": "A", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "B", "text": "...", "is_correct": true, "explanation": "ทำไมถูก 1-2 ประโยค"},
        {"label": "C", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "D", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "E", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"}
      ],
      "key_takeaway": "จุดสำคัญที่ต้องจำ 1-2 ประโยค"
    }
  }
]`;
}

// ─── Parse ─────────────────────────────────────────────────────────────────────

function parseQuestions(text: string): unknown[] | null {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    }
    const match = cleaned.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ─── Main export ───────────────────────────────────────────────────────────────

/**
 * Generate MCQ questions for a subject using Claude Sonnet.
 */
export async function generateMcqBatch(
  subject: SubjectConfig,
  subjectId: string,
  count: number,
  batchIndex = 0
): Promise<GeneratedQuestion[]> {
  const client = new Anthropic();
  const prompt = buildPrompt(subject, count, batchIndex);

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const raw = parseQuestions(text);

  if (!raw || !Array.isArray(raw)) return [];

  const questions: GeneratedQuestion[] = [];
  for (const q of raw) {
    const item = q as Record<string, unknown>;
    if (
      typeof item.scenario === "string" &&
      Array.isArray(item.choices) &&
      (item.choices as unknown[]).length === 5 &&
      typeof item.correct_answer === "string" &&
      "ABCDE".includes(item.correct_answer as string) &&
      item.detailed_explanation
    ) {
      questions.push({
        subject_id: subjectId,
        exam_type: subject.exam_type,
        exam_day: subject.exam_day,
        scenario: item.scenario as string,
        choices: item.choices as { label: string; text: string }[],
        correct_answer: item.correct_answer as string,
        difficulty: (["easy", "medium", "hard"].includes(item.difficulty as string)
          ? item.difficulty
          : "medium") as "easy" | "medium" | "hard",
        detailed_explanation: item.detailed_explanation as GeneratedQuestion["detailed_explanation"],
        is_ai_enhanced: true,
        ai_notes: `daily-gen • ${subject.name_th} • batch${batchIndex}`,
        status: "active",
      });
    }
  }

  return questions;
}
