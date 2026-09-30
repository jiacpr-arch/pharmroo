import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 1 — ข้อใหม่ชุดที่ 1: หัวใจและหลอดเลือด (10) + โรคติดเชื้อ (10)
// แต่ละหมวด: ง่าย 4 · ปานกลาง 4 · ยาก 2; เคสต่อเนื่อง 6 ข้อ + ข้อเดี่ยว 4 ข้อ

export const MOCK1_DAY01: Record<string, Pc1MockItem[]> = {
  cardio: [
    {
      title: "HTN + T2DM + CKD with albuminuria",
      base:
        "ชายไทยอายุ 67 ปี เป็นเบาหวานชนิดที่ 2 และความดันโลหิตสูง. BP 158/92 mmHg (วัดซ้ำหลายครั้ง), eGFR 40 mL/min/1.73m², UACR 450 mg/g, K 4.8 mmol/L. " +
        "ยาปัจจุบัน: amlodipine 10 mg OD, metformin 500 mg BID. ไม่มีประวัติแพ้ยา",
      ref: "KDIGO 2024 Clinical Practice Guideline for CKD; KDIGO 2022 Guideline for Diabetes Management in CKD; 2017 ACC/AHA Hypertension Guideline",
      qs: [
        {
          d: "easy",
          p: "ยาที่ควรเพิ่มเป็นลำดับแรกเพื่อคุมความดันและชะลอการเสื่อมของไตคือข้อใด?",
          o: ["Losartan 50 mg OD", "Atenolol 50 mg OD", "Doxazosin 2 mg OD", "Hydralazine 25 mg TID", "Clonidine 0.1 mg BID"],
          a: 0,
          r: "ผู้ป่วยมี albuminuria (UACR ≥300 mg/g) ร่วมกับเบาหวานและความดันสูง → ACEI หรือ ARB เป็นยาหลักเพราะลดความดันใน glomerulus ลด proteinuria และชะลอการเสื่อมของไต ปรับขนาดจนถึงขนาดสูงสุดที่ทนได้",
          w: ["ถูก", "ไม่มีผลชะลอไต", "ไม่มีผลชะลอไต และเสี่ยง orthostatic hypotension", "ไม่มีผลชะลอไต ต้องให้วันละหลายครั้ง", "เสี่ยง rebound hypertension และไม่มีผลต่อไต"],
          k: "HTN + DM + albuminuria → ACEI/ARB titrate to max tolerated dose",
        },
        {
          d: "medium",
          p: "4 สัปดาห์หลังเริ่ม losartan ค่า SCr เพิ่มจาก 1.60 เป็น 1.85 mg/dL และ K 5.1 mmol/L ผู้ป่วยไม่มีอาการผิดปกติ ควรทำอย่างไร?",
          o: [
            "ใช้ losartan ต่อ และตรวจ SCr/K ซ้ำตามนัด",
            "หยุด losartan ทันทีเพราะเกิด AKI",
            "เปลี่ยนเป็น enalapril",
            "ให้ sodium polystyrene sulfonate ทุกวัน",
            "เพิ่ม spironolactone เพื่อลด proteinuria เพิ่ม",
          ],
          a: 0,
          r: "SCr เพิ่มขึ้น (1.85 − 1.60)/1.60 ≈ 16% ซึ่งน้อยกว่า 30% เป็นผลที่คาดได้จากการลดความดันใน glomerulus (hemodynamic effect) ไม่ใช่การบาดเจ็บของไต และ K ยังไม่ถึง 5.5 จึงใช้ยาต่อได้ ควรหยุดหรือลดขนาดเมื่อ SCr เพิ่ม >30% หรือ K สูงที่แก้ไม่ได้",
          c: ["% SCr rise = (1.85 − 1.60) / 1.60 × 100", "= 0.25 / 1.60 × 100 ≈ 16% (< 30%)"],
          w: ["ถูก", "SCr เพิ่มไม่ถึง 30% ไม่ใช่เหตุให้หยุดยา", "ACEI มีผลต่อ SCr และ K แบบเดียวกัน ไม่ได้แก้ปัญหา", "K 5.1 ไม่จำเป็นต้องใช้ยาจับโพแทสเซียม", "เพิ่มความเสี่ยง hyperkalemia ขณะที่ K เริ่มสูง"],
          k: "หลังเริ่ม ACEI/ARB: SCr เพิ่ม <30% และ K <5.5 → ใช้ยาต่อ; >30% → หาสาเหตุ/ลดหรือหยุดยา",
        },
        {
          d: "medium",
          p: "3 เดือนต่อมา ได้ losartan 100 mg OD ร่วมกับ amlodipine 10 mg OD แล้ว BP ยังคง 146/88 mmHg eGFR 38 K 4.9 ยาที่ควรเพิ่มต่อคือข้อใด?",
          o: ["Chlorthalidone 12.5 mg OD", "Enalapril 10 mg BID", "Atenolol 50 mg OD", "Spironolactone 25 mg OD", "Clonidine 0.1 mg BID"],
          a: 0,
          r: "ยาลำดับที่ 3 ตามแนวทางคือ thiazide-type/like diuretic (ใช้ได้ผลที่ eGFR ระดับนี้ และ chlorthalidone ยังได้ผลแม้ eGFR <30 จากการศึกษา CLICK) ช่วยลด K ที่เริ่มสูงจาก ARB ด้วย. Spironolactone เก็บไว้เป็นยาลำดับที่ 4 ใน resistant HTN และเสี่ยง hyperkalemia ใน CKD",
          w: ["ถูก", "Dual RAAS blockade เพิ่ม hyperkalemia และ AKI โดยไม่ได้ประโยชน์", "Beta-blocker ไม่ใช่ยาหลักถ้าไม่มีข้อบ่งชี้เฉพาะ", "ใช้เมื่อได้ 3 ยารวม diuretic แล้วยังไม่คุม และ K 4.9 เสี่ยงสูงขึ้นอีก", "เป็นยาทางเลือกท้ายๆ เสี่ยง rebound hypertension"],
          k: "ACEI/ARB + CCB ยังไม่คุม → เพิ่ม thiazide-like diuretic; spironolactone = ลำดับ 4 (resistant HTN)",
        },
        {
          d: "hard",
          p: "ต่อมาได้เพิ่ม SGLT2 inhibitor แล้ว BP คุมได้ แต่ UACR ยังคง 380 mg/g, eGFR 36, K 4.6 mmol/L ยาข้อใดควรเพิ่มเพื่อลดความเสี่ยงการเสื่อมของไตและ CV events?",
          o: [
            "Finerenone 10 mg OD และตรวจ K ที่ 4 สัปดาห์",
            "Spironolactone 50 mg OD",
            "Aliskiren 150 mg OD",
            "Enalapril 5 mg BID ร่วมกับ losartan",
            "Amiloride 5 mg OD",
          ],
          a: 0,
          r: "KDIGO 2022 แนะนำ nonsteroidal MRA (finerenone) ใน T2DM ที่มี eGFR ≥25, K ปกติ และ albuminuria ≥30 mg/g แม้ได้ ACEI/ARB ขนาดสูงสุดแล้ว (FIDELIO-DKD/FIGARO-DKD ลด kidney และ CV outcomes). เริ่ม 10 mg เมื่อ eGFR 25–<60 (20 mg เมื่อ ≥60) เริ่มได้เมื่อ K ≤5.0 และตรวจ K ซ้ำที่ 4 สัปดาห์",
          w: [
            "ถูก",
            "ไม่มีข้อมูลลด kidney outcomes และเสี่ยง hyperkalemia/gynecomastia มากกว่า",
            "ใช้ร่วม ARB ใน T2DM เพิ่ม hyperkalemia, hypotension และ AKI (ALTITUDE)",
            "Dual RAAS blockade เพิ่ม AKI และ hyperkalemia (VA NEPHRON-D)",
            "ไม่มีหลักฐานชะลอไต และเพิ่ม K",
          ],
          k: "T2DM + CKD + albuminuria ค้างแม้ได้ RASi + SGLT2i → finerenone (eGFR ≥25, K ≤5.0)",
        },
      ],
    },
    {
      title: "AF on apixaban",
      base:
        "หญิงไทยอายุ 82 ปี น้ำหนัก 58 kg เป็น non-valvular AF, HTN และเคยเป็น stroke. SCr 1.1 mg/dL. แพทย์จะเริ่ม apixaban. ผู้ป่วยมีข้อเข่าเสื่อมและปวดเข่าเป็นประจำ",
      ref: "2023 ACC/AHA/ACCP/HRS Guideline for Atrial Fibrillation; Apixaban prescribing information",
      qs: [
        {
          d: "medium",
          p: "ขนาด apixaban ที่เหมาะสมสำหรับผู้ป่วยรายนี้คือข้อใด?",
          o: ["2.5 mg OD", "2.5 mg BID", "5 mg OD", "5 mg BID", "10 mg BID"],
          a: 1,
          r: "Apixaban ใน AF ลดขนาดเป็น 2.5 mg BID เมื่อมีอย่างน้อย 2 ใน 3 ข้อ: อายุ ≥80 ปี, น้ำหนัก ≤60 kg, SCr ≥1.5 mg/dL. ผู้ป่วยมี 2 ข้อ (อายุ 82 และน้ำหนัก 58 kg) จึงใช้ 2.5 mg BID",
          c: ["อายุ ≥80 ปี → ใช่ (82)", "น้ำหนัก ≤60 kg → ใช่ (58)", "SCr ≥1.5 mg/dL → ไม่ใช่ (1.1)", "ครบ 2 ใน 3 → 2.5 mg BID"],
          w: ["Apixaban ต้องให้วันละ 2 ครั้ง", "ถูก", "ต้องให้วันละ 2 ครั้ง", "ขนาดปกติ ใช้เมื่อมีเกณฑ์ไม่ถึง 2 ข้อ", "เป็นขนาดช่วงแรกของการรักษา VTE ไม่ใช่ AF"],
          k: "Apixaban AF: 2.5 mg BID เมื่อ ≥2 ใน 3 ข้อ (อายุ ≥80, น้ำหนัก ≤60 kg, SCr ≥1.5)",
        },
        {
          d: "easy",
          p: "ผู้ป่วยถามหายาแก้ปวดเข่าระหว่างใช้ apixaban คำแนะนำใดเหมาะสมที่สุด?",
          o: [
            "Paracetamol ร่วมกับ NSAID ชนิดทาเฉพาะที่",
            "Ibuprofen 400 mg TID ต่อเนื่อง",
            "Naproxen 500 mg BID ต่อเนื่อง",
            "Aspirin 325 mg วันละครั้ง",
            "Diclofenac 50 mg TID ต่อเนื่อง",
          ],
          a: 0,
          r: "NSAID ชนิดรับประทานเพิ่มความเสี่ยงเลือดออก (ยับยั้งเกล็ดเลือด + ระคายกระเพาะ) เมื่อใช้ร่วม anticoagulant และยังกระทบไตในผู้สูงอายุ. Paracetamol และ topical NSAID ปลอดภัยกว่าสำหรับข้อเข่าเสื่อม",
          w: ["ถูก", "เพิ่มความเสี่ยงเลือดออกเมื่อใช้ร่วม apixaban", "เพิ่มความเสี่ยงเลือดออกเมื่อใช้ร่วม apixaban", "เพิ่มความเสี่ยงเลือดออก และไม่ใช่ยาแก้ปวดข้อที่เหมาะ", "เพิ่มความเสี่ยงเลือดออกและ CV events"],
          k: "ผู้ใช้ anticoagulant: ปวดข้อ → paracetamol ± topical NSAID; หลีกเลี่ยง oral NSAID",
        },
      ],
    },
    {
      ref: "2021 AHA/ACC Chest Pain Guideline; Sildenafil prescribing information",
      qs: [
        {
          d: "easy",
          p: "ชายอายุ 60 ปี มี stable angina ใช้ isosorbide mononitrate 60 mg OD มาขอซื้อ sildenafil 50 mg เภสัชกรควรตอบอย่างไร?",
          o: [
            "ห้ามใช้ร่วมกันเพราะเสี่ยงความดันโลหิตต่ำรุนแรง",
            "ใช้ได้ถ้าทาน sildenafil ห่างจาก nitrate 2 ชั่วโมง",
            "ใช้ได้ถ้าลด sildenafil เหลือ 25 mg",
            "ใช้ได้ถ้าทานพร้อมอาหาร",
            "ใช้ได้เพราะ nitrate ชนิดออกฤทธิ์ยาวไม่มีปฏิกิริยา",
          ],
          a: 0,
          r: "Nitrate เพิ่ม cGMP ผ่าน nitric oxide ส่วน PDE5 inhibitor ยับยั้งการทำลาย cGMP → หลอดเลือดขยายมากเกินจนความดันต่ำรุนแรง ห้ามใช้ร่วมกันในทุกรูปแบบของ nitrate (ห้ามใช้ nitrate ภายใน 24 ชั่วโมงหลัง sildenafil หรือ 48 ชั่วโมงหลัง tadalafil)",
          w: ["ถูก", "การเว้นช่วงไม่ทำให้ใช้ร่วมได้ขณะใช้ nitrate ประจำ", "ยังเสี่ยงความดันต่ำรุนแรง", "อาหารไม่เปลี่ยนปฏิกิริยา", "Nitrate ทุกชนิดมีปฏิกิริยา"],
          k: "Nitrate + PDE5 inhibitor = contraindicated (severe hypotension)",
        },
      ],
    },
    {
      ref: "2022 ACC Expert Consensus on Heart Failure Management; Digoxin prescribing information",
      qs: [
        {
          d: "medium",
          p: "หญิงอายุ 78 ปี HFrEF + AF ใช้ digoxin 0.25 mg OD และ furosemide 80 mg/day มาด้วยคลื่นไส้ เบื่ออาหาร เห็นภาพสีเหลือง. digoxin level 2.4 ng/mL, K 2.9 mmol/L, SCr ปกติ. ปัจจัยใดส่งเสริมการเกิดพิษมากที่สุด?",
          o: [
            "Hypokalemia จาก furosemide",
            "Hypermagnesemia",
            "Hyperthyroidism",
            "การได้ rifampicin ร่วม",
            "น้ำหนักตัวที่เพิ่มขึ้น",
          ],
          a: 0,
          r: "Digoxin และ K แข่งกันจับ Na⁺/K⁺-ATPase — เมื่อ K ต่ำ digoxin จับได้มากขึ้นจึงเกิดพิษได้ง่าย (ปัจจัยเสริมอื่น: Mg ต่ำ, Ca สูง, ไตเสื่อม, hypothyroidism, ยาเช่น amiodarone/verapamil). จัดการ: หยุด digoxin แก้ K/Mg พิจารณา digoxin-specific antibody fragments หากมี arrhythmia รุนแรง",
          w: ["ถูก", "Magnesium ต่ำ (ไม่ใช่สูง) ที่เพิ่มความไวต่อพิษ", "Hyperthyroidism ทำให้ต้องใช้ขนาดสูงขึ้น (ระดับยาลดลง)", "Rifampicin (P-gp inducer) ลดระดับ digoxin", "ไม่ใช่ปัจจัยเสริมพิษ"],
          k: "Digoxin toxicity ↑ เมื่อ K↓ Mg↓ Ca↑ ไตเสื่อม hypothyroid, amiodarone/verapamil",
        },
      ],
    },
    {
      ref: "2018 AHA/ACC Guideline on the Management of Blood Cholesterol",
      qs: [
        {
          d: "easy",
          p: "ข้อใดเป็น high-intensity statin (ลด LDL-C ได้ ≥50%)?",
          o: ["Rosuvastatin 20 mg OD", "Simvastatin 40 mg OD", "Pravastatin 40 mg OD", "Atorvastatin 10 mg OD", "Lovastatin 40 mg OD"],
          a: 0,
          r: "High-intensity statin ได้แก่ atorvastatin 40–80 mg และ rosuvastatin 20–40 mg. ตัวเลือกอื่นเป็น moderate-intensity (ลด LDL-C 30–49%)",
          w: ["ถูก", "Moderate-intensity", "Moderate-intensity", "Moderate-intensity (high = 40–80 mg)", "Moderate-intensity"],
          k: "High-intensity statin = atorvastatin 40–80 mg, rosuvastatin 20–40 mg",
        },
      ],
    },
    {
      ref: "2023 ACC/AHA/ACCP/HRS Guideline for Atrial Fibrillation; Amiodarone and warfarin prescribing information",
      qs: [
        {
          d: "hard",
          p: "ชายอายุ 70 ปี ใช้ warfarin 5 mg/day INR คงที่ 2.5 มานาน แพทย์จะเริ่ม amiodarone เพื่อคุมจังหวะ AF การจัดการ warfarin ข้อใดเหมาะสมที่สุด?",
          o: [
            "ลดขนาด warfarin ประมาณ 30–50% และตรวจ INR ทุกสัปดาห์ในช่วงแรก",
            "ใช้ขนาดเดิมและตรวจ INR ตามนัดปกติทุก 3 เดือน",
            "เพิ่มขนาด warfarin 25% เพราะ amiodarone เร่ง metabolism",
            "หยุด warfarin ระหว่างเริ่ม amiodarone 1 สัปดาห์",
            "ลดขนาด warfarin เฉพาะเมื่อมีเลือดออกเท่านั้น",
          ],
          a: 0,
          r: "Amiodarone ยับยั้ง CYP2C9 (และ 1A2, 3A4) ทำให้ S-warfarin สูงขึ้น INR เพิ่มขึ้นมาก ผลเริ่มใน 1–3 สัปดาห์และคงอยู่นานหลายเดือนหลังหยุด amiodarone (ครึ่งชีวิตยาวมาก) จึงลดขนาด warfarin ล่วงหน้า 30–50% และตรวจ INR ถี่จนคงที่",
          w: [
            "ถูก",
            "เสี่ยง INR สูงและเลือดออก",
            "Amiodarone ยับยั้ง (ไม่ใช่เร่ง) metabolism ของ warfarin",
            "เสี่ยง stroke โดยไม่จำเป็น",
            "ควรป้องกันล่วงหน้า ไม่ใช่รอให้มีเลือดออก",
          ],
          k: "Amiodarone + warfarin → ลด warfarin 30–50%, ตรวจ INR ทุกสัปดาห์; ผลอยู่นานหลายเดือน",
        },
      ],
    },
  ],
  infection: [
    {
      title: "Ventilator-associated pneumonia",
      base:
        "ชายไทยอายุ 68 ปี น้ำหนัก 70 kg อยู่ ICU และใส่ท่อช่วยหายใจมา 6 วัน มีไข้ เสมหะเป็นหนองเพิ่มขึ้น CXR พบ infiltrate ใหม่. SCr 1.1 mg/dL (CrCl ~65 mL/min). " +
        "ไม่ได้รับยาต้านจุลชีพทางหลอดเลือดดำใน 90 วันที่ผ่านมา อัตรา MRSA ในหอผู้ป่วย <10% ไม่มี septic shock",
      ref: "IDSA/ATS 2016 Guideline for HAP/VAP; Cefepime prescribing information",
      qs: [
        {
          d: "easy",
          p: "ยา empirical ที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Piperacillin/tazobactam 4.5 g IV q6h",
            "Ceftriaxone 2 g IV OD",
            "Ampicillin/sulbactam 3 g IV q6h",
            "Cefazolin 2 g IV q8h",
            "Azithromycin 500 mg IV OD",
          ],
          a: 0,
          r: "VAP ต้องครอบคลุม Pseudomonas aeruginosa และ gram-negative อื่น ผู้ป่วยไม่มีปัจจัยเสี่ยงเชื้อดื้อยาหลายขนานและ MRSA ในหอ <10% จึงใช้ antipseudomonal β-lactam ตัวเดียวได้ เช่น piperacillin/tazobactam, cefepime หรือ meropenem",
          w: ["ถูก", "ไม่ครอบคลุม Pseudomonas", "ไม่ครอบคลุม Pseudomonas", "ครอบคลุมเฉพาะ gram-positive/MSSA และ gram-negative บางชนิด", "ไม่ครอบคลุมเชื้อก่อโรคหลักของ VAP"],
          k: "VAP empirical: antipseudomonal β-lactam ± MRSA coverage ตามปัจจัยเสี่ยงและ local MRSA rate",
        },
        {
          d: "medium",
          p: "แพทย์ให้ piperacillin/tazobactam แบบ extended infusion (หยดนาน 4 ชั่วโมง) เหตุผลทาง PK/PD คือข้อใด?",
          o: [
            "β-lactam ออกฤทธิ์แบบ time-dependent ต้องการเพิ่ม %fT>MIC",
            "β-lactam ออกฤทธิ์แบบ concentration-dependent ต้องการ Cmax/MIC สูง",
            "ลดการเกิด nephrotoxicity จากระดับยาสูงสุด",
            "เพิ่ม post-antibiotic effect ต่อ gram-negative",
            "ต้องการ AUC/MIC ≥400",
          ],
          a: 0,
          r: "β-lactam ฆ่าเชื้อแบบ time-dependent ประสิทธิภาพขึ้นกับสัดส่วนเวลาที่ระดับยาอิสระสูงกว่า MIC (%fT>MIC) การหยดยานานขึ้นทำให้ระดับยาอยู่เหนือ MIC นานขึ้น เป็นประโยชน์กับเชื้อที่ MIC สูงอย่าง Pseudomonas",
          w: ["ถูก", "เป็นลักษณะของ aminoglycoside/fluoroquinolone", "ไม่ใช่เหตุผลหลักทาง PK/PD", "β-lactam มี PAE ต่อ gram-negative น้อย", "เป็นเป้าหมายของ vancomycin"],
          k: "β-lactam = time-dependent → %fT>MIC → extended/continuous infusion",
        },
        {
          d: "medium",
          p: "ผลเพาะเชื้อพบ P. aeruginosa ไวต่อ cefepime และ piperacillin/tazobactam ผู้ป่วยตอบสนองดี ระยะเวลาการรักษาที่เหมาะสมคือข้อใด?",
          o: ["7 วัน", "3 วัน", "14 วัน", "21 วัน", "จนกว่าจะถอดท่อช่วยหายใจ"],
          a: 0,
          r: "IDSA/ATS 2016 แนะนำรักษา HAP/VAP นาน 7 วันเมื่อตอบสนองดี (รวม non-fermenter อย่าง Pseudomonas) เพราะผลลัพธ์ไม่ต่างจากการรักษานานกว่า แต่ลดการดื้อยาและ ADR",
          w: ["ถูก", "สั้นเกินไปสำหรับ VAP", "นานเกินจำเป็น เพิ่มเชื้อดื้อยา", "นานเกินจำเป็นมาก", "ไม่ใช่เกณฑ์กำหนดระยะเวลา"],
          k: "HAP/VAP ที่ตอบสนองดี → 7 วัน",
        },
        {
          d: "hard",
          p: "ผู้ป่วยได้ cefepime 2 g IV q8h วันที่ 5 เกิด AKI (SCr 2.9 mg/dL, CrCl ~25 mL/min) และมีอาการสับสน กระตุก (myoclonus) โดยไม่มีสาเหตุอื่นชัดเจน ควรทำอย่างไร?",
          o: [
            "สงสัย cefepime neurotoxicity จากยาสะสม ลดขนาดเป็น 2 g q24h ตาม CrCl หรือเปลี่ยนยา",
            "ให้ haloperidol คุมอาการสับสนและใช้ cefepime ขนาดเดิม",
            "เปลี่ยนเป็น imipenem/cilastatin ขนาดเดิมโดยไม่ปรับตามไต",
            "เพิ่ม levetiracetam และให้ cefepime ขนาดเดิมต่อ",
            "หยุดยาต้านจุลชีพทั้งหมดทันที",
          ],
          a: 0,
          r: "Cefepime ขับทางไต เมื่อไตเสื่อมโดยไม่ปรับขนาด ยาสะสมและผ่าน BBB ได้ ยับยั้ง GABA-A ทำให้สับสน myoclonus ชัก (non-convulsive status). แก้โดยปรับขนาดตาม CrCl (CrCl 11–29: 2 g q24h สำหรับสูตร 2 g q8h) หรือเปลี่ยนยา อาการมักดีขึ้นใน 2–3 วัน รายรุนแรงอาจต้องฟอกเลือด",
          w: [
            "ถูก",
            "ไม่แก้ที่สาเหตุ ยายังสะสมต่อ",
            "Imipenem ก็เสี่ยงชักในไตเสื่อมถ้าไม่ปรับขนาด",
            "ไม่แก้ที่สาเหตุ ยายังสะสมต่อ",
            "การติดเชื้อยังต้องรักษาให้ครบ",
          ],
          k: "Cefepime + ไตเสื่อมไม่ปรับขนาด → neurotoxicity (สับสน, myoclonus, NCSE); ปรับขนาดตาม CrCl",
        },
      ],
    },
    {
      title: "Early syphilis",
      base:
        "ชายไทยอายุ 26 ปี มีแผลริมแข็งไม่เจ็บที่อวัยวะเพศมา 1 สัปดาห์ ผล VDRL 1:32 และ TPHA บวก ผล anti-HIV ลบ ไม่มีประวัติแพ้ยา",
      ref: "CDC Sexually Transmitted Infections Treatment Guidelines 2021",
      qs: [
        {
          d: "easy",
          p: "การรักษาที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Benzathine penicillin G 2.4 ล้านยูนิต IM ครั้งเดียว",
            "Benzathine penicillin G 2.4 ล้านยูนิต IM สัปดาห์ละครั้ง 3 สัปดาห์",
            "Amoxicillin 500 mg PO TID 7 วัน",
            "Ceftriaxone 250 mg IM ครั้งเดียว",
            "Azithromycin 1 g PO ครั้งเดียว",
          ],
          a: 0,
          r: "Primary, secondary และ early latent syphilis รักษาด้วย benzathine penicillin G 2.4 MU IM ครั้งเดียว ส่วน late latent หรือไม่ทราบระยะใช้สัปดาห์ละครั้ง 3 ครั้ง",
          w: ["ถูก", "เป็นสูตรของ late latent หรือไม่ทราบระยะ", "ไม่ใช่สูตรมาตรฐาน", "เป็นสูตรเก่าของ gonorrhea ไม่ใช่ syphilis", "มี T. pallidum ดื้อ macrolide ไม่แนะนำ"],
          k: "Early syphilis → benzathine penicillin G 2.4 MU IM × 1; late latent → weekly × 3",
        },
        {
          d: "medium",
          p: "6 ชั่วโมงหลังฉีดยา ผู้ป่วยมีไข้ 38.5 °C หนาวสั่น ปวดเมื่อยกล้ามเนื้อ ปวดศีรษะ ไม่มีผื่นลมพิษ ไม่มีหายใจลำบาก ข้อใดถูกต้องที่สุด?",
          o: [
            "เป็น Jarisch–Herxheimer reaction ให้ยาลดไข้และติดตามอาการ ไม่ใช่การแพ้ยา",
            "เป็น anaphylaxis ต้องให้ epinephrine IM",
            "เป็นการแพ้ penicillin บันทึกว่าแพ้ยาและห้ามใช้อีก",
            "เป็นการรักษาล้มเหลว ต้องฉีดซ้ำทันที",
            "เป็น serum sickness ต้องให้ prednisolone 1 mg/kg",
          ],
          a: 0,
          r: "Jarisch–Herxheimer reaction เกิดภายใน 24 ชั่วโมงหลังรักษา spirochete จากการปล่อย endotoxin-like substances เมื่อเชื้อตาย มีไข้ หนาวสั่น ปวดเมื่อย หายเองใน 24 ชั่วโมง รักษาตามอาการ ไม่ใช่การแพ้ยาและไม่ต้องหยุดยา",
          w: ["ถูก", "ไม่มีลักษณะของ anaphylaxis (ลมพิษ หายใจลำบาก ความดันต่ำ)", "ไม่ใช่การแพ้ยา การบันทึกผิดทำให้เสียโอกาสใช้ penicillin", "ไม่ใช่การรักษาล้มเหลว ประเมินจาก titer ที่ 6–12 เดือน", "Serum sickness เกิดหลัง 1–3 สัปดาห์"],
          k: "Jarisch–Herxheimer: ไข้/หนาวสั่น <24 ชม. หลังรักษา syphilis → รักษาตามอาการ ไม่ใช่แพ้ยา",
        },
      ],
    },
    {
      ref: "IDSA 2010 Guideline for Acute Uncomplicated Cystitis and Pyelonephritis in Women",
      qs: [
        {
          d: "easy",
          p: "หญิงอายุ 28 ปี ไม่ตั้งครรภ์ ปัสสาวะแสบขัด ถ่ายบ่อย ไม่มีไข้ ไม่ปวดหลัง ไตปกติ ยาที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Nitrofurantoin monohydrate/macrocrystals 100 mg BID 5 วัน",
            "Ciprofloxacin 500 mg BID 7 วัน",
            "Amoxicillin 500 mg TID 7 วัน",
            "Ceftriaxone 1 g IV OD 3 วัน",
            "Azithromycin 500 mg OD 3 วัน",
          ],
          a: 0,
          r: "Acute uncomplicated cystitis ใช้ยาขั้นแรก: nitrofurantoin 5 วัน, fosfomycin 3 g ครั้งเดียว หรือ TMP-SMX 3 วัน (ถ้าเชื้อดื้อ <20%). Fluoroquinolone สงวนไว้สำหรับกรณีจำเป็นเพราะ ADR และการดื้อยา",
          w: ["ถูก", "สงวนไว้ ไม่ใช่ขั้นแรกสำหรับ cystitis", "E. coli ดื้อสูง", "ไม่จำเป็นต้องฉีดยาใน cystitis ไม่ซับซ้อน", "ไม่ครอบคลุมเชื้อก่อโรคทางเดินปัสสาวะ"],
          k: "Uncomplicated cystitis → nitrofurantoin 5 วัน / fosfomycin ครั้งเดียว / TMP-SMX 3 วัน",
        },
      ],
    },
    {
      ref: "Ciprofloxacin prescribing information",
      qs: [
        {
          d: "medium",
          p: "ผู้ป่วยได้ ciprofloxacin 500 mg BID และทาน calcium carbonate เป็นประจำ คำแนะนำใดถูกต้องที่สุด?",
          o: [
            "ทาน ciprofloxacin อย่างน้อย 2 ชั่วโมงก่อน หรือ 6 ชั่วโมงหลัง calcium",
            "ทานพร้อมกันเพื่อลดการระคายเคืองกระเพาะ",
            "ทาน calcium ก่อน ciprofloxacin 30 นาที",
            "ไม่มีปฏิกิริยา ทานเวลาใดก็ได้",
            "ดื่มนมพร้อม ciprofloxacin เพื่อเพิ่มการดูดซึม",
          ],
          a: 0,
          r: "Fluoroquinolone จับกับ cation ที่มีประจุบวก 2–3 (Ca, Mg, Al, Fe, Zn) เกิด chelation ทำให้ดูดซึมลดลงมาก จึงควรทาน ciprofloxacin ก่อน 2 ชั่วโมงหรือหลัง 6 ชั่วโมงจากยา/อาหารที่มี cation เหล่านี้",
          w: ["ถูก", "ทำให้ดูดซึมลดลงมาก", "ยังเกิด chelation", "มีปฏิกิริยาชัดเจน", "นมมี calcium ลดการดูดซึม"],
          k: "Fluoroquinolone/tetracycline + Ca/Mg/Al/Fe/Zn → chelation; แยกเวลาทาน",
        },
      ],
    },
    {
      ref: "ATS/IDSA 2019 Guideline for Community-acquired Pneumonia in Adults",
      qs: [
        {
          d: "easy",
          p: "ชายอายุ 35 ปี สุขภาพแข็งแรง ไม่มีโรคประจำตัว ไม่ได้ใช้ยาต้านจุลชีพใน 3 เดือน วินิจฉัย CAP รักษาแบบผู้ป่วยนอก ยาที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Amoxicillin 1 g PO TID",
            "Levofloxacin 750 mg PO OD",
            "Ceftriaxone 1 g IV OD ร่วมกับ azithromycin",
            "Vancomycin 1 g IV q12h",
            "Amoxicillin/clavulanate ร่วมกับ azithromycin",
          ],
          a: 0,
          r: "ATS/IDSA 2019: ผู้ป่วยนอกที่ไม่มีโรคร่วมและไม่มีปัจจัยเสี่ยงเชื้อดื้อ ใช้ amoxicillin 1 g TID (ทางเลือก: doxycycline หรือ macrolide ถ้าดื้อ <25%). Respiratory fluoroquinolone และสูตรผสมเก็บไว้สำหรับผู้มีโรคร่วม",
          w: ["ถูก", "สงวนไว้สำหรับผู้มีโรคร่วม", "เป็นสูตรผู้ป่วยใน", "ไม่ครอบคลุมเชื้อหลักและไม่จำเป็น", "เป็นสูตรสำหรับผู้มีโรคร่วม"],
          k: "Outpatient CAP ไม่มีโรคร่วม → amoxicillin 1 g TID (หรือ doxycycline)",
        },
      ],
    },
    {
      ref: "IDSA 2011 MRSA Guideline; ESCMID/IDSA reviews on VRE bacteremia; Linezolid prescribing information",
      qs: [
        {
          d: "hard",
          p: "หญิงอายุ 64 ปี ใช้ escitalopram 20 mg/day รักษาภาวะซึมเศร้า เกิด bacteremia จาก Enterococcus faecium ที่ดื้อ vancomycin และ ampicillin ยาที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Daptomycin 10 mg/kg IV OD และติดตาม CK",
            "Linezolid 600 mg IV q12h ร่วมกับ escitalopram ขนาดเดิม",
            "Vancomycin 15 mg/kg IV q12h",
            "Ampicillin 2 g IV q4h",
            "Nitrofurantoin 100 mg PO BID",
          ],
          a: 0,
          r: "VRE bacteremia ใช้ daptomycin ขนาดสูง (8–12 mg/kg) หรือ linezolid. แต่ linezolid เป็น MAO inhibitor อ่อนๆ เมื่อใช้ร่วม SSRI เสี่ยง serotonin syndrome จึงควรเลือก daptomycin ติดตาม CK ทุกสัปดาห์ (myopathy) และพิจารณาหยุด statin ชั่วคราว",
          w: ["ถูก", "เสี่ยง serotonin syndrome เมื่อใช้ร่วม SSRI", "เชื้อดื้อ vancomycin", "เชื้อดื้อ ampicillin", "ระดับยาในเลือดต่ำมาก ใช้ได้เฉพาะ cystitis"],
          k: "VRE bacteremia → high-dose daptomycin (ติดตาม CK); linezolid + SSRI → serotonin syndrome",
        },
      ],
    },
  ],
};
