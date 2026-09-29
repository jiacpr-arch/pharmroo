import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 7 of 30 (10 questions/day plan)
// Topic focus: pharmaceutical water systems, Good Distribution Practice
// (GDP)/cold-chain validation, statistical process control (SPC), and
// dosage-form manufacturing/troubleshooting deep-dives (weight variation,
// capsule filling, elastic recovery, HLB, 21 CFR Part 11, extractables
// study design).
// Distinct from IP1_PILOT_050 (lib/ip1-pilot-050.ts) and Days 1-6 — cross-
// checked against all of them:
//   - existing bank's "Pharmaceutical water" item tests conductivity/TOC as
//     general-purpose analytical indicators conceptually; it does not walk
//     through the USP <645> Stage 1 temperature-based limit table or the
//     Stage 1 -> Stage 2 escalation logic, so Q1 tests a different,
//     calculation/interpretation-based skill.
//   - existing bank's "Content uniformity" item is about *choosing*
//     uniformity-of-dosage-units as the right control for a low-dose,
//     segregation-prone product; it never applies the USP <905> tiered
//     weight-variation percentage table to compute an actual acceptable
//     weight range, so Q5 is a different (calculation) skill.
//   - Day 4 covered process capability (Cpk/Cp) and acceptance sampling
//     (Ac/Re), not Shewhart X-bar control-chart limits; Q3 here is a
//     genuinely different SPC tool (control charting vs capability
//     indices/sampling plans).
//   - Day 5's Mean Kinetic Temperature question was about *calculating* a
//     single MKT value from a temperature log; Q4 here is about
//     *designing* a temperature-mapping study (sensor placement, seasonal/
//     worst-case coverage) to find hot/cold spots before deployment — a
//     different stage of the same broader GDP topic, not a repeat.
//   - Day 2's extractables & leachables question was a Safety Concern
//     Threshold *calculation*; Q10 here is about *study design* (choosing
//     exaggerated vs simulated extraction conditions) — a different skill
//     within the same broader E&L topic area.
//   - WFI production methods (Q2), elastic recovery from a force-
//     displacement curve (Q7), HLB blend calculation (Q8), capsule-filling
//     mechanism selection (Q6), and 21 CFR Part 11 electronic signature
//     requirements (Q9) do not appear anywhere in the existing 150-
//     question bank or in Days 1-6.
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
const answerPositions = [0, 3, 1, 4, 2, 2, 4, 1, 3, 0];

const D: Draft[] = [
  {
    topic: "USP <645> Water Conductivity — Stage 1 temperature-based limit interpretation",
    prompt:
      "น้ำตัวอย่างจากระบบ Purified Water วัด conductivity ที่อุณหภูมิ 20°C ได้ผล 1.1 µS/cm ตาราง Stage 1 ของ USP <645> กำหนดเกณฑ์ที่อุณหภูมิ 20°C ไว้ไม่เกิน 1.0 µS/cm การดำเนินการที่ถูกต้องที่สุดคือข้อใด",
    options: [
      "ผลเกินเกณฑ์ Stage 1 ที่อุณหภูมิที่วัดได้จริง (20°C) จึงต้องดำเนินการทดสอบต่อใน Stage 2 (ปรับอุณหภูมิตัวอย่างให้อยู่ในช่วงที่กำหนด เติม KCl ปรับ pH และวัดซ้ำพร้อมแก้ไขผลจาก CO2) ก่อนจึงจะสรุปได้ว่าน้ำนี้ไม่ผ่านเกณฑ์",
      "สรุปว่าน้ำนี้ไม่ผ่านเกณฑ์ (fail) ได้ทันที เพราะ conductivity ที่วัดได้เกินค่าที่กำหนดไว้ใน Stage 1 แล้ว",
      "ผ่านเกณฑ์ได้ เพราะ 1.1 µS/cm ยังต่ำกว่าเกณฑ์ทั่วไปที่มักอ้างอิงที่ 25°C (1.3 µS/cm) โดยไม่ต้องพิจารณาเกณฑ์ที่อุณหภูมิที่วัดจริง",
      "ไม่ต้องดำเนินการใดๆ เพิ่มเติม เพราะ Stage 1 เป็นเพียงขั้นตอนคัดกรองเบื้องต้นที่ไม่มีผลผูกพันต่อการตัดสินคุณภาพน้ำ",
      "ต้องปรับอุณหภูมิตัวอย่างให้คงที่ที่ 20°C แล้ววัดซ้ำด้วยวิธี Stage 1 เดิมอีกครั้งเสมอ โดยไม่ต้องเปลี่ยนไปใช้ขั้นตอน Stage 2",
    ],
    rationale:
      "USP <645> Stage 1 กำหนดเกณฑ์ conductivity limit ที่แปรผันตามอุณหภูมิที่วัดได้จริง (ไม่ใช่ปรับเป็น 25°C) หากผลที่วัดได้เกินเกณฑ์ Stage 1 ที่อุณหภูมินั้นๆ ไม่ได้แปลว่าน้ำ fail ทันที แต่ต้องดำเนินการต่อใน Stage 2 ซึ่งเป็นการทดสอบที่ควบคุมเงื่อนไขมากขึ้น (ปรับอุณหภูมิตัวอย่างให้อยู่ในช่วงที่กำหนด เติม KCl เพื่อให้เกิดการแตกตัวที่เหมาะสม ปรับ pH ให้อยู่ในช่วงที่กำหนด และแก้ไขผลกระทบจาก CO2 ที่ละลายในน้ำ) ก่อนจึงจะสามารถสรุปผลสุดท้ายว่าน้ำผ่านหรือไม่ผ่านเกณฑ์ได้",
    traps: [
      "ผิด — การเกินเกณฑ์ Stage 1 เป็นเพียงสัญญาณให้ดำเนินการทดสอบต่อใน Stage 2 ไม่ใช่การสรุปผล fail ทันทีโดยไม่ผ่านขั้นตอนที่กำหนดไว้ในวิธีมาตรฐาน",
      "ผิด — เกณฑ์ Stage 1 ต้องใช้ค่าที่กำหนดไว้ ณ อุณหภูมิที่วัดตัวอย่างได้จริง ไม่ใช่นำเกณฑ์ที่อุณหภูมิอื่น (เช่น 25°C) มาเทียบกับผลที่วัดได้ที่อุณหภูมิต่างกัน",
      "ผิด — การเกินเกณฑ์ Stage 1 เป็นผลที่มีความหมายและต้องดำเนินการตามขั้นตอนที่กำหนดต่อไป ไม่ใช่ข้อมูลที่ไม่มีผลผูกพันใดๆ",
      "ผิด — เมื่อผลเกินเกณฑ์ Stage 1 ขั้นตอนถัดไปตามวิธีมาตรฐานคือการทดสอบ Stage 2 ซึ่งมีเงื่อนไขที่ต่างจาก Stage 1 (ปรับอุณหภูมิ เติม KCl ปรับ pH) ไม่ใช่การวัดซ้ำด้วยวิธี Stage 1 เดิม",
    ],
    difficulty: "hard",
    ref: "USP <645> Water Conductivity — Stage 1/Stage 2 testing procedure",
    calc: [
      "เกณฑ์ Stage 1 ที่ 20°C = 1.0 µS/cm (ตามตารางอุณหภูมิ-เกณฑ์ของ USP <645>)",
      "ผลที่วัดได้จริง = 1.1 µS/cm > 1.0 µS/cm → เกินเกณฑ์ Stage 1 ที่อุณหภูมินี้",
      "ต้องดำเนินการทดสอบต่อใน Stage 2 ก่อนสรุปผลสุดท้าย",
    ],
  },
  {
    topic: "Water for Injection (WFI) — production methods and control requirements",
    prompt:
      "ตามการปรับปรุงเภสัชตำรับสากลฉบับปัจจุบัน (เช่น Ph.Eur ฉบับที่แก้ไขในประเด็นวิธีการผลิต WFI) การผลิต Water for Injection (WFI) สามารถทำได้ด้วยวิธีใดบ้าง และมีข้อกำหนดสำคัญอย่างไร",
    options: [
      "สามารถผลิตได้ทั้งด้วย distillation (วิธีดั้งเดิม) และ membrane-based process ที่เหมาะสม (เช่น reverse osmosis ร่วมกับ ultrafiltration หรือ electrodeionization) โดยไม่จำกัดเฉพาะ distillation อีกต่อไป แต่ต้องมีการควบคุมและ validate ระบบอย่างเข้มงวดเพื่อให้มั่นใจในคุณภาพเทียบเท่า เช่น การควบคุม bioburden และ endotoxin รวมถึงระบบ monitoring ต่อเนื่อง",
      "ต้องผลิตด้วย distillation เท่านั้นเสมอ ไม่สามารถใช้ membrane-based process ได้ไม่ว่าในกรณีใด เพราะเภสัชตำรับสากลไม่เคยปรับปรุงข้อกำหนดในประเด็นนี้",
      "Purified Water และ Water for Injection มีข้อกำหนดด้าน microbiological/endotoxin limit เหมือนกันทุกประการ ไม่มีความแตกต่างที่มีนัยสำคัญ",
      "การใช้ membrane-based process ในการผลิต WFI ไม่จำเป็นต้องมีการ validate หรือ monitor เพิ่มเติมใดๆ เพราะเป็นเทคโนโลยีที่เชื่อถือได้อยู่แล้วโดยธรรมชาติ",
      "WFI สามารถผลิตได้จาก Purified Water โดยการกรองผ่าน sterilizing-grade filter (0.2 µm) เพียงขั้นตอนเดียวโดยไม่ต้องผ่านกระบวนการอื่นเพิ่มเติม",
    ],
    rationale:
      "การปรับปรุงเภสัชตำรับสากล (เช่น Ph.Eur) ในระยะหลังได้ขยายขอบเขตวิธีการผลิต WFI ให้ครอบคลุมทั้ง distillation แบบดั้งเดิมและ membrane-based process ที่เหมาะสม (เช่น RO ร่วมกับ UF หรือ electrodeionization) จากเดิมที่จำกัดเฉพาะ distillation เท่านั้น อย่างไรก็ตามไม่ว่าจะเลือกใช้วิธีใด ระบบต้องได้รับการออกแบบ ควบคุม และ validate อย่างเข้มงวดเพื่อให้มั่นใจว่าคุณภาพน้ำ (โดยเฉพาะการควบคุม bioburden และ bacterial endotoxin ซึ่งเป็นข้อกำหนดที่เข้มงวดกว่า Purified Water อย่างชัดเจน) เป็นไปตามเกณฑ์ที่กำหนดอย่างสม่ำเสมอ",
    traps: [
      "ผิด — เภสัชตำรับสากลฉบับปรับปรุงได้ยอมรับให้ใช้ membrane-based process ในการผลิต WFI ได้แล้ว ไม่ได้จำกัดเฉพาะ distillation อีกต่อไป ซึ่งเป็นการเปลี่ยนแปลงที่สำคัญจากข้อกำหนดฉบับเก่า",
      "ผิด — WFI มีข้อกำหนดด้าน bacterial endotoxin ที่เข้มงวดกว่า Purified Water อย่างชัดเจน ซึ่งเป็นความแตกต่างสำคัญระหว่างน้ำสองเกรดนี้",
      "ผิด — ไม่ว่าจะเลือกใช้วิธีการผลิตแบบใด ระบบยังคงต้องมีการ validate และ monitor คุณภาพน้ำอย่างต่อเนื่องเพื่อยืนยันความสม่ำเสมอของกระบวนการ ไม่ใช่ไว้วางใจได้โดยอัตโนมัติ",
      "ผิด — การผลิต WFI ต้องอาศัยกระบวนการที่ควบคุมทั้ง bioburden, endotoxin, และคุณภาพทางเคมีอย่างครบถ้วนตามที่เภสัชตำรับกำหนด ไม่ใช่เพียงการกรองผ่าน sterilizing-grade filter ขั้นตอนเดียว ซึ่งไม่เพียงพอต่อการกำจัด endotoxin",
    ],
    difficulty: "medium",
    ref: "Ph.Eur monograph revision — Water for Injection production methods (distillation and membrane-based processes)",
  },
  {
    topic: "Statistical Process Control — X-bar chart control limit (UCL/LCL) calculation",
    prompt:
      "การควบคุมน้ำหนักเม็ดยาด้วย X-bar control chart จากข้อมูล subgroup (n=5 ต่อกลุ่ม) พบว่าค่าเฉลี่ยรวม (grand mean, X-double-bar) = 200 mg และค่าเฉลี่ยของ range แต่ละ subgroup (R-bar) = 8 mg โดยใช้ค่าคงที่ A2 สำหรับ n=5 เท่ากับ 0.577 จงคำนวณ Upper Control Limit (UCL) และ Lower Control Limit (LCL) ของ X-bar chart นี้",
    options: [
      "UCL ≈ 204.6 mg, LCL ≈ 195.4 mg (คำนวณจาก X-double-bar ± A2×R-bar)",
      "UCL = 208 mg, LCL = 192 mg (ใช้ค่าคงที่ A2 = 1.0 แทนค่าคงที่จริงสำหรับ n=5)",
      "UCL = LCL = 200 mg (ใช้ grand mean เป็นทั้ง UCL และ LCL โดยไม่บวก/ลบส่วนของ A2×R-bar)",
      "UCL ≈ 204.6 mg, LCL = 200 mg (บวกส่วนเบี่ยงเบนเฉพาะด้านบนแต่ไม่ลบส่วนเบี่ยงเบนด้านล่างจาก grand mean)",
      "UCL ≈ 195.4 mg, LCL ≈ 204.6 mg (สลับค่า UCL กับ LCL ที่คำนวณได้)",
    ],
    rationale:
      "สูตรคำนวณ control limit ของ X-bar chart คือ UCL = X-double-bar + A2×R-bar และ LCL = X-double-bar − A2×R-bar เมื่อแทนค่า: A2×R-bar = 0.577×8 = 4.616 ดังนั้น UCL = 200+4.616 ≈ 204.6 mg และ LCL = 200−4.616 ≈ 195.4 mg ค่าคงที่ A2 ขึ้นกับขนาด subgroup (n) และต้องใช้ค่าที่ตรงกับ n ที่ใช้จริงจากตารางมาตรฐาน (สำหรับ n=5 คือ 0.577) ไม่ใช่ค่าใดก็ได้",
    traps: [
      "ผิด — ค่าคงที่ A2 ต้องใช้ตามขนาด subgroup (n) จากตารางมาตรฐาน สำหรับ n=5 ค่าที่ถูกต้องคือ 0.577 ไม่ใช่ 1.0 การใช้ค่าคงที่ผิดทำให้ UCL/LCL คลาดเคลื่อนจากความเป็นจริง",
      "ผิด — UCL และ LCL ต้องคำนวณจาก grand mean บวก/ลบด้วย A2×R-bar เสมอ ไม่ใช่ใช้ grand mean เป็นทั้งสองค่าโดยไม่มีส่วนเบี่ยงเบนใดๆ ซึ่งจะทำให้ control chart ไม่มีความหมายในการตรวจจับความผันแปร",
      "ผิด — การคำนวณ control limit ต้องบวกส่วนเบี่ยงเบน (A2×R-bar) เข้ากับ grand mean เพื่อหา UCL และลบส่วนเบี่ยงเบนเดียวกันออกจาก grand mean เพื่อหา LCL อย่างสมมาตรกันทั้งสองด้าน ไม่ใช่ปรับเฉพาะด้านใดด้านหนึ่ง",
      "ผิด — UCL ต้องมีค่าสูงกว่า grand mean และ LCL ต้องมีค่าต่ำกว่า grand mean เสมอ การสลับค่าทั้งสองทำให้ทิศทางของ control limit ผิดจากนิยามพื้นฐานของ control chart",
    ],
    difficulty: "hard",
    ref: "Statistical Process Control (SPC) — Shewhart X-bar/R control chart principles",
    calc: [
      "A2×R-bar = 0.577 × 8 mg = 4.616 mg",
      "UCL = X-double-bar + A2×R-bar = 200 + 4.616 ≈ 204.6 mg",
      "LCL = X-double-bar − A2×R-bar = 200 − 4.616 ≈ 195.4 mg",
    ],
  },
  {
    topic: "GDP — temperature mapping study design (hot spot/cold spot identification)",
    prompt:
      "การทำ temperature mapping study ของห้องเก็บยา (warehouse) เพื่อระบุตำแหน่ง hot spot และ cold spot ก่อนกำหนดตำแหน่งติดตั้ง continuous temperature monitoring sensor ควรออกแบบการศึกษาอย่างไรจึงจะเหมาะสมที่สุดตามหลัก Good Distribution Practice (GDP)",
    options: [
      "ควรครอบคลุมสภาวะที่ท้าทายที่สุด (worst-case) เช่น ฤดูกาลที่มีอุณหภูมิภายนอกสูงสุด/ต่ำสุด (summer/winter profile) ทั้งสภาวะ door-open/door-closed หรือช่วงที่มีการเคลื่อนย้ายสินค้าจำนวนมาก โดยใช้ data logger จำนวนเพียงพอกระจายทั่วพื้นที่ (รวมตำแหน่งใกล้ประตู ใกล้ผนัง มุมห้อง และจุดกึ่งกลาง) เป็นระยะเวลาต่อเนื่องตามที่กำหนด เพื่อระบุตำแหน่ง hot spot/cold spot ที่แท้จริงก่อนกำหนดตำแหน่งติดตั้ง sensor",
      "ทำการศึกษาเพียงครั้งเดียวในฤดูกาลใดก็ได้ที่สะดวกต่อการดำเนินการ โดยไม่จำเป็นต้องครอบคลุมสภาวะฤดูกาลที่ท้าทายที่สุด",
      "ติดตั้ง data logger เพียงจุดเดียวที่บริเวณกึ่งกลางห้องก็เพียงพอ เพราะเป็นตำแหน่งที่เป็นตัวแทนของอุณหภูมิทั้งห้องอยู่แล้ว",
      "ไม่จำเป็นต้องพิจารณาสภาวะ door-open/door-closed ในการศึกษา เพราะการเปิด-ปิดประตูไม่มีผลต่ออุณหภูมิภายในห้องอย่างมีนัยสำคัญ",
      "ควรทำการศึกษาในช่วงเวลาสั้นที่สุดเท่าที่จะทำได้ (ไม่เกิน 1 ชั่วโมง) เพื่อลดภาระงานและต้นทุนของการทำ mapping study",
    ],
    rationale:
      "การทำ temperature mapping study ที่มีความหมายทางวิทยาศาสตร์ต้องออกแบบให้ครอบคลุมสภาวะที่ท้าทายที่สุด (worst-case) ทั้งด้านฤดูกาล (summer/winter) และด้านการดำเนินงาน (door-open/door-closed, ช่วง peak activity) พร้อมกระจาย data logger ให้ครอบคลุมตำแหน่งที่มีความเสี่ยงสูง (ใกล้ประตู ใกล้ผนังภายนอก มุมห้อง) และตำแหน่งอ้างอิง (กึ่งกลางห้อง) เป็นระยะเวลาต่อเนื่องเพียงพอ (เช่น ครบรอบการทำงานปกติอย่างน้อย 24 ชั่วโมงในแต่ละฤดูกาล) เพื่อให้ระบุตำแหน่ง hot spot/cold spot ที่แท้จริงได้ก่อนตัดสินใจตำแหน่งติดตั้ง continuous monitoring sensor ในระยะยาว",
    traps: [
      "ผิด — การทำ mapping เพียงฤดูกาลเดียวไม่สามารถครอบคลุมสภาวะที่ท้าทายที่สุดได้ครบถ้วน อาจพลาดการตรวจพบ hot spot/cold spot ที่เกิดขึ้นเฉพาะในบางฤดูกาล",
      "ผิด — การติดตั้งจุดเดียวที่กึ่งกลางห้องไม่สามารถระบุตำแหน่งที่มีความเสี่ยงสูง (เช่น ใกล้ประตูหรือผนังภายนอก) ซึ่งมักเป็นตำแหน่งที่อุณหภูมิเบี่ยงเบนมากที่สุด",
      "ผิด — การเปิด-ปิดประตูมีผลโดยตรงต่ออุณหภูมิบริเวณใกล้ประตูและอาจกระทบต่ออุณหภูมิโดยรวมของห้อง จึงต้องนำมาพิจารณาเป็นส่วนหนึ่งของสภาวะที่ท้าทายในการศึกษา",
      "ผิด — ระยะเวลาการศึกษาที่สั้นเกินไปไม่สามารถจับความผันแปรของอุณหภูมิตลอดรอบการทำงานปกติ (เช่น ช่วงกลางวัน/กลางคืน หรือช่วงที่มีกิจกรรมสูง) ได้อย่างครบถ้วน",
    ],
    difficulty: "medium",
    ref: "WHO/PIC/S Good Distribution Practice (GDP) — temperature mapping study principles",
  },
  {
    topic: "USP <905> Uniformity of Dosage Units — weight variation tiered tolerance calculation",
    prompt:
      "ยาเม็ดชนิดหนึ่งมีน้ำหนักเฉลี่ยต่อเม็ด = 130 mg ตาม USP <905> เกณฑ์ weight variation (สำหรับเม็ดที่เข้าเงื่อนไขให้ใช้วิธีนี้แทน content uniformity ได้) กำหนดช่วงยอมรับตามน้ำหนักเฉลี่ยดังนี้: น้ำหนักเฉลี่ย ≤80 mg ใช้ ±10%, มากกว่า 80 mg ถึง 250 mg ใช้ ±7.5%, มากกว่า 250 mg ใช้ ±5% จงคำนวณช่วงน้ำหนักที่ยอมรับได้ต่อเม็ดของยานี้",
    options: [
      "120.25 – 139.75 mg (ใช้เกณฑ์ ±7.5% เพราะน้ำหนักเฉลี่ย 130 mg อยู่ในช่วง >80 ถึง 250 mg)",
      "123.5 – 136.5 mg (ใช้เกณฑ์ ±5% ซึ่งเป็นเกณฑ์ของกลุ่มน้ำหนักเฉลี่ยมากกว่า 250 mg ไม่ตรงกับน้ำหนักเฉลี่ยของยานี้)",
      "9.75 mg (รายงานเฉพาะค่าความคลาดเคลื่อนที่คำนวณได้ ไม่ใช่ช่วงน้ำหนักที่ยอมรับได้จริงของเม็ดยา)",
      "117 – 143 mg (ใช้เกณฑ์ ±10% ซึ่งเป็นเกณฑ์ของกลุ่มน้ำหนักเฉลี่ยไม่เกิน 80 mg ไม่ตรงกับน้ำหนักเฉลี่ยของยานี้)",
      "130 mg เท่านั้น (เข้าใจผิดว่าทุกเม็ดต้องมีน้ำหนักเท่ากับค่าเฉลี่ยพอดีโดยไม่มีช่วงยอมรับ)",
    ],
    rationale:
      "น้ำหนักเฉลี่ยของเม็ดยานี้ (130 mg) อยู่ในช่วง 'มากกว่า 80 mg ถึง 250 mg' จึงต้องใช้เกณฑ์ ±7.5% ตาม USP <905> ไม่ใช่เกณฑ์ของกลุ่มน้ำหนักอื่น คำนวณค่าความคลาดเคลื่อนที่ยอมรับได้ = 130×0.075 = 9.75 mg ดังนั้นช่วงน้ำหนักที่ยอมรับได้ต่อเม็ด = 130−9.75 ถึง 130+9.75 = 120.25 – 139.75 mg",
    traps: [
      "ผิด — เกณฑ์ ±5% ใช้กับกลุ่มน้ำหนักเฉลี่ยมากกว่า 250 mg เท่านั้น น้ำหนักเฉลี่ยของยานี้ (130 mg) ไม่เข้าเกณฑ์กลุ่มนี้ การใช้เกณฑ์ผิดกลุ่มทำให้ช่วงที่ยอมรับได้แคบเกินความเป็นจริง",
      "ผิด — ค่าความคลาดเคลื่อน (9.75 mg) เป็นเพียงส่วนหนึ่งของการคำนวณ ไม่ใช่คำตอบสุดท้ายที่ต้องการ ต้องนำไปบวก/ลบกับน้ำหนักเฉลี่ยเพื่อหาช่วงที่ยอมรับได้",
      "ผิด — เกณฑ์ ±10% ใช้กับกลุ่มน้ำหนักเฉลี่ยไม่เกิน 80 mg เท่านั้น น้ำหนักเฉลี่ยของยานี้ (130 mg) เกินเกณฑ์กลุ่มนี้ไปแล้ว การใช้เกณฑ์ผิดกลุ่มทำให้ช่วงที่ยอมรับได้กว้างเกินความเป็นจริง",
      "ผิด — USP <905> weight variation กำหนดช่วงยอมรับที่มีความคลาดเคลื่อนได้ตามเปอร์เซ็นต์ที่กำหนด ไม่ใช่ข้อกำหนดว่าทุกเม็ดต้องมีน้ำหนักเท่ากับค่าเฉลี่ยเป๊ะโดยไม่มีความคลาดเคลื่อนใดๆ เลย",
    ],
    difficulty: "hard",
    ref: "USP <905> Uniformity of Dosage Units — weight variation method, tiered percentage tolerance",
    calc: [
      "น้ำหนักเฉลี่ย 130 mg อยู่ในช่วง >80–250 mg → ใช้เกณฑ์ ±7.5%",
      "ค่าความคลาดเคลื่อน = 130 × 0.075 = 9.75 mg",
      "ช่วงที่ยอมรับได้ = 130 − 9.75 ถึง 130 + 9.75 = 120.25 – 139.75 mg",
    ],
  },
  {
    topic: "Capsule filling — dosator vs tamping-finger (dosing disc) mechanism selection",
    prompt:
      "การเลือกเครื่องบรรจุแคปซูลชนิด dosator กับชนิด tamping-finger (dosing disc) ขึ้นอยู่กับคุณสมบัติของผงยา/granule เป็นหลัก ข้อใดอธิบายหลักการเลือกที่เหมาะสมที่สุด",
    options: [
      "Dosator เหมาะกับผง/granule ที่มี cohesiveness เพียงพอที่จะขึ้นรูปเป็น plug ได้ด้วยแรงอัดที่เกิดขึ้นภายในกลไกของตัวเครื่องเอง จึงรองรับ formulation ได้หลากหลายรวมถึงผงที่ sticky หรือมีความชื้นบ้าง ในขณะที่ tamping-finger/dosing disc เหมาะกับผงที่มี flow และ compressibility ที่ดีสม่ำเสมอ เนื่องจากอาศัยการอัดผงหลายชั้นซ้ำๆ ด้วย finger หลายอันในแต่ละสถานี ซึ่งต้องการผงที่ไหลเติมโพรงได้สม่ำเสมอในแต่ละชั้น",
      "Tamping-finger เหมาะกับผงที่มี cohesiveness ต่ำมากและไหลไม่ดีเสมอ เพราะกลไกการอัดหลายชั้นสามารถชดเชยปัญหาการไหลของผงได้อย่างสมบูรณ์ในทุกกรณี",
      "Dosator ไม่เหมาะกับผงที่มี cohesiveness สูงเลยแม้แต่น้อย เพราะแรงอัดที่เกิดขึ้นจะทำให้ plug แตกหักระหว่างการส่งเข้าโพรงแคปซูลเสมอ",
      "ทั้งสองกลไกให้ผลลัพธ์ด้านความสม่ำเสมอของน้ำหนักบรรจุที่เหมือนกันทุกประการไม่ว่าจะใช้กับผงชนิดใด การเลือกจึงไม่มีนัยสำคัญต่อคุณภาพผลิตภัณฑ์",
      "Tamping-finger เหมาะกับผงทุกชนิดโดยไม่มีข้อจำกัดด้านคุณสมบัติการไหลเลย เพราะใช้แรงอัดที่สูงกว่า dosator เสมอในทุกสถานการณ์",
    ],
    rationale:
      "กลไก dosator สร้าง plug ของผงภายในท่อ (tube) ด้วยแรงอัดที่เกิดจากกลไกของตัวเครื่องเอง จึงสามารถรองรับผง/granule ที่มี cohesiveness เพียงพอในการยึดเกาะเป็น plug ได้ดี แม้จะมีความชื้นหรือความเหนียวบ้าง ในขณะที่กลไก tamping-finger/dosing disc อาศัยการอัดผงหลายชั้นในแต่ละสถานี (station) ซ้ำๆ ซึ่งแต่ละชั้นต้องอาศัยการไหลของผงเข้าสู่โพรงของ dosing disc อย่างสม่ำเสมอ จึงเหมาะกับผงที่มี flow และ compressibility ที่ดีและสม่ำเสมอมากกว่า การเลือกกลไกที่ไม่เหมาะกับคุณสมบัติของผงจะนำไปสู่ปัญหาความแปรปรวนของน้ำหนักบรรจุ (fill weight variation) ที่สูงขึ้น",
    traps: [
      "ผิด — Tamping-finger ยังคงต้องอาศัยการไหลของผงเข้าสู่โพรง dosing disc ในแต่ละชั้นอย่างสม่ำเสมอ ผงที่ไหลไม่ดีมากจะยังคงทำให้เกิดปัญหาความแปรปรวนของน้ำหนักบรรจุแม้จะใช้กลไกนี้ก็ตาม ไม่ใช่ชดเชยได้อย่างสมบูรณ์",
      "ผิด — Dosator สามารถรองรับผงที่มี cohesiveness ได้ในระดับหนึ่ง (แม้จะไม่เหมาะกับทุกระดับความเหนียว) และมักเป็นตัวเลือกที่ดีกว่า tamping-finger สำหรับผงที่ไหลไม่ดีแต่ยังคงยึดเกาะกันได้พอสมควร",
      "ผิด — กลไกทั้งสองแบบมีความไวต่อคุณสมบัติของผงที่แตกต่างกัน และให้ผลด้านความสม่ำเสมอของน้ำหนักบรรจุที่แตกต่างกันอย่างมีนัยสำคัญเมื่อใช้กับผงที่ไม่เหมาะสมกับกลไกนั้นๆ",
      "ผิด — Tamping-finger ยังคงมีข้อจำกัดด้านคุณสมบัติการไหลของผงที่ต้องพิจารณา ไม่ใช่รองรับผงทุกชนิดได้โดยไม่มีข้อจำกัดใดๆ",
    ],
    difficulty: "medium",
    ref: "Capsule filling machine principles — dosator vs tamping-finger (dosing disc) mechanisms",
  },
  {
    topic: "Tablet compression — elastic recovery calculation from force-displacement data",
    prompt:
      "การวิเคราะห์ force-displacement curve ระหว่าง tablet compression พบว่าความหนาของเม็ดยาขณะรับแรงอัดสูงสุด (thickness under maximum load) = 3.20 mm และความหนาของเม็ดยาหลังถูกดันออกจากแม่พิมพ์ (thickness at ejection ซึ่งเกิดขึ้นหลัง elastic recovery) = 3.50 mm จงคำนวณ % elastic recovery และประเมินความเสี่ยงต่อการเกิด capping/lamination",
    options: [
      "% elastic recovery ≈ 9.4% [(3.50−3.20)/3.20×100] ซึ่งค่อนข้างสูง บ่งชี้ความเสี่ยงต่อการเกิด capping/lamination เนื่องจากเม็ดยาคลายตัว (ขยายตัว) กลับมากหลังถูกปลดแรงอัด อาจทำให้เกิดความเค้นภายในสะสมจนแยกชั้นหรือแตกที่ผิวเม็ด",
      "% elastic recovery ≈ 9.4% (คำนวณถูกต้อง) แต่สรุปว่าไม่มีความเสี่ยงต่อการเกิด capping/lamination ใดๆ เพราะเม็ดยายังคงรูปทรงเดิมอยู่ครบถ้วนหลัง ejection",
      "% elastic recovery ≈ −9.4% [(3.20−3.50)/3.20×100] และแปลผลว่าเม็ดยาหดตัวลงหลังถูกดันออกจากแม่พิมพ์",
      "% elastic recovery ≈ 8.6% [(3.50−3.20)/3.50×100] โดยใช้ความหนาที่ ejection เป็นตัวหารแทนความหนาขณะรับแรงอัดสูงสุด",
      "ผลต่างความหนา 0.30 mm มีความหมายเป็น 0.30% โดยตรงโดยไม่ต้องคำนวณเทียบสัดส่วนกับความหนาขณะรับแรงอัดสูงสุด",
    ],
    rationale:
      "% elastic recovery คำนวณจาก [(ความหนาที่ ejection − ความหนาขณะรับแรงอัดสูงสุด) ÷ ความหนาขณะรับแรงอัดสูงสุด] × 100 = [(3.50−3.20)/3.20]×100 ≈ 9.4% ค่า % elastic recovery ที่ค่อนข้างสูงบ่งชี้ว่าเม็ดยาคลายตัว (ขยายความหนา) กลับมากหลังจากแรงอัดถูกปลดออก ซึ่งสัมพันธ์กับความเสี่ยงที่สูงขึ้นต่อการเกิด capping (การแยกชั้นบนของเม็ดยา) หรือ lamination (การแยกชั้นภายในเนื้อเม็ด) เนื่องจากความเค้นภายในที่สะสมจากการคลายตัวอย่างรวดเร็วหลัง ejection",
    traps: [
      "ผิด — ตัวเลข % elastic recovery ที่คำนวณได้ถูกต้อง แต่ข้อสรุปผิด ค่า elastic recovery ที่สูงเป็นสัญญาณเตือนความเสี่ยงต่อ capping/lamination ไม่ใช่หลักฐานว่าไม่มีความเสี่ยงใดๆ",
      "ผิด — สูตรที่ถูกต้องใช้ (ความหนาที่ ejection ลบด้วยความหนาขณะรับแรงอัดสูงสุด) เป็นตัวตั้ง ไม่ใช่สลับทิศทางการลบ ซึ่งจะให้ค่าติดลบที่ตีความผิดทิศทางไปจากความเป็นจริงทางกายภาพของการคลายตัว",
      "ผิด — ตัวหารที่ถูกต้องในการคำนวณ % elastic recovery คือความหนาขณะรับแรงอัดสูงสุด (thickness under load) ไม่ใช่ความหนาที่ ejection ซึ่งจะให้ค่าเปอร์เซ็นต์ที่คลาดเคลื่อนจากนิยามมาตรฐาน",
      "ผิด — ผลต่างความหนา (mm) ต้องนำไปหารด้วยความหนาขณะรับแรงอัดสูงสุดแล้วคูณ 100 เพื่อให้ได้หน่วยเป็นเปอร์เซ็นต์ที่มีความหมาย ไม่ใช่นำตัวเลขความหนาดิบมาอ่านเป็นเปอร์เซ็นต์โดยตรง",
    ],
    difficulty: "hard",
    ref: "Tablet compaction — elastic recovery from force-displacement curve; capping/lamination root-cause analysis",
    calc: [
      "% elastic recovery = [(thickness at ejection − thickness under max load) ÷ thickness under max load] × 100",
      "= [(3.50 − 3.20) ÷ 3.20] × 100 = (0.30 ÷ 3.20) × 100 ≈ 9.4%",
      "ค่าที่ค่อนข้างสูง → ความเสี่ยงต่อ capping/lamination เพิ่มขึ้น",
    ],
  },
  {
    topic: "HLB (Hydrophilic-Lipophilic Balance) — required HLB blend calculation",
    prompt:
      "การเตรียม emulsion ต้องการ emulsifier ที่มีค่า Required HLB ของน้ำมันที่ใช้ = 10 มี surfactant สองชนิดให้เลือกผสมกัน: Surfactant A (HLB=4) และ Surfactant B (HLB=15) จงคำนวณสัดส่วน (% w/w) ของ Surfactant B ที่ต้องใช้ผสมกับ Surfactant A เพื่อให้ได้ค่า HLB ผสมเท่ากับ 10 ตามที่ต้องการ",
    options: [
      "Surfactant B ประมาณ 54.5% w/w (และ Surfactant A ประมาณ 45.5% w/w) — คำนวณจากสมการ HLB ผสม = (fraction A × HLB A) + (fraction B × HLB B) = 10 แล้วแก้หา fraction B = (10−4)/(15−4)",
      "Surfactant B ประมาณ 45.5% w/w (และ Surfactant A ประมาณ 54.5% w/w) — สลับสัดส่วนที่คำนวณได้ระหว่าง A และ B",
      "Surfactant B และ A อย่างละ 50% w/w เท่ากัน โดยไม่ต้องคำนวณตามสมการ weighted average ของ HLB",
      "Surfactant B ประมาณ 36.4% w/w — คำนวณจาก (10−4)/15×100 ซึ่งไม่ใช่สูตรที่ถูกต้องสำหรับการหาสัดส่วนผสม",
      "Surfactant B ประมาณ 109% w/w — นำค่า HLB ของทั้งสองชนิดมาบวกกันแล้วคำนวณสัดส่วนจากผลรวมนั้น",
    ],
    rationale:
      "HLB ของส่วนผสม surfactant คำนวณจากค่าเฉลี่ยถ่วงน้ำหนัก (weighted average) ตามสัดส่วนของแต่ละชนิด: HLB_blend = (fraction A × HLB A) + (fraction B × HLB B) ตั้งสมการ 10 = (1−x)(4) + x(15) โดย x คือสัดส่วนของ Surfactant B จะได้ 10 = 4+11x → x = 6/11 ≈ 0.545 หรือ 54.5% ดังนั้นต้องใช้ Surfactant B ประมาณ 54.5% w/w และ Surfactant A ประมาณ 45.5% w/w เพื่อให้ได้ HLB ผสมเท่ากับ 10 ตามที่ต้องการ",
    traps: [
      "ผิด — สัดส่วนที่คำนวณได้จากสมการ weighted average คือ Surfactant B ≈ 54.5% (ไม่ใช่ 45.5%) การสลับตัวเลขระหว่าง A และ B ทำให้ได้ HLB ผสมที่ไม่ตรงกับ 10 ตามต้องการหากนำไปผสมจริง",
      "ผิด — การใช้สัดส่วนเท่ากัน (50/50) โดยไม่คำนวณตามสมการจะให้ HLB ผสม = 0.5×4+0.5×15 = 9.5 ซึ่งไม่ตรงกับค่า Required HLB ที่ต้องการ (10) พอดี",
      "ผิด — สูตร (10−4)/15×100 ไม่ใช่สูตรที่ถูกต้องสำหรับการหาสัดส่วนผสม HLB ต้องใช้สมการ weighted average ที่คำนึงถึงผลต่างระหว่าง HLB ทั้งสองชนิดเป็นตัวหาร ไม่ใช่ค่า HLB ของชนิดใดชนิดหนึ่งเพียงอย่างเดียว",
      "ผิด — HLB ของส่วนผสมไม่ได้คำนวณจากผลรวมของค่า HLB ทั้งสองชนิด แต่คำนวณจากค่าเฉลี่ยถ่วงน้ำหนักตามสัดส่วน ซึ่งต้องมีค่าอยู่ระหว่างค่า HLB ต่ำสุดและสูงสุดของสารทั้งสองเสมอ ไม่สามารถเกิน 100% หรือเกินค่า HLB สูงสุดได้",
    ],
    difficulty: "hard",
    ref: "HLB (Hydrophilic-Lipophilic Balance) system — required HLB blend calculation for emulsifier selection",
    calc: [
      "ตั้งสมการ: 10 = (1−x)(4) + x(15) โดย x = fraction ของ Surfactant B",
      "10 = 4 + 11x → x = (10−4)/11 = 6/11 ≈ 0.545",
      "Surfactant B ≈ 54.5% w/w, Surfactant A ≈ 45.5% w/w",
    ],
  },
  {
    topic: "21 CFR Part 11 — electronic signature requirements",
    prompt:
      "ข้อใดอธิบายข้อกำหนดพื้นฐานของ 21 CFR Part 11 เกี่ยวกับ electronic signature ได้ถูกต้องที่สุด",
    options: [
      "Electronic signature ต้องประกอบด้วยอย่างน้อย 2 องค์ประกอบที่แยกจากกัน (เช่น user ID และ password) โดยต้องใช้ทั้งสององค์ประกอบเมื่อเป็นการลงนามครั้งแรกในแต่ละช่วงเวลาทำงาน (session) และต้อง link เข้ากับ record ที่เกี่ยวข้องอย่างถาวรไม่สามารถตัดออก คัดลอก หรือปลอมแปลงโดยวิธีปกติได้ พร้อมบันทึก printed name, วันที่/เวลา และความหมายของการลงนาม (เช่น approved by, reviewed by)",
      "Electronic signature สามารถใช้เพียง user ID เดียวโดยไม่จำเป็นต้องมี password หรือองค์ประกอบที่สองใดๆ ตราบใดที่ระบบมี audit trail บันทึกไว้",
      "Electronic signature ไม่จำเป็นต้องเชื่อมโยง (link) กับ record ที่ลงนามอย่างถาวร สามารถแยกเก็บต่างหากจาก record นั้นได้โดยไม่มีผลต่อความสมบูรณ์ทางกฎหมาย",
      "21 CFR Part 11 ใช้บังคับเฉพาะกับเอกสารกระดาษที่ถูกแปลงเป็นไฟล์ดิจิทัลภายหลังเท่านั้น ไม่ครอบคลุมข้อมูลที่ถูกสร้างขึ้นในระบบอิเล็กทรอนิกส์ตั้งแต่ต้น",
      "ความหมายของการลงนาม (เช่น approved by, reviewed by) ไม่จำเป็นต้องบันทึกไว้ในระบบ เพียงระบุชื่อผู้ลงนามและวันที่ก็เพียงพอตามข้อกำหนด",
    ],
    rationale:
      "21 CFR Part 11 กำหนดให้ electronic signature ต้องมีองค์ประกอบที่ผูกมัดกับผู้ลงนามอย่างเฉพาะเจาะจงและไม่สามารถปฏิเสธได้ (non-repudiation) โดยทั่วไปต้องประกอบด้วยอย่างน้อย 2 องค์ประกอบที่แยกจากกัน (เช่น user ID และ password) ซึ่งต้องใช้ทั้งสององค์ประกอบอย่างน้อยเมื่อเป็นการลงนามครั้งแรกในแต่ละช่วงเวลาทำงาน นอกจากนี้ electronic signature ต้องเชื่อมโยง (link) กับ record ที่เกี่ยวข้องอย่างถาวรเพื่อป้องกันการตัดออก คัดลอก หรือปลอมแปลงโดยวิธีปกติ พร้อมทั้งต้องบันทึก printed name ของผู้ลงนาม วันที่/เวลาที่ลงนาม และความหมายของการลงนาม (เช่น การอนุมัติ การทบทวน) ไว้ในระบบด้วย ข้อกำหนดนี้ครอบคลุมทั้งข้อมูลที่แปลงจากกระดาษและข้อมูลที่สร้างขึ้นในระบบอิเล็กทรอนิกส์ตั้งแต่ต้น",
    traps: [
      "ผิด — การใช้เพียง user ID เดียวโดยไม่มีองค์ประกอบที่สอง (เช่น password) ไม่เพียงพอต่อข้อกำหนดของ electronic signature ที่สมบูรณ์ตาม 21 CFR Part 11 แม้จะมี audit trail บันทึกไว้ก็ตาม",
      "ผิด — Electronic signature ต้องเชื่อมโยงกับ record ที่ลงนามอย่างถาวรเพื่อป้องกันการตัดออก คัดลอก หรือปลอมแปลงโดยวิธีปกติ การแยกเก็บต่างหากโดยไม่มีการเชื่อมโยงที่มั่นคงขัดกับหลักการพื้นฐานของข้อกำหนดนี้",
      "ผิด — 21 CFR Part 11 ครอบคลุมทั้งข้อมูลที่แปลงจากเอกสารกระดาษและข้อมูลที่ถูกสร้างขึ้นในระบบอิเล็กทรอนิกส์ตั้งแต่ต้น ไม่ได้จำกัดเฉพาะกรณีใดกรณีหนึ่ง",
      "ผิด — ความหมายของการลงนาม (เช่น approved by, reviewed by) เป็นองค์ประกอบที่จำเป็นต้องบันทึกไว้ตามข้อกำหนด เพื่อให้ทราบเจตนา/บทบาทของการลงนามแต่ละครั้งอย่างชัดเจน ไม่ใช่เพียงชื่อและวันที่เท่านั้น",
    ],
    difficulty: "medium",
    ref: "21 CFR Part 11 — Electronic Records; Electronic Signatures",
  },
  {
    topic: "Extractables study design — selecting extraction conditions (exaggerated vs simulated)",
    prompt:
      "การออกแบบ extractables study สำหรับระบบบรรจุภัณฑ์ยาใหม่ ควรเลือกสภาวะการสกัด (extraction condition) อย่างไรจึงจะเหมาะสมที่สุดในการระบุ potential extractables ให้ครอบคลุมที่สุด",
    options: [
      "ควรใช้สภาวะการสกัดแบบ exaggerated condition (เช่น ใช้ตัวทำละลายหลายชนิดที่มีขั้วความเป็นขั้วต่างกัน อุณหภูมิและระยะเวลาที่สูง/นานกว่าสภาวะการใช้งานจริงอย่างมีนัยสำคัญ) เพื่อดึงสาร extractable ที่เป็นไปได้ให้ครอบคลุมที่สุดในเชิง worst-case/conservative ก่อนนำผลไปประเมินความเกี่ยวข้องกับ leachables ภายใต้สภาวะการเก็บรักษาจริงในขั้นตอนถัดไป",
      "ควรใช้เฉพาะสภาวะที่จำลองการเก็บรักษาจริง (simulated condition) เท่านั้นตั้งแต่ขั้นตอนแรก เพื่อประหยัดเวลาและงบประมาณของการศึกษา",
      "ควรใช้ตัวทำละลายเพียงชนิดเดียวที่มีขั้วใกล้เคียงกับผลิตภัณฑ์มากที่สุดเท่านั้น เพื่อความจำเพาะเจาะจงของผลการศึกษา",
      "ระยะเวลาและอุณหภูมิของการสกัดไม่มีผลต่อชนิดหรือปริมาณสารที่สกัดได้ ตราบใดที่ใช้ตัวทำละลายชนิดเดียวกันตลอดการศึกษา",
      "ควรเลือกสภาวะการสกัดให้เหมือนกับสภาวะการเก็บรักษาจริงทุกประการตั้งแต่ต้น เพื่อให้ผลที่ได้สามารถใช้แทนขั้นตอน leachables study ได้เลยโดยไม่ต้องทำการศึกษาเพิ่มเติม",
    ],
    rationale:
      "Extractables study มีวัตถุประสงค์เพื่อระบุสารที่ 'อาจ' หลุดออกมาจากวัสดุบรรจุภัณฑ์ได้ในเชิง worst-case จึงควรใช้สภาวะการสกัดแบบ exaggerated (ตัวทำละลายหลายขั้ว อุณหภูมิ/ระยะเวลาที่มากกว่าการใช้งานจริง) เพื่อให้ครอบคลุมสารที่เป็นไปได้มากที่สุด ก่อนนำรายการสารที่พบไปประเมินความเกี่ยวข้องกับสภาวะการเก็บรักษาจริงในขั้นตอน leachables study ซึ่งใช้สภาวะที่จำลองการเก็บรักษาจริง (simulated condition) แทน การใช้สภาวะจำลองจริงตั้งแต่ขั้น extractables อาจพลาดการตรวจพบสารที่มีความเสี่ยงในระยะยาวหรือภายใต้สภาวะที่ไม่คาดคิด",
    traps: [
      "ผิด — สภาวะที่จำลองการเก็บรักษาจริง (simulated condition) เป็นขั้นตอนของ leachables study ไม่ใช่ extractables study ซึ่งควรใช้สภาวะแบบ exaggerated เพื่อความครอบคลุมสูงสุดก่อน",
      "ผิด — การใช้ตัวทำละลายเพียงชนิดเดียวอาจพลาดการตรวจพบสารที่มีขั้วความเป็นขั้วต่างจากตัวทำละลายที่เลือก การใช้ตัวทำละลายหลายชนิดที่มีขั้วต่างกันช่วยให้ครอบคลุมสารที่เป็นไปได้มากกว่า",
      "ผิด — อุณหภูมิและระยะเวลาของการสกัดมีผลโดยตรงต่อชนิดและปริมาณสารที่สกัดได้ การเพิ่มอุณหภูมิ/ระยะเวลาเป็นหลักการสำคัญของ exaggerated condition ที่ใช้เพื่อดึงสารออกมาให้ครอบคลุมมากขึ้น",
      "ผิด — Extractables study และ leachables study มีวัตถุประสงค์และสภาวะที่แตกต่างกัน extractables ใช้สภาวะ exaggerated เพื่อความครอบคลุม ในขณะที่ leachables ใช้สภาวะจำลองจริงเพื่อประเมินความเสี่ยงภายใต้การใช้งานจริง ไม่สามารถใช้แทนกันได้โดยตรง",
    ],
    difficulty: "medium",
    ref: "PQRI/USP <1663>/<1664> — Extractables and Leachables study design principles",
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
    id: `ip1set2_d07_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 7/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 7 · ${d.topic}\n\n${d.prompt}`,
    image_url: null,
    choices: shuffled.map((text, j) => ({ label: labels[j], text })),
    correct_answer: answer,
    explanation: `หลักการ: ${d.rationale}\n\nReference: ${d.ref}`,
    detailed_explanation: {
      summary: `เฉลย ${answer}. ${correct}`,
      reason: `【หลักการสำคัญ】\n${d.rationale}\n\n【วิธีคิดแบบข้อสอบ IP1】\nโจทย์ข้อนี้อยู่ในหัวข้อ "${d.topic}" ต้องเชื่อมข้อมูลเชิงตัวเลข/สถานการณ์ในโจทย์เข้ากับหลักการ GMP/regulatory/pharmaceutics ที่เกี่ยวข้อง แล้วแยกตัวเลือกที่ดูสมเหตุสมผลบางส่วนแต่ไม่ใช่ single best answer ออกจากคำตอบที่ตอบโจทย์ได้ตรงและครบถ้วนที่สุด\n\n【Reference / หลักอ้างอิง】\n${d.ref}`,
      choices: choiceExplanations,
      key_takeaway: `Exam Pearl: ${d.rationale}`,
      ...(d.calc ? { calculation_steps: d.calc } : {}),
    },
    difficulty: d.difficulty,
    is_ai_enhanced: false,
    ai_notes:
      "Manually drafted original IP1 item (Daily Set 2, Day 7/30) — not copied from any past exam. Editorial/technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-29 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 220,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY07: McqQuestion[] = D.map(buildQuestion);
