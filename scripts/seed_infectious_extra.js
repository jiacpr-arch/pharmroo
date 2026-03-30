const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "8bccedb2-3bdb-4f5c-9da9-f589b25672fd"; // โรคติดเชื้อ

const questions = [
  {
    scenario: "ผู้ป่วยชายอายุ 35 ปี วินิจฉัย Typhoid fever (Salmonella typhi) ยา antibiotic first-line ที่แนะนำในปัจจุบันคือ",
    choices: JSON.stringify(["Chloramphenicol", "Fluoroquinolone (Ciprofloxacin) หรือ Azithromycin", "Ampicillin", "TMP-SMX"]),
    correct_answer: "B",
    explanation: "Fluoroquinolone (uncomplicated) หรือ Azithromycin เป็น first-line ปัจจุบัน เนื่องจาก resistance ต่อ Chloramphenicol และ Ampicillin สูงขึ้น",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Chloramphenicol เคยเป็น first-line แต่ resistance สูง และมีผลข้างเคียง aplastic anemia",
      B: "ถูก — Ciprofloxacin 500 mg BID × 7-14 วัน หรือ Azithromycin 1 g OD × 5 วัน เป็น preferred treatment ปัจจุบัน",
      C: "ผิด — Ampicillin resistance สูงขึ้นมาก",
      D: "ผิด — TMP-SMX resistance สูงในหลายพื้นที่",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 40 ปี Sepsis จาก E. coli UTI ได้รับ Ceftriaxone IV อยู่ ผล culture ออกมาเป็น ESBL-producing E. coli ควรเปลี่ยนยาเป็นอะไร",
    choices: JSON.stringify(["เพิ่มขนาด Ceftriaxone", "Meropenem หรือ Ertapenem (Carbapenem)", "Cefepime", "Azithromycin"]),
    correct_answer: "B",
    explanation: "ESBL-producing organisms ดื้อต่อ cephalosporins ทุกชนิด → Carbapenem เป็น definitive treatment",
    detailed_explanation: JSON.stringify({
      A: "ผิด — ESBL enzyme ทำลาย beta-lactam ring การเพิ่มขนาดไม่ช่วย",
      B: "ถูก — Carbapenem (Meropenem, Imipenem, Ertapenem) เป็น drug of choice สำหรับ ESBL-producing Enterobacteriaceae",
      C: "ผิด — Cefepime ถูก hydrolyzed โดย ESBL ไม่ reliable",
      D: "ผิด — Azithromycin ไม่มีประสิทธิภาพต่อ gram-negative sepsis",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 28 ปี วินิจฉัย Gonorrhea (Neisseria gonorrhoeae) ยา first-line ที่แนะนำตาม CDC 2021 guideline คือ",
    choices: JSON.stringify(["Ciprofloxacin 500 mg single dose", "Ceftriaxone 500 mg IM single dose", "Azithromycin 1 g single dose เดี่ยว", "Doxycycline 100 mg BID × 7 วัน"]),
    correct_answer: "B",
    explanation: "CDC 2021: Ceftriaxone 500 mg IM single dose (1 g ถ้า weight > 150 kg) เป็น first-line เนื่องจาก fluoroquinolone resistance สูง",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Ciprofloxacin resistance สูงมาก ไม่แนะนำ",
      B: "ถูก — Ceftriaxone 500 mg IM single dose เป็น standard first-line (CDC 2021); ถ้าน้ำหนัก > 150 kg ให้ 1 g",
      C: "ผิด — Azithromycin เดี่ยวไม่แนะนำแล้วเพราะ resistance เพิ่มขึ้น (เดิมใช้ dual therapy)",
      D: "ผิด — Doxycycline ใช้ cover Chlamydia ร่วม แต่ไม่ใช่ first-line Gonorrhea เดี่ยว",
    }),
    difficulty: "hard",
  },
];

// Also add 1 more for Neurologic subject
const NEURO_SUBJECT_ID = "fb62e97d-dec1-4b47-b45f-617b2c03fb4d";
const neuroQuestion = {
  scenario: "ผู้ป่วยชายอายุ 45 ปี มีอาการปวดศีรษะเรื้อรัง ไม่ตอบสนองต่อยาแก้ปวดทั่วไป แพทย์วินิจฉัย Chronic Migraine ยาป้องกัน (prophylaxis) ที่แนะนำเป็น first-line คือ",
  choices: JSON.stringify(["Paracetamol 1 g BID ทุกวัน", "Propranolol 40-240 mg/day หรือ Topiramate 25-100 mg/day", "Sumatriptan ทุกวัน", "Codeine PRN"]),
  correct_answer: "B",
  explanation: "Migraine prophylaxis first-line: Propranolol (beta-blocker) หรือ Topiramate เป็น evidence-based treatment ตาม AHS/AAN guideline",
  detailed_explanation: JSON.stringify({
    A: "ผิด — Paracetamol ทุกวันทำให้ Medication Overuse Headache",
    B: "ถูก — Propranolol, Topiramate, Amitriptyline, Valproate เป็น first-line prophylaxis สำหรับ chronic/frequent migraine",
    C: "ผิด — Sumatriptan ทุกวันทำให้ MOH (Medication Overuse Headache)",
    D: "ผิด — Opioid ไม่แนะนำใน migraine management",
  }),
  difficulty: "medium",
};

async function seed() {
  // Infectious questions
  console.log(`Adding ${questions.length} more infectious disease questions...`);
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const id = randomUUID();
    await client.execute({
      sql: `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
            VALUES (?, ?, 'PLE-CC1', ?, ?, ?, ?, ?, ?, 'active')`,
      args: [id, SUBJECT_ID, q.scenario, q.choices, q.correct_answer, q.explanation, q.detailed_explanation, q.difficulty],
    });
    console.log(`  Infectious ${i + 1}. ${q.scenario.substring(0, 50)}...`);
  }

  // Neurologic question
  console.log(`\nAdding 1 more neurologic question...`);
  const nid = randomUUID();
  await client.execute({
    sql: `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
          VALUES (?, ?, 'PLE-CC1', ?, ?, ?, ?, ?, ?, 'active')`,
    args: [nid, NEURO_SUBJECT_ID, neuroQuestion.scenario, neuroQuestion.choices, neuroQuestion.correct_answer, neuroQuestion.explanation, neuroQuestion.detailed_explanation, neuroQuestion.difficulty],
  });
  console.log(`  Neurologic: ${neuroQuestion.scenario.substring(0, 50)}...`);

  console.log(`\nDone!`);
}

seed().catch(console.error);
