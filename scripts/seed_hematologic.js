const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "ace9965c-285b-4d4a-aaf2-5de9739cc09a"; // โลหิตวิทยา

const questions = [
  {
    scenario: "ผู้ป่วยหญิงอายุ 28 ปี ตั้งครรภ์ 16 สัปดาห์ ตรวจพบ Hb 9.5 g/dL MCV 68 fL serum ferritin 8 ng/mL วินิจฉัย Iron Deficiency Anemia ยาที่เหมาะสมคือ",
    choices: JSON.stringify(["Ferrous sulfate 325 mg (elemental Fe 65 mg) OD", "Ferrous sulfate 325 mg BID-TID", "IV iron sucrose ทันที", "ยังไม่ต้องรักษา เฝ้าสังเกต"]),
    correct_answer: "B",
    explanation: "IDA ในตั้งครรภ์: elemental iron 120-200 mg/day (Ferrous sulfate 325 mg = 65 mg elemental Fe × 2-3 ครั้ง)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — OD เดี่ยวให้ elemental Fe 65 mg/day ต่ำเกินสำหรับ treatment (เหมาะ prevention ปกติ)",
      B: "ถูก — WHO/ACOG: IDA in pregnancy ต้องการ elemental iron 120-200 mg/day → Ferrous sulfate 325 mg BID หรือ TID",
      C: "ผิด — IV iron สำรองสำหรับ oral intolerant, severe anemia, หรือ late pregnancy",
      D: "ผิด — Hb 9.5 ต้องรักษา",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 55 ปี Vitamin B12 deficiency anemia มี macrocytic anemia + neurological symptoms (numbness) สาเหตุที่พบบ่อยที่สุดในผู้ใหญ่คือ",
    choices: JSON.stringify(["ขาด B12 จากอาหาร (vegan)", "Pernicious anemia (anti-intrinsic factor antibody)", "Metformin-induced B12 deficiency", "Chronic alcoholism"]),
    correct_answer: "B",
    explanation: "Pernicious anemia (autoimmune gastritis → IF antibody → B12 malabsorption) เป็นสาเหตุพบบ่อยที่สุดของ B12 deficiency ในผู้ใหญ่ตะวันตก",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Dietary B12 deficiency พบใน strict vegans แต่ไม่ใช่พบบ่อยที่สุด",
      B: "ถูก — Pernicious anemia: anti-IF antibody → B12 malabsorption → ต้องรักษาด้วย IM B12 (Cyanocobalamin/Hydroxycobalamin)",
      C: "ผิด — Metformin ลด B12 ดูดซึม แต่ไม่ใช่พบบ่อยที่สุด",
      D: "ผิด — Alcoholism ทำให้ folate deficiency มากกว่า B12",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 70 ปี มี DVT (Deep Vein Thrombosis) รักษาด้วย Warfarin ค่า INR เป้าหมายสำหรับ DVT/PE คือ",
    choices: JSON.stringify(["INR 1.5-2.0", "INR 2.0-3.0", "INR 2.5-3.5", "INR 3.0-4.0"]),
    correct_answer: "B",
    explanation: "INR target สำหรับ DVT/PE prophylaxis และ treatment: 2.0-3.0",
    detailed_explanation: JSON.stringify({
      A: "ผิด — 1.5-2.0 ต่ำเกิน ไม่ได้ผล",
      B: "ถูก — INR 2-3 เป็น standard target สำหรับ VTE (DVT/PE) treatment/prevention",
      C: "ผิด — 2.5-3.5 ใช้ใน mechanical heart valve บางชนิด",
      D: "ผิด — 3-4 ใช้ใน high-risk mechanical valve เช่น mitral mechanical",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 65 ปี AF (Atrial Fibrillation) ได้รับ Warfarin INR = 4.8 ไม่มีเลือดออก ควรจัดการอย่างไร",
    choices: JSON.stringify(["หยุด Warfarin 1-2 วัน แล้วตรวจ INR ซ้ำ", "ให้ Vitamin K1 5-10 mg oral ทันที", "ให้ FFP (Fresh Frozen Plasma) ทันที", "เพิ่มขนาด Warfarin"]),
    correct_answer: "A",
    explanation: "Warfarin supratherapeutic INR 4-9 ไม่มีเลือดออก: หยุดยา 1-2 วัน รอ INR ลงมาในช่วง therapeutic",
    detailed_explanation: JSON.stringify({
      A: "ถูก — INR 4.8 ไม่มีเลือดออก: hold Warfarin 1-2 dose แล้ว recheck INR; อาจให้ Vitamin K1 1-2.5 mg oral ถ้า risk สูง",
      B: "ผิด — Vitamin K1 5-10 mg oral ใช้ใน INR > 9 ไม่มีเลือดออก หรือ INR 4-9 ที่มี risk factor เลือดออกสูง",
      C: "ผิด — FFP ใช้ใน active severe bleeding หรือก่อนผ่าตัดด่วน",
      D: "ผิด — ห้ามเพิ่มขนาด",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 60 ปี AF เพิ่งวินิจฉัย แพทย์เลือกใช้ DOAC แทน Warfarin ข้อดีของ DOAC (เช่น Rivaroxaban, Apixaban) เมื่อเทียบกับ Warfarin คือ",
    choices: JSON.stringify(["ราคาถูกกว่า Warfarin", "ไม่ต้องตรวจ INR routine, onset เร็วกว่า", "ย้อนกลับด้วย Vitamin K ได้ง่ายกว่า", "ใช้ได้ปลอดภัยกว่าใน severe renal impairment"]),
    correct_answer: "B",
    explanation: "DOAC ข้อดี: ไม่ต้อง routine INR monitoring, onset เร็ว (peak 1-4 ชม.), drug interaction น้อยกว่า Warfarin",
    detailed_explanation: JSON.stringify({
      A: "ผิด — DOAC แพงกว่า Warfarin มาก",
      B: "ถูก — DOAC: predictable pharmacokinetics → ไม่ต้อง routine monitoring; rapid onset; fewer food/drug interactions",
      C: "ผิด — DOAC มี specific antidotes (Idarucizumab สำหรับ Dabigatran, Andexanet alfa สำหรับ FXa inhibitors) แต่ไม่ใช่ Vitamin K",
      D: "ผิด — DOAC ลด dose ใน moderate renal impairment และ ห้ามใช้ใน severe CKD (eGFR < 15-30)",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 25 ปี Sickle Cell Disease มาด้วย Vaso-occlusive pain crisis ยาที่ใช้บรรเทาอาการเฉียบพลันและลด frequency ของ crisis คือ",
    choices: JSON.stringify(["Hydroxyurea เป็น maintenance", "Morphine IV สำหรับ acute pain + Hydroxyurea maintenance", "NSAIDs สำหรับ acute pain เพียงอย่างเดียว", "Blood transfusion ทุก crisis"]),
    correct_answer: "B",
    explanation: "Sickle cell VOC: opioid (Morphine) เป็น acute pain management; Hydroxyurea ลด HbS polymerization → ลด frequency crisis",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Hydroxyurea เป็น maintenance disease-modifying therapy ไม่รักษา acute crisis",
      B: "ถูก — Acute: opioid analgesic (Morphine) + hydration; Maintenance: Hydroxyurea เพิ่ม HbF → ลดการ sickling",
      C: "ผิด — NSAIDs อย่างเดียวไม่เพียงพอสำหรับ severe VOC + มีความเสี่ยง renal",
      D: "ผิด — Transfusion ไม่ใช้ routine ทุก crisis; ใช้ใน severe anemia, stroke, ACS",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 68 ปี CLL (Chronic Lymphocytic Leukemia) เพิ่งวินิจฉัย stage I Rai ไม่มีอาการ แนวทางรักษาที่เหมาะสมคือ",
    choices: JSON.stringify(["เริ่ม chemotherapy ทันที", "Watch and Wait (เฝ้าสังเกต)", "Bone marrow transplant ทันที", "Rituximab ทันที"]),
    correct_answer: "B",
    explanation: "CLL early stage (Rai 0-II ไม่มีอาการ): watch and wait เป็น standard approach เพราะ treatment ไม่ได้เพิ่ม OS",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Chemotherapy ไม่แนะนำใน asymptomatic early CLL",
      B: "ถูก — CLL Rai stage I ไม่มีอาการ: watch and wait (active surveillance) จนกว่ามี active disease criteria",
      C: "ผิด — BMT ไม่ใช่ treatment for early asymptomatic CLL",
      D: "ผิด — Rituximab ไม่แนะนำ monotherapy ใน early asymptomatic CLL",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 45 ปี เพิ่งผ่าตัดเปลี่ยนลิ้นหัวใจ mechanical (mitral valve) ควรได้รับ Warfarin ในช่วง INR เท่าใด",
    choices: JSON.stringify(["INR 1.5-2.0", "INR 2.0-3.0", "INR 2.5-3.5", "INR 3.5-4.5"]),
    correct_answer: "C",
    explanation: "Mechanical heart valve (mitral): INR target 2.5-3.5 สูงกว่า DVT เนื่องจาก thromboembolism risk สูงกว่า",
    detailed_explanation: JSON.stringify({
      A: "ผิด — 1.5-2.0 ต่ำเกิน เสี่ยง valve thrombosis",
      B: "ผิด — 2-3 เหมาะ aortic mechanical valve (lower risk) ไม่ใช่ mitral",
      C: "ถูก — Mechanical mitral valve: INR 2.5-3.5 (AHA/ACC guideline) เพราะ mitral position มี thromboembolism risk สูงกว่า aortic",
      D: "ผิด — 3.5-4.5 สูงเกิน เสี่ยงเลือดออก",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 35 ปี ITP (Immune Thrombocytopenic Purpura) platelet count 12,000/mm³ มีจ้ำเลือดแต่ไม่มีเลือดออกในอวัยวะสำคัญ ยา first-line คือ",
    choices: JSON.stringify(["Platelet transfusion ทันที", "Prednisolone 1 mg/kg/day", "Splenectomy", "Rituximab"]),
    correct_answer: "B",
    explanation: "ITP first-line: corticosteroid (Prednisolone/Dexamethasone) เพื่อลด platelet destruction",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Platelet transfusion ใช้เฉพาะ life-threatening bleeding ใน ITP; ถูก destroy เร็ว",
      B: "ถูก — Prednisolone 1-2 mg/kg/day หรือ Dexamethasone 40 mg/day × 4 วัน เป็น first-line สำหรับ newly diagnosed ITP",
      C: "ผิด — Splenectomy เป็น second-line สำหรับ refractory/relapsed ITP",
      D: "ผิด — Rituximab เป็น second/third-line",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 70 ปี มี CKD stage 3 (eGFR 35) วินิจฉัย anemia of CKD (Hb 9 g/dL) เหตุใดจึงเกิด anemia ใน CKD",
    choices: JSON.stringify(["ขาด Vitamin B12 จาก malabsorption", "ลดการผลิต Erythropoietin จากไต", "Hemolysis จาก uremic toxins", "Iron deficiency จากการฟอกเลือด"]),
    correct_answer: "B",
    explanation: "Anemia of CKD สาเหตุหลัก: peritubular cells ของไตผลิต EPO ลดลง → erythropoiesis ลด",
    detailed_explanation: JSON.stringify({
      A: "ผิด — B12 deficiency ไม่ใช่สาเหตุหลักของ anemia CKD",
      B: "ถูก — Decreased EPO production จาก damaged peritubular fibroblasts เป็นสาเหตุหลักของ anemia of CKD → รักษาด้วย ESA (Epoetin alfa, Darbepoetin) + iron",
      C: "ผิด — Hemolysis เกิดได้บ้างแต่ไม่ใช่สาเหตุหลัก",
      D: "ผิด — Iron deficiency เป็น contributing factor โดยเฉพาะในผู้ที่ฟอกเลือด แต่ไม่ใช่สาเหตุหลัก",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 55 ปี DVT ใน proximal leg ได้รับ LMWH (Enoxaparin) ขนาดปกติ แต่เนื่องจาก BMI 42 (obese) ควรปรับขนาดยาอย่างไร",
    choices: JSON.stringify(["ใช้ขนาดตามน้ำหนักจริง (actual body weight)", "ใช้ขนาดตาม ideal body weight", "ใช้ขนาดตาม adjusted body weight", "ไม่ต้องปรับขนาด ใช้ขนาดมาตรฐาน"]),
    correct_answer: "A",
    explanation: "LMWH dose ใน obesity: ใช้ actual body weight (ABW) ถึงแม้จะ obese เพราะ LMWH กระจายไปยัง lean tissue",
    detailed_explanation: JSON.stringify({
      A: "ถูก — LMWH (Enoxaparin) treatment dose ใช้ actual body weight (ABW) ไม่มี cap แต่บาง guideline แนะนำ anti-Xa monitoring ใน extreme obesity (> 150 kg หรือ BMI > 50)",
      B: "ผิด — IBW จะ underdose ใน obese patient",
      C: "ผิด — Adjusted BW ใช้ใน aminoglycosides ไม่ใช่ LMWH",
      D: "ผิด — Standard dose จะ underdose ใน morbidly obese",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 45 ปี NHL รับ CHOP chemotherapy ซึ่งประกอบด้วย Cyclophosphamide, Doxorubicin, Vincristine, Prednisolone ยาใดในรูปแบบนี้ที่ทำให้เกิด hemorrhagic cystitis",
    choices: JSON.stringify(["Doxorubicin", "Vincristine", "Cyclophosphamide", "Prednisolone"]),
    correct_answer: "C",
    explanation: "Cyclophosphamide metabolite (Acrolein) ทำให้ bladder irritation → hemorrhagic cystitis ป้องกันด้วย Mesna",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Doxorubicin ผลข้างเคียงหลัก: cardiotoxicity (dilated cardiomyopathy)",
      B: "ผิด — Vincristine ผลข้างเคียงหลัก: peripheral neuropathy, SIADH",
      C: "ถูก — Cyclophosphamide → Acrolein metabolite → urothelial toxicity → hemorrhagic cystitis; ป้องกันด้วย Mesna, hydration, frequent voiding",
      D: "ผิด — Prednisolone ผลข้างเคียง: immunosuppression, hyperglycemia, osteoporosis",
    }),
    difficulty: "medium",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} hematologic questions...`);
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
  console.log(`\nDone! ${questions.length} questions inserted for โลหิตวิทยา`);
}

seed().catch(console.error);
