import type { McqQuestion } from "@/lib/types-mcq";

// PC1 Scenario Set 001 — ข้อสอบแนว "สถานการณ์" (1 เคส หลายข้อ) ระดับปี 6
// โครงเดียวกับข้อสอบจริง: คำนวณ (CrCl/PK/dose) → กลไก/สาเหตุ → การจัดการ → ยาทางเลือก
// o = ตัวเลือก 5 ข้อตามลำดับ A–E, a = index คำตอบ, w = เหตุผลรายตัวเลือก, c = ขั้นตอนคำนวณ (ถ้ามี)

type Q = { p: string; o: string[]; a: number; r: string; w: string[]; c?: string[]; k: string };
type Case = { title: string; base: string; ref: string; qs: Q[] };

const CASES: Case[] = [
  {
    title: "Warfarin + co-trimoxazole + digoxin ในผู้สูงอายุ",
    base:
      "หญิงไทยอายุ 78 ปี น้ำหนัก 52 kg สูง 160 cm มี AF, HTN, T2DM ยาเดิม warfarin 3 mg/day (INR คงที่ 2.2–2.6), digoxin 0.25 mg OD, amlodipine 5 mg OD, metformin 1,000 mg BID. " +
      "7 วันก่อนได้รับ co-trimoxazole (800/160 mg) 1×2 pc สำหรับ UTI. วันนี้มาด้วยถ่ายดำ อ่อนเพลีย คลื่นไส้ เห็นภาพเป็นสีเหลือง. " +
      "Vital signs: BP 98/60, HR 46 irregular. Lab: INR 6.8, Hb 8.4 g/dL (เดิม 11.5), SCr 1.6 mg/dL, K⁺ 5.9 mEq/L, digoxin level 2.8 ng/mL",
    ref: "CHEST Guideline Antithrombotic Therapy; 2023 ACC/AHA/ACCP/HRS AF Guideline; Digoxin immune Fab & apixaban prescribing information",
    qs: [
      {
        p: "CrCl ของผู้ป่วยรายนี้ (Cockcroft–Gault, ใช้น้ำหนักจริง) มีค่าใกล้เคียงข้อใดที่สุด?",
        o: ["16 mL/min", "20 mL/min", "24 mL/min", "28 mL/min", "34 mL/min"],
        a: 2,
        r: "CrCl = (140 − 78) × 52 / (72 × 1.6) × 0.85 ≈ 24 mL/min. น้ำหนักจริง 52 kg ใกล้ IBW (≈52.4 kg) จึงใช้น้ำหนักจริงได้",
        c: [
          "IBW (หญิง) = 45.5 + 2.3 × (160/2.54 − 60) = 45.5 + 2.3 × 2.99 ≈ 52.4 kg → ใช้น้ำหนักจริง 52 kg",
          "(140 − 78) × 52 = 62 × 52 = 3,224",
          "72 × SCr = 72 × 1.6 = 115.2",
          "3,224 / 115.2 = 28.0 mL/min",
          "เพศหญิง × 0.85 → 28.0 × 0.85 ≈ 23.8 ≈ 24 mL/min",
        ],
        w: [
          "ต่ำเกินไป — มักเกิดจากคูณ 0.85 ซ้ำหรือใช้ SCr ผิด",
          "ต่ำกว่าค่าจริง อาจเกิดจากใช้ 140 − อายุ ผิดหรือปัดเศษมากไป",
          "ถูก: 28.0 × 0.85 ≈ 24 mL/min",
          "เป็นค่าก่อนคูณ 0.85 (ลืม correction ของเพศหญิง)",
          "สูงเกินไป — ไม่สอดคล้องกับ SCr 1.6 ในหญิงอายุ 78 ปี",
        ],
        k: "Cockcroft–Gault: อย่าลืม × 0.85 ในเพศหญิง และเลือกน้ำหนัก (TBW/IBW/AdjBW) ให้เหมาะก่อนคำนวณ",
      },
      {
        p: "กลไกหลักที่ทำให้ INR ของผู้ป่วยสูงขึ้นเป็น 6.8 คือข้อใด?",
        o: [
          "Trimethoprim เหนี่ยวนำ CYP3A4 ทำให้ R-warfarin ถูกเปลี่ยนเป็น active metabolite",
          "Sulfamethoxazole ไล่ที่ warfarin ออกจาก albumin เป็นกลไกหลักและคงอยู่ถาวร",
          "Sulfamethoxazole ยับยั้ง CYP2C9 ทำให้ลดการกำจัด S-warfarin",
          "Co-trimoxazole เพิ่มการดูดซึม vitamin K จากลำไส้",
          "Digoxin ยับยั้ง P-gp ทำให้ warfarin ถูกดูดซึมมากขึ้น",
        ],
        a: 2,
        r: "S-warfarin (potency สูงกว่า R ราว 3–5 เท่า) ถูกกำจัดผ่าน CYP2C9 เป็นหลัก — sulfamethoxazole เป็น CYP2C9 inhibitor ที่แรง จึงเพิ่ม INR ได้มากภายใน 3–7 วัน",
        w: [
          "การเหนี่ยวนำเอนไซม์จะทำให้ INR ลดลง และ warfarin ไม่มี active metabolite",
          "Protein-binding displacement มีผลเพียงชั่วคราว เพราะ free drug ที่เพิ่มจะถูกกำจัดเร็วขึ้น — ไม่ใช่กลไกหลัก",
          "ถูก: SMX ยับยั้ง CYP2C9 → S-warfarin สะสม → INR สูง",
          "ยาปฏิชีวนะอาจลดการสร้าง vitamin K ของแบคทีเรียในลำไส้ (ทำให้ INR สูง) ไม่ใช่เพิ่มการดูดซึม",
          "Warfarin ไม่ใช่ P-gp substrate ที่มีนัยสำคัญ; digoxin เป็น substrate ไม่ใช่ inhibitor",
        ],
        k: "Warfarin + SMX/TMP, metronidazole, fluconazole, amiodarone = CYP2C9 inhibition → ลดขนาด warfarin หรือเลี่ยงคู่ยา",
      },
      {
        p: "การจัดการภาวะ INR สูงร่วมกับเลือดออกของผู้ป่วยข้อใดเหมาะสมที่สุด?",
        o: [
          "งด warfarin 1–2 มื้อ แล้วตรวจ INR ซ้ำพรุ่งนี้",
          "งด warfarin และให้ vitamin K1 1–2.5 mg รับประทาน",
          "งด warfarin ให้ protamine sulfate 50 mg IV",
          "งด warfarin ให้ vitamin K1 10 mg IV slow infusion ร่วมกับ 4-factor PCC",
          "งด warfarin ให้ vitamin K1 10 mg SC",
        ],
        a: 3,
        r: "ผู้ป่วยมี major bleeding (melena, Hb ลด > 2 g/dL, BP ต่ำ) จึงต้อง reverse ทันทีด้วย 4F-PCC (หรือ FFP ถ้าไม่มี) ร่วมกับ vitamin K1 5–10 mg IV ช้า ๆ เพื่อให้ผลต่อเนื่อง",
        w: [
          "ใช้ได้เฉพาะ INR สูงโดยไม่มีเลือดออก ไม่เหมาะกับ major bleeding",
          "Oral vitamin K ขนาดต่ำใช้กับ INR > 10 ที่ไม่มีเลือดออก ออกฤทธิ์ช้าเกินไป",
          "Protamine ใช้ reverse heparin ไม่ใช่ warfarin",
          "ถูก: PCC ให้ clotting factor ทันที + IV vitamin K ป้องกัน INR rebound",
          "SC ดูดซึมไม่แน่นอน ไม่แนะนำ",
        ],
        k: "Major bleeding จาก warfarin: หยุดยา + 4F-PCC + vitamin K 5–10 mg IV slow",
      },
      {
        p: "ค่า K⁺ 5.9 mEq/L ที่สัมพันธ์กับยาที่ผู้ป่วยเพิ่งได้รับใหม่ เกิดจากกลไกใด?",
        o: [
          "Trimethoprim ปิดกั้น epithelial Na⁺ channel (ENaC) ที่ collecting duct คล้าย amiloride",
          "Sulfamethoxazole ยับยั้งการสร้าง aldosterone ที่ adrenal cortex",
          "Trimethoprim ยับยั้ง ACE ทำให้ angiotensin II ลดลง",
          "Co-trimoxazole ทำให้เกิด rhabdomyolysis และปล่อย K⁺ ออกจากเซลล์",
          "Sulfamethoxazole กระตุ้น Na⁺/K⁺-ATPase ให้ดึง K⁺ ออกนอกเซลล์",
        ],
        a: 0,
        r: "Trimethoprim มีโครงสร้างคล้าย amiloride → block ENaC ที่ principal cell ลดการขับ K⁺ — เสี่ยงมากในผู้สูงอายุ, CrCl ต่ำ, ใช้ร่วม ACEI/ARB/spironolactone",
        w: [
          "ถูก: TMP = amiloride-like ENaC blocker → hyperkalemia",
          "SMX ไม่มีผลต่อการสร้าง aldosterone",
          "TMP ไม่ใช่ ACE inhibitor",
          "Rhabdomyolysis ไม่ใช่ผลที่พบบ่อยจาก co-trimoxazole และไม่มี CPK สูงในโจทย์",
          "การกระตุ้น Na⁺/K⁺-ATPase จะทำให้ K⁺ เข้าเซลล์ (K⁺ ลดลง)",
        ],
        k: "Trimethoprim → hyperkalemia (ENaC block) และเพิ่ม SCr เล็กน้อยจากการยับยั้ง creatinine secretion",
      },
      {
        p: "แพทย์ตัดสินใจให้ digoxin immune Fab (40 mg/vial) ควรใช้กี่ vial (คำนวณจากระดับยา steady state)?",
        o: ["1 vial", "2 vials", "4 vials", "6 vials", "10 vials"],
        a: 1,
        r: "จำนวน vial = [digoxin level (ng/mL) × น้ำหนัก (kg)] / 100 = 2.8 × 52 / 100 = 1.46 → ปัดขึ้นเป็น 2 vials. ข้อบ่งใช้: bradyarrhythmia ร่วมกับ hypotension และ K⁺ > 5 mEq/L",
        c: [
          "Vials = (SDC × BW) / 100",
          "= (2.8 × 52) / 100 = 145.6 / 100 = 1.46",
          "ปัดขึ้น → 2 vials (80 mg)",
        ],
        w: [
          "1 vial ไม่พอ (1.46 ต้องปัดขึ้น)",
          "ถูก: 1.46 → 2 vials",
          "มากเกินจากสูตร — เป็นขนาดที่ใช้แบบ empiric ใน chronic toxicity เมื่อไม่ทราบระดับยา (3–6 vials)",
          "เกินความจำเป็นเมื่อทราบระดับยาแล้ว",
          "เป็นขนาด empiric สำหรับ acute ingestion ที่ไม่ทราบปริมาณ",
        ],
        k: "Digoxin Fab: vials = level × kg / 100 (ปัดขึ้น). ข้อบ่งใช้เช่น life-threatening arrhythmia, bradycardia ร่วม hypotension, K⁺ > 5 mEq/L",
      },
      {
        p: "หลังผู้ป่วยหยุดเลือดออกและอาการคงที่ แพทย์ต้องการเปลี่ยนจาก warfarin เป็น DOAC ข้อใดเหมาะสมที่สุด (SCr 1.6, CrCl ≈ 24 mL/min)?",
        o: [
          "Dabigatran 150 mg BID",
          "Rivaroxaban 20 mg OD พร้อมอาหารเย็น",
          "Apixaban 5 mg BID",
          "Edoxaban 60 mg OD",
          "Apixaban 2.5 mg BID",
        ],
        a: 4,
        r: "Apixaban ลดขนาดเป็น 2.5 mg BID เมื่อมี ≥ 2 ใน 3 ข้อ: อายุ ≥ 80 ปี, น้ำหนัก ≤ 60 kg, SCr ≥ 1.5 mg/dL → ผู้ป่วยมีน้ำหนัก 52 kg และ SCr 1.6 (2 ข้อ)",
        w: [
          "Dabigatran กำจัดทางไต ~80% ห้ามใช้ (ตาม label ยุโรป/ไทย) เมื่อ CrCl < 30",
          "Rivaroxaban ต้องลดเป็น 15 mg OD เมื่อ CrCl 15–50",
          "ขนาดเต็มไม่เหมาะเพราะเข้าเกณฑ์ลดขนาด 2 ข้อ",
          "Edoxaban ต้องลดเป็น 30 mg OD เมื่อ CrCl 15–50",
          "ถูก: เข้าเกณฑ์ 2/3 (BW ≤ 60, SCr ≥ 1.5)",
        ],
        k: "DOAC dose ใน AF: apixaban ใช้เกณฑ์ age/weight/SCr, ส่วน rivaroxaban/edoxaban/dabigatran ใช้ CrCl",
      },
    ],
  },
  {
    title: "TB/HIV co-infection",
    base:
      "ชายไทยอายุ 35 ปี น้ำหนัก 58 kg ได้รับการวินิจฉัย HIV ครั้งแรก CD4 90 cells/mm³, HIV viral load 180,000 copies/mL. ไอเรื้อรัง 1 เดือน sputum AFB 2+, Xpert MTB/RIF: MTB detected, rifampicin resistance not detected. " +
      "ALT 30 U/L, T.bil 0.8 mg/dL, SCr 0.9 mg/dL, HBsAg negative, serum CrAg negative. แพทย์เริ่ม 2HRZE/4HR",
    ref: "WHO Consolidated Guidelines on HIV & TB 2021–2022; แนวทางการตรวจรักษาและป้องกันการติดเชื้อเอชไอวี ประเทศไทย; ATS/CDC/IDSA TB Guideline",
    qs: [
      {
        p: "ควรเริ่ม ART เมื่อใด?",
        o: [
          "เริ่ม ART ก่อนยา TB อย่างน้อย 2 สัปดาห์",
          "ภายใน 2 สัปดาห์หลังเริ่มยา TB เมื่อผู้ป่วยทนยาได้",
          "หลังครบ intensive phase 2 เดือน",
          "หลังรักษา TB ครบ 6 เดือน",
          "รอจน CD4 > 200 cells/mm³",
        ],
        a: 1,
        r: "Pulmonary TB ใน HIV (โดยเฉพาะ CD4 < 50–100) ให้เริ่มยา TB ก่อน แล้วเริ่ม ART ภายใน 2 สัปดาห์เพื่อลด mortality — ยกเว้น TB meningitis ที่ควรเลื่อน ART ออกไป 4–8 สัปดาห์",
        w: [
          "ต้องเริ่มยา TB ก่อนเสมอ เพื่อลดความรุนแรงของ IRIS",
          "ถูก: early ART ภายใน 2 สัปดาห์ ลดการเสียชีวิต",
          "ช้าเกินไปสำหรับ CD4 90 — เพิ่ม mortality",
          "ช้าเกินไปมาก เสี่ยง OI อื่น",
          "CD4 จะไม่เพิ่มถ้าไม่ได้ ART",
        ],
        k: "TB/HIV: TB drugs first → ART within 2 weeks (ยกเว้น TB meningitis)",
      },
      {
        p: "สูตร ART ใดเหมาะสมที่สุดขณะผู้ป่วยได้รับ rifampicin?",
        o: [
          "TAF/FTC/bictegravir 1 เม็ด OD",
          "TDF/3TC + dolutegravir 50 mg OD",
          "TDF/3TC + lopinavir/ritonavir ขนาดปกติ",
          "TDF/3TC + dolutegravir 50 mg BID",
          "TDF/FTC + darunavir/ritonavir 800/100 mg OD",
        ],
        a: 3,
        r: "Rifampicin เหนี่ยวนำ UGT1A1 และ CYP3A4 ลดระดับ dolutegravir ~50–70% จึงต้องเพิ่ม DTG เป็น 50 mg BID ระหว่างได้ rifampicin และต่อไปอีก 2 สัปดาห์หลังหยุด rifampicin",
        w: [
          "Bictegravir และ TAF ห้ามใช้ร่วม rifampicin (ระดับยาลดมาก)",
          "DTG OD ได้ระดับยาไม่พอเมื่อใช้ร่วม rifampicin",
          "Rifampicin ลดระดับ PI/r อย่างมาก ห้ามใช้ขนาดปกติ",
          "ถูก: DTG 50 mg BID ชดเชย enzyme induction",
          "Boosted PI ไม่ควรใช้ร่วม rifampicin (ใช้ rifabutin แทนหากจำเป็นต้องใช้ PI)",
        ],
        k: "Rifampicin + DTG → DTG 50 mg BID; rifampicin + PI/r หรือ TAF/BIC → หลีกเลี่ยง",
      },
      {
        p: "ยาป้องกันการติดเชื้อฉวยโอกาสใดจำเป็นที่สุดสำหรับผู้ป่วยรายนี้ในขณะนี้?",
        o: [
          "Fluconazole 400 mg/day",
          "Azithromycin 1,200 mg สัปดาห์ละครั้ง",
          "Co-trimoxazole (400/80 mg) 2 เม็ด OD",
          "Valganciclovir 900 mg OD",
          "Acyclovir 400 mg BID",
        ],
        a: 2,
        r: "CD4 < 200 → primary prophylaxis ของ PCP (และ toxoplasmosis เมื่อ CD4 < 100) ด้วย co-trimoxazole",
        w: [
          "CrAg negative และไม่มีข้อบ่งใช้ primary fungal prophylaxis ในไทย (ใช้ CrAg screening แทน)",
          "MAC prophylaxis ไม่แนะนำแล้วเมื่อเริ่ม ART ทันที",
          "ถูก: PCP ± toxoplasma prophylaxis",
          "ไม่แนะนำ CMV primary prophylaxis",
          "ไม่แนะนำ HSV prophylaxis ตามปกติ",
        ],
        k: "CD4 < 200 → co-trimoxazole prophylaxis; หยุดได้เมื่อ CD4 > 200 นาน ≥ 3–6 เดือนหลัง ART",
      },
      {
        p: "3 สัปดาห์หลังเริ่ม ART ผู้ป่วยมีไข้ ต่อมน้ำเหลืองโตขึ้น ภาพรังสีทรวงอกแย่ลง ทั้งที่กินยาสม่ำเสมอ culture เชื้ออื่นเป็นลบ และ VL ลดลง. การจัดการใดเหมาะสมที่สุด?",
        o: [
          "หยุด ART จนกว่าอาการจะดีขึ้น",
          "ให้ยาต่อทั้ง ART และยา TB ร่วมกับ prednisolone 1.5 mg/kg/day 2 สัปดาห์ แล้วลดเป็น 0.75 mg/kg/day อีก 2 สัปดาห์",
          "เปลี่ยนเป็นสูตรรักษา MDR-TB",
          "หยุดยา TB ทั้งหมด เนื่องจากเป็น drug fever",
          "เพิ่ม levofloxacin เข้าไปในสูตรยาเดิม",
        ],
        a: 1,
        r: "Paradoxical TB-IRIS: อาการแย่ลงหลังเริ่ม ART ร่วมกับ immune recovery (VL ลด) — ให้ยาทั้งสองกลุ่มต่อ และให้ prednisolone ในรายที่มีอาการปานกลาง–รุนแรง",
        w: [
          "ไม่ควรหยุด ART ยกเว้น IRIS รุนแรงคุกคามชีวิต (เช่น CNS)",
          "ถูก: continue ART + TB drugs ± prednisolone",
          "Xpert ไม่พบ rifampicin resistance และอาการเข้าได้กับ IRIS มากกว่า",
          "หยุดยา TB เสี่ยง treatment failure/resistance",
          "ไม่มีหลักฐานว่า TB ดื้อยา การเพิ่มยาเดี่ยวเสี่ยงดื้อยา",
        ],
        k: "TB-IRIS: ต่อยาทั้งหมด + prednisolone; ต้อง exclude TB ดื้อยาและ OI อื่นก่อน",
      },
      {
        p: "สัปดาห์ที่ 6 ผู้ป่วยมีตัวเหลือง คลื่นไส้ ALT 420 U/L, T.bil 3.2 mg/dL. การจัดการใดเหมาะสมที่สุด?",
        o: [
          "ให้ยาเดิมต่อ ติดตาม LFT ทุกสัปดาห์",
          "หยุดเฉพาะ pyrazinamide แล้วให้ HRE ต่อทันที",
          "ลดขนาดยา TB ทุกตัวลงครึ่งหนึ่ง",
          "หยุด H, R, Z ให้ non-hepatotoxic regimen (เช่น E + levofloxacin + amikacin/streptomycin) จน LFT ใกล้ปกติ แล้ว re-challenge ทีละตัว",
          "หยุดยา TB และ ART ถาวร",
        ],
        a: 3,
        r: "DILI: ALT > 3×ULN ร่วมอาการ หรือ > 5×ULN หรือ bilirubin สูง → หยุด hepatotoxic TB drugs ทั้งหมด ให้สูตรชั่วคราวที่ไม่เป็นพิษต่อตับ (ผู้ป่วยมี sputum AFB+ จึงไม่ควรหยุดยาโดยไม่มีสูตรทดแทน) เมื่อ ALT < 2×ULN จึง re-introduce R → H (Z มักไม่ให้ซ้ำ)",
        w: [
          "อันตราย — เสี่ยง fulminant hepatitis",
          "ไม่ทราบว่ายาตัวใดเป็นสาเหตุ H และ R ก็ทำให้ตับอักเสบได้",
          "การลดขนาดทำให้รักษาไม่ได้ผลและเสี่ยงดื้อยา แต่ยังเป็นพิษต่อตับ",
          "ถูก: stop HRZ → bridging regimen → sequential re-challenge",
          "ไม่จำเป็นต้องหยุด ART ถาวร และการหยุดยา TB ถาวรไม่เหมาะ",
        ],
        k: "Anti-TB DILI: หยุด HRZ, ใช้ bridging regimen, re-challenge R → H เมื่อ LFT ดีขึ้น",
      },
    ],
  },
  {
    title: "MRSA bacteremia + vancomycin AUC dosing",
    base:
      "ชายไทยอายุ 55 ปี น้ำหนัก 70 kg สูง 170 cm มี central venous catheter ติดเชื้อ และ blood culture ขึ้น MRSA 2/2 ขวด (vancomycin MIC 1 mg/L). SCr 1.0 mg/dL. " +
      "แพทย์เริ่ม vancomycin ร่วมกับ piperacillin/tazobactam empirically",
    ref: "ASHP/IDSA/PIDS/SIDP Vancomycin TDM Consensus 2020; IDSA MRSA Guideline 2011; Daptomycin prescribing information",
    qs: [
      {
        p: "ขนาด vancomycin loading dose 25 mg/kg ของผู้ป่วยรายนี้คือเท่าใด (ปัดเป็น 250 mg ที่ใกล้ที่สุด)?",
        o: ["500 mg", "1,000 mg", "1,750 mg", "3,500 mg", "5,000 mg"],
        a: 2,
        r: "Loading dose 20–35 mg/kg (actual body weight, max ~3,000 mg) → 25 × 70 = 1,750 mg",
        c: ["25 mg/kg × 70 kg = 1,750 mg", "หยดอย่างน้อย 1.5–2 ชั่วโมง (≤ 1 g/h) เพื่อลด vancomycin infusion reaction"],
        w: [
          "ต่ำกว่า loading dose มาก — ไม่ถึงเป้าหมายเร็ว",
          "เป็นขนาด maintenance ทั่วไป ไม่ใช่ loading",
          "ถูก: 25 × 70 = 1,750 mg",
          "50 mg/kg — เกินขนาดสูงสุด",
          "เกินขนาดสูงสุดมาก",
        ],
        k: "Vancomycin LD 20–35 mg/kg ใช้ actual body weight (ไม่เกิน 3 g)",
      },
      {
        p: "CrCl ของผู้ป่วย (Cockcroft–Gault) มีค่าใกล้เคียงข้อใดที่สุด?",
        o: ["60 mL/min", "72 mL/min", "83 mL/min", "95 mL/min", "110 mL/min"],
        a: 2,
        r: "CrCl = (140 − 55) × 70 / (72 × 1.0) = 5,950 / 72 ≈ 82.6 mL/min",
        c: ["IBW (ชาย) = 50 + 2.3 × (170/2.54 − 60) ≈ 65.9 kg; TBW 70 kg < 120% IBW → ใช้ TBW ได้", "(140 − 55) × 70 = 5,950", "5,950 / (72 × 1.0) ≈ 82.6 mL/min"],
        w: [
          "ต่ำเกินไป",
          "เกิดจากคูณ 0.85 ทั้งที่เป็นเพศชาย",
          "ถูก: ≈ 83 mL/min",
          "สูงเกินไป",
          "สูงเกินไปมาก",
        ],
        k: "ตรวจ IBW ก่อนเลือกน้ำหนักในสูตร CG ทุกครั้ง",
      },
      {
        p: "ได้รับ vancomycin 1,250 mg q12h (หยด 1 ชม.) ถึง steady state วัดระดับยา 1 ชม. หลังหยดจบ = 30 mg/L และ 9 ชม. หลังหยดจบ = 10 mg/L. ค่าครึ่งชีวิตของยาใกล้เคียงข้อใดที่สุด?",
        o: ["3 ชั่วโมง", "4 ชั่วโมง", "5 ชั่วโมง", "6.5 ชั่วโมง", "8 ชั่วโมง"],
        a: 2,
        r: "ke = ln(C1/C2) / Δt = ln(30/10) / 8 = 1.0986 / 8 = 0.137 h⁻¹ → t½ = 0.693 / 0.137 ≈ 5.0 ชั่วโมง",
        c: ["Δt = 9 − 1 = 8 ชั่วโมง", "ke = ln(30/10) / 8 = 1.0986 / 8 = 0.1373 h⁻¹", "t½ = 0.693 / 0.1373 ≈ 5.05 ชั่วโมง"],
        w: [
          "ต่ำกว่าค่าที่คำนวณได้",
          "ต่ำกว่าค่าที่คำนวณ",
          "ถูก: ≈ 5 ชั่วโมง",
          "สูงเกินไป",
          "สูงเกินไป — มักเกิดจากใช้ Δt ผิด",
        ],
        k: "สองจุดใน elimination phase: ke = ln(C1/C2)/Δt, t½ = 0.693/ke",
      },
      {
        p: "จากข้อมูลระดับยา คำนวณได้ AUC₂₄ = 750 mg·h/L ที่ขนาด 2,500 mg/day. ต้องการ AUC₂₄ เป้าหมาย 400–600 (ประมาณ 450–500) ควรปรับขนาดยาเป็นข้อใด?",
        o: [
          "500 mg q12h",
          "750 mg q12h",
          "1,250 mg q24h",
          "1,000 mg q8h",
          "1,500 mg q12h",
        ],
        a: 1,
        r: "Vancomycin เป็น linear PK: AUC ใหม่ = 750 × (dose ใหม่ / 2,500). 750 mg q12h = 1,500 mg/day → AUC ≈ 450 mg·h/L อยู่ในเป้าหมาย",
        c: ["AUC ใหม่ = AUC เดิม × (daily dose ใหม่ / daily dose เดิม)", "500 q12h: 750 × 1,000/2,500 = 300 (ต่ำ)", "750 q12h: 750 × 1,500/2,500 = 450 (เป้าหมาย)", "1,250 q24h: 750 × 1,250/2,500 = 375 (ต่ำ)", "1,000 q8h: 900; 1,500 q12h: 1,350 (สูง → nephrotoxicity)"],
        w: [
          "AUC ≈ 300 ต่ำกว่าเป้าหมาย",
          "ถูก: AUC ≈ 450",
          "AUC ≈ 375 ต่ำกว่า 400",
          "AUC ≈ 900 เสี่ยง AKI",
          "AUC ≈ 1,350 เสี่ยง AKI สูงมาก",
        ],
        k: "AUC-guided vancomycin (400–600) ลด AKI เมื่อเทียบกับ trough 15–20",
      },
      {
        p: "วันที่ 5 blood culture ยังขึ้น MRSA และ SCr เพิ่มจาก 1.0 เป็น 2.1 mg/dL. ทางเลือกการรักษาใดเหมาะสมที่สุด?",
        o: [
          "เพิ่ม gentamicin 1 mg/kg q8h ร่วมกับ vancomycin",
          "เปลี่ยนเป็น cefazolin 2 g q8h",
          "เปลี่ยนเป็น daptomycin 8–10 mg/kg/day และติดตาม CPK ทุกสัปดาห์",
          "เปลี่ยนเป็น clindamycin 600 mg IV q8h",
          "เปลี่ยนเป็น linezolid 600 mg PO BID",
        ],
        a: 2,
        r: "Persistent MRSA bacteremia + AKI (vancomycin + piperacillin/tazobactam เพิ่มความเสี่ยง AKI) → เปลี่ยนเป็น high-dose daptomycin (bactericidal) และตามหา/กำจัด source (ถอด line, echocardiography)",
        w: [
          "Aminoglycoside ไม่เพิ่ม efficacy ใน S. aureus bacteremia และเพิ่ม nephrotoxicity",
          "MRSA ดื้อต่อ beta-lactam (ยกเว้น ceftaroline)",
          "ถูก: daptomycin high dose, ติดตาม CPK และหยุด statin ชั่วคราว",
          "Clindamycin เป็น bacteriostatic ไม่ใช้รักษา bacteremia",
          "Linezolid เป็น bacteriostatic ไม่ใช่ first-line ใน bacteremia",
        ],
        k: "Persistent MRSA bacteremia / vancomycin failure → high-dose daptomycin + source control",
      },
      {
        p: "ต่อมาผู้ป่วยมี septic pulmonary emboli ร่วมกับ MRSA pneumonia ข้อจำกัดสำคัญของ daptomycin ในกรณีนี้คือข้อใด?",
        o: [
          "Daptomycin ไม่ครอบคลุม MRSA ในเนื้อปอด",
          "Daptomycin ถูก pulmonary surfactant ยับยั้ง จึงไม่ใช้รักษา pneumonia",
          "Daptomycin ทำให้เกิด QT prolongation เมื่อมีปอดอักเสบ",
          "Daptomycin ต้องให้ร่วม rifampicin เสมอใน pneumonia",
          "Daptomycin เข้าเนื้อปอดได้ดีแต่ทำให้เกิด eosinophilic pneumonia ทุกราย",
        ],
        a: 1,
        r: "Daptomycin ถูก surfactant จับและยับยั้ง จึงไม่ใช้รักษา pneumonia → ควรใช้ linezolid หรือ vancomycin แทนสำหรับ MRSA pneumonia",
        w: [
          "Daptomycin ครอบคลุม MRSA แต่ถูก surfactant ยับยั้ง",
          "ถูก: inactivated by surfactant",
          "ไม่ใช่ ADR เด่นของ daptomycin",
          "ไม่มีข้อกำหนดเช่นนั้น",
          "Eosinophilic pneumonia เป็น ADR ที่พบได้แต่ไม่ใช่ทุกราย",
        ],
        k: "Daptomycin: bacteremia/endocarditis ได้ แต่ pneumonia ไม่ได้; ADR = CPK ↑, eosinophilic pneumonia",
      },
    ],
  },
  {
    title: "Status epilepticus + phenytoin nonlinear PK",
    base:
      "หญิงไทยอายุ 68 ปี น้ำหนัก 50 kg มีประวัติโรคลมชัก ขาดยา มาด้วยชักเกร็งกระตุกต่อเนื่องนาน 10 นาทีไม่รู้สึกตัวระหว่างชัก. Albumin 2.0 g/dL, CrCl 60 mL/min, ไม่มีประวัติแพ้ยา",
    ref: "AES Guideline Convulsive Status Epilepticus 2016; Applied Clinical Pharmacokinetics (Bauer); CPIC Guideline for CYP2C9/HLA-B & Phenytoin",
    qs: [
      {
        p: "ยาที่ควรให้เป็นอันดับแรกคือข้อใด?",
        o: [
          "Phenytoin 20 mg/kg IV",
          "Phenobarbital 20 mg/kg IV",
          "Diazepam 10 mg IV (≤ 5 mg/min)",
          "Midazolam continuous infusion 0.2 mg/kg/h",
          "Valproate 500 mg PO",
        ],
        a: 2,
        r: "Status epilepticus: first-line คือ benzodiazepine (diazepam 0.15–0.2 mg/kg IV, max 10 mg/dose → 50 kg × 0.2 = 10 mg) ภายใน 5–20 นาทีแรก",
        w: [
          "Phenytoin เป็น second-line หลัง benzodiazepine",
          "Phenobarbital เป็น second-line alternative",
          "ถูก: benzodiazepine first-line",
          "Continuous infusion ใช้ใน refractory SE",
          "ห้ามให้ทางปากในผู้ป่วยชักไม่รู้สึกตัว",
        ],
        k: "SE: benzodiazepine → phenytoin/valproate/levetiracetam → anesthetic infusion",
      },
      {
        p: "หลังให้ diazepam ยังชักต่อ แพทย์สั่ง phenytoin loading ข้อใดถูกต้องที่สุด?",
        o: [
          "Phenytoin 1,000 mg เจือจางใน NSS หยดไม่เกิน 50 mg/min (ผู้สูงอายุควร ≤ 25 mg/min) พร้อม monitor ECG/BP",
          "Phenytoin 1,000 mg เจือจางใน D5W หยดใน 20 นาที",
          "Phenytoin 500 mg IV push ใน 2 นาที",
          "Phenytoin 1,000 mg IM",
          "Phenytoin 1,000 mg IV push 100 mg/min",
        ],
        a: 0,
        r: "LD 20 mg/kg × 50 = 1,000 mg; phenytoin ตกตะกอนใน dextrose จึงเจือจางใน NSS; อัตราเร็วเกิน 50 mg/min (ผู้สูงอายุ/โรคหัวใจ > 25 mg/min) เสี่ยง hypotension, bradyarrhythmia จาก propylene glycol",
        w: [
          "ถูก: 1,000 mg ใน NSS, ≤ 50 mg/min (สูงอายุ ≤ 25 mg/min), monitor ECG",
          "ตกตะกอนใน D5W",
          "ขนาดไม่พอและเร็วเกิน",
          "IM ดูดซึมไม่แน่นอน ตกผลึกในกล้ามเนื้อ",
          "เร็วเกิน — เสี่ยง cardiovascular collapse",
        ],
        k: "Phenytoin IV: NSS only, ≤ 50 mg/min (สูงอายุ ≤ 25), ระวัง purple glove syndrome",
      },
      {
        p: "ต่อมาผู้ป่วยได้ phenytoin 300 mg/day จนถึง steady state วัดระดับ total phenytoin = 7 mg/L. ค่า corrected concentration (Sheiner–Tozer) ใกล้เคียงข้อใด?",
        o: ["7 mg/L", "10 mg/L", "14 mg/L", "17.5 mg/L", "28 mg/L"],
        a: 2,
        r: "C_corrected = C_measured / (0.2 × Alb + 0.1) = 7 / (0.2 × 2.0 + 0.1) = 7 / 0.5 = 14 mg/L → อยู่ในช่วงรักษา 10–20 mg/L ไม่ควรเพิ่มขนาดยาตามค่า total ที่ต่ำ",
        c: ["0.2 × 2.0 + 0.1 = 0.5", "7 / 0.5 = 14 mg/L"],
        w: [
          "เป็นค่า total ที่ยังไม่ได้ปรับ albumin",
          "ปรับไม่ถูกสูตร",
          "ถูก: 14 mg/L",
          "ใช้สูตรผิด (เช่น 0.2 × Alb โดยไม่บวก 0.1)",
          "สูงเกินจริง — คำนวณผิดสูตร",
        ],
        k: "Low albumin → free fraction ↑ → total level ต่ำ 'หลอก' ให้เพิ่มยาจนเกิดพิษ; ถ้าทำได้วัด free phenytoin (1–2 mg/L)",
      },
      {
        p: "สมมติ Km = 4 mg/L และ Css (corrected) = 14 mg/L ที่ขนาด 300 mg/day. หากแพทย์เพิ่มขนาดเป็น 350 mg/day ค่า Css ใหม่ประมาณเท่าใด?",
        o: ["16 mg/L", "20 mg/L", "28 mg/L", "39 mg/L", "50 mg/L"],
        a: 3,
        r: "Michaelis–Menten: Vmax = R × (Km + Css) / Css = 300 × 18 / 14 = 385.7 mg/day. Css ใหม่ = Km × R / (Vmax − R) = 4 × 350 / 35.7 ≈ 39 mg/L — เพิ่มขนาด 17% แต่ระดับยาเกือบ 3 เท่า",
        c: [
          "Vmax = 300 × (4 + 14) / 14 = 385.7 mg/day",
          "Css ใหม่ = (Km × R) / (Vmax − R)",
          "= (4 × 350) / (385.7 − 350) = 1,400 / 35.7 ≈ 39.2 mg/L",
        ],
        w: [
          "คำนวณแบบ linear (14 × 350/300 = 16.3) ซึ่งผิดสำหรับ phenytoin",
          "ต่ำกว่าความเป็นจริงของ nonlinear PK",
          "ต่ำกว่าความเป็นจริง",
          "ถูก: ≈ 39 mg/L → เสี่ยง nystagmus/ataxia/confusion",
          "สูงเกินจริง",
        ],
        k: "Phenytoin: saturable (Michaelis–Menten) — ปรับขนาดทีละน้อย (≤ 25–50 mg/day) เมื่อระดับยาใกล้ช่วงรักษา",
      },
      {
        p: "หากแพทย์ต้องการเปลี่ยน phenytoin เป็น carbamazepine ในผู้ป่วยไทย ควรตรวจ pharmacogenetic marker ใดก่อน?",
        o: ["HLA-B*58:01", "HLA-B*57:01", "HLA-B*15:02", "HLA-B*13:01", "TPMT"],
        a: 2,
        r: "HLA-B*15:02 สัมพันธ์กับ SJS/TEN จาก carbamazepine (และ phenytoin/oxcarbazepine) ในคนเอเชียตะวันออกเฉียงใต้รวมถึงไทย — สปสช. ครอบคลุมการตรวจก่อนเริ่มยา",
        w: [
          "Allopurinol SCAR",
          "Abacavir hypersensitivity",
          "ถูก: carbamazepine SJS/TEN",
          "Dapsone hypersensitivity syndrome",
          "Thiopurine (azathioprine, 6-MP) myelosuppression",
        ],
        k: "B*15:02 = CBZ, B*58:01 = allopurinol, B*57:01 = abacavir, B*13:01 = dapsone",
      },
    ],
  },
  {
    title: "Diabetic ketoacidosis",
    base:
      "ชายไทยอายุ 24 ปี น้ำหนัก 60 kg เป็น T1DM ขาดยาอินซูลิน 3 วัน มีอาเจียน ปวดท้อง หายใจหอบลึก. " +
      "Lab: plasma glucose 520 mg/dL, pH 7.08, HCO₃⁻ 8 mEq/L, Na⁺ 130 mEq/L, Cl⁻ 96 mEq/L, K⁺ 3.1 mEq/L, BUN 30 mg/dL, SCr 1.4 mg/dL, serum β-hydroxybutyrate 6.2 mmol/L",
    ref: "ADA/EASD/JBDS/AACE/DTS Consensus Report: Hyperglycemic Crises in Adults with Diabetes 2024",
    qs: [
      {
        p: "Anion gap ของผู้ป่วยมีค่าเท่าใด?",
        o: ["14 mEq/L", "18 mEq/L", "22 mEq/L", "26 mEq/L", "34 mEq/L"],
        a: 3,
        r: "AG = Na⁺ − (Cl⁻ + HCO₃⁻) = 130 − (96 + 8) = 26 mEq/L → high anion gap metabolic acidosis จาก ketoacids",
        c: ["AG = 130 − (96 + 8) = 26 mEq/L"],
        w: ["ต่ำเกิน — ค่าปกติ", "ต่ำเกิน", "ต่ำเกิน", "ถูก", "สูงเกิน — คำนวณผิด"],
        k: "DKA: HAGMA — ใช้ AG ปิดลง (< 12) เป็นเกณฑ์หนึ่งของ resolution",
      },
      {
        p: "Corrected Na⁺ (correction factor 1.6 mEq/L ต่อ glucose ที่เพิ่ม 100 mg/dL) มีค่าใกล้เคียงข้อใด?",
        o: ["128 mEq/L", "131 mEq/L", "137 mEq/L", "143 mEq/L", "148 mEq/L"],
        a: 2,
        r: "Corrected Na = 130 + 1.6 × (520 − 100)/100 = 130 + 6.7 ≈ 137 mEq/L → normal/high-normal → เลือก 0.45% NaCl หลัง resuscitation ระยะแรกได้",
        c: ["(520 − 100)/100 = 4.2", "1.6 × 4.2 = 6.72", "130 + 6.72 ≈ 136.7 mEq/L"],
        w: ["ต่ำกว่าค่าที่วัดได้ — correction ต้องบวกเพิ่ม", "ใช้ factor น้อยเกิน", "ถูก", "ใช้ factor สูงเกิน (~3)", "สูงเกินจริง"],
        k: "Hyperglycemia ดึงน้ำออกนอกเซลล์ → pseudo-hyponatremia; ใช้ corrected Na ช่วยเลือกชนิดสารน้ำ",
      },
      {
        p: "หลังให้ NSS 1 L ใน ชม.แรก การจัดการข้อใดเหมาะสมที่สุดเมื่อ K⁺ = 3.1 mEq/L?",
        o: [
          "Regular insulin 0.1 U/kg IV bolus แล้ว 0.1 U/kg/h ทันที",
          "ให้ sodium bicarbonate 100 mEq IV",
          "เริ่ม insulin infusion พร้อม KCl 10 mEq/h",
          "ให้ NSS ต่ออย่างเดียว ไม่ต้องเสริม K⁺ จนกว่าจะปัสสาวะออก",
          "ชะลอ insulin ให้ KCl 20–30 mEq/h จน K⁺ ≥ 3.5 mEq/L แล้วจึงเริ่ม insulin",
        ],
        a: 4,
        r: "Insulin จะผลัก K⁺ เข้าเซลล์ ถ้าเริ่มขณะ K⁺ < 3.5 (ADA 2024) เสี่ยง hypokalemia รุนแรง/arrhythmia/respiratory muscle weakness — ต้องเติม K⁺ ก่อน",
        w: [
          "อันตราย เมื่อ K⁺ < 3.5",
          "Bicarbonate พิจารณาเฉพาะ pH < 7.0 และทำให้ K⁺ ลดต่ำลงอีก",
          "ต้องแก้ K⁺ ให้ถึงเกณฑ์ก่อนเริ่ม insulin",
          "Total body K⁺ ในผู้ป่วยต่ำมาก ต้องเสริม",
          "ถูก: hold insulin, replace K⁺ first",
        ],
        k: "DKA: K⁺ < 3.5 → hold insulin + KCl; 3.5–5.0 → insulin + KCl 20–30 mEq/L ในสารน้ำ; > 5.0 → insulin, ยังไม่ให้ K⁺",
      },
      {
        p: "ระหว่างให้ insulin infusion 0.1 U/kg/h พบว่า glucose ลดลงเหลือ 230 mg/dL แต่ β-hydroxybutyrate ยัง 3.0 mmol/L และ pH 7.22. การปรับการรักษาข้อใดเหมาะสมที่สุด?",
        o: [
          "หยุด insulin infusion เพื่อป้องกัน hypoglycemia",
          "เปลี่ยนเป็น insulin SC และให้ผู้ป่วยกลับบ้าน",
          "เปลี่ยนสารน้ำเป็น dextrose-containing fluid (เช่น D5-½NSS) และปรับ insulin เป็น 0.02–0.05 U/kg/h ต่อจน ketoacidosis หาย",
          "ให้ NSS rate เดิมและ insulin rate เดิม",
          "ให้ sodium bicarbonate เพื่อเร่ง clearance ของ ketone",
        ],
        a: 2,
        r: "Glucose จะลดลงก่อน ketoacidosis หาย — ต้อง 'feed' dextrose เพื่อให้ insulin infusion ต่อไปได้จนแก้ ketosis (ketone < 0.6, pH > 7.3, HCO₃⁻ ≥ 18)",
        w: [
          "หยุด insulin ขณะยังมี ketoacidosis ทำให้ DKA กลับเป็นซ้ำ",
          "ยังไม่ถึงเกณฑ์ resolution",
          "ถูก: add dextrose + ลด insulin rate",
          "เสี่ยง hypoglycemia",
          "ไม่มีข้อบ่งใช้ (pH > 7.0)",
        ],
        k: "DKA resolution คือแก้ ketoacidosis ไม่ใช่แค่ glucose ลด",
      },
      {
        p: "เมื่อ DKA หายและผู้ป่วยรับประทานได้ แพทย์ต้องการเริ่ม basal-bolus (TDD 0.5 U/kg/day, basal 50%). การเริ่ม insulin glargine ข้อใดเหมาะสมที่สุด?",
        o: [
          "Glargine 6 U SC แล้วหยุด insulin infusion ทันที",
          "Glargine 15 U SC ให้ 1–2 ชั่วโมงก่อนหยุด insulin infusion",
          "Glargine 15 U SC ให้ 6 ชั่วโมงหลังหยุด insulin infusion",
          "Glargine 30 U SC ให้ 2 ชั่วโมงก่อนหยุด insulin infusion",
          "Glargine 45 U SC ครั้งเดียวก่อนนอน",
        ],
        a: 1,
        r: "TDD = 0.5 × 60 = 30 U → basal 50% = 15 U glargine. ต้องให้ SC basal overlap กับ IV insulin 1–2 ชม. (IV insulin t½ ~5–10 นาที) เพื่อป้องกัน rebound hyperglycemia/DKA",
        c: ["TDD = 0.5 U/kg × 60 kg = 30 U/day", "Basal = 50% × 30 = 15 U glargine", "Bolus = 15 U/day แบ่งก่อนอาหาร 3 มื้อ (~5 U/มื้อ)"],
        w: [
          "ขนาดต่ำเกินและไม่ overlap",
          "ถูก: 15 U + overlap 1–2 ชม.",
          "Gap 6 ชม. เสี่ยง DKA กลับเป็นซ้ำ",
          "เป็นขนาด TDD ทั้งหมด ไม่ใช่ basal",
          "สูงเกินมาก เสี่ยง hypoglycemia",
        ],
        k: "IV → SC insulin: ให้ basal SC 1–2 ชม. ก่อนหยุด drip เสมอ",
      },
    ],
  },
  {
    title: "Pediatric acute otitis media",
    base:
      "เด็กหญิงอายุ 2 ปี น้ำหนัก 12 kg ไข้ 39.2 °C ร้องกวน ดึงหู 2 วัน ตรวจพบ tympanic membrane โป่งแดงข้างขวา. ไปสถานรับเลี้ยงเด็กทุกวัน. " +
      "3 สัปดาห์ก่อนได้รับ amoxicillin รักษาคออักเสบ. ไม่มีประวัติแพ้ยา",
    ref: "AAP Clinical Practice Guideline: Diagnosis and Management of Acute Otitis Media 2013; Thai Pediatric Antibiotic Guideline",
    qs: [
      {
        p: "ยาปฏิชีวนะใดเหมาะสมที่สุดสำหรับผู้ป่วยรายนี้?",
        o: [
          "Amoxicillin 40 mg/kg/day",
          "Amoxicillin 80–90 mg/kg/day",
          "Amoxicillin/clavulanate (amoxicillin 90 mg/kg/day + clavulanate 6.4 mg/kg/day)",
          "Cefalexin 50 mg/kg/day",
          "Azithromycin 10 mg/kg วันแรก แล้ว 5 mg/kg วันที่ 2–5",
        ],
        a: 2,
        r: "เด็กได้ amoxicillin ใน 30 วันที่ผ่านมา → เสี่ยง beta-lactamase-producing H. influenzae / M. catarrhalis จึงเลือก high-dose amoxicillin/clavulanate",
        w: [
          "ขนาดต่ำไม่ครอบคลุม intermediate-resistant S. pneumoniae",
          "เป็น first-line ถ้าไม่ได้ amoxicillin ใน 30 วัน",
          "ถูก",
          "1st-gen cephalosporin ครอบคลุม H. influenzae ไม่ดี",
          "ใช้ในรายแพ้ penicillin รุนแรงเท่านั้น (pneumococcal resistance สูง)",
        ],
        k: "AOM: amoxicillin 90 mg/kg/day; ใช้ amox/clav ถ้าได้ amoxicillin ใน 30 วัน, มี purulent conjunctivitis หรือ recurrent AOM",
      },
      {
        p: "หากใช้ amoxicillin/clavulanate suspension ชนิด ES (amoxicillin 600 mg/5 mL) ขนาด amoxicillin 90 mg/kg/day แบ่งให้วันละ 2 ครั้ง ควรให้ครั้งละกี่ mL?",
        o: ["2.25 mL", "3.6 mL", "4.5 mL", "6 mL", "9 mL"],
        a: 2,
        r: "90 × 12 = 1,080 mg/day → 540 mg/ครั้ง → 540/600 × 5 = 4.5 mL BID",
        c: ["90 mg/kg/day × 12 kg = 1,080 mg/day", "แบ่ง BID = 540 mg/ครั้ง", "540 mg ÷ (600 mg/5 mL) = 4.5 mL/ครั้ง"],
        w: [
          "เป็นขนาด 45 mg/kg/day",
          "คำนวณจาก 250 mg/5 mL ผิดชนิดยา",
          "ถูก",
          "เป็นขนาด 120 mg/kg/day",
          "เป็นขนาดทั้งวัน ไม่ได้แบ่ง",
        ],
        k: "ES formulation (600/42.9 per 5 mL) ออกแบบให้ amox:clav = 14:1 → ลดท้องเสียเมื่อใช้ high-dose",
      },
      {
        p: "หากใช้ paracetamol syrup 120 mg/5 mL บรรเทาไข้ ขนาดใดเหมาะสม?",
        o: [
          "2.5 mL ทุก 8 ชั่วโมง",
          "5–7.5 mL ทุก 4–6 ชั่วโมงเมื่อมีไข้ ไม่เกิน 5 ครั้ง/วัน",
          "10 mL ทุก 4 ชั่วโมง",
          "15 mL ทุก 6 ชั่วโมง",
          "5 mL ทุก 2 ชั่วโมง",
        ],
        a: 1,
        r: "Paracetamol 10–15 mg/kg/ครั้ง = 120–180 mg = 5–7.5 mL ทุก 4–6 ชม. (ไม่เกิน 75 mg/kg/day ≈ 900 mg/day)",
        c: ["10–15 mg/kg × 12 kg = 120–180 mg/ครั้ง", "120 mg = 5 mL, 180 mg = 7.5 mL"],
        w: [
          "ขนาดต่ำและห่างเกินไป",
          "ถูก",
          "240 mg/ครั้ง = 20 mg/kg เกินขนาด",
          "360 mg/ครั้ง = 30 mg/kg เกินขนาด",
          "ถี่เกิน เสี่ยงเกิน 75 mg/kg/day",
        ],
        k: "Paracetamol เด็ก 10–15 mg/kg q4–6h, max 75 mg/kg/day",
      },
      {
        p: "หากผู้ป่วยมีประวัติผื่นแบบ maculopapular (non-type I) หลังได้ amoxicillin ทางเลือกใดเหมาะสมที่สุด?",
        o: [
          "Ciprofloxacin",
          "Co-trimoxazole",
          "Cefdinir 14 mg/kg/day",
          "Amoxicillin ขนาดมาตรฐาน",
          "Cefalexin",
        ],
        a: 2,
        r: "Non-type I penicillin allergy → 2nd/3rd-generation cephalosporin (cefdinir, cefuroxime, cefpodoxime, ceftriaxone) มี cross-reactivity ต่ำเพราะ side chain ต่างกัน",
        w: [
          "Fluoroquinolone ไม่ใช้ใน AOM เด็ก",
          "S. pneumoniae ดื้อสูง",
          "ถูก",
          "ยังเป็น penicillin ที่แพ้",
          "Cefalexin มี side chain คล้าย amoxicillin และ spectrum ไม่พอ",
        ],
        k: "Cross-reactivity ของ beta-lactam ขึ้นกับ R1 side chain: amoxicillin ~ cefalexin/cefadroxil",
      },
      {
        p: "หลังได้ amoxicillin/clavulanate ครบ 72 ชั่วโมง ยังมีไข้สูงและ TM โป่ง ข้อใดเหมาะสมที่สุด?",
        o: [
          "ให้ยาเดิมต่อจนครบ 10 วัน",
          "Ceftriaxone 300 mg IM ครั้งเดียว",
          "Ceftriaxone 600 mg IM/IV วันละครั้ง 3 วัน",
          "Ceftriaxone 1,200 mg IM/IV วันละครั้ง 3 วัน",
          "Ceftriaxone 600 mg IM ครั้งเดียว",
        ],
        a: 2,
        r: "Treatment failure ของ amox/clav → ceftriaxone 50 mg/kg/day × 3 วัน = 600 mg/day (3 วันดีกว่า 1 วันสำหรับ failure) ± tympanocentesis",
        c: ["50 mg/kg × 12 kg = 600 mg/day", "ให้ 3 วัน"],
        w: [
          "ไม่ตอบสนองใน 48–72 ชม. = treatment failure ต้องเปลี่ยนยา",
          "ขนาดต่ำ (25 mg/kg) และ 1 วันไม่พอสำหรับ failure",
          "ถูก",
          "100 mg/kg/day สูงเกิน (ใช้สำหรับ meningitis)",
          "1 วันใช้เป็น initial therapy ที่รับประทานไม่ได้ ไม่เหมาะกับ failure",
        ],
        k: "AOM failure: amoxicillin → amox/clav → ceftriaxone 3 days → clindamycin ± tympanocentesis",
      },
    ],
  },
];

const labels = ["A", "B", "C", "D", "E"];
// ต่อท้าย PC1 Pilot 032 (8 เคส, 32 ข้อ) ในชุด PC1 เดียวกัน
const CASE_OFFSET = 8;
const Q_OFFSET = 32;
const CASE_TOTAL = CASE_OFFSET + CASES.length;
const POS = [3, 0, 4, 1, 2, 0, 3, 1, 4];
const total = CASES.reduce((s, c) => s + c.qs.length, 0);

export const PC1_SCENARIO_001: McqQuestion[] = CASES.flatMap((c, ci) =>
  c.qs.map((q, qi) => {
    const n = CASES.slice(0, ci).reduce((s, x) => s + x.qs.length, 0) + qi + 1;
    // ตัวเลือกเชิงตัวเลขคงลำดับจากน้อยไปมาก; ตัวเลือกข้อความสลับตำแหน่งคำตอบเพื่อกระจาย key
    const numeric = q.o.every((t) => /^[\d.,]+ /.test(t));
    const order = q.o.map((_, j) => j).filter((j) => j !== q.a);
    if (numeric) order.splice(q.a, 0, q.a);
    else order.splice(POS[(n - 1) % POS.length], 0, q.a);
    const o = order.map((j) => q.o[j]);
    const w = order.map((j) => q.w[j]);
    const ai = order.indexOf(q.a);
    const ans = labels[ai];
    return {
      id: `pc1sc001q${String(n).padStart(3, "0")}`,
      subject_id: "pc1",
      exam_type: "PLE-PC",
      exam_source: "PharmRU PC1 Progressive Cases",
      exam_day: null,
      question_number: Q_OFFSET + n,
      scenario: `Case ${CASE_OFFSET + ci + 1}/${CASE_TOTAL} — ${c.title}\n${c.base}\n\nคำถาม ${qi + 1}/${c.qs.length}: ${q.p}`,
      image_url: null,
      choices: o.map((text, j) => ({ label: labels[j], text })),
      correct_answer: ans,
      explanation: `${q.r}\n\nReference: ${c.ref}`,
      detailed_explanation: {
        summary: `เฉลย ${ans}: ${o[ai]}`,
        reason: q.r,
        choices: o.map((text, j) => ({ label: labels[j], text, is_correct: j === ai, explanation: w[j] })),
        key_takeaway: q.k,
        ...(q.c ? { calculation_steps: q.c } : {}),
      },
      difficulty: "hard",
      is_ai_enhanced: true,
      ai_notes: "PC1 scenario-style (1 case, multiple items) modeled on past-exam format; clinical/editorial verification required before commercial publication.",
      status: "active",
      created_at: "2026-09-24 09:00:00",
      mcq_subjects: { id: "pc1", name: "PC1", name_th: "บริบาลเภสัชกรรม PC1", icon: "🩺", exam_type: "PLE-PC", question_count: Q_OFFSET + total, created_at: "2026-09-24 09:00:00" },
    };
  })
);
