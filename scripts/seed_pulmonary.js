const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "cc7ce595-2da4-4207-95a4-9a4bb606bbe0"; // ปอด

const questions = [
  {
    scenario: "ผู้ป่วยชายอายุ 55 ปี สูบบุหรี่ 30 pack-years มีอาการหอบเหนื่อยเวลาออกแรง ไอมีเสมหะเรื้อรัง Spirometry FEV1/FVC = 0.62 (< 0.70) FEV1 = 55% predicted ผู้ป่วยอยู่ใน GOLD stage ใด",
    choices: JSON.stringify(["GOLD 1 (Mild)", "GOLD 2 (Moderate)", "GOLD 3 (Severe)", "GOLD 4 (Very Severe)"]),
    correct_answer: "B",
    explanation: "GOLD 2: FEV1/FVC < 0.70 และ FEV1 50-79% predicted",
    detailed_explanation: JSON.stringify({
      A: "ผิด — GOLD 1: FEV1 ≥ 80% predicted",
      B: "ถูก — GOLD 2 (Moderate): FEV1/FVC < 0.70 และ FEV1 50-79% predicted",
      C: "ผิด — GOLD 3: FEV1 30-49% predicted",
      D: "ผิด — GOLD 4: FEV1 < 30% predicted",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วย COPD GOLD 2 ไม่มี exacerbation บ่อย ควรเริ่มรักษาด้วยยาสูดพ่นชนิดใดเป็น maintenance therapy",
    choices: JSON.stringify(["SABA (Salbutamol) PRN เท่านั้น", "ICS (Fluticasone) เดี่ยว", "LAMA (Tiotropium) หรือ LABA เดี่ยว", "ICS/LABA ร่วมกัน"]),
    correct_answer: "C",
    explanation: "GOLD 2 ไม่มี exacerbation: LAMA หรือ LABA เป็น first-line monotherapy; ICS ไม่แนะนำใน COPD ที่ไม่มี eos สูง",
    detailed_explanation: JSON.stringify({
      A: "ผิด — SABA เป็น rescue ไม่ใช่ maintenance",
      B: "ผิด — ICS เดี่ยวไม่แนะนำใน COPD (แตกต่างจาก asthma)",
      C: "ถูก — GOLD 2 group A/B: LAMA (Tiotropium) หรือ LABA เป็น first-line maintenance",
      D: "ผิด — ICS/LABA ใช้ใน GOLD 3-4 หรือผู้มี ≥2 exacerbations/ปี หรือ eos ≥ 300",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 25 ปี โรคหืด (Asthma) ควบคุมไม่ได้ (uncontrolled) ใช้ Salbutamol inhaler > 3 ครั้ง/สัปดาห์ ยาที่ควรเพิ่มเป็น controller คือ",
    choices: JSON.stringify(["เพิ่ม SABA dose", "เริ่ม ICS low-dose (Budesonide/Beclomethasone)", "เริ่ม LABA เดี่ยว", "เริ่ม Theophylline"]),
    correct_answer: "B",
    explanation: "Uncontrolled asthma step up จาก SABA PRN → ICS low-dose เป็น standard controller",
    detailed_explanation: JSON.stringify({
      A: "ผิด — เพิ่ม SABA ไม่แก้ inflammation ที่เป็นสาเหตุ",
      B: "ถูก — ICS low-dose เป็น step 2 controller เป็น first-line เพื่อลด airway inflammation",
      C: "ผิด — LABA ไม่ควรใช้เดี่ยวใน asthma (FDA black box warning) ต้องใช้กับ ICS เสมอ",
      D: "ผิด — Theophylline แนะนำขั้นสูงกว่า มีผลข้างเคียงมาก",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 40 ปี Asthma ใช้ ICS/LABA (Symbicort) แล้วยังไม่ได้ผล แพทย์ต้องการเพิ่มยา add-on ตัวใด",
    choices: JSON.stringify(["เพิ่ม SABA ถี่ขึ้น", "Leukotriene receptor antagonist (Montelukast)", "Oral prednisolone ทุกวัน", "Ipratropium inhaler"]),
    correct_answer: "B",
    explanation: "LTRA (Montelukast) เป็น add-on therapy ที่แนะนำเมื่อ ICS/LABA ยังไม่เพียงพอ",
    detailed_explanation: JSON.stringify({
      A: "ผิด — SABA เพิ่มถี่ไม่ใช่การ step up ที่เหมาะสม",
      B: "ถูก — Montelukast เป็น add-on สำหรับ uncontrolled asthma บน ICS/LABA โดยเฉพาะกรณี allergic",
      C: "ผิด — Oral steroid ทุกวันเป็น last resort เพราะผลข้างเคียงมาก",
      D: "ผิด — Ipratropium (SAMA) เป็น rescue ใน acute asthma ไม่ใช่ add-on maintenance",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 50 ปี วินิจฉัย CAP (Community-Acquired Pneumonia) ไม่รุนแรง ไม่มีโรคร่วม ยา antibiotic first-line คือ",
    choices: JSON.stringify(["Amoxicillin-clavulanate", "Azithromycin", "Amoxicillin", "Ciprofloxacin"]),
    correct_answer: "C",
    explanation: "CAP ผู้ป่วย outpatient ไม่มีโรคร่วม: Amoxicillin เป็น first-line ตาม IDSA/ATS guidelines",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Amoxicillin-clavulanate ใช้เมื่อมี risk factors เช่น recent antibiotics, chronic disease",
      B: "ผิด — Azithromycin ใช้ได้แต่ Amoxicillin preferred เพราะ resistant S. pneumoniae น้อยกว่า",
      C: "ถูก — Amoxicillin 1g TID เป็น first-line สำหรับ outpatient CAP ไม่มีโรคร่วม",
      D: "ผิด — Fluoroquinolone สำรองสำหรับ β-lactam allergic หรือ severe cases",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 60 ปี COPD รุนแรง (FEV1 28%) มาด้วย acute exacerbation ของ COPD ควรให้ยาสูดพ่นใดก่อนเป็นอันดับแรก",
    choices: JSON.stringify(["ICS ขนาดสูง", "SABA + SAMA นาบิวไลเซอร์", "LABA เพียงอย่างเดียว", "Theophylline IV"]),
    correct_answer: "B",
    explanation: "Acute COPD exacerbation: SABA (Salbutamol) + SAMA (Ipratropium) nebulizer เป็น first-line bronchodilator",
    detailed_explanation: JSON.stringify({
      A: "ผิด — ICS ไม่ใช่ยา acute rescue",
      B: "ถูก — SABA + SAMA (Combivent nebulizer) เป็น short-acting bronchodilator first-line ใน acute COPD",
      C: "ผิด — LABA ออกฤทธิ์ช้าไม่เหมาะ acute",
      D: "ผิด — IV Theophylline ไม่แนะนำแล้วใน acute COPD (toxicity สูง ประสิทธิภาพต่ำ)",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 30 ปี ไอเรื้อรัง 3 สัปดาห์ ไข้ น้ำหนักลด เหงื่อออกกลางคืน X-ray ปอดพบ upper lobe infiltrate ตรวจ AFB smear positive วินิจฉัย Active Pulmonary TB ควรรักษาด้วย 2HRZE/4HR ยาตัวใดอาจทำให้ตาบอดสีแดง-เขียว",
    choices: JSON.stringify(["Isoniazid (H)", "Rifampicin (R)", "Pyrazinamide (Z)", "Ethambutol (E)"]),
    correct_answer: "D",
    explanation: "Ethambutol ทำให้เกิด optic neuritis → visual field defect + color blindness (red-green)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Isoniazid ผลข้างเคียงหลัก: peripheral neuropathy, hepatotoxicity",
      B: "ผิด — Rifampicin ผลข้างเคียงหลัก: hepatotoxicity, เปลี่ยนสีปัสสาวะเป็นส้ม, drug interaction",
      C: "ผิด — Pyrazinamide ผลข้างเคียงหลัก: hepatotoxicity, hyperuricemia",
      D: "ถูก — Ethambutol: optic neuritis → visual acuity ลด + red-green color blindness ต้องตรวจตาก่อนเริ่ม",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 22 ปี สัมผัส TB (ผู้ป่วยในบ้านเดียวกัน) Tuberculin skin test 12 mm ตรวจ X-ray ปอดปกติ HIV negative ควรให้การรักษาใด",
    choices: JSON.stringify(["ไม่จำเป็นต้องรักษา เฝ้าสังเกต", "Isoniazid preventive therapy (IPT) 9 เดือน", "2HRZE/4HR full course", "Rifampicin เดี่ยว 4 เดือน"]),
    correct_answer: "B",
    explanation: "Latent TB infection (LTBI): TST ≥ 10 mm ในผู้สัมผัส → ให้ INH preventive therapy 9 เดือน",
    detailed_explanation: JSON.stringify({
      A: "ผิด — TST ≥ 10 mm ในผู้สัมผัส TB หมายถึง LTBI ต้องรักษาป้องกัน",
      B: "ถูก — INH 300 mg OD × 9 เดือน เป็น standard LTBI treatment (WHO/CDC)",
      C: "ผิด — Full TB treatment ใช้ใน active TB ไม่ใช่ LTBI",
      D: "ผิด — Rifampicin เดี่ยว 4 เดือน ทางเลือกได้แต่ไม่ใช่ first-line ที่นิยม",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 45 ปี Asthma มีการใช้ยา MDI (Metered Dose Inhaler) ไม่ถูกวิธี เภสัชกรต้องสอนเทคนิคที่สำคัญที่สุดอะไร",
    choices: JSON.stringify(["กดยาพร้อมกับเริ่มหายใจเข้าช้าๆ ลึกๆ", "หายใจออกหลังกดยาทันที", "กดยาพร้อมหายใจเข้าเร็วๆ", "ไม่ต้องกลั้นหายใจหลังสูด"]),
    correct_answer: "A",
    explanation: "เทคนิค MDI ที่ถูกต้อง: กดยาพร้อมเริ่มหายใจเข้าช้าๆ ลึก จากนั้นกลั้นหายใจ 10 วินาที",
    detailed_explanation: JSON.stringify({
      A: "ถูก — Coordinate actuation กับ slow deep inhalation เพื่อให้ยาเข้าปอดได้มากที่สุด",
      B: "ผิด — ต้องกลั้นหายใจ 10 วินาที ไม่ใช่หายใจออกทันที",
      C: "ผิด — หายใจเร็วทำให้ยาชนท้ายคอมากขึ้น ไม่ถึงปอด",
      D: "ผิด — กลั้นหายใจ 10 วินาทีสำคัญมากเพื่อให้ยาตกตะกอนในทางเดินหายใจ",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 65 ปี COPD ได้รับ Tiotropium Handihaler มา 6 เดือน มีผลข้างเคียงที่ควรระวังอะไร",
    choices: JSON.stringify(["ไอแห้งเรื้อรัง", "ปากแห้ง คอแห้ง ปัสสาวะลำบาก", "ผื่นคัน angioedema", "Hypokalemia"]),
    correct_answer: "B",
    explanation: "Tiotropium เป็น LAMA (Muscarinic antagonist) → anticholinergic effects: ปากแห้ง, ปัสสาวะลำบาก, ท้องผูก",
    detailed_explanation: JSON.stringify({
      A: "ผิด — ไอแห้งเป็นผลข้างเคียงของ ACE inhibitor ไม่ใช่ LAMA",
      B: "ถูก — Anticholinergic effects: dry mouth, urinary retention (ระวังในผู้ชายสูงอายุที่มี BPH), constipation",
      C: "ผิด — Angioedema ไม่ใช่ผลของ muscarinic antagonist",
      D: "ผิด — Hypokalemia เป็นผลของ beta-2 agonist ไม่ใช่ LAMA",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 35 ปี Asthma ระหว่างตั้งครรภ์ ยาสูดพ่น ICS ตัวใดที่มีข้อมูลความปลอดภัยมากที่สุดในหญิงตั้งครรภ์",
    choices: JSON.stringify(["Fluticasone propionate", "Budesonide", "Beclomethasone dipropionate", "Ciclesonide"]),
    correct_answer: "B",
    explanation: "Budesonide มีข้อมูล pregnancy safety category B มากที่สุด (FDA category B) และ NAEPP แนะนำ",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Fluticasone category C",
      B: "ถูก — Budesonide: FDA category B เป็น preferred ICS ระหว่างตั้งครรภ์ (NAEPP guideline)",
      C: "ผิด — BDP category C",
      D: "ผิด — Ciclesonide ข้อมูลน้อยกว่า",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 72 ปี COPD รุนแรง มี FEV1 28% มี chronic hypoxemia (SpO2 88%) ในชีวิตประจำวัน ควรให้ Long-term Oxygen Therapy (LTOT) ที่เป้าหมาย SpO2 ใด",
    choices: JSON.stringify(["SpO2 ≥ 88%", "SpO2 ≥ 90%", "SpO2 ≥ 94%", "SpO2 ≥ 98%"]),
    correct_answer: "B",
    explanation: "LTOT target สำหรับ COPD: SpO2 ≥ 90% (PaO2 ≥ 60 mmHg) ป้องกัน hypoxic pulmonary vasoconstriction",
    detailed_explanation: JSON.stringify({
      A: "ผิด — 88% ต่ำเกินไป อาจยังเกิด organ hypoxia",
      B: "ถูก — GOLD guideline: เป้าหมาย SpO2 88-92% สำหรับ COPD (เพื่อหลีกเลี่ยง hypercapnia จาก high O2)",
      C: "ผิด — SpO2 > 94% ใน COPD อาจกด respiratory drive → hypercapnia",
      D: "ผิด — 98% อันตรายใน COPD severe",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 28 ปี มาด้วย acute severe asthma exacerbation ที่ ER ให้ nebulized Salbutamol + Ipratropium แล้ว SpO2 ยังต่ำ 88% ยาที่ควรให้เสริมต่อคือ",
    choices: JSON.stringify(["Oral Prednisolone 40 mg", "IV Methylprednisolone 1 mg/kg", "IV Magnesium sulfate 2 g", "Subcutaneous Epinephrine"]),
    correct_answer: "C",
    explanation: "Severe asthma ไม่ตอบสนองต่อ bronchodilator: IV Magnesium sulfate เป็น adjunct therapy ที่แนะนำ",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Oral steroid ดูดซึมช้าเกิน ใน acute severe ต้องการ IV",
      B: "ผิด — IV Methylprednisolone ควรให้ด้วยแต่ไม่ใช่ answer หลัก ใช้ร่วมกัน",
      C: "ถูก — IV Magnesium sulfate 2g ใน 20 นาที ลด bronchospasm ใน acute severe asthma ที่ refractory",
      D: "ผิด — Epinephrine SQ ใช้ใน anaphylaxis ไม่ใช่ asthma acute ทั่วไป",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 58 ปี COPD ใช้ Tiotropium Handihaler มา 3 ปี เภสัชกรสังเกตว่าผู้ป่วยกด capsule ก่อน inhale ไม่ถูก วิธีที่ถูกต้องของ Handihaler คือ",
    choices: JSON.stringify(["กดปุ่มด้านข้าง 2 ครั้งเพื่อเปิดยา แล้วหายใจเข้า", "ใส่ capsule เจาะด้วย Handihaler แล้วหายใจเข้าช้าๆ", "เขย่าก่อนใช้แล้วกดยาพร้อมหายใจ", "กดปุ่มค้างไว้ขณะหายใจเข้า"]),
    correct_answer: "B",
    explanation: "Handihaler: ใส่ capsule → ปิดฝา → กดปุ่มเจาะ 1 ครั้ง → หายใจออก → วางปากที่ mouthpiece → หายใจเข้าช้าลึก",
    detailed_explanation: JSON.stringify({
      A: "ผิด — ไม่ใช่กดปุ่ม 2 ครั้ง การเจาะ capsule ทำด้วยปุ่มด้านข้าง 1 ครั้ง",
      B: "ถูก — Handihaler: ใส่ capsule → close → pierce with side button → slow deep inhalation → breath hold 10 sec",
      C: "ผิด — Handihaler เป็น DPI ไม่ต้องกดยาพร้อมหายใจ (ไม่ใช่ MDI)",
      D: "ผิด — ไม่มีการกดค้างขณะหายใจ",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 48 ปี ไอเรื้อรัง 3 สัปดาห์ เจ็บหน้าอก ใช้ ACE inhibitor (Enalapril) มา 6 เดือน สาเหตุของไอน่าจะเป็นอะไร",
    choices: JSON.stringify(["Asthma", "GERD", "ACE inhibitor-induced cough", "Post-nasal drip"]),
    correct_answer: "C",
    explanation: "ACE inhibitor เพิ่ม bradykinin → ไอแห้ง เป็น class effect พบใน 10-15% ของผู้ใช้ (คนเอเชียสูงกว่า ~30-40%)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Asthma ไอมักเป็นๆ หายๆ หรือมี wheeze หายใจหอบ",
      B: "ผิด — GERD ไอมักหลังกินอาหาร นอนราบ",
      C: "ถูก — ACE inhibitor cough เป็น class effect เกิดจาก bradykinin/substance P สะสม แก้โดยเปลี่ยนเป็น ARB",
      D: "ผิด — Post-nasal drip มักมีน้ำมูกลงคอ ไม่สัมพันธ์กับยา",
    }),
    difficulty: "easy",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} pulmonary questions...`);
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
  console.log(`\nDone! ${questions.length} questions inserted for ปอด`);
}

seed().catch(console.error);
