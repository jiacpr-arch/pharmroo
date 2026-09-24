import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 4 of 30 (10 questions/day plan)
// Topic focus: process validation lifecycle, equipment qualification,
// statistical/quality-systems tools, and manufacturing-technology topics
// (process capability, acceptance sampling, IQ/OQ/PQ, technology transfer
// batch sizing, dry vs wet granulation, particle size distribution,
// photostability, ASEAN climatic zone stability conditions, GAMP 5
// computer-system categorization, audit trail review).
// Distinct from IP1_PILOT_050 (lib/ip1-pilot-050.ts), Day 1 (cleanroom/
// HVAC), Day 2 (impurity/cleaning/elemental/scale-up) and Day 3
// (sterilization/aseptic processing) — cross-checked against all of them:
//   - existing bank has "Process validation" (basic concept-identification,
//     easy) and "Change control" (supplier-change scenario) — neither
//     computes a process capability index. Q1 here is a genuine Cpk
//     *calculation* that also traps the classic Cp-vs-Cpk confusion.
//   - existing bank has "Quality risk management / FMEA" (RPN
//     interpretation), "Blend uniformity / segregation" (stratified
//     sampling design for a content-uniformity trend) and "OOT vs OOS /
//     continued verification" (discriminating two confounded root causes in
//     an assay trend) — none of these touch acceptance sampling plans
//     (Q2), equipment qualification stage sequencing (Q3), exhibit-batch
//     sizing (Q4), or particle-size span (Q6).
//   - "Wet granulation" in the existing bank tests wet granulation itself;
//     Q5 here is about *choosing* dry granulation (roller compaction) over
//     wet granulation for a moisture/heat-sensitive API — a different,
//     comparative question.
//   - Photostability (ICH Q1B) calculation (Q7), ASEAN Zone IVb long-term
//     storage conditions (Q8; Day 2's stability question was ICH Q1E shelf-
//     life extrapolation, a different guideline and skill), GAMP 5 software
//     categorization (Q9), and audit-trail review as a data-integrity
//     control (Q10; distinct from the existing bank's "Data integrity /
//     manual integration," which is specifically about a chromatography
//     manual-integration scenario) do not appear anywhere in the existing
//     150-question bank or in Days 1-3.
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
const answerPositions = [1, 4, 2, 0, 3, 0, 3, 1, 4, 2];

const D: Draft[] = [
  {
    topic: "Process capability index (Cpk) calculation vs Cp",
    prompt:
      "การควบคุมน้ำหนักเม็ดยาระหว่างการผลิตมีข้อกำหนด Lower Specification Limit (LSL) = 190 mg และ Upper Specification Limit (USL) = 210 mg ข้อมูลจากการเก็บตัวอย่าง in-process control พบว่าน้ำหนักเม็ดเฉลี่ย (mean) = 202 mg และส่วนเบี่ยงเบนมาตรฐาน (SD) = 2.5 mg จงคำนวณค่า Process Capability Index (Cpk) และแปลผลว่ากระบวนการนี้มีความสามารถ (capable) เพียงพอหรือไม่ (เกณฑ์ทั่วไปที่ยอมรับคือ Cpk ≥ 1.33)",
    options: [
      "Cpk ≈ 1.07 (จำกัดโดยด้าน USL) ซึ่งต่ำกว่าเกณฑ์ที่ยอมรับ (≥1.33) แม้ค่าเฉลี่ยจะยังอยู่ในช่วง specification ก็ตาม แสดงว่ากระบวนการยังไม่ capable เพียงพอและมีความเสี่ยงผลิตหน่วยที่เกิน USL มากกว่าที่ควร",
      "Cp ≈ 1.33 ซึ่งผ่านเกณฑ์ที่ยอมรับ จึงสรุปได้ว่ากระบวนการ capable เพียงพอโดยไม่ต้องพิจารณาค่าอื่นเพิ่มเติม",
      "Cpk ≈ 1.6 (คำนวณจากด้าน LSL เพียงด้านเดียวโดยไม่นำค่าที่ต่ำกว่าจากอีกด้านมาเปรียบเทียบ)",
      "Cpk ≈ 0.53 (ใช้ตัวหาร 6×SD แทน 3×SD ในสูตร Cpk)",
      "Cpk เท่ากับ Cp เสมอในกรณีนี้ เพราะค่าเฉลี่ยยังอยู่ภายใน specification limits ทั้งสองด้าน",
    ],
    rationale:
      "Cpk = min[(USL−mean)/(3×SD), (mean−LSL)/(3×SD)] = min[(210−202)/(3×2.5), (202−190)/(3×2.5)] = min[1.067, 1.6] = 1.067 ซึ่งต่ำกว่าเกณฑ์ทั่วไปที่ยอมรับ (Cpk≥1.33) ต่างจาก Cp = (USL−LSL)/(6×SD) = 20/15 = 1.33 ซึ่งดูเหมือนผ่านเกณฑ์ — ความแตกต่างนี้เกิดเพราะ Cp ไม่พิจารณาตำแหน่งของค่าเฉลี่ยเทียบกับ spec (centering) ในขณะที่ Cpk พิจารณาด้วย กระบวนการนี้มีค่าเฉลี่ยเบี่ยงไปทาง USL มากกว่า LSL ทำให้ Cpk ต่ำกว่า Cp อย่างมีนัยสำคัญ และบ่งชี้ความเสี่ยงที่แท้จริงต่อการผลิตหน่วยเกิน USL",
    traps: [
      "ผิด — Cp ไม่พิจารณาตำแหน่งของค่าเฉลี่ยเทียบกับ spec limits (centering) จึงอาจให้ภาพที่ดีเกินจริงเมื่อกระบวนการเบี่ยงไปด้านใดด้านหนึ่ง ต้องดู Cpk ซึ่งพิจารณาด้านที่แย่กว่าเสมอ",
      "ผิด — Cpk ต้องนำค่าที่คำนวณได้จากทั้งสองด้าน (USL และ LSL) มาเปรียบเทียบแล้วเลือกค่าที่ต่ำกว่า (min) ไม่ใช่ใช้เพียงด้านเดียว",
      "ผิด — สูตร Cpk ใช้ตัวหาร 3×SD ไม่ใช่ 6×SD (6×SD ใช้ในสูตร Cp ซึ่งเป็นคนละดัชนีกัน)",
      "ผิด — Cpk จะเท่ากับ Cp ก็ต่อเมื่อกระบวนการอยู่กึ่งกลาง (centered) ระหว่าง USL และ LSL พอดีเท่านั้น กรณีนี้ค่าเฉลี่ยเบี่ยงไปทาง USL มากกว่า ทำให้ Cpk ต่ำกว่า Cp อย่างชัดเจน",
    ],
    difficulty: "hard",
    ref: "Statistical Process Control — Process Capability Indices (Cp vs Cpk)",
    calc: [
      "CPU = (USL−mean)/(3×SD) = (210−202)/(3×2.5) = 8/7.5 ≈ 1.067",
      "CPL = (mean−LSL)/(3×SD) = (202−190)/(3×2.5) = 12/7.5 = 1.6",
      "Cpk = min(CPU, CPL) = min(1.067, 1.6) = 1.067 (< 1.33 → ยังไม่ capable เพียงพอ)",
      "เปรียบเทียบ Cp = (USL−LSL)/(6×SD) = 20/15 = 1.33 (ดูผ่านเกณฑ์ แต่ไม่สะท้อนการเบี่ยงศูนย์กลางของกระบวนการ)",
    ],
  },
  {
    topic: "Acceptance sampling plan (ANSI/ASQ Z1.4) — Ac/Re decision",
    prompt:
      "การตรวจรับวัตถุดิบ (incoming inspection) ของ excipient ชนิดหนึ่ง: ขนาด lot = 3,000 หน่วยบรรจุ, Inspection Level II (general), AQL = 1.0% (normal inspection) ตามตาราง Single Sampling Plan ของ ANSI/ASQ Z1.4 กำหนด sample size code letter K (n=125 หน่วย) โดยมี Acceptance number (Ac) = 3 และ Rejection number (Re) = 4 เมื่อสุ่มตรวจ 125 หน่วยตามแผน พบหน่วยบกพร่อง 3 หน่วย ข้อใดคือการตัดสินใจที่ถูกต้องที่สุด",
    options: [
      "ยอมรับ lot (accept) ได้ เพราะจำนวนหน่วยบกพร่องที่พบ (3 หน่วย) ยังไม่เกิน Acceptance number (Ac=3) ตาม sampling plan — การตัดสินใจ accept/reject ใช้ Ac/Re number จากตาราง ไม่ใช่เปรียบเทียบสัดส่วน defect ในตัวอย่างกับค่า %AQL โดยตรง",
      "ต้องปฏิเสธ (reject) ทันที เพราะพบ defect อย่างน้อย 1 หน่วยในตัวอย่างที่สุ่มตรวจ",
      "ต้องปฏิเสธ เพราะสัดส่วน defect ในตัวอย่าง (3/125 = 2.4%) สูงกว่าค่า AQL ที่กำหนดไว้ (1.0%)",
      "ต้องสุ่มตัวอย่างเพิ่มอีกชุดหนึ่งขนาดเท่ากัน (125 หน่วย) เพื่อยืนยันผลก่อนตัดสินใจ accept/reject",
      "ต้องปฏิเสธเสมอ เพราะมาตรฐาน GMP ไม่อนุญาตให้พบ defect ใดๆ เลยในวัตถุดิบที่รับเข้า",
    ],
    rationale:
      "ตามหลัก Acceptance Sampling (ANSI/ASQ Z1.4) การตัดสินใจ accept/reject lot ใช้การเปรียบเทียบจำนวนหน่วยบกพร่องที่พบจริงกับค่า Acceptance number (Ac) และ Rejection number (Re) ที่กำหนดไว้ในตารางสำหรับ sample size code letter และ AQL ที่เลือกใช้ ไม่ใช่การเปรียบเทียบสัดส่วน defect ในตัวอย่างกับค่า %AQL โดยตรง (AQL เป็นพารามิเตอร์ที่ใช้ออกแบบ sampling plan ล่วงหน้าเท่านั้น) ในกรณีนี้พบ defect 3 หน่วยซึ่งยังไม่เกิน Ac=3 lot จึงยัง accept ได้ตาม single sampling plan นี้ (ซึ่งไม่มีขั้นตอน double sampling ตามที่ระบุ)",
    traps: [
      "ผิด — Sampling plan แบบนี้ไม่ใช่ zero-acceptance plan การพบ defect บางส่วนไม่ได้แปลว่าต้อง reject ทันที ต้องเทียบกับ Ac/Re ที่กำหนดไว้",
      "ผิด — สัดส่วน defect ในตัวอย่างไม่ใช่เกณฑ์ที่ใช้ตัดสินใจโดยตรง เกณฑ์ที่ใช้คือจำนวนหน่วยบกพร่องเทียบกับ Ac/Re number จากตาราง ซึ่งออกแบบมาให้สอดคล้องกับ AQL ในเชิงสถิติความน่าจะเป็นอยู่แล้ว",
      "ผิด — Single sampling plan ตามที่ระบุไม่มีขั้นตอนการสุ่มตัวอย่างเพิ่มเพื่อยืนยันผล การตัดสินใจสรุปได้จากตัวอย่างชุดแรกตาม Ac/Re ที่กำหนด",
      "ผิด — Acceptance sampling ที่ AQL 1.0% ยอมรับการมี defect ในสัดส่วนหนึ่งได้ตามหลักสถิติ ไม่ใช่ zero-defect requirement เสมอไป",
    ],
    difficulty: "hard",
    ref: "ANSI/ASQ Z1.4 (MIL-STD-105E equivalent) — Sampling Procedures and Tables for Inspection by Attributes",
    calc: [
      "Lot size 3,000 หน่วย, Inspection level II, AQL 1.0% → Sample size code letter K → n=125",
      "จากตาราง Single Sampling Plan (Normal Inspection) สำหรับ code letter K, AQL 1.0%: Ac=3, Re=4",
      "พบ defect จริง = 3 หน่วย ≤ Ac (3) → ACCEPT lot",
    ],
  },
  {
    topic: "Equipment qualification — IQ/OQ/PQ stage sequencing",
    prompt:
      "โรงงานติดตั้งเครื่องอัดเม็ดยา (tablet press) เครื่องใหม่ ต้องการยืนยันว่าเครื่องจักรเมื่อใช้งานร่วมกับสูตรตำรับและกระบวนการผลิตจริง สามารถผลิตเม็ดยาที่มีคุณภาพตรงตาม critical quality attributes ที่กำหนดได้อย่างสม่ำเสมอ (ไม่ใช่เพียงแค่เครื่องทำงานได้ตามช่วงพารามิเตอร์ที่ตั้งไว้) ขั้นตอนการ qualify ใดตรงกับวัตถุประสงค์นี้โดยตรงที่สุด",
    options: [
      "Operational Qualification (OQ) เพราะเป็นขั้นตอนที่ยืนยันว่าเครื่องทำงานได้ตามช่วงพารามิเตอร์การผลิตจริงเสมอ",
      "Performance Qualification (PQ) เพราะเป็นขั้นตอนที่ยืนยันว่าเครื่องจักรเมื่อใช้งานร่วมกับสูตรตำรับ/กระบวนการผลิตจริง (ไม่ใช่เพียงการทดสอบ functional ด้วยวัสดุจำลอง) สามารถผลิตผลิตภัณฑ์ที่มีคุณภาพตรงตามเกณฑ์ที่กำหนดได้อย่างสม่ำเสมอ",
      "Installation Qualification (IQ) เพราะเป็นขั้นตอนที่ยืนยันว่าการติดตั้งเครื่องจักรถูกต้องตามข้อกำหนดของผู้ผลิต",
      "Design Qualification (DQ) เพราะเป็นขั้นตอนที่ยืนยันว่าการออกแบบเครื่องจักรตรงตาม user requirement specification ตั้งแต่ก่อนจัดซื้อ",
      "การทบทวน User Requirement Specification (URS) เพราะเป็นเอกสารที่กำหนดคุณสมบัติที่เครื่องจักรต้องมีตั้งแต่ต้น",
    ],
    rationale:
      "Performance Qualification (PQ) คือขั้นตอนสุดท้ายของ equipment qualification ที่ยืนยันว่าเครื่องจักร เมื่อทำงานร่วมกับกระบวนการและวัสดุ/สูตรตำรับที่ใช้ในการผลิตจริง (ไม่ใช่เพียงวัสดุจำลองหรือการทดสอบ functional เปล่าๆ) สามารถผลิตผลิตภัณฑ์ที่มีคุณภาพตรงตามเกณฑ์ที่กำหนดได้อย่างสม่ำเสมอ ต่างจาก OQ ที่ยืนยันเพียงว่าเครื่องทำงานได้ตามช่วงพารามิเตอร์ที่ระบุ (มักทดสอบด้วยวัสดุจำลองโดยไม่จำเป็นต้องเชื่อมโยงกับ critical quality attributes ของผลิตภัณฑ์จริง) และต่างจาก IQ ที่ยืนยันเพียงความถูกต้องของการติดตั้ง (utilities, calibration certificates, เอกสารประกอบ) ก่อนการทดสอบเชิงปฏิบัติการใดๆ",
    traps: [
      "ผิด — OQ ยืนยันว่าเครื่องทำงานได้ตามช่วงพารามิเตอร์การทำงาน (functional range) ที่กำหนด ซึ่งมักทดสอบด้วยวัสดุจำลองโดยไม่จำเป็นต้องยืนยันคุณภาพของผลิตภัณฑ์จริงที่ผลิตได้",
      "ผิด — IQ เป็นขั้นตอนแรกที่ยืนยันความถูกต้องของการติดตั้ง (สาธารณูปโภค การเดินสาย ใบรับรองการสอบเทียบ เอกสารประกอบ) เท่านั้น ยังไม่เกี่ยวข้องกับการทดสอบเชิงปฏิบัติการหรือคุณภาพผลิตภัณฑ์",
      "ผิด — DQ เกิดขึ้นก่อนการจัดซื้อ/ติดตั้งเครื่องจักร เพื่อยืนยันว่าการออกแบบตรงตามข้อกำหนดที่ต้องการ ยังไม่ใช่การยืนยันสมรรถนะจริงของเครื่องจักรที่ติดตั้งแล้ว",
      "ผิด — การทบทวน URS เป็นเอกสารตั้งต้นที่กำหนดคุณสมบัติที่ต้องการ ไม่ใช่ขั้นตอนการทดสอบเพื่อยืนยันสมรรถนะของเครื่องจักรที่ติดตั้งจริง",
    ],
    difficulty: "medium",
    ref: "ISPE Baseline Guide — Commissioning and Qualification; ICH Q7 equipment qualification stages (IQ/OQ/PQ)",
  },
  {
    topic: "Technology transfer — exhibit/pivotal batch minimum size calculation",
    prompt:
      "บริษัทวางแผนผลิตยาเม็ดชนิดหนึ่งที่ระดับ commercial scale = 600,000 เม็ด/batch และต้องการผลิต exhibit/pivotal batch (batch ที่ใช้สนับสนุนข้อมูล bioequivalence/stability ประกอบการยื่นทะเบียน) โดยหลักเกณฑ์ทั่วไปกำหนดขนาดขั้นต่ำของ exhibit batch เป็นค่าที่มากกว่าระหว่าง 1/10 ของขนาด commercial batch หรือ 100,000 หน่วย (แล้วแต่ค่าใดมากกว่า) จงคำนวณขนาด exhibit batch ขั้นต่ำที่ยอมรับได้สำหรับกรณีนี้",
    options: [
      "60,000 เม็ด (ใช้ 1/10 ของ commercial batch เพียงอย่างเดียวโดยไม่เทียบกับเกณฑ์ขั้นต่ำ 100,000 หน่วย)",
      "100,000 เม็ด เพราะแม้ 1/10 ของ commercial batch (60,000 เม็ด) จะน้อยกว่า แต่ต้องใช้ค่าที่มากกว่าระหว่างสองเกณฑ์ (1/10 ของ commercial scale หรือ 100,000 หน่วย) จึงต้องใช้ 100,000 เม็ดเป็นขั้นต่ำ",
      "600,000 เม็ด (เข้าใจผิดว่า exhibit batch ต้องมีขนาดเท่ากับ commercial batch เต็มจำนวน)",
      "6,000 เม็ด (คำนวณ 1/100 แทนที่จะเป็น 1/10 ของ commercial batch)",
      "300,000 เม็ด (ใช้ 1/2 ของ commercial batch แทนอัตราส่วน 1/10 ที่ถูกต้อง)",
    ],
    rationale:
      "หลักเกณฑ์ทั่วไปสำหรับ exhibit/pivotal batch กำหนดขนาดขั้นต่ำเป็นค่าที่มากกว่าระหว่าง 1/10 ของขนาด commercial batch ที่วางแผนจริง หรือ 100,000 หน่วย (แล้วแต่ค่าใดมากกว่า) ในกรณีนี้ 1/10 ของ 600,000 เม็ด = 60,000 เม็ด ซึ่งน้อยกว่าเกณฑ์ขั้นต่ำสัมบูรณ์ 100,000 หน่วย จึงต้องใช้ 100,000 เม็ดเป็นขนาด exhibit batch ขั้นต่ำ ไม่ใช่ 60,000 เม็ด — ตัวอย่างนี้แสดงให้เห็นว่าเมื่อ commercial batch ไม่ใหญ่มากนัก เกณฑ์ขั้นต่ำสัมบูรณ์ (100,000 หน่วย) จะเป็นตัวกำหนดแทนอัตราส่วน 1/10",
    traps: [
      "ผิด — ต้องเปรียบเทียบ 1/10 ของ commercial batch กับเกณฑ์ขั้นต่ำสัมบูรณ์ (100,000 หน่วย) เสมอ แล้วเลือกค่าที่มากกว่า ไม่ใช่ใช้อัตราส่วน 1/10 ตรงๆ โดยไม่เทียบ",
      "ผิด — Exhibit batch ไม่จำเป็นต้องมีขนาดเท่ากับ commercial batch เต็มจำนวน เพียงต้องผ่านเกณฑ์ขั้นต่ำที่กำหนด (ค่าที่มากกว่าระหว่าง 1/10 ของ commercial scale หรือ 100,000 หน่วย)",
      "ผิด — อัตราส่วนที่ถูกต้องคือ 1/10 ไม่ใช่ 1/100 ของขนาด commercial batch",
      "ผิด — อัตราส่วนที่ถูกต้องคือ 1/10 ไม่ใช่ 1/2 ของขนาด commercial batch",
    ],
    difficulty: "hard",
    ref: "FDA SUPAC / exhibit batch scale-up general principles — technology transfer batch sizing",
    calc: [
      "1/10 ของ commercial batch = 600,000 × (1/10) = 60,000 เม็ด",
      "เกณฑ์ขั้นต่ำสัมบูรณ์ = 100,000 เม็ด",
      "ขนาด exhibit batch ขั้นต่ำ = max(60,000, 100,000) = 100,000 เม็ด",
    ],
  },
  {
    topic: "Dry granulation (roller compaction) vs wet granulation — selection rationale",
    prompt:
      "API ตัวหนึ่งไวต่อความชื้นและความร้อนสูง (moisture- and heat-sensitive) แต่มี compressibility ต่ำและ powder flow ไม่ดีเมื่อใช้วิธี direct compression เพียงอย่างเดียว การเลือกใช้ dry granulation ด้วย roller compaction แทน wet granulation มีเหตุผลหลักที่ถูกต้องที่สุดตามข้อใด",
    options: [
      "Roller compaction (dry granulation) ไม่ใช้ของเหลว/ความร้อนในการทำ granule (ใช้แรงกลอัดผงผ่าน roller แล้วบดเป็น granule) จึงหลีกเลี่ยงความเสี่ยงต่อการสลายตัว/ไม่คงตัวของ API ที่ไวต่อความชื้นและความร้อน ในขณะที่ยังช่วยปรับปรุง compressibility/flow เมื่อเทียบกับ direct compression เพียงอย่างเดียว",
      "Roller compaction ให้ compressibility และ powder flow ที่ดีกว่า wet granulation เสมอในทุกกรณี จึงเป็นตัวเลือกที่เหนือกว่าทางกลศาสตร์โดยไม่มีข้อแลกเปลี่ยนใดๆ",
      "Roller compaction ใช้เวลานานกว่าและมีต้นทุนสูงกว่า wet granulation เสมอ แต่เลือกใช้เพราะให้ผลลัพธ์ที่คุ้มค่ากว่าในระยะยาว",
      "Wet granulation ไม่มีความเสี่ยงต่อ API ที่ไวต่อความชื้นเลย เพราะมีขั้นตอนการอบแห้ง (drying) ชดเชยความชื้นที่สัมผัสระหว่างกระบวนการได้อย่างสมบูรณ์",
      "การเลือกวิธี granulation ไม่มีผลต่อ chemical stability ของ API เพราะเป็นเพียงกระบวนการทางกายภาพ (physical process) เท่านั้น ไม่เกี่ยวข้องกับปฏิกิริยาเคมีใดๆ",
    ],
    rationale:
      "Roller compaction เป็นกระบวนการ dry granulation ที่ใช้แรงกลอัดผงให้เป็นแผ่น (ribbon) แล้วบดเป็น granule โดยไม่ต้องใช้ของเหลว (binder solution) หรือขั้นตอนการอบแห้งด้วยความร้อน จึงเหมาะสำหรับ API ที่ไวต่อความชื้นและความร้อนซึ่งอาจสลายตัว/ไม่คงตัวหากสัมผัสกับสภาวะดังกล่าวระหว่าง wet granulation ในขณะเดียวกันยังช่วยปรับปรุง compressibility และ powder flow ให้ดีกว่าการทำ direct compression กับผงที่ไหลไม่ดีโดยตรง อย่างไรก็ตาม roller compaction ไม่ได้ให้ compressibility/flow ที่ดีกว่า wet granulation เสมอไป (wet granulation มักให้แรงยึดเกาะระหว่างอนุภาคที่แข็งแรงกว่าจาก binder solution) การเลือกใช้จึงขึ้นอยู่กับความไวของ API ต่อความชื้น/ความร้อนเป็นหลัก ไม่ใช่ความเหนือกว่าทางกลศาสตร์โดยทั่วไป",
    traps: [
      "ผิด — Wet granulation มักให้แรงยึดเกาะระหว่างอนุภาคที่แข็งแรงกว่าจาก binder solution จึงมักให้ compressibility/flow ที่ดีกว่า roller compaction ในหลายกรณี เหตุผลหลักในการเลือก roller compaction คือการหลีกเลี่ยงความชื้น/ความร้อน ไม่ใช่ความเหนือกว่าทางกลศาสตร์เสมอไป",
      "ผิด — Roller compaction เป็นกระบวนการ dry แบบ single-step โดยทั่วไปเร็วกว่าและมีต้นทุนต่ำกว่า wet granulation เนื่องจากไม่มีขั้นตอนการอบแห้งที่ใช้เวลานาน",
      "ผิด — ความเสี่ยงต่อ API ที่ไวต่อความชื้นเกิดขึ้นระหว่างช่วง wet massing ที่ API สัมผัสกับความชื้น/binder solution โดยตรง ขั้นตอนการอบแห้งภายหลังไม่สามารถย้อนกลับการสลายตัวที่อาจเกิดขึ้นแล้วในช่วงนั้นได้",
      "ผิด — การสัมผัสความชื้นและความร้อนระหว่างกระบวนการผลิตสามารถกระตุ้นปฏิกิริยาเคมี (เช่น hydrolysis) ที่ทำให้ API สลายตัวได้ การเลือกวิธี granulation จึงมีผลโดยตรงต่อ chemical stability ไม่ใช่เพียงกระบวนการทางกายภาพที่ไม่เกี่ยวข้องกัน",
    ],
    difficulty: "medium",
    ref: "Aulton's Pharmaceutics — dry granulation (roller compaction) vs wet granulation selection criteria",
  },
  {
    topic: "Particle size distribution — D10/D50/D90 Span calculation",
    prompt:
      "การวิเคราะห์ particle size distribution ของผงยาด้วย laser diffraction ให้ผล D10 = 15 µm, D50 = 45 µm, D90 = 105 µm จงคำนวณค่า Span (ตัวชี้วัดความกว้างของการกระจายขนาดอนุภาค) แล้วเปรียบเทียบกับวัตถุดิบอีกชนิดหนึ่งที่มี Span = 1.2 ว่าการกระจายขนาดอนุภาคของวัตถุดิบใดกว้างกว่ากัน (มีความเสี่ยงต่อ segregation/content uniformity มากกว่า)",
    options: [
      "Span = (D90−D10)/D90 = 90/105 ≈ 0.857 (ใช้ D90 เป็นตัวหารแทนที่จะเป็น D50)",
      "Span = 2.0 (คำนวณจาก (D90−D10)/D50 = 90/45) ซึ่งกว้างกว่าวัตถุดิบเปรียบเทียบ (Span=1.2) แสดงว่าวัตถุดิบนี้มีการกระจายขนาดอนุภาคไม่สม่ำเสมอมากกว่า และมีความเสี่ยงต่อปัญหา segregation/content uniformity มากกว่า",
      "Span = D90/D10 = 105/15 = 7.0 (ใช้อัตราส่วน D90 ต่อ D10 โดยตรงแทนสูตร Span ที่ถูกต้อง)",
      "Span = D90−D10 = 90 µm (รายงานเป็นค่าพิสัยสัมบูรณ์โดยไม่หารด้วย D50 เพื่อ normalize)",
      "Span ที่คำนวณได้ (2.0) แคบกว่าวัตถุดิบเปรียบเทียบ (Span=1.2) จึงมีการกระจายขนาดอนุภาคสม่ำเสมอกว่า",
    ],
    rationale:
      "Span คำนวณจากสูตร (D90−D10)/D50 = (105−15)/45 = 90/45 = 2.0 ซึ่งเป็นตัวชี้วัดความกว้าง (normalize ด้วยค่ามัธยฐาน D50) ของการกระจายขนาดอนุภาค ค่า Span ที่สูงกว่าหมายถึงการกระจายขนาดอนุภาคที่กว้าง/ไม่สม่ำเสมอมากกว่า เมื่อเทียบกับวัตถุดิบอื่นที่มี Span=1.2 (แคบกว่า) วัตถุดิบในโจทย์นี้ (Span=2.0) จึงมีการกระจายขนาดอนุภาคกว้างกว่า และมีความเสี่ยงต่อปัญหา powder flow ที่ไม่สม่ำเสมอและ segregation/content uniformity มากกว่า",
    traps: [
      "ผิด — สูตร Span มาตรฐานใช้ D50 เป็นตัวหาร (normalize ด้วยค่ามัธยฐาน) ไม่ใช่ D90",
      "ผิด — Span ไม่ใช่อัตราส่วน D90/D10 โดยตรง แต่เป็น (D90−D10)/D50 ซึ่งเป็นคนละสูตรกัน",
      "ผิด — การรายงานเป็นค่าพิสัยสัมบูรณ์ (D90−D10) โดยไม่ normalize ด้วย D50 ทำให้ไม่สามารถเปรียบเทียบความกว้างสัมพัทธ์ของการกระจายขนาดระหว่างวัตถุดิบที่มีขนาดอนุภาคเฉลี่ยต่างกันได้อย่างถูกต้อง",
      "ผิด — ทิศทางการแปลผลสลับกัน ค่า Span ที่สูงกว่า (2.0 เทียบกับ 1.2) หมายถึงการกระจายขนาดอนุภาคที่กว้างกว่า/ไม่สม่ำเสมอมากกว่า ไม่ใช่แคบกว่า",
    ],
    difficulty: "hard",
    ref: "Laser diffraction particle sizing — Span calculation and implications for powder flow/content uniformity",
    calc: [
      "Span = (D90−D10)/D50 = (105−15)/45",
      "= 90/45 = 2.0",
      "เทียบกับวัตถุดิบอื่น (Span=1.2) → Span ที่นี่ (2.0) กว้างกว่า → การกระจายขนาดอนุภาคไม่สม่ำเสมอมากกว่า",
    ],
  },
  {
    topic: "Photostability testing (ICH Q1B) — confirmatory exposure (lux-hours) calculation",
    prompt:
      "การทดสอบ confirmatory photostability ตาม ICH Q1B Option 2 กำหนดให้ตัวอย่างได้รับแสงรวมไม่น้อยกว่า 1,200,000 lux-hours (และ near-UV energy ไม่น้อยกว่า 200 W-hr/m²) ห้องปฏิบัติการตั้งค่าความเข้มแสง (illuminance) คงที่ที่ 6,000 lux ตลอดการทดสอบ จงคำนวณระยะเวลาขั้นต่ำ (ชั่วโมง) ที่ต้องเปิดรับแสงเพื่อให้ได้ค่า lux-hours ตามเกณฑ์ขั้นต่ำของ ICH Q1B",
    options: [
      "20 ชั่วโมง (คำนวณ 1,200,000/6,000 แต่เลื่อนทศนิยมผิดตำแหน่ง)",
      "2,000 ชั่วโมง (ใช้ค่าความเข้มแสงผิดหน่วยไปหนึ่งหลัก เช่นหารด้วย 600 แทน 6,000)",
      "200 ชั่วโมง (1,200,000 ÷ 6,000 lux)",
      "72 ชั่วโมง (ใช้เกณฑ์ครบ 3 วันตามที่คุ้นเคยจากการทดสอบ stability ทั่วไป แทนที่จะคำนวณจากค่า lux-hours ที่กำหนดจริง)",
      "1,200,000 ชั่วโมง (เข้าใจผิดว่าค่า lux-hours ที่กำหนดคือจำนวนชั่วโมงโดยตรง โดยไม่นำไปหารด้วยค่าความเข้มแสง)",
    ],
    rationale:
      "ระยะเวลาขั้นต่ำที่ต้องเปิดรับแสง = ค่า lux-hours รวมที่ต้องการ ÷ ค่าความเข้มแสง (illuminance) ที่ใช้ = 1,200,000 ÷ 6,000 = 200 ชั่วโมง หากใช้เวลาน้อยกว่านี้ที่ความเข้มแสงเท่ากันจะยังไม่ครบเกณฑ์ขั้นต่ำของ ICH Q1B Option 2 (ต้องตรวจสอบเกณฑ์ near-UV energy ≥200 W-hr/m² ควบคู่กันด้วย ซึ่งเป็นเงื่อนไขที่ต้องผ่านทั้งสองค่าพร้อมกัน)",
    traps: [
      "ผิด — 1,200,000÷6,000 เท่ากับ 200 ไม่ใช่ 20 การเลื่อนทศนิยมผิดตำแหน่งทำให้ได้ระยะเวลาที่น้อยกว่าความเป็นจริงถึง 10 เท่า ซึ่งจะทำให้ตัวอย่างได้รับแสงไม่ครบตามเกณฑ์",
      "ผิด — ค่าความเข้มแสงที่กำหนดในโจทย์คือ 6,000 lux ไม่ใช่ 600 lux การใช้ค่าผิดหน่วยทำให้ได้ระยะเวลาที่มากเกินความเป็นจริง 10 เท่า",
      "ผิด — ระยะเวลามาตรฐาน 3 วัน (72 ชั่วโมง) ไม่ใช่เกณฑ์ที่ใช้กับ photostability testing ตาม ICH Q1B ซึ่งกำหนดด้วยค่า lux-hours/UV energy สะสม ไม่ใช่ระยะเวลาคงที่ตายตัว",
      "ผิด — ค่า 1,200,000 lux-hours คือปริมาณแสงสะสม (lux × ชั่วโมง) ไม่ใช่จำนวนชั่วโมงโดยตรง ต้องหารด้วยค่าความเข้มแสงที่ใช้จริงจึงจะได้ระยะเวลาที่ต้องการ",
    ],
    difficulty: "hard",
    ref: "ICH Q1B — Photostability Testing of New Drug Substances and Products",
    calc: [
      "Total exposure required (Option 2) = 1,200,000 lux-hours (ขั้นต่ำ)",
      "Illuminance ที่ใช้ = 6,000 lux",
      "ระยะเวลาขั้นต่ำ = 1,200,000 ÷ 6,000 = 200 ชั่วโมง",
    ],
  },
  {
    topic: "ASEAN climatic zone (Zone IVb) — long-term stability storage condition",
    prompt:
      "การขึ้นทะเบียนยาในประเทศไทยจัดอยู่ใน ASEAN Climatic Zone IVb (hot & very humid climate) ตามแนวทาง ASEAN Guideline on Stability Study เงื่อนไข long-term stability storage condition ที่ถูกต้องสำหรับ Zone IVb คือข้อใด",
    options: [
      "25°C ± 2°C / 60%RH ± 5%RH (เงื่อนไขของ Zone II ซึ่งใช้ในบางประเทศเขตอบอุ่น ไม่ใช่เงื่อนไขที่กำหนดสำหรับ ASEAN Zone IVb)",
      "30°C ± 2°C / 65%RH ± 5%RH (เงื่อนไขของ Zone IVa ซึ่งใกล้เคียงแต่มี %RH ต่ำกว่า Zone IVb)",
      "40°C ± 2°C / 75%RH ± 5%RH (เงื่อนไขของ accelerated stability testing ไม่ใช่ long-term storage condition)",
      "30°C ± 2°C / 75%RH ± 5%RH",
      "25°C ± 2°C / 75%RH ± 5%RH (ผสมอุณหภูมิของ Zone II กับ %RH ของ Zone IVb ซึ่งไม่ตรงกับเงื่อนไขมาตรฐานของ zone ใดเลย)",
    ],
    rationale:
      "ASEAN Climatic Zone IVb (hot & very humid climate ซึ่งครอบคลุมประเทศไทยและกลุ่มประเทศ ASEAN ส่วนใหญ่) กำหนดเงื่อนไข long-term stability storage condition ที่ 30°C ± 2°C / 75%RH ± 5%RH ซึ่งแตกต่างจาก Zone II (25°C/60%RH ที่ใช้ในบางประเทศเขตอบอุ่น) และ Zone IVa (30°C/65%RH) การเลือกเงื่อนไข storage ที่ไม่ตรงกับ climatic zone ที่ยื่นทะเบียนจะทำให้ข้อมูล stability ไม่สนับสนุนอายุยาที่กำหนดในตลาดที่มีสภาพอากาศร้อนชื้นจัดอย่างแท้จริง",
    traps: [
      "ผิด — 25°C/60%RH เป็นเงื่อนไข Zone II ซึ่งใช้กับประเทศเขตอบอุ่น (เช่นบางส่วนของยุโรป/สหรัฐฯ) ไม่ใช่เงื่อนไขที่เหมาะสมสำหรับการขึ้นทะเบียนในประเทศไทยซึ่งอยู่ใน Zone IVb",
      "ผิด — 30°C/65%RH เป็นเงื่อนไขของ Zone IVa (hot humid) ซึ่งมี %RH ต่ำกว่า Zone IVb (75%RH) เป็นค่าที่ใกล้เคียงแต่ไม่ตรงกับ zone ที่ประเทศไทยจัดอยู่",
      "ผิด — 40°C/75%RH เป็นเงื่อนไขมาตรฐานของ accelerated stability testing (ระยะสั้น 6 เดือน) ไม่ใช่เงื่อนไข long-term storage ที่ใช้กำหนดอายุยาหลัก",
      "ผิด — การผสมอุณหภูมิของ Zone II กับ %RH ของ Zone IVb ไม่ตรงกับเงื่อนไขมาตรฐานของ climatic zone ใดๆ ที่กำหนดไว้ในแนวทาง ICH Q1A(R2)/ASEAN Guideline",
    ],
    difficulty: "medium",
    ref: "ASEAN Guideline on Stability Study of Drug Product; ICH Q1A(R2) — climatic zones",
  },
  {
    topic: "GAMP 5 — computer system (software) categorization and risk-based validation",
    prompt:
      "บริษัทกำลัง validate ระบบคอมพิวเตอร์ 2 ระบบ: (1) เครื่องชั่งอิเล็กทรอนิกส์ที่มี firmware มาตรฐานจากผู้ผลิตโดยไม่มีการปรับแต่ง configuration ใดๆ เพิ่มเติม และ (2) ระบบ Laboratory Information Management System (LIMS) ที่ติดตั้ง software สำเร็จรูปแต่มีการปรับแต่ง (configure) workflow/business rules ให้ตรงกับกระบวนการภายในองค์กรอย่างมาก ตามหลัก GAMP 5 ทั้งสองระบบควรจัดอยู่ใน software category ใด และมีผลต่อขอบเขตการ validate อย่างไร",
    options: [
      "ทั้งสองระบบจัดเป็น Category 5 (custom-coded software) เพราะเป็นระบบที่ใช้ในงาน regulated environment เหมือนกันทั้งคู่",
      "เครื่องชั่งจัดเป็น Category 4 เพราะมีการเชื่อมต่อกับระบบอื่น ส่วน LIMS จัดเป็น Category 3 เพราะเป็น software สำเร็จรูปที่ซื้อมาใช้งาน",
      "เครื่องชั่ง (firmware มาตรฐาน ไม่ปรับแต่ง) จัดเป็น Category 3 (non-configured product) ต้องการ verification ระดับพื้นฐาน ส่วน LIMS ที่ configure workflow/business rules อย่างมากจัดเป็น Category 4 (configured product) ซึ่งต้องการ validation ที่ครอบคลุมมากขึ้น รวมถึงการทดสอบ configuration ที่ปรับแต่งเฉพาะองค์กร โดยทั้งสองต่างจาก Category 5 (custom-coded) ที่ต้อง validate ตั้งแต่ระดับ source code",
      "ทั้งสองระบบต้องการขอบเขตการ validate เท่ากันทุกประการ เพราะเป็นระบบคอมพิวเตอร์ที่ใช้ในกระบวนการ GMP เหมือนกัน",
      "Category ของระบบคอมพิวเตอร์ไม่มีผลต่อขอบเขตการ validate เพราะทุกระบบต้องผ่านการ validate แบบเดียวกันตามหลัก GMP",
    ],
    rationale:
      "ตามหลัก GAMP 5 ซึ่งเป็นแนวทาง risk-based สำหรับ computer system validation: เครื่องชั่งที่ใช้ firmware มาตรฐานโดยไม่มีการปรับแต่ง configuration จัดเป็น Category 3 (non-configured product) ซึ่งต้องการเพียงการยืนยันการทำงานพื้นฐาน (เช่น calibration/functional check) ในขณะที่ LIMS ที่มีการ configure workflow/business rules อย่างมากตามความต้องการเฉพาะขององค์กรจัดเป็น Category 4 (configured product) ซึ่งต้องการขอบเขตการ validate ที่ครอบคลุมมากขึ้น รวมถึงการทดสอบ configuration/business rules ที่ปรับแต่งเฉพาะ ทั้งสอง category นี้ต่างจาก Category 5 (custom-coded software) ที่พัฒนาโค้ดขึ้นเฉพาะ ซึ่งต้องการการ validate ที่ครอบคลุมตั้งแต่ระดับ design/source code review",
    traps: [
      "ผิด — Category ไม่ได้ขึ้นอยู่กับว่าเป็น regulated environment หรือไม่ แต่ขึ้นอยู่กับลักษณะของการปรับแต่ง (customization) ของระบบนั้นๆ ระบบที่ไม่มีการปรับแต่งใดๆ ไม่ควรจัดเป็น Category 5",
      "ผิด — การจัดประเภทสลับกัน เครื่องชั่งที่ไม่มีการปรับแต่ง configuration ควรจัดเป็น Category 3 ส่วน LIMS ที่ configure workflow/business rules อย่างมากควรจัดเป็น Category 4 ไม่ใช่ในทางกลับกัน",
      "ผิด — หลักการ risk-based ของ GAMP 5 กำหนดให้ขอบเขตการ validate แปรผันตาม category/ความเสี่ยงของระบบ ไม่ใช่ใช้ขอบเขตเดียวกันกับทุกระบบ",
      "ผิด — GAMP 5 เป็นแนวทาง risk-based โดยเฉพาะ ซึ่งกำหนดขอบเขตการ validate ให้สอดคล้องกับ category และความเสี่ยงของระบบแต่ละประเภท ไม่ใช่ใช้แนวทางเดียวกันหมดโดยไม่พิจารณา category",
    ],
    difficulty: "medium",
    ref: "GAMP 5 (2nd ed.) — Software categorization and risk-based validation approach",
  },
  {
    topic: "Data integrity — audit trail review requirement (ALCOA+)",
    prompt:
      "ระบบ Chromatography Data System (CDS) ของ HPLC ในห้องปฏิบัติการ QC มีฟังก์ชัน audit trail ที่บันทึกการแก้ไข/ลบข้อมูลโดยอัตโนมัติ และเปิดใช้งานฟังก์ชันนี้ไว้ตั้งแต่การติดตั้งระบบ ข้อใดสอดคล้องกับหลัก data integrity (ALCOA+) เกี่ยวกับการใช้งาน audit trail นี้มากที่สุด",
    options: [
      "การเปิดใช้งาน audit trail ตั้งแต่ installation เพียงพอแล้วต่อการปฏิบัติตาม data integrity โดยไม่จำเป็นต้องมีการทบทวน (review) เพิ่มเติมอีก",
      "Audit trail review จำเป็นเฉพาะเมื่อเกิดข้อสงสัยหรือมีการร้องเรียนเกี่ยวกับข้อมูลเท่านั้น",
      "ต้องมีการทบทวน (review) audit trail อย่างสม่ำเสมอตามความถี่ที่กำหนดโดยประเมินความเสี่ยง (เช่น ทุกครั้งที่มีการอนุมัติผลการทดสอบ หรือตามรอบที่กำหนด) เพื่อตรวจสอบว่ามีการแก้ไข/ลบข้อมูลที่ผิดปกติหรือไม่ได้รับอนุญาตหรือไม่ ไม่ใช่เพียงแค่เปิดใช้งานฟังก์ชันไว้เฉยๆ",
      "ควรปิด audit trail ในบางช่วงเวลาเพื่อลดขนาดไฟล์ข้อมูลที่ระบบต้องบันทึกไว้",
      "Audit trail มีความสำคัญเฉพาะกับข้อมูลที่ใช้ประกอบการยื่นทะเบียนเท่านั้น ไม่เกี่ยวข้องกับข้อมูลการทดสอบประจำวันทั่วไป",
    ],
    rationale:
      "หลัก data integrity (ALCOA+) กำหนดว่าการมีฟังก์ชัน audit trail เปิดใช้งานอยู่เพียงอย่างเดียวไม่เพียงพอ ต้องมีกระบวนการทบทวน (review) audit trail อย่างสม่ำเสมอโดยผู้ที่มีความรับผิดชอบ (เช่น ทุกครั้งที่มีการอนุมัติผลการทดสอบ หรือตามความถี่ที่กำหนดจากการประเมินความเสี่ยง) เพื่อตรวจจับการแก้ไข/ลบข้อมูลที่ผิดปกติหรือไม่ได้รับอนุญาตในเชิงรุก (proactive) ไม่ใช่รอให้เกิดข้อสงสัยหรือข้อร้องเรียนก่อนจึงจะตรวจสอบ (reactive) ซึ่งขัดกับเจตนารมณ์ของการควบคุม data integrity ที่ต้องครอบคลุมข้อมูล GxP ทั้งหมด ไม่จำกัดเฉพาะข้อมูลที่ใช้ยื่นทะเบียน",
    traps: [
      "ผิด — การเปิดใช้งาน audit trail เป็นเพียงเงื่อนไขจำเป็นเบื้องต้น (necessary) แต่ไม่เพียงพอ (not sufficient) ต่อการปฏิบัติตาม data integrity ต้องมีการทบทวนเป็นประจำร่วมด้วยเสมอ",
      "ผิด — การรอให้เกิดข้อสงสัยหรือข้อร้องเรียนก่อนจึงตรวจสอบเป็นแนวทางเชิงรับ (reactive) ซึ่งขัดกับหลักการควบคุม data integrity ที่ควรเป็นเชิงรุก (proactive) ตามความถี่ที่กำหนดจากการประเมินความเสี่ยง",
      "ผิด — การปิด audit trail แม้เพียงชั่วคราวเพื่อลดขนาดไฟล์ถือเป็นการละเมิด data integrity อย่างร้ายแรง เพราะทำให้ไม่สามารถติดตามการเปลี่ยนแปลงข้อมูลในช่วงเวลานั้นได้ audit trail ต้องเปิดใช้งานต่อเนื่องตลอดเวลา",
      "ผิด — หลัก data integrity ครอบคลุมข้อมูล GxP ที่เกี่ยวข้องทั้งหมด ไม่จำกัดเฉพาะข้อมูลที่ใช้ประกอบการยื่นทะเบียน ข้อมูลการทดสอบประจำวันก็ต้องได้รับการควบคุมด้วยหลักการเดียวกัน",
    ],
    difficulty: "medium",
    ref: "MHRA/PIC/S Data Integrity Guidance — ALCOA+ principles for computerized systems",
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
    id: `ip1set2_d04_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 4/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 4 · ${d.topic}\n\n${d.prompt}`,
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
      "Manually drafted original IP1 item (Daily Set 2, Day 4/30) — not copied from any past exam. Editorial/technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-24 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 190,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY04: McqQuestion[] = D.map(buildQuestion);
