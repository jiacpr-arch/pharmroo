const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "3c30613d-83c7-4be5-b3e3-ee9240e7552a"; // ต่อมไร้ท่อ

const questions = [
  {
    question: "ผู้ป่วยเบาหวานชนิดที่ 2 รายใหม่ ไม่มีโรคร่วม ค่า HbA1c = 8.5% แพทย์ต้องการเริ่มยาเม็ดลดน้ำตาล ยาตัวแรกที่ควรเลือกคือข้อใด",
    choices: [
      { label: "A", text: "Glibenclamide" },
      { label: "B", text: "Metformin" },
      { label: "C", text: "Sitagliptin" },
      { label: "D", text: "Pioglitazone" },
      { label: "E", text: "Acarbose" },
    ],
    correct_answer: "B",
    explanation: "Metformin เป็นยาลำดับแรกสำหรับเบาหวานชนิดที่ 2 ตาม ADA guideline เนื่องจากมีประสิทธิภาพสูง ราคาถูก ปลอดภัย และลด cardiovascular mortality",
    detailed_explanation: {
      summary: "Metformin คือยาลำดับแรก (first-line) สำหรับ DM type 2 ตาม ADA/EASD guidelines",
      reason: "Metformin ลด HbA1c ได้ 1-2% มีหลักฐานลด cardiovascular event ปลอดภัย ไม่ทำให้น้ำหนักขึ้น ราคาถูก และไม่ทำให้ hypoglycemia เมื่อใช้เดี่ยว",
      choices: [
        { label: "A", text: "Glibenclamide", explanation: "✗ ผิด — Sulfonylurea ไม่ใช่ยาลำดับแรก เสี่ยง hypoglycemia และน้ำหนักขึ้น" },
        { label: "B", text: "Metformin", explanation: "✓ ถูก — First-line therapy สำหรับ DM type 2 ทุก guideline ระดับโลก" },
        { label: "C", text: "Sitagliptin", explanation: "✗ ผิด — DPP-4 inhibitor เป็น second-line ราคาแพง ประสิทธิภาพน้อยกว่า metformin" },
        { label: "D", text: "Pioglitazone", explanation: "✗ ผิด — TZD ทำให้น้ำหนักขึ้น บวมน้ำ และเสี่ยงต่อ heart failure" },
        { label: "E", text: "Acarbose", explanation: "✗ ผิด — Alpha-glucosidase inhibitor ประสิทธิภาพต่ำ ผลข้างเคียงทางเดินอาหารมาก" },
      ],
      key_takeaway: "Metformin = first-line DM type 2 เว้นแต่มีข้อห้าม (eGFR < 30, ตับวาย, ภาวะขาดออกซิเจน)",
    },
    difficulty: "easy",
  },
  {
    question: "ผู้ป่วย DM type 2 มี eGFR = 25 mL/min/1.73m² ยาใดในกลุ่มต่อไปนี้ที่ควรหลีกเลี่ยงที่สุด",
    choices: [
      { label: "A", text: "Insulin glargine" },
      { label: "B", text: "Sitagliptin (ปรับขนาด)" },
      { label: "C", text: "Metformin" },
      { label: "D", text: "Repaglinide" },
      { label: "E", text: "Glipizide" },
    ],
    correct_answer: "C",
    explanation: "Metformin ห้ามใช้เมื่อ eGFR < 30 mL/min/1.73m² เนื่องจากเสี่ยงต่อ lactic acidosis จากการสะสมของยา",
    detailed_explanation: {
      summary: "Metformin มีข้อห้ามใช้ใน CKD stage 4-5 (eGFR < 30)",
      reason: "Metformin ขับออกทางไตเป็นหลัก เมื่อไตเสื่อม ยาสะสมทำให้เกิด lactic acidosis ซึ่งอันตรายถึงชีวิต FDA แนะนำพิจารณาความเสี่ยงเมื่อ eGFR 30-45 และห้ามใช้เมื่อ eGFR < 30",
      choices: [
        { label: "A", text: "Insulin glargine", explanation: "✗ ผิด — Insulin ไม่ขับทางไต ใช้ได้ใน CKD แต่ต้องระวัง hypoglycemia" },
        { label: "B", text: "Sitagliptin (ปรับขนาด)", explanation: "✗ ผิด — DPP-4 inhibitor ใช้ได้ใน CKD แต่ต้องลดขนาดยา" },
        { label: "C", text: "Metformin", explanation: "✓ ถูก — ห้ามใช้เมื่อ eGFR < 30 เสี่ยง lactic acidosis" },
        { label: "D", text: "Repaglinide", explanation: "✗ ผิด — Repaglinide ขับทางอุจจาระเป็นหลัก ใช้ได้ใน CKD" },
        { label: "E", text: "Glipizide", explanation: "✗ ผิด — Glipizide ใช้ได้ใน CKD ดีกว่า glibenclamide เพราะ metabolite ไม่ active" },
      ],
      key_takeaway: "Metformin: ห้ามใช้ eGFR < 30, ระวัง eGFR 30-45, หยุดก่อนฉีด contrast",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยเบาหวานชนิดที่ 1 อายุ 22 ปี มาด้วยคลื่นไส้ อาเจียน หายใจหอบ ลึก (Kussmaul breathing) ระดับน้ำตาล 450 mg/dL ควรรักษาด้วยวิธีใดก่อน",
    choices: [
      { label: "A", text: "ให้ sodium bicarbonate IV ทันที" },
      { label: "B", text: "ให้ Regular insulin IV infusion และสารน้ำ 0.9% NaCl" },
      { label: "C", text: "ให้ insulin glargine ฉีดใต้ผิวหนัง" },
      { label: "D", text: "ให้ glucose 50% IV เพื่อป้องกัน hypoglycemia" },
      { label: "E", text: "ให้ metformin ทางปาก" },
    ],
    correct_answer: "B",
    explanation: "DKA รักษาด้วย Regular insulin IV infusion ร่วมกับ 0.9% NSS เพื่อแก้ไข dehydration และ hyperglycemia พร้อมแก้ electrolyte imbalance",
    detailed_explanation: {
      summary: "DKA (Diabetic Ketoacidosis) รักษาด้วย IV fluid + Regular insulin IV",
      reason: "DKA เกิดจากขาด insulin ทำให้ ketone สะสม เลือดเป็นกรด การรักษาหลัก: (1) IV fluid NSS ชดเชย dehydration, (2) Regular insulin IV 0.1 unit/kg/hr ยับยั้ง ketogenesis, (3) แก้ electrolyte โดยเฉพาะ K+",
      choices: [
        { label: "A", text: "ให้ sodium bicarbonate IV ทันที", explanation: "✗ ผิด — NaHCO3 ใน DKA ใช้เฉพาะ pH < 6.9 เท่านั้น ไม่ใช่ first-line" },
        { label: "B", text: "ให้ Regular insulin IV infusion และสารน้ำ 0.9% NaCl", explanation: "✓ ถูก — มาตรฐานการรักษา DKA: IV fluid + Regular insulin IV infusion" },
        { label: "C", text: "ให้ insulin glargine ฉีดใต้ผิวหนัง", explanation: "✗ ผิด — Long-acting insulin ไม่เหมาะใน DKA ต้องการ Regular insulin IV ที่ออกฤทธิ์เร็วและปรับได้" },
        { label: "D", text: "ให้ glucose 50% IV เพื่อป้องกัน hypoglycemia", explanation: "✗ ผิด — ผู้ป่วยน้ำตาล 450 mg/dL ไม่ต้องการ glucose ตอนนี้ (ให้ D5 เมื่อน้ำตาลลดถึง 200-250 mg/dL)" },
        { label: "E", text: "ให้ metformin ทางปาก", explanation: "✗ ผิด — Metformin ห้ามใช้ใน DKA และไม่มีฤทธิ์เพียงพอ" },
      ],
      key_takeaway: "DKA: IV NSS + Regular insulin IV + KCl replacement + monitor glucose/electrolytes",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยเบาหวานได้รับ insulin NPH ก่อนนอน พบว่ามีระดับน้ำตาลตอนเช้าสูงกว่าปกติ (Fasting hyperglycemia) หากต้องการแยก Somogyi effect ออกจาก Dawn phenomenon ควรตรวจน้ำตาลเพิ่มเติมเวลาใด",
    choices: [
      { label: "A", text: "02:00-03:00 น." },
      { label: "B", text: "06:00 น." },
      { label: "C", text: "08:00 น." },
      { label: "D", text: "12:00 น." },
      { label: "E", text: "18:00 น." },
    ],
    correct_answer: "A",
    explanation: "ตรวจน้ำตาลช่วง 02:00-03:00 น. หากต่ำ = Somogyi effect (rebound hyperglycemia หลัง nocturnal hypoglycemia) หากปกติหรือสูง = Dawn phenomenon",
    detailed_explanation: {
      summary: "แยก Somogyi vs Dawn phenomenon ด้วยการตรวจน้ำตาลตี 2-3",
      reason: "Somogyi effect: NPH ออกฤทธิ์สูงสุดตี 2-3 ทำให้ hypoglycemia → counter-regulatory hormones หลั่ง → rebound hyperglycemia ตอนเช้า | Dawn phenomenon: GH/cortisol สูงตอนเช้าตรู่ → ดื้อ insulin → น้ำตาลสูงตอนเช้า",
      choices: [
        { label: "A", text: "02:00-03:00 น.", explanation: "✓ ถูก — ตรวจตี 2-3 เพื่อดูว่ามี nocturnal hypoglycemia หรือไม่ แยก Somogyi vs Dawn" },
        { label: "B", text: "06:00 น.", explanation: "✗ ผิด — สายเกินไป ทั้ง Somogyi และ Dawn จะให้ผลน้ำตาลสูงเหมือนกันตอนเช้า" },
        { label: "C", text: "08:00 น.", explanation: "✗ ผิด — เป็นเวลา fasting ที่ตรวจอยู่แล้ว ไม่ช่วยแยก" },
        { label: "D", text: "12:00 น.", explanation: "✗ ผิด — ไม่เกี่ยวข้องกับ nocturnal mechanism" },
        { label: "E", text: "18:00 น.", explanation: "✗ ผิด — ไม่เกี่ยวข้อง" },
      ],
      key_takeaway: "Somogyi: ตี 2-3 ต่ำ → ลด NPH | Dawn: ตี 2-3 ปกติ → เพิ่ม NPH หรือเปลี่ยนเป็น insulin glargine",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 35 ปี มาด้วยใจสั่น น้ำหนักลด ขี้ร้อน มือสั่น ตรวจพบ TSH < 0.01 mIU/L, Free T4 สูง วินิจฉัย Graves' disease ยาที่เหมาะสมที่สุดในการควบคุมอาการเร็วคือ",
    choices: [
      { label: "A", text: "Methimazole เพียงอย่างเดียว" },
      { label: "B", text: "Propranolol ร่วมกับ Methimazole" },
      { label: "C", text: "Levothyroxine" },
      { label: "D", text: "Radioactive iodine ทันที" },
      { label: "E", text: "Potassium iodide เพียงอย่างเดียว" },
    ],
    correct_answer: "B",
    explanation: "Propranolol ควบคุมอาการ sympathetic (ใจสั่น มือสั่น) ได้รวดเร็ว ส่วน Methimazole ยับยั้งการสร้างฮอร์โมนไทรอยด์ใหม่ ใช้ร่วมกันเพื่อผลลัพธ์ที่ดีที่สุด",
    detailed_explanation: {
      summary: "Graves' disease: Methimazole + Propranolol เพื่อควบคุมทั้ง hormone synthesis และอาการ",
      reason: "Methimazole ยับยั้ง thyroid peroxidase หยุดสร้าง T3/T4 ใหม่ แต่ต้องใช้เวลา 4-8 สัปดาห์ Propranolol ลดอาการ adrenergic ได้ทันทีและยับยั้ง T4→T3 conversion บางส่วน",
      choices: [
        { label: "A", text: "Methimazole เพียงอย่างเดียว", explanation: "✗ ผิด — ใช้ได้แต่ไม่ควบคุมอาการเฉียบพลัน ต้องรอสัปดาห์กว่าจะเห็นผล" },
        { label: "B", text: "Propranolol ร่วมกับ Methimazole", explanation: "✓ ถูก — Propranolol บรรเทาอาการเร็ว + Methimazole แก้ที่ต้นเหตุ" },
        { label: "C", text: "Levothyroxine", explanation: "✗ ผิด — ห้ามใช้ใน hyperthyroidism จะทำให้อาการแย่ลง" },
        { label: "D", text: "Radioactive iodine ทันที", explanation: "✗ ผิด — RAI เป็นทางเลือกระยะยาว ไม่ใช่ acute control ห้ามใช้ในหญิงตั้งครรภ์" },
        { label: "E", text: "Potassium iodide เพียงอย่างเดียว", explanation: "✗ ผิด — KI ใช้เฉพาะในกรณี thyroid storm หรือก่อนผ่าตัด ไม่ใช่ long-term treatment" },
      ],
      key_takeaway: "Hyperthyroidism: Methimazole (ATD) + Beta-blocker สำหรับอาการ | PTU ใช้ใน T1 pregnancy/thyroid storm",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยหญิงตั้งครรภ์ไตรมาสแรก ตรวจพบ hyperthyroidism ยาต้านไทรอยด์ที่เหมาะสมที่สุดในช่วงนี้คือ",
    choices: [
      { label: "A", text: "Methimazole" },
      { label: "B", text: "Propylthiouracil (PTU)" },
      { label: "C", text: "Carbimazole" },
      { label: "D", text: "Radioactive iodine" },
      { label: "E", text: "ไม่รักษา รอจนคลอด" },
    ],
    correct_answer: "B",
    explanation: "PTU เป็นยาที่เลือกในไตรมาสแรกของการตั้งครรภ์ เนื่องจาก Methimazole สัมพันธ์กับ aplasia cutis และ choanal atresia ในทารก",
    detailed_explanation: {
      summary: "Hyperthyroidism ในหญิงตั้งครรภ์: PTU ใน T1, สามารถเปลี่ยนเป็น Methimazole ใน T2-T3",
      reason: "Methimazole มี teratogenic effect ใน T1 (aplasia cutis, choanal/esophageal atresia) PTU ปลอดภัยกว่าใน T1 แต่มีความเสี่ยง hepatotoxicity จึงแนะนำเปลี่ยนเป็น methimazole ใน T2 Radioactive iodine ห้ามใช้ในหญิงตั้งครรภ์",
      choices: [
        { label: "A", text: "Methimazole", explanation: "✗ ผิด — Teratogenic ใน T1: aplasia cutis, choanal atresia ห้ามใช้ใน T1" },
        { label: "B", text: "Propylthiouracil (PTU)", explanation: "✓ ถูก — Drug of choice ใน T1 pregnancy สำหรับ hyperthyroidism" },
        { label: "C", text: "Carbimazole", explanation: "✗ ผิด — Prodrug ของ methimazole มีข้อห้ามเช่นเดียวกัน" },
        { label: "D", text: "Radioactive iodine", explanation: "✗ ผิด — Absolute contraindication ในหญิงตั้งครรภ์ ทำลาย thyroid ทารก" },
        { label: "E", text: "ไม่รักษา รอจนคลอด", explanation: "✗ ผิด — Uncontrolled hyperthyroidism เสี่ยง preeclampsia, preterm, thyroid storm" },
      ],
      key_takeaway: "Pregnancy hyperthyroidism: PTU ใน T1 → switch Methimazole ใน T2-T3 | RAI ห้ามใช้ตลอดการตั้งครรภ์",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยชายอายุ 55 ปี มาด้วยอ่อนเพลีย น้ำหนักขึ้น ขี้หนาว ท้องผูก ผิวแห้ง ตรวจพบ TSH สูง Free T4 ต่ำ วินิจฉัย Primary hypothyroidism การรักษาที่เหมาะสมคือ",
    choices: [
      { label: "A", text: "Propylthiouracil" },
      { label: "B", text: "Levothyroxine (T4)" },
      { label: "C", text: "Liothyronine (T3)" },
      { label: "D", text: "Methimazole" },
      { label: "E", text: "Radioactive iodine" },
    ],
    correct_answer: "B",
    explanation: "Levothyroxine (synthetic T4) เป็น drug of choice สำหรับ hypothyroidism มี half-life ยาว (7 วัน) ให้ครั้งเดียวต่อวัน และร่างกายแปลงเป็น T3 เองตามความต้องการ",
    detailed_explanation: {
      summary: "Hypothyroidism รักษาด้วย Levothyroxine (T4) ปรับขนาดตาม TSH",
      reason: "T4 (levothyroxine) มี t½ ~7 วัน ให้วันละครั้ง ตอนเช้าก่อนอาหาร 30-60 นาที ร่างกาย deiodinase แปลง T4→T3 ตามความต้องการ ปรับขนาดทุก 6-8 สัปดาห์โดยดู TSH เป้าหมาย TSH = 0.5-2.5 mIU/L",
      choices: [
        { label: "A", text: "Propylthiouracil", explanation: "✗ ผิด — PTU ยับยั้งการสร้าง thyroid hormone ใช้ใน hyperthyroidism ไม่ใช่ hypo" },
        { label: "B", text: "Levothyroxine (T4)", explanation: "✓ ถูก — Drug of choice สำหรับ hypothyroidism ทุกชนิด" },
        { label: "C", text: "Liothyronine (T3)", explanation: "✗ ผิด — T3 t½ สั้น ต้องให้หลายครั้ง/วัน ไม่เหมาะเป็น routine ใช้ใน myxedema coma" },
        { label: "D", text: "Methimazole", explanation: "✗ ผิด — Methimazole ใช้ใน hyperthyroidism" },
        { label: "E", text: "Radioactive iodine", explanation: "✗ ผิด — RAI ทำลาย thyroid ใช้รักษา hyperthyroidism หรือ thyroid cancer" },
      ],
      key_takeaway: "Hypothyroidism: Levothyroxine วันละครั้งตอนเช้าท้องว่าง เป้าหมาย TSH 0.5-2.5 | ตั้งครรภ์: เป้าหมาย TSH < 2.5",
    },
    difficulty: "easy",
  },
  {
    question: "ยาใดต่อไปนี้ที่ลด HbA1c ได้มากที่สุดเมื่อใช้เป็น monotherapy",
    choices: [
      { label: "A", text: "Sitagliptin" },
      { label: "B", text: "Acarbose" },
      { label: "C", text: "Insulin" },
      { label: "D", text: "Empagliflozin" },
      { label: "E", text: "Liraglutide" },
    ],
    correct_answer: "C",
    explanation: "Insulin เป็นยาที่มีประสิทธิภาพสูงสุดในการลด HbA1c ไม่มี ceiling effect ลดได้ไม่จำกัดขึ้นกับขนาดที่ใช้ ต่างจากยาเม็ดที่มี ceiling effect",
    detailed_explanation: {
      summary: "Insulin มีประสิทธิภาพลด HbA1c สูงสุด ไม่มี ceiling effect",
      reason: "การลด HbA1c โดยประมาณ: Insulin = ไม่จำกัด (ขึ้นกับ dose) | Metformin = 1-2% | Sulfonylurea = 1-2% | GLP-1 RA = 1-1.5% | SGLT2i = 0.5-1% | DPP-4i = 0.5-1% | Acarbose = 0.5-1%",
      choices: [
        { label: "A", text: "Sitagliptin", explanation: "✗ ผิด — DPP-4i ลด HbA1c ได้ ~0.5-1% เท่านั้น" },
        { label: "B", text: "Acarbose", explanation: "✗ ผิด — ลด HbA1c ได้ ~0.5-0.8% ประสิทธิภาพต่ำ" },
        { label: "C", text: "Insulin", explanation: "✓ ถูก — ไม่มี ceiling effect ลด HbA1c ได้ไม่จำกัด ขึ้นกับ dose ที่ใช้" },
        { label: "D", text: "Empagliflozin", explanation: "✗ ผิด — SGLT2i ลด HbA1c ได้ ~0.5-1% แต่มีประโยชน์ด้าน CV/renal protection" },
        { label: "E", text: "Liraglutide", explanation: "✗ ผิด — GLP-1 RA ลด HbA1c ได้ ~1-1.5% ดีกว่า DPP-4i แต่ยังน้อยกว่า insulin" },
      ],
      key_takeaway: "Insulin = most potent glucose-lowering agent | เลือกยาตาม patient profile ไม่ใช่แค่ HbA1c lowering",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วย DM type 2 ร่วมกับ Heart failure with reduced ejection fraction (HFrEF) ควรเพิ่มยากลุ่มใดเพื่อประโยชน์ด้าน cardiovascular outcome",
    choices: [
      { label: "A", text: "Sulfonylurea" },
      { label: "B", text: "Pioglitazone" },
      { label: "C", text: "SGLT2 inhibitor (Empagliflozin/Dapagliflozin)" },
      { label: "D", text: "DPP-4 inhibitor (Saxagliptin)" },
      { label: "E", text: "Acarbose" },
    ],
    correct_answer: "C",
    explanation: "SGLT2 inhibitors (empagliflozin, dapagliflozin) ลด hospitalization จาก heart failure และลด CV death ในผู้ป่วย DM+HF มีหลักฐานจาก EMPA-REG, DAPA-HF trials",
    detailed_explanation: {
      summary: "SGLT2i เป็น preferred agent ใน DM+HFrEF ลด HF hospitalization และ CV mortality",
      reason: "SGLT2i ลด afterload/preload ผ่าน glycosuria+natriuresis ลด sympathetic activation และมี direct cardioprotective effect EMPA-REG OUTCOME: empagliflozin ลด CV death 38% DAPA-HF: dapagliflozin ลด HF worsening แม้ใน non-DM",
      choices: [
        { label: "A", text: "Sulfonylurea", explanation: "✗ ผิด — ไม่มี CV benefit อาจเพิ่ม hypoglycemia ที่เป็นอันตรายใน HF" },
        { label: "B", text: "Pioglitazone", explanation: "✗ ผิด — TZD ห้ามใช้ใน HF เนื่องจากทำให้ fluid retention และ HF แย่ลง" },
        { label: "C", text: "SGLT2 inhibitor (Empagliflozin/Dapagliflozin)", explanation: "✓ ถูก — มีหลักฐานชัดเจนในการลด HF hospitalization และ CV death" },
        { label: "D", text: "DPP-4 inhibitor (Saxagliptin)", explanation: "✗ ผิด — Saxagliptin เพิ่มความเสี่ยง HF hospitalization จาก SAVOR-TIMI trial" },
        { label: "E", text: "Acarbose", explanation: "✗ ผิด — ไม่มีหลักฐาน CV benefit ใน HF" },
      ],
      key_takeaway: "DM + HFrEF: SGLT2i (empagliflozin/dapagliflozin) เป็น class I recommendation | หลีกเลี่ยง TZD และ saxagliptin",
    },
    difficulty: "hard",
  },
  {
    question: "GLP-1 receptor agonist มีประโยชน์ใดที่เหนือกว่ายากลุ่มอื่น ในผู้ป่วย DM type 2 ที่มีน้ำหนักตัวมาก",
    choices: [
      { label: "A", text: "ลด HbA1c ได้มากที่สุด" },
      { label: "B", text: "ลดน้ำหนักและลด cardiovascular events ในผู้มี established CVD" },
      { label: "C", text: "ราคาถูกและสะดวกที่สุด" },
      { label: "D", text: "ไม่มีผลข้างเคียงทางเดินอาหาร" },
      { label: "E", text: "ปลอดภัยในผู้ป่วย pancreatitis" },
    ],
    correct_answer: "B",
    explanation: "GLP-1 RA (liraglutide, semaglutide) ลดน้ำหนัก 3-5 kg และลด MACE (major adverse cardiovascular events) ในผู้ป่วย DM+CVD จาก LEADER, SUSTAIN-6 trials",
    detailed_explanation: {
      summary: "GLP-1 RA: ลดน้ำหนัก + CV protection ใน established CVD",
      reason: "GLP-1 RA ลด appetite และ gastric emptying → ลดน้ำหนัก ลด systolic BP และ LDL มีหลักฐาน CV benefit ใน established atherosclerotic CVD LEADER trial (liraglutide) และ SUSTAIN-6 (semaglutide) แสดง 13-26% ลด MACE",
      choices: [
        { label: "A", text: "ลด HbA1c ได้มากที่สุด", explanation: "✗ ผิด — Insulin ลด HbA1c ได้มากที่สุด GLP-1 RA ลดได้ ~1-1.5%" },
        { label: "B", text: "ลดน้ำหนักและลด cardiovascular events ในผู้มี established CVD", explanation: "✓ ถูก — จุดเด่นของ GLP-1 RA คือ weight loss + CV protection" },
        { label: "C", text: "ราคาถูกและสะดวกที่สุด", explanation: "✗ ผิด — GLP-1 RA ราคาแพงและส่วนใหญ่เป็นยาฉีด (ยกเว้น oral semaglutide)" },
        { label: "D", text: "ไม่มีผลข้างเคียงทางเดินอาหาร", explanation: "✗ ผิด — คลื่นไส้ อาเจียน ท้องเสีย เป็น side effect ที่พบบ่อยที่สุด" },
        { label: "E", text: "ปลอดภัยในผู้ป่วย pancreatitis", explanation: "✗ ผิด — GLP-1 RA ห้ามใช้หรือระวังในผู้มีประวัติ pancreatitis" },
      ],
      key_takeaway: "GLP-1 RA: ลดน้ำหนัก + CV benefit ใน established CVD | SE: คลื่นไส้ อาเจียน | ห้ามใน pancreatitis/MTC",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยได้รับ insulin มากเกินไป มีอาการเหงื่อออก ใจสั่น มือสั่น สับสน ระดับน้ำตาล 45 mg/dL ผู้ป่วยยังรู้สึกตัวดี การรักษาเบื้องต้นที่ถูกต้องคือ",
    choices: [
      { label: "A", text: "ฉีด glucagon 1 mg IM ทันที" },
      { label: "B", text: "ให้ glucose 50% IV 50 mL" },
      { label: "C", text: "ให้รับประทานน้ำตาลหรือน้ำผลไม้ 15-20 กรัม" },
      { label: "D", text: "ให้ octreotide IV" },
      { label: "E", text: "รอสังเกตอาการ ไม่ต้องรักษา" },
    ],
    correct_answer: "C",
    explanation: "ผู้ป่วยยังรู้สึกตัวดีและกลืนได้ → Rule of 15: ให้คาร์โบไฮเดรต 15-20 กรัม (น้ำผลไม้ กลูโคสเม็ด) รอ 15 นาที แล้วตรวจซ้ำ",
    detailed_explanation: {
      summary: "Hypoglycemia ในผู้ป่วยที่รู้สึกตัว: Rule of 15 — carbohydrate 15-20g ทางปาก",
      reason: "Rule of 15: ให้ carb 15-20g → รอ 15 นาที → ตรวจน้ำตาล ถ้ายังต่ำ ให้ซ้ำ ถ้าหมดสติ/กลืนไม่ได้ → IV glucose หรือ IM glucagon ห้ามให้ glucose IV ในผู้ที่ยังกลืนได้เพราะ invasive เกินไป",
      choices: [
        { label: "A", text: "ฉีด glucagon 1 mg IM ทันที", explanation: "✗ ผิด — Glucagon ใช้เมื่อผู้ป่วยหมดสติหรือกลืนไม่ได้ ผู้ป่วยนี้ยังรู้สึกตัวดี" },
        { label: "B", text: "ให้ glucose 50% IV 50 mL", explanation: "✗ ผิด — IV glucose ใช้เมื่อผู้ป่วยให้ทางปากไม่ได้ รู้สึกตัวดีให้ทางปากก่อน" },
        { label: "C", text: "ให้รับประทานน้ำตาลหรือน้ำผลไม้ 15-20 กรัม", explanation: "✓ ถูก — Rule of 15: carb 15-20g PO → ตรวจซ้ำ 15 นาที เหมาะสำหรับผู้ป่วยที่รู้สึกตัวดี" },
        { label: "D", text: "ให้ octreotide IV", explanation: "✗ ผิด — Octreotide ใช้ใน sulfonylurea-induced hypoglycemia ที่รุนแรง ไม่ใช่ first-line" },
        { label: "E", text: "รอสังเกตอาการ ไม่ต้องรักษา", explanation: "✗ ผิด — น้ำตาล 45 mg/dL ต้องรักษาทันที อาจเกิด seizure หรือหมดสติได้" },
      ],
      key_takeaway: "Hypoglycemia: รู้สึกตัว → carb 15-20g PO | หมดสติ → D50W IV หรือ glucagon IM/SC",
    },
    difficulty: "easy",
  },
  {
    question: "ผู้ป่วยได้รับการวินิจฉัย Cushing's syndrome จากการใช้ prednisolone ขนาดสูงนาน 6 เดือน แพทย์ต้องการหยุดยา วิธีที่ถูกต้องคือ",
    choices: [
      { label: "A", text: "หยุดยาทันทีเพราะสาเหตุเป็นยาภายนอก ไม่ใช่ต่อมหมวกไตเอง" },
      { label: "B", text: "ลดขนาดยาลงทีละน้อยอย่างช้าๆ (gradual tapering)" },
      { label: "C", text: "เปลี่ยนเป็น hydrocortisone ทันทีแล้วหยุดยาทันที" },
      { label: "D", text: "ให้ ketoconazole ก่อนหยุดยา" },
      { label: "E", text: "ผ่าตัดต่อมหมวกไตออก" },
    ],
    correct_answer: "B",
    explanation: "การใช้ corticosteroid นานทำให้ HPA axis ถูก suppress ต้องค่อยๆ ลดยาเพื่อให้ต่อมหมวกไตฟื้นตัว หยุดทันทีอาจเกิด adrenal crisis",
    detailed_explanation: {
      summary: "Exogenous Cushing's: ต้อง taper corticosteroid ช้าๆ ห้ามหยุดทันที",
      reason: "การใช้ corticosteroid ภายนอกนาน → HPA axis suppression → ต่อมหมวกไตฝ่อ หยุดทันทีเกิด adrenal insufficiency/crisis: hypotension, hyponatremia, hypoglycemia ต้อง taper ช้าๆ เพื่อให้ adrenal cortex ฟื้น",
      choices: [
        { label: "A", text: "หยุดยาทันทีเพราะสาเหตุเป็นยาภายนอก ไม่ใช่ต่อมหมวกไตเอง", explanation: "✗ ผิด — แม้สาเหตุเป็น exogenous แต่ HPA axis ถูก suppress แล้ว หยุดทันทีเกิด adrenal crisis" },
        { label: "B", text: "ลดขนาดยาลงทีละน้อยอย่างช้าๆ (gradual tapering)", explanation: "✓ ถูก — Standard of care: taper corticosteroid ช้าๆ ให้ HPA axis ฟื้นตัว" },
        { label: "C", text: "เปลี่ยนเป็น hydrocortisone ทันทีแล้วหยุดยาทันที", explanation: "✗ ผิด — ยังต้องค่อยๆ ลด hydrocortisone ด้วย" },
        { label: "D", text: "ให้ ketoconazole ก่อนหยุดยา", explanation: "✗ ผิด — Ketoconazole ใช้ลด cortisol ใน endogenous Cushing's ไม่ใช่กรณีนี้" },
        { label: "E", text: "ผ่าตัดต่อมหมวกไตออก", explanation: "✗ ผิด — ต่อมหมวกไตปกติ ปัญหาคือยาภายนอก ไม่ต้องผ่าตัด" },
      ],
      key_takeaway: "Corticosteroid > 3 สัปดาห์ → ต้อง taper | Adrenal crisis: ให้ hydrocortisone IV ทันที",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยชายอายุ 40 ปี มาด้วยปวดหัว ใจสั่น เหงื่อออกมาก ความดันโลหิตสูง 200/110 mmHg เป็นช่วงๆ ตรวจ 24-hr urine metanephrines สูง วินิจฉัย Pheochromocytoma ยาที่ต้องให้ก่อนผ่าตัดคือ",
    choices: [
      { label: "A", text: "Beta-blocker ก่อน" },
      { label: "B", text: "Alpha-blocker (Phenoxybenzamine) ก่อน แล้วค่อยเพิ่ม Beta-blocker" },
      { label: "C", text: "Alpha-blocker และ Beta-blocker พร้อมกัน" },
      { label: "D", text: "ACE inhibitor" },
      { label: "E", text: "Diuretic เพียงอย่างเดียว" },
    ],
    correct_answer: "B",
    explanation: "ต้องให้ Alpha-blocker ก่อนเสมอ (phenoxybenzamine หรือ doxazosin) อย่างน้อย 7-14 วัน แล้วค่อยเพิ่ม Beta-blocker ถ้าให้ Beta-blocker ก่อนจะเกิด unopposed alpha stimulation → hypertensive crisis",
    detailed_explanation: {
      summary: "Pheochromocytoma preoperative: Alpha-block ก่อน ALWAYS → จึงเพิ่ม Beta-block",
      reason: "Catecholamine กระตุ้นทั้ง α และ β receptor ถ้าให้ β-blocker ก่อน: α receptor ไม่ถูกบล็อก → vasoconstriction รุนแรง → hypertensive crisis Alpha-blocker ก่อน 7-14 วัน → ให้ beta-blocker ถ้า tachycardia/arrhythmia",
      choices: [
        { label: "A", text: "Beta-blocker ก่อน", explanation: "✗ ผิด — อันตราย! Beta-block ก่อน → unopposed alpha → severe hypertension, pulmonary edema" },
        { label: "B", text: "Alpha-blocker (Phenoxybenzamine) ก่อน แล้วค่อยเพิ่ม Beta-blocker", explanation: "✓ ถูก — Standard: alpha-block ก่อน 7-14 วัน ก่อนผ่าตัด จึงเพิ่ม beta-block" },
        { label: "C", text: "Alpha-blocker และ Beta-blocker พร้อมกัน", explanation: "✗ ผิด — ควร alpha-block ก่อนเพื่อให้แน่ใจว่า alpha blocked เพียงพอ" },
        { label: "D", text: "ACE inhibitor", explanation: "✗ ผิด — ไม่ใช่ยาที่เลือกใน pheochromocytoma" },
        { label: "E", text: "Diuretic เพียงอย่างเดียว", explanation: "✗ ผิด — ไม่ตรงเหตุ และทำให้ volume depletion แย่ลงก่อนผ่าตัด" },
      ],
      key_takeaway: "Pheo: Alpha-blocker FIRST (phenoxybenzamine) → then Beta-blocker | ห้าม Beta-block ก่อน!",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยได้รับการวินิจฉัย Primary Adrenal Insufficiency (Addison's disease) ยาทดแทนฮอร์โมนที่ต้องให้คือ",
    choices: [
      { label: "A", text: "Hydrocortisone อย่างเดียว" },
      { label: "B", text: "Hydrocortisone + Fludrocortisone" },
      { label: "C", text: "Dexamethasone อย่างเดียว" },
      { label: "D", text: "Fludrocortisone อย่างเดียว" },
      { label: "E", text: "Prednisolone + Spironolactone" },
    ],
    correct_answer: "B",
    explanation: "Primary adrenal insufficiency ขาดทั้ง glucocorticoid (cortisol) และ mineralocorticoid (aldosterone) ต้องทดแทนทั้งสอง: Hydrocortisone (glucocorticoid) + Fludrocortisone (mineralocorticoid)",
    detailed_explanation: {
      summary: "Addison's disease: ทดแทน glucocorticoid + mineralocorticoid",
      reason: "Primary AI: ต่อมหมวกไตเสียหาย → ขาดทั้ง cortisol และ aldosterone | Hydrocortisone: glucocorticoid ทดแทน (15-25 mg/day แบ่ง 2-3 ครั้ง) | Fludrocortisone: mineralocorticoid ทดแทน (0.05-0.1 mg/day) Secondary AI: ขาดแค่ glucocorticoid ไม่ต้องการ fludrocortisone",
      choices: [
        { label: "A", text: "Hydrocortisone อย่างเดียว", explanation: "✗ ผิด — เพียงพอสำหรับ secondary AI แต่ primary AI ขาด aldosterone ด้วย" },
        { label: "B", text: "Hydrocortisone + Fludrocortisone", explanation: "✓ ถูก — ทดแทนทั้ง glucocorticoid และ mineralocorticoid ครบ" },
        { label: "C", text: "Dexamethasone อย่างเดียว", explanation: "✗ ผิด — Dexamethasone ไม่มี mineralocorticoid activity และไม่เหมาะสำหรับ long-term replacement" },
        { label: "D", text: "Fludrocortisone อย่างเดียว", explanation: "✗ ผิด — มีแค่ mineralocorticoid effect ขาด glucocorticoid" },
        { label: "E", text: "Prednisolone + Spironolactone", explanation: "✗ ผิด — Spironolactone เป็น aldosterone antagonist ไม่ใช่ทดแทน" },
      ],
      key_takeaway: "Addison's: Hydrocortisone (GC) + Fludrocortisone (MC) | เพิ่มขนาดในภาวะเจ็บป่วย/ผ่าตัด (sick day rule)",
    },
    difficulty: "medium",
  },
  {
    question: "เป้าหมาย HbA1c ที่เหมาะสมสำหรับผู้ป่วยเบาหวานสูงอายุ (อายุ > 75 ปี) ที่มี multiple comorbidities และ life expectancy สั้น ตาม ADA guideline คือ",
    choices: [
      { label: "A", text: "< 6.5%" },
      { label: "B", text: "< 7.0%" },
      { label: "C", text: "< 7.5%" },
      { label: "D", text: "< 8.0-8.5%" },
      { label: "E", text: "ไม่ต้องควบคุม HbA1c" },
    ],
    correct_answer: "D",
    explanation: "ผู้สูงอายุที่มี comorbidity มาก อายุขัยสั้น เป้าหมาย HbA1c ผ่อนปรนได้ถึง < 8.0-8.5% เพื่อหลีกเลี่ยง hypoglycemia ที่อันตรายกว่าใน elderly",
    detailed_explanation: {
      summary: "HbA1c targets ตาม patient profile: สุขภาพดี < 7% | ปานกลาง < 7.5-8% | comorbid มาก < 8-8.5%",
      reason: "ADA แบ่ง elderly เป็น 3 กลุ่ม: Healthy (few chronic conditions, good functional status): < 7-7.5% | Complex (multiple comorbidities): < 8% | Very complex/poor health: < 8.5% Hypoglycemia ในผู้สูงอายุอันตรายกว่า → ล้ม → กระดูกหัก → เสียชีวิต",
      choices: [
        { label: "A", text: "< 6.5%", explanation: "✗ ผิด — เข้มงวดเกินไปสำหรับ elderly comorbid เสี่ยง hypoglycemia สูง" },
        { label: "B", text: "< 7.0%", explanation: "✗ ผิด — เหมาะสำหรับ healthy younger adults ไม่ใช่ elderly comorbid" },
        { label: "C", text: "< 7.5%", explanation: "✗ ผิด — เหมาะสำหรับ elderly ที่สุขภาพพอดี แต่ไม่ใช่ very complex" },
        { label: "D", text: "< 8.0-8.5%", explanation: "✓ ถูก — เหมาะสำหรับ elderly ที่ multiple comorbidities/life expectancy สั้น" },
        { label: "E", text: "ไม่ต้องควบคุม HbA1c", explanation: "✗ ผิด — ยังต้องควบคุมอาการ hyperglycemia (polyuria, infection) แม้ผ่อนปรนเป้าหมาย" },
      ],
      key_takeaway: "Elderly DM: individualize target | Healthy < 7-7.5% | Complex < 8% | Very complex < 8.5% | หลีกเลี่ยง hypoglycemia",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 28 ปี ได้รับการวินิจฉัย SIADH (Syndrome of Inappropriate ADH secretion) Na = 118 mEq/L ไม่มีอาการ seizure/coma การรักษาเบื้องต้นที่เหมาะสมคือ",
    choices: [
      { label: "A", text: "ให้ 3% NaCl IV อย่างเร็ว" },
      { label: "B", text: "จำกัดน้ำ (fluid restriction) 800-1000 mL/วัน" },
      { label: "C", text: "ให้ 0.9% NaCl IV" },
      { label: "D", text: "ให้ furosemide ขนาดสูง" },
      { label: "E", text: "ให้ aldosterone" },
    ],
    correct_answer: "B",
    explanation: "SIADH ที่ไม่มีอาการรุนแรง รักษาด้วยการจำกัดน้ำ (fluid restriction) เป็น first-line เพื่อให้ร่างกายขับน้ำส่วนเกินออก",
    detailed_explanation: {
      summary: "SIADH: mild-moderate → fluid restriction | severe/symptomatic → 3% NaCl",
      reason: "SIADH: ADH หลั่งมากเกินโดยไม่เหมาะสม → ไตดูดน้ำกลับมาก → dilutional hyponatremia Fluid restriction ลดน้ำเข้า → Na ค่อยๆ สูงขึ้น ไม่เกิน 8-10 mEq/L/24hr (ป้องกัน osmotic demyelination syndrome) 3% NaCl ใช้เมื่อ symptomatic (seizure, altered consciousness)",
      choices: [
        { label: "A", text: "ให้ 3% NaCl IV อย่างเร็ว", explanation: "✗ ผิด — 3% NaCl ใช้ใน symptomatic hyponatremia (seizure/coma) การแก้เร็วเกินเสี่ยง osmotic demyelination" },
        { label: "B", text: "จำกัดน้ำ (fluid restriction) 800-1000 mL/วัน", explanation: "✓ ถูก — First-line ใน asymptomatic/mild SIADH ลด free water intake" },
        { label: "C", text: "ให้ 0.9% NaCl IV", explanation: "✗ ผิด — Isotonic saline ใน SIADH อาจทำให้ hyponatremia แย่ลงได้" },
        { label: "D", text: "ให้ furosemide ขนาดสูง", explanation: "✗ ผิด — Furosemide ใช้เสริมร่วมกับ salt tablet ใน SIADH บางราย ไม่ใช่ first-line" },
        { label: "E", text: "ให้ aldosterone", explanation: "✗ ผิด — ไม่ใช่การรักษา SIADH aldosterone เพิ่ม Na retention แต่ไม่ใช่กลไกของ SIADH" },
      ],
      key_takeaway: "SIADH: Na ต่ำ + urine concentrated + euvolemic | Rx: fluid restriction | Severe: 3% NaCl แก้ไม่เกิน 8-10 mEq/L/24hr",
    },
    difficulty: "hard",
  },
  {
    question: "Insulin ชนิดใดที่มีระยะออกฤทธิ์นานที่สุดและไม่มี peak effect ทำให้เสี่ยง nocturnal hypoglycemia น้อยที่สุด",
    choices: [
      { label: "A", text: "Insulin NPH" },
      { label: "B", text: "Insulin Regular" },
      { label: "C", text: "Insulin Lispro" },
      { label: "D", text: "Insulin Glargine (U-100)" },
      { label: "E", text: "Insulin 70/30" },
    ],
    correct_answer: "D",
    explanation: "Insulin Glargine (U-100) มีระยะออกฤทธิ์ ~24 ชั่วโมง ไม่มี peak effect ทำให้ระดับ insulin คงที่ตลอดวัน เสี่ยง nocturnal hypoglycemia น้อยกว่า NPH",
    detailed_explanation: {
      summary: "Insulin kinetics: Glargine/Degludec = peakless long-acting | NPH = intermediate มี peak",
      reason: "NPH: onset 2-4h, peak 4-10h, duration 10-18h → peak ช่วงดึกทำให้ nocturnal hypoglycemia | Glargine: onset 2-4h, NO significant peak, duration ~24h | Degludec: duration >42h | Regular: onset 30-60min, peak 2-4h, duration 5-8h | Lispro/Aspart/Glulisine: rapid-acting",
      choices: [
        { label: "A", text: "Insulin NPH", explanation: "✗ ผิด — Intermediate-acting มี peak 4-10h เสี่ยง nocturnal hypoglycemia" },
        { label: "B", text: "Insulin Regular", explanation: "✗ ผิด — Short-acting มี peak 2-4h ใช้ก่อนมื้ออาหาร" },
        { label: "C", text: "Insulin Lispro", explanation: "✗ ผิด — Rapid-acting analog มี peak 1-2h ใช้ช่วง mealtime" },
        { label: "D", text: "Insulin Glargine (U-100)", explanation: "✓ ถูก — Long-acting peakless ~24h เสี่ยง hypoglycemia น้อยที่สุดในกลุ่ม basal insulin" },
        { label: "E", text: "Insulin 70/30", explanation: "✗ ผิด — Premixed (70% NPH + 30% Regular) มี peak จาก NPH component" },
      ],
      key_takeaway: "Basal insulin: Glargine/Detemir/Degludec = peakless ดีกว่า NPH ลด nocturnal hypoglycemia | ให้ครั้งเดียวก่อนนอน",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยชายอายุ 45 ปี ตรวจพบ Fasting plasma glucose 128 mg/dL สองครั้ง ห่างกัน 1 สัปดาห์ ค่า HbA1c 7.2% ควรให้การวินิจฉัยว่าอย่างไร",
    choices: [
      { label: "A", text: "ปกติ ไม่ต้องรักษา" },
      { label: "B", text: "Impaired fasting glucose (Pre-diabetes)" },
      { label: "C", text: "Diabetes mellitus" },
      { label: "D", text: "Impaired glucose tolerance" },
      { label: "E", text: "ต้องทำ OGTT ก่อนจึงวินิจฉัยได้" },
    ],
    correct_answer: "C",
    explanation: "ADA criteria สำหรับ DM: FPG ≥ 126 mg/dL สองครั้ง หรือ HbA1c ≥ 6.5% ผู้ป่วยมี FPG 128 mg/dL สองครั้ง (≥ 126) และ HbA1c 7.2% (≥ 6.5%) วินิจฉัย DM ได้ทันที",
    detailed_explanation: {
      summary: "ADA DM criteria: FPG ≥ 126 (×2), HbA1c ≥ 6.5%, 2h OGTT ≥ 200, Random glucose ≥ 200 + symptoms",
      reason: "เกณฑ์วินิจฉัย DM (ADA): 1) FPG ≥ 126 mg/dL (ซ้ำสองครั้ง) 2) HbA1c ≥ 6.5% 3) 2-hr glucose ≥ 200 mg/dL ใน OGTT 4) Random glucose ≥ 200 + อาการ Pre-diabetes: FPG 100-125 หรือ HbA1c 5.7-6.4%",
      choices: [
        { label: "A", text: "ปกติ ไม่ต้องรักษา", explanation: "✗ ผิด — FPG 128 และ HbA1c 7.2% เกินเกณฑ์ปกติมาก" },
        { label: "B", text: "Impaired fasting glucose (Pre-diabetes)", explanation: "✗ ผิด — IFG: FPG 100-125 mg/dL ผู้ป่วยมี FPG 128 ≥ 126 แล้ว" },
        { label: "C", text: "Diabetes mellitus", explanation: "✓ ถูก — FPG ≥ 126 สองครั้ง + HbA1c ≥ 6.5% ครบเกณฑ์วินิจฉัย DM" },
        { label: "D", text: "Impaired glucose tolerance", explanation: "✗ ผิด — IGT วินิจฉัยด้วย OGTT 2h glucose 140-199 mg/dL ต่างจากกรณีนี้" },
        { label: "E", text: "ต้องทำ OGTT ก่อนจึงวินิจฉัยได้", explanation: "✗ ผิด — FPG ≥ 126 สองครั้งเพียงพอสำหรับวินิจฉัย DM ไม่ต้อง OGTT" },
      ],
      key_takeaway: "DM diagnosis: FPG ≥ 126 (×2) หรือ HbA1c ≥ 6.5% หรือ OGTT 2h ≥ 200 หรือ Random ≥ 200 + sx",
    },
    difficulty: "easy",
  },
  {
    question: "ผู้ป่วยรับประทาน Metformin 1000 mg วันละสองครั้ง มาเป็นเวลา 2 ปี ผลข้างเคียงระยะยาวที่สำคัญซึ่งควรติดตามคือ",
    choices: [
      { label: "A", text: "Hepatotoxicity" },
      { label: "B", text: "Vitamin B12 deficiency" },
      { label: "C", text: "Osteoporosis" },
      { label: "D", text: "Nephrolithiasis" },
      { label: "E", text: "Agranulocytosis" },
    ],
    correct_answer: "B",
    explanation: "Metformin ระยะยาวลดการดูดซึม Vitamin B12 ในลำไส้เล็ก ควรตรวจ B12 ทุก 1-2 ปี และให้ B12 supplement หากจำเป็น",
    detailed_explanation: {
      summary: "Metformin long-term SE: Vitamin B12 deficiency → peripheral neuropathy, anemia",
      reason: "Metformin ลดการดูดซึม B12 ที่ ileum ผ่าน calcium-dependent mechanism พบ B12 deficiency ~10-30% ในผู้ใช้นาน อาการ: peripheral neuropathy, megaloblastic anemia ติดตาม: ตรวจ B12 ทุก 1-2 ปี ให้ calcium supplement ช่วยลดปัญหาได้",
      choices: [
        { label: "A", text: "Hepatotoxicity", explanation: "✗ ผิด — Metformin ไม่ทำให้ตับเสีย (ต่างจาก thiazolidinedione รุ่นเก่า)" },
        { label: "B", text: "Vitamin B12 deficiency", explanation: "✓ ถูก — Long-term SE ที่สำคัญ ลดการดูดซึม B12 ควร monitor ทุก 1-2 ปี" },
        { label: "C", text: "Osteoporosis", explanation: "✗ ผิด — Metformin ไม่ทำให้กระดูกบาง (TZD ต่างหากที่เพิ่มความเสี่ยง fracture)" },
        { label: "D", text: "Nephrolithiasis", explanation: "✗ ผิด — ไม่เกี่ยวข้องกับ metformin" },
        { label: "E", text: "Agranulocytosis", explanation: "✗ ผิด — เป็น SE ของ carbimazole/methimazole/PTU ไม่ใช่ metformin" },
      ],
      key_takeaway: "Metformin long-term: ตรวจ B12 ทุก 1-2 ปี | SE อื่น: GI (ลดได้โดยกินพร้อมอาหาร) | ไม่ทำให้ hypo เมื่อใช้เดี่ยว",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยเบาหวานที่มี established atherosclerotic cardiovascular disease (ASCVD) และ HbA1c ยังไม่ถึงเป้าหมายแม้ใช้ Metformin แล้ว ควรเพิ่มยากลุ่มใดก่อนตาม ADA 2024 guideline",
    choices: [
      { label: "A", text: "Sulfonylurea" },
      { label: "B", text: "DPP-4 inhibitor" },
      { label: "C", text: "GLP-1 receptor agonist ที่มี proven CV benefit (liraglutide/semaglutide)" },
      { label: "D", text: "Acarbose" },
      { label: "E", text: "Insulin NPH" },
    ],
    correct_answer: "C",
    explanation: "ADA guideline: ผู้ป่วย DM+ASCVD ควรได้ GLP-1 RA ที่มี proven CV benefit (liraglutide/semaglutide/dulaglutide) หรือ SGLT2i เพิ่มจาก metformin โดยพิจารณาจาก CV benefit ไม่ใช่แค่ HbA1c",
    detailed_explanation: {
      summary: "DM + ASCVD: เพิ่ม GLP-1 RA หรือ SGLT2i ที่มี proven CV benefit เหนือ HbA1c control",
      reason: "ADA 2024: การเลือกยาใน DM ต้องพิจารณา complication ร่วม ไม่ใช่แค่ HbA1c ASCVD: GLP-1 RA (liraglutide LEADER, semaglutide SUSTAIN-6, dulaglutide REWIND) หรือ SGLT2i (empagliflozin EMPA-REG, canagliflozin CANVAS) Heart failure: SGLT2i เป็นอันดับแรก CKD: SGLT2i (dapagliflozin DAPA-CKD)",
      choices: [
        { label: "A", text: "Sulfonylurea", explanation: "✗ ผิด — ไม่มี CV benefit อาจเพิ่ม CV risk เสี่ยง hypoglycemia" },
        { label: "B", text: "DPP-4 inhibitor", explanation: "✗ ผิด — CV neutral เท่านั้น ไม่ลด MACE ใน ASCVD" },
        { label: "C", text: "GLP-1 receptor agonist ที่มี proven CV benefit (liraglutide/semaglutide)", explanation: "✓ ถูก — Proven CV benefit ใน ASCVD ลด MACE 13-26%" },
        { label: "D", text: "Acarbose", explanation: "✗ ผิด — ไม่มีหลักฐาน CV benefit ประสิทธิภาพต่ำ" },
        { label: "E", text: "Insulin NPH", explanation: "✗ ผิด — ไม่มี CV benefit เสี่ยง hypoglycemia สูง ไม่ใช่ second-line ตาม guideline ใหม่" },
      ],
      key_takeaway: "DM + ASCVD: GLP-1 RA หรือ SGLT2i (proven CV benefit) เป็น preferred add-on | DM + HF: SGLT2i first | DM + CKD: SGLT2i first",
    },
    difficulty: "hard",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} endocrine questions...`);
  let count = 0;
  for (const q of questions) {
    const id = randomUUID();
    await client.execute({
      sql: `INSERT INTO mcq_questions
        (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
        VALUES (?, ?, 'PLE-CC1', ?, ?, ?, ?, ?, ?, 'active')`,
      args: [
        id,
        SUBJECT_ID,
        q.question,
        JSON.stringify(q.choices),
        q.correct_answer,
        q.explanation,
        JSON.stringify(q.detailed_explanation),
        q.difficulty,
      ],
    });
    count++;
    console.log(`  ${count}. ${q.question.substring(0, 60)}...`);
  }
  console.log(`\nDone! ${count} questions inserted for ต่อมไร้ท่อ`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
