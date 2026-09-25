import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 5/30 (2 เคส/วัน) · สัปดาห์ที่ 2: โรคติดเชื้อ
// Case 21: Septic shock (cholangitis, Pseudomonas bacteremia) — dosing weight, extended-interval gentamicin, nomogram, extended-infusion β-lactam, de-escalation
// Case 22: Adult bacterial meningitis — empiric regimen, dexamethasone, de-escalation by MIC, chemoprophylaxis in pregnancy, Listeria

const CASES: Pc1Case[] = [
  {
    title: "Septic shock + extended-interval aminoglycoside",
    base:
      "ชายไทยอายุ 68 ปี สูง 170 cm น้ำหนัก 90 kg มาด้วยไข้ หนาวสั่น ตัวเหลือง ปวดท้องขวาบน BP 82/50 mmHg หลังให้สารน้ำ 30 mL/kg ต้องใช้ norepinephrine. " +
      "วินิจฉัย acute cholangitis with septic shock ทำ ERCP drainage แล้ว. SCr 1.2 mg/dL ก่อนป่วยปกติ. " +
      "แพทย์เริ่ม piperacillin/tazobactam ร่วมกับ gentamicin แบบ extended-interval (7 mg/kg) ระหว่างรอผลเพาะเชื้อ",
    ref: "Surviving Sepsis Campaign 2021; Nicolau DP et al. (Hartford once-daily aminoglycoside program) AAC 1995; IDSA 2024 Guidance on Antimicrobial-Resistant Gram-Negative Infections; Tokyo Guidelines 2018",
    qs: [
      {
        p: "น้ำหนักที่ควรใช้คำนวณขนาด gentamicin ของผู้ป่วยรายนี้ใกล้เคียงข้อใดที่สุด?",
        o: ["66 kg", "72 kg", "76 kg", "81 kg", "90 kg"],
        a: 2,
        r: "Aminoglycoside กระจายในน้ำนอกเซลล์ ไม่กระจายในไขมัน → ใช้ IBW; ถ้า TBW > 120% IBW ให้ใช้ adjusted BW = IBW + 0.4 (TBW − IBW)",
        c: [
          "IBW (ชาย) = 50 + 2.3 × (170/2.54 − 60) = 50 + 2.3 × 6.93 ≈ 66 kg",
          "120% IBW = 79 kg < TBW 90 kg → ใช้ AdjBW",
          "AdjBW = 66 + 0.4 × (90 − 66) = 66 + 9.6 ≈ 76 kg",
        ],
        w: [
          "เป็น IBW — ใช้เมื่อ TBW ไม่เกิน 120% IBW",
          "คำนวณ AdjBW ผิดตัวคูณ (0.25)",
          "ถูก",
          "คำนวณ AdjBW ผิดตัวคูณ (0.6)",
          "TBW ทำให้ได้ขนาดสูงเกินในผู้ป่วยอ้วน",
        ],
        k: "Aminoglycoside dosing weight: IBW; ถ้า TBW > 120% IBW → AdjBW (factor 0.4)",
      },
      {
        p: "ขนาด gentamicin แบบ extended-interval 7 mg/kg ของผู้ป่วยรายนี้ใกล้เคียงข้อใดที่สุด?",
        o: ["180 mg", "460 mg", "530 mg", "630 mg", "700 mg"],
        a: 2,
        r: "7 mg/kg × AdjBW 76 kg ≈ 532 mg → ประมาณ 530 mg IV หยดใน 30–60 นาที. Extended-interval ใช้หลัก concentration-dependent killing (Cmax/MIC ≥ 8–10) และ post-antibiotic effect",
        c: ["7 mg/kg × 76 kg = 532 mg ≈ 530 mg"],
        w: [
          "เป็นขนาด conventional (~2.4 mg/kg) ไม่ใช่ extended-interval",
          "คิดจาก IBW 66 kg",
          "ถูก",
          "คิดจาก TBW 90 kg",
          "สูงเกิน",
        ],
        k: "Extended-interval AG: gentamicin/tobramycin 5–7 mg/kg, amikacin 15–20 mg/kg ใช้ dosing weight ที่ถูกต้อง",
      },
      {
        p: "ตรวจระดับ gentamicin ที่ 10 ชั่วโมงหลังเริ่มให้ยา = 5.1 mg/L. ตาม nomogram ของโรงพยาบาล (ดัดแปลงจาก Hartford สำหรับ 7 mg/kg ที่ 10 ชม.: < 4.2 → q24h; 4.2–6.5 → q36h; 6.6–9 → q48h; > 9 → ตรวจระดับซ้ำและให้เมื่อ < 1 mg/L) ควรให้ยาครั้งถัดไปอย่างไร?",
        o: [
          "ให้ขนาดเดิมทุก 24 ชั่วโมง",
          "ให้ขนาดเดิมทุก 36 ชั่วโมง",
          "ให้ขนาดเดิมทุก 48 ชั่วโมง",
          "ลดขนาดเหลือครึ่งหนึ่งแต่ให้ทุก 24 ชั่วโมง",
          "หยุด gentamicin ถาวรทันที",
        ],
        a: 1,
        r: "ระดับ 5.1 mg/L ที่ 10 ชม. อยู่ในช่วง 4.2–6.5 → q36h. Extended-interval ปรับที่ ‘ระยะห่าง’ ไม่ใช่ลดขนาด เพื่อคง Cmax สูงและให้ trough ต่ำ (drug-free period ลด nephrotoxicity)",
        w: [
          "ระดับสูงกว่าช่วง q24h",
          "ถูก",
          "เป็นช่วง 6.6–9 mg/L",
          "การลดขนาดทำให้ Cmax/MIC ต่ำ เสีย concentration-dependent killing",
          "ไม่มีข้อบ่งชี้ต้องหยุด แค่ปรับ interval",
        ],
        k: "Extended-interval AG: ปรับ interval ตาม nomogram, คง dose; ใช้ไม่ได้ใน burn, ascites มาก, pregnancy, CrCl < 20, endocarditis (synergy)",
      },
      {
        p: "เพื่อให้ piperacillin/tazobactam ได้ผลตามหลัก PK/PD ดีที่สุดในผู้ป่วย septic shock ควรให้อย่างไร?",
        o: [
          "4.5 g IV bolus ใน 5 นาที ทุก 8 ชั่วโมง",
          "13.5 g IV วันละครั้ง เพื่อให้ Cmax สูง",
          "4.5 g IV หยดนาน 4 ชั่วโมง (extended infusion) ทุก 8 ชั่วโมง หลังให้ loading dose",
          "2.25 g IV ทุก 12 ชั่วโมง เพื่อลดพิษต่อไต",
          "เพิ่ม meropenem ร่วมเพื่อ synergy",
        ],
        a: 2,
        r: "Beta-lactam เป็น time-dependent killing (เป้าหมาย fT > MIC ≥ 50–100%) — extended/continuous infusion เพิ่ม fT > MIC โดยเฉพาะในผู้ป่วยวิกฤตที่ Vd เพิ่มและเชื้อ MIC สูง (Surviving Sepsis 2021 แนะนำ prolonged infusion)",
        w: [
          "Bolus สั้นทำให้ fT > MIC ต่ำลง",
          "Once-daily เหมาะกับยา concentration-dependent เช่น aminoglycoside ไม่ใช่ beta-lactam",
          "ถูก",
          "ขนาดต่ำเกินในภาวะวิกฤต (Vd เพิ่ม) และ CrCl ไม่ได้ต่ำขนาดนั้น",
          "Double beta-lactam ไม่เพิ่มประโยชน์และเพิ่ม ADR/resistance",
        ],
        k: "Time-dependent (β-lactam, vancomycin AUC) vs concentration-dependent (AG, FQ, daptomycin)",
      },
      {
        p: "วันที่ 3 hemoculture: Pseudomonas aeruginosa ไวต่อ piperacillin/tazobactam, ceftazidime, gentamicin. ผู้ป่วยหยุด norepinephrine ได้ ไข้ลง และ drainage ดี. ข้อใดเหมาะสมที่สุด?",
        o: [
          "ให้ทั้ง piperacillin/tazobactam และ gentamicin ต่อจนครบ 14 วัน",
          "หยุด piperacillin/tazobactam ให้ gentamicin เดี่ยวต่อ",
          "เปลี่ยนเป็น meropenem เพื่อความครอบคลุมที่กว้างขึ้น",
          "หยุด gentamicin ให้ piperacillin/tazobactam เดี่ยวต่อ รวมประมาณ 7 วันหลังควบคุม source ได้",
          "เพิ่ม ciprofloxacin เป็นยาตัวที่ 3",
        ],
        a: 3,
        r: "เมื่อทราบความไวของเชื้อแล้ว ไม่จำเป็นต้องให้ combination therapy ต่อ (double coverage มีไว้ป้องกันการเลือกยาไม่ครอบคลุมในช่วง empiric). Gram-negative bacteremia ที่ควบคุม source ได้และอาการดีขึ้น 7 วันไม่ด้อยกว่า 14 วัน และลดพิษจาก aminoglycoside",
        w: [
          "Combination นานเพิ่มพิษต่อไต/หู โดยไม่เพิ่มประโยชน์",
          "Aminoglycoside เดี่ยวไม่เพียงพอสำหรับ bacteremia (ยกเว้น UTI)",
          "Escalation ที่ไม่จำเป็น เพิ่ม carbapenem resistance",
          "ถูก: de-escalation + short course",
          "ไม่มีข้อบ่งใช้",
        ],
        k: "Antimicrobial stewardship: culture → de-escalate → shortest effective duration",
      },
    ],
  },
  {
    title: "Adult bacterial meningitis",
    base:
      "ชายไทยอายุ 55 ปี น้ำหนัก 70 kg ไข้สูง ปวดศีรษะรุนแรง คอแข็ง สับสน 1 วัน ไม่มีภาวะภูมิคุ้มกันบกพร่อง ไม่แพ้ยา. CT brain ไม่มี mass. " +
      "CSF: WBC 2,500 cells/mm³ (neutrophil 90%), protein 250 mg/dL, glucose 25 mg/dL (serum 110 mg/dL), Gram stain: Gram-positive diplococci. SCr 0.9 mg/dL",
    ref: "IDSA Practice Guidelines for Bacterial Meningitis (Tunkel 2004) & Healthcare-Associated Ventriculitis/Meningitis 2017; ESCMID 2016 Guideline; CDC Meningococcal Chemoprophylaxis",
    qs: [
      {
        p: "Empiric antibiotic regimen ใดเหมาะสมที่สุด?",
        o: [
          "Ceftriaxone 1 g IV OD",
          "Ceftriaxone 2 g IV q12h + vancomycin",
          "Ceftriaxone 2 g IV q12h + vancomycin + ampicillin 2 g IV q4h",
          "Cefazolin 2 g IV q8h + gentamicin",
          "Levofloxacin 750 mg IV OD",
        ],
        a: 2,
        r: "ผู้ใหญ่อายุ ≥ 50 ปี: ครอบคลุม S. pneumoniae (รวม penicillin/ceftriaxone-resistant → vancomycin), N. meningitidis และ Listeria monocytogenes (→ ampicillin) — cephalosporin ไม่ครอบคลุม Listeria. ใช้ ceftriaxone ขนาด meningitis (2 g q12h) เพื่อให้ผ่าน BBB เพียงพอ",
        w: [
          "ขนาด CAP/ทั่วไป ไม่พอสำหรับ CNS",
          "ขาด Listeria coverage ในผู้ที่อายุ ≥ 50 ปี",
          "ถูก",
          "Cefazolin ผ่าน BBB ไม่ดี และ gentamicin เข้า CSF น้อย",
          "Fluoroquinolone ไม่ใช่ empiric first-line และไม่ครอบคลุม Listeria เพียงพอ",
        ],
        k: "Meningitis empiric: 2–50 ปี ceftriaxone + vancomycin; > 50 ปี/immunocompromised + ampicillin",
      },
      {
        p: "การให้ dexamethasone ในผู้ป่วยรายนี้ข้อใดถูกต้อง?",
        o: [
          "Dexamethasone 10 mg IV q6h × 4 วัน เริ่มก่อนหรือพร้อมยาปฏิชีวนะโดสแรก",
          "Dexamethasone 4 mg IV q8h เริ่มหลังให้ยาปฏิชีวนะ 24 ชั่วโมง",
          "Hydrocortisone 50 mg IV q6h × 7 วัน",
          "ให้เฉพาะเมื่อ Gram stain เป็น Gram-negative",
          "ไม่ควรให้ เพราะกดภูมิคุ้มกัน",
        ],
        a: 0,
        r: "Dexamethasone 0.15 mg/kg (70 kg ≈ 10 mg) IV q6h × 2–4 วัน เริ่ม 10–20 นาทีก่อนหรือพร้อมยาปฏิชีวนะโดสแรก ลด mortality และ hearing loss ใน pneumococcal meningitis — ถ้าให้ยาปฏิชีวนะไปแล้วไม่ควรเริ่ม",
        c: ["0.15 mg/kg × 70 kg = 10.5 ≈ 10 mg IV q6h"],
        w: [
          "ถูก",
          "เริ่มช้าเกินไป ไม่ได้ประโยชน์ และขนาดไม่ถูก",
          "ไม่มีหลักฐานใน meningitis",
          "ประโยชน์ชัดที่สุดใน S. pneumoniae (Gram-positive diplococci)",
          "ประโยชน์เหนือความเสี่ยงเมื่อให้ถูกเวลา",
        ],
        k: "Dexamethasone: ก่อน/พร้อมยาปฏิชีวนะโดสแรก; หยุดถ้าไม่ใช่ S. pneumoniae",
      },
      {
        p: "CSF culture: S. pneumoniae — penicillin MIC 0.12 mg/L, ceftriaxone MIC 0.25 mg/L (breakpoint สำหรับ meningitis: penicillin ≤ 0.06, ceftriaxone ≤ 0.5 = susceptible). ข้อใดเหมาะสมที่สุด?",
        o: [
          "เปลี่ยนเป็น penicillin G 4 MU IV q4h",
          "ให้ทั้ง 3 ตัวต่อจนครบ 21 วัน",
          "หยุด vancomycin และ ampicillin ให้ ceftriaxone 2 g IV q12h ต่อ รวม 10–14 วัน",
          "เปลี่ยนเป็น amoxicillin รับประทานเมื่อไข้ลง",
          "หยุด ceftriaxone ให้ vancomycin เดี่ยว",
        ],
        a: 2,
        r: "เชื้อดื้อ penicillin (MIC 0.12 > 0.06) แต่ไว ceftriaxone (MIC ≤ 0.5) → de-escalate เป็น ceftriaxone เดี่ยว; หยุด ampicillin (ไม่ใช่ Listeria) และ vancomycin; pneumococcal meningitis ให้ 10–14 วัน",
        w: [
          "เชื้อดื้อ penicillin ตาม meningitis breakpoint",
          "ยาเกินจำเป็นและนานเกิน",
          "ถูก",
          "Oral beta-lactam เข้า CSF ไม่พอ",
          "Vancomycin เดี่ยวเข้า CSF ได้ไม่ดี (โดยเฉพาะเมื่อได้ dexamethasone)",
        ],
        k: "Meningitis duration: N. meningitidis 7 วัน, S. pneumoniae 10–14 วัน, Listeria ≥ 21 วัน, Gram-negative bacilli 21 วัน",
      },
      {
        p: "สมมติว่าเชื้อก่อโรคเป็น N. meningitidis ภรรยาของผู้ป่วยซึ่งตั้งครรภ์ 20 สัปดาห์เป็นผู้สัมผัสใกล้ชิด ควรให้ยาป้องกันใด?",
        o: [
          "Ciprofloxacin 500 mg PO ครั้งเดียว",
          "Rifampicin 600 mg PO q12h × 2 วัน",
          "Doxycycline 100 mg PO BID × 7 วัน",
          "Ceftriaxone 250 mg IM ครั้งเดียว",
          "ไม่ต้องให้ยา ให้สังเกตอาการ",
        ],
        a: 3,
        r: "Chemoprophylaxis สำหรับผู้สัมผัสใกล้ชิด N. meningitidis: rifampicin, ciprofloxacin หรือ ceftriaxone — หญิงตั้งครรภ์เลือก ceftriaxone 250 mg IM ครั้งเดียว",
        w: [
          "Fluoroquinolone หลีกเลี่ยงในหญิงตั้งครรภ์",
          "Rifampicin ไม่แนะนำในหญิงตั้งครรภ์",
          "Doxycycline ห้ามในการตั้งครรภ์และไม่ใช่ยามาตรฐาน",
          "ถูก",
          "ผู้สัมผัสใกล้ชิดมีความเสี่ยงสูง ต้องให้ยาป้องกันโดยเร็ว (ภายใน 24 ชม.)",
        ],
        k: "Meningococcal prophylaxis: cipro 500 mg ×1 / rifampicin 600 mg q12h ×2 วัน / ceftriaxone 250 mg IM ×1 (ตั้งครรภ์)",
      },
      {
        p: "สมมติว่า CSF culture ขึ้น Listeria monocytogenes แทน. การรักษาใดเหมาะสมที่สุด?",
        o: [
          "Ceftriaxone 2 g IV q12h เดี่ยว",
          "Vancomycin เดี่ยว ปรับตาม AUC",
          "Ampicillin 2 g IV q4h (± gentamicin) อย่างน้อย 21 วัน",
          "Cefepime 2 g IV q8h",
          "Ampicillin 2 g IV q4h 7 วัน",
        ],
        a: 2,
        r: "Listeria ดื้อต่อ cephalosporin ทุกตัวโดยธรรมชาติ (intrinsic) → ampicillin/penicillin G ± gentamicin (synergy) นาน ≥ 21 วัน; ถ้าแพ้ penicillin ใช้ co-trimoxazole",
        w: [
          "Cephalosporin ไม่ได้ผลต่อ Listeria",
          "ไม่ใช่การรักษามาตรฐาน",
          "ถูก",
          "Cephalosporin ไม่ได้ผลต่อ Listeria",
          "ระยะเวลาสั้นเกิน",
        ],
        k: "Listeria: ampicillin ± gentamicin ≥ 21 วัน; alternative co-trimoxazole; cephalosporin = intrinsic resistance",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–20, ข้อ 1–97) → Case 21–22, ข้อ 98–107
export const PC1_DAY05: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d05q",
  caseOffset: 20,
  qOffset: 97,
  createdAt: "2026-09-27 09:00:00",
});
