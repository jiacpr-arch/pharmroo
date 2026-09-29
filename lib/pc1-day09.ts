import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 9/30 (2 เคส/วัน) · สัปดาห์ที่ 3: ไต/อิเล็กโทรไลต์ + ต่อมไร้ท่อ
// ผสมระดับความยาก: ง่าย 5 · ปานกลาง 3 · ยาก 2 (เรียงง่าย → ยากภายในเคส)
// Case 29: T2DM + ASCVD + obesity — GLP-1 RA, ADR/contraindication, basal insulin start, nocturnal hypoglycemia
// Case 30: Graves' disease in pregnancy — PTU vs methimazole, beta-blocker, agranulocytosis, switch dose, FT4 target

const CASES: Pc1Case[] = [
  {
    title: "T2DM + ASCVD: GLP-1 RA → basal insulin",
    base:
      "ชายไทยอายุ 58 ปี น้ำหนัก 95 kg (BMI 33) เป็น T2DM มา 6 ปี เคยเป็น MI เมื่อ 2 ปีก่อน ไม่มี heart failure. eGFR 75 mL/min/1.73m². " +
      "ยาเบาหวาน: metformin 1,000 mg BID และ glipizide 5 mg BID. HbA1c 8.6% ทานยาสม่ำเสมอ",
    ref: "ADA Standards of Care in Diabetes 2026; ADA/EASD Consensus Report on Management of Hyperglycemia in T2DM; Semaglutide prescribing information",
    qs: [
      {
        d: "easy",
        p: "ตามแนวทาง ADA Standards of Care และแนวทางเวชปฏิบัติสำหรับโรคเบาหวานของประเทศไทย ยาที่ควรเพิ่มมากที่สุด โดยคำนึงถึงประวัติ MI และน้ำหนักตัว คือข้อใด?",
        o: [
          "Pioglitazone 30 mg OD",
          "เพิ่ม glipizide เป็น 10 mg BID",
          "GLP-1 receptor agonist ที่มีหลักฐานลด CV events เช่น semaglutide หรือ liraglutide",
          "Saxagliptin 5 mg OD",
          "Acarbose 50 mg TID",
        ],
        a: 2,
        r: "T2DM + established ASCVD → เลือกยาที่มีหลักฐานลด MACE (GLP-1 RA หรือ SGLT2i) โดยไม่ขึ้นกับ HbA1c หรือการได้ metformin. SGLT2i ก็เป็นทางเลือกที่มีหลักฐานด้าน CV เช่นกัน แต่ผู้ป่วยรายนี้อ้วน (BMI 33) และไม่มี HF/CKD ซึ่งเป็นข้อบ่งใช้เด่นของ SGLT2i → GLP-1 RA เหมาะกว่าเพราะลดน้ำหนักได้มากกว่า (ถ้ามี HFrEF หรือ CKD + albuminuria จะเลือก SGLT2i ก่อน)",
        w: [
          "ทำให้น้ำหนักขึ้น บวมน้ำ",
          "เพิ่ม hypoglycemia และน้ำหนัก ไม่มีประโยชน์ต่อ CV",
          "ถูก",
          "DPP-4i ไม่ลด CV events และ saxagliptin เพิ่ม HF hospitalization",
          "ลด HbA1c ได้น้อย ไม่มีหลักฐานด้าน CV",
        ],
        k: "ASCVD → GLP-1 RA หรือ SGLT2i (มีหลักฐาน CV benefit); เน้นลดน้ำหนัก → GLP-1 RA; HF/CKD → SGLT2i",
      },
      {
        d: "easy",
        p: "อาการไม่พึงประสงค์ที่พบบ่อยที่สุดของ GLP-1 receptor agonist คือข้อใด?",
        o: [
          "คลื่นไส้ อาเจียน ท้องเสีย",
          "ติดเชื้อราบริเวณอวัยวะเพศ",
          "Lactic acidosis",
          "บวมน้ำและน้ำหนักขึ้น",
          "ไอแห้ง",
        ],
        a: 0,
        r: "GI ADR (nausea, vomiting, diarrhea) พบบ่อยที่สุด โดยเฉพาะช่วงเริ่มยาและเพิ่มขนาด — ลดได้ด้วยการเริ่มขนาดต่ำ titrate ช้า และแนะนำทานมื้อเล็กลง",
        w: [
          "ถูก",
          "เป็น ADR ของ SGLT2 inhibitor",
          "เกี่ยวกับ metformin (พบน้อย)",
          "เป็น ADR ของ TZD",
          "เป็น ADR ของ ACEI",
        ],
        k: "GLP-1 RA: GI ADR, ระวัง pancreatitis, gallbladder disease; hypoglycemia ต่ำเมื่อไม่ใช้ร่วม SU/insulin",
      },
      {
        d: "medium",
        p: "ข้อใดเป็นข้อห้ามใช้ semaglutide?",
        o: [
          "มีประวัติ MI",
          "eGFR 75 mL/min/1.73m²",
          "ประวัติครอบครัวเป็น medullary thyroid carcinoma หรือ MEN 2",
          "ใช้ metformin ร่วมด้วย",
          "BMI ≥ 30 kg/m²",
        ],
        a: 2,
        r: "GLP-1 RA มี boxed warning เรื่อง thyroid C-cell tumor ในสัตว์ทดลอง → ห้ามใช้ในผู้ที่มีประวัติตนเองหรือครอบครัวเป็น MTC หรือ MEN 2",
        w: [
          "เป็นข้อบ่งใช้ ไม่ใช่ข้อห้าม",
          "ใช้ได้ ไม่ต้องปรับขนาด",
          "ถูก",
          "ใช้ร่วมกันได้",
          "เป็นเหตุผลสนับสนุนการใช้",
        ],
        k: "GLP-1 RA contraindication: personal/family history of MTC, MEN 2; ระวังประวัติ pancreatitis",
      },
      {
        d: "medium",
        p: "3 ปีต่อมาได้ metformin + semaglutide + glipizide แล้ว HbA1c 9.4% แพทย์ต้องการเริ่ม basal insulin. ข้อใดเหมาะสมที่สุด?",
        o: [
          "Insulin glargine 50 U SC ก่อนนอน",
          "Regular insulin sliding scale ก่อนอาหารเท่านั้น",
          "Insulin glargine 10 U SC วันละครั้ง titrate เพิ่ม 2 U ทุก 3 วันจน FPG 80–130 mg/dL และพิจารณาลด/หยุด glipizide",
          "NPH 0.5 U/kg SC วันละ 2 ครั้ง",
          "Premixed 70/30 insulin 100 U/day",
        ],
        a: 2,
        r: "Basal insulin เริ่ม 10 U/day หรือ 0.1–0.2 U/kg/day (95 kg ≈ 10–19 U) แล้ว titrate ตาม FPG; เมื่อใช้ insulin ร่วม sulfonylurea เสี่ยง hypoglycemia → ลดหรือหยุด SU",
        c: ["0.1–0.2 U/kg × 95 kg = 9.5–19 U/day", "เริ่มที่ 10 U แล้วปรับเพิ่ม 2 U ทุก 3 วัน"],
        w: [
          "ขนาดเริ่มต้นสูงเกิน เสี่ยง hypoglycemia",
          "Sliding scale อย่างเดียวไม่ใช่การรักษาต่อเนื่อง",
          "ถูก",
          "ขนาดสูงเกินสำหรับเริ่มต้น (~95 U/day)",
          "สูงเกินมาก",
        ],
        k: "Start basal insulin: 10 U หรือ 0.1–0.2 U/kg; titrate ด้วย FPG; ทบทวน SU",
      },
      {
        d: "hard",
        p: "ต่อมาได้ glargine 30 U ก่อนนอน (หยุด glipizide แล้ว) ผู้ป่วยตื่นกลางดึกใจสั่น เหงื่อออก 2 ครั้ง/สัปดาห์ glucose ตี 3 = 58 mg/dL, FPG 70–80 mg/dL. ข้อใดเหมาะสมที่สุด?",
        o: [
          "เพิ่ม glargine เป็น 34 U เพราะ FPG ยังไม่ต่ำกว่า 80",
          "ให้ glargine ขนาดเดิมและแนะนำกินขนมก่อนนอนทุกคืน",
          "ลด glargine ลง 10–20% (เหลือประมาณ 24–27 U) และสอนการแก้ hypoglycemia ด้วยกลูโคส 15–20 g",
          "เปลี่ยนเป็น NPH 30 U ก่อนนอน",
          "หยุด insulin ทั้งหมด",
        ],
        a: 2,
        r: "Hypoglycemia ที่ไม่ทราบสาเหตุอื่น → ลดขนาด basal insulin 10–20%; NPH มี peak ตอนกลางดึกจะเพิ่ม nocturnal hypoglycemia; สอน rule of 15 (กลูโคส 15–20 g แล้ววัดซ้ำใน 15 นาที)",
        c: ["30 U × (1 − 0.1) = 27 U", "30 U × (1 − 0.2) = 24 U"],
        w: [
          "ทำให้ hypoglycemia รุนแรงขึ้น",
          "เพิ่มแคลอรีโดยไม่แก้สาเหตุ",
          "ถูก",
          "NPH มี peak 4–10 ชม. เสี่ยง nocturnal hypoglycemia มากกว่า glargine",
          "ทำให้ hyperglycemia กลับมา",
        ],
        k: "Hypoglycemia on basal insulin: ↓ 10–20%; ระวัง overbasalization (basal > 0.5 U/kg, bedtime–AM differential ≥ 50)",
      },
    ],
  },
  {
    title: "Graves' disease in pregnancy",
    base:
      "หญิงไทยอายุ 29 ปี ตั้งครรภ์ครั้งแรก อายุครรภ์ 8 สัปดาห์ น้ำหนัก 52 kg ใจสั่น น้ำหนักลด มือสั่น. HR 112 bpm, BP 126/70 mmHg, ต่อมไทรอยด์โตแบบ diffuse. " +
      "Lab: TSH < 0.01 mIU/L, free T4 3.5 ng/dL (ปกติ 0.8–1.8), TRAb positive. CBC และ LFT ปกติ",
    ref: "2017 ATA Guidelines for Diagnosis and Management of Thyroid Disease During Pregnancy and Postpartum; 2016 ATA Hyperthyroidism Guidelines",
    qs: [
      {
        d: "easy",
        p: "ยาต้านไทรอยด์ใดเหมาะสมที่สุดในขณะนี้ (อายุครรภ์ 8 สัปดาห์)?",
        o: [
          "Methimazole 20 mg OD",
          "Propylthiouracil (PTU)",
          "Radioactive iodine (I-131)",
          "ผ่าตัด thyroidectomy ทันที",
          "ไม่ต้องรักษาจนคลอด",
        ],
        a: 1,
        r: "ไตรมาสแรกเลือก PTU เพราะ methimazole สัมพันธ์กับ embryopathy (aplasia cutis, choanal/esophageal atresia) ช่วง organogenesis (6–10 สัปดาห์)",
        w: [
          "เสี่ยง methimazole embryopathy ในไตรมาสแรก",
          "ถูก",
          "ห้ามใช้ในการตั้งครรภ์ (ทำลายต่อมไทรอยด์ทารก)",
          "สงวนไว้สำหรับรายที่ใช้ยาไม่ได้ และถ้าจำเป็นทำในไตรมาสที่ 2",
          "Overt hyperthyroidism ที่ไม่รักษาเสี่ยงแท้ง คลอดก่อนกำหนด preeclampsia และ thyroid storm",
        ],
        k: "Hyperthyroid in pregnancy: 1st trimester → PTU; 2nd–3rd → methimazole",
      },
      {
        d: "easy",
        p: "เพื่อคุมอาการใจสั่นระยะสั้นระหว่างรอยาต้านไทรอยด์ออกฤทธิ์ ควรให้ยาใด?",
        o: [
          "Amiodarone",
          "Digoxin",
          "Propranolol ขนาดต่ำ ระยะสั้น",
          "Lugol’s iodine ระยะยาวตลอดการตั้งครรภ์",
          "Verapamil IV",
        ],
        a: 2,
        r: "Beta-blocker (propranolol 10–40 mg q6–8h) ช่วยคุมอาการ adrenergic ระยะสั้น 2–6 สัปดาห์ จนยาต้านไทรอยด์ได้ผล — หลีกเลี่ยงการใช้นานเพราะสัมพันธ์กับ IUGR, neonatal bradycardia/hypoglycemia",
        w: [
          "มีไอโอดีนสูง ห้ามในการตั้งครรภ์ และทำให้ thyroid dysfunction",
          "ไม่ใช่ยาหลักในการคุม sinus tachycardia จาก thyrotoxicosis",
          "ถูก",
          "ไอโอดีนปริมาณมากระยะยาวทำให้ fetal goiter/hypothyroidism",
          "ไม่ใช่ยาที่เหมาะสม",
        ],
        k: "Beta-blocker = symptomatic control ระยะสั้นใน thyrotoxicosis",
      },
      {
        d: "easy",
        p: "ขณะใช้ยาต้านไทรอยด์ ผู้ป่วยมีไข้ 39 °C และเจ็บคอ ควรแนะนำอย่างไร?",
        o: [
          "กิน paracetamol แล้วรอดูอาการ 1 สัปดาห์",
          "หยุดยาต้านไทรอยด์ทันทีและมาตรวจ CBC (absolute neutrophil count) ด่วน",
          "เพิ่มขนาดยาต้านไทรอยด์",
          "ซื้อ amoxicillin กินเอง",
          "เปลี่ยนเป็นยาต้านไทรอยด์อีกตัวหนึ่งเองโดยไม่ต้องตรวจ",
        ],
        a: 1,
        r: "Agranulocytosis เป็น ADR ที่รุนแรงของทั้ง PTU และ methimazole (มักใน 3 เดือนแรก) — ไข้/เจ็บคอต้องหยุดยาและตรวจ CBC ทันที; ถ้าเกิดแล้วห้ามใช้ thionamide ทั้งสองตัว (cross-reactivity)",
        w: [
          "อาจพลาด agranulocytosis ที่อันตรายถึงชีวิต",
          "ถูก",
          "ไม่เกี่ยวข้อง และอันตราย",
          "ไม่แก้ปัญหาและอาจบดบังการวินิจฉัย",
          "มี cross-reactivity ระหว่าง PTU และ methimazole",
        ],
        k: "Thionamide: agranulocytosis (ไข้/เจ็บคอ → หยุดยา + CBC), hepatotoxicity (PTU > MMI)",
      },
      {
        d: "hard",
        p: "เมื่อเข้าไตรมาสที่ 2 แพทย์ต้องการเปลี่ยน PTU 100 mg TID เป็น methimazole (อัตราส่วนประมาณ PTU : MMI = 20 : 1). ขนาด methimazole ที่เหมาะสมคือข้อใด?",
        o: ["5 mg/day", "10 mg/day", "15 mg/day", "30 mg/day", "60 mg/day"],
        a: 2,
        r: "PTU 100 mg TID = 300 mg/day → 300 / 20 = 15 mg/day methimazole (วันละครั้ง). เปลี่ยนเพราะ PTU เสี่ยง hepatotoxicity รุนแรง และตรวจ thyroid function 2–4 สัปดาห์หลังเปลี่ยน",
        c: ["PTU 100 mg × 3 = 300 mg/day", "300 ÷ 20 = 15 mg/day methimazole"],
        w: ["ต่ำเกิน (ใช้อัตราส่วน 60:1)", "ต่ำเกิน (30:1)", "ถูก", "สูงเกิน (10:1)", "สูงเกินมาก"],
        k: "PTU → MMI ratio ≈ 20:1 (ช่วง 10–15:1 ถึง 20:1); MMI ให้วันละครั้งได้",
      },
      {
        d: "medium",
        p: "เป้าหมายการปรับยาต้านไทรอยด์ระหว่างตั้งครรภ์ข้อใดถูกต้องที่สุด?",
        o: [
          "ให้ TSH อยู่ในช่วงปกติของผู้ไม่ตั้งครรภ์",
          "ให้ free T4 อยู่กึ่งกลางช่วงปกติ",
          "ใช้ขนาดยาต่ำสุดที่ทำให้ free T4 อยู่ที่หรือสูงกว่าขอบบนของช่วงปกติเล็กน้อย",
          "ให้ free T4 ต่ำกว่าช่วงปกติเพื่อความปลอดภัย",
          "หยุดยาทันทีที่อายุครรภ์ 20 สัปดาห์ทุกราย",
        ],
        a: 2,
        r: "Thionamide ผ่านรก — การคุมจนแม่ euthyroid เต็มที่เสี่ยงทำให้ทารก hypothyroid/goiter จึงใช้ขนาดต่ำสุดให้ FT4 อยู่ที่ขอบบนหรือสูงกว่าเล็กน้อย ตรวจทุก 4 สัปดาห์ (TSH อาจยังกดอยู่)",
        w: [
          "TSH ตอบสนองช้าและอาจกดอยู่นาน",
          "เสี่ยง fetal hypothyroidism",
          "ถูก",
          "เสี่ยง fetal hypothyroidism/goiter",
          "บางรายลดหรือหยุดยาได้ในไตรมาสที่ 3 แต่ไม่ใช่ทุกรายและไม่ใช่ตามกำหนดตายตัว",
        ],
        k: "Target FT4 at/slightly above ULN, lowest ATD dose, monitor q4wk; ติดตาม TRAb ช่วง 18–22 และ 30–34 สัปดาห์",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–28, ข้อ 1–137) → Case 29–30, ข้อ 138–147
export const PC1_DAY09: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d09q",
  caseOffset: 28,
  qOffset: 137,
  createdAt: "2026-10-01 09:00:00",
  posShift: 5,
});
