const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "91eedbf3-4301-4f40-ae3d-3cc6f64c4f8a"; // ทางเดินอาหาร

const questions = [
  {
    scenario: "ผู้ป่วยชายอายุ 52 ปี มี GERD มาหลายปี แพทย์สั่ง Omeprazole 20 mg OD นาน 4 สัปดาห์ ยังมีอาการอยู่ ยาใดที่ควรปรับ",
    choices: JSON.stringify(["เพิ่มขนาด Omeprazole เป็น 40 mg OD", "เปลี่ยนเป็น H2-blocker", "เพิ่ม Antacid เสริม", "ลด Omeprazole เป็น 10 mg OD"]),
    correct_answer: "A",
    explanation: "GERD ที่ไม่ตอบสนอง PPI ขนาดมาตรฐาน ควรเพิ่มขนาดเป็น 40 mg OD หรือให้ BID",
    detailed_explanation: JSON.stringify({
      A: "ถูก — GERD refractory to standard PPI dose: escalate to double dose (40 mg OD หรือ 20 mg BID) ก่อน",
      B: "ผิด — H2-blocker ด้อยกว่า PPI ใน erosive GERD ไม่ควรใช้แทน",
      C: "ผิด — Antacid เป็น symptomatic relief ชั่วคราว ไม่ใช่การรักษา",
      D: "ผิด — ลดขนาดยาทำให้แย่ลง",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 45 ปี ติดเชื้อ H. pylori ตรวจพบจาก urea breath test แพทย์จะรักษาด้วย triple therapy มาตรฐาน ยากลุ่มใดที่ต้องใช้ร่วมกัน 3 ชนิด",
    choices: JSON.stringify(["PPI + Amoxicillin + Clarithromycin", "H2-blocker + Metronidazole + Tetracycline", "PPI + Metronidazole + Amoxicillin + Bismuth", "PPI + Clarithromycin + Levofloxacin"]),
    correct_answer: "A",
    explanation: "Standard triple therapy สำหรับ H. pylori คือ PPI + Amoxicillin + Clarithromycin นาน 7-14 วัน",
    detailed_explanation: JSON.stringify({
      A: "ถูก — CAM triple therapy: PPI BID + Amoxicillin 1g BID + Clarithromycin 500 mg BID × 14 วัน",
      B: "ผิด — H2-blocker ไม่ใช้ใน H. pylori eradication regimen",
      C: "ผิด — นั่นคือ quadruple therapy (4 ตัว) ใช้เมื่อ triple therapy ล้มเหลว",
      D: "ผิด — Levofloxacin-based triple เป็น salvage therapy ไม่ใช่ first-line",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 60 ปี ได้รับ NSAIDs เรื้อรังเพื่อรักษา OA และมีประวัติแผลในกระเพาะ ควรให้ยาป้องกันชนิดใด",
    choices: JSON.stringify(["Antacid ตามอาการ", "H2-blocker ขนาดมาตรฐาน", "PPI ทุกวันตลอดการใช้ NSAIDs", "Misoprostol 200 mcg QID"]),
    correct_answer: "C",
    explanation: "ผู้ป่วย high-risk GI (ประวัติแผลในกระเพาะ + NSAIDs เรื้อรัง) ควรได้ PPI เพื่อป้องกัน gastroprotection",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Antacid ไม่มีหลักฐานป้องกันแผลจาก NSAIDs",
      B: "ผิด — H2-blocker ด้อยกว่า PPI ในการป้องกัน NSAID-induced ulcer",
      C: "ถูก — PPI เป็น gold standard สำหรับ gastroprotection ใน high-risk NSAID users",
      D: "ผิด — Misoprostol ใช้ได้แต่ผลข้างเคียง (ท้องเสีย ปวดท้อง) สูง ไม่ใช่ first-choice",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 35 ปี IBS-D (Irritable Bowel Syndrome with diarrhea) มีอาการปวดท้องและถ่ายบ่อย ยาใดที่ช่วยลดอาการปวดท้องได้ดีที่สุด",
    choices: JSON.stringify(["Loperamide", "Dicyclomine (Anticholinergic)", "Psyllium fiber", "Lactulose"]),
    correct_answer: "B",
    explanation: "Antispasmodic เช่น Dicyclomine ช่วยลด visceral pain และ spasm ในผู้ป่วย IBS",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Loperamide ลดความถี่ถ่าย (antidiarrheal) แต่ไม่ลด abdominal pain",
      B: "ถูก — Antispasmodic (Dicyclomine, Hyoscine) ลด bowel spasm และ pain ใน IBS ได้ดี",
      C: "ผิด — Fiber เหมาะกับ IBS-C ไม่ใช่ IBS-D",
      D: "ผิด — Lactulose เป็น laxative ใช้ใน constipation",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 70 ปี ตรวจพบ C. difficile colitis ได้รับการรักษา Metronidazole 500 mg TID นาน 10 วัน แต่กลับเป็นซ้ำ ยาที่เหมาะสมสำหรับครั้งที่ 2 คือ",
    choices: JSON.stringify(["ให้ Metronidazole อีกรอบ", "Vancomycin oral 125 mg QID × 10 วัน", "Ciprofloxacin", "Rifaximin"]),
    correct_answer: "B",
    explanation: "C. difficile recurrence ควรรักษาด้วย oral Vancomycin ซึ่งดีกว่า Metronidazole สำหรับกรณีกลับซ้ำ",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Metronidazole ซ้ำมักไม่ได้ผลใน recurrent CDI",
      B: "ถูก — Oral Vancomycin 125 mg QID × 10 วัน เป็น standard ของ recurrent CDI (IDSA guidelines)",
      C: "ผิด — Ciprofloxacin ไม่มีประสิทธิภาพต่อ C. difficile",
      D: "ผิด — Rifaximin อาจใช้เป็น follow-on therapy หลัง Vancomycin ไม่ใช่ treatment หลัก",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 50 ปี มีตับแข็ง Child-Pugh B และ hepatic encephalopathy ยาใดที่ใช้ลด ammonia และป้องกัน encephalopathy",
    choices: JSON.stringify(["Metronidazole", "Lactulose", "Neomycin sulfate", "Rifaximin"]),
    correct_answer: "B",
    explanation: "Lactulose เป็น first-line ใน hepatic encephalopathy — ลด NH3 โดยทำให้ pH ลงและระบายท้อง",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Metronidazole ไม่ใช่การรักษา encephalopathy",
      B: "ถูก — Lactulose first-line: acidify colon → NH4+ trap → ลด NH3 absorption เป้าหมาย 2-3 ครั้ง/วัน",
      C: "ผิด — Neomycin ใช้ได้แต่มี nephrotoxicity/ototoxicity สูง ไม่นิยมแล้ว",
      D: "ผิด — Rifaximin ใช้เป็น adjunct หรือ secondary prevention ไม่ใช่ monotherapy first-line",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 48 ปี วินิจฉัย Crohn's disease ลำไส้เล็กส่วน terminal ileum อาการปานกลาง-รุนแรง ยาใดที่เหมาะสมเป็น induction therapy",
    choices: JSON.stringify(["Mesalazine oral", "Prednisolone 40 mg/day", "Sulfasalazine", "Methotrexate"]),
    correct_answer: "B",
    explanation: "Corticosteroid (Prednisolone) เป็น first-line induction ของ moderate-severe Crohn's disease",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Mesalazine (5-ASA) ใช้ใน Ulcerative Colitis ไม่มีหลักฐานชัดเจนใน Crohn's",
      B: "ถูก — Prednisolone 40 mg/day หรือ Budesonide สำหรับ ileocecal Crohn's เป็น standard induction",
      C: "ผิด — Sulfasalazine มีประสิทธิภาพต่ำใน Crohn's small bowel",
      D: "ผิด — Methotrexate ใช้เป็น maintenance ไม่ใช่ induction",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 40 ปี ได้รับการวินิจฉัย Ulcerative Colitis (UC) mildly active ควรเริ่มรักษาด้วยยากลุ่มใด",
    choices: JSON.stringify(["5-ASA (Mesalazine) oral + rectal", "Prednisolone high dose", "Azathioprine", "Infliximab"]),
    correct_answer: "A",
    explanation: "Mild UC: 5-ASA เป็น first-line ทั้ง oral และ rectal (suppository/enema) ให้ผล remission ดีกว่า oral อย่างเดียว",
    detailed_explanation: JSON.stringify({
      A: "ถูก — 5-ASA oral + topical (rectal) เป็น first-line สำหรับ mild-moderate UC",
      B: "ผิด — Corticosteroid ใช้กรณี moderate-severe หรือ fail 5-ASA",
      C: "ผิด — Azathioprine เป็น steroid-sparing maintenance ไม่ใช่ first-line induction",
      D: "ผิด — Anti-TNF (Infliximab) เป็น biologic สำหรับ severe/refractory UC",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 65 ปี ตับแข็งจากแอลกอฮอล์ มี esophageal varices grade 2 ยาใดที่ใช้ป้องกัน primary bleeding",
    choices: JSON.stringify(["Propranolol non-selective beta-blocker", "Atenolol selective beta-blocker", "Isosorbide mononitrate เดี่ยว", "Furosemide"]),
    correct_answer: "A",
    explanation: "Non-selective beta-blocker (Propranolol, Nadolol) ลด portal hypertension โดยลด cardiac output + vasoconstriction → เป็น primary prophylaxis",
    detailed_explanation: JSON.stringify({
      A: "ถูก — Propranolol/Nadolol ลด portal pressure → ป้องกัน variceal bleeding เป็น first-line primary prophylaxis",
      B: "ผิด — Selective beta-blocker (Atenolol) ออกฤทธิ์แค่ heart rate ไม่ลด portal pressure เพียงพอ",
      C: "ผิด — Nitrate เดี่ยวไม่มีหลักฐานป้องกัน primary bleeding",
      D: "ผิด — Furosemide รักษา ascites ไม่ใช่ป้องกัน variceal bleeding",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 55 ปี ตับแข็ง มีอาการท้องมาน (ascites) แรกพบ ควรรักษาด้วยอะไรเป็น first-line",
    choices: JSON.stringify(["Furosemide 40 mg/day เดี่ยว", "Spironolactone 100 mg/day เดี่ยว", "Spironolactone 100 mg + Furosemide 40 mg ร่วมกัน", "Albumin infusion"]),
    correct_answer: "C",
    explanation: "AASLD guideline แนะนำ Spironolactone + Furosemide ร่วมกันตั้งแต่เริ่มรักษา ascites อัตราส่วน 100:40",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Furosemide เดี่ยวทำให้ hypokalemia และไม่ effective เท่า combination",
      B: "ผิด — Spironolactone เดี่ยวใช้ได้แต่ AASLD แนะนำ combination therapy",
      C: "ถูก — Spironolactone 100 mg + Furosemide 40 mg ratio 2.5:1 ป้องกัน electrolyte imbalance",
      D: "ผิด — Albumin ใช้หลัง large volume paracentesis หรือ SBP ไม่ใช่ first-line ascites",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 30 ปี มีอาการคลื่นไส้อาเจียนรุนแรงหลังเคมีบำบัด Cisplatin ยาแก้อาเจียนกลุ่มใดมีประสิทธิภาพสูงสุด",
    choices: JSON.stringify(["Metoclopramide", "5-HT3 antagonist (Ondansetron)", "Promethazine", "Domperidone"]),
    correct_answer: "B",
    explanation: "5-HT3 antagonist เช่น Ondansetron เป็น gold standard สำหรับ CINV (chemotherapy-induced nausea/vomiting) โดยเฉพาะ highly emetogenic chemo",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Metoclopramide มี EPS ที่ขนาดสูง ประสิทธิภาพน้อยกว่า 5-HT3 ใน CINV",
      B: "ถูก — Ondansetron/Granisetron เป็น first-line สำหรับ acute CINV จาก highly emetogenic agents เช่น Cisplatin",
      C: "ผิด — Promethazine antihistamine ไม่ effective ใน CINV ระดับ severe",
      D: "ผิด — Domperidone ใช้ใน functional nausea ไม่ใช่ CINV",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 28 ปี ตั้งครรภ์ไตรมาสแรก มีอาการคลื่นไส้อาเจียนรุนแรง (hyperemesis gravidarum) ยาใดปลอดภัยที่สุดสำหรับแก้อาเจียน",
    choices: JSON.stringify(["Ondansetron", "Doxylamine + Pyridoxine (Vitamin B6)", "Metoclopramide", "Prochlorperazine"]),
    correct_answer: "B",
    explanation: "Doxylamine + Pyridoxine เป็น FDA category A สำหรับ nausea/vomiting of pregnancy — ปลอดภัยที่สุด",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Ondansetron มีข้อมูลเพิ่มขึ้นว่าอาจเพิ่มความเสี่ยง cardiac defects ไตรมาสแรก",
      B: "ถูก — Doxylamine + Vitamin B6 (Pyridoxine) เป็น FDA-approved (category A) first-line สำหรับ NVP",
      C: "ผิด — Metoclopramide ใช้ได้แต่ EPS เป็นความเสี่ยง",
      D: "ผิด — Prochlorperazine (phenothiazine) ไม่ใช่ first-line ในตั้งครรภ์",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 58 ปี มีอาการท้องผูกเรื้อรัง ลอง fiber และ lifestyle modification แล้วไม่ได้ผล ยา osmotic laxative ที่นิยมใช้มากที่สุดคือ",
    choices: JSON.stringify(["Bisacodyl", "Senna", "PEG (Polyethylene glycol)", "Docusate sodium"]),
    correct_answer: "C",
    explanation: "PEG เป็น osmotic laxative ที่ปลอดภัย มีหลักฐานดีสำหรับ chronic constipation ในผู้ใหญ่",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Bisacodyl เป็น stimulant laxative ไม่ใช่ osmotic",
      B: "ผิด — Senna เป็น stimulant laxative ใช้ระยะสั้น",
      C: "ถูก — PEG (Macrogol) เป็น osmotic laxative first-line สำหรับ chronic constipation ปลอดภัยระยะยาว",
      D: "ผิด — Docusate เป็น stool softener ประสิทธิภาพต่ำ",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 42 ปี ตรวจพบ Non-alcoholic fatty liver disease (NAFLD) BMI 32 ยาที่มีหลักฐานว่าช่วยลด liver inflammation ใน NASH คือ",
    choices: JSON.stringify(["Metformin", "Vitamin E (800 IU/day)", "Omega-3", "Silymarin"]),
    correct_answer: "B",
    explanation: "Vitamin E ขนาดสูง (800 IU/day) มีหลักฐาน RCT (PIVENS trial) ว่าลด histologic inflammation ใน non-diabetic NASH",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Metformin ไม่มีหลักฐาน histologic benefit ใน NASH",
      B: "ถูก — Vitamin E 800 IU/day AASLD แนะนำสำหรับ non-diabetic NASH (PIVENS trial)",
      C: "ผิด — Omega-3 ลด triglyceride แต่ไม่มี histologic evidence ชัดเจนใน NASH",
      D: "ผิด — Silymarin ไม่มีหลักฐาน RCT ที่แข็งแรงพอ",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 50 ปี ได้รับ Omeprazole มา 1 ปี มารับยาต่อเนื่อง เภสัชกรควรตรวจสอบ drug interaction กับยาใด",
    choices: JSON.stringify(["Amlodipine", "Clopidogrel", "Metformin", "Simvastatin"]),
    correct_answer: "B",
    explanation: "Omeprazole ยับยั้ง CYP2C19 ลด conversion ของ Clopidogrel เป็น active metabolite → ลด antiplatelet effect",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Amlodipine ไม่มี significant interaction กับ Omeprazole",
      B: "ถูก — Omeprazole + Clopidogrel: Omeprazole inhibit CYP2C19 → Clopidogrel active metabolite ลดลง → antiplatelet effect ลดลง แนะนำให้ใช้ Pantoprazole แทน",
      C: "ผิด — Metformin ไม่มี interaction กับ PPI",
      D: "ผิด — Simvastatin ไม่มี significant interaction กับ Omeprazole",
    }),
    difficulty: "hard",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} gastrointestinal questions...`);
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
  console.log(`\nDone! ${questions.length} questions inserted for ทางเดินอาหาร`);
}

seed().catch(console.error);
