import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 7/30 (2 เคส/วัน) · สัปดาห์ที่ 2: โรคติดเชื้อ (ปิดสัปดาห์)
// Case 25: Clostridioides difficile infection — severity/treatment, stewardship, recurrence, test of cure, infection control
// Case 26: HCV + HBsAg-positive — pangenotypic DAA, amiodarone and PPI interactions, HBV reactivation prophylaxis, SVR12

const CASES: Pc1Case[] = [
  {
    title: "Clostridioides difficile infection + stewardship",
    base:
      "หญิงไทยอายุ 72 ปี น้ำหนัก 55 kg นอนโรงพยาบาลด้วย community-acquired pneumonia ได้ ceftriaxone + azithromycin มา 7 วัน อาการปอดดีขึ้นมาก. " +
      "ใช้ omeprazole 20 mg OD มานานโดยไม่มีข้อบ่งใช้ชัดเจน. 2 วันนี้ถ่ายเหลวเป็นน้ำ 6–8 ครั้ง/วัน ปวดท้อง ไข้ 38.3 °C ไม่มี ileus ไม่มี hypotension. " +
      "Lab: WBC 18,000/mm³, SCr 1.9 mg/dL (เดิม 1.0), albumin 2.8 g/dL. Stool: C. difficile GDH positive, toxin A/B positive",
    ref: "IDSA/SHEA 2021 Focused Update Guideline on Management of C. difficile Infection in Adults; IDSA/SHEA 2017 CDI Guideline",
    qs: [
      {
        p: "ข้อใดเป็นการรักษา CDI ที่เหมาะสมที่สุดสำหรับผู้ป่วยรายนี้?",
        o: [
          "Metronidazole 500 mg PO TID × 10 วัน",
          "Vancomycin 1 g IV q12h",
          "Fidaxomicin 200 mg PO BID × 10 วัน (หรือ vancomycin 125 mg PO QID × 10 วัน)",
          "Loperamide 2 mg หลังถ่ายเหลวทุกครั้ง",
          "Vancomycin 500 mg PO QID ร่วมกับ metronidazole 500 mg IV q8h",
        ],
        a: 2,
        r: "WBC ≥ 15,000 หรือ SCr > 1.5 mg/dL = severe CDI (ไม่มี shock/ileus/megacolon จึงไม่ใช่ fulminant). IDSA/SHEA 2021 แนะนำ fidaxomicin (ลด recurrence) หรือ oral vancomycin 125 mg QID × 10 วัน",
        w: [
          "Metronidazole ใช้เฉพาะ non-severe เมื่อไม่มี fidaxomicin/vancomycin และผลด้อยกว่า",
          "IV vancomycin ไม่ถูกขับเข้าลำไส้ ไม่ได้ผลต่อ CDI",
          "ถูก",
          "Antimotility agent อาจทำให้ toxin คั่งและเกิด toxic megacolon",
          "เป็น regimen สำหรับ fulminant CDI (shock, ileus, megacolon)",
        ],
        k: "CDI severity: severe = WBC ≥ 15k หรือ SCr > 1.5; fulminant = hypotension/shock, ileus, megacolon",
      },
      {
        p: "มาตรการ antimicrobial stewardship ใดสำคัญที่สุดที่ควรทำร่วมกับการรักษา CDI?",
        o: [
          "เพิ่ม probiotic เป็นการรักษาหลักแทนยาปฏิชีวนะ",
          "เปลี่ยน azithromycin เป็น ciprofloxacin เพื่อรักษาปอดต่อ",
          "หยุด ceftriaxone/azithromycin (CAP รักษาครบและอาการดีขึ้นแล้ว) และหยุด omeprazole ที่ไม่มีข้อบ่งใช้",
          "ให้ omeprazole ต่อเพื่อป้องกัน stress ulcer",
          "เพิ่ม clindamycin เพื่อครอบคลุม anaerobe",
        ],
        a: 2,
        r: "ยาปฏิชีวนะที่ยังให้อยู่ (inciting antibiotic) เพิ่มความเสี่ยงล้มเหลวและ recurrence — CAP รักษาครบ ≥ 5 วันและดีขึ้นแล้วควรหยุด. PPI สัมพันธ์กับ CDI และ recurrence ควรหยุดเมื่อไม่มีข้อบ่งใช้",
        w: [
          "Probiotic ไม่ใช่การรักษา CDI",
          "Fluoroquinolone เป็นหนึ่งในยาที่เสี่ยง CDI สูงสุด และไม่จำเป็นต้องให้ต่อ",
          "ถูก",
          "ไม่มีข้อบ่งใช้ และเพิ่มความเสี่ยง recurrence",
          "Clindamycin เสี่ยง CDI สูงมาก",
        ],
        k: "CDI risk: clindamycin, FQ, cephalosporins (3rd/4th gen), carbapenem + PPI, อายุมาก, hospitalization",
      },
      {
        p: "หลังรักษาด้วย oral vancomycin ครบ 10 วัน อาการหาย 6 สัปดาห์ต่อมาถ่ายเหลวซ้ำ toxin positive (recurrence ครั้งแรก). ข้อใดเหมาะสมที่สุด?",
        o: [
          "Metronidazole 500 mg PO TID × 10 วัน",
          "Fidaxomicin 200 mg PO BID × 10 วัน (หรือ vancomycin แบบ taper/pulse) ± bezlotoxumab",
          "Fecal microbiota transplantation ทันที",
          "Vancomycin 1 g IV q12h",
          "สังเกตอาการเฉย ๆ โดยไม่ต้องให้ยา",
        ],
        a: 1,
        r: "First recurrence หลัง vancomycin → fidaxomicin (standard หรือ extended-pulsed) หรือ vancomycin taper/pulse; พิจารณา bezlotoxumab ในผู้ที่เสี่ยง recurrence สูง (อายุ ≥ 65 ปี). FMT แนะนำเมื่อ recurrence ≥ 2 ครั้ง",
        w: [
          "ไม่แนะนำ metronidazole สำหรับ recurrence",
          "ถูก",
          "FMT ใช้เมื่อ recurrence ครั้งที่ 2 ขึ้นไป",
          "IV vancomycin ไม่ได้ผลต่อ CDI",
          "มีอาการและ toxin positive ต้องรักษา",
        ],
        k: "Recurrent CDI: 1st → fidaxomicin/vanco taper-pulse ± bezlotoxumab; ≥ 2nd → FMT",
      },
      {
        p: "หลังรักษาครั้งแรกอาการหายดี ญาติขอให้ตรวจ stool toxin ซ้ำเพื่อยืนยันว่าหายขาด. ข้อใดถูกต้อง?",
        o: [
          "ควรตรวจซ้ำทุกราย ถ้ายังบวกต้องให้ยาต่อ",
          "ไม่แนะนำตรวจซ้ำ (test of cure) ในผู้ที่ไม่มีอาการ เพราะอาจยังพบเชื้อ/toxin ได้นานหลายสัปดาห์",
          "ตรวจ stool culture แทน",
          "ตรวจ colonoscopy ทุกรายหลังรักษา",
          "ให้ vancomycin ป้องกันต่อเนื่อง 3 เดือน",
        ],
        a: 1,
        r: "การตรวจซ้ำหลังอาการหายไม่แนะนำ เพราะผลบวกไม่ได้หมายถึง active infection และนำไปสู่การใช้ยาเกินจำเป็น — ตรวจเฉพาะเมื่อมีอาการใหม่ (≥ 3 ครั้ง/24 ชม. โดยไม่มีสาเหตุอื่น)",
        w: [
          "Colonization คงอยู่ได้นาน การรักษาตามผลตรวจทำให้ใช้ยาเกินจำเป็น",
          "ถูก",
          "ไม่มีประโยชน์ในการยืนยันการหาย",
          "ไม่มีข้อบ่งชี้",
          "ไม่แนะนำ prophylaxis ต่อเนื่องแบบนี้",
        ],
        k: "Diagnostic stewardship: ตรวจ C. difficile เฉพาะผู้มีอาการ; ไม่ตรวจ test of cure",
      },
      {
        p: "มาตรการควบคุมการติดเชื้อในหอผู้ป่วยข้อใดถูกต้องที่สุด?",
        o: [
          "ล้างมือด้วย alcohol hand rub เพียงพอ",
          "Contact precautions (ถุงมือ เสื้อกาวน์) ล้างมือด้วยสบู่และน้ำ และทำความสะอาดสิ่งแวดล้อมด้วยสารที่ฆ่า spore (เช่น chlorine)",
          "Airborne precautions และให้ใส่ N95",
          "ไม่ต้องแยกผู้ป่วยเพราะไม่ติดต่อ",
          "ให้ vancomycin ป้องกันแก่ผู้ป่วยเตียงข้างเคียง",
        ],
        a: 1,
        r: "C. difficile สร้าง spore ที่ทนต่อ alcohol → ต้องล้างมือด้วยสบู่และน้ำ (ขจัด spore ทางกล) ใช้ contact precautions และสารฆ่า spore (sodium hypochlorite) ทำความสะอาดสิ่งแวดล้อม",
        w: [
          "Alcohol ไม่ฆ่า spore",
          "ถูก",
          "CDI แพร่ทาง fecal–oral/สัมผัส ไม่ใช่ airborne",
          "ติดต่อได้ง่ายผ่านมือและพื้นผิว",
          "ไม่แนะนำ prophylaxis แก่ผู้สัมผัส",
        ],
        k: "CDI infection control: contact precautions + soap & water + sporicidal disinfectant",
      },
    ],
  },
  {
    title: "HCV/HBV co-infection + DAA drug interactions",
    base:
      "ชายไทยอายุ 52 ปี น้ำหนัก 70 kg anti-HCV positive, HCV RNA 2.1 × 10⁶ IU/mL, genotype 3a, FibroScan F2 (ไม่มี cirrhosis) ยังไม่เคยรักษา. " +
      "HBsAg positive, HBV DNA 800 IU/mL, ALT 60 U/L. ยาเดิม: amiodarone 200 mg OD (AF), omeprazole 40 mg OD (GERD), atorvastatin 40 mg OD. SCr 0.9 mg/dL",
    ref: "AASLD/IDSA HCV Guidance 2023; EASL Recommendations on Treatment of Hepatitis C 2020; Sofosbuvir/velpatasvir prescribing information; University of Liverpool HEP Drug Interactions",
    qs: [
      {
        p: "สูตร DAA ใดเหมาะสมที่สุดสำหรับผู้ป่วยรายนี้?",
        o: [
          "Peginterferon + ribavirin 48 สัปดาห์",
          "Sofosbuvir/velpatasvir 1 เม็ด OD × 12 สัปดาห์",
          "Sofosbuvir/velpatasvir 1 เม็ด OD × 24 สัปดาห์",
          "Ribavirin เดี่ยว 24 สัปดาห์",
          "Glecaprevir/pibrentasvir 3 เม็ด OD × 16 สัปดาห์",
        ],
        a: 1,
        r: "Treatment-naive ไม่มี cirrhosis → pangenotypic regimen: sofosbuvir/velpatasvir × 12 สัปดาห์ (หรือ glecaprevir/pibrentasvir × 8 สัปดาห์)",
        w: [
          "Interferon-based ไม่ใช้แล้ว (ผลต่ำ ADR มาก)",
          "ถูก",
          "นานเกินจำเป็น",
          "Ribavirin เดี่ยวไม่ได้ผล",
          "G/P ใน treatment-naive ไม่มี cirrhosis ใช้ 8 สัปดาห์ (16 สัปดาห์ใช้ในบางกลุ่มที่เคยรักษา)",
        ],
        k: "Pangenotypic DAA: SOF/VEL 12 wk หรือ G/P 8 wk (naive, ไม่มี/มี compensated cirrhosis)",
      },
      {
        p: "ปฏิกิริยาระหว่างยาใดอันตรายที่สุดและควรจัดการอย่างไร?",
        o: [
          "Sofosbuvir + atorvastatin — หยุด statin ถาวร",
          "Sofosbuvir + amiodarone — เสี่ยง symptomatic bradycardia รุนแรง ควรเปลี่ยน amiodarone เป็นยาอื่นก่อนเริ่ม DAA และเฝ้าระวังเพราะ amiodarone มี t½ ยาวมาก",
          "Velpatasvir + amiodarone — เพิ่มขนาด amiodarone",
          "Sofosbuvir + omeprazole — ห้ามใช้ร่วมเด็ดขาด",
          "ไม่มีปฏิกิริยาที่สำคัญ",
        ],
        a: 1,
        r: "Sofosbuvir-containing regimen + amiodarone มีรายงาน bradycardia รุนแรง/เสียชีวิต (ไม่แนะนำใช้ร่วม). Amiodarone t½ 40–55 วัน จึงอาจยังเกิดได้แม้หยุดยาแล้วไม่นาน → เลือกยาคุม AF อื่นและ monitor HR",
        w: [
          "Velpatasvir เพิ่มระดับ statin เล็กน้อย (rosuvastatin จำกัด ≤ 10 mg) แต่ atorvastatin ใช้ได้ด้วยการติดตาม",
          "ถูก",
          "ทิศทางผิดและอันตราย",
          "ปัญหาอยู่ที่ velpatasvir กับ acid suppression และจัดการได้ ไม่ใช่ห้ามเด็ดขาด",
          "มี DDI ที่อันตรายถึงชีวิต",
        ],
        k: "SOF + amiodarone = serious bradycardia; DAA ต้องทบทวน DDI ทุกครั้ง",
      },
      {
        p: "ผู้ป่วยยังต้องใช้ยาลดกรดสำหรับ GERD. ข้อใดเป็นการจัดการกับ omeprazole ที่เหมาะสมที่สุดระหว่างใช้ sofosbuvir/velpatasvir?",
        o: [
          "ให้ omeprazole 40 mg พร้อม SOF/VEL ตอนท้องว่าง",
          "เพิ่ม omeprazole เป็น 40 mg BID",
          "ลด omeprazole เป็น 20 mg และให้ SOF/VEL พร้อมอาหาร 4 ชั่วโมงก่อน omeprazole",
          "ให้ antacid พร้อม SOF/VEL",
          "ไม่ต้องปรับ เพราะไม่มีผลต่อ velpatasvir",
        ],
        a: 2,
        r: "Velpatasvir ละลายได้น้อยเมื่อ pH สูง → PPI ลดการดูดซึม. Label: ถ้าจำเป็นต้องใช้ PPI ให้ SOF/VEL พร้อมอาหาร 4 ชม. ก่อน omeprazole ขนาดไม่เกิน 20 mg (antacid เว้น 4 ชม.; H2RA ขนาด ≤ famotidine 40 mg BID)",
        w: [
          "ลดการดูดซึม velpatasvir → เสี่ยงล้มเหลว",
          "ยิ่งลดการดูดซึม",
          "ถูก",
          "ต้องเว้นห่างอย่างน้อย 4 ชั่วโมง",
          "มีผลจริงต่อการดูดซึม velpatasvir",
        ],
        k: "Velpatasvir/ledipasvir: ระวัง PPI/H2RA/antacid — pH-dependent absorption",
      },
      {
        p: "เนื่องจากผู้ป่วยมี HBsAg positive (HBV DNA 800 IU/mL) ข้อใดเหมาะสมที่สุดเมื่อเริ่ม DAA?",
        o: [
          "ไม่ต้องทำอะไร เพราะ HBV DNA ต่ำ",
          "เริ่ม lamivudine 100 mg OD",
          "เริ่ม entecavir 0.5 mg OD ป้องกัน HBV reactivation ตั้งแต่ก่อน/พร้อม DAA จนถึงอย่างน้อย 12 สัปดาห์หลังจบ DAA",
          "เลื่อนการรักษา HCV จนกว่า HBV DNA จะตรวจไม่พบ",
          "เพิ่ม peginterferon เพื่อรักษาทั้ง HBV และ HCV",
        ],
        a: 2,
        r: "DAA กำจัด HCV อย่างรวดเร็วซึ่งเคยกด HBV อยู่ → เสี่ยง HBV reactivation/hepatitis รุนแรง. HBsAg+ ที่ยังไม่เข้าเกณฑ์รักษา HBV ควรให้ nucleos(t)ide analogue ป้องกัน (หรืออย่างน้อยติดตาม HBV DNA ทุก 4 สัปดาห์) จนถึง 12 สัปดาห์หลังจบ DAA",
        w: [
          "มีรายงาน HBV reactivation รุนแรง/ตับวาย",
          "Lamivudine มี resistance barrier ต่ำ",
          "ถูก",
          "ไม่จำเป็นต้องเลื่อน ให้ prophylaxis ร่วมได้",
          "Interferon ไม่ใช้แล้วและไม่จำเป็น",
        ],
        k: "HBsAg+ ก่อน DAA → NA prophylaxis (entecavir/tenofovir) หรือ monitor HBV DNA; anti-HBc+ อย่างเดียว → monitor ALT",
      },
      {
        p: "เกณฑ์ใดใช้ยืนยันว่าผู้ป่วยหายจาก HCV (cure)?",
        o: [
          "Anti-HCV กลายเป็นลบ",
          "HCV RNA ตรวจไม่พบเมื่อสิ้นสุดการรักษาเท่านั้น",
          "ALT กลับมาปกติ",
          "HCV RNA ตรวจไม่พบที่ 12 สัปดาห์หลังหยุดยา (SVR12)",
          "ตรวจ genotype ซ้ำแล้วไม่พบ",
        ],
        a: 3,
        r: "Sustained virologic response ที่ 12 สัปดาห์หลังจบการรักษา (SVR12) = virologic cure. Anti-HCV ยังคงบวกตลอดชีวิตและไม่ป้องกันการติดเชื้อซ้ำ",
        w: [
          "Anti-HCV ยังบวกหลังหาย",
          "End-of-treatment response ยังอาจ relapse ได้",
          "ALT ไม่จำเพาะ",
          "ถูก",
          "ไม่ใช่เกณฑ์การหาย",
        ],
        k: "HCV cure = SVR12; ผู้ที่มี cirrhosis ยังต้องเฝ้าระวัง HCC ต่อ",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–24, ข้อ 1–117) → Case 25–26, ข้อ 118–127
export const PC1_DAY07: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d07q",
  caseOffset: 24,
  qOffset: 117,
  posShift: 7,
  createdAt: "2026-09-29 09:00:00",
});
