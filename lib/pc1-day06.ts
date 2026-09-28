import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 6/30 (2 เคส/วัน) · สัปดาห์ที่ 2: โรคติดเชื้อ
// Case 23: UTI in pregnancy — ASB drug safety, pyelonephritis, ESBL E. coli, IV-to-oral limits, suppressive therapy
// Case 24: Candidemia in a kidney-transplant recipient — echinocandin, duration, C. glabrata, voriconazole–tacrolimus DDI, voriconazole TDM

const CASES: Pc1Case[] = [
  {
    title: "Pyelonephritis in pregnancy + ESBL E. coli",
    base:
      "หญิงไทยอายุ 28 ปี G1P0 น้ำหนัก 60 kg ไม่แพ้ยา. ขณะอายุครรภ์ 12 สัปดาห์ ตรวจ urine culture คัดกรองพบ E. coli > 10⁵ CFU/mL โดยไม่มีอาการ. " +
      "ต่อมาที่อายุครรภ์ 24 สัปดาห์ มีไข้ 39 °C หนาวสั่น ปวดหลังด้านขวา เคาะ CVA เจ็บ คลื่นไส้อาเจียน. BP 110/70 mmHg, HR 108 bpm. WBC 16,000/mm³, SCr 0.6 mg/dL",
    ref: "IDSA 2019 Asymptomatic Bacteriuria Guideline; ACOG Committee Opinion 717; IDSA 2024 Guidance on Antimicrobial-Resistant Gram-Negative Infections",
    qs: [
      {
        p: "ขณะอายุครรภ์ 12 สัปดาห์ ยาใดควรหลีกเลี่ยงมากที่สุดสำหรับรักษา asymptomatic bacteriuria (สมมติว่าเชื้อไวต่อทุกตัว)?",
        o: [
          "Cephalexin 500 mg PO q6h × 5–7 วัน",
          "Amoxicillin/clavulanate 500/125 mg PO q8h × 5–7 วัน",
          "Fosfomycin 3 g PO ครั้งเดียว",
          "Nitrofurantoin 100 mg PO BID × 5–7 วัน",
          "Co-trimoxazole (800/160 mg) PO BID × 3 วัน",
        ],
        a: 4,
        r: "ASB ในหญิงตั้งครรภ์ต้องรักษาเพื่อป้องกัน pyelonephritis. Trimethoprim เป็น folate antagonist — หลีกเลี่ยงในไตรมาสแรก (neural tube defects) และ sulfonamide หลีกเลี่ยงใกล้คลอด (kernicterus)",
        w: [
          "Beta-lactam ปลอดภัยในการตั้งครรภ์",
          "ปลอดภัย ใช้ได้",
          "ปลอดภัย ใช้ได้",
          "ใช้ได้ในไตรมาสแรกเมื่อไม่มีทางเลือกที่เหมาะกว่า (ACOG) และหลีกเลี่ยงใกล้คลอด",
          "ถูก: TMP (folate antagonist) ในไตรมาสแรก",
        ],
        k: "ตั้งครรภ์: ASB ต้องรักษา; หลีกเลี่ยง FQ, tetracycline, TMP ไตรมาสแรก, SMX ใกล้คลอด",
      },
      {
        p: "ที่อายุครรภ์ 24 สัปดาห์ การรักษาเบื้องต้นที่เหมาะสมที่สุดคือข้อใด?",
        o: [
          "Ciprofloxacin 500 mg PO BID × 7 วัน แบบผู้ป่วยนอก",
          "Nitrofurantoin 100 mg PO BID × 14 วัน",
          "รับไว้ในโรงพยาบาล ให้ ceftriaxone 1–2 g IV OD และสารน้ำ",
          "Gentamicin 5 mg/kg IV OD เดี่ยว",
          "Doxycycline 100 mg PO BID",
        ],
        a: 2,
        r: "Pyelonephritis ในหญิงตั้งครรภ์เสี่ยง sepsis, ARDS และคลอดก่อนกำหนด → admit + IV beta-lactam (ceftriaxone, cefepime หรือ ampicillin + gentamicin) จนไม่มีไข้ 24–48 ชม. แล้วรักษาต่อรวม 10–14 วัน",
        w: [
          "FQ หลีกเลี่ยงในการตั้งครรภ์ และควรรักษาแบบผู้ป่วยใน",
          "Nitrofurantoin ไม่ได้ระดับยาในเนื้อไต — ใช้ไม่ได้กับ pyelonephritis",
          "ถูก",
          "Aminoglycoside เดี่ยวเสี่ยง fetal ototoxicity และไม่ใช่ first-line",
          "Tetracycline ห้ามในการตั้งครรภ์",
        ],
        k: "Pyelonephritis in pregnancy: admit + IV ceftriaxone (หรือ ampicillin + gentamicin)",
      },
      {
        p: "วันที่ 2 ยังมีไข้ urine และ blood culture: E. coli ที่สร้าง ESBL — ดื้อ ceftriaxone, ciprofloxacin, co-trimoxazole; ไวต่อ ertapenem, meropenem, amikacin, piperacillin/tazobactam, nitrofurantoin, fosfomycin. ควรเปลี่ยนเป็นยาใด?",
        o: [
          "ให้ ceftriaxone ต่อ เพราะอาการกำลังจะดีขึ้น",
          "Piperacillin/tazobactam 4.5 g IV q6h",
          "Ertapenem 1 g IV OD",
          "Nitrofurantoin 100 mg PO BID",
          "Cefepime 2 g IV q8h",
        ],
        a: 2,
        r: "ESBL-E ที่ติดเชื้อนอกกระเพาะปัสสาวะ (pyelonephritis/bacteremia) → carbapenem เป็นยาหลัก; ertapenem ให้วันละครั้ง สะดวก และใช้ได้ในหญิงตั้งครรภ์เมื่อจำเป็น. IDSA ไม่แนะนำ piperacillin/tazobactam หรือ cefepime สำหรับ ESBL-E นอก cystitis แม้ผลรายงานว่าไว (MERINO trial)",
        w: [
          "เชื้อดื้อ ceftriaxone และยังมีไข้ ต้องเปลี่ยน",
          "ไม่แนะนำสำหรับ ESBL pyelonephritis/bacteremia (outcome แย่กว่า carbapenem)",
          "ถูก",
          "ไม่ได้ระดับยาในเนื้อไต/เลือด",
          "ไม่แนะนำสำหรับ ESBL-E แม้รายงานว่าไว",
        ],
        k: "ESBL-E: cystitis → nitrofurantoin/fosfomycin/SMX; pyelo/bacteremia → carbapenem (ertapenem/meropenem)",
      },
      {
        p: "วันที่ 4 ไข้ลงแล้ว 48 ชั่วโมง ทานได้ดี แพทย์ต้องการเปลี่ยนเป็นยารับประทานเพื่อกลับบ้าน. ข้อใดเหมาะสมที่สุด?",
        o: [
          "เปลี่ยนเป็น ciprofloxacin 500 mg PO BID",
          "เปลี่ยนเป็น fosfomycin 3 g ครั้งเดียว",
          "เปลี่ยนเป็น nitrofurantoin 100 mg PO BID",
          "ให้ ertapenem 1 g IV OD ต่อ (เช่น OPAT) จนครบ 10–14 วัน เพราะไม่มียารับประทานที่เหมาะสม",
          "เปลี่ยนเป็น co-trimoxazole PO BID",
        ],
        a: 3,
        r: "ยารับประทานที่ใช้รักษา pyelonephritis ได้ (FQ, SMX) เชื้อดื้อและไม่เหมาะกับการตั้งครรภ์; nitrofurantoin และ fosfomycin single dose ไม่ได้ระดับยาในเนื้อไตพอ → ให้ ertapenem วันละครั้งต่อจนครบ (ทำ OPAT ได้)",
        w: [
          "เชื้อดื้อ และหลีกเลี่ยงในการตั้งครรภ์",
          "Single-dose fosfomycin ใช้ได้เฉพาะ cystitis",
          "ไม่ได้ระดับยาในเนื้อไต",
          "ถูก",
          "เชื้อดื้อ",
        ],
        k: "IV→PO step-down ต้องมียารับประทานที่เชื้อไว, ได้ระดับยาที่ตำแหน่งติดเชื้อ และปลอดภัยต่อผู้ป่วย",
      },
      {
        p: "หลังรักษาครบ แพทย์ต้องการป้องกัน pyelonephritis ซ้ำตลอดการตั้งครรภ์ ข้อใดเหมาะสมที่สุด?",
        o: [
          "ไม่ต้องทำอะไรต่อ",
          "Ciprofloxacin 250 mg HS",
          "Nitrofurantoin 50–100 mg PO HS (suppressive therapy) ร่วมกับ urine culture เป็นระยะ",
          "Co-trimoxazole 1 เม็ด HS",
          "Amoxicillin 500 mg HS",
        ],
        a: 2,
        r: "หลัง pyelonephritis ในหญิงตั้งครรภ์ ความเสี่ยงเป็นซ้ำสูง → ให้ suppressive therapy ด้วยยาที่เชื้อไวและปลอดภัย (nitrofurantoin หรือ cephalexin HS) ตลอดการตั้งครรภ์ และตรวจ urine culture เป็นระยะ — ระวัง nitrofurantoin ช่วงใกล้คลอด (hemolysis ในทารก G6PD deficiency)",
        w: [
          "ความเสี่ยงเป็นซ้ำสูง ควรป้องกัน/ติดตาม",
          "เชื้อดื้อ และหลีกเลี่ยงในการตั้งครรภ์",
          "ถูก",
          "เชื้อดื้อ",
          "ESBL ทำลาย amoxicillin",
        ],
        k: "Recurrent UTI in pregnancy: suppressive nitrofurantoin หรือ cephalexin HS + urine culture follow-up",
      },
    ],
  },
  {
    title: "Candidemia + azole–tacrolimus interaction",
    base:
      "ชายไทยอายุ 60 ปี น้ำหนัก 70 kg ปลูกถ่ายไตมา 2 ปี ใช้ tacrolimus 3 mg BID (trough 7 ng/mL), mycophenolate และ prednisolone. " +
      "นอน ICU หลังผ่าตัดลำไส้ ได้ TPN ทาง central venous catheter และได้ meropenem มา 10 วัน. วันนี้ไข้ขึ้นใหม่ blood culture ขึ้น yeast 2/2 ขวด. SCr 1.1 mg/dL, ALT ปกติ",
    ref: "IDSA 2016 Clinical Practice Guideline for Candidiasis; IDSA 2016 Aspergillosis Guideline; Voriconazole & tacrolimus prescribing information; CPIC Guideline for CYP2C19 and Voriconazole",
    qs: [
      {
        p: "ยาต้านเชื้อราเริ่มต้นที่เหมาะสมที่สุดสำหรับ candidemia ในผู้ป่วยรายนี้คือข้อใด?",
        o: [
          "Fluconazole 200 mg IV OD",
          "Caspofungin 70 mg IV loading แล้ว 50 mg IV OD",
          "Amphotericin B deoxycholate 1 mg/kg/day",
          "Itraconazole 200 mg PO BID",
          "Flucytosine เดี่ยว",
        ],
        a: 1,
        r: "Candidemia ในผู้ป่วยวิกฤต/ภูมิคุ้มกันต่ำ/เคยได้ azole → echinocandin เป็น initial therapy. ยังเลี่ยงปัญหา DDI รุนแรงกับ tacrolimus และพิษต่อไตของ amphotericin B ในผู้ป่วยปลูกถ่ายไต",
        w: [
          "ขนาดต่ำเกิน (ต้อง loading 800 mg แล้ว 400 mg) และไม่ใช่ first-line ในผู้ป่วยวิกฤต; ยังเพิ่มระดับ tacrolimus",
          "ถูก",
          "Nephrotoxic มาก ไม่เหมาะกับไตปลูกถ่าย",
          "ไม่ใช่ยารักษา candidemia",
          "ดื้อยาเร็วเมื่อใช้เดี่ยว",
        ],
        k: "Candidemia initial: echinocandin (caspofungin, micafungin, anidulafungin)",
      },
      {
        p: "นอกจากให้ยาต้านเชื้อรา ข้อใดถูกต้องเกี่ยวกับการดูแลและระยะเวลาการรักษา?",
        o: [
          "คงสาย central line ไว้ และรักษา 7 วัน",
          "ถอด central line ตรวจตา (dilated fundoscopy) เจาะ blood culture ซ้ำ และรักษาต่อ 14 วันหลัง blood culture ครั้งแรกที่เป็นลบและอาการหาย",
          "รักษาจนไข้ลงแล้วหยุดยา",
          "รักษา 14 วันนับจากวันเริ่มยา โดยไม่ต้องเจาะ culture ซ้ำ",
          "รักษา 6 สัปดาห์ทุกราย",
        ],
        a: 1,
        r: "Uncomplicated candidemia: ถอดสายสวนหลอดเลือด (source control), ตรวจตาหา endophthalmitis, เจาะ blood culture ซ้ำทุก 1–2 วันจนเป็นลบ และให้ยาต่อ 14 วันหลัง culture ครั้งแรกที่เป็นลบร่วมกับอาการหาย",
        w: [
          "สายเป็นแหล่งเชื้อ และ 7 วันสั้นเกิน",
          "ถูก",
          "เสี่ยง relapse/metastatic infection",
          "นับผิดจุดเริ่มต้น ต้องนับจาก culture ลบครั้งแรก",
          "ใช้เฉพาะ complicated/metastatic เช่น osteomyelitis, endocarditis",
        ],
        k: "Candidemia: remove CVC, eye exam, daily cultures, 14 วันหลัง culture ลบครั้งแรก",
      },
      {
        p: "ผลเพาะเชื้อ: Candida glabrata, fluconazole MIC 32 mg/L (resistant), ไวต่อ echinocandin. หลังผู้ป่วยอาการคงที่และ culture เป็นลบ ข้อใดเหมาะสมที่สุด?",
        o: [
          "เปลี่ยนเป็น fluconazole 400 mg PO OD",
          "เปลี่ยนเป็น fluconazole 200 mg PO OD",
          "ให้ caspofungin ต่อจนครบระยะเวลา",
          "หยุดยาต้านเชื้อราได้เลยเพราะ culture เป็นลบแล้ว",
          "เปลี่ยนเป็น itraconazole 200 mg PO BID",
        ],
        a: 2,
        r: "Step-down เป็น azole ทำได้เฉพาะเมื่อเชื้อไวต่อ azole — C. glabrata ดื้อ fluconazole (MIC 32) จึงให้ echinocandin ต่อจนครบ",
        w: [
          "เชื้อดื้อ fluconazole",
          "เชื้อดื้อ และขนาดต่ำ",
          "ถูก",
          "ยังไม่ครบ 14 วันหลัง culture ลบ",
          "Cross-resistance กับ azole และ itraconazole ไม่ใช่ยามาตรฐาน",
        ],
        k: "C. glabrata: มัก fluconazole SDD/R; C. krusei: intrinsic fluconazole-resistant",
      },
      {
        p: "2 เดือนต่อมาผู้ป่วยเป็น invasive pulmonary aspergillosis แพทย์เริ่ม voriconazole. ควรปรับ tacrolimus (เดิม 3 mg BID) อย่างไร?",
        o: [
          "ไม่ต้องปรับขนาด",
          "เพิ่มเป็น 6 mg BID เพราะ voriconazole เร่งการกำจัด tacrolimus",
          "ลดขนาด tacrolimus เหลือประมาณ 1/3 (1 mg BID) และตรวจ trough level ใกล้ชิด",
          "หยุด tacrolimus ถาวร",
          "เปลี่ยนเป็น cyclosporine ขนาดเท่าเดิม",
        ],
        a: 2,
        r: "Voriconazole เป็น strong CYP3A4 inhibitor → ระดับ tacrolimus สูงขึ้นหลายเท่า เสี่ยง nephrotoxicity/neurotoxicity. Label แนะนำลด tacrolimus เหลือ 1/3 เมื่อเริ่ม voriconazole และติดตามระดับยา (และเพิ่มกลับเมื่อหยุด voriconazole)",
        c: ["3 mg BID × 1/3 = 1 mg BID", "ตรวจ tacrolimus trough ภายใน 3–5 วัน แล้วปรับตามเป้าหมาย"],
        w: [
          "เสี่ยง tacrolimus toxicity (AKI ในไตปลูกถ่าย)",
          "Voriconazole ยับยั้ง ไม่ได้เหนี่ยวนำ",
          "ถูก",
          "เสี่ยง graft rejection",
          "Cyclosporine ก็ถูกยับยั้งโดย voriconazole เช่นกัน (ต้องลดครึ่งหนึ่ง)",
        ],
        k: "Voriconazole + tacrolimus → ↓ tacrolimus 1/3; + cyclosporine → ↓ 1/2; + sirolimus → contraindicated",
      },
      {
        p: "หลังได้ voriconazole 6 วัน ผู้ป่วยเห็นภาพหลอน สับสน และตามัว trough voriconazole = 7.2 mg/L (เป้าหมาย 1–5.5). ข้อใดเหมาะสมที่สุด?",
        o: [
          "เพิ่มขนาด voriconazole เพื่อให้คุม aspergillosis ได้ดีขึ้น",
          "เพิ่ม rifampicin เพื่อลดระดับ voriconazole",
          "ลดขนาด voriconazole และตรวจ trough ซ้ำ; พิจารณา CYP2C19 genotype",
          "เปลี่ยนจาก IV เป็นรับประทานขนาดเท่าเดิมเพื่อลดระดับยา",
          "ไม่ต้องทำอะไร อาการไม่เกี่ยวกับยา",
        ],
        a: 2,
        r: "Voriconazole มี nonlinear PK และถูกกำจัดผ่าน CYP2C19 (poor metabolizer พบได้บ่อยในคนเอเชีย) → ระดับสูงสัมพันธ์กับ neurotoxicity/visual disturbance/hepatotoxicity. ลดขนาด (~25–50%) และตรวจ trough ซ้ำ",
        w: [
          "ทำให้พิษรุนแรงขึ้น",
          "Rifampicin ห้ามใช้ร่วม (ลดระดับ voriconazole > 90%) และรบกวน tacrolimus",
          "ถูก",
          "Oral bioavailability ~96% ระดับยาไม่ต่างมาก",
          "อาการเข้าได้กับ voriconazole toxicity และระดับสูงกว่าเป้า",
        ],
        k: "Voriconazole TDM: trough 1–5.5 mg/L; ADR: visual, hallucination, hepatotoxicity, photosensitivity/SCC, periostitis (fluoride)",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–22, ข้อ 1–107) → Case 23–24, ข้อ 108–117
export const PC1_DAY06: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d06q",
  caseOffset: 22,
  qOffset: 107,
  createdAt: "2026-09-28 09:00:00",
});
