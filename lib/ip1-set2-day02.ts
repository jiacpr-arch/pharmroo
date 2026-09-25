import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 2 of 30 (10 questions/day plan)
// Topic focus: calculation-heavy quality/regulatory topics (impurities,
// cleaning validation, elemental impurities, nitrosamines, extractables &
// leachables, stability extrapolation, QbD, scale-up, dissolution f2).
// Distinct from IP1_PILOT_050 (lib/ip1-pilot-050.ts) and from Day 1
// (lib/ip1-set2-day01.ts, cleanroom/HVAC) — cross-checked against both to
// avoid repeating the same tested concept:
//   - existing bank has "Related substances / disregard limit vs LOQ" (threshold
//     filtering alone) and "Related substances / corrected impurity" (RRF alone);
//     Q1 here combines both mechanisms in one item, which neither existing
//     question does.
//   - existing bank has "Dissolution profile / f2 concept" (when f2 is exempt/not
//     required); Q10 here is a genuine f2 *calculation* from a dataset, a
//     different skill from the exemption-rule question.
//   - MACO, elemental impurities (ICH Q3D), CCIT, nitrosamines, extractables &
//     leachables, QbD design space, and mixer scale-up do not appear anywhere
//     in the existing 150-question bank or in Day 1.
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
const answerPositions = [1, 3, 0, 4, 2, 2, 0, 4, 1, 3];

const D: Draft[] = [
  {
    topic: "Related substances — combined RRF and reporting-threshold trap",
    prompt:
      "การตรวจสอบ Related substances ของ Amlodipine besylate tablets โดยวิธี HPLC มีข้อมูลดังนี้: Reporting threshold = 0.05% (ใช้กับค่าหลังแก้ RRF แล้ว), Individual specified-impurity limit NMT 0.20%, Individual unspecified-impurity limit NMT 0.10%, Total impurities limit NMT 0.5%\n\nImpurity A (specified), RRF = 0.5, apparent = 0.15%\nImpurity B (specified), RRF = 2.0, apparent = 0.08%\nUnknown impurity (ไม่มี RRF ที่ทราบ), apparent = 0.06%\n\nจงสรุปผลการตรวจสอบ (batch นี้ผ่านหรือไม่ผ่าน และเพราะอะไร)",
    options: [
      "ไม่ผ่าน (OOS) เพราะ Impurity A หลังแก้ RRF (0.15÷0.5 = 0.30%) เกิน individual limit 0.20% แม้ Total impurities ที่แก้ไขแล้วและตัดค่าต่ำกว่า threshold ออก (A 0.30% + unknown 0.06%×RRF 1.0 = 0.36%, ตัด B ออกเพราะแก้แล้วเหลือ 0.04% ต่ำกว่า threshold) จะยังผ่าน Total limit 0.5% ก็ตาม เพราะ individual และ total ต้องผ่านแยกกันทั้งคู่",
      "ผ่านทั้งหมด เพราะ Impurity A มี apparent เพียง 0.15% ซึ่งต่ำกว่า individual limit 0.20% อยู่แล้ว",
      "ผ่าน เพราะ Total impurities ที่คำนวณถูกต้อง (0.36%) ยังต่ำกว่า Total limit 0.5%",
      "ไม่ผ่าน เพราะ unknown impurity ไม่มี RRF ที่ทราบแน่ชัด จึงต้องถือว่า fail โดยอัตโนมัติตาม regulatory requirement",
      "ไม่ผ่าน เพราะ Impurity B หลังแก้ RRF (0.04%) ต่ำกว่า reporting threshold ถือเป็นความผิดปกติที่ต้องรายงานเป็น deviation",
    ],
    rationale:
      "RRF ต่ำกว่า 1 (เช่น 0.5) หมายความว่า detector ตอบสนองต่อ impurity นั้นแรงกว่า API ค่าจริงจึงต้องหารด้วย RRF ไม่ใช่มองข้าม ทำให้ apparent ที่ดูผ่านเกณฑ์ (0.15% < 0.20%) กลายเป็นไม่ผ่านหลังแก้ไข (0.30%) ส่วน unknown impurity ที่ไม่มี RRF ที่ทราบต้องใช้ default RRF = 1.0 ตามหลักปฏิบัติทั่วไป ไม่ใช่ fail อัตโนมัติ และ Total impurities ต้องคำนวณจากค่าที่แก้ RRF แล้วก่อนเทียบ reporting threshold เสมอ สุดท้าย individual limit และ total limit เป็นเกณฑ์อิสระที่ต้องผ่านแยกกันทั้งคู่ — total ผ่านไม่ได้แปลว่า individual จะผ่านด้วย",
    traps: [
      "ผิด — Apparent เพียงอย่างเดียวยังไม่ใช่ค่าที่ใช้ตัดสิน ต้องแก้ด้วย RRF ก่อนเทียบเกณฑ์เสมอ",
      "ผิด — Total impurities แม้คำนวณถูกต้องและผ่านเกณฑ์ ก็ไม่ได้แปลว่า individual limit ของ Impurity A จะผ่านไปด้วย ทั้งสองเกณฑ์เป็นอิสระต่อกัน",
      "ผิด — Unknown/unidentified impurity ที่ไม่มี RRF ที่ทราบ ใช้ default RRF=1.0 ตามหลักปฏิบัติ ไม่ใช่ fail โดยอัตโนมัติ",
      "ผิด — ค่าที่ต่ำกว่า reporting threshold หลังแก้ RRF เป็นผลปกติที่คาดหวังได้ตามหลัก disregard rule ไม่ใช่ deviation ที่ต้องรายงาน",
    ],
    difficulty: "hard",
    ref: "ICH Q3B(R2); USP <1086> impurity RRF and reporting-threshold principles",
    calc: [
      "Impurity A corrected = 0.15% ÷ 0.5 = 0.30% (เกิน individual limit 0.20%)",
      "Impurity B corrected = 0.08% ÷ 2.0 = 0.04% (ต่ำกว่า reporting threshold 0.05% → ตัดออกจาก total)",
      "Unknown corrected = 0.06% × RRF(default)=1.0 = 0.06% (≥ threshold → รวมใน total, และผ่าน unspecified limit 0.10%)",
      "Total impurities (≥threshold เท่านั้น) = 0.30% + 0.06% = 0.36% (ผ่าน total limit 0.5%)",
      "สรุป: individual limit ของ A ไม่ผ่าน (0.30% > 0.20%) → batch ไม่ผ่านโดยรวม",
    ],
  },
  {
    topic: "Cleaning validation — MACO calculation with recovery correction",
    prompt:
      "โรงงานผลิต Warfarin 1 mg tablets (ยาก่อนหน้า) แล้วต่อด้วย Metformin 500 mg tablets (ยาถัดไป) บนเครื่องจักรชุดเดียวกัน ข้อมูล: Lowest therapeutic daily dose ของ Warfarin = 1 mg, Maximum daily dose ของ Metformin = 2,000 mg, Minimum batch size ของ Metformin = 100 kg, Safety factor = 1,000, พื้นที่ผิวสัมผัสร่วมของเครื่องจักร = 10,000 cm², พื้นที่ swab = 25 cm², swab recovery = 80%\n\nจงหาค่าที่ยอมรับได้สำหรับผลตรวจวัดจริงจาก swab (ค่าดิบก่อนแก้ไข recovery)",
    options: [
      "0.10 mg",
      "0.125 mg",
      "0.15625 mg",
      "0.005 mg",
      "50 mg",
    ],
    rationale:
      "MACO (ทั้ง batch) = (LTD_A × MBS_B) ÷ (SF × MDD_B) = (1×100,000,000)÷(1,000×2,000) = 50 mg จากนั้นแปลงเป็นต่อพื้นที่: 50÷10,000 = 0.005 mg/cm² แล้วคูณด้วยพื้นที่ swab (25 cm²) = 0.125 mg ซึ่งคือปริมาณจริงบนพื้นผิวที่ยอมรับได้ในพื้นที่ swab แต่เพราะ swab recovery แค่ 80% (วัดได้น้อยกว่าจริงเสมอ) ค่าที่ยอมรับได้สำหรับผล**วัด**ดิบต้องเข้มงวดขึ้นโดยคูณด้วย recovery: 0.125×0.80 = 0.10 mg",
    traps: [
      "ผิด — นี่คือปริมาณจริงบนพื้นผิวก่อนปรับ recovery ยังไม่ใช่ค่าที่ใช้เทียบกับผลวัดดิบจาก swab",
      "ผิด — หารด้วย recovery แทนที่จะคูณ ทำให้ limit หลวมเกินจริง (ยอมให้สารตกค้างมากกว่าที่ควรจะปลอดภัย)",
      "ผิด — ลืมคูณด้วยพื้นที่ swab (25 cm²) ใช้แค่ค่า MACO ต่อ cm² ตรงๆ",
      "ผิด — ใช้ค่า MACO รวมทั้ง batch โดยไม่แบ่งเป็นต่อพื้นที่และไม่คิดพื้นที่ swab",
    ],
    difficulty: "hard",
    ref: "Cleaning validation MACO principles (health-based / dose-based approach)",
    calc: [
      "MACO = (LTD_A × MBS_B) ÷ (SF × MDD_B) = (1 mg × 100,000,000 mg) ÷ (1,000 × 2,000 mg) = 50 mg",
      "MACO ต่อพื้นที่ = 50 mg ÷ 10,000 cm² = 0.005 mg/cm²",
      "ปริมาณจริงยอมรับได้ในพื้นที่ swab = 0.005 × 25 cm² = 0.125 mg",
      "ปรับด้วย recovery (คูณ ไม่ใช่หาร): 0.125 × 0.80 = 0.10 mg ← ค่าที่ใช้เทียบผลวัดดิบ",
    ],
  },
  {
    topic: "Elemental impurities (ICH Q3D) — multi-source PDE calculation",
    prompt:
      "ยาเม็ดรับประทาน (maximum daily dose = 2 เม็ด, น้ำหนักเม็ดละ 500 mg โดย API คิดเป็น 40% และ excipients รวม 60% ของน้ำหนักเม็ด) ผลตรวจ Cadmium (Class 1 element ตาม ICH Q3D): ใน API = 0.5 ppm, ใน excipients รวม = 0.3 ppm. PDE ของ Cadmium ทางปาก (oral) = 5 µg/day\n\nจงคำนวณปริมาณ Cadmium ที่ผู้ป่วยได้รับต่อวัน และสรุปว่าผ่านเกณฑ์หรือไม่",
    options: [
      "0.38 µg/day ต่ำกว่า PDE (5 µg/day) มาก จึงผ่านเกณฑ์",
      "0.19 µg/day ผ่านเกณฑ์ (คำนวณจากเม็ดเดียวโดยลืมคูณจำนวนเม็ดต่อวัน)",
      "0.8 µg/day ผ่านเกณฑ์ (ใช้น้ำหนักเม็ดเต็มคูณทั้งสอง ppm โดยไม่แยกสัดส่วน API/excipient)",
      "2,000 µg/day ไม่ผ่านเกณฑ์อย่างมาก (เข้าใจผิดว่า ppm เทียบเท่า % โดยตรง)",
      "400 µg/day ไม่ผ่านเกณฑ์ (ใช้หน่วย ppm เป็น µg/mg ตรงๆ โดยไม่แปลงหน่วยให้ถูกต้อง)",
    ],
    rationale:
      "ต้องแยกน้ำหนัก API และ excipients ต่อเม็ดตามสัดส่วนที่กำหนด แล้วคูณด้วยจำนวนเม็ด/วันก่อนแปลง ppm (µg/g = 0.001 µg/mg) เป็นปริมาณจริง: API 400 mg/day × 0.5 ppm = 0.2 µg และ excipients 600 mg/day × 0.3 ppm = 0.18 µg รวม 0.38 µg/day ซึ่งต่ำกว่า PDE (5 µg/day) มาก (~7.6% ของ PDE) จึงผ่านเกณฑ์อย่างสบาย",
    traps: [
      "ผิด — ลืมคูณด้วยจำนวนเม็ดต่อวัน (2 เม็ด) ทำให้ตัวเลขต่ำกว่าความเป็นจริงครึ่งหนึ่ง แม้ข้อสรุปผ่าน/ไม่ผ่านจะบังเอิญเหมือนกัน แต่ตัวเลขที่รายงานผิด",
      "ผิด — ไม่แยกสัดส่วนน้ำหนัก API/excipient ใช้น้ำหนักเม็ดเต็มคูณทั้งสองค่า ppm ทำให้ overestimate เกินจริง",
      "ผิด — เข้าใจผิดว่า ppm เทียบเท่ากับ % (1 ppm ≠ 1%) ทำให้ค่าที่ได้สูงเกินจริงหลายพันเท่าและสรุปผิดว่าไม่ผ่าน",
      "ผิด — ใช้ค่า ppm เป็น µg/mg ตรงๆ โดยไม่แปลงหน่วยที่ถูกต้อง (1 ppm = 0.001 µg/mg ไม่ใช่ 1 µg/mg) ทำให้ overestimate 1,000 เท่า",
    ],
    difficulty: "hard",
    ref: "ICH Q3D(R2) — Elemental Impurities: PDE-based risk assessment",
    calc: [
      "น้ำหนัก API/วัน = 40% × 500 mg × 2 เม็ด = 400 mg",
      "น้ำหนัก excipients/วัน = 60% × 500 mg × 2 เม็ด = 600 mg",
      "Cd จาก API = 400 mg × 0.5 ppm (=0.0005 µg/mg) = 0.20 µg",
      "Cd จาก excipients = 600 mg × 0.3 ppm (=0.0003 µg/mg) = 0.18 µg",
      "รวม = 0.38 µg/day เทียบ PDE 5 µg/day → ผ่านเกณฑ์ (~7.6% ของ PDE)",
    ],
  },
  {
    topic: "Container closure integrity testing (CCIT) method selection",
    prompt:
      "ผลิตภัณฑ์ยาฉีดปราศจากเชื้อบรรจุใน vial ต้องการทดสอบ container closure integrity (CCI) แบบไม่ทำลายตัวอย่าง (non-destructive) และให้ผลเชิงปริมาณที่ทำซ้ำได้ (deterministic) เพื่อทดแทนวิธี dye ingress แบบเดิม วิธีใดเหมาะสมที่สุด",
    options: [
      "Vacuum decay หรือ high-voltage leak detection (HVLD) เนื่องจากเป็นวิธี deterministic ให้ผลเชิงปริมาณและทำซ้ำได้ ต่างจาก dye ingress ที่เป็น probabilistic/qualitative และทำลายตัวอย่าง",
      "Dye ingress ยังคงเป็นวิธีที่ดีที่สุดเสมอสำหรับทุกสถานการณ์เพราะเป็นวิธีดั้งเดิมที่ใช้กันมานาน",
      "Microbial ingress challenge เหมาะกับการทดสอบ routine batch release เพราะราคาถูกและทำได้รวดเร็ว",
      "ไม่มีความจำเป็นต้องทดสอบ CCI เพิ่มเติมหากผลิตภัณฑ์ผ่าน sterility test ตามมาตรฐานแล้ว",
      "ใช้ visual inspection ด้วยตาเปล่าเพียงพอสำหรับให้ผลเชิงปริมาณที่ deterministic",
    ],
    rationale:
      "แนวทางปัจจุบัน (เช่น USP <1207>) สนับสนุนการใช้วิธี deterministic (physical/chemical) อย่าง vacuum decay หรือ HVLD สำหรับ CCI มากกว่าวิธี probabilistic แบบเดิม (dye ingress, microbial challenge) เพราะให้ผลเชิงปริมาณ ทำซ้ำได้ ไม่ทำลายตัวอย่าง และมีความไวสูงกว่าในการตรวจจับรอยรั่วขนาดเล็ก",
    traps: [
      "ผิด — แนวทางกำกับดูแลปัจจุบันแนะนำให้เปลี่ยนจาก probabilistic method (dye ingress) ไปใช้ deterministic method เมื่อเป็นไปได้ ไม่ใช่ยึด dye ingress เป็นค่าเริ่มต้นเสมอ",
      "ผิด — Microbial ingress challenge เป็นวิธีทำลายตัวอย่างและใช้เวลานาน (ต้อง incubate) เหมาะกับการทำ method validation มากกว่า routine release",
      "ผิด — Sterility test และ CCI test ตอบคำถามคนละเรื่อง: sterility test ตรวจว่าผลิตภัณฑ์ปราศจากเชื้อ ณ เวลาทดสอบ แต่ไม่ได้ยืนยันว่าบรรจุภัณฑ์จะป้องกันการปนเปื้อนตลอดอายุผลิตภัณฑ์",
      "ผิด — Visual inspection ด้วยตาเปล่าตรวจจับได้เฉพาะรอยรั่ว/ตำหนิขนาดใหญ่ที่มองเห็นได้ ไม่สามารถให้ผลเชิงปริมาณหรือตรวจจับ micro-leak ได้",
    ],
    difficulty: "medium",
    ref: "USP <1207> Package Integrity Evaluation — Sterile Products",
  },
  {
    topic: "Stability shelf-life extrapolation (ICH Q1E)",
    prompt:
      "ข้อมูล stability ระยะยาว (25°C/60%RH) ของยาเม็ดมีข้อมูล assay ที่ 0, 3, 6, 9, 12 เดือน แสดงแนวโน้มลดลงเชิงเส้นอย่างสม่ำเสมอ ทีมงานต้องการกำหนดอายุยา (shelf life) เป็น 24 เดือนโดยใช้ linear regression จากข้อมูลที่มีอยู่ ข้อใดเหมาะสมที่สุดตามหลักการของ ICH Q1E",
    options: [
      "การ extrapolate ทำได้ไม่เกินประมาณ 2 เท่าของระยะเวลาที่มีข้อมูลจริง (จาก 12 เดือน จึง extrapolate ได้ถึงราว 24 เดือนหากเข้าเงื่อนไข) และต้องใช้ lower confidence limit (95%) ของ regression line เทียบกับ specification ไม่ใช่เส้นค่าเฉลี่ย",
      "ใช้เส้นค่าเฉลี่ย (mean regression line) ตัดกับ specification limit โดยตรงโดยไม่ต้องพิจารณา confidence interval",
      "สามารถ extrapolate ได้ไม่จำกัดระยะเวลาตราบใดที่ค่า r² ของ regression สูงเพียงพอ",
      "ควรใช้ข้อมูล accelerated (40°C/75%RH) แทนเพื่อยืนยัน shelf life 24 เดือนได้ทันที โดยไม่จำเป็นต้องมีข้อมูล long-term เพิ่มเติมสนับสนุน",
      "ควรตัดข้อมูลที่แสดงแนวโน้มลดลงออก แล้วใช้เฉพาะค่าที่ 0 เดือนเป็นตัวแทนตลอดอายุผลิตภัณฑ์",
    ],
    rationale:
      "ICH Q1E กำหนดหลักการ extrapolation ที่ระมัดระวัง: โดยทั่วไป extrapolate ได้ไม่เกินสองเท่าของระยะเวลาที่มีข้อมูล long-term จริง (และไม่เกิน 12 เดือนถัดจากช่วงที่มีข้อมูลในหลายกรณี ขึ้นกับความมั่นใจของข้อมูล) และต้องประเมินโดยใช้ lower confidence limit (95%) ของเส้น regression เทียบกับ specification เพื่อคำนึงถึงความไม่แน่นอนทางสถิติ ไม่ใช่ใช้เส้นค่าเฉลี่ยตัดกับ spec ตรงๆ ซึ่งจะประเมิน shelf life สูงเกินจริง",
    traps: [
      "ผิด — เส้นค่าเฉลี่ยไม่ได้สะท้อนความไม่แน่นอนทางสถิติของข้อมูล การใช้ mean line ตัดกับ spec โดยตรงมักประเมิน shelf life สูงเกินจริงกว่าความเป็นจริง",
      "ผิด — ICH Q1E ไม่ได้อนุญาตให้ extrapolate แบบไม่จำกัดแม้ r² จะสูง ยังคงมีขอบเขตเวลาที่กำหนดไว้ตามหลักการ",
      "ผิด — ข้อมูล accelerated ใช้สนับสนุนความเสี่ยงจาก short-term excursion หรือเป็น supportive data เท่านั้น ไม่สามารถใช้แทนข้อมูล long-term เพื่อกำหนด shelf life ที่ยาวกว่าข้อมูลจริงที่มีได้โดยลำพัง",
      "ผิด — การตัดข้อมูลที่แสดงแนวโน้มการเสื่อมสภาพจริงออกเป็นการบิดเบือนข้อมูล ขัดต่อหลัก data integrity และไม่สะท้อนพฤติกรรมจริงของผลิตภัณฑ์",
    ],
    difficulty: "hard",
    ref: "ICH Q1E — Evaluation of Stability Data",
  },
  {
    topic: "QbD — Design Space vs Proven Acceptable Range (PAR)",
    prompt:
      "การศึกษาความสัมพันธ์ของ mixing time และ mixing speed ต่อ blend uniformity พบว่าแต่ละพารามิเตอร์เมื่อศึกษาแยกกัน (univariate) มี Proven Acceptable Range (PAR) ที่ค่อนข้างกว้าง แต่เมื่อศึกษาร่วมกันแบบ multivariate (DOE) พบว่า combination ที่ mixing time สูงสุดร่วมกับ mixing speed สูงสุด (ซึ่งแต่ละค่ายังอยู่ใน PAR ของตัวเองทั้งคู่) กลับทำให้เกิด over-blending และ segregation ข้อใดอธิบายสถานการณ์นี้ได้ถูกต้องที่สุด",
    options: [
      "การอยู่ใน PAR ของแต่ละพารามิเตอร์แยกกันไม่ได้รับประกันว่า combination ของพารามิเตอร์เหล่านั้นจะยังอยู่ใน Design Space ที่แท้จริง เนื่องจาก PAR ไม่ได้พิจารณา interaction effect ระหว่างพารามิเตอร์ ต่างจาก Design Space ที่มาจากการศึกษาแบบ multivariate และครอบคลุม interaction",
      "PAR และ Design Space คือสิ่งเดียวกัน จึงสามารถใช้แทนกันได้เสมอในทุกสถานการณ์",
      "หากพารามิเตอร์แต่ละตัวอยู่ใน PAR ของตัวเองพร้อมกันแล้ว จะปลอดภัยเสมอเพราะ PAR ผ่านการศึกษา validate มาแล้ว",
      "Design Space ไม่จำเป็นต้องพิจารณา interaction effect เพราะเป็นเพียงผลรวมของ PAR ของแต่ละพารามิเตอร์",
      "การเกิด over-blending และ segregation ไม่เกี่ยวข้องกับ interaction effect แต่เกิดจากความผิดปกติของเครื่องจักรเท่านั้น",
    ],
    rationale:
      "PAR มาจากการศึกษาผลของพารามิเตอร์ทีละตัวโดยคงพารามิเตอร์อื่นคงที่ (univariate) จึงไม่สะท้อน interaction effect เมื่อหลายพารามิเตอร์เปลี่ยนพร้อมกัน ขณะที่ Design Space ตามหลัก QbD (ICH Q8) มาจากการศึกษาแบบ multivariate (เช่น DOE) ที่ครอบคลุม interaction ระหว่างพารามิเตอร์ การอยู่ใน PAR ของแต่ละตัวแยกกันจึงไม่ได้รับประกันว่า combination นั้นจะยังอยู่ใน Design Space จริง กรณีนี้คือตัวอย่างคลาสสิกที่ extreme ends ของสองพารามิเตอร์รวมกันทำให้เกิดผลลบที่ไม่พบเมื่อศึกษาแยกกัน",
    traps: [
      "ผิด — PAR และ Design Space เป็นแนวคิดที่ต่างกัน PAR มาจาก univariate study ส่วน Design Space มาจาก multivariate study ที่ครอบคลุม interaction",
      "ผิด — ตัวอย่างในโจทย์แสดงให้เห็นชัดว่าการอยู่ใน PAR ของทุกตัวแปรพร้อมกันไม่ได้ปลอดภัยเสมอไป เพราะเกิด over-blending ขึ้นจริง",
      "ผิด — Design Space ที่ถูกต้องตามหลัก QbD ต้องพิจารณา interaction effect ระหว่างพารามิเตอร์ ไม่ใช่แค่ผลรวมของ PAR แต่ละตัว",
      "ผิด — สถานการณ์นี้เกิดจาก interaction effect ระหว่าง mixing time และ mixing speed ที่ extreme values ไม่ใช่ความผิดปกติของเครื่องจักร",
    ],
    difficulty: "medium",
    ref: "ICH Q8(R2) — Pharmaceutical Development; Design Space concepts",
  },
  {
    topic: "Extractables & leachables — Safety Concern Threshold (SCT)",
    prompt:
      "ผลิตภัณฑ์ยาสูดพ่น (orally inhaled product) พบ leachable จาก packaging component ที่ความเข้มข้น 0.02 µg/actuation ผู้ป่วยใช้ยา 4 actuation/วัน (Safety Concern Threshold (SCT) สำหรับผลิตภัณฑ์ประเภทนี้ = 1.5 µg/day ตามแนวทาง Threshold of Toxicological Concern) จงคำนวณปริมาณที่ผู้ป่วยได้รับต่อวัน และสรุปว่าต้องดำเนินการ identify/toxicological assessment เพิ่มเติมหรือไม่",
    options: [
      "0.08 µg/day ต่ำกว่า SCT (1.5 µg/day) มาก จึงยังไม่จำเป็นต้อง identify/toxicological assessment เพิ่มเติม (แต่ยังต้องติดตาม/รายงานตามระบบคุณภาพ)",
      "0.02 µg/day ต่ำกว่า SCT จึงไม่ต้องดำเนินการใดๆ (ลืมคูณจำนวน actuation ต่อวัน)",
      "ต้อง identify และทำ toxicological assessment ทุก leachable ที่ตรวจพบเสมอ ไม่ว่าจะต่ำกว่า SCT หรือไม่",
      "0.08 µg/day เกิน SCT จึงต้อง identify ทันที (ตีความทิศทางการเทียบกับ SCT ผิด)",
      "8 µg/day เกิน SCT มาก (ใช้หน่วย mg แทน µg ทำให้ตัวเลขผิดหน่วย)",
    ],
    rationale:
      "ปริมาณที่ได้รับต่อวัน = 0.02 µg/actuation × 4 actuation/วัน = 0.08 µg/day ซึ่งต่ำกว่า SCT (1.5 µg/day) มาก ตามหลัก TTC สาร leachable ที่ปริมาณต่ำกว่า SCT โดยทั่วไปยังไม่จำเป็นต้องทำ full identification/toxicological qualification เพิ่มเติม (แม้ยังควรมีการติดตามและควบคุมคุณภาพตามระบบ) การ identify ทุกสารที่พบโดยไม่พิจารณาระดับความเสี่ยงเป็นการใช้ทรัพยากรที่ไม่ตรงตามหลัก risk-based approach",
    traps: [
      "ผิด — ลืมคูณด้วยจำนวน actuation ต่อวัน (4 ครั้ง) ทำให้รายงานปริมาณต่ำกว่าความเป็นจริง 4 เท่า แม้ข้อสรุปผ่าน/ไม่ผ่านอาจไม่ต่างกันในกรณีนี้",
      "ผิด — แนวทาง TTC ใช้หลัก risk-based ไม่ใช่ identify ทุกสารที่ตรวจพบโดยไม่พิจารณาปริมาณเทียบกับ threshold",
      "ผิด — 0.08 µg/day ยังต่ำกว่า SCT (1.5 µg/day) มาก ไม่ใช่เกินตามที่ระบุ",
      "ผิด — หน่วยที่ให้ในโจทย์เป็น µg ไม่ใช่ mg การเปลี่ยนหน่วยโดยไม่มีเหตุผลทำให้ผลลัพธ์ผิดพลาด 1,000 เท่า",
    ],
    difficulty: "medium",
    ref: "Threshold of Toxicological Concern (TTC) approach for extractables & leachables assessment",
    calc: [
      "ปริมาณต่อวัน = 0.02 µg/actuation × 4 actuation/day = 0.08 µg/day",
      "เทียบกับ SCT = 1.5 µg/day → 0.08 < 1.5 → ต่ำกว่า SCT มาก",
    ],
  },
  {
    topic: "Nitrosamine impurity — Acceptable Intake (AI) calculation",
    prompt:
      "ยาเม็ดพบสารปนเปื้อน NDMA (N-nitrosodimethylamine) ที่ระดับ 0.15 ppm ผู้ป่วยรับประทาน 2 เม็ด/วัน แต่ละเม็ดหนัก 300 mg (Acceptable Intake (AI) ของ NDMA = 96 ng/day ตามแนวทางการประเมินความเสี่ยง nitrosamine) จงคำนวณปริมาณ NDMA ที่ได้รับต่อวัน และสรุปผล",
    options: [
      "90 ng/day ต่ำกว่า AI (96 ng/day) เล็กน้อย จึงยังผ่านเกณฑ์ แต่มี margin แคบมากควรเฝ้าระวังใกล้ชิด",
      "45 ng/day ผ่านเกณฑ์สบายๆ (คำนวณจากเม็ดเดียวโดยลืมคูณจำนวนเม็ดต่อวัน)",
      "90,000 ng/day เกิน AI มหาศาล (ใช้ค่า ppm เป็น µg/mg ตรงๆ โดยไม่แปลงหน่วยให้ถูกต้อง)",
      "90 mg/day เกิน AI (สลับหน่วย ng กับ mg ทำให้ตัวเลขผิดหน่วยไปหนึ่งล้านเท่า)",
      "180 ng/day เกิน AI (คูณด้วยจำนวนเม็ดสองครั้งโดยไม่ตั้งใจ)",
    ],
    rationale:
      "น้ำหนักเม็ดรวมต่อวัน = 300 mg × 2 เม็ด = 600 mg; 0.15 ppm = 0.15 ng/mg; ปริมาณ NDMA = 600 mg × 0.15 ng/mg = 90 ng/day ซึ่งต่ำกว่า AI (96 ng/day) เพียงเล็กน้อย (margin แคบ ~6%) จึงยังผ่านเกณฑ์ในทางเทคนิค แต่ควรพิจารณามาตรการลดความเสี่ยงเพิ่มเติมเนื่องจาก margin ที่แคบมาก",
    traps: [
      "ผิด — ลืมคูณด้วยจำนวนเม็ดต่อวัน (2 เม็ด) ทำให้ตัวเลขต่ำกว่าความเป็นจริงครึ่งหนึ่ง และอาจทำให้ประเมิน margin ผิดพลาด (ดูปลอดภัยเกินจริง)",
      "ผิด — ใช้ ppm เป็น µg/mg ตรงๆ (1 ppm = 0.001 µg/mg ไม่ใช่ 1 µg/mg) ทำให้ overestimate ผิดหน่วยไป 1,000 เท่า",
      "ผิด — สลับหน่วย ng กับ mg ทำให้ตัวเลขผิดพลาดไปหนึ่งล้านเท่าและสรุปผิดพลาดอย่างมาก",
      "ผิด — คูณจำนวนเม็ดซ้ำสองครั้งโดยไม่ตั้งใจ (เช่น 300×2×2×0.15=180) ทำให้ตัวเลขสูงเกินจริงและสรุปผิดว่าไม่ผ่าน",
    ],
    difficulty: "hard",
    ref: "Nitrosamine impurity risk assessment — Acceptable Intake (AI) principles",
    calc: [
      "น้ำหนักเม็ดรวม/วัน = 300 mg × 2 เม็ด = 600 mg",
      "แปลงหน่วย: 0.15 ppm = 0.15 ng/mg",
      "ปริมาณ NDMA/วัน = 600 mg × 0.15 ng/mg = 90 ng/day",
      "เทียบ AI = 96 ng/day → 90 < 96 (margin ~6%) → ผ่านเกณฑ์อย่างหวุดหวิด",
    ],
  },
  {
    topic: "Mixer scale-up — Froude number similarity",
    prompt:
      "การพัฒนาสูตรตำรับใช้ high-shear granulator ระดับห้องปฏิบัติการ (impeller diameter 0.2 m, ความเร็วรอบ 300 rpm) เมื่อขยายขนาดสู่ระดับการผลิตจริงที่ใช้ impeller diameter 0.6 m ต้องการรักษาสภาวะการผสม/แรงเฉือนให้ใกล้เคียงเดิมโดยใช้หลัก Froude number คงที่ (Fr = ω²r/g) จงคำนวณความเร็วรอบที่เหมาะสมสำหรับเครื่องขนาดใหญ่",
    options: [
      "ประมาณ 173 rpm (คำนวณจาก Froude number คงที่: ω ∝ 1/√r)",
      "300 rpm เท่าเดิม (ใช้ความเร็วรอบเท่ากันโดยไม่ปรับตามขนาด)",
      "100 rpm (scale ตามสัดส่วนเส้นผ่านศูนย์กลางโดยตรงแบบ linear แทนที่จะใช้ความสัมพันธ์ผกผันรากที่สอง)",
      "33 rpm (scale ตามสัดส่วนเส้นผ่านศูนย์กลางยกกำลังสอง)",
      "900 rpm (scale ผิดทิศทาง เพิ่มความเร็วตามสัดส่วนขนาดที่ใหญ่ขึ้นแทนที่จะลด)",
    ],
    rationale:
      "การรักษา Froude number คงที่ (Fr=ω²r/g) ระหว่างสองขนาดหมายความว่า ω²r ต้องคงที่ ดังนั้น ω_scale-up = ω_lab × √(r_lab/r_scale-up) เมื่อรัศมีเพิ่มขึ้น ความเร็วรอบต้องลดลงตามความสัมพันธ์ผกผันรากที่สอง ไม่ใช่ลดแบบ linear หรือคงเดิม การคำนวณ: ω_prod = 300×√(0.1/0.3) = 300×0.577 ≈ 173 rpm",
    traps: [
      "ผิด — การใช้ความเร็วรอบเท่าเดิมโดยไม่ปรับตามขนาดที่ใหญ่ขึ้นจะทำให้แรงเฉือน/สภาวะการผสมที่ tip ของ impeller แตกต่างไปจากระดับ lab อย่างมาก",
      "ผิด — Froude scale-up ใช้ความสัมพันธ์ผกผันรากที่สองของรัศมี (ω∝1/√r) ไม่ใช่สัดส่วนผกผันเชิงเส้นโดยตรงกับเส้นผ่านศูนย์กลาง",
      "ผิด — การ scale ด้วยสัดส่วนยกกำลังสองไม่ตรงกับความสัมพันธ์ของ Froude number ทำให้ลดความเร็วมากเกินไป",
      "ผิด — ทิศทางของการ scale-up ผิด ยิ่งขนาด impeller ใหญ่ขึ้น ความเร็วรอบที่ต้องใช้เพื่อรักษา Froude number ควร**ลดลง** ไม่ใช่เพิ่มขึ้น",
    ],
    difficulty: "hard",
    ref: "Pharmaceutical granulation scale-up principles — Froude number similarity",
    calc: [
      "Fr คงที่: ω₁²r₁ = ω₂²r₂",
      "ω₂ = ω₁ × √(r₁/r₂) = 300 rpm × √(0.1 m / 0.3 m)",
      "ω₂ = 300 × √0.333 = 300 × 0.577 ≈ 173 rpm",
    ],
  },
  {
    topic: "Dissolution profile — f2 similarity factor calculation",
    prompt:
      "ข้อมูล dissolution profile ของ Reference และ Test product ที่เวลา 10, 20, 30, 45 นาที เป็นดังนี้\n\nReference (%): 30, 55, 75, 90\nTest (%): 25, 50, 70, 88\n\nจงคำนวณค่า f2 similarity factor และสรุปว่า profiles ทั้งสองมีความคล้ายคลึงกันหรือไม่ (เกณฑ์ f2 ≥ 50 = similar)",
    options: [
      "f2 ≈ 67 → profiles มีความคล้ายคลึงกัน (similar)",
      "f2 ≈ 82 (ลืมยกกำลังสองผลต่างแต่ละจุดก่อนหาค่าเฉลี่ย ใช้ผลต่างดิบแทน)",
      "เฉลี่ยผลต่างดิบที่แต่ละจุด (4.25%) ต่ำกว่า 10% จึงสรุปว่า similar โดยไม่ต้องคำนวณตามสูตร f2",
      "f2 ≈ 155 (ใช้ natural log แทน log10 ทำให้ได้ค่าที่เกินช่วงที่เป็นไปได้ของ f2 ซึ่งมีค่าสูงสุดคือ 100)",
      "Profiles ไม่ similar เพราะที่ 45 นาที Reference และ Test ต่างกัน 2% โดยพิจารณาจากจุดสุดท้ายเพียงจุดเดียว",
    ],
    rationale:
      "สูตร f2 = 50 × log10{[1 + (1/n)Σ(Rt−Tt)²]^−0.5 × 100} ต้องยกกำลังสองผลต่างแต่ละจุดก่อนหาค่าเฉลี่ย ไม่ใช่ใช้ผลต่างดิบ และต้องคำนวณตามสูตรที่กำหนดไว้อย่างเป็นทางการ ไม่ใช่ใช้ heuristic อย่างการเฉลี่ยผลต่างดิบเทียบกับ 10% ซึ่งไม่ใช่วิธีที่ regulatory ยอมรับ ผลต่างกำลังสอง: 5²+5²+5²+2²=79; (1/4)×79=19.75; 1+19.75=20.75; 20.75^−0.5≈0.2195; ×100≈21.95; log10(21.95)≈1.3415; f2=50×1.3415≈67.1 ซึ่ง ≥50 จึงถือว่า similar",
    traps: [
      "ผิด — ใช้ผลต่างดิบ (ไม่ยกกำลังสอง) ก่อนเฉลี่ย ทำให้ได้ค่า f2 ที่สูงเกินจริงจากสูตรที่ถูกต้อง",
      "ผิด — การใช้ heuristic เฉลี่ยผลต่างดิบเทียบ 10% ไม่ใช่วิธีคำนวณ f2 ที่ regulatory กำหนดไว้ แม้บางครั้งจะให้ข้อสรุปคล้ายกันโดยบังเอิญ แต่ไม่ใช่วิธีที่ยอมรับสำหรับการยื่นขึ้นทะเบียน",
      "ผิด — ค่า f2 ตามนิยามมีช่วงที่เป็นไปได้ตั้งแต่ 0 ถึง 100 เท่านั้น ค่าที่เกิน 100 บ่งชี้ข้อผิดพลาดในการคำนวณ (เช่น ใช้ log ฐานผิด)",
      "ผิด — การตัดสิน similarity ต้องพิจารณาข้อมูลทุกจุดเวลาร่วมกันผ่านสูตร f2 ไม่ใช่พิจารณาจุดใดจุดหนึ่งเพียงจุดเดียวโดยแยกจากภาพรวม",
    ],
    difficulty: "medium",
    ref: "FDA/EMA dissolution profile comparison — f2 similarity factor",
    calc: [
      "ผลต่างแต่ละจุด: (30-25)=5, (55-50)=5, (75-70)=5, (90-88)=2",
      "ยกกำลังสอง: 25+25+25+4 = 79",
      "(1/n)Σ = 79/4 = 19.75",
      "1 + 19.75 = 20.75 → 20.75^-0.5 ≈ 0.2195 → ×100 ≈ 21.95",
      "f2 = 50 × log10(21.95) ≈ 50 × 1.3415 ≈ 67.1 (≥50 → similar)",
    ],
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
    id: `ip1set2_d02_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 2/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 2 · ${d.topic}\n\n${d.prompt}`,
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
      "Manually drafted original IP1 item (Daily Set 2, Day 2/30) — not copied from any past exam. Editorial/technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-23 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 170,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY02: McqQuestion[] = D.map(buildQuestion);
