const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "41f903b7-5258-47fa-9ec3-44e756e705d1"; // เภสัชกรรมคลินิก

const questions = [
  {
    scenario: "ผู้ป่วยชายอายุ 65 ปี CKD stage 4 (eGFR 22 mL/min) ได้รับยา Metformin 500 mg BID สำหรับ DM type 2 ปัญหาที่อาจเกิดขึ้นคือ",
    choices: JSON.stringify(["Hypoglycemia", "Lactic acidosis", "Hepatotoxicity", "Pancreatitis"]),
    correct_answer: "B",
    explanation: "Metformin ห้ามใช้ใน eGFR < 30 (บาง guideline < 45) เพราะสะสมใน renal failure → lactic acidosis",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Metformin ไม่ทำให้ hypoglycemia (ไม่กระตุ้น insulin secretion)",
      B: "ถูก — Metformin accumulation ใน CKD severe → lactic acidosis ซึ่งอาจถึงแก่ชีวิต; ควรหยุดเมื่อ eGFR < 30 mL/min",
      C: "ผิด — Metformin ไม่ hepatotoxic",
      D: "ผิด — Pancreatitis เกี่ยวข้องกับ GLP-1 RA และ DPP-4i ไม่ใช่ Metformin",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 75 ปี ได้รับ Gentamicin IV สำหรับ gram-negative sepsis เภสัชกรต้องติดตามอะไรบ้าง",
    choices: JSON.stringify(["Liver function test", "Serum creatinine + audiometry (hearing test) + drug level", "CBC ทุกวัน", "Blood glucose"]),
    correct_answer: "B",
    explanation: "Aminoglycoside monitoring: nephrotoxicity (SCr/BUN), ototoxicity (hearing), drug level (peak/trough) เพื่อ optimize dose และลด toxicity",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Aminoglycoside ไม่ hepatotoxic",
      B: "ถูก — Gentamicin/Aminoglycoside: ติดตาม SCr (nephrotoxicity), audiometry (ototoxicity), drug level: trough < 2 mcg/mL, peak 5-10 mcg/mL (conventional dosing)",
      C: "ผิด — CBC ไม่ใช่ primary monitoring parameter",
      D: "ผิด — Blood glucose ไม่เกี่ยวข้อง",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 50 ปี ใช้ Warfarin สำหรับ AF มาพบเภสัชกรพร้อมใบสั่งยา Fluconazole สำหรับ oral thrush เภสัชกรควรทำอะไร",
    choices: JSON.stringify(["จ่ายยาได้ปกติ ไม่มี interaction", "แจ้งแพทย์ลดขนาด Warfarin ลงก่อนเริ่ม Fluconazole + monitor INR closely", "หยุด Warfarin ระหว่างใช้ Fluconazole", "เปลี่ยน Fluconazole เป็น Nystatin oral ถ้าเหมาะสม"]),
    correct_answer: "B",
    explanation: "Fluconazole inhibit CYP2C9 → Warfarin (S-warfarin) ลด metabolism → INR เพิ่มขึ้น → เสี่ยงเลือดออก",
    detailed_explanation: JSON.stringify({
      A: "ผิด — มี significant interaction",
      B: "ถูก — Fluconazole + Warfarin: INR เพิ่มมาก (อาจเป็น 2-3 เท่า) ควรลดขนาด Warfarin 25-50% และตรวจ INR บ่อยขึ้น",
      C: "ผิด — หยุด Warfarin ทำให้เกิด thromboembolism เสี่ยงมากกว่า",
      D: "ผิด — Nystatin ใช้ได้แต่ถ้า Fluconazole จำเป็นต้องจัดการ interaction ไม่ใช่เปลี่ยนยาเสมอไป",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 28 ปี ตั้งครรภ์ 6 สัปดาห์ มีอาการ UTI แบบ uncomplicated ยา antibiotic ใดที่ปลอดภัยในไตรมาสแรก",
    choices: JSON.stringify(["Ciprofloxacin", "Nitrofurantoin", "TMP-SMX", "Amoxicillin"]),
    correct_answer: "D",
    explanation: "Amoxicillin/Amoxicillin-clavulanate ปลอดภัยในตั้งครรภ์ทุกไตรมาส ใช้รักษา UTI uncomplicated",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Fluoroquinolone ห้ามใช้ในตั้งครรภ์ (cartilage toxicity, category C)",
      B: "ผิด — Nitrofurantoin ปลอดภัย ไตรมาส 1-2 แต่ห้ามไตรมาส 3 (hemolytic anemia)",
      C: "ผิด — TMP-SMX: trimethoprim ต้าน folate → neural tube defects ไตรมาสแรก; SMX ใกล้คลอดทำให้ kernicterus",
      D: "ถูก — Amoxicillin ปลอดภัยทุกไตรมาส (category B) เป็น preferred antibiotic สำหรับ UTI ในตั้งครรภ์",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 60 ปี CKD stage 3 (eGFR 40) ปวดข้อ แพทย์สั่ง Colchicine 0.6 mg BID สำหรับ gout เภสัชกรควรแนะนำอะไร",
    choices: JSON.stringify(["ใช้ได้ปกติไม่ต้องปรับ", "ลดขนาดเป็น 0.6 mg OD และ monitor for toxicity", "ห้ามใช้ Colchicine ใน CKD ทุก stage", "เพิ่มขนาดเป็น 1.2 mg BID"]),
    correct_answer: "B",
    explanation: "Colchicine ถูก eliminate ผ่านไต ใน CKD ต้องลดขนาด: eGFR 30-60 ลดเป็น 0.6 mg OD หรือ reduce frequency",
    detailed_explanation: JSON.stringify({
      A: "ผิด — CKD stage 3 (eGFR 30-60) ต้องปรับขนาด",
      B: "ถูก — eGFR 30-60: Colchicine dose reduction เหลือ 0.6 mg OD หรือลด frequency; ติดตาม neuromuscular toxicity",
      C: "ผิด — Colchicine ใช้ได้ใน CKD แต่ต้องปรับขนาด; ห้ามใช้เฉพาะ eGFR < 10 หรือ dialysis (ตาม some guidelines)",
      D: "ผิด — เพิ่มขนาดอันตรายมาก",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 45 ปี มีประวัติแพ้ Penicillin (ผื่น maculopapular) แพทย์ต้องการใช้ Cephalosporin รักษา cellulitis ความเสี่ยง cross-reactivity ระหว่าง Penicillin และ Cephalosporin คือ",
    choices: JSON.stringify(["50% cross-reactivity ห้ามใช้เด็ดขาด", "~2% cross-reactivity สามารถใช้ได้ระวัง", "ไม่มี cross-reactivity เลย", "100% cross-reactivity ห้ามใช้"]),
    correct_answer: "B",
    explanation: "Cross-reactivity Penicillin-Cephalosporin ประมาณ 1-2% (ต่ำกว่าที่เชื่อในอดีต 10%) ขึ้นกับ R1 side chain ที่เหมือนกัน",
    detailed_explanation: JSON.stringify({
      A: "ผิด — 50% เป็นความเชื่อเก่าที่ผิด",
      B: "ถูก — Cross-reactivity ประมาณ 1-2% พบใน shared R1 side chains เช่น Amoxicillin-Cefadroxil; ผู้แพ้ penicillin mild (rash) สามารถใช้ cephalosporin ได้ระวัง",
      C: "ผิด — มี cross-reactivity เล็กน้อยโดยเฉพาะกับ R1 group เหมือนกัน",
      D: "ผิด — 100% ไม่ถูกต้อง",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 70 ปี กำลังรับ Amiodarone สำหรับ persistent AF เภสัชกรต้องติดตามผลข้างเคียงระยะยาวอะไรบ้าง",
    choices: JSON.stringify(["Liver function, Thyroid function, Pulmonary function, Eye exam", "Blood glucose, Uric acid, CBC", "INR, APTT", "Serum sodium, Potassium"]),
    correct_answer: "A",
    explanation: "Amiodarone toxicity: hepatotoxicity (LFT), thyroid dysfunction (both hypo/hyper), pulmonary toxicity (PFT, CXR), corneal microdeposits + optic neuropathy",
    detailed_explanation: JSON.stringify({
      A: "ถูก — Amiodarone long-term monitoring: LFT (hepatotoxicity), TFT (thyroid: hypo/hyperthyroidism เพราะมี iodine สูง), CXR/PFT (pulmonary fibrosis), eye exam (corneal deposit, optic neuropathy)",
      B: "ผิด — glucose/uric acid/CBC ไม่ใช่ primary monitoring",
      C: "ผิด — INR สำหรับ Warfarin (Amiodarone เพิ่ม INR ถ้าใช้ร่วม Warfarin แต่ไม่ใช่ primary monitoring)",
      D: "ผิด — Electrolytes ไม่ใช่ primary monitoring parameter ของ Amiodarone",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 55 ปี ได้รับ Vancomycin IV สำหรับ MRSA bacteremia เภสัชกรต้องติดตามอะไรเพื่อป้องกัน nephrotoxicity",
    choices: JSON.stringify(["Peak level เท่านั้น", "Trough level (เก้า < 15 mg/L) หรือ AUC/MIC monitoring", "ตรวจ urine protein ทุกวัน", "INR"]),
    correct_answer: "B",
    explanation: "Vancomycin monitoring: trough level (< 15 mg/L) หรือ AUC24/MIC ≥ 400-600 เพื่อทั้ง efficacy และลด nephrotoxicity",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Peak level ไม่ใช่ standard monitoring parameter สำหรับ Vancomycin ทั่วไป",
      B: "ถูก — ASHP/IDSA 2020 guideline: AUC/MIC-guided dosing preferred; trough-only: ≥ 15 mg/L เพิ่มความเสี่ยง nephrotoxicity; ควรใช้ AUC target 400-600 mg·h/L",
      C: "ผิด — Urine protein ไม่ใช่ standard Vancomycin monitoring",
      D: "ผิด — INR ไม่เกี่ยวข้อง",
    }),
    difficulty: "hard",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} pharmacotherapy questions...`);
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const id = randomUUID();
    await client.execute({
      sql: `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
            VALUES (?, ?, 'PLE-CC1', ?, ?, ?, ?, ?, ?, 'active')`,
      args: [id, SUBJECT_ID, q.scenario, q.choices, q.correct_answer, q.explanation, q.detailed_explanation, q.difficulty],
    });
    console.log(`  ${i + 1}. ${q.scenario.substring(0, 50)}...`);
  }
  console.log(`\nDone! ${questions.length} questions inserted for เภสัชกรรมคลินิก`);
}

seed().catch(console.error);
