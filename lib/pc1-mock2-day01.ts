import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 2 — ข้อใหม่ชุดที่ 1: ไต/อิเล็กโทรไลต์ (5) + ต่อมไร้ท่อ (1) + ระบบประสาท (10)
// ใช้ร่วมกับเคสจากคลังเดิม (ไต: Case 31; ต่อมไร้ท่อ: Case 1, 30)

export const MOCK2_DAY01: Record<string, Pc1MockItem[]> = {
  renal: [
    {
      title: "Severe hyperkalemia with ECG changes",
      base:
        "ชายไทยอายุ 70 ปี น้ำหนัก 65 kg เป็น HFrEF และ CKD G4 (eGFR 22) ใช้ lisinopril 20 mg OD และ spironolactone 25 mg OD. " +
        "มาด้วยอ่อนแรง K 7.0 mmol/L, glucose 110 mg/dL, ECG พบ peaked T waves และ QRS กว้างขึ้น. BP 118/70 mmHg",
      ref: "KDIGO Controversies Conference on Potassium Management 2020; UK Kidney Association Clinical Practice Guideline: Treatment of Acute Hyperkalaemia in Adults 2023",
      qs: [
        {
          d: "easy",
          p: "ยาที่ควรให้เป็นอันดับแรกทันทีคือข้อใด?",
          o: [
            "10% calcium gluconate 10 mL IV ใน 2–3 นาที",
            "Sodium polystyrene sulfonate 30 g PO",
            "Furosemide 80 mg IV",
            "Sodium bicarbonate 50 mEq IV",
            "Salbutamol 2.5 mg พ่นฝอยละออง",
          ],
          a: 0,
          r: "Hyperkalemia ที่มี ECG เปลี่ยนแปลงเสี่ยง arrhythmia ถึงชีวิต ต้องให้ calcium IV ก่อนเพื่อ stabilize cardiac membrane (ออกฤทธิ์ใน 1–3 นาที อยู่ 30–60 นาที) ให้ซ้ำได้ถ้า ECG ยังผิดปกติ โดย calcium ไม่ได้ลดระดับ K",
          w: ["ถูก", "ออกฤทธิ์ช้าหลายชั่วโมง ไม่ใช่ยาฉุกเฉิน", "ออกฤทธิ์ช้าและไม่ป้องกัน arrhythmia ทันที", "ได้ผลน้อยถ้าไม่มี metabolic acidosis", "ใช้ย้าย K เข้าเซลล์ได้ แต่ต้องให้ calcium ก่อนเมื่อ ECG ผิดปกติ"],
          k: "Hyperkalemia + ECG change → calcium gluconate IV ก่อนเสมอ (stabilize membrane ไม่ได้ลด K)",
        },
        {
          d: "medium",
          p: "ขั้นต่อไปเพื่อย้ายโพแทสเซียมเข้าเซลล์ ข้อใดเหมาะสมที่สุด?",
          o: [
            "Regular insulin 10 units IV ร่วมกับ dextrose 25 g IV แล้วติดตามน้ำตาลในเลือด",
            "Regular insulin 10 units IV อย่างเดียว",
            "Dextrose 25 g IV อย่างเดียว",
            "NPH insulin 10 units SC",
            "Glucagon 1 mg IM",
          ],
          a: 0,
          r: "Insulin กระตุ้น Na⁺/K⁺-ATPase ย้าย K เข้าเซลล์ ลด K ได้ 0.6–1.0 mmol/L ใน 15–30 นาที ต้องให้ dextrose ร่วมเมื่อน้ำตาล <250 mg/dL และติดตามน้ำตาลหลายชั่วโมง (ผู้ป่วย CKD เสี่ยง hypoglycemia นาน) ร่วมกับ salbutamol พ่นได้",
          w: ["ถูก", "เสี่ยง hypoglycemia เพราะน้ำตาลปกติ", "Dextrose อย่างเดียวลด K ได้น้อยและอาจทำให้ K สูงขึ้นในผู้ขาด insulin", "ออกฤทธิ์ช้า ไม่เหมาะในภาวะฉุกเฉิน", "ไม่ได้ลดโพแทสเซียม"],
          k: "Shift K: regular insulin 10 U IV + dextrose 25 g (ถ้า glucose <250) ± salbutamol; ติดตามน้ำตาล",
        },
        {
          d: "medium",
          p: "หลังพ้นภาวะฉุกเฉิน แพทย์ต้องการขับโพแทสเซียมออกจากร่างกายและอยากคง lisinopril ไว้เพราะมี HFrEF ข้อใดเหมาะสมที่สุด?",
          o: [
            "หยุด spironolactone ชั่วคราว และเริ่ม sodium zirconium cyclosilicate",
            "หยุด lisinopril ถาวร",
            "ให้ calcium gluconate IV ทุก 6 ชั่วโมง",
            "ให้ insulin/dextrose ซ้ำทุก 4 ชั่วโมงต่อเนื่อง",
            "เพิ่มผลไม้ที่มีโพแทสเซียมต่ำและไม่ต้องทำอย่างอื่น",
          ],
          a: 0,
          r: "Calcium และ insulin เป็นเพียงการรักษาชั่วคราว ต้องขับ K ออกจากร่างกาย: potassium binder รุ่นใหม่ (sodium zirconium cyclosilicate, patiromer) ออกฤทธิ์เร็วกว่าและปลอดภัยกว่า SPS ช่วยให้ใช้ RAAS inhibitor ที่มีประโยชน์ต่อ HF ต่อได้ ร่วมกับทบทวนยาที่เพิ่ม K (หยุด MRA ชั่วคราว) หรือฟอกเลือดถ้าไม่ตอบสนอง",
          w: ["ถูก", "เสียประโยชน์ของ ACEI ใน HFrEF ควรลองจัดการ K ก่อน", "ไม่ได้ลด K เป็นเพียงการป้องกันหัวใจชั่วคราว", "ไม่ได้ขับ K ออกจากร่างกายและเสี่ยง hypoglycemia", "การควบคุมอาหารอย่างเดียวไม่พอในภาวะนี้"],
          k: "หลัง shift ต้อง remove K: SZC/patiromer, loop diuretic, dialysis; binder ช่วยให้ใช้ RAASi ต่อได้",
        },
      ],
    },
    {
      ref: "Potassium chloride injection prescribing information; ASHP Guidelines on IV potassium",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วย K 2.8 mmol/L ต้องให้ KCl ทางหลอดเลือดดำส่วนปลาย (peripheral line) อัตราการให้สูงสุดที่ปลอดภัยโดยทั่วไปคือข้อใด?",
          o: ["10 mEq/h", "20 mEq/h", "40 mEq/h", "60 mEq/h", "80 mEq/h"],
          a: 0,
          r: "KCl ทาง peripheral line ไม่ควรเกิน 10 mEq/h (และความเข้มข้นไม่เกิน ~40 mEq/L ถึง 80 mEq/L ตามนโยบาย) เพราะระคายหลอดเลือดและเสี่ยง arrhythmia. ทาง central line อาจให้ได้ถึง 20 mEq/h โดยติด ECG monitor. ห้ามให้ KCl IV push",
          w: ["ถูก", "ใช้ได้ทาง central line พร้อม ECG monitor", "เร็วเกินไป เสี่ยง arrhythmia", "เร็วเกินไป อันตราย", "เร็วเกินไป อันตรายถึงชีวิต"],
          k: "IV KCl: peripheral ≤10 mEq/h, central ≤20 mEq/h + ECG monitor; ห้าม IV push",
        },
      ],
    },
    {
      ref: "ADA Standards of Care in Diabetes 2026; FDA Drug Safety Communication on metformin in renal impairment (2016)",
      qs: [
        {
          d: "medium",
          p: "ผู้ป่วย T2DM ใช้ metformin 1,000 mg BID มานาน ตรวจล่าสุด eGFR 38 mL/min/1.73m² (คงที่) การจัดการ metformin ข้อใดเหมาะสมที่สุด?",
          o: [
            "ลดขนาดเหลือไม่เกิน 1,000 mg/วัน และติดตาม eGFR ทุก 3–6 เดือน",
            "ใช้ขนาดเดิมต่อ ไม่ต้องปรับ",
            "หยุด metformin ทันทีเพราะห้ามใช้เมื่อ eGFR <45",
            "เพิ่มเป็น 2,550 mg/วัน เพื่อคุมน้ำตาล",
            "เปลี่ยนเป็น glyburide แทน",
          ],
          a: 0,
          r: "Metformin: ห้ามใช้เมื่อ eGFR <30, ไม่แนะนำให้เริ่มใหม่เมื่อ eGFR 30–45 แต่ผู้ที่ใช้อยู่แล้วใช้ต่อได้โดยลดขนาด (โดยทั่วไปไม่เกิน 1,000 mg/วัน) และติดตามไตถี่ขึ้น ลดความเสี่ยง lactic acidosis",
          w: ["ถูก", "ขนาดสูงเกินไปสำหรับ eGFR ระดับนี้", "ห้ามใช้เมื่อ eGFR <30 ไม่ใช่ <45", "เกินขนาดสูงสุดและไม่เหมาะกับไตเสื่อม", "Glyburide เสี่ยง hypoglycemia สูงในไตเสื่อม (Beers)"],
          k: "Metformin: eGFR <30 ห้ามใช้; 30–45 ไม่เริ่มใหม่ ถ้าใช้อยู่ลดขนาด (~≤1,000 mg/วัน)",
        },
      ],
    },
  ],
  endocrine: [
    {
      ref: "ATA Guidelines for the Treatment of Hypothyroidism 2014; Levothyroxine prescribing information",
      qs: [
        {
          d: "easy",
          p: "หญิงอายุ 45 ปี hypothyroidism เริ่ม levothyroxine และทาน calcium carbonate กับ ferrous sulfate ร่วมด้วย คำแนะนำใดถูกต้องที่สุด?",
          o: [
            "ทาน levothyroxine ตอนท้องว่าง 30–60 นาทีก่อนอาหารเช้า และห่างจาก calcium/iron อย่างน้อย 4 ชั่วโมง",
            "ทาน levothyroxine พร้อม calcium และ iron ตอนเช้าเพื่อไม่ให้ลืม",
            "ทาน levothyroxine หลังอาหารเช้าทันที",
            "ทาน levothyroxine วันเว้นวันเพื่อลด ADR",
            "หยุด levothyroxine เมื่ออาการดีขึ้นแล้ว",
          ],
          a: 0,
          r: "Levothyroxine ดูดซึมดีที่สุดขณะท้องว่าง อาหาร กาแฟ calcium iron antacid และ PPI ลดการดูดซึม จึงควรทานก่อนอาหารเช้า 30–60 นาที (หรือก่อนนอน 3–4 ชั่วโมงหลังมื้อสุดท้าย) และแยกเวลาจาก calcium/iron ≥4 ชั่วโมง ตรวจ TSH ซ้ำหลังปรับขนาด 6–8 สัปดาห์",
          w: ["ถูก", "Calcium และ iron จับยาทำให้ดูดซึมลดลง", "อาหารลดการดูดซึม", "ไม่ใช่วิธีการใช้ยามาตรฐาน", "ต้องใช้ต่อเนื่องตลอดชีวิตในส่วนใหญ่"],
          k: "Levothyroxine: ท้องว่าง 30–60 นาทีก่อนอาหาร, แยก Ca/Fe ≥4 ชม., ตรวจ TSH หลัง 6–8 สัปดาห์",
        },
      ],
    },
  ],
  neuro: [
    {
      title: "Parkinson's disease: motor fluctuations and complications",
      base:
        "ชายไทยอายุ 68 ปี เป็นโรคพาร์กินสันมา 7 ปี ใช้ carbidopa/levodopa 25/100 mg วันละ 3 ครั้ง และ pramipexole 0.5 mg วันละ 3 ครั้ง. " +
        "ช่วงหลังอาการสั่นและเคลื่อนไหวช้ากลับมาก่อนถึงมื้อยาถัดไปประมาณ 1 ชั่วโมง",
      ref: "MDS Evidence-Based Medicine Review: Treatments for Motor and Non-Motor Symptoms of Parkinson's Disease; AAN Practice Guidelines",
      qs: [
        {
          d: "easy",
          p: "ภรรยาเล่าว่าผู้ป่วยเล่นการพนันและซื้อของโดยควบคุมตัวเองไม่ได้ ซึ่งไม่เคยเป็นมาก่อน ยาใดน่าจะเป็นสาเหตุมากที่สุด?",
          o: ["Pramipexole", "Carbidopa", "Levodopa ขนาดปัจจุบัน", "Vitamin D", "Omeprazole"],
          a: 0,
          r: "Dopamine agonist (pramipexole, ropinirole) ทำให้เกิด impulse control disorders เช่น เล่นการพนัน ซื้อของ กินมาก hypersexuality ได้บ่อยกว่า levodopa ควรถามคัดกรองทุกครั้งและลดขนาด/หยุด agonist เมื่อพบ",
          w: ["ถูก", "ไม่มีฤทธิ์ในสมอง", "พบได้น้อยกว่า dopamine agonist มาก", "ไม่เกี่ยวข้อง", "ไม่เกี่ยวข้อง"],
          k: "Dopamine agonist → impulse control disorder, sleep attacks, edema, hallucination",
        },
        {
          d: "medium",
          p: "เพื่อแก้อาการ wearing-off ข้อใดเหมาะสมที่สุด?",
          o: [
            "เพิ่ม entacapone 200 mg ทานพร้อม levodopa ทุกมื้อ",
            "เพิ่ม pramipexole เป็น 1.5 mg วันละ 3 ครั้ง",
            "หยุด carbidopa/levodopa แล้วใช้ pramipexole อย่างเดียว",
            "เพิ่ม trihexyphenidyl 2 mg TID",
            "เปลี่ยน carbidopa/levodopa เป็นทานพร้อมอาหารโปรตีนสูง",
          ],
          a: 0,
          r: "Wearing-off จัดการได้โดยยืดฤทธิ์ levodopa: COMT inhibitor (entacapone) ทานพร้อมทุกมื้อ, MAO-B inhibitor, แบ่ง levodopa เป็นมื้อถี่ขึ้น. ผู้ป่วยมี impulse control disorder จึงไม่ควรเพิ่ม dopamine agonist",
          w: ["ถูก", "ผู้ป่วยมี impulse control disorder จาก agonist อยู่แล้ว", "Levodopa มีประสิทธิภาพสูงสุด การหยุดทำให้อาการแย่ลงมาก", "Anticholinergic ไม่ช่วย wearing-off และทำให้สับสนในผู้สูงอายุ", "โปรตีนแย่งการดูดซึมและการขนส่ง levodopa เข้าสมอง"],
          k: "Wearing-off: entacapone, MAO-B inhibitor, หรือแบ่ง levodopa ถี่ขึ้น; โปรตีนลดการดูดซึม levodopa",
        },
        {
          d: "medium",
          p: "ผู้ป่วยนอนโรงพยาบาลด้วยคลื่นไส้อาเจียนจากกระเพาะอาหารอักเสบ ยาแก้คลื่นไส้ที่เหมาะสมที่สุดคือข้อใด?",
          o: ["Domperidone 10 mg TID", "Metoclopramide 10 mg IV q8h", "Prochlorperazine 10 mg IM", "Haloperidol 1 mg IV", "Chlorpromazine 25 mg IM"],
          a: 0,
          r: "Domperidone เป็น D2 antagonist ที่ไม่ผ่าน BBB จึงไม่ทำให้อาการพาร์กินสันแย่ลง (ระวัง QT prolongation). Metoclopramide, phenothiazine และ haloperidol ผ่านเข้าสมอง ต้าน dopamine ทำให้อาการแย่ลงอย่างมาก ห้ามใช้",
          w: ["ถูก", "ผ่าน BBB ทำให้อาการพาร์กินสันแย่ลง", "Phenothiazine ต้าน D2 ในสมอง", "ต้าน D2 แรง อาการแย่ลงมาก", "Phenothiazine ต้าน D2 ในสมอง"],
          k: "Parkinson's + คลื่นไส้: domperidone (ไม่ผ่าน BBB); ห้าม metoclopramide, phenothiazine, haloperidol",
        },
        {
          d: "hard",
          p: "6 เดือนต่อมาผู้ป่วยเห็นภาพหลอนเป็นคนในบ้านตอนกลางคืน ไม่สับสน ไม่ติดเชื้อ ผลเลือดปกติ หลังทบทวนยาแล้วยังมีอาการ การจัดการข้อใดเหมาะสมที่สุด?",
          o: [
            "ลดหรือหยุด pramipexole ก่อน หากยังมีอาการพิจารณา quetiapine ขนาดต่ำ",
            "เริ่ม haloperidol 2 mg ก่อนนอน",
            "เริ่ม risperidone 2 mg ก่อนนอน",
            "หยุด levodopa ทันที",
            "เพิ่ม amantadine 100 mg BID",
          ],
          a: 0,
          r: "Parkinson's disease psychosis: หาและแก้สาเหตุ แล้วลดยาที่มักเป็นต้นเหตุโดยเรียงจาก anticholinergic → amantadine → MAO-B inhibitor → dopamine agonist ก่อน levodopa. ถ้ายังมีอาการใช้ antipsychotic ที่กระทบ D2 น้อย: quetiapine ขนาดต่ำ, clozapine หรือ pimavanserin. ห้าม haloperidol และ risperidone เพราะทำให้การเคลื่อนไหวแย่ลงมาก",
          w: ["ถูก", "ทำให้อาการพาร์กินสันแย่ลงรุนแรง", "ต้าน D2 มาก ทำให้อาการแย่ลง", "Levodopa เป็นยาหลัก ควรลดยาอื่นก่อน การหยุดทันทีเสี่ยง NMS-like syndrome", "Amantadine เองก็ทำให้เกิดภาพหลอนได้"],
          k: "PD psychosis: ลด anticholinergic/amantadine/agonist ก่อน → quetiapine/clozapine/pimavanserin; ห้าม haloperidol/risperidone",
        },
      ],
    },
    {
      title: "Migraine in a woman of reproductive age",
      base:
        "หญิงไทยอายุ 29 ปี เป็นไมเกรนชนิดมีออร่า (เห็นแสงวูบวาบก่อนปวด) ปวดตุบๆ ข้างเดียว คลื่นไส้ ปวด 2–3 ครั้ง/เดือน. " +
        "ใช้ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (ethinylestradiol/levonorgestrel) ไม่สูบบุหรี่ BP 118/74 mmHg",
      ref: "AHS Consensus Statement 2021: Integrating New Migraine Treatments into Clinical Practice; ICHD-3; WHO Medical Eligibility Criteria for Contraceptive Use 2015",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยปวดศีรษะไมเกรนระดับปานกลางถึงรุนแรง ใช้ paracetamol แล้วไม่ได้ผล ยาแก้ปวดเฉียบพลันที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Sumatriptan 50 mg ทันทีที่เริ่มปวด ซ้ำได้หลัง 2 ชั่วโมง ไม่เกิน 200 mg/วัน",
            "Propranolol 40 mg BID ทุกวัน",
            "Tramadol 50 mg ทุก 6 ชั่วโมงเป็นประจำ",
            "Ergotamine ร่วมกับ sumatriptan",
            "Diazepam 5 mg เมื่อปวด",
          ],
          a: 0,
          r: "Triptan เป็น 5-HT1B/1D agonist ใช้รักษาไมเกรนเฉียบพลันระดับปานกลาง–รุนแรง ได้ผลดีที่สุดเมื่อทานเร็วตั้งแต่เริ่มปวด (ไม่ใช่ช่วงออร่า). ห้ามใช้ร่วม ergot ภายใน 24 ชั่วโมง",
          w: ["ถูก", "เป็นยาป้องกัน ไม่ใช่ยารักษาเฉียบพลัน", "Opioid ไม่แนะนำในไมเกรน เสี่ยง MOH และติดยา", "ห้ามใช้ร่วมกันภายใน 24 ชั่วโมง (vasospasm)", "ไม่ใช่ยารักษาไมเกรน"],
          k: "Acute migraine ปานกลาง–รุนแรง → triptan ตั้งแต่เริ่มปวด; ห้ามร่วม ergot ใน 24 ชม.",
        },
        {
          d: "medium",
          p: "1 ปีต่อมาผู้ป่วยปวดศีรษะเกือบทุกวัน ใช้ sumatriptan 12–14 วัน/เดือน มา 4 เดือน ภาวะใดน่าจะเป็นมากที่สุด?",
          o: [
            "Medication-overuse headache",
            "Serotonin syndrome",
            "Tension-type headache จากความเครียด",
            "Cluster headache",
            "ผลข้างเคียงจาก sumatriptan ต่อความดันโลหิต",
          ],
          a: 0,
          r: "Medication-overuse headache (ICHD-3): ปวดศีรษะ ≥15 วัน/เดือนในผู้ที่มีโรคปวดศีรษะเดิม ร่วมกับใช้ triptan/ergot/opioid/ยาผสม ≥10 วัน/เดือน (หรือ simple analgesic ≥15 วัน/เดือน) นานเกิน 3 เดือน จัดการโดยลด/หยุดยาที่ใช้เกินและเริ่มยาป้องกัน",
          w: ["ถูก", "ไม่มีอาการทางระบบประสาทอัตโนมัติหรือกล้ามเนื้อ", "ประวัติเข้ากับการใช้ยาเกิน", "ลักษณะอาการไม่เข้า (ปวดรอบตา สั้น เป็นช่วงๆ)", "ไม่อธิบายการปวดทุกวัน"],
          k: "MOH: triptan/ergot/opioid ≥10 วัน/เดือน หรือ simple analgesic ≥15 วัน/เดือน >3 เดือน",
        },
        {
          d: "hard",
          p: "ประเด็นใดสำคัญที่สุดเกี่ยวกับยาคุมกำเนิดของผู้ป่วยรายนี้?",
          o: [
            "ไมเกรนชนิดมีออร่าเป็นข้อห้ามของยาคุมฮอร์โมนรวม ควรเปลี่ยนเป็นยาคุมชนิดโปรเจสตินอย่างเดียวหรือห่วงอนามัย",
            "ใช้ยาคุมเดิมต่อได้เพราะผู้ป่วยอายุน้อยกว่า 35 ปีและไม่สูบบุหรี่",
            "ควรเปลี่ยนเป็นยาคุมที่มี ethinylestradiol ขนาดสูงขึ้นเพื่อลดไมเกรน",
            "Sumatriptan ลดประสิทธิภาพยาคุม ต้องใช้ถุงยางร่วม",
            "ยาคุมฮอร์โมนรวมป้องกันไมเกรนชนิดมีออร่าได้",
          ],
          a: 0,
          r: "ไมเกรนชนิดมีออร่าเพิ่มความเสี่ยง ischemic stroke และ estrogen เพิ่มความเสี่ยงนี้อีก WHO MEC จัดเป็น category 4 (ห้ามใช้) ไม่ว่าอายุเท่าใด ควรเปลี่ยนเป็น progestin-only pill, implant, DMPA หรือ IUD",
          w: ["ถูก", "ข้อห้ามนี้ไม่ขึ้นกับอายุหรือการสูบบุหรี่", "Estrogen ขนาดสูงเพิ่มความเสี่ยง stroke", "ไม่มีปฏิกิริยานี้", "ไม่จริง และเพิ่มความเสี่ยง stroke"],
          k: "Migraine with aura → ห้ามยาคุมฮอร์โมนรวม (WHO MEC 4); ใช้ progestin-only หรือ IUD",
        },
      ],
    },
    {
      ref: "Donepezil prescribing information; AGS Beers Criteria 2023",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยอัลไซเมอร์อายุ 80 ปี เริ่ม donepezil 5 mg ก่อนนอน อาการไม่พึงประสงค์ใดที่ต้องเฝ้าระวังเป็นพิเศษ?",
          o: [
            "หัวใจเต้นช้าและเป็นลม",
            "ปากแห้ง ท้องผูก ปัสสาวะคั่ง",
            "ความดันโลหิตสูงวิกฤต",
            "Hyperkalemia",
            "น้ำตาลในเลือดต่ำ",
          ],
          a: 0,
          r: "Cholinesterase inhibitor เพิ่ม acetylcholine ทำให้เกิดฤทธิ์ cholinergic: คลื่นไส้ ท้องเสีย เบื่ออาหาร ฝันร้าย และ bradycardia/syncope (vagotonic) เพิ่มการหกล้มในผู้สูงอายุ ระวังเมื่อใช้ร่วม beta-blocker",
          w: ["ถูก", "เป็นฤทธิ์ anticholinergic ตรงข้ามกับ donepezil", "ไม่ใช่ ADR ของยานี้", "ไม่ใช่ ADR ของยานี้", "ไม่ใช่ ADR ของยานี้"],
          k: "Donepezil: GI ADR, bradycardia/syncope, ฝันร้าย; ทานก่อนนอน (ถ้านอนไม่หลับย้ายเป็นเช้า)",
        },
      ],
    },
    {
      ref: "International Consensus Guidance for Management of Myasthenia Gravis 2020 update; FDA boxed warning for fluoroquinolones",
      qs: [
        {
          d: "medium",
          p: "หญิงอายุ 40 ปี เป็น myasthenia gravis ใช้ pyridostigmine เป็น acute cystitis ยาต้านจุลชีพใดควรหลีกเลี่ยงมากที่สุด?",
          o: ["Ciprofloxacin", "Nitrofurantoin", "Fosfomycin", "Cephalexin", "Amoxicillin/clavulanate"],
          a: 0,
          r: "Fluoroquinolone มี boxed warning ว่าทำให้ myasthenia gravis กำเริบ (neuromuscular blockade) อาจถึงขั้นหายใจล้มเหลว. ยาอื่นที่ต้องหลีกเลี่ยง/ระวัง: aminoglycoside, macrolide, magnesium IV, beta-blocker, botulinum toxin",
          w: ["ถูก", "ใช้ได้", "ใช้ได้", "ใช้ได้", "ใช้ได้"],
          k: "Myasthenia gravis: หลีกเลี่ยง fluoroquinolone, aminoglycoside, macrolide, Mg IV, beta-blocker",
        },
      ],
    },
    {
      ref: "FSRH Clinical Guidance: Drug Interactions with Hormonal Contraception 2022; Carbamazepine prescribing information",
      qs: [
        {
          d: "hard",
          p: "หญิงอายุ 25 ปี เริ่ม carbamazepine รักษา focal epilepsy และใช้ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวมอยู่ ต้องการคุมกำเนิดที่ได้ผลแน่นอน คำแนะนำใดเหมาะสมที่สุด?",
          o: [
            "เปลี่ยนเป็นห่วงอนามัยทองแดงหรือห่วงฮอร์โมน levonorgestrel",
            "ใช้ยาคุมเดิมต่อได้ไม่มีปฏิกิริยา",
            "เปลี่ยนเป็น progestin-only pill",
            "ใช้ยาฝังคุมกำเนิด etonogestrel",
            "ทานยาคุมเดิมวันละ 2 เม็ดแทน",
          ],
          a: 0,
          r: "Carbamazepine เป็น enzyme inducer (CYP3A4) เร่งการทำลาย estrogen และ progestin ทำให้ยาคุมรวม progestin-only pill และยาฝังได้ผลลดลง แนะนำวิธีที่ไม่ถูกกระทบ: copper IUD, LNG-IUD หรือ DMPA และต้องใช้วิธีเสริมต่อไปอีก 28 วันหลังหยุด inducer",
          w: ["ถูก", "Carbamazepine ลดประสิทธิภาพยาคุมอย่างชัดเจน", "ถูกลดประสิทธิภาพจาก enzyme induction เช่นกัน", "ระดับยาลดลงจาก enzyme induction ไม่น่าเชื่อถือ", "เพิ่ม ADR และยังไม่รับประกันประสิทธิภาพ"],
          k: "Enzyme inducer (carbamazepine, phenytoin, rifampicin) + hormonal contraception → ใช้ IUD หรือ DMPA",
        },
      ],
    },
  ],
};
