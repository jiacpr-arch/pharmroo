#!/usr/bin/env node
/**
 * Generate NLE (Nursing Licensing Exam) MCQ Questions for PharmRoo
 *
 * Usage:
 *   node scripts/generate-nursing-mcq.js                      # all subjects, 25 ข้อ/subject
 *   node scripts/generate-nursing-mcq.js --count 10          # 10 ข้อ/subject
 *   node scripts/generate-nursing-mcq.js --subject NursingAdult
 *   node scripts/generate-nursing-mcq.js --dry-run           # generate แต่ไม่ insert
 *   node scripts/generate-nursing-mcq.js --status active     # insert เป็น active ทันที (ข้าม review)
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// ── Config ────────────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(__dirname, "nursing-mcq-output");

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

const args = process.argv.slice(2);
const getArg = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const DRY_RUN = args.includes("--dry-run");
const SUBJECT_FILTER = getArg("--subject");
const COUNT_PER_SUBJECT = parseInt(getArg("--count") || "25");
const INSERT_STATUS = getArg("--status") === "active" ? "active" : "review";

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── NLE Subject definitions ───────────────────────────────────────────────────
// name must match exactly the `name` column in mcq_subjects table

const SUBJECTS = [
  {
    name: "NursingAdult",
    name_th: "การพยาบาลผู้ใหญ่",
    batch_size: 5,
    topic_areas: [
      "Respiratory nursing: COPD, asthma, pneumonia, mechanical ventilation, oxygen therapy",
      "Cardiovascular nursing: ACS, heart failure, shock, dysrhythmias, cardiac monitoring",
      "Neurological nursing: stroke, seizure, increased ICP, spinal cord injury, GCS assessment",
      "Perioperative nursing: preoperative assessment, intraoperative care, PACU, wound care",
      "Oncology nursing: chemotherapy side effects, mucositis, neutropenia, palliative care",
      "Fluid/electrolyte imbalances: hyponatremia, hyperkalemia, metabolic acidosis, IV therapy",
      "Infection and sepsis: sepsis bundle, wound infection, central line care, isolation precautions",
      "Endocrine nursing: DKA, HHS, thyroid crisis, steroid management",
    ],
  },
  {
    name: "NursingGeriatric",
    name_th: "การพยาบาลผู้สูงอายุ",
    batch_size: 5,
    topic_areas: [
      "Comprehensive geriatric assessment (CGA): ADL, IADL, cognitive screening (MMSE, MoCA)",
      "Delirium vs dementia vs depression: differential diagnosis, nursing management",
      "Falls prevention: risk assessment (Morse Fall Scale), environment modification, hip fracture",
      "Polypharmacy and Beer's criteria: drug review, deprescribing, medication safety",
      "Functional decline: immobility complications, pressure injury prevention (Braden Scale)",
      "Nutritional assessment in elderly: malnutrition screening (MNA), dysphagia management",
      "Elder abuse and neglect: types, recognition, mandatory reporting",
      "Palliative and end-of-life care: symptom management, family support, DNR",
    ],
  },
  {
    name: "NursingPediatric",
    name_th: "การพยาบาลเด็กและวัยรุ่น",
    batch_size: 5,
    topic_areas: [
      "Growth and development: Erikson psychosocial stages, Piaget cognitive stages, developmental milestones",
      "Pediatric vital signs and assessment: age-appropriate norms, pediatric pain assessment (FLACC, Wong-Baker)",
      "Common childhood respiratory illnesses: croup, bronchiolitis, asthma exacerbation, RSV",
      "Fever management and febrile seizure: antipyretic use, seizure precautions, parental education",
      "Congenital heart disease: cyanotic (ToF, TGA) vs acyanotic (VSD, ASD, PDA) defects",
      "Pediatric fluid therapy: weight-based calculations, dehydration assessment, oral rehydration",
      "Childhood immunization schedule: vaccines, contraindications, cold chain",
      "Adolescent health: eating disorders, substance use, reproductive health, confidentiality",
    ],
  },
  {
    name: "NursingMaternal",
    name_th: "การพยาบาลมารดาและทารก",
    batch_size: 5,
    topic_areas: [
      "Antepartum complications: preeclampsia/eclampsia (magnesium sulfate), gestational diabetes, placenta previa, PROM",
      "APGAR scoring: 5 components, interpretation, resuscitation decision",
      "Newborn assessment: physical examination, reflexes (Moro, rooting, Babinski), gestational age",
      "Breastfeeding: latch technique, common problems (engorgement, mastitis), benefits",
      "Postpartum complications: PPH (uterine atony, retained placenta), infection (endometritis), DVT",
      "Newborn hyperbilirubinemia: risk factors, phototherapy, exchange transfusion criteria",
      "Neonatal care: thermoregulation, hypoglycemia, congenital anomaly identification",
      "Postpartum blues vs depression vs psychosis: screening (Edinburgh scale), management",
    ],
  },
  {
    name: "NursingMidwifery",
    name_th: "การผดุงครรภ์",
    batch_size: 5,
    topic_areas: [
      "Stages of labor: latent, active, transition, second stage, third stage — duration and characteristics",
      "Fetal heart rate monitoring: baseline, variability, accelerations, decelerations (early/late/variable)",
      "Labor complications: prolonged labor, fetal distress, umbilical cord prolapse, shoulder dystocia",
      "Normal vaginal delivery: cardinal movements, delivery technique, Apgar at 1 and 5 minutes",
      "Episiotomy: indications, types (mediolateral vs median), repair, postpartum care",
      "Placenta delivery: management of third stage, signs of placental separation, controlled cord traction",
      "Induction and augmentation of labor: oxytocin protocol, Bishop score, contraindications",
      "Postpartum uterine assessment: involution, lochia characteristics (rubra, serosa, alba), fundal height",
    ],
  },
  {
    name: "NursingPsych",
    name_th: "การพยาบาลสุขภาพจิตและจิตเวชศาสตร์",
    batch_size: 5,
    topic_areas: [
      "Therapeutic communication: techniques (reflection, clarification, silence), non-therapeutic responses, boundaries",
      "Mental status examination (MSE): appearance, behavior, affect, thought process, insight",
      "Schizophrenia: positive/negative symptoms, antipsychotic side effects (EPS, tardive dyskinesia, NMS)",
      "Mood disorders: major depressive disorder, bipolar I/II — nursing interventions, medication monitoring",
      "Anxiety disorders: panic disorder, PTSD, OCD — nursing management, relaxation techniques",
      "Suicide risk assessment: SAD PERSONS scale, safety planning, environmental safety",
      "Substance use disorders: alcohol withdrawal (CIWA), opioid withdrawal, relapse prevention",
      "Personality disorders: borderline, antisocial — limit setting, therapeutic milieu management",
    ],
  },
  {
    name: "NursingCommunity",
    name_th: "การพยาบาลอนามัยชุมชนและการรักษาพยาบาลขั้นต้น",
    batch_size: 5,
    topic_areas: [
      "Levels of prevention: primary (health promotion, immunization), secondary (screening), tertiary (rehabilitation)",
      "Epidemiology basics: incidence vs prevalence, attack rate, herd immunity, outbreak investigation",
      "Non-communicable disease (NCD) programs: DM/HT screening, lifestyle modification counseling",
      "Communicable disease control: TB (DOTS), HIV/AIDS, dengue, COVID-19 — isolation and reporting",
      "Maternal and child health (MCH): ANC schedule, growth monitoring, EPI program",
      "Primary care nursing: SOAP documentation, triage, wound care, basic procedures",
      "Environmental and occupational health: hazard identification, workplace health promotion",
      "Disaster nursing and mass casualty: START triage, field hospital setup, mental health support",
    ],
  },
  {
    name: "NursingLawEthics",
    name_th: "กฎหมายและจรรยาบรรณวิชาชีพ",
    batch_size: 5,
    topic_areas: [
      "Nursing Council Act (พ.ร.บ.วิชาชีพการพยาบาลและการผดุงครรภ์): licensing, scope of practice, renewal",
      "Patient rights: informed consent elements, capacity assessment, right to refuse treatment",
      "Confidentiality and privacy: exceptions (mandatory reporting, public health threat), medical records",
      "Bioethical principles: autonomy, beneficence, nonmaleficence, justice — clinical application",
      "Professional misconduct: types, disciplinary process, grounds for license suspension/revocation",
      "Nursing documentation: legal requirements, incident reports, chain of custody",
      "End-of-life care: DNR orders, advance directives, withdrawing vs withholding treatment",
      "Delegation and supervision: principles, accountability, unlicensed assistive personnel (UAP)",
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function buildPrompt(subject, batchSize, batchIndex) {
  const n = subject.topic_areas.length;
  const start = (batchIndex * 3) % n;
  const rotated = [
    ...subject.topic_areas.slice(start),
    ...subject.topic_areas.slice(0, start),
  ];
  const topics = rotated.slice(0, Math.min(4, n));

  return `สร้างข้อสอบ NLE (ข้อสอบขึ้นทะเบียนสภาการพยาบาล) ไทย จำนวน ${batchSize} ข้อ
หมวดวิชา: ${subject.name_th}
หัวข้อที่ครอบคลุม:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

มาตรฐานคุณภาพ (สำคัญ — ต้องการโจทย์เชิงลึก ไม่สั้น ไม่ง่ายเกิน):

[Difficulty distribution]
- 15% easy / 50% medium / 35% hard (ต้องระบุใน field)

[ความยาว + เนื้อหาตาม difficulty]
- easy (1-2 ประโยค): pure recall — concept, definition, normal value, classification
- medium (3-5 ประโยค): clinical/nursing decision — **บังคับมี patient context**: อายุ + เพศ + diagnosis/condition + assessment findings (vital signs, physical exam, lab) + intervention หรือ priority ที่ต้องตัดสินใจ
- hard (5-8 ประโยค): integration multi-step — ต้อง integrate ≥2 concepts (assessment + prioritization + intervention + rationale + patient education, หรือ ethics + legal + therapeutic communication)

[Distractor quality — สำคัญที่สุด]
- ตัวเลือกผิดต้องเป็น "common nursing student errors" ที่หน้าตาเหมือนคำตอบจริง:
  - Intervention ที่เหมาะสมในเวลาอื่นแต่ไม่ใช่ priority ตอนนี้
  - คำตอบที่ "ถูกบางส่วน" แต่ขาด safety priority
  - Action ที่อยู่นอก scope ของพยาบาล
  - คำสั่งที่ขัดกับ standard of care/ethics
- ห้ามใช้ตัวเลือก absurd ที่ตัดออกได้ทันที
- ห้ามใช้ "ทุกข้อข้างต้นถูก/ผิด"

[Format]
- 4 ตัวเลือก (A-D) — ความยาวตัวเลือกใกล้เคียงกัน
- ภาษาไทย ยกเว้นคำศัพท์ทางพยาบาล/การแพทย์ที่นิยมใช้ภาษาอังกฤษ
- ใช้ guideline/best practice ไทยและสากลล่าสุด
- ครอบคลุมหลาย topic ใน batch ไม่ซ้ำ

[ตัวอย่าง hard question คุณภาพดี — ใช้เป็น quality bar]
{
  "scenario": "ผู้ป่วยหญิง 65 ปี admit ด้วย CHF exacerbation ได้รับ furosemide 40 mg IV BID มา 3 วัน วันนี้พยาบาลประเมินพบ: BP 95/60 mmHg (จากเดิม 130/80), HR 110 ครั้ง/นาที, RR 22, SpO2 92% room air, urine output 800 mL/8 hr, K 3.0 mEq/L, Cr 1.8 (baseline 1.0), ผู้ป่วยบ่นเวียนศีรษะเมื่อลุกนั่ง การพยาบาลที่เป็น priority สูงสุดคือข้อใด",
  "choices": [
    {"label": "A", "text": "ให้ KCl supplement ทาง IV ตามแผนการรักษา"},
    {"label": "B", "text": "หยุด furosemide ชั่วคราว แจ้งแพทย์รายงาน hypotension + AKI + hypokalemia + over-diuresis เพื่อทบทวนแผนการรักษาทันที"},
    {"label": "C", "text": "จัดท่านอนศีรษะสูง ให้ออกซิเจน mask 4 LPM"},
    {"label": "D", "text": "เพิ่ม IV NSS 1000 mL ใน 4 ชั่วโมงเพื่อแก้ภาวะ hypotension"}
  ],
  "correct_answer": "B",
  "difficulty": "hard"
}

ตอบเป็น JSON array เท่านั้น ห้ามใส่ข้อความหรือ markdown อื่น:
[
  {
    "scenario": "โจทย์ข้อสอบ clinical scenario",
    "choices": [
      {"label": "A", "text": "..."},
      {"label": "B", "text": "..."},
      {"label": "C", "text": "..."},
      {"label": "D", "text": "..."}
    ],
    "correct_answer": "B",
    "difficulty": "medium",
    "topic_tag": "หัวข้อย่อย",
    "detailed_explanation": {
      "summary": "คำตอบที่ถูกต้อง: B. [ชื่อคำตอบ] — อธิบายสั้น 1 ประโยค",
      "reason": "อธิบายเหตุผล 2-3 ย่อหน้า: วิเคราะห์โจทย์ + หลักการพยาบาล",
      "choices": [
        {"label": "A", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค (ระบุ misconception)"},
        {"label": "B", "text": "...", "is_correct": true,  "explanation": "ทำไมถูก 1-2 ประโยค"},
        {"label": "C", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "D", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"}
      ],
      "key_takeaway": "จุดสำคัญที่ต้องจำ 1-2 ประโยค"
    }
  }
]`;
}

// ── Generate per subject ──────────────────────────────────────────────────────

async function generateForSubject(subject, subjectId, targetCount) {
  const questions = [];
  const batchSize = subject.batch_size;
  const numBatches = Math.ceil(targetCount / batchSize);

  console.log(`\n${"─".repeat(58)}`);
  console.log(`  ${subject.name_th} (${subject.name})`);
  console.log(`  เป้าหมาย: ${targetCount} ข้อ, ${numBatches} batches × ${batchSize}`);
  console.log(`${"─".repeat(58)}`);

  for (let b = 0; b < numBatches; b++) {
    const remaining = targetCount - questions.length;
    const thisBatch = Math.min(batchSize, remaining);
    process.stdout.write(`  Batch ${b + 1}/${numBatches} (${thisBatch} ข้อ)... `);

    const prompt = buildPrompt(subject, thisBatch, b);
    const text = await callClaude(prompt, 8000);

    if (!text) {
      console.log("FAIL (no response)");
      await sleep(5000);
      continue;
    }

    const parsed = parseJSON(text);
    if (!parsed || !Array.isArray(parsed)) {
      console.log("FAIL (parse error)");
      const debugPath = path.join(OUTPUT_DIR, `debug_${subject.name}_b${b}.txt`);
      fs.writeFileSync(debugPath, text);
      await sleep(3000);
      continue;
    }

    const valid = [];
    for (const q of parsed) {
      if (
        q.scenario &&
        Array.isArray(q.choices) &&
        q.choices.length === 4 &&
        q.correct_answer &&
        "ABCD".includes(q.correct_answer) &&
        q.detailed_explanation
      ) {
        valid.push({
          subject_id: subjectId,
          exam_type: "NLE",
          scenario: q.scenario,
          choices: q.choices,
          correct_answer: q.correct_answer,
          difficulty: q.difficulty || "medium",
          detailed_explanation: q.detailed_explanation,
          is_ai_enhanced: true,
          ai_notes: `NLE backfill: ${subject.topic_areas.slice(0, 2).join(", ")}`,
          status: INSERT_STATUS,
        });
      }
    }

    questions.push(...valid);
    console.log(`OK (${valid.length}/${parsed.length} valid) — รวม ${questions.length}/${targetCount}`);

    if (b < numBatches - 1) await sleep(2000);
  }

  return questions;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(58));
  console.log("  PharmRoo — Generate NLE Nursing MCQ");
  console.log("=".repeat(58));
  console.log(`  Model:   claude-sonnet-4-6`);
  console.log(`  Count:   ${COUNT_PER_SUBJECT} ข้อ/subject`);
  console.log(`  Status:  ${INSERT_STATUS} (${INSERT_STATUS === "review" ? "ต้อง QA ก่อน activate" : "active ทันที"})`);
  console.log(`  Dry run: ${DRY_RUN}`);
  if (SUBJECT_FILTER) console.log(`  Subject: ${SUBJECT_FILTER} only`);
  console.log("");

  console.log("[1] Loading subjects from Supabase...");
  const { data: dbSubjects, error: subErr } = await supabase
    .from("mcq_subjects")
    .select("id, name")
    .eq("exam_type", "NLE");

  if (subErr || !dbSubjects) {
    console.error("  ERROR: ไม่สามารถดึง NLE subjects ได้");
    console.error("  " + (subErr?.message || "no data"));
    process.exit(1);
  }

  const subjectIdMap = {};
  for (const s of dbSubjects) subjectIdMap[s.name] = s.id;
  console.log(`  Found: ${dbSubjects.map((s) => s.name).join(", ")}`);

  const targets = SUBJECTS.filter((s) => {
    if (SUBJECT_FILTER && s.name !== SUBJECT_FILTER) return false;
    if (!subjectIdMap[s.name]) {
      console.warn(`  WARN: "${s.name}" ไม่พบใน DB — skip`);
      return false;
    }
    return true;
  });

  if (targets.length === 0) {
    console.error("  ไม่มี subject ที่จะ generate");
    process.exit(1);
  }

  let totalGenerated = 0;
  let totalImported = 0;

  for (const subject of targets) {
    const subjectId = subjectIdMap[subject.name];
    const questions = await generateForSubject(subject, subjectId, COUNT_PER_SUBJECT);

    if (questions.length === 0) {
      console.log(`  ไม่มีข้อสอบ valid สำหรับ ${subject.name}`);
      continue;
    }

    totalGenerated += questions.length;

    const outputPath = path.join(OUTPUT_DIR, `${subject.name}_${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`  Saved: ${path.basename(outputPath)}`);

    if (!DRY_RUN) {
      process.stdout.write(`  Importing ${questions.length} ข้อ (status=${INSERT_STATUS})... `);
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

    await sleep(1500);
  }

  console.log(`\n${"=".repeat(58)}`);
  console.log(`  SUMMARY`);
  console.log(`${"=".repeat(58)}`);
  console.log(`  Generated: ${totalGenerated} questions`);
  if (!DRY_RUN) {
    console.log(`  Imported:  ${totalImported} questions (status=${INSERT_STATUS})`);
    if (INSERT_STATUS === "review") {
      console.log(`\n  QA ก่อน activate:`);
      console.log(`  SQL: UPDATE mcq_questions SET status='active'`);
      console.log(`       WHERE exam_type='NLE' AND status='review';`);
    }
  }
  console.log(`  Output:    ${OUTPUT_DIR}/`);
  console.log(`${"=".repeat(58)}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
