import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 10/30 (2 เคส/วัน) · สัปดาห์ที่ 3: ไต/อิเล็กโทรไลต์ + ต่อมไร้ท่อ
// ผสมระดับความยาก: ง่าย 4 · ปานกลาง 4 · ยาก 2 (เรียงง่าย → ยากภายในเคส)
// Case 31: CKD G5D on hemodialysis — corrected Ca, IV iron, non-calcium binder, ESA Hb target, SHPT (cinacalcet)
// Case 32: Long-term prednisolone — HPA suppression, steroid equivalence, adrenal crisis, sick-day rules, GIOP with low CrCl

const CASES: Pc1Case[] = [
  {
    title: "CKD G5D on hemodialysis: anemia + CKD-MBD",
    base:
      "ชายไทยอายุ 62 ปี น้ำหนัก 60 kg เป็น CKD จากเบาหวาน ฟอกเลือด (hemodialysis) สัปดาห์ละ 3 ครั้ง มา 1 ปี อ่อนเพลีย เหนื่อยง่าย. " +
      "ผลตรวจ: Hb 8.9 g/dL, ferritin 150 ng/mL, TSAT 15%, Ca 8.6 mg/dL, albumin 3.2 g/dL, phosphate 7.2 mg/dL, iPTH 650 pg/mL, 25(OH)D 32 ng/mL. " +
      "ยาปัจจุบัน: calcium carbonate 1,000 mg TID พร้อมอาหาร, folic acid 5 mg OD. ภาพรังสีพบ vascular calcification ที่หลอดเลือดแดงบริเวณขา",
    ref: "KDIGO Clinical Practice Guideline for Anemia in CKD 2012; KDIGO 2017 CKD-MBD Guideline Update; Cinacalcet prescribing information",
    qs: [
      {
        d: "easy",
        p: "ค่า corrected calcium ของผู้ป่วยรายนี้เท่ากับเท่าใด?",
        o: ["8.0 mg/dL", "8.6 mg/dL", "9.2 mg/dL", "9.8 mg/dL", "10.2 mg/dL"],
        a: 2,
        r: "Albumin ต่ำทำให้ total Ca ต่ำกว่าความเป็นจริง ต้องปรับด้วยสูตร corrected Ca = measured Ca + 0.8 × (4 − albumin) = 8.6 + 0.8 × 0.8 ≈ 9.2 mg/dL (อยู่ในช่วงปกติ)",
        c: ["Corrected Ca = Ca + 0.8 × (4.0 − albumin)", "= 8.6 + 0.8 × (4.0 − 3.2)", "= 8.6 + 0.64 ≈ 9.2 mg/dL"],
        w: [
          "ลบค่าปรับแทนการบวก",
          "เป็นค่าที่วัดได้ ยังไม่ได้ปรับตาม albumin",
          "ถูก",
          "ใช้ค่าปรับเกินจริง",
          "คำนวณผิด",
        ],
        k: "Corrected Ca = Ca + 0.8 × (4 − albumin); albumin ต่ำ → total Ca ต่ำลวง",
      },
      {
        d: "easy",
        p: "การจัดการภาวะโลหิตจางขั้นแรกที่เหมาะสมที่สุดสำหรับผู้ป่วยรายนี้คือข้อใด?",
        o: [
          "เริ่ม epoetin alfa ทันทีโดยไม่ต้องให้ธาตุเหล็ก",
          "Ferrous sulfate 200 mg PO วันละครั้ง พร้อม calcium carbonate",
          "ให้ iron sucrose 100 mg IV ทุกครั้งที่ฟอกเลือด รวม 10 ครั้ง (1 g)",
          "ให้เลือด packed red cells 2 unit",
          "เพิ่ม folic acid เป็น 10 mg OD",
        ],
        a: 2,
        r: "ผู้ป่วยขาดธาตุเหล็ก (TSAT ≤30% และ ferritin ≤500 ng/mL) ต้องแก้ก่อนหรือพร้อมกับเริ่ม ESA เพราะ ESA จะไม่ได้ผลเต็มที่ถ้าเหล็กไม่พอ. ใน CKD ที่ฟอกเลือด แนะนำ IV iron เพราะดูดซึมเหล็กจากทางเดินอาหารได้น้อย (hepcidin สูง) และมีสายฟอกเลือดให้ยาได้สะดวก",
        w: [
          "ESA ตอบสนองไม่ดีเมื่อยังขาดเหล็ก",
          "ดูดซึมได้น้อยในผู้ป่วยฟอกเลือด และ calcium carbonate ลดการดูดซึมเหล็กอีก",
          "ถูก",
          "เก็บไว้ใช้เมื่อมีอาการรุนแรงหรือ Hb ต่ำมาก เพราะเสี่ยง sensitization ต่อการปลูกถ่ายไต",
          "Folate ไม่ใช่สาเหตุหลัก และขนาดเดิมเพียงพอแล้ว",
        ],
        k: "CKD anemia: เติมเหล็กก่อน (TSAT ≤30%, ferritin ≤500) → HD ใช้ IV iron; แล้วจึงประเมินเริ่ม ESA",
      },
      {
        d: "medium",
        p: "ผู้ป่วยมี phosphate 7.2 mg/dL และพบ vascular calcification การปรับยาจับฟอสเฟตข้อใดเหมาะสมที่สุด?",
        o: [
          "เพิ่ม calcium carbonate เป็น 1,500 mg TID",
          "เปลี่ยนเป็น calcium acetate 1,334 mg TID",
          "เปลี่ยนเป็น sevelamer carbonate 800 mg TID พร้อมอาหาร",
          "เพิ่ม aluminum hydroxide 600 mg TID ใช้ต่อเนื่องระยะยาว",
          "เพิ่ม calcitriol 0.25 mcg OD เพื่อคุมฟอสเฟต",
        ],
        a: 2,
        r: "KDIGO 2017 แนะนำจำกัดการใช้ยาจับฟอสเฟตกลุ่มแคลเซียมใน CKD G3a–G5D โดยเฉพาะผู้ที่มี vascular calcification เพราะภาระแคลเซียมเพิ่มการสะสมในหลอดเลือด. Sevelamer เป็น non-calcium binder ต้องทานพร้อมอาหาร และยังลด LDL ได้เล็กน้อย",
        w: [
          "เพิ่มภาระแคลเซียม ทำให้ vascular calcification แย่ลง",
          "ยังเป็นยาจับฟอสเฟตกลุ่มแคลเซียม",
          "ถูก",
          "ใช้ระยะยาวเสี่ยงสะสม aluminum (encephalopathy, osteomalacia) ใช้ได้เพียงระยะสั้น",
          "Calcitriol เพิ่มการดูดซึมฟอสเฟตและแคลเซียม ทำให้ฟอสเฟตสูงขึ้น",
        ],
        k: "Hyperphosphatemia + vascular calcification → non-calcium binder (sevelamer, lanthanum) ทานพร้อมอาหาร",
      },
      {
        d: "medium",
        p: "หลังเติมธาตุเหล็กจนเพียงพอ Hb ยังเป็น 9.0 g/dL แพทย์เริ่ม epoetin alfa เป้าหมาย Hb ที่เหมาะสมตามแนวทาง KDIGO คือข้อใด?",
        o: [
          "ให้ Hb อยู่ประมาณ 10–11.5 g/dL และไม่ตั้งใจให้ถึง 13 g/dL",
          "ให้ Hb ≥ 13 g/dL เพื่อลดอาการเหนื่อย",
          "ให้ Hb 12–14 g/dL เท่าคนปกติ",
          "ให้ Hb ≥ 9 g/dL ก็เพียงพอ หยุด ESA เมื่อถึง 9 g/dL",
          "ปรับขนาด ESA ให้ Hb เพิ่มขึ้นอย่างน้อย 2 g/dL ต่อเดือน",
        ],
        a: 0,
        r: "KDIGO แนะนำไม่ใช้ ESA เพื่อคง Hb เกิน 11.5 g/dL และไม่ตั้งใจเพิ่ม Hb ให้เกิน 13 g/dL เพราะการศึกษา (CHOIR, TREAT) พบว่าเป้า Hb สูงเพิ่ม stroke, ความดันโลหิตสูง, thrombosis ของ vascular access และการเสียชีวิต. ควรให้ Hb ขึ้นไม่เกิน ~1–2 g/dL ต่อเดือน",
        w: [
          "ถูก",
          "เพิ่ม stroke และ CV events",
          "เป้าสูงเกินไป เพิ่มความเสี่ยงโดยไม่ได้ประโยชน์เพิ่ม",
          "Hb 9 ยังต่ำเกินไป และการหยุด ESA ทันทีทำให้ Hb ผันผวน",
          "เพิ่มเร็วเกินไป เสี่ยงความดันโลหิตสูงและ thrombosis",
        ],
        k: "ESA ใน CKD: เริ่มเมื่อ Hb <10 (HD), เป้า ~10–11.5, ห้ามตั้งใจเกิน 13; Hb ขึ้น ≤1–2 g/dL/เดือน",
      },
      {
        d: "hard",
        p: "ผู้ป่วยมี iPTH 650 pg/mL (สูงกว่า 9 เท่าของค่าปกติ) ร่วมกับ phosphate สูง ส่วน corrected Ca และ 25(OH)D ปกติ ยาลด PTH ข้อใดเหมาะสมที่สุดในตอนนี้?",
        o: [
          "Calcitriol 0.5 mcg OD",
          "Ergocalciferol 20,000 IU สัปดาห์ละครั้ง",
          "Cinacalcet 30 mg OD พร้อมอาหาร และติดตามระดับ Ca",
          "ส่งผ่าตัด parathyroidectomy ทันที",
          "Paricalcitol ร่วมกับเพิ่ม calcium carbonate",
        ],
        a: 2,
        r: "Secondary hyperparathyroidism ใน CKD G5D ที่ PTH สูงกว่า 9 เท่าของค่าปกติ ต้องใช้ยาลด PTH (calcimimetic, calcitriol/vitamin D analog หรือร่วมกัน). เมื่อฟอสเฟตยังสูง ควรเลือก cinacalcet เพราะลดทั้ง PTH, Ca และ P ในขณะที่ calcitriol เพิ่มการดูดซึม Ca/P ทำให้ฟอสเฟตแย่ลง. ติดตาม hypocalcemia (ไม่เริ่มยาถ้า Ca ต่ำ) และระวัง DDI เพราะ cinacalcet ยับยั้ง CYP2D6",
        w: [
          "เพิ่มการดูดซึมฟอสเฟตและแคลเซียม ขณะที่ฟอสเฟตสูงอยู่แล้ว",
          "ให้เฉพาะเมื่อขาด vitamin D แต่ 25(OH)D ของผู้ป่วยปกติ",
          "ถูก",
          "พิจารณาเมื่อดื้อต่อยาหรือมีภาวะแทรกซ้อนรุนแรง ไม่ใช่ขั้นแรก",
          "Vitamin D analog ร่วมกับแคลเซียมเพิ่ม เสี่ยง hypercalcemia และ calcification",
        ],
        k: "SHPT + ฟอสเฟตสูง → cinacalcet (ลด PTH, Ca, P); ADR hypocalcemia, คลื่นไส้; CYP2D6 inhibitor",
      },
    ],
  },
  {
    title: "Long-term prednisolone: adrenal crisis + GIOP",
    base:
      "หญิงไทยอายุ 55 ปี วัยหมดประจำเดือน น้ำหนัก 50 kg เป็น polymyalgia rheumatica ได้ prednisolone ต่อเนื่องมา 8 เดือน (เริ่ม 15 mg/day ปัจจุบัน 10 mg/day). " +
      "มีโรคความดันโลหิตสูง SCr 1.9 mg/dL (CrCl ประมาณ 26 mL/min). " +
      "มาโรงพยาบาลด้วยไข้ ไอ ปอดอักเสบ หยุดทานยา prednisolone เองมา 3 วันเพราะอาเจียน. BP 84/50 mmHg หลังให้ NSS 2 L ยังไม่ขึ้น, glucose 62 mg/dL, Na 131 mmol/L, K 4.6 mmol/L",
    ref: "Endocrine Society Clinical Practice Guideline: Diagnosis and Treatment of Primary Adrenal Insufficiency 2016; European Society of Endocrinology/Endocrine Society Guideline on Glucocorticoid-Induced Adrenal Insufficiency 2024; ACR Guideline for Prevention and Treatment of Glucocorticoid-Induced Osteoporosis 2022",
    qs: [
      {
        d: "easy",
        p: "สาเหตุที่ผู้ป่วยรายนี้เกิดภาวะต่อมหมวกไตทำงานไม่พอเมื่อหยุด prednisolone คือข้อใด?",
        o: [
          "Glucocorticoid จากภายนอกกด HPA axis ทำให้ CRH/ACTH ลดลงและ adrenal cortex ฝ่อ",
          "Prednisolone ทำลายต่อมหมวกไตโดยตรงแบบ autoimmune",
          "Prednisolone ยับยั้งเอนไซม์ 11β-hydroxylase ในต่อมหมวกไต",
          "Prednisolone เพิ่มการสร้าง aldosterone จนต่อมหมวกไตล้า",
          "Prednisolone เร่งการทำลาย cortisol ที่ตับผ่าน CYP3A4",
        ],
        a: 0,
        r: "การได้ glucocorticoid ขนาดเทียบเท่า prednisolone ≥5 mg/day นานเกิน 3–4 สัปดาห์ กด hypothalamus–pituitary ทำให้ ACTH ต่ำ adrenal cortex (zona fasciculata) ฝ่อ เมื่อหยุดยาทันทีหรือเจ็บป่วยหนักจึงสร้าง cortisol ไม่พอ (secondary/tertiary adrenal insufficiency). Aldosterone ยังปกติเพราะควบคุมด้วย RAAS จึงมักไม่มี hyperkalemia",
        w: [
          "ถูก",
          "เป็นกลไกของ Addison's disease (primary AI)",
          "เป็นกลไกของ metyrapone",
          "Prednisolone ไม่ได้กระตุ้นการสร้าง aldosterone",
          "ไม่ใช่กลไกหลัก (เป็นกลไกของยากระตุ้น CYP3A4 เช่น rifampicin ที่เร่ง metabolism ของ steroid)",
        ],
        k: "Glucocorticoid-induced AI = HPA suppression (ACTH ต่ำ); aldosterone ปกติ → K มักปกติ ต่างจาก primary AI",
      },
      {
        d: "easy",
        p: "Prednisolone 10 mg/day มีฤทธิ์ glucocorticoid เทียบเท่า hydrocortisone ขนาดเท่าใดต่อวัน?",
        o: ["20 mg", "30 mg", "40 mg", "50 mg", "80 mg"],
        a: 2,
        r: "ความแรงสัมพัทธ์ของ glucocorticoid: hydrocortisone 20 mg ≈ prednisolone 5 mg ≈ methylprednisolone 4 mg ≈ dexamethasone 0.75 mg. ดังนั้น prednisolone 10 mg ≈ hydrocortisone 40 mg",
        c: ["Hydrocortisone : prednisolone = 20 : 5 = 4 : 1", "Prednisolone 10 mg × 4 = hydrocortisone 40 mg"],
        w: [
          "เทียบเท่า prednisolone 5 mg",
          "คำนวณผิด",
          "ถูก",
          "คำนวณผิด",
          "เทียบเท่า prednisolone 20 mg",
        ],
        k: "Steroid equivalence: HC 20 = pred 5 = MP 4 = dexa 0.75 mg",
      },
      {
        d: "medium",
        p: "แพทย์วินิจฉัย adrenal crisis การรักษาด้วยยาที่เหมาะสมที่สุดในตอนนี้คือข้อใด?",
        o: [
          "Hydrocortisone 100 mg IV bolus แล้วตามด้วย 200 mg/24 ชั่วโมง (เช่น 50 mg IV ทุก 6 ชั่วโมง) ร่วมกับให้สารน้ำ",
          "Prednisolone 10 mg PO ขนาดเดิม เมื่อหยุดอาเจียน",
          "Fludrocortisone 0.1 mg PO OD",
          "งด steroid ทั้งหมดจนกว่าการติดเชื้อจะหาย",
          "Dexamethasone 0.5 mg IV OD",
        ],
        a: 0,
        r: "Adrenal crisis ต้องให้ hydrocortisone ขนาดสูงทางหลอดเลือดทันทีโดยไม่ต้องรอผลตรวจ: 100 mg IV bolus แล้ว 200 mg/24 ชม. (continuous infusion หรือแบ่งทุก 6 ชม.) ร่วมกับ NSS และ dextrose แก้ hypoglycemia. Hydrocortisone ขนาดนี้มีฤทธิ์ mineralocorticoid เพียงพอจึงไม่ต้องให้ fludrocortisone ในช่วงแรก ค่อยๆ ลดขนาดเมื่ออาการคงที่",
        w: [
          "ถูก",
          "ทางกินไม่แน่นอนในผู้ที่อาเจียน และขนาดต่ำเกินไปสำหรับภาวะวิกฤต",
          "ไม่มีฤทธิ์ glucocorticoid เพียงพอ และไม่จำเป็นเมื่อได้ hydrocortisone ขนาดสูง",
          "การหยุด steroid ทำให้ช็อกรุนแรงขึ้น การติดเชื้อไม่ใช่ข้อห้าม",
          "ขนาดต่ำเกินไปและไม่มีฤทธิ์ mineralocorticoid",
        ],
        k: "Adrenal crisis: hydrocortisone 100 mg IV stat → 200 mg/24 h + NSS + dextrose; อย่ารอผล lab",
      },
      {
        d: "medium",
        p: "ก่อนกลับบ้าน (ได้ prednisolone 10 mg/day ต่อ) คำแนะนำ sick-day rules ข้อใดถูกต้องที่สุด?",
        o: [
          "เมื่อไข้ ≥38 °C หรือเจ็บป่วยต้องนอนพัก ให้เพิ่มขนาดเป็น 2 เท่า (20 mg/day) จนหายป่วย; ถ้าอาเจียนกินยาไม่ได้ให้ฉีด hydrocortisone และมาโรงพยาบาลทันที",
          "เมื่อไม่สบายให้หยุด prednisolone ชั่วคราวเพื่อให้ภูมิคุ้มกันทำงาน",
          "ถ้าอาเจียนหลังทานยาให้รอทานมื้อถัดไปในวันรุ่งขึ้น",
          "เพิ่มขนาดยาเฉพาะเมื่อต้องผ่าตัดใหญ่เท่านั้น",
          "เมื่อป่วยให้เปลี่ยนเป็น dexamethasone ขนาดเท่ากัน (10 mg/day)",
        ],
        a: 0,
        r: "ผู้ที่ HPA axis ถูกกดต้องเพิ่ม glucocorticoid ในภาวะเครียด: ไข้หรือป่วยที่ต้องพัก → เพิ่มเป็น 2 เท่า (ไข้ ≥39 °C อาจ 3 เท่า) ต่อจนหายแล้วกลับขนาดเดิม; อาเจียน/ท้องเสียรุนแรง → ฉีด hydrocortisone 100 mg IM/SC แล้วมาโรงพยาบาล. ควรพกบัตรแจ้งภาวะ steroid dependence",
        w: [
          "ถูก",
          "เสี่ยง adrenal crisis ซ้ำ",
          "ทำให้ขาดยาและเสี่ยง crisis ควรทานซ้ำหรือฉีด",
          "ภาวะเครียดทุกชนิด เช่น ไข้ ติดเชื้อ ก็ต้องเพิ่มขนาด",
          "Dexamethasone 10 mg แรงกว่า prednisolone 10 mg ราว 6–7 เท่า เป็นการเปลี่ยนที่ไม่ถูกต้อง",
        ],
        k: "Sick-day rules: ไข้/ป่วย → double dose; อาเจียน → hydrocortisone ฉีด + มา รพ.; พก steroid card",
      },
      {
        d: "hard",
        p: "BMD พบ T-score ที่ lumbar spine −2.6 แพทย์ต้องการเริ่มยารักษา glucocorticoid-induced osteoporosis (ให้ calcium และ vitamin D ร่วมแล้ว) ยาข้อใดเหมาะสมที่สุดสำหรับผู้ป่วยรายนี้?",
        o: [
          "Alendronate 70 mg PO สัปดาห์ละครั้ง",
          "Zoledronic acid 5 mg IV ปีละครั้ง",
          "Denosumab 60 mg SC ทุก 6 เดือน และติดตามระดับ Ca",
          "Raloxifene 60 mg PO OD",
          "Calcitonin nasal spray 200 IU OD",
        ],
        a: 2,
        r: "ผู้ป่วยได้ prednisolone ≥2.5 mg/day นานเกิน 3 เดือนร่วมกับ T-score ≤−2.5 → เสี่ยงกระดูกหักสูง ต้องใช้ยา. ยาขั้นแรกคือ oral bisphosphonate แต่ผู้ป่วยมี CrCl ~26 mL/min ซึ่งไม่ควรใช้ alendronate (CrCl <35) และ zoledronic acid (CrCl <35 ห้ามใช้). Denosumab ไม่ขับทางไตจึงใช้ได้ ต้องแก้ vitamin D ให้พอและติดตาม hypocalcemia (เสี่ยงมากขึ้นใน CKD) และห้ามหยุดยาเองเพราะเสี่ยง rebound vertebral fractures (teriparatide เป็นอีกทางเลือกในผู้เสี่ยงสูงมาก)",
        w: [
          "ไม่แนะนำเมื่อ CrCl <35 mL/min",
          "ห้ามใช้เมื่อ CrCl <35 mL/min เสี่ยงไตวายเฉียบพลัน",
          "ถูก",
          "ข้อมูลใน GIOP จำกัด และเพิ่มความเสี่ยง VTE",
          "ประสิทธิภาพต่ำ ไม่ใช่ยาหลัก",
        ],
        k: "GIOP: oral BP first-line; CrCl <35 → denosumab (ติดตาม Ca, ห้ามหยุดเอง) หรือ teriparatide",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–30, ข้อ 1–147) → Case 31–32, ข้อ 148–157
export const PC1_DAY10: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d10q",
  caseOffset: 30,
  qOffset: 147,
  createdAt: "2026-10-02 09:00:00",
  posShift: 1,
});
