import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 3 of 30 (10 questions/day plan)
// Topic focus: sterile manufacturing / aseptic processing validation
// (terminal sterilization cycle design, endotoxin limit calculation,
// sterilizing filter validation, media fill acceptance criteria,
// lyophilization, isolator/RABS, personnel monitoring, statistical
// detection limits, Blow-Fill-Seal).
// Distinct from IP1_PILOT_050 (lib/ip1-pilot-050.ts), Day 1
// (lib/ip1-set2-day01.ts, cleanroom/HVAC/GMP Grade classification) and
// Day 2 (lib/ip1-set2-day02.ts, impurity/cleaning/elemental/scale-up) —
// cross-checked against all three to avoid repeating a tested concept:
//   - existing bank has "Sterilization" (choosing terminal vs aseptic method)
//     and "Aseptic process simulation" (obligation to investigate a media-fill
//     contamination even if finished-product sterility tests passed) — both
//     conceptual/qualitative. Q1 here is a genuine F0/bioburden-based cycle
//     *calculation*, and Q4 here applies numeric media-fill acceptance
//     thresholds to a scenario — different skills from either existing item.
//   - existing bank has "Bacterial endotoxin" (identifying BET/LAL as the
//     correct test) and "Endotoxin control" (concept: killing bacteria doesn't
//     remove existing endotoxin) — neither computes an Endotoxin Limit or MVD.
//     Q2 here is a genuine EL/MVD *calculation* (USP <161>/<85> K/M formula).
//   - existing bank has "Sterile filtration" (pore-size selection, 0.2 µm) and
//     "Depyrogenation" (dry-heat tunnel purpose) — neither computes a filter
//     validation Log Reduction Value. Q3 here is a genuine LRV *calculation*.
//   - existing bank has "Lyophilization" (primary drying purpose only). Q5
//     here targets secondary drying (a different phase, different purpose and
//     consequence).
//   - Isolator vs RABS (Q6), personnel gowning/glove-print action limits (Q7),
//     Poisson-based statistical detection probability of environmental
//     monitoring (Q8), Blow-Fill-Seal technology (Q9), and media-fill
//     worst-case protocol design (Q10) do not appear anywhere in the existing
//     150-question bank or in Days 1–2.
//   - Day 1 already covers cleanroom/HVAC/airflow/pressure-cascade/HEPA/ACH in
//     depth, so Day 3 deliberately avoids that ground and stays on
//     sterilization/aseptic-process-validation topics instead.
// Original items; not copied from any past exam. Editorial verification
// recommended before high-stakes commercial use.

type Difficulty = "medium" | "hard";
type Draft = {
  topic: string;
  prompt: string;
  options: [string, string, string, string, string]; // correct answer first
  rationale: string;
  traps: [string, string, string, string];
  difficulty: Difficulty;
  ref: string;
  calc?: string[];
};

const labels = ["ก", "ข", "ค", "ง", "จ"] as const;

// Balanced across 10 items: each label appears exactly twice.
const answerPositions = [2, 0, 4, 1, 3, 3, 1, 4, 0, 2];

const D: Draft[] = [
  {
    topic: "Terminal sterilization — bioburden-based F0 vs overkill approach calculation",
    prompt:
      "ผลิตภัณฑ์ยาฉีดชนิดหนึ่งมีข้อมูลดังนี้: bioburden ที่ตรวจสอบเป็นประจำ (routine bioburden monitoring) = 1,000 CFU/container, D121 ของเชื้อดื้อความร้อนที่สุดที่พบ = 0.5 นาที, เป้าหมาย Sterility Assurance Level (SAL) = 10⁻⁶ ทีมงาน validate cycle การฆ่าเชื้อด้วยไอน้ำร้อน (moist heat) และวัด F0 ที่จุดเย็นที่สุดของ load ได้จริง = 6.0 นาที (จากข้อมูล biological indicator และ thermocouple)\n\nจงคำนวณ F0 ขั้นต่ำที่ต้องการตามแนวทาง bioburden-based cycle design และสรุปว่า cycle นี้ผ่านเกณฑ์หรือไม่",
    options: [
      "ผ่านเกณฑ์ เพราะ F0 ที่วัดได้จริง (6.0 นาที) มากกว่า F0 ขั้นต่ำที่ต้องการตามวิธี bioburden-based (4.5 นาที) แม้จะต่ำกว่าค่าอ้างอิงแบบ overkill (F0≥12 นาที) ก็ตาม เนื่องจากมีข้อมูล bioburden และ D-value สนับสนุนอย่างเพียงพอ",
      "ไม่ผ่านเกณฑ์ เพราะทุก cycle ต้องมี F0 อย่างน้อย 12 นาทีเสมอ ไม่ว่าจะมีข้อมูล bioburden สนับสนุนหรือไม่",
      "ไม่ผ่านเกณฑ์ เพราะ F0 ขั้นต่ำที่ต้องการคือ 9 นาที (ใช้ค่า log reduction ที่คำนวณได้ไปตรงๆ โดยไม่คูณด้วยค่า D-value)",
      "ผ่านเกณฑ์ เพราะ F0 ขั้นต่ำที่ต้องการมีเพียง 0.5 นาที (ใช้ค่า D-value ตรงๆ โดยไม่คูณด้วยจำนวน log reduction ที่ต้องการ)",
      "ไม่สามารถสรุปได้เลยหากไม่ทราบค่า z-value ของกระบวนการฆ่าเชื้อ",
    ],
    rationale:
      "แนวทาง bioburden-based cycle design คำนวณ F0 ขั้นต่ำที่ต้องการจาก F0(required) = D-value ของเชื้อดื้อความร้อนที่สุด × log10(bioburden/SAL) แทนที่จะยึดค่าอ้างอิงแบบ overkill (F0≥12 นาที) ตายตัว หากมีข้อมูล bioburden ที่ผ่านการตรวจสอบสม่ำเสมอและทราบ D-value ของเชื้อดื้อความร้อนที่สุดอย่างน่าเชื่อถือ การ validate cycle ด้วย F0 ที่ต่ำกว่า 12 นาทีจึงเป็นที่ยอมรับได้ทางวิทยาศาสตร์ ตราบใดที่ยังบรรลุ SAL เป้าหมาย ในที่นี้ F0(required) = 0.5×log10(1,000/10⁻⁶) = 0.5×9 = 4.5 นาที ซึ่งน้อยกว่า F0 ที่วัดได้จริง (6.0 นาที) จึงผ่านเกณฑ์",
    traps: [
      "ผิด — F0≥12 นาทีเป็นค่าอ้างอิงของแนวทาง overkill approach เท่านั้น ไม่ใช่ข้อกำหนดตายตัวสำหรับทุก cycle หากมีข้อมูล bioburden-based ที่ validate ได้อย่างเหมาะสม สามารถใช้ F0 ที่ต่ำกว่านี้ได้",
      "ผิด — ค่า log reduction ที่ต้องการ (9 log) ยังไม่ใช่ค่า F0 โดยตรง ต้องคูณด้วย D-value ของเชื้อ (0.5 นาที) ก่อนจึงจะได้ F0(required)=4.5 นาที",
      "ผิด — D-value เพียงอย่างเดียวคือเวลาที่ลดจำนวนเชื้อลง 1 log เท่านั้น ต้องคูณด้วยจำนวน log reduction ทั้งหมดที่ต้องการ (9 log) จึงจะได้ F0 ที่ต้องการทั้งหมด",
      "ผิด — สูตร F0(required)=D×log10(N0/SAL) ที่ใช้ในที่นี้ไม่จำเป็นต้องทราบค่า z-value เพิ่มเติม (z-value จำเป็นเมื่อต้องคำนวณ F0 จริงจาก temperature-time profile ที่ไม่ใช่อุณหภูมิคงที่ ซึ่งในโจทย์นี้ให้ F0 ที่วัดได้จริงมาโดยตรงแล้ว)",
    ],
    difficulty: "hard",
    ref: "Moist-heat terminal sterilization — bioburden-based cycle design vs overkill approach (PDA TR1; USP <1211>)",
    calc: [
      "Log reduction ที่ต้องการ = log10(N0/SAL) = log10(1,000/10⁻⁶) = log10(10⁹) = 9",
      "F0(required) = D121 × log reduction = 0.5 นาที × 9 = 4.5 นาที",
      "F0 ที่วัดได้จริงจาก cycle = 6.0 นาที ≥ 4.5 นาที (ที่ต้องการ) → ผ่านเกณฑ์ แม้จะต่ำกว่า F0≥12 นาทีของแนวทาง overkill",
    ],
  },
  {
    topic: "Bacterial endotoxin — Endotoxin Limit & Maximum Valid Dilution (MVD) calculation",
    prompt:
      "ยาฉีดชนิดหนึ่งให้ทางหลอดเลือดดำ (IV) มีข้อมูล: Threshold pyrogenic dose (K) = 5 EU/kg/hr (สำหรับยาที่ไม่ใช่ intrathecal), Maximum human dose (M) = 10 mg/kg/hr, ความเข้มข้นของสารละลายที่ label strength = 20 mg/mL, ความไวของ lysate reagent (λ) = 0.25 EU/mL\n\nห้องปฏิบัติการทดสอบตัวอย่างที่ dilution 1:50 ด้วยวิธี gel-clot แล้วรายงานผล negative จงคำนวณ Endotoxin Limit (EL) และ Maximum Valid Dilution (MVD) แล้วสรุปว่าผลการทดสอบนี้ใช้อ้างอิงเพื่อสรุปว่าผ่านเกณฑ์ได้หรือไม่",
    options: [
      "EL = 0.5 EU/mg, MVD = 40 — ผลทดสอบที่ dilution 1:50 เกิน MVD จึงไม่สามารถใช้อ้างอิงเพื่อสรุปว่าผ่านเกณฑ์ได้ ต้องทดสอบซ้ำที่ dilution ไม่เกิน 1:40",
      "EL = 0.5 EU/mg, MVD = 40 — ผลทดสอบที่ dilution 1:50 ยังใช้ได้เพราะเป็นผล negative ซึ่งยิ่งเจือจางมากยิ่งน่าเชื่อถือมากขึ้น",
      "EL = 2 EU/mg (สลับ K กับ M ในสูตร), MVD = 160 — ผลทดสอบผ่านเกณฑ์เพราะ dilution 1:50 ยังต่ำกว่า MVD",
      "EL = 0.5 EU/mg, MVD = 10 (ลืมคูณ EL ด้วยความเข้มข้นก่อนหารด้วย λ) — ผลทดสอบที่ dilution 1:50 เกิน MVD และไม่ผ่านเกณฑ์ทันที",
      "ไม่สามารถคำนวณ EL ได้หากไม่ทราบ molecular weight ของสารออกฤทธิ์",
    ],
    rationale:
      "EL = K/M = 5÷10 = 0.5 EU/mg. MVD = (EL×ความเข้มข้น)/λ = (0.5×20)/0.25 = 40 การทดสอบ endotoxin ที่ dilution เกินกว่า MVD จะทำให้ sensitivity ของวิธีไม่เพียงพอต่อการตรวจจับ endotoxin ที่ระดับ EL ได้อย่างน่าเชื่อถือ (over-dilution เพิ่มความเสี่ยงเกิด false negative) ผล negative ที่ dilution 1:50 (เกิน MVD=40) จึงไม่สามารถใช้เป็นหลักฐานสรุปว่าผลิตภัณฑ์ผ่านเกณฑ์ endotoxin ได้ ต้องทดสอบซ้ำที่ dilution ไม่เกิน MVD",
    traps: [
      "ผิด — MVD คือขีดจำกัดบนของการเจือจางที่ยังให้ sensitivity เพียงพอสำหรับตรวจจับ endotoxin ที่ EL การเจือจางเกิน MVD ทำให้ความไวไม่เพียงพอ ผล negative ที่ได้จึงไม่มีความหมายเชิงสรุป ไม่ใช่ยิ่งเจือจางยิ่งน่าเชื่อถือ",
      "ผิด — สูตรที่ถูกต้องคือ EL=K/M ไม่ใช่ M/K การสลับตัวแปรทำให้ค่า EL และ MVD ผิดพลาดไปจากความเป็นจริง",
      "ผิด — MVD ต้องคำนวณจาก (EL×ความเข้มข้น)/λ ครบทุกตัวแปร การลืมคูณด้วยความเข้มข้นทำให้ MVD ต่ำกว่าความเป็นจริง",
      "ผิด — การคำนวณ EL และ MVD ตามสูตรมาตรฐาน (USP <161>/<85>) ไม่จำเป็นต้องทราบ molecular weight ของสารออกฤทธิ์ เพียงใช้ K, M, ความเข้มข้น และ λ ตามที่กำหนด",
    ],
    difficulty: "hard",
    ref: "USP <161>/<85> — Bacterial Endotoxins Test: Endotoxin Limit and Maximum Valid Dilution",
    calc: [
      "EL = K/M = 5 EU/kg/hr ÷ 10 mg/kg/hr = 0.5 EU/mg",
      "MVD = (EL × concentration)/λ = (0.5 EU/mg × 20 mg/mL) / 0.25 EU/mL = 10/0.25 = 40",
      "Dilution ที่ทดสอบจริง (1:50) > MVD (40) → ผลทดสอบไม่สามารถใช้อ้างอิงสรุปผ่านเกณฑ์ได้ ต้องทดสอบซ้ำที่ dilution ≤ 40",
    ],
  },
  {
    topic: "Sterilizing-grade filter validation — bacterial retention (LRV) calculation",
    prompt:
      "การ validate sterilizing-grade filter (0.2 µm) ด้วย bacterial challenge test ตามแนวทาง ASTM F838/PDA TR26 ใช้เชื้อ Brevundimonas diminuta โดยกำหนดความหนาแน่นของเชื้อท้าทายขั้นต่ำ = 1×10⁷ CFU/cm² ของพื้นที่กรองที่ใช้งานจริง (effective filtration area, EFA) filter ที่ทดสอบมี EFA = 500 cm² ทีมงานใช้เชื้อท้าทายรวม 5×10⁹ CFU (ตรงตามข้อกำหนดขั้นต่ำพอดี) หลังกรองแล้วนำ filtrate ทั้งหมดไปเพาะเลี้ยงตรวจนับ พบเชื้อรอดผ่าน filtrate รวม 5 CFU จงคำนวณ Log Reduction Value (LRV) ที่แสดงให้เห็น และสรุปว่า filter นี้ผ่านเกณฑ์ bacterial retention validation ขั้นต่ำ (LRV ≥ 7) หรือไม่",
    options: [
      "LRV = 9 (log10(5×10⁹/5)) ซึ่งมากกว่าเกณฑ์ขั้นต่ำ LRV≥7 มาก จึงผ่านเกณฑ์ bacterial retention validation",
      "LRV = 9.7 (log10 ของเชื้อท้าทายทั้งหมดโดยไม่หักลบเชื้อที่รอดออกจาก filtrate) ผ่านเกณฑ์เช่นกัน",
      "Filter นี้ไม่ผ่านเกณฑ์โดยอัตโนมัติ เพราะพบเชื้อหลุดรอดใน filtrate แม้เพียง 5 CFU ก็ถือว่า filter ไม่สามารถกรองเชื้อได้สมบูรณ์",
      "LRV = 7 (นำจำนวนเชื้อท้าทายหารด้วยพื้นที่ EFA โดยตรงแล้วหา log10 โดยไม่เกี่ยวกับจำนวนเชื้อที่รอดใน filtrate)",
      "ไม่สามารถสรุปผลได้ เพราะต้องทราบค่า bubble point ของ filter ก่อนจึงจะประเมิน bacterial retention ได้",
    ],
    rationale:
      "LRV = log10(จำนวนเชื้อท้าทายทั้งหมด ÷ จำนวนเชื้อที่รอดผ่าน filtrate) = log10(5×10⁹/5) = log10(10⁹) = 9 ซึ่งมากกว่าเกณฑ์ขั้นต่ำที่ยอมรับสำหรับ sterilizing-grade filter validation (LRV≥7 ตาม PDA TR26) จึงถือว่า filter ผ่านเกณฑ์ bacterial retention validation ในการทดสอบ challenge study นี้",
    traps: [
      "ผิด — การคำนวณ LRV ต้องหารด้วยจำนวนเชื้อที่รอดผ่าน filtrate จริง (5 CFU) ไม่ใช่ใช้จำนวนเชื้อท้าทายทั้งหมดเพียงอย่างเดียวโดยไม่หักลบ ซึ่งจะให้ค่าที่คลาดเคลื่อนจากนิยามจริงของ LRV",
      "ผิด — การพบเชื้อหลุดรอดจำนวนเล็กน้อยใน validation challenge study ไม่ได้แปลว่า filter fail โดยอัตโนมัติ เกณฑ์การผ่าน/ไม่ผ่านพิจารณาจากค่า LRV ที่คำนวณได้เทียบกับเกณฑ์ขั้นต่ำ (≥7) ไม่ใช่การมี/ไม่มีเชื้อหลุดรอดเพียงอย่างเดียว",
      "ผิด — LRV คำนวณจากอัตราส่วนจำนวนเชื้อท้าทายต่อจำนวนเชื้อที่รอดผ่าน filtrate ไม่เกี่ยวข้องกับพื้นที่ EFA โดยตรงในขั้นตอนนี้ (EFA ใช้กำหนดจำนวนเชื้อท้าทายขั้นต่ำที่ต้องใช้เท่านั้น)",
      "ผิด — Bubble point test เป็น physical integrity test ประจำ batch ที่ใช้ยืนยันความสมบูรณ์ของ filter หลังการติดตั้ง/ใช้งาน แต่เป็นคนละการทดสอบกับ bacterial challenge test สำหรับ validate bacterial retention performance ของ filter ชนิดนั้นๆ",
    ],
    difficulty: "hard",
    ref: "ASTM F838; PDA Technical Report No. 26 — Sterilizing Filtration of Liquids",
    calc: [
      "จำนวนเชื้อท้าทายขั้นต่ำที่ต้องใช้ = ความหนาแน่นขั้นต่ำ × EFA = 1×10⁷ CFU/cm² × 500 cm² = 5×10⁹ CFU",
      "LRV = log10(เชื้อท้าทายทั้งหมด ÷ เชื้อที่รอดใน filtrate) = log10(5×10⁹ ÷ 5) = log10(1×10⁹) = 9",
      "9 ≥ 7 (เกณฑ์ขั้นต่ำ) → filter ผ่านเกณฑ์ bacterial retention validation",
    ],
  },
  {
    topic: "Aseptic process simulation (media fill) — numeric contamination-rate acceptance criteria",
    prompt:
      "โรงงานผลิตยาฉีดปราศจากเชื้อทำการทดสอบ aseptic process simulation (media fill) ด้วยขนาด batch จำลอง 3,000 หน่วย (representative ของ batch size จริงที่ผลิตในสายการผลิตนี้ ซึ่งอยู่ในกลุ่ม <5,000 หน่วย) หลังบ่มเพาะครบระยะเวลาที่กำหนด พบ 1 หน่วยแสดงความขุ่น (turbidity) บ่งชี้การปนเปื้อน ข้อใดคือการดำเนินการที่ถูกต้องที่สุดตามหลักเกณฑ์ numeric acceptance criteria สำหรับ media fill ขนาด batch กลุ่มนี้",
    options: [
      "ถือว่า media fill run นี้ไม่ผ่านเกณฑ์ (fail) ต้องดำเนินการสืบสวนหาสาเหตุอย่างละเอียด (บุคลากร สภาพแวดล้อม เครื่องจักร) ประเมินผลกระทบต่อ batch การผลิตจริงที่เกี่ยวข้อง และต้องทำ media fill ซ้ำจนผ่านเกณฑ์ก่อนจึงจะอนุญาตให้สายการผลิตนี้กลับมาผลิตต่อได้",
      "ยอมรับผลได้ เพราะอัตราการปนเปื้อน 1 ใน 3,000 หน่วย (0.033%) ยังต่ำกว่าเกณฑ์ action limit ทั่วไปที่ 0.1% ซึ่งใช้กับระบบ environmental monitoring",
      "ยังไม่ต้องดำเนินการใดๆ เพิ่มเติม เนื่องจาก batch size นี้ (<5,000 หน่วย) ได้รับการยกเว้นจากการพิจารณาหน่วยปนเปื้อนเดี่ยว",
      "เพียงนำหน่วยที่ปนเปื้อนไปยืนยันชนิดเชื้อ (identification) ซ้ำอีกครั้ง หากยืนยันไม่พบเชื้อในการทดสอบซ้ำ ให้ถือว่า media fill run นี้ผ่านเกณฑ์ทันทีโดยไม่ต้องสืบสวนเพิ่มเติม",
      "เพิ่มความถี่ของ environmental monitoring ในรอบถัดไปแทนการสืบสวนและทำ media fill ซ้ำในทันที",
    ],
    rationale:
      "สำหรับ aseptic process simulation เป้าหมายคือ zero growth โดยเฉพาะในกลุ่ม batch size เล็ก (<5,000 หน่วย) การพบแม้เพียง 1 หน่วยปนเปื้อนถือเป็นสัญญาณที่ต้องดำเนินการสืบสวนอย่างเต็มรูปแบบ (root cause investigation ครอบคลุมบุคลากร สภาพแวดล้อม เครื่องจักร และกระบวนการ) ประเมินผลกระทบต่อ batch การผลิตจริงในช่วงเวลาที่เกี่ยวข้อง และต้องทำการทดสอบซ้ำจนผ่านเกณฑ์ก่อนที่สายการผลิตจะกลับมาดำเนินการผลิตเชิงพาณิชย์ได้อีกครั้ง เกณฑ์ตัวเลขของ media fill (zero-tolerance สำหรับ batch ขนาดเล็ก) แตกต่างจากเกณฑ์ percentage action limit ที่ใช้ในระบบ environmental monitoring จึงไม่สามารถนำมาเทียบเคียงกันได้",
    traps: [
      "ผิด — Media fill ใช้เกณฑ์ zero-tolerance (เป้าหมาย 0 หน่วยปนเปื้อน) ไม่ใช่เกณฑ์ percentage action limit แบบ environmental monitoring การเปรียบเทียบอัตราร้อยละจึงไม่ใช่หลักเกณฑ์ที่ถูกต้องสำหรับ media fill",
      "ผิด — ไม่มีการยกเว้นสำหรับ batch ขนาดเล็ก ในทางตรงกันข้าม batch ขนาดเล็กมักถูกคาดหวังเกณฑ์ zero-growth ที่เข้มงวดกว่า",
      "ผิด — การยืนยันชนิดเชื้อ (identification) เป็นส่วนหนึ่งของการสืบสวนเพื่อช่วยวินิจฉัยแหล่งที่มา แต่ไม่ได้ทดแทนความจำเป็นในการสืบสวนสาเหตุที่ครอบคลุมหรือการทำ media fill ซ้ำ",
      "ผิด — การเพิ่มความถี่ environmental monitoring เพียงอย่างเดียวไม่เพียงพอต่อการตอบสนองต่อความล้มเหลวของ media fill ซึ่งบ่งชี้ปัญหาที่อาจกระทบต่อ sterility assurance ของกระบวนการผลิตจริงโดยตรง",
    ],
    difficulty: "medium",
    ref: "FDA Guidance for Industry — Sterile Drug Products Produced by Aseptic Processing (2004); EU/PIC/S GMP Annex 1 — media fill acceptance criteria",
  },
  {
    topic: "Lyophilization — secondary drying purpose and consequence of premature termination",
    prompt:
      "ในกระบวนการ freeze-drying หลังจาก primary drying เสร็จสิ้น (น้ำแข็งถูกกำจัดออกโดย sublimation ทั้งหมดแล้ว) ขั้นตอน secondary drying มีวัตถุประสงค์หลักใด และหากยุติขั้นตอนนี้ก่อนเวลาที่เหมาะสมจะเกิดผลอย่างไร",
    options: [
      "วัตถุประสงค์หลักคือกำจัด bound/unfrozen water ที่เหลืออยู่ด้วยกระบวนการ desorption โดยเพิ่มอุณหภูมิ shelf ขึ้นอย่างควบคุม หากยุติก่อนเวลาที่เหมาะสมจะทำให้ residual moisture สูงเกินเกณฑ์ ส่งผลต่อ long-term stability ของผลิตภัณฑ์ระหว่างการเก็บรักษา",
      "วัตถุประสงค์หลักคือกำจัดน้ำแข็งที่เหลือด้วย sublimation เช่นเดียวกับ primary drying เพียงแต่ใช้อุณหภูมิที่ต่ำกว่า",
      "วัตถุประสงค์หลักคือเพิ่ม chamber pressure เพื่อเร่งอัตราการระเหิดของน้ำแข็งที่เหลือ",
      "การยุติ secondary drying ก่อนเวลาไม่มีผลกระทบต่อ long-term stability เพราะน้ำที่เหลืออยู่ในรูป bound water ไม่ทำปฏิกิริยากับผลิตภัณฑ์",
      "การยุติ secondary drying ก่อนเวลาจะทำให้เกิด cake collapse ทันทีในระหว่างกระบวนการอบแห้ง",
    ],
    rationale:
      "Secondary drying เกิดขึ้นหลังจาก sublimation ของน้ำแข็งอิสระเสร็จสมบูรณ์แล้วใน primary drying โดยมีเป้าหมายกำจัด bound/unfrozen water ที่ยังคงเหลืออยู่ในโครงสร้าง solid matrix ผ่านกระบวนการ desorption ซึ่งต้องค่อยๆ เพิ่มอุณหภูมิ shelf ขึ้นอย่างควบคุม หากยุติขั้นตอนนี้ก่อนเวลาที่เหมาะสม residual moisture ที่เหลือสูงเกินไปจะเร่งปฏิกิริยาการเสื่อมสภาพระหว่างการเก็บรักษาในระยะยาว แม้จะไม่ทำให้เกิด cake collapse ทันทีขณะอบแห้ง (ซึ่งเป็นความเสี่ยงที่เกี่ยวข้องกับการควบคุมอุณหภูมิเกิน critical collapse temperature ใน primary drying มากกว่า)",
    traps: [
      "ผิด — การกำจัดน้ำแข็งด้วย sublimation เป็นบทบาทหลักของ primary drying ไม่ใช่ secondary drying ซึ่งเน้นกำจัด bound water ที่ไม่ได้อยู่ในรูปน้ำแข็งแล้ว",
      "ผิด — Secondary drying ไม่ได้เพิ่ม chamber pressure เพื่อเร่งการระเหิด แต่ใช้การเพิ่มอุณหภูมิอย่างควบคุมเพื่อเร่ง desorption ของ bound water",
      "ผิด — Residual moisture ที่สูงเกินเกณฑ์ส่งผลโดยตรงต่อ chemical/physical stability ของผลิตภัณฑ์ระหว่างการเก็บรักษาในระยะยาว ไม่ใช่ปัจจัยที่ไม่มีผลกระทบ",
      "ผิด — Cake collapse ที่เกิดขึ้นทันทีระหว่างกระบวนการอบแห้งมักสัมพันธ์กับการควบคุม product temperature เกิน critical collapse/eutectic temperature ในขั้น primary drying มากกว่าการยุติ secondary drying ก่อนเวลา ซึ่งผลกระทบหลักคือปัญหา stability ระยะยาวมากกว่า",
    ],
    difficulty: "medium",
    ref: "Aulton's Pharmaceutics; Freeze-drying process principles — primary vs secondary drying",
  },
  {
    topic: "Isolator vs RABS — sterility assurance basis and VHP decontamination validation",
    prompt:
      "การเปรียบเทียบระบบ closed isolator (ใช้ automated Vapor-phase Hydrogen Peroxide (VHP) decontamination cycle ที่ validate ได้ log reduction ≥6-log ของ Geobacillus stearothermophilus spore biological indicator) กับระบบ open RABS (Restricted Access Barrier System ที่อาศัยการจัดชั้นความสะอาดของห้อง ISO 5/Grade A โดยรอบร่วมกับการทำความสะอาดฆ่าเชื้อด้วยมือ) ข้อใดอธิบายความแตกต่างของพื้นฐาน sterility assurance ระหว่างสองระบบนี้ได้ถูกต้องที่สุด",
    options: [
      "Sterility assurance ภายใน isolator มาจากกระบวนการ VHP decontamination อัตโนมัติที่ validate แล้วเป็นหลัก ร่วมกับการแยกตัวผู้ปฏิบัติงานออกจากพื้นที่ทำงานอย่างสมบูรณ์ ในขณะที่ RABS อาศัยการจัดชั้นความสะอาดของห้องโดยรอบและการทำความสะอาดด้วยมืออย่างเข้มงวดเป็นหลัก โดยทั่วไปไม่มีกระบวนการ automated bio-decontamination ที่ validate log-reduction แบบเดียวกับ isolator",
      "RABS ทุกระบบมีกระบวนการ VHP decontamination อัตโนมัติที่ให้ผล log-reduction เทียบเท่า isolator เสมอ เพราะใช้หลักการ barrier เดียวกัน",
      "Sterility assurance ของ isolator ขึ้นอยู่กับการจัดชั้นความสะอาดของห้องโดยรอบเป็นหลัก เช่นเดียวกับ RABS",
      "การ validate VHP cycle ที่ระบุ log reduction ≥6-log หมายความว่าต้องตรวจพบ spore ที่รอดชีวิตจาก biological indicator ในปริมาณที่ลดลง 6 เท่าจากเดิม",
      "ไม่มีความแตกต่างที่มีนัยสำคัญด้าน sterility assurance ระหว่าง isolator และ RABS เพราะทั้งสองระบบถูกออกแบบมาเพื่อวัตถุประสงค์เดียวกัน",
    ],
    rationale:
      "จุดเด่นสำคัญของ isolator คือการมีกระบวนการ automated bio-decontamination (เช่น VHP) ที่ validate ได้อย่างเป็นระบบด้วยหลักการเดียวกับการฆ่าเชื้อ (biological indicator challenge, log-reduction ≥6-log) ทำให้ sterility assurance ของพื้นที่ภายใน isolator ไม่ขึ้นอยู่กับสภาพห้องโดยรอบมากนัก ต่างจาก RABS ที่แม้จะมี physical barrier แต่โดยทั่วไปยังอาศัยการจัดชั้นความสะอาดของห้อง ISO 5/Grade A โดยรอบ HEPA filtration และการทำความสะอาดฆ่าเชื้อด้วยมือเป็นหลัก จึงมีความเสี่ยงจากปัจจัยมนุษย์และสภาพแวดล้อมมากกว่า isolator ในเชิงทฤษฎี",
    traps: [
      "ผิด — ไม่ใช่ RABS ทุกระบบที่มีกระบวนการ automated VHP decontamination การมีระบบนี้เป็นคุณสมบัติเด่นที่แยก isolator ออกจาก RABS ทั่วไป",
      "ผิด — เป็นการอธิบายสลับกัน RABS ต่างหากที่พึ่งพาการจัดชั้นความสะอาดของห้องโดยรอบเป็นหลัก ในขณะที่ isolator ได้รับ sterility assurance หลักจากกระบวนการ VHP decontamination ของตัวเอง",
      "ผิด — Log reduction ≥6-log หมายถึงจำนวน spore ที่รอดชีวิตลดลง 10⁶ เท่า (แทบไม่มี spore รอดชีวิตเลย) ไม่ใช่ลดลงเพียง 6 เท่า",
      "ผิด — ทั้งสองระบบมีความแตกต่างที่มีนัยสำคัญด้านพื้นฐานของ sterility assurance ตามที่อธิบายไว้ ซึ่งส่งผลต่อการเลือกใช้และระดับความเสี่ยงที่ยอมรับได้ในแต่ละสถานการณ์การผลิต",
    ],
    difficulty: "hard",
    ref: "PIC/S/EU GMP Annex 1 (2022) — Isolators and RABS in aseptic processing",
  },
  {
    topic: "Personnel gowning qualification and glove-print monitoring action limits",
    prompt:
      "ระหว่างการผลิตในพื้นที่ Grade A (aseptic filling) ผล glove-print monitoring ของผู้ปฏิบัติงานคนหนึ่งหลังเสร็จสิ้นกะการทำงานพบ 2 CFU (ในขณะที่เกณฑ์ action limit ของ Grade A/B สำหรับ glove print ตาม GMP คือไม่ควรพบการเจริญเติบโตเลย) ข้อใดคือการดำเนินการที่เหมาะสมที่สุด",
    options: [
      "ถือว่าเกิน action limit ของ Grade A ต้องสืบสวนหาสาเหตุ ประเมินผลกระทบที่อาจเกิดกับ batch การผลิตในช่วงเวลาที่เกี่ยวข้อง และพิจารณาให้ผู้ปฏิบัติงานเข้ารับการฝึกอบรม/requalify กระบวนการแต่งกายและเทคนิคปลอดเชื้อใหม่ก่อนกลับเข้าปฏิบัติงานใน Grade A อีกครั้ง",
      "ยอมรับได้ เพราะ 2 CFU ยังต่ำกว่า action limit ที่ใช้กับพื้นที่ Grade B/C/D ซึ่งอนุญาตให้พบเชื้อได้ในระดับหนึ่ง",
      "ไม่ต้องดำเนินการใดๆ เพิ่มเติมในทันที เนื่องจาก requalification บุคลากรมีกำหนดตรวจสอบเป็นประจำทุกปีอยู่แล้ว",
      "เนื่องจากเป็นเพียงผลการตรวจติดตามสภาพแวดล้อม (environmental monitoring) ไม่ใช่การทดสอบผลิตภัณฑ์โดยตรง จึงไม่จำเป็นต้องประเมินผลกระทบต่อ batch การผลิต",
      "เพิ่มความถี่การทำ glove-print monitoring ในกะถัดไปแทนการสืบสวนเหตุการณ์ที่เกิดขึ้นแล้ว",
    ],
    rationale:
      "เกณฑ์ action limit ของ glove-print/gown-plate monitoring ในพื้นที่ Grade A (และโดยทั่วไปรวมถึง Grade B) ตาม GMP คือไม่ควรพบการเจริญเติบโตของจุลชีพเลย ซึ่งเข้มงวดกว่าเกณฑ์ตัวเลขที่ใช้กับพื้นที่ Grade C/D การพบ 2 CFU จึงถือว่าเกิน action limit และเป็นสัญญาณที่ต้องดำเนินการสืบสวนทันที ทั้งในแง่สาเหตุและผลกระทบที่อาจเกิดกับผลิตภัณฑ์ที่ผลิตในช่วงเวลาที่เกี่ยวข้อง ก่อนที่จะอนุญาตให้ผู้ปฏิบัติงานกลับเข้าทำงานในพื้นที่ Grade A ได้อีกครั้ง",
    traps: [
      "ผิด — เกณฑ์ action limit ของ Grade A/B สำหรับ glove print เข้มงวดกว่า Grade C/D มาก (โดยทั่วไปคือ no growth) จึงไม่สามารถนำเกณฑ์ตัวเลขของ Grade B/C/D มาเทียบเคียงกับผลที่พบใน Grade A ได้",
      "ผิด — เหตุการณ์ที่เกินเกณฑ์ action limit ต้องได้รับการตอบสนองทันที ไม่สามารถรอถึงรอบ requalification ประจำปีตามกำหนดการปกติได้",
      "ผิด — แม้ glove-print เป็นการตรวจติดตามสภาพแวดล้อม/บุคลากร แต่ผลที่เกินเกณฑ์บ่งชี้ความเสี่ยงต่อ sterility assurance ของผลิตภัณฑ์ที่กำลังผลิตในช่วงเวลานั้น จึงต้องประเมินผลกระทบต่อ batch โดยตรง",
      "ผิด — การเพิ่มความถี่ตรวจติดตามเพียงอย่างเดียวเป็นมาตรการเชิงป้องกันในอนาคต แต่ไม่ใช่การตอบสนองที่เพียงพอต่อเหตุการณ์ที่เกิดขึ้นแล้ว ซึ่งต้องมีการสืบสวนสาเหตุและประเมินผลกระทบ",
    ],
    difficulty: "medium",
    ref: "EU/PIC/S GMP Annex 1 (2022) — Personnel gowning qualification and monitoring action limits",
  },
  {
    topic: "Environmental monitoring — statistical detection probability (Poisson model) of airborne contamination",
    prompt:
      "หากระดับการปนเปื้อนจุลชีพในอากาศที่แท้จริงในพื้นที่ Grade A อยู่ที่ค่าเฉลี่ย 0.1 CFU/m³ (ใช้แบบจำลอง Poisson distribution) จงคำนวณความน่าจะเป็นที่การเก็บตัวอย่างอากาศแบบ active air sampling ปริมาตร 1 m³ เพียงครั้งเดียวจะตรวจพบเชื้ออย่างน้อย 1 CFU และอธิบายนัยสำคัญของผลลัพธ์นี้ต่อการแปลผล environmental monitoring",
    options: [
      "ประมาณ 9.5% (คำนวณจาก P(พบอย่างน้อย 1) = 1−e^(−λV) = 1−e^(−0.1) ≈ 0.0952) แสดงให้เห็นว่าแม้จะมีการปนเปื้อนอยู่จริงในระดับนี้ การสุ่มตัวอย่างเพียงจุดเดียวปริมาตรน้อยก็มีโอกาสตรวจพบต่ำมาก ผลลบจากการตรวจติดตามจึงไม่ได้รับประกันว่าไม่มีการปนเปื้อนอยู่จริง",
      "ประมาณ 10% (ใช้ λ×V เป็นความน่าจะเป็นโดยตรงแบบเชิงเส้นโดยไม่ผ่านฟังก์ชัน exponential)",
      "ประมาณ 90.5% (คำนวณ e^(−λV) แล้วตีความว่าเป็นความน่าจะเป็นที่จะตรวจพบ แทนที่จะเป็นความน่าจะเป็นที่จะไม่พบ)",
      "100% เสมอ เพราะหากมีการปนเปื้อนอยู่จริงในพื้นที่ การสุ่มตัวอย่างจะต้องตรวจพบได้อย่างแน่นอนทุกครั้ง",
      "0.1% (เข้าใจผิดว่าค่าเฉลี่ย CFU/m³ ที่กำหนดคือความน่าจะเป็นโดยตรงและเลื่อนทศนิยมผิดตำแหน่ง)",
    ],
    rationale:
      "ตามแบบจำลอง Poisson distribution ความน่าจะเป็นที่จะตรวจพบเชื้ออย่างน้อย 1 CFU จากการสุ่มตัวอย่างปริมาตร V เมื่อค่าเฉลี่ยการปนเปื้อนจริงคือ λ ต่อหน่วยปริมาตร คือ P = 1−e^(−λV) เมื่อ λ=0.1 และ V=1: P = 1−e^(−0.1) ≈ 1−0.9048 ≈ 0.0952 หรือประมาณ 9.5% ซึ่งแสดงให้เห็นข้อจำกัดสำคัญของ environmental monitoring แบบสุ่มตัวอย่างปริมาณน้อย: ผลลบไม่ได้เป็นหลักฐานยืนยันว่าไม่มีการปนเปื้อนอยู่จริง",
    traps: [
      "ผิด — ความสัมพันธ์ระหว่างความน่าจะเป็นในการตรวจพบกับ λV ไม่ใช่แบบเชิงเส้นตรง ต้องผ่านฟังก์ชัน exponential (1−e^(−λV)) ตามหลัก Poisson distribution",
      "ผิด — e^(−λV) คือความน่าจะเป็นที่จะไม่พบเชื้อเลย (พบ 0 CFU) ไม่ใช่ความน่าจะเป็นที่จะตรวจพบ ต้องนำ 1 ลบด้วยค่านี้จึงจะได้ความน่าจะเป็นที่ต้องการ",
      "ผิด — การมีการปนเปื้อนอยู่จริงในพื้นที่ไม่ได้รับประกันว่าการสุ่มตัวอย่างปริมาตรจำกัดจะตรวจพบได้เสมอ นี่คือใจความสำคัญของข้อจำกัดทางสถิติของ environmental monitoring",
      "ผิด — ค่าเฉลี่ย CFU/m³ ไม่ใช่ความน่าจะเป็นโดยตรง ต้องผ่านการคำนวณตามแบบจำลอง Poisson distribution จึงจะได้ความน่าจะเป็นในการตรวจพบที่ถูกต้อง",
    ],
    difficulty: "hard",
    ref: "Poisson distribution application in environmental monitoring — statistical limitations of microbial air sampling (PDA TR13; USP <1116>)",
    calc: [
      "P(ตรวจพบอย่างน้อย 1 CFU) = 1 − e^(−λV)",
      "λ = 0.1 CFU/m³, V = 1 m³ → λV = 0.1",
      "P = 1 − e^(−0.1) = 1 − 0.904837 ≈ 0.0952 (≈9.5%)",
    ],
  },
  {
    topic: "Blow-Fill-Seal (BFS) technology vs conventional aseptic vial filling",
    prompt:
      "เทคโนโลยี Blow-Fill-Seal (BFS) แตกต่างจากกระบวนการบรรจุปลอดเชื้อแบบดั้งเดิม (conventional aseptic vial filling) ในเชิงกลยุทธ์การสร้างความมั่นใจด้าน sterility assurance อย่างไร",
    options: [
      "BFS ผสานการขึ้นรูปภาชนะจาก resin การบรรจุ และการปิดผนึก ให้เกิดขึ้นต่อเนื่องในกระบวนการอัตโนมัติเดียวภายในพื้นที่ Grade A/localized shrouded zone ทันทีหลังการอัดขึ้นรูป ทำให้ระยะเวลาที่ภาชนะ/ผลิตภัณฑ์เปิดสัมผัสสภาพแวดล้อมสั้นลงมากและลดการแทรกแซงจากมนุษย์ เมื่อเทียบกับกระบวนการดั้งเดิม แต่ BFS ก็มีความเสี่ยงเฉพาะตัว เช่น ผลกระทบจากความร้อนขณะขึ้นรูป parison ต่อสูตรตำรับที่ไวต่อความร้อน",
      "BFS ไม่จำเป็นต้องมีพื้นที่ Grade A เลยตลอดกระบวนการ เนื่องจากกระบวนการอัตโนมัติทั้งหมดสามารถทดแทนการควบคุมสภาพแวดล้อมได้อย่างสมบูรณ์",
      "BFS มีการแทรกแซงจากมนุษย์ (manual intervention) มากกว่ากระบวนการบรรจุแบบดั้งเดิม เนื่องจากความซับซ้อนของเครื่องจักรที่ต้องปรับตั้งบ่อยครั้ง",
      "BFS ใช้ได้เฉพาะกับผลิตภัณฑ์ที่ผ่านกระบวนการฆ่าเชื้อขั้นสุดท้าย (terminally sterilized) เท่านั้น ไม่สามารถใช้กับกระบวนการปลอดเชื้อ (aseptic) ได้เลย",
      "อุณหภูมิของการขึ้นรูปภาชนะ (parison) ในกระบวนการ BFS ไม่มีผลกระทบใดๆ ต่อความคงตัวของสูตรตำรับที่บรรจุ",
    ],
    rationale:
      "จุดเด่นสำคัญของ BFS คือการรวมขั้นตอนขึ้นรูปภาชนะ บรรจุ และปิดผนึกเข้าด้วยกันในกระบวนการต่อเนื่องอัตโนมัติภายในพื้นที่ Grade A/shrouded zone เฉพาะจุดทันทีหลังขึ้นรูป ทำให้ลดระยะเวลาที่ภาชนะเปิดสัมผัสสภาพแวดล้อมและลดการแทรกแซงจากมนุษย์เมื่อเทียบกับกระบวนการบรรจุแบบดั้งเดิม อย่างไรก็ตาม BFS ยังคงต้องการพื้นที่ควบคุมสภาพแวดล้อมระดับ Grade A ที่จุดวิกฤต และมีความเสี่ยงเฉพาะตัวจากภาระความร้อนขณะขึ้นรูป parison ซึ่งต้องประเมินความเข้ากันได้กับสูตรตำรับที่ไวต่อความร้อน",
    traps: [
      "ผิด — BFS ยังคงต้องมีพื้นที่ควบคุมสภาพแวดล้อมระดับ Grade A ที่จุดวิกฤต (critical zone) แม้จะเป็น localized/shrouded zone ก็ตาม ไม่ได้ทดแทนความจำเป็นของการควบคุมสภาพแวดล้อมทั้งหมด",
      "ผิด — จุดเด่นสำคัญของ BFS คือการลดการแทรกแซงจากมนุษย์เมื่อเทียบกับกระบวนการดั้งเดิม ไม่ใช่เพิ่มขึ้น",
      "ผิด — BFS สามารถใช้ได้ทั้งกับกระบวนการปลอดเชื้อ (aseptic BFS) และกระบวนการที่มีการฆ่าเชื้อขั้นสุดท้าย ขึ้นอยู่กับคุณสมบัติของผลิตภัณฑ์และการออกแบบกระบวนการ",
      "ผิด — ภาระความร้อนขณะขึ้นรูป parison เป็นปัจจัยความเสี่ยงที่สำคัญที่ต้องประเมินความเข้ากันได้กับสูตรตำรับที่ไวต่อความร้อน ไม่ใช่ปัจจัยที่ไม่มีผลกระทบ",
    ],
    difficulty: "medium",
    ref: "PDA Technical Report — Blow-Fill-Seal Technology; aseptic processing considerations",
  },
  {
    topic: "Aseptic process simulation (media fill) — worst-case duration and intervention design",
    prompt:
      "ในการออกแบบ protocol สำหรับ aseptic process simulation (media fill) เพื่อให้สามารถเป็นตัวแทนความเสี่ยงของการผลิตจริงได้อย่างสมเหตุสมผล (valid worst-case representation) องค์ประกอบใดมีความสำคัญที่สุด",
    options: [
      "ระยะเวลาการจำลองและจำนวน/ประเภทของการแทรกแซง (interventions) ทั้งที่เป็น routine intervention และ corrective/non-routine intervention ต้องครอบคลุมหรือมากกว่าระยะเวลาการผลิตจริงที่ยาวนานที่สุดและความถี่ของการแทรกแซงที่เป็นไปได้ในสภาพการผลิตจริง รวมถึงการจำลองการเปลี่ยนกะ/การเข้า-ออกพื้นที่ของบุคลากร",
      "ควรดำเนินการที่ความเร็วสายการผลิตสูงสุดเท่านั้น เพราะเป็นปัจจัยเดียวที่กำหนดว่า media fill จะเป็นตัวแทน worst-case ได้หรือไม่",
      "ควรใช้ระยะเวลาสั้นกว่าการผลิตจริงเพื่อประหยัดต้นทุน เนื่องจาก media fill เป็นเพียงการจำลองเท่านั้น",
      "ควรลดจำนวนการแทรกแซงระหว่างการจำลองให้น้อยที่สุดเท่าที่จะทำได้ เพื่อหลีกเลี่ยงความเสี่ยงในการปนเปื้อนที่เกิดจากการศึกษาเอง",
      "จำเป็นต้องจำลองเฉพาะ routine intervention เท่านั้น ไม่จำเป็นต้องจำลอง corrective/non-routine intervention เนื่องจากเป็นเหตุการณ์ที่ไม่ได้เกิดขึ้นเป็นประจำ",
    ],
    rationale:
      "Media fill ที่ valid ต้องออกแบบให้ระยะเวลาการจำลองและจำนวน/ประเภทของการแทรกแซงครอบคลุมหรือมากกว่าสภาพการผลิตจริงที่ท้าทายที่สุด ทั้งในแง่ระยะเวลา (ต้อง ≥ รอบการผลิตจริงที่ยาวนานที่สุด) และการแทรกแซง (ต้องครอบคลุมทั้ง routine intervention และ corrective/non-routine intervention) รวมถึงสภาวะการเปลี่ยนกะและการเข้า-ออกพื้นที่ของบุคลากร เพื่อให้ media fill เป็นตัวแทนความเสี่ยงของกระบวนการผลิตจริงได้อย่างถูกต้อง การลดทอนปัจจัยเหล่านี้จะทำให้ media fill ไม่สามารถท้าทายกระบวนการได้อย่างเพียงพอ",
    traps: [
      "ผิด — ความเร็วสายการผลิตเป็นเพียงปัจจัยหนึ่งที่ควรพิจารณา แต่ไม่ใช่ปัจจัยเดียวที่กำหนด worst-case representation ระยะเวลาและการแทรกแซงมีความสำคัญไม่น้อยไปกว่ากัน",
      "ผิด — Media fill ต้องมีระยะเวลาที่ครอบคลุมหรือมากกว่ารอบการผลิตจริงที่ยาวนานที่สุด การลดระยะเวลาลงเพื่อประหยัดต้นทุนจะทำให้ไม่สามารถท้าทายความเสี่ยงตลอดระยะเวลาการผลิตจริงได้อย่างเพียงพอ",
      "ผิด — เป้าหมายของ media fill คือการจำลองความเสี่ยงที่ใกล้เคียงสภาพการผลิตจริงให้มากที่สุด การลดจำนวนการแทรกแซงลงจะทำให้การจำลองไม่ท้าทายเพียงพอและอาจพลาดการตรวจพบจุดอ่อนของกระบวนการจริง",
      "ผิด — Corrective/non-routine intervention เป็นเหตุการณ์ที่มีความเสี่ยงปนเปื้อนสูงกว่า routine intervention จึงจำเป็นต้องจำลองด้วยเช่นกันเพื่อให้ media fill เป็นตัวแทนความเสี่ยงที่ครบถ้วน",
    ],
    difficulty: "medium",
    ref: "EU/PIC/S GMP Annex 1 (2022); FDA Aseptic Processing Guidance — media fill design and worst-case intervention simulation",
  },
];

function buildQuestion(d: Draft, index: number): McqQuestion {
  const pos = answerPositions[index % answerPositions.length];
  const correct = d.options[0];
  const distractors = d.options.slice(1);
  const shuffled = [...distractors];
  shuffled.splice(pos, 0, correct);
  const answer = labels[pos];

  const choiceExplanations = shuffled.map((text, j) => {
    if (j === pos) {
      return {
        label: labels[j],
        text,
        is_correct: true,
        explanation: `ถูก — ${d.rationale}`,
      };
    }
    const originalWrongIndex = distractors.indexOf(text as string);
    return {
      label: labels[j],
      text,
      is_correct: false,
      explanation: `ไม่เลือก — ${d.traps[originalWrongIndex]}`,
    };
  });

  return {
    id: `ip1set2_d03_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 3/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 3 · ${d.topic}\n\n${d.prompt}`,
    image_url: null,
    choices: shuffled.map((text, j) => ({ label: labels[j], text })),
    correct_answer: answer,
    explanation: `หลักการ: ${d.rationale}\n\nReference: ${d.ref}`,
    detailed_explanation: {
      summary: `เฉลย ${answer}. ${correct}`,
      reason: `【หลักการสำคัญ】\n${d.rationale}\n\n【วิธีคิดแบบข้อสอบ IP1】\nโจทย์ข้อนี้อยู่ในหัวข้อ "${d.topic}" ต้องเชื่อมข้อมูลเชิงตัวเลข/สถานการณ์ในโจทย์เข้ากับหลักการ GMP/regulatory ที่เกี่ยวข้อง แล้วแยกตัวเลือกที่ดูสมเหตุสมผลบางส่วนแต่ไม่ใช่ single best answer ออกจากคำตอบที่ตอบโจทย์ได้ตรงและครบถ้วนที่สุด\n\n【Reference / หลักอ้างอิง】\n${d.ref}`,
      choices: choiceExplanations,
      key_takeaway: `Exam Pearl: ${d.rationale}`,
      ...(d.calc ? { calculation_steps: d.calc } : {}),
    },
    difficulty: d.difficulty,
    is_ai_enhanced: false,
    ai_notes:
      "Manually drafted original IP1 item (Daily Set 2, Day 3/30) — not copied from any past exam. Editorial/technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-24 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 180,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY03: McqQuestion[] = D.map(buildQuestion);
