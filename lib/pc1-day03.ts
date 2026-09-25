import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 3/30 (2 เคส/วัน) · สัปดาห์ที่ 1: ระบบหัวใจและหลอดเลือด
// Case 17: Hypertensive emergency — acute aortic dissection (esmolol/nicardipine/nitroprusside)
// Case 18: Chronic HFrEF — GDMT optimization (ARNI switch, SGLT2i, MRA, beta-blocker titration)

const CASES: Pc1Case[] = [
  {
    title: "Hypertensive emergency: acute aortic dissection",
    base:
      "ชายไทยอายุ 52 ปี น้ำหนัก 70 kg เป็นความดันโลหิตสูง ขาดยามา 6 เดือน มาด้วยเจ็บหน้าอกรุนแรงเหมือนถูกฉีกร้าวทะลุหลัง 1 ชั่วโมง. " +
      "BP 210/120 mmHg (แขนขวา), HR 102 bpm, ไม่มี asthma/COPD. CT angiography: Stanford type B aortic dissection ไม่มี malperfusion. SCr 1.1 mg/dL, K⁺ 4.0 mEq/L",
    ref: "2018 ESC/ESH Hypertension Guideline (hypertensive emergencies); 2022 ACC/AHA Aortic Disease Guideline; Esmolol, nicardipine, sodium nitroprusside prescribing information",
    qs: [
      {
        p: "เป้าหมายการลดความดันโลหิตในผู้ป่วยรายนี้คือข้อใด?",
        o: [
          "ลด MAP ไม่เกิน 25% ในชั่วโมงแรก แล้วค่อยลดเป็น 160/100 ใน 2–6 ชั่วโมง",
          "ลด SBP < 120 mmHg และ HR ประมาณ ≤ 60 ครั้ง/นาทีโดยเร็ว (ภายใน ~20 นาที)",
          "ลด BP ช้า ๆ ด้วยยารับประทานภายใน 24–48 ชั่วโมง",
          "ไม่ลด BP เพื่อรักษา perfusion ของอวัยวะ",
          "ลด SBP < 90 mmHg เพื่อป้องกันการฉีกขาดเพิ่ม",
        ],
        a: 1,
        r: "Acute aortic dissection เป็นข้อยกเว้นของกฎ 'ลด MAP ≤ 25% ในชั่วโมงแรก' — ต้องลด shear stress (dP/dt) ต่อผนังหลอดเลือดทันที โดยลด HR และ SBP ให้ต่ำสุดที่ยังรักษา perfusion ได้",
        w: [
          "เป็นกฎทั่วไปของ hypertensive emergency แต่ไม่ใช้กับ aortic dissection",
          "ถูก",
          "เป็นแนวทาง hypertensive urgency ไม่ใช่ emergency",
          "อันตราย — เสี่ยง dissection ลุกลาม/rupture",
          "ต่ำเกินไป เสี่ยง organ hypoperfusion",
        ],
        k: "ข้อยกเว้นของ ‘MAP ↓ ≤ 25% ใน 1 ชม.’: aortic dissection, severe pre-eclampsia/eclampsia, pheochromocytoma crisis; และ acute ischemic stroke มีเป้าเฉพาะ",
      },
      {
        p: "ยาตัวแรกที่ควรให้คือข้อใด?",
        o: [
          "Sodium nitroprusside เดี่ยว",
          "Hydralazine 10 mg IV",
          "Nifedipine 10 mg อมใต้ลิ้น",
          "Esmolol IV",
          "Furosemide 40 mg IV",
        ],
        a: 3,
        r: "ต้องให้ IV beta-blocker (esmolol หรือ labetalol) ก่อนเพื่อลด HR และ contractility — ถ้าให้ vasodilator ก่อนจะเกิด reflex tachycardia เพิ่ม shear stress. Esmolol ออกฤทธิ์เร็ว t½ ~9 นาที titrate ง่าย",
        w: [
          "Vasodilator เดี่ยวทำให้ reflex tachycardia ต้องให้หลัง beta-blockade",
          "Reflex tachycardia และคาดการณ์ผลได้ยาก",
          "ลด BP ไม่สามารถควบคุมได้ และทำให้ reflex tachycardia — ไม่แนะนำในทุก hypertensive emergency",
          "ถูก: beta-blocker first",
          "ผู้ป่วยไม่ได้ volume overload",
        ],
        k: "Aortic dissection: beta-blocker ก่อน → เพิ่ม vasodilator (nicardipine/clevidipine/nitroprusside) ถ้า SBP ยังสูง",
      },
      {
        p: "แพทย์สั่ง esmolol loading 500 mcg/kg ใน 1 นาที แล้วให้ 50 mcg/kg/min. ใช้ esmolol premixed 2,500 mg/250 mL. ต้องตั้งอัตราการหยด maintenance กี่ mL/h?",
        o: ["2.1 mL/h", "10.5 mL/h", "21 mL/h", "35 mL/h", "210 mL/h"],
        a: 2,
        r: "50 mcg/kg/min × 70 kg = 3,500 mcg/min = 3.5 mg/min = 210 mg/h. ความเข้มข้น 10 mg/mL → 210/10 = 21 mL/h (loading dose = 500 × 70 = 35 mg ใน 1 นาที)",
        c: [
          "ความเข้มข้น = 2,500 mg / 250 mL = 10 mg/mL",
          "Maintenance = 50 mcg/kg/min × 70 kg = 3,500 mcg/min = 3.5 mg/min",
          "3.5 mg/min × 60 = 210 mg/h",
          "210 mg/h ÷ 10 mg/mL = 21 mL/h",
        ],
        w: [
          "ผิดหลักหน่วย (หาร 10 ซ้ำ)",
          "คิดเป็น 25 mcg/kg/min",
          "ถูก",
          "เป็นตัวเลข mg ของ loading dose ไม่ใช่ mL/h",
          "เป็น mg/h ไม่ได้หารความเข้มข้น",
        ],
        k: "mcg/kg/min → mL/h: × น้ำหนัก × 60 ÷ 1,000 ÷ ความเข้มข้น (mg/mL)",
      },
      {
        p: "หลังให้ esmolol 15 นาที HR 58 bpm แต่ BP ยัง 158/94 mmHg. ขั้นต่อไปที่เหมาะสมที่สุดคือข้อใด?",
        o: [
          "เพิ่ม labetalol 20 mg IV bolus ร่วมกับ esmolol",
          "เริ่ม nicardipine IV 5 mg/h และ titrate เพิ่ม 2.5 mg/h ทุก 5–15 นาที (สูงสุด 15 mg/h)",
          "ให้ hydralazine 20 mg IV",
          "ให้ nifedipine IR 10 mg PO",
          "ให้ furosemide 40 mg IV",
        ],
        a: 1,
        r: "เมื่อคุม HR ได้แล้วแต่ SBP ยัง > 120 ให้เพิ่ม IV vasodilator ที่ titrate ได้ เช่น nicardipine หรือ clevidipine (หรือ nitroprusside)",
        w: [
          "Beta-blocker ซ้อน 2 ตัวเสี่ยง bradycardia/hypotension และ HR อยู่ในเป้าแล้ว",
          "ถูก",
          "Titrate ยาก ออกฤทธิ์นานและ reflex tachycardia",
          "ลด BP ไม่สามารถคาดการณ์ได้",
          "ไม่มีข้อบ่งใช้",
        ],
        k: "HR ถึงเป้า + SBP ยังสูง → เพิ่ม titratable IV vasodilator",
      },
      {
        p: "ในอีกกรณีหนึ่ง ผู้ป่วยได้ sodium nitroprusside ขนาดสูงต่อเนื่อง 3 วัน แล้วเกิดสับสน lactic acidosis และ central venous O₂ saturation สูง. สาเหตุและการจัดการที่เหมาะสมที่สุดคือข้อใด?",
        o: [
          "Cyanide toxicity — หยุด nitroprusside และให้ hydroxocobalamin (± sodium thiosulfate)",
          "Methemoglobinemia — ให้ methylene blue",
          "Hypoglycemia — ให้ 50% glucose",
          "Thiocyanate toxicity — ให้ N-acetylcysteine",
          "Serotonin syndrome — ให้ cyproheptadine",
        ],
        a: 0,
        r: "Nitroprusside ปล่อย cyanide 5 ตัว/โมเลกุล เมื่อใช้ขนาดสูง (> 2 mcg/kg/min) หรือนาน จะเกิด cyanide toxicity: เนื้อเยื่อใช้ O₂ ไม่ได้ → lactic acidosis, venous O₂ สูง, สับสน. รักษาด้วยหยุดยา + hydroxocobalamin (จับเป็น cyanocobalamin) ± sodium thiosulfate",
        w: [
          "ถูก",
          "Nitroprusside ทำให้ methemoglobinemia ได้น้อยมาก และไม่อธิบาย venous O₂ สูง",
          "ไม่สอดคล้องกับอาการ",
          "Thiocyanate สะสมในไตวาย (psychosis, tinnitus, seizure) รักษาด้วย hemodialysis ไม่ใช่ NAC",
          "ไม่เกี่ยวข้อง",
        ],
        k: "Nitroprusside: cyanide (acidosis, ภายในวันแรก ๆ ขนาดสูง) vs thiocyanate (ไตวาย, ใช้นาน > 3 วัน); ป้องกันด้วยให้ขนาดต่ำสุด สั้นที่สุด",
      },
    ],
  },
  {
    title: "Chronic HFrEF: GDMT optimization",
    base:
      "หญิงไทยอายุ 66 ปี น้ำหนัก 60 kg เป็น HFrEF (LVEF 30%) NYHA class II–III ไม่เป็นเบาหวาน. ยาปัจจุบัน enalapril 5 mg BID, carvedilol 6.25 mg BID, furosemide 40 mg OD. " +
      "ตรวจติดตามที่คลินิก: BP 112/70 mmHg, HR 78 bpm, ไม่บวม (euvolemic), K⁺ 4.6 mEq/L, SCr 1.2 mg/dL, eGFR 48 mL/min/1.73m². แพทย์ต้องการ optimize GDMT",
    ref: "2022 AHA/ACC/HFSA Heart Failure Guideline; 2021 ESC HF Guideline & 2023 Focused Update; Sacubitril/valsartan, dapagliflozin, spironolactone prescribing information",
    qs: [
      {
        p: "หากเปลี่ยน enalapril เป็น sacubitril/valsartan ข้อใดถูกต้อง?",
        o: [
          "เริ่ม sacubitril/valsartan มื้อถัดไปทันทีหลังหยุด enalapril",
          "ให้ทั้งสองตัวร่วมกัน 1 สัปดาห์แล้วค่อยหยุด enalapril",
          "หยุด enalapril อย่างน้อย 36 ชั่วโมงก่อนเริ่ม sacubitril/valsartan",
          "หยุด enalapril 7 วันก่อนเริ่ม",
          "หยุด enalapril 12 ชั่วโมงก่อนเริ่ม",
        ],
        a: 2,
        r: "ACEI + neprilysin inhibitor ยับยั้งการสลาย bradykinin ร่วมกัน → เสี่ยง angioedema จึงต้องเว้นช่วง ≥ 36 ชั่วโมง (ไม่ต้องเว้นเมื่อเปลี่ยนจาก ARB)",
        w: [
          "เสี่ยง angioedema",
          "ห้ามใช้ร่วมกัน (contraindicated)",
          "ถูก",
          "นานเกินจำเป็น เสียโอกาส RAAS blockade",
          "สั้นเกินไป ต้อง ≥ 36 ชั่วโมง",
        ],
        k: "ACEI → ARNI: washout ≥ 36 ชม.; ARB → ARNI: เปลี่ยนได้เลยมื้อถัดไป",
      },
      {
        p: "ขนาดเริ่มต้นของ sacubitril/valsartan ที่เหมาะสมที่สุดสำหรับผู้ป่วยรายนี้คือข้อใด?",
        o: [
          "24/26 mg วันละครั้ง",
          "24/26 mg วันละ 2 ครั้ง",
          "49/51 mg วันละ 2 ครั้ง",
          "97/103 mg วันละ 2 ครั้ง",
          "97/103 mg วันละครั้ง",
        ],
        a: 1,
        r: "ผู้ป่วยได้ enalapril 10 mg/day (≤ 10 mg/day ถือว่าเป็น low-dose ACEI) และ BP ค่อนข้างต่ำ (112/70) → เริ่ม 24/26 mg BID แล้ว titrate เพิ่มเป็นสองเท่าทุก 2–4 สัปดาห์ จนถึง 97/103 mg BID ตามที่ทนได้",
        c: ["Enalapril 5 mg BID = 10 mg/day → low-dose ACEI (≤ 10 mg/day)", "→ starting dose 24/26 mg BID"],
        w: [
          "ต้องให้วันละ 2 ครั้ง",
          "ถูก",
          "ใช้เมื่อได้ ACEI > 10 mg/day enalapril-equivalent และ BP เพียงพอ",
          "เป็น target dose ไม่ใช่ starting dose",
          "ขนาดและความถี่ไม่ถูกต้อง",
        ],
        k: "ARNI start 24/26 BID: ไม่เคยได้/ได้ ACEI-ARB ขนาดต่ำ, eGFR < 30, ผู้สูงอายุ, hepatic impairment ปานกลาง",
      },
      {
        p: "ยาใดควรเพิ่มเป็น foundational therapy ในผู้ป่วยรายนี้แม้ไม่เป็นเบาหวาน?",
        o: [
          "Dapagliflozin 10 mg OD",
          "Empagliflozin 25 mg OD",
          "Metformin 500 mg BID",
          "Pioglitazone 15 mg OD",
          "Diltiazem 60 mg TID",
        ],
        a: 0,
        r: "SGLT2 inhibitor (dapagliflozin 10 mg หรือ empagliflozin 10 mg) ลด HF hospitalization/CV death ใน HFrEF ทั้งที่มีและไม่มีเบาหวาน เริ่มได้เมื่อ eGFR ≥ 20–25; eGFR อาจลดลงเล็กน้อยช่วงแรก (hemodynamic dip) ไม่ต้องหยุดยา",
        w: [
          "ถูก",
          "ขนาดใน HF คือ 10 mg (25 mg ใช้คุมน้ำตาล)",
          "ไม่มีข้อบ่งใช้ในผู้ไม่เป็นเบาหวาน",
          "TZD ทำให้ fluid retention — ห้ามใน HF",
          "Non-DHP CCB เพิ่มการกำเริบของ HFrEF",
        ],
        k: "HFrEF 4 pillars: ARNI/ACEI/ARB + evidence-based BB + MRA + SGLT2i",
      },
      {
        p: "แพทย์ต้องการเพิ่ม MRA (K⁺ 4.6 mEq/L, eGFR 48). ข้อใดเหมาะสมที่สุด?",
        o: [
          "Spironolactone 50 mg OD",
          "Spironolactone 12.5 mg OD และตรวจ K⁺/SCr ภายใน 1 สัปดาห์",
          "Amiloride 5 mg OD แทน MRA",
          "Eplerenone 50 mg OD ร่วมกับ potassium chloride 20 mEq/day",
          "ยังไม่ควรให้ MRA จนกว่า eGFR > 60",
        ],
        a: 1,
        r: "MRA เริ่มได้เมื่อ K⁺ < 5.0 และ eGFR > 30. eGFR 30–49 → spironolactone 12.5 mg OD (หรือ 25 mg วันเว้นวัน) และตรวจ K⁺/SCr ที่ 3 วันและ 1 สัปดาห์ จากนั้นทุกเดือนใน 3 เดือนแรก",
        w: [
          "ขนาดสูงเกินใน eGFR 48 เสี่ยง hyperkalemia",
          "ถูก",
          "Amiloride ไม่มีหลักฐานลด mortality ใน HFrEF",
          "ไม่ควรเสริม K⁺ เมื่อเริ่ม MRA ร่วมกับ ARNI",
          "eGFR > 30 เริ่มได้",
        ],
        k: "MRA: K⁺ < 5.0 และ eGFR > 30; eGFR 30–49 เริ่มขนาดต่ำ; ติดตาม K⁺ ใกล้ชิด",
      },
      {
        p: "4 สัปดาห์ต่อมา (ได้ ARNI 24/26 mg BID, spironolactone 12.5 mg, dapagliflozin 10 mg) K⁺ 5.7 mEq/L, SCr 1.4 mg/dL ผู้ป่วยเล่าว่าเริ่มใช้ 'เกลือลดโซเดียม' ปรุงอาหาร. การจัดการใดเหมาะสมที่สุด?",
        o: [
          "หยุด GDMT ทั้งหมดจนกว่า K⁺ ปกติ",
          "หยุด dapagliflozin เพราะเป็นสาเหตุ hyperkalemia",
          "ให้ยาเดิมทั้งหมดต่อและให้ sodium polystyrene sulfonate ทุกวัน",
          "หยุดเกลือลดโซเดียม ลด spironolactone เหลือ 12.5 mg วันเว้นวัน และตรวจ K⁺ ซ้ำใน 3–7 วัน",
          "เพิ่ม potassium chloride เพื่อทดแทนการสูญเสียจาก furosemide",
        ],
        a: 3,
        r: "เกลือลดโซเดียมส่วนใหญ่ใช้ KCl แทน NaCl → แหล่ง K⁺ ที่ซ่อนอยู่. ตาม ESC practical guidance: K⁺ > 5.5 → ลด MRA ครึ่งหนึ่ง; K⁺ > 6.0 → หยุด MRA. SCr เพิ่ม < 50% ยอมรับได้ ไม่ต้องหยุด ARNI",
        w: [
          "การหยุด GDMT ทั้งหมดเพิ่มความเสี่ยงเสียชีวิต/นอน รพ.",
          "SGLT2i ไม่เพิ่ม K⁺ (อาจลดความเสี่ยง hyperkalemia ด้วยซ้ำ)",
          "ไม่ได้แก้สาเหตุ และ SPS ระยะยาวเสี่ยง intestinal necrosis",
          "ถูก",
          "ทำให้ hyperkalemia แย่ลง",
        ],
        k: "Hyperkalemia ใน HF: หา hidden K⁺ (เกลือทดแทน, NSAID, TMP) → ลด/หยุด MRA ตามระดับ; พิจารณา K⁺ binder ใหม่ (patiromer, SZC) เพื่อคง RAASi",
      },
      {
        p: "เมื่อ K⁺ กลับเป็น 4.8 mEq/L ผู้ป่วยยัง euvolemic, BP 110/68 mmHg, HR 76 bpm ไม่มีอาการเวียนศีรษะ. การปรับ carvedilol ข้อใดเหมาะสมที่สุด?",
        o: [
          "หยุด carvedilol เพราะ BP ต่ำ",
          "เปลี่ยนเป็น atenolol 50 mg OD",
          "เพิ่ม ivabradine 5 mg BID แทนการเพิ่ม carvedilol",
          "เพิ่ม carvedilol เป็น 12.5 mg BID และ titrate ทุก 2 สัปดาห์จนถึง 25 mg BID ตามที่ทนได้",
          "เพิ่ม carvedilol เป็น 50 mg BID ทันที",
        ],
        a: 3,
        r: "HR 76 > เป้า และไม่มี symptomatic hypotension → เพิ่ม beta-blocker ทีละ 2 เท่าทุก ≥ 2 สัปดาห์ จนถึง target (carvedilol 25 mg BID เมื่อ ≤ 85 kg). BP 110/68 ที่ไม่มีอาการไม่ใช่เหตุผลในการหยุด GDMT",
        w: [
          "BP ต่ำโดยไม่มีอาการไม่ใช่ข้อห้าม",
          "Atenolol ไม่ใช่ evidence-based beta-blocker ใน HFrEF",
          "Ivabradine ใช้เมื่อได้ beta-blocker ขนาดสูงสุดที่ทนได้แล้ว HR ยัง ≥ 70 ใน sinus rhythm",
          "ถูก",
          "เพิ่มเร็วเกินไปและเกิน target dose ของผู้หนัก ≤ 85 kg",
        ],
        k: "Titrate BB ช้า ๆ (double ทุก 2 สัปดาห์) ถึง target: carvedilol 25 BID (≤ 85 kg), bisoprolol 10 OD, metoprolol succinate 200 OD",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–16, ข้อ 1–76) → Case 17–18, ข้อ 77–87
export const PC1_DAY03: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d03q",
  caseOffset: 16,
  qOffset: 76,
  createdAt: "2026-09-26 09:00:00",
});
