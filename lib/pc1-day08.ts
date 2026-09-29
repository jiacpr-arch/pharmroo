import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 8/30 (2 เคส/วัน) · สัปดาห์ที่ 3: ไต/อิเล็กโทรไลต์ + ต่อมไร้ท่อ
// ผสมระดับความยาก: ง่าย 4 · ปานกลาง 3 · ยาก 3 (เรียงง่าย → ยากภายในเคส)
// Case 27: "Triple whammy" AKI — sick-day rules, CrCl, gabapentin accumulation and renal dosing
// Case 28: SSRI-induced SIADH — diagnosis, hypertonic saline, correction limit, antidepressant switch, ODS

const CASES: Pc1Case[] = [
  {
    title: "Triple-whammy AKI + renal dose adjustment",
    base:
      "หญิงไทยอายุ 75 ปี น้ำหนัก 50 kg เป็น HTN, T2DM, ข้อเข่าเสื่อม และปวดปลายประสาทจากเบาหวาน. ยาปัจจุบัน: enalapril 10 mg BID, hydrochlorothiazide 25 mg OD, metformin 1,000 mg BID, gabapentin 300 mg TID " +
      "และซื้อ ibuprofen 400 mg TID กินเองมา 3 สัปดาห์. 3 วันนี้อาเจียน กินได้น้อย ง่วงซึม สับสน เดินเซ. BP 100/60 mmHg. " +
      "Lab: SCr 2.5 mg/dL (เดิม 1.0), BUN 60 mg/dL, K⁺ 5.8 mEq/L (ECG ไม่มี peaked T), HCO₃⁻ 19 mEq/L",
    ref: "KDIGO 2012 AKI Guideline; KDIGO 2024 CKD Guideline (medication management); Gabapentin prescribing information; Think Kidneys ‘Sick day guidance’",
    qs: [
      {
        d: "easy",
        p: "สาเหตุหลักของ AKI ในผู้ป่วยรายนี้น่าจะเป็นข้อใด?",
        o: [
          "Contrast-induced nephropathy",
          "Prerenal AKI จาก ‘triple whammy’ (NSAID + ACEI + diuretic) ร่วมกับภาวะขาดน้ำ",
          "Acute interstitial nephritis จาก metformin",
          "Rhabdomyolysis จาก gabapentin",
          "Postrenal obstruction จาก nephrolithiasis",
        ],
        a: 1,
        r: "NSAID ทำให้ afferent arteriole หดตัว (ลด prostaglandin), ACEI ทำให้ efferent arteriole ขยาย, diuretic ลด volume → GFR ลดลงอย่างมาก โดยเฉพาะเมื่ออาเจียน/กินได้น้อย",
        w: [
          "ไม่มีประวัติได้สารทึบรังสี",
          "ถูก",
          "Metformin ไม่ทำให้เกิด AIN",
          "Gabapentin ไม่ใช่สาเหตุของ rhabdomyolysis",
          "ไม่มีข้อมูลบ่งชี้การอุดกั้น",
        ],
        k: "Triple whammy = NSAID + ACEI/ARB + diuretic → prerenal AKI โดยเฉพาะในผู้สูงอายุ/ขาดน้ำ",
      },
      {
        d: "easy",
        p: "ยาใดควรหยุดชั่วคราวในช่วงที่ผู้ป่วยมี AKI และขาดน้ำ (sick-day rules)?",
        o: [
          "Gabapentin เท่านั้น",
          "Ibuprofen, enalapril, hydrochlorothiazide และ metformin",
          "Enalapril เท่านั้น",
          "ไม่ต้องหยุดยาใด เพียงให้สารน้ำ",
          "Metformin เท่านั้น",
        ],
        a: 1,
        r: "Sick-day rules (SADMANS: Sulfonylureas, ACEI, Diuretics, Metformin, ARB, NSAIDs, SGLT2i) — หยุดชั่วคราวเมื่อขาดน้ำ/อาเจียน/ท้องเสีย เพื่อป้องกัน AKI แย่ลง, hyperkalemia และ metformin-associated lactic acidosis",
        w: [
          "ต้องปรับขนาด gabapentin แต่ยาที่ทำให้ไตแย่ลงก็ต้องหยุด",
          "ถูก",
          "ไม่ครบ ibuprofen/diuretic/metformin ก็ต้องหยุด",
          "ยาเหล่านี้ทำให้ไตแย่ลงต่อ",
          "ไม่ครบ",
        ],
        k: "SADMANS: หยุดชั่วคราวเมื่อป่วยขาดน้ำ แล้วเริ่มใหม่เมื่อกินได้และไตฟื้น",
      },
      {
        d: "medium",
        p: "CrCl ของผู้ป่วย (Cockcroft–Gault, ใช้น้ำหนักจริง) ขณะนี้ใกล้เคียงข้อใดที่สุด?",
        o: ["12 mL/min", "15 mL/min", "18 mL/min", "22 mL/min", "28 mL/min"],
        a: 1,
        r: "CrCl = (140 − 75) × 50 / (72 × 2.5) × 0.85 ≈ 15 mL/min. หมายเหตุ: SCr ใน AKI ยังไม่คงที่ ค่าที่ได้เป็นเพียงการประมาณ (GFR จริงอาจต่ำกว่า)",
        c: ["(140 − 75) × 50 = 3,250", "72 × 2.5 = 180", "3,250 / 180 = 18.1", "× 0.85 ≈ 15.3 mL/min"],
        w: ["ต่ำเกิน", "ถูก", "ลืมคูณ 0.85", "สูงเกิน", "สูงเกิน"],
        k: "CG ใน AKI: SCr ไม่ steady state — ใช้ประกอบการตัดสินใจร่วมกับอาการและแนวโน้ม SCr",
      },
      {
        d: "medium",
        p: "อาการง่วงซึม สับสน เดินเซ ของผู้ป่วยน่าจะสัมพันธ์กับยาใดมากที่สุด?",
        o: [
          "Hydrochlorothiazide",
          "Enalapril",
          "Gabapentin สะสมจากการทำงานของไตลดลง",
          "Metformin",
          "Ibuprofen",
        ],
        a: 2,
        r: "Gabapentin ถูกขับทางไตในรูปเดิมเกือบทั้งหมด ไม่ถูก metabolize — เมื่อ CrCl ลดลงจะสะสมและทำให้ somnolence, dizziness, ataxia, confusion โดยเฉพาะในผู้สูงอายุ",
        w: [
          "อาจทำให้ hyponatremia แต่ไม่อธิบาย ataxia ได้ดีเท่า",
          "ไม่ทำให้เกิดอาการทางระบบประสาทแบบนี้",
          "ถูก",
          "Lactic acidosis อาจทำให้ซึมได้ แต่ HCO₃⁻ 19 ไม่รุนแรงและ ataxia เข้าได้กับ gabapentin มากกว่า",
          "ไม่ใช่สาเหตุหลักของอาการทางระบบประสาท",
        ],
        k: "Renally cleared CNS drugs ที่ต้องระวังใน AKI/CKD: gabapentin, pregabalin, baclofen, tramadol",
      },
      {
        d: "hard",
        p: "ถ้าต้องให้ gabapentin ต่อระหว่างที่ CrCl ≈ 15 mL/min (ตาม label: CrCl 15–29 → 200–700 mg/day วันละครั้ง; CrCl < 15 → 100–300 mg/day) ขนาดใดเหมาะสมที่สุด?",
        o: [
          "300 mg TID ขนาดเดิม",
          "600 mg BID",
          "300 mg วันละครั้ง",
          "900 mg วันละครั้ง",
          "หยุดยาแล้วเริ่มใหม่ที่ 1,800 mg/day เมื่ออาการดีขึ้น",
        ],
        a: 2,
        r: "CrCl ≈ 15 → ช่วง 200–700 mg/day → 300 mg OD อยู่ในช่วงและเป็นขนาดต่ำที่ปลอดภัยในผู้สูงอายุที่มีอาการพิษอยู่ (อาจงดยา 1–2 วันก่อนจนอาการดีขึ้น) และปรับเพิ่มเมื่อไตฟื้น",
        c: ["CrCl ≈ 15 mL/min → กลุ่ม 15–29", "ช่วงขนาด 200–700 mg/day ให้วันละครั้ง", "300 mg OD อยู่ในช่วงและเริ่มจากปลายล่าง"],
        w: [
          "900 mg/day เกินช่วงและเป็นสาเหตุของพิษ",
          "1,200 mg/day เกินมาก",
          "ถูก",
          "900 mg/day เกินช่วง",
          "1,800 mg/day เกินมากสำหรับไตที่ลดลง",
        ],
        k: "Gabapentin renal dosing: CrCl ≥ 60: 900–3,600; 30–59: 400–1,400; 15–29: 200–700; < 15: 100–300 mg/day",
      },
    ],
  },
  {
    title: "SSRI-induced SIADH + hyponatremia",
    base:
      "หญิงไทยอายุ 68 ปี น้ำหนัก 50 kg เริ่ม sertraline 50 mg OD สำหรับโรคซึมเศร้าเมื่อ 3 สัปดาห์ก่อน. ช่วงนี้ปวดศีรษะ คลื่นไส้ สับสนเล็กน้อย ไม่มีบวม ไม่มีอาการขาดน้ำ (euvolemic). " +
      "Lab: Na⁺ 118 mEq/L, K⁺ 3.3 mEq/L, serum osmolality 250 mOsm/kg, urine osmolality 450 mOsm/kg, urine Na⁺ 50 mEq/L, glucose 100 mg/dL, TSH และ cortisol ปกติ. ผอม กินน้อย (malnutrition)",
    ref: "European Clinical Practice Guideline on Hyponatraemia 2014; Verbalis et al. Am J Med 2013 (Expert panel recommendations); Spasovski G et al.",
    qs: [
      {
        d: "easy",
        p: "ภาวะ hyponatremia ของผู้ป่วยรายนี้น่าจะเกิดจากสาเหตุใดมากที่สุด?",
        o: [
          "Hypovolemic hyponatremia จากอาเจียน",
          "Pseudohyponatremia จากไขมันสูง",
          "SIADH จาก sertraline",
          "Primary polydipsia",
          "Adrenal insufficiency",
        ],
        a: 2,
        r: "Hypotonic (Sosm 250) + euvolemic + urine osm สูงไม่เหมาะสม (> 100) + urine Na > 30 + TSH/cortisol ปกติ + เริ่ม SSRI (โดยเฉพาะผู้สูงอายุหญิง ภายในสัปดาห์แรก ๆ) = SIADH จากยา",
        w: [
          "ผู้ป่วย euvolemic และ urine Na สูง",
          "Serum osmolality ต่ำ (hypotonic) ไม่ใช่ pseudohyponatremia",
          "ถูก",
          "Primary polydipsia มี urine osm < 100",
          "Cortisol ปกติ",
        ],
        k: "Drug-induced SIADH: SSRIs, SNRIs, carbamazepine/oxcarbazepine, cyclophosphamide, vincristine, NSAIDs, PPIs",
      },
      {
        d: "hard",
        p: "ถ้าระหว่างนอนโรงพยาบาลผู้ป่วยเกิดชัก (severe symptomatic hyponatremia) การรักษาเร่งด่วนที่เหมาะสมที่สุดคือข้อใด?",
        o: [
          "NSS 1 L IV ภายใน 1 ชั่วโมง",
          "จำกัดน้ำ < 800 mL/day เพียงอย่างเดียว",
          "3% NaCl 150 mL IV ใน 20 นาที ตรวจ Na ซ้ำ ให้ซ้ำได้ (สูงสุด 2–3 ครั้ง) จน Na เพิ่ม ~5 mEq/L หรืออาการดีขึ้น",
          "Tolvaptan 15 mg PO",
          "3% NaCl หยดต่อเนื่องจน Na กลับเป็น 135 mEq/L",
        ],
        a: 2,
        r: "Severe symptoms (ชัก, ซึมลึก) → hypertonic saline bolus เพื่อเพิ่ม Na 4–6 mEq/L อย่างรวดเร็วซึ่งพอลด cerebral edema — แล้วหยุดเมื่ออาการดีขึ้น ไม่ต้องทำให้ Na ปกติ",
        w: [
          "NSS ใน SIADH อาจทำให้ Na ลดลงอีก (desalination) เพราะไตขับ Na ออกแต่เก็บน้ำไว้",
          "ช้าเกินไปสำหรับผู้ที่ชัก",
          "ถูก",
          "ไม่ใช่ยาในภาวะฉุกเฉินและเสี่ยงแก้เร็วเกิน",
          "เสี่ยง overcorrection → ODS",
        ],
        k: "Severe symptomatic hyponatremia: 3% NaCl 150 mL/20 นาที (หรือ 100 mL bolus) × 2–3 → เป้า ↑ 5 mEq/L",
      },
      {
        d: "hard",
        p: "ผู้ป่วยรายนี้มีความเสี่ยงสูงต่อ osmotic demyelination (hypokalemia, malnutrition). ภายใน 24 ชั่วโมงแรก ระดับ Na⁺ ไม่ควรเกินเท่าใด (เริ่มต้น 118 mEq/L)?",
        o: ["120 mEq/L", "126 mEq/L", "128 mEq/L", "135 mEq/L", "140 mEq/L"],
        a: 1,
        r: "ผู้ที่เสี่ยง ODS สูง (Na ≤ 105, hypokalemia, alcoholism, malnutrition, liver disease) จำกัดการแก้ไข ≤ 8 mEq/L ใน 24 ชม. → 118 + 8 = 126 mEq/L (ทั่วไปไม่เกิน 10–12 mEq/L/24 ชม.)",
        c: ["เสี่ยงสูง → เพิ่มได้ไม่เกิน 8 mEq/L ใน 24 ชม.", "118 + 8 = 126 mEq/L"],
        w: [
          "เป็นเป้าหมายขั้นต่ำเกินไป (อาการยังไม่ดีขึ้น)",
          "ถูก",
          "+10 ใช้ได้ในผู้ที่เสี่ยงต่ำ ไม่ใช่รายนี้",
          "แก้เร็วเกินมาก เสี่ยง ODS",
          "แก้เร็วเกินมาก",
        ],
        k: "Correction limit: ≤ 10–12 mEq/L/24h (เสี่ยงต่ำ), ≤ 8 mEq/L/24h (เสี่ยงสูง); ถ้าเกินให้ D5W ± desmopressin เพื่อ re-lower",
      },
      {
        d: "medium",
        p: "หลังภาวะคงที่ การรักษาระยะยาวของโรคซึมเศร้าข้อใดเหมาะสมที่สุด?",
        o: [
          "ให้ sertraline ต่อและเพิ่ม tolvaptan ระยะยาว",
          "เปลี่ยนเป็น citalopram",
          "เปลี่ยนเป็น venlafaxine",
          "หยุด sertraline จำกัดน้ำ และเปลี่ยนเป็น mirtazapine พร้อมติดตาม Na⁺",
          "เปลี่ยนเป็น carbamazepine",
        ],
        a: 3,
        r: "หยุดยาที่เป็นสาเหตุ + fluid restriction; เลือกยาต้านซึมเศร้าที่เสี่ยง SIADH ต่ำกว่า เช่น mirtazapine (หรือ bupropion ในบางราย) และติดตาม Na ใน 2–4 สัปดาห์แรก",
        w: [
          "Tolvaptan ระยะยาวมีความเสี่ยง hepatotoxicity และค่าใช้จ่ายสูง ไม่ควรใช้เพื่อคงยาที่เป็นสาเหตุ",
          "SSRI ตัวอื่นเสี่ยง SIADH เช่นกัน",
          "SNRI เสี่ยง SIADH สูง",
          "ถูก",
          "Carbamazepine เป็นสาเหตุของ SIADH และไม่ใช่ยาต้านซึมเศร้า",
        ],
        k: "Antidepressant ที่เสี่ยง hyponatremia ต่ำ: mirtazapine, bupropion; สูง: SSRI, SNRI",
      },
      {
        d: "easy",
        p: "ภาวะแทรกซ้อนสำคัญที่เกิดจากการแก้ไข hyponatremia เรื้อรังเร็วเกินไปคือข้อใด?",
        o: [
          "Cerebral edema",
          "Osmotic demyelination syndrome (central pontine myelinolysis)",
          "Hyperkalemia",
          "Acute kidney injury",
          "Hypoglycemia",
        ],
        a: 1,
        r: "สมองที่ปรับตัวต่อ hyponatremia เรื้อรัง (ขับ osmolytes ออก) เมื่อ Na เพิ่มเร็วเกินจะหดตัว → demyelination (dysarthria, dysphagia, quadriparesis, locked-in) มักเกิด 2–6 วันหลังแก้ไข",
        w: [
          "Cerebral edema เป็นผลของ hyponatremia เฉียบพลัน ไม่ใช่การแก้เร็วเกิน",
          "ถูก",
          "ไม่เกี่ยวข้อง",
          "ไม่เกี่ยวข้อง",
          "ไม่เกี่ยวข้อง",
        ],
        k: "ODS: แก้ Na เรื้อรังเร็วเกิน; อาการเกิดช้า 2–6 วัน",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–26, ข้อ 1–127) → Case 27–28, ข้อ 128–137
export const PC1_DAY08: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d08q",
  caseOffset: 26,
  qOffset: 127,
  createdAt: "2026-09-30 09:00:00",
  posShift: 8,
});
