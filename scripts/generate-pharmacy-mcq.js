#!/usr/bin/env node
/**
 * Generate Pharmacy MCQ Questions for PharmRoo
 *
 * สร้างข้อสอบ PLE style ต้นฉบับโดยใช้ Claude API แล้ว import เข้า Supabase
 *
 * Usage:
 *   node scripts/generate-pharmacy-mcq.js                    # generate ทุก subject
 *   node scripts/generate-pharmacy-mcq.js --subject pharma_law  # เฉพาะ subject
 *   node scripts/generate-pharmacy-mcq.js --count 30         # 30 ข้อต่อ subject
 *   node scripts/generate-pharmacy-mcq.js --dry-run          # generate แต่ไม่ import
 *   node scripts/generate-pharmacy-mcq.js --exam-type PLE-PC1 # สร้างสำหรับ PLE-PC1
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// ============================================================
// Config
// ============================================================

const PROJECT_ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(__dirname, "pharmacy-mcq-output");

const envPath = path.join(PROJECT_ROOT, ".env.local");
const env = {};
fs.readFileSync(envPath, "utf-8")
  .split("\n")
  .forEach((line) => {
    const [key, ...vals] = line.split("=");
    if (key && vals.length) env[key.trim()] = vals.join("=").trim();
  });

const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// Parse CLI args
const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const DRY_RUN = args.includes("--dry-run");
const SUBJECT_FILTER = getArg("--subject");
const COUNT_PER_SUBJECT = parseInt(getArg("--count") || "25");
const EXAM_TYPE_FILTER = getArg("--exam-type") || "PLE-CC1";

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ============================================================
// Subject definitions
// ============================================================
// exam_day: PLE-CC1 Day 1 = หมวด 1-3, Day 2 = หมวด 4-7

const SUBJECTS = [
  {
    name: "pharmacotherapy",
    name_th: "Pharmacotherapy",
    exam_day: 1,
    exam_type: "PLE-CC1",
    batch_size: 10, // ข้อต่อ API call
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
    exam_day: 1,
    exam_type: "PLE-CC1",
    batch_size: 10,
    topic_areas: [
      "Dosage forms: tablets, capsules, injections, topical, inhalation",
      "Pharmaceutical calculations: dilution, concentration, % w/v, % w/w",
      "Sterile preparations: IV admixture, aseptic technique, laminar flow",
      "Stability: การเก็บรักษายา, การเปลี่ยนแปลงทางเคมี/กายภาพ",
      "Excipients: binders, disintegrants, preservatives, surfactants",
      "Biopharmaceutics: dissolution, bioavailability, BCS classification",
      "Controlled release systems: matrix, reservoir, osmotic pump",
      "Packaging: primary/secondary, light protection, moisture",
      "GMP: cleanroom classification, validation, quality control",
      "Compounding: ointments, suspensions, solutions, suppositories",
    ],
  },
  {
    name: "pharma_chem",
    name_th: "เภสัชเคมี",
    exam_day: 1,
    exam_type: "PLE-CC1",
    batch_size: 10,
    topic_areas: [
      "โครงสร้างยาและกลไก: Beta-lactams, Fluoroquinolones, Statins",
      "Structure-Activity Relationship (SAR) และการปรับโครงสร้างยา",
      "Prodrug: การ activation, ตัวอย่างยา (Codeine, Enalapril, Levodopa)",
      "Stereochemistry: enantiomers, ผลทาง pharmacological",
      "กลไก enzyme inhibition: reversible, irreversible, competitive",
      "Receptor pharmacology: agonist, antagonist, partial agonist",
      "Drug metabolism: phase I (oxidation, reduction, hydrolysis), phase II",
      "Cytochrome P450: inducers, inhibitors, drug interactions",
      "Ionization: pKa, pH-partition theory, Henderson-Hasselbalch",
      "Functional groups: ester, amide, hydroxyl และผลต่อ properties",
    ],
  },
  {
    name: "pharma_analysis",
    name_th: "เภสัชวิเคราะห์",
    exam_day: 2,
    exam_type: "PLE-CC1",
    batch_size: 10,
    topic_areas: [
      "Titrimetry: acid-base, redox, complexometric titration",
      "UV-Vis spectrophotometry: Beer-Lambert law, การคำนวณ concentration",
      "HPLC: principle, components, validation parameters (LOD, LOQ, linearity)",
      "Thin Layer Chromatography (TLC): Rf value, identification",
      "USP/BP monographs: specifications, acceptance criteria",
      "Identification tests: color reactions, IR, MS interpretation",
      "Limit tests: heavy metals, arsenic, sulfated ash",
      "Dissolution testing: apparatus, acceptance criteria, f2",
      "Statistical analysis: mean, SD, RSD, confidence interval",
      "Validation: accuracy, precision, specificity, robustness",
    ],
  },
  {
    name: "pharmacokinetics",
    name_th: "เภสัชจลนศาสตร์",
    exam_day: 2,
    exam_type: "PLE-CC1",
    batch_size: 10,
    topic_areas: [
      "One-compartment model: oral/IV, AUC, Cmax, Tmax",
      "Two-compartment model: distribution phase, elimination phase",
      "Bioavailability: absolute F, relative F, bioequivalence",
      "Volume of distribution (Vd) และ clinical significance",
      "Clearance: renal clearance, hepatic clearance, total body clearance",
      "Half-life และการคำนวณ: t1/2 = 0.693/k",
      "Multiple dosing: steady state, accumulation factor, loading dose",
      "Renal dosing: Cockcroft-Gault, Cockroft equation, GFR",
      "Hepatic dosing: Child-Pugh score, drug selection",
      "TDM: Vancomycin, Aminoglycosides, Phenytoin, Digoxin",
    ],
  },
  {
    name: "pharma_law",
    name_th: "กฎหมายยา/จริยธรรม",
    exam_day: 2,
    exam_type: "PLE-CC1",
    batch_size: 10,
    topic_areas: [
      "พ.ร.บ.ยา พ.ศ. 2510: ประเภทยา, ใบอนุญาต, บทลงโทษ",
      "ยาควบคุมพิเศษ vs ยาอันตราย vs ยาสามัญ: การจำแนก, การจ่าย",
      "GPP (Good Pharmacy Practice): มาตรฐานร้านยา",
      "GMP (Good Manufacturing Practice): มาตรฐานการผลิต",
      "พ.ร.บ.วัตถุออกฤทธิ์ต่อจิตและประสาท: schedule I-IV",
      "พ.ร.บ.ยาเสพติดให้โทษ: ประเภท 1-5, การควบคุม",
      "จรรยาบรรณวิชาชีพเภสัชกรรม: สภาเภสัชกรรม, ใบประกอบวิชาชีพ",
      "พ.ร.บ.คุ้มครองผู้บริโภค: การโฆษณายา, ฉลากยา",
      "พ.ร.บ.อาหาร: ผลิตภัณฑ์เสริมอาหาร, nutraceuticals",
      "Pharmacovigilance: ADR reporting, WHO-UMC causality assessment",
    ],
  },
  {
    name: "herbal",
    name_th: "สมุนไพร/ผลิตภัณฑ์สุขภาพ",
    exam_day: 2,
    exam_type: "PLE-CC1",
    batch_size: 10,
    topic_areas: [
      "ยาสมุนไพรในบัญชียาหลักแห่งชาติ: ฟ้าทะลายโจร, ขมิ้นชัน, กระชาย",
      "Herb-drug interactions: St. John's Wort + SSRIs, Warfarin + herbs",
      "สารสำคัญในสมุนไพร: alkaloids, flavonoids, terpenes, glycosides",
      "มาตรฐานสมุนไพรไทย: Thai Herbal Pharmacopoeia",
      "ผลิตภัณฑ์เสริมอาหาร: Omega-3, Vitamin D, Probiotics, Glucosamine",
      "การควบคุมคุณภาพสมุนไพร: fingerprint chromatography, marker compounds",
      "ฤทธิ์ทางเภสัชวิทยา: anti-inflammatory, antimicrobial, antioxidant",
      "พืชสมุนไพรพิษ: สารพิษ, อาการ, การรักษา",
      "การใช้สมุนไพรในชุมชน: การแพทย์แผนไทย, ยาแผนโบราณ",
      "Clinical evidence สมุนไพรไทย: systematic review, RCT data",
    ],
  },
];

// ============================================================
// Helpers
// ============================================================

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callClaude(prompt, maxTokens = 8000) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: maxTokens,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        const err = await resp.text();
        console.error(`  API Error ${resp.status}: ${err.slice(0, 200)}`);
        if (resp.status === 529 || resp.status === 500) {
          await sleep(5000 * (attempt + 1));
          continue;
        }
        return null;
      }

      const result = await resp.json();
      return result.content[0].text;
    } catch (e) {
      if (attempt < 2) {
        console.error(`  Retry ${attempt + 1}: ${e.message}`);
        await sleep(3000 * (attempt + 1));
      } else {
        console.error(`  FAIL: ${e.message}`);
        return null;
      }
    }
  }
  return null;
}

function parseJSON(text) {
  if (!text) return null;
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    }
    // Extract JSON array
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ============================================================
// Prompt builder
// ============================================================

function buildGenerationPrompt(subject, topicAreas, batchSize, batchIndex) {
  // Rotate topics per batch so questions are diverse
  const topicCount = topicAreas.length;
  const selectedTopics = topicAreas
    .slice(
      (batchIndex * 3) % topicCount,
      ((batchIndex * 3) % topicCount) + 5
    )
    .concat(topicAreas.slice(0, 2)); // always include first 2 for core topics
  const uniqueTopics = [...new Set(selectedTopics)].slice(0, 5);

  return `สร้างข้อสอบ PLE (Pharmacy Licensing Examination) ไทย จำนวน ${batchSize} ข้อ
หมวดวิชา: ${subject.name_th}
หัวข้อที่ต้องครอบคลุมใน batch นี้:
${uniqueTopics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

มาตรฐานคุณภาพ (สำคัญ — ผู้ใช้รายงานว่าโจทย์เก่าสั้นและง่ายเกินไป):

[Difficulty distribution]
- 15% easy / 50% medium / 35% hard (ต้องระบุใน field)

[ความยาว + เนื้อหาตาม difficulty]
- easy (1-2 ประโยค): pure recall — MoA, drug class, common ADR, brand-generic, schedule
- medium (3-5 ประโยค): clinical decision — **บังคับมี patient context**: อายุ + เพศ + comorbidity ≥1 + current medications ≥1 + lab/vital signs ที่จำเป็นต่อการตอบ (เช่น SCr/eGFR, K, INR, BP, HR)
- hard (5-8 ประโยค): integration multi-step — ต้อง integrate ≥2 concepts (เช่น renal-adjusted dose + drug interaction + monitoring plan + counseling, หรือ ADR identification + alternative selection + dose conversion)

[Distractor quality — สำคัญที่สุด]
- ตัวเลือกผิดต้องเป็น "common trainee mistakes" ที่หน้าตาเหมือนคำตอบจริง:
  - ยาตระกูลเดียวกันแต่ผิด indication/contraindication
  - ขนาดยาที่พบใช้ผิดบ่อย (loading vs maintenance, mg vs mcg, q6h vs q8h)
  - Alternative drug ที่ contraindicated ใน comorbidity ที่โจทย์ระบุ
  - คำตอบที่ "ถูกบางส่วน" แต่ขาดประเด็นสำคัญที่โจทย์ทดสอบ
- ห้ามใช้ตัวเลือก absurd ที่ตัดออกได้ทันทีโดยไม่ต้องคิด
- ห้ามใช้ "ทุกข้อข้างต้นถูก/ผิด"

[Format]
- 5 ตัวเลือก (A-E) — ความยาวตัวเลือกใกล้เคียงกัน
- ภาษาไทย ยกเว้นชื่อยา (generic name) และคำศัพท์วิชาชีพ
- ชื่อยาและขนาดต้องถูกต้องตามจริง (อ้างอิง guideline ไทย/สากลล่าสุด)
- สำหรับ Pharmacotherapy: เน้น clinical decision making + patient-specific factors
- สำหรับยาคำนวณ: ให้ข้อมูลครบที่ต้องใช้ + ทดสอบ unit conversion / dosing weight

[ตัวอย่าง hard question คุณภาพดี — ใช้เป็น quality bar]
{
  "scenario": "ผู้ป่วยชาย 72 ปี น้ำหนัก 60 กก. ประวัติ HFrEF (EF 28%), AF, CKD stage 3b (eGFR 32 mL/min/1.73m²) ปัจจุบันรับยาประจำ: furosemide 40 mg OD, bisoprolol 5 mg OD, sacubitril/valsartan 49/51 mg BID, warfarin (INR 2.4 last week), spironolactone 25 mg OD ผู้ป่วยมาด้วย ankle edema เพิ่มขึ้น 1 สัปดาห์ BP 108/68, HR 62, K 4.6 mEq/L แพทย์ขอเริ่ม dapagliflozin 10 mg OD เพื่อลด HF hospitalization คำแนะนำที่สำคัญที่สุดของเภสัชกรคือข้อใด",
  "choices": [
    {"label": "A", "text": "เริ่ม dapagliflozin 10 mg OD ทันที ไม่ต้องปรับยาอื่น"},
    {"label": "B", "text": "ลด furosemide ลง 50% ชั่วคราว 1-2 สัปดาห์ + monitor BP/volume status เพราะ SGLT2i มี natriuretic effect ร่วมกัน"},
    {"label": "C", "text": "หยุด spironolactone เพื่อป้องกัน hyperkalemia จาก SGLT2i"},
    {"label": "D", "text": "ลด dapagliflozin เป็น 5 mg OD เพราะ eGFR <45"},
    {"label": "E", "text": "เปลี่ยน warfarin เป็น apixaban เพราะ interaction กับ SGLT2i"}
  ],
  "correct_answer": "B",
  "difficulty": "hard"
}

ตอบเป็น JSON array เท่านั้น ห้ามใส่ข้อความหรือ markdown อื่น:
[
  {
    "scenario": "โจทย์ข้อสอบ (รวมข้อมูลผู้ป่วยและบริบทตามมาตรฐาน difficulty ด้านบน)",
    "choices": [
      {"label": "A", "text": "ตัวเลือก A"},
      {"label": "B", "text": "ตัวเลือก B"},
      {"label": "C", "text": "ตัวเลือก C"},
      {"label": "D", "text": "ตัวเลือก D"},
      {"label": "E", "text": "ตัวเลือก E"}
    ],
    "correct_answer": "B",
    "difficulty": "medium",
    "topic_tag": "Drug interaction",
    "detailed_explanation": {
      "summary": "คำตอบที่ถูกต้อง: B. [ชื่อคำตอบ] — อธิบายสั้น 1 ประโยค",
      "reason": "อธิบายเหตุผล 2-4 ย่อหน้า: วิเคราะห์โจทย์ + หลักการทางวิทยาศาสตร์ + เหตุผลที่ถูก",
      "choices": [
        {"label": "A", "text": "ตัวเลือก A", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค (ระบุ misconception)"},
        {"label": "B", "text": "ตัวเลือก B", "is_correct": true, "explanation": "ทำไมถูก 1-2 ประโยค"},
        {"label": "C", "text": "ตัวเลือก C", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "D", "text": "ตัวเลือก D", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "E", "text": "ตัวเลือก E", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"}
      ],
      "key_takeaway": "จุดสำคัญที่ต้องจำ 1-2 ประโยค"
    }
  }
]`;
}

// ============================================================
// Main
// ============================================================

async function generateForSubject(subject, subjectId, targetCount) {
  const questions = [];
  const batchSize = subject.batch_size;
  const numBatches = Math.ceil(targetCount / batchSize);

  console.log(`\n${"─".repeat(55)}`);
  console.log(`  ${subject.name_th} (${subject.name})`);
  console.log(`  เป้าหมาย: ${targetCount} ข้อ, ${numBatches} batches × ${batchSize} ข้อ`);
  console.log(`${"─".repeat(55)}`);

  for (let b = 0; b < numBatches; b++) {
    const remaining = targetCount - questions.length;
    const thisBatch = Math.min(batchSize, remaining);
    process.stdout.write(`  Batch ${b + 1}/${numBatches} (${thisBatch} ข้อ)... `);

    const prompt = buildGenerationPrompt(subject, subject.topic_areas, thisBatch, b);
    const text = await callClaude(prompt, 8000);

    if (!text) {
      console.log("FAIL (no response)");
      await sleep(5000);
      continue;
    }

    const parsed = parseJSON(text);
    if (!parsed || !Array.isArray(parsed)) {
      console.log("FAIL (parse error)");
      // Save raw for debugging
      const debugPath = path.join(OUTPUT_DIR, `debug_${subject.name}_batch${b}.txt`);
      fs.writeFileSync(debugPath, text);
      await sleep(3000);
      continue;
    }

    // Validate and clean each question
    const valid = [];
    for (const q of parsed) {
      if (
        q.scenario &&
        Array.isArray(q.choices) &&
        q.choices.length === 5 &&
        q.correct_answer &&
        "ABCDE".includes(q.correct_answer) &&
        q.detailed_explanation
      ) {
        valid.push({
          subject_id: subjectId,
          exam_type: subject.exam_type,
          exam_day: subject.exam_day,
          scenario: q.scenario,
          choices: q.choices,
          correct_answer: q.correct_answer,
          difficulty: q.difficulty || "medium",
          detailed_explanation: q.detailed_explanation,
          is_ai_enhanced: true,
          ai_notes: `Generated: ${subject.topic_areas.slice(0, 2).join(", ")}`,
          status: "active",
        });
      }
    }

    questions.push(...valid);
    console.log(`OK (${valid.length}/${parsed.length} valid) — รวม ${questions.length}/${targetCount}`);

    // Rate limit: 2s between batches
    if (b < numBatches - 1) await sleep(2000);
  }

  return questions;
}

async function main() {
  console.log("=".repeat(55));
  console.log("  PharmRoo — Generate Pharmacy MCQ Questions");
  console.log("=".repeat(55));
  console.log(`  Model:    claude-sonnet-4-6`);
  console.log(`  Count:    ${COUNT_PER_SUBJECT} ข้อ/subject`);
  console.log(`  Exam:     ${EXAM_TYPE_FILTER}`);
  console.log(`  Dry run:  ${DRY_RUN}`);
  if (SUBJECT_FILTER) console.log(`  Subject:  ${SUBJECT_FILTER} only`);
  console.log("");

  // Step 1: Get subject IDs from Supabase
  console.log("[1] Loading subjects from Supabase...");
  const { data: dbSubjects, error: subErr } = await supabase
    .from("mcq_subjects")
    .select("id, name");

  if (subErr || !dbSubjects) {
    console.error("  ERROR: ไม่สามารถดึง subjects จาก Supabase ได้");
    console.error("  " + (subErr?.message || "no data"));
    console.error("  ตรวจสอบ .env.local และว่ารัน pharmroo_schema.sql แล้วหรือยัง");
    process.exit(1);
  }

  const subjectIdMap = {};
  for (const s of dbSubjects) subjectIdMap[s.name] = s.id;
  console.log(`  Found: ${dbSubjects.map((s) => s.name).join(", ")}`);

  // Step 2: Filter subjects
  const targets = SUBJECTS.filter((s) => {
    if (SUBJECT_FILTER && s.name !== SUBJECT_FILTER) return false;
    if (!subjectIdMap[s.name]) {
      console.warn(`  WARN: subject "${s.name}" ไม่พบใน DB — skip`);
      return false;
    }
    return true;
  });

  if (targets.length === 0) {
    console.error("  ไม่มี subject ที่จะ generate");
    process.exit(1);
  }

  // Step 3: Generate + Import
  let totalGenerated = 0;
  let totalImported = 0;

  for (const subject of targets) {
    const subjectId = subjectIdMap[subject.name];
    const questions = await generateForSubject(subject, subjectId, COUNT_PER_SUBJECT);

    if (questions.length === 0) {
      console.log(`  ไม่มีข้อสอบที่ valid สำหรับ ${subject.name}`);
      continue;
    }

    totalGenerated += questions.length;

    // Save to JSON backup
    const outputPath = path.join(
      OUTPUT_DIR,
      `${subject.name}_${Date.now()}.json`
    );
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`  Saved: ${path.basename(outputPath)}`);

    // Import to Supabase
    if (!DRY_RUN) {
      process.stdout.write(`  Importing ${questions.length} ข้อ... `);

      // Insert in chunks of 10 to avoid payload limits
      let imported = 0;
      for (let i = 0; i < questions.length; i += 10) {
        const chunk = questions.slice(i, i + 10);
        const { error } = await supabase.from("mcq_questions").insert(chunk);
        if (error) {
          console.log(`\n  DB ERROR at row ${i}: ${error.message}`);
          break;
        }
        imported += chunk.length;
      }

      totalImported += imported;
      console.log(`OK (${imported}/${questions.length})`);
    } else {
      console.log(`  [dry-run] จะ import ${questions.length} ข้อ`);
    }

    // Brief pause between subjects
    await sleep(1500);
  }

  // Summary
  console.log(`\n${"=".repeat(55)}`);
  console.log(`  SUMMARY`);
  console.log(`${"=".repeat(55)}`);
  console.log(`  Generated: ${totalGenerated} questions`);
  if (!DRY_RUN) console.log(`  Imported:  ${totalImported} questions`);
  console.log(`  Output:    ${OUTPUT_DIR}/`);
  console.log(`${"=".repeat(55)}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
