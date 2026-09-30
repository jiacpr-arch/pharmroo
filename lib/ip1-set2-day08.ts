import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 8 of 30 (10 questions/day plan)
// Topic focus: suppository/semisolid formulation calculation, sterilizing-
// filter physical integrity testing, sterilization D-value determination,
// roller compaction ribbon solid fraction, preservative efficacy testing
// (USP <51>), fluid-bed/press-coating manufacturing mechanisms, freeze-
// dried cake defect troubleshooting, and biopharmaceutics permeability
// classification / process-validation lifecycle approach.
// Distinct from IP1_PILOT_050 (lib/ip1-pilot-050.ts) and Days 1-7 — cross-
// checked against all of them:
//   - suppositories/displacement factor do not appear anywhere in the
//     existing bank, so Q1 is genuinely new ground.
//   - Day 3's filter question (LRV via bacterial challenge test) explicitly
//     noted, in its own trap explanation, that bubble point testing is "a
//     different test" (physical/deterministic integrity test) from the
//     bacterial challenge test; Q2 here completes that distinction with an
//     actual Laplace-equation bubble-point *calculation*, a skill Day 3
//     never tested.
//   - Day 3's Q1 (moist-heat sterilization) *used* a known/given D-value to
//     calculate a required F0; Q3 here *determines* the D-value itself
//     from raw survivor-count-vs-time data via linear regression — the
//     prior, foundational step, not a repeat of the same calculation.
//   - existing bank's "Wet granulation" tests wet granulation itself, and
//     Day 4 covered *choosing* roller compaction over wet granulation for
//     a moisture-sensitive API (conceptual selection); Q9 here computes an
//     actual ribbon solid fraction from density data — a different
//     (calculation) skill entirely.
//   - existing bank's "Preservatives / pH" tests how pH/ionization affects
//     a weak-acid preservative's antimicrobial activity; Q5 here applies
//     the actual USP <51> Category 1 log-reduction acceptance criteria at
//     specified timepoints — a different, criteria-based skill.
//   - Fluid-bed Wurster vs top-spray coating (Q6), compression-coated
//     (press-coated) tablets (Q7), freeze-dried cake defect diagnosis
//     (Q8; distinct from Day 3's secondary-drying-purpose question and the
//     bank's primary-drying-purpose question — this is troubleshooting
//     visible cake defects, not describing a drying phase's purpose),
//     Caco-2 permeability classification (Q4; the other BCS axis from Day
//     5's dose/solubility *solubility* classification), and the
//     traditional vs continuous-process-verification (CPV) lifecycle
//     comparison (Q10; distinct from the bank's basic "Process validation"
//     definition and its "OOT vs OOS" trend-investigation scenario) do not
//     appear anywhere in the existing 150-question bank or in Days 1-7.
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
const answerPositions = [1, 3, 0, 2, 4, 4, 2, 0, 3, 1];

const D: Draft[] = [
  {
    topic: "Suppository formulation — displacement factor calculation",
    prompt:
      "การเตรียมยาเหน็บ (suppository) ด้วย cocoa butter base: ยาเหน็บเปล่า (blank, ไม่มีตัวยา) ต่อเม็ดมีน้ำหนัก 2.0 g เมื่อใส่ตัวยา 0.3 g ต่อเม็ด (แทนที่ฐานบางส่วน) น้ำหนักยาเหน็บที่ได้ (รวมตัวยาและฐาน) = 2.1 g ต่อเม็ด จงคำนวณ Displacement Factor (f) ของตัวยานี้",
    options: [
      "f = 0.75 (คำนวณจาก a÷B = 0.3÷2.0 โดยไม่หักฐานที่เหลือหลังใส่ตัวยาออกก่อน)",
      "f = 1.5 [คำนวณจาก f = a ÷ (B−(W−a)) = 0.3 ÷ (2.0−(2.1−0.3)) = 0.3÷0.2]",
      "f = 0.2 (รายงานเฉพาะน้ำหนักฐานที่ถูกแทนที่ (B−(W−a)) โดยไม่หารด้วยน้ำหนักตัวยา)",
      "f = 7.0 (สลับตัวหาร/ตัวตั้ง: ใช้ (B−(W−a))÷a แทน a÷(B−(W−a)))",
      "f = 0.143 (ใช้ a÷B โดยตรงแล้วกลับเศษส่วนผิดทิศทางอีกครั้ง)",
    ],
    rationale:
      "Displacement Factor (f) คือปริมาณตัวยา (กรัม) ที่แทนที่ปริมาณฐานเท่ากับ 1 กรัม คำนวณจากสูตร f = a ÷ [B − (W−a)] โดย a = น้ำหนักตัวยาต่อเม็ด, B = น้ำหนักยาเหน็บเปล่า (blank), W = น้ำหนักยาเหน็บที่มีตัวยา (total) ในที่นี้: ฐานที่เหลืออยู่ในยาเหน็บที่มีตัวยา = W−a = 2.1−0.3 = 1.8 g ฐานที่ถูกแทนที่โดยตัวยา = B−(W−a) = 2.0−1.8 = 0.2 g ดังนั้น f = 0.3÷0.2 = 1.5 หมายความว่าตัวยา 1.5 กรัมมีปริมาตรเทียบเท่ากับฐาน 1 กรัม (ตัวยามีความหนาแน่นสูงกว่าฐานเมื่อเทียบปริมาตรต่อน้ำหนัก)",
    traps: [
      "ผิด — ต้องหาปริมาณฐานที่ถูกแทนที่จริง (B−(W−a)) ก่อน ไม่ใช่นำน้ำหนักตัวยาไปหารด้วยน้ำหนักยาเหน็บเปล่าโดยตรง ซึ่งไม่ได้คำนึงถึงปริมาณฐานที่ยังคงเหลืออยู่ในยาเหน็บที่มีตัวยา",
      "ผิด — ค่า (B−(W−a)) คือปริมาณฐานที่ถูกแทนที่ ยังไม่ใช่ค่า f ที่สมบูรณ์ ต้องนำไปหารด้วยน้ำหนักตัวยา (a) อีกขั้นหนึ่งจึงจะได้ค่า Displacement Factor ตามนิยาม",
      "ผิด — สูตรที่ถูกต้องคือ a หารด้วย (B−(W−a)) ไม่ใช่กลับด้าน การสลับตัวหาร/ตัวตั้งทำให้ได้ค่าที่ผิดทิศทางไปจากความหมายของ Displacement Factor",
      "ผิด — วิธีคำนวณนี้ไม่ได้หักฐานที่เหลืออยู่ในยาเหน็บที่มีตัวยาออกก่อน (ต้องใช้ B−(W−a) ไม่ใช่ B ตรงๆ) ทำให้ค่าที่ได้ผิดจากนิยามของ Displacement Factor",
    ],
    difficulty: "hard",
    ref: "Suppository formulation — displacement factor (density factor) calculation principles",
    calc: [
      "ฐานที่เหลือในยาเหน็บที่มีตัวยา = W − a = 2.1 − 0.3 = 1.8 g",
      "ฐานที่ถูกแทนที่โดยตัวยา = B − (W−a) = 2.0 − 1.8 = 0.2 g",
      "f = a ÷ [B−(W−a)] = 0.3 ÷ 0.2 = 1.5",
    ],
  },
  {
    topic: "Sterilizing-grade filter — bubble point integrity test calculation (Laplace equation)",
    prompt:
      "การทดสอบ bubble point ของ sterilizing-grade filter (ขนาดรูพรุนสูงสุดที่ระบุ 0.2 µm) โดยใช้น้ำเป็น wetting liquid (surface tension γ = 0.072 N/m) และสมมติว่าของเหลวเปียกผิวรูพรุนได้สมบูรณ์ (contact angle θ = 0°, cosθ = 1) จงคำนวณค่า bubble point pressure ขั้นต่ำที่คาดว่าจะเริ่มสังเกตเห็นฟองอากาศต่อเนื่อง ตามสมการ Laplace (P = 4γcosθ/d)",
    options: [
      "P ≈ 0.36 MPa (ลืมคูณด้วยตัวคูณ 4 ในสมการ Laplace ใช้ P=γ/d แทน)",
      "P ≈ 1.44 MPa (≈14.4 bar) [คำนวณจาก P = 4×0.072 N/m ÷ (0.2×10⁻⁶ m) ตามสมการ Laplace]",
      "P ≈ 2.88 MPa (ใช้รัศมีรูพรุนแทนเส้นผ่านศูนย์กลางในสมการ ทำให้ตัวหารเล็กลงครึ่งหนึ่งโดยไม่ตั้งใจ)",
      "P ≈ 1,440,000 MPa (ลืมแปลงหน่วยรูพรุนจาก µm เป็น m ก่อนคำนวณ ทำให้ตัวเลขคลาดเคลื่อนไปหลายเท่า)",
      "ไม่สามารถคำนวณ bubble point ได้หากไม่ทราบอัตราการไหลของแก๊ส (gas flow rate) ที่ใช้ทดสอบเพิ่มเติม",
    ],
    rationale:
      "ตามสมการ Laplace, bubble point pressure = 4γcosθ/d เมื่อแปลงขนาดรูพรุนจาก 0.2 µm เป็นหน่วยเมตร (0.2×10⁻⁶ m = 2×10⁻⁷ m) และแทนค่า γ=0.072 N/m, cosθ=1: P = (4×0.072)/(2×10⁻⁷) = 0.288/(2×10⁻⁷) = 1,440,000 Pa = 1.44 MPa (≈14.4 bar) ค่านี้คือความดันแก๊สขั้นต่ำที่คาดว่าจะเอาชนะแรงตึงผิวของของเหลวที่รูพรุนขนาดใหญ่ที่สุดและเริ่มดันให้เกิดฟองอากาศต่อเนื่องออกมา ซึ่งเป็นหลักการพื้นฐานของ physical/deterministic integrity test ที่ใช้ยืนยันความสมบูรณ์ของ sterilizing-grade filter",
    traps: [
      "ผิด — สมการ Laplace มีตัวคูณ 4 อยู่ในสูตร (P=4γcosθ/d) ไม่ใช่ P=γ/d การละเว้นตัวคูณ 4 ทำให้ค่าที่ได้ต่ำกว่าความเป็นจริง 4 เท่า",
      "ผิด — ตัวแปร d ในสมการ Laplace หมายถึงเส้นผ่านศูนย์กลางของรูพรุน ไม่ใช่รัศมี การใช้รัศมีแทนเส้นผ่านศูนย์กลางทำให้ตัวหารเล็กลงครึ่งหนึ่งและค่าความดันที่คำนวณได้สูงเกินจริงเป็น 2 เท่า",
      "ผิด — ต้องแปลงหน่วยขนาดรูพรุนจาก µm เป็น m ก่อนแทนค่าในสมการเสมอ (1 µm = 10⁻⁶ m) การลืมแปลงหน่วยทำให้ผลลัพธ์คลาดเคลื่อนไปหลายเท่าและไม่มีความหมายทางกายภาพที่ถูกต้อง",
      "ผิด — การคำนวณ bubble point pressure ตามสมการ Laplace ใช้เพียงค่า surface tension, contact angle, และขนาดรูพรุน ไม่จำเป็นต้องทราบอัตราการไหลของแก๊สเพิ่มเติมสำหรับการคำนวณค่าทางทฤษฎีนี้",
    ],
    difficulty: "hard",
    ref: "USP <1207>; filter integrity testing — bubble point test (Laplace equation) principles",
    calc: [
      "แปลงหน่วย: 0.2 µm = 0.2×10⁻⁶ m = 2×10⁻⁷ m",
      "P = 4γcosθ/d = (4×0.072×1) ÷ (2×10⁻⁷) = 0.288 ÷ 2×10⁻⁷",
      "P = 1,440,000 Pa = 1.44 MPa (≈14.4 bar)",
    ],
  },
  {
    topic: "Sterilization validation — D-value determination from survivor curve",
    prompt:
      "การศึกษา thermal death time ของ biological indicator spore ที่อุณหภูมิคงที่ 121°C ให้ข้อมูล survivor curve (log₁₀ จำนวนสปอร์ที่รอดชีวิต เทียบกับเวลา) ดังนี้: t=0 นาที, log N=6.0; t=2 นาที, log N=4.5; t=4 นาที, log N=3.0; t=6 นาที, log N=1.5 จงคำนวณค่า D-value (D₁₂₁) ของสปอร์ชนิดนี้จากข้อมูลดังกล่าว",
    options: [
      "D ≈ 6.0 นาที (ใช้เวลาทั้งหมดของการทดลองเป็นคำตอบโดยไม่คำนึงถึงปริมาณ log reduction ที่เกิดขึ้นจริง)",
      "D ≈ 4.5 นาที (ใช้ผลต่าง log reduction ทั้งหมดเป็นคำตอบโดยตรงโดยไม่หารด้วยเวลาที่ใช้)",
      "D ≈ 1.33 นาที [คำนวณจาก D = เวลาทั้งหมด ÷ log reduction ทั้งหมด = 6 ÷ (6.0−1.5) = 6÷4.5 ซึ่งตรงกับส่วนกลับของ slope ของ survivor curve ที่ −0.75 log/นาที]",
      "D ≈ 0.75 นาที (ใช้ค่า slope ของ survivor curve ตรงๆ โดยไม่นำส่วนกลับ (reciprocal) ของ slope มาเป็นค่า D)",
      "D ≈ 2.0 นาที (ใช้ช่วงเวลาของจุดข้อมูลแรกเพียงคู่เดียวเป็นคำตอบ โดยไม่คำนวณ slope จากข้อมูลทั้งชุด)",
    ],
    rationale:
      "D-value คือเวลาที่ใช้ในการลดจำนวนจุลินทรีย์ลง 1 log (90%) ที่อุณหภูมิคงที่ คำนวณจากส่วนกลับของ slope ของ survivor curve (log N เทียบกับเวลา) หรือเทียบเท่ากับ (เวลาทั้งหมด ÷ log reduction ทั้งหมด) เมื่อข้อมูลเป็นเส้นตรงสม่ำเสมอ: slope = (1.5−6.0)/(6−0) = −4.5/6 = −0.75 log/นาที ดังนั้น D = 1/0.75 ≈ 1.33 นาที ซึ่งตรงกับวิธีคำนวณทางเลือก D = เวลาทั้งหมด (6 นาที) ÷ log reduction ทั้งหมด (4.5 log) = 1.33 นาที เช่นกัน ยืนยันความสอดคล้องของข้อมูลที่เป็นเส้นตรง",
    traps: [
      "ผิด — เวลาทั้งหมดของการทดลอง (6 นาที) ไม่ใช่ D-value โดยตรง ต้องนำไปหารด้วยจำนวน log reduction ที่เกิดขึ้นจริงตลอดช่วงเวลานั้นก่อน",
      "ผิด — ผลต่าง log reduction ทั้งหมด (4.5 log) ไม่ใช่ D-value โดยตรง ต้องนำไปหารด้วยเวลาทั้งหมดที่ใช้ (หรือใช้ในทิศทางกลับกับที่คำนวณผิด) จึงจะได้ D-value ที่ถูกต้อง",
      "ผิด — D-value คือส่วนกลับ (reciprocal) ของ slope ไม่ใช่ค่า slope โดยตรง การใช้ slope ตรงๆ โดยไม่ inverse ทำให้หน่วยและความหมายของคำตอบผิดจากนิยามของ D-value",
      "ผิด — การใช้ข้อมูลเพียงคู่เดียวอาจไม่สะท้อนแนวโน้มโดยรวมของ survivor curve ทั้งชุด ควรคำนวณ slope จากข้อมูลทั้งหมด (หรือยืนยันด้วยหลายคู่ข้อมูล) เพื่อความน่าเชื่อถือของ D-value ที่ได้",
    ],
    difficulty: "hard",
    ref: "Thermal sterilization validation — D-value determination from survivor curve (thermal death time studies)",
    calc: [
      "Slope ของ survivor curve = (1.5−6.0)/(6−0) = −0.75 log/นาที",
      "D-value = 1/|slope| = 1/0.75 ≈ 1.33 นาที",
      "ยืนยันด้วยวิธีทางเลือก: D = เวลาทั้งหมด ÷ log reduction ทั้งหมด = 6÷4.5 ≈ 1.33 นาที",
    ],
  },
  {
    topic: "Biopharmaceutics — Caco-2 permeability classification (the other BCS axis)",
    prompt:
      "การจำแนก permeability class ของ API ตามหลัก BCS โดยใช้แบบจำลอง Caco-2 cell monolayer วัดค่า apparent permeability coefficient (Papp) เปรียบเทียบกับสารอ้างอิงที่ทราบ permeability class ชัดเจน (เช่น metoprolol เป็น high-permeability reference, mannitol เป็น low-permeability reference) ข้อใดอธิบายหลักการจำแนกที่เหมาะสมที่สุด",
    options: [
      "หากค่า Papp ของ API ที่ทดสอบสูงกว่าหรือใกล้เคียงกับค่า Papp ของสารอ้างอิง high-permeability (เช่น metoprolol) อย่างสม่ำเสมอในการทดสอบซ้ำ จึงจะจัดเป็น high-permeability compound ได้ ซึ่งเป็นคนละแกนกับการจำแนก solubility class ที่พิจารณาจากอัตราส่วน dose ต่อ solubility",
      "Permeability class จำแนกจากอัตราส่วนของ dose สูงสุดต่อค่า solubility ของ API เช่นเดียวกับ solubility class โดยไม่ต้องใช้แบบจำลองเซลล์ใดๆ",
      "Caco-2 model ใช้วัด solubility ของ API เป็นหลัก ไม่ได้ใช้ประเมิน permeability แต่อย่างใด",
      "API ใดก็ตามที่มี Papp สูงกว่าศูนย์ถือว่าเป็น high-permeability compound ได้ทันที โดยไม่ต้องเปรียบเทียบกับสารอ้างอิง",
      "การจำแนก permeability class ไม่มีความเกี่ยวข้องกับการพิจารณา BCS classification หรือการขอ biowaiver แต่อย่างใด",
    ],
    rationale:
      "Permeability class เป็นแกนที่สองของ BCS classification (นอกเหนือจาก solubility class) โดยประเมินจากความสามารถของ API ในการซึมผ่านเยื่อบุลำไส้ ซึ่งมักใช้แบบจำลอง Caco-2 cell monolayer วัดค่า apparent permeability coefficient (Papp) แล้วเปรียบเทียบกับสารอ้างอิงที่ทราบ permeability class ชัดเจน (เช่น metoprolol สำหรับ high-permeability, mannitol สำหรับ low-permeability) หาก API ที่ทดสอบมีค่า Papp สูงกว่าหรือใกล้เคียงกับสารอ้างอิง high-permeability อย่างสม่ำเสมอ จึงจะจัดเป็น high-permeability compound ได้ ซึ่งเป็นคนละหลักการกับการจำแนก solubility class ที่ใช้อัตราส่วน dose/solubility เทียบกับปริมาตรน้ำ 250 mL",
    traps: [
      "ผิด — อัตราส่วน dose ต่อ solubility เป็นเกณฑ์ของการจำแนก solubility class ไม่ใช่ permeability class ซึ่งต้องประเมินจากความสามารถในการซึมผ่านเยื่อบุ (เช่นผ่านแบบจำลอง Caco-2) แยกต่างหาก",
      "ผิด — Caco-2 model เป็นแบบจำลองที่ใช้ประเมิน permeability (การซึมผ่านเยื่อบุลำไส้) ไม่ใช่ solubility ของ API",
      "ผิด — การจำแนก high-permeability ต้องเปรียบเทียบกับสารอ้างอิงที่ทราบ permeability class ชัดเจนเสมอ ไม่ใช่พิจารณาเพียงว่าค่า Papp มากกว่าศูนย์ก็เพียงพอ",
      "ผิด — Permeability class เป็นหนึ่งในสองแกนหลักของ BCS classification ซึ่งมีความสำคัญโดยตรงต่อการพิจารณาขอ biowaiver สำหรับผลิตภัณฑ์ generic ที่มีคุณสมบัติ highly soluble และ highly permeable ร่วมกัน (BCS Class I)",
    ],
    difficulty: "medium",
    ref: "BCS classification — Caco-2 permeability model and reference compound comparison principles",
  },
  {
    topic: "Preservative Efficacy Test (USP <51>) — Category 1 log-reduction acceptance criteria",
    prompt:
      "ผลิตภัณฑ์ยาฉีด (จัดเป็น Category 1 ตาม USP <51> — injections และ parenteral products อื่นรวมถึง ophthalmics) ทดสอบ Preservative Efficacy Test (PET) พบว่า bacteria count ลดลงจาก initial count 0.8 log ที่วันที่ 7 และลดลงสะสม 2.5 log ที่วันที่ 14 (เกณฑ์ Category 1 กำหนด: NLT 1.0 log reduction ที่วันที่ 7, NLT 3.0 log reduction ที่วันที่ 14, ไม่มีการเพิ่มขึ้นของจำนวนเชื้อตั้งแต่วันที่ 14 ถึงวันที่ 28) จงสรุปว่าผลิตภัณฑ์นี้ผ่านเกณฑ์ PET Category 1 หรือไม่",
    options: [
      "ไม่ผ่านเกณฑ์ Category 1 เพราะทั้งผลที่วันที่ 7 (0.8 log < เกณฑ์ขั้นต่ำ 1.0 log) และผลที่วันที่ 14 (2.5 log < เกณฑ์ขั้นต่ำ 3.0 log) ต่ำกว่าเกณฑ์ขั้นต่ำที่กำหนดไว้ทั้งสองจุดเวลา",
      "ผ่านเกณฑ์ เพราะมีแนวโน้มของ log reduction ที่เพิ่มขึ้นต่อเนื่องตามเวลา แม้ตัวเลขที่แต่ละจุดเวลาจะยังไม่ถึงเกณฑ์ขั้นต่ำที่กำหนดก็ตาม",
      "ผ่านเกณฑ์ที่วันที่ 14 เพราะ 2.5 log ถือว่าใกล้เคียงกับเกณฑ์ 3.0 log มากพอที่จะยอมรับได้ตามดุลยพินิจ",
      "ผ่านเกณฑ์ เพราะผลิตภัณฑ์นี้ควรถูกจัดเป็น Category 2 (topical products) ซึ่งมีเกณฑ์ log reduction ที่หย่อนกว่า ไม่ใช่ Category 1",
      "ไม่สามารถสรุปได้ เพราะ PET ตาม USP <51> ไม่มีเกณฑ์ตัวเลขที่ชัดเจนสำหรับผลิตภัณฑ์ Category ใดๆ",
    ],
    rationale:
      "USP <51> กำหนดเกณฑ์ log-reduction ที่ชัดเจนสำหรับผลิตภัณฑ์แต่ละ category ตามระดับความเสี่ยง สำหรับ Category 1 (injections/parenterals รวม ophthalmics) กำหนดให้ bacteria ต้องลดลงไม่น้อยกว่า 1.0 log ที่วันที่ 7 และไม่น้อยกว่า 3.0 log ที่วันที่ 14 ผลที่ได้ในโจทย์นี้ (0.8 log ที่วันที่ 7 และ 2.5 log ที่วันที่ 14) ต่ำกว่าเกณฑ์ขั้นต่ำทั้งสองจุดเวลา จึงสรุปได้ว่าผลิตภัณฑ์นี้ไม่ผ่านเกณฑ์ PET Category 1 และจำเป็นต้องพิจารณาปรับปรุงระบบ preservative ของสูตรตำรับ",
    traps: [
      "ผิด — การมีแนวโน้มลดลงต่อเนื่องไม่เพียงพอ เกณฑ์ PET กำหนดค่าตัวเลขขั้นต่ำที่ต้องบรรลุ ณ จุดเวลาที่กำหนดไว้อย่างชัดเจน ไม่ใช่เพียงทิศทางของแนวโน้ม",
      "ผิด — เกณฑ์ PET เป็นค่าขั้นต่ำที่ต้องบรรลุหรือเกิน ไม่ใช่เกณฑ์ที่ยอมรับได้ตามความใกล้เคียงหรือดุลยพินิจของผู้ประเมิน ค่า 2.5 log ยังต่ำกว่าเกณฑ์ 3.0 log ที่กำหนดไว้ชัดเจน",
      "ผิด — ผลิตภัณฑ์ยาฉีดถูกจัดเป็น Category 1 ตามลักษณะของผลิตภัณฑ์ (route of administration) ไม่สามารถเปลี่ยนไปใช้เกณฑ์ของ Category อื่นที่หย่อนกว่าเพื่อให้ผ่านเกณฑ์ได้",
      "ผิด — USP <51> กำหนดเกณฑ์ log-reduction เชิงตัวเลขที่ชัดเจนสำหรับแต่ละ Category ไว้อย่างเป็นระบบ ไม่ใช่แนวทางที่ไม่มีเกณฑ์ตัวเลขกำกับ",
    ],
    difficulty: "hard",
    ref: "USP <51> Antimicrobial Effectiveness Testing — Category 1 log-reduction acceptance criteria",
  },
  {
    topic: "Fluid-bed processing — Wurster (bottom-spray) vs top-spray coating mechanism",
    prompt:
      "การเคลือบ granule/pellet ด้วยระบบ fluid-bed สามารถทำได้ทั้งแบบ top-spray และแบบ Wurster (bottom-spray with partition column) ข้อใดอธิบายความแตกต่างเชิงกลไกและการเลือกใช้งานที่เหมาะสมที่สุด",
    options: [
      "Wurster (bottom-spray) ฉีดสารเคลือบในทิศทางเดียวกับการเคลื่อนที่ของอนุภาคขึ้นผ่าน partition column ทำให้แต่ละอนุภาคผ่านโซนฉีดพ่นอย่างสม่ำเสมอซ้ำๆ เหมาะสำหรับการเคลือบที่ต้องการความสม่ำเสมอและฟิล์มที่มีคุณภาพสูง (เช่น functional/controlled-release coating) มากกว่า top-spray ซึ่งฉีดสวนทางกับการเคลื่อนที่ของอนุภาคและมักให้ความสม่ำเสมอของฟิล์มต่ำกว่า",
      "Top-spray ให้ความสม่ำเสมอของฟิล์มเคลือบสูงกว่า Wurster เสมอ เพราะฉีดพ่นจากด้านบนครอบคลุมพื้นที่ผิวได้มากกว่า",
      "ทั้งสองระบบให้กลไกการเคลือบและคุณภาพฟิล์มที่เหมือนกันทุกประการ ความแตกต่างมีเพียงตำแหน่งของหัวฉีดเท่านั้นโดยไม่มีผลต่อคุณภาพเคลือบ",
      "Wurster ไม่เหมาะกับการเคลือบชนิด functional/controlled-release coating เลย เพราะให้ความสม่ำเสมอของฟิล์มต่ำกว่า top-spray เสมอ",
      "การเลือกระบบ fluid-bed ไม่มีผลต่อคุณภาพของ controlled-release coating ตราบใดที่ใช้สูตรน้ำยาเคลือบเดียวกัน",
    ],
    rationale:
      "ระบบ Wurster (bottom-spray) ออกแบบให้มี partition column ควบคุมทิศทางการไหลของอนุภาคให้ผ่านโซนฉีดพ่นสารเคลือบในทิศทางเดียวกับการเคลื่อนที่ (co-current) อย่างสม่ำเสมอและซ้ำๆ ทำให้แต่ละอนุภาคได้รับการเคลือบอย่างสม่ำเสมอมากกว่า จึงเป็นที่นิยมสำหรับการเคลือบที่ต้องการความแม่นยำสูง เช่น functional coating หรือ controlled-release coating ในขณะที่ top-spray ฉีดพ่นสวนทางกับการเคลื่อนที่ของอนุภาค (counter-current) ซึ่งง่ายและเร็วกว่าแต่มักให้ความสม่ำเสมอของฟิล์มต่ำกว่า เหมาะกับการเคลือบทั่วไปที่ไม่ต้องการความแม่นยำสูงมาก เช่น การเคลือบเพื่อปิดบังรสหรือเพิ่มความสวยงาม",
    traps: [
      "ผิด — ทิศทางกลับกัน Wurster ให้ความสม่ำเสมอของฟิล์มที่สูงกว่า top-spray เนื่องจากกลไก partition column ที่ควบคุมการไหลของอนุภาคผ่านโซนฉีดพ่นอย่างสม่ำเสมอ ไม่ใช่ top-spray ที่ให้ความสม่ำเสมอสูงกว่า",
      "ผิด — กลไกการเคลือบของทั้งสองระบบแตกต่างกันอย่างมีนัยสำคัญ (co-current ผ่าน partition column เทียบกับ counter-current แบบเปิด) ซึ่งส่งผลโดยตรงต่อความสม่ำเสมอและคุณภาพของฟิล์มเคลือบที่ได้ ไม่ใช่เพียงตำแหน่งหัวฉีดที่ต่างกันโดยไม่มีผลใดๆ",
      "ผิด — Wurster เป็นระบบที่นิยมใช้สำหรับ functional/controlled-release coating มากกว่า top-spray เนื่องจากให้ความสม่ำเสมอของฟิล์มที่สูงกว่า ซึ่งจำเป็นต่อการควบคุมอัตราการปลดปล่อยยาที่แม่นยำ",
      "ผิด — ระบบ fluid-bed ที่เลือกใช้ (Wurster หรือ top-spray) มีผลโดยตรงต่อความสม่ำเสมอของฟิล์มเคลือบ ซึ่งเป็นปัจจัยสำคัญต่อคุณภาพของ controlled-release coating แม้จะใช้สูตรน้ำยาเคลือบเดียวกันก็ตาม",
    ],
    difficulty: "medium",
    ref: "Fluid-bed processing — Wurster (bottom-spray) vs top-spray coating mechanisms",
  },
  {
    topic: "Compression-coated (press-coated) tablets — dry coating mechanism and purpose",
    prompt:
      "เทคโนโลยี compression coating (press-coated tablet หรือ tablet-in-tablet) แตกต่างจาก film coating หรือ sugar coating แบบดั้งเดิมอย่างไร และมีประโยชน์หลักอย่างไร",
    options: [
      "Compression coating ใช้แรงอัดเชิงกล (mechanical compression) เพื่อสร้างชั้นเคลือบแบบผงแห้งรอบเม็ดแกนใน (core tablet) โดยไม่ใช้ตัวทำละลายหรือขั้นตอนการอบแห้งเหมือน film/sugar coating จึงเหมาะสำหรับ API ที่ไวต่อความชื้นหรือความร้อน และยังสามารถออกแบบให้ชั้นนอกและชั้นในมีอัตราการปลดปล่อยยาที่แตกต่างกันได้ (เช่น pulsatile release หรือแยกยาที่เข้ากันไม่ได้ออกจากกัน)",
      "Compression coating เป็นเพียงชื่อเรียกอื่นของ film coating แบบใช้สารละลายโพลิเมอร์ ไม่มีความแตกต่างเชิงกลไกที่แท้จริง",
      "Compression coating ไม่สามารถใช้แยกตัวยาสองชนิดที่เข้ากันไม่ได้ (incompatible) ออกจากกันได้ เพราะทั้งสองชั้นยังคงสัมผัสกันโดยตรงเสมอ",
      "Compression coating ต้องใช้ตัวทำละลายและขั้นตอนการอบแห้งเช่นเดียวกับ film coating เนื่องจากเป็นกระบวนการเคลือบประเภทเดียวกัน",
      "Compression coating ให้ความสม่ำเสมอของน้ำหนักชั้นเคลือบต่ำกว่า film coating เสมอ จึงไม่เหมาะกับการควบคุมอัตราการปลดปล่อยยาที่แม่นยำ",
    ],
    rationale:
      "Compression coating เป็นกระบวนการ dry coating ที่ใช้แรงอัดเชิงกลสร้างชั้นเคลือบจากผงแห้งรอบเม็ดแกนใน โดยไม่ต้องใช้ตัวทำละลายหรือขั้นตอนการอบแห้งเหมือน film/sugar coating ทำให้เหมาะสำหรับ API ที่ไวต่อความชื้นหรือความร้อนที่อาจเสื่อมสภาพระหว่างกระบวนการเคลือบแบบเปียก นอกจากนี้ยังสามารถออกแบบให้ชั้นนอกและชั้นในมีสูตรตำรับหรืออัตราการปลดปล่อยยาที่แตกต่างกันได้ เช่น การสร้าง pulsatile release profile หรือการแยกตัวยาสองชนิดที่เข้ากันไม่ได้ทางเคมีออกจากกันโดยไม่ให้สัมผัสกันโดยตรง",
    traps: [
      "ผิด — Compression coating เป็นกระบวนการ dry coating ที่ใช้แรงอัดเชิงกล ซึ่งแตกต่างอย่างชัดเจนจาก film coating ที่ใช้สารละลายโพลิเมอร์และขั้นตอนการอบแห้ง ไม่ใช่ชื่อเรียกอื่นของกระบวนการเดียวกัน",
      "ผิด — จุดเด่นสำคัญประการหนึ่งของ compression coating คือความสามารถในการแยกตัวยาสองชนิดที่เข้ากันไม่ได้ออกจากกันโดยไม่ให้สัมผัสกันโดยตรง ซึ่งเป็นประโยชน์ที่ film coating ทั่วไปทำได้ยากกว่า",
      "ผิด — จุดเด่นสำคัญของ compression coating คือการไม่ต้องใช้ตัวทำละลายหรือขั้นตอนการอบแห้งเลย ซึ่งแตกต่างจาก film coating อย่างชัดเจน",
      "ผิด — Compression coating สามารถควบคุมความสม่ำเสมอของน้ำหนักชั้นเคลือบได้ดีผ่านการควบคุมกระบวนการอัดที่เหมาะสม และมักใช้ในการออกแบบระบบปลดปล่อยยาที่มีความแม่นยำ เช่น pulsatile release ไม่ใช่ด้อยกว่า film coating เสมอไป",
    ],
    difficulty: "medium",
    ref: "Compression-coated (press-coated) tablet technology — dry coating principles",
  },
  {
    topic: "Lyophilization — freeze-dried cake defect diagnosis (meltback, skin formation, cracking)",
    prompt:
      "การตรวจสอบผลิตภัณฑ์ freeze-dried พบลักษณะ cake ที่ผิดปกติ 3 แบบในแต่ละ batch: (1) cake ยุบตัวเป็นเนื้อเดียวคล้ายละลายบางส่วน (meltback), (2) ผิวบนของ cake แข็งเป็นแผ่นทึบผิดปกติ (skin formation) ในขณะที่เนื้อในยังไม่แห้งสนิท, (3) cake แตกร้าวเป็นรอย (cracking) จงจับคู่ลักษณะผิดปกติแต่ละแบบกับสาเหตุที่เป็นไปได้มากที่สุด",
    options: [
      "(1) Meltback เกิดจาก product temperature เกิน critical collapse/eutectic temperature ระหว่าง primary drying; (2) Skin formation มักเกิดจากการแช่แข็งที่เร็วเกินไป (rapid freezing) ทำให้ผลึกน้ำแข็งที่ผิวมีขนาดเล็กและโครงสร้างผิวแน่นผิดปกติ ขัดขวางการระเหิดของน้ำแข็งในชั้นล่าง; (3) Cracking มักเกิดจากอัตราการอบแห้งที่เร็วเกินไปหรือความร้อนที่ไม่สม่ำเสมอ ทำให้เกิดความเค้นภายในโครงสร้าง cake สะสมจนแตกร้าว",
      "ทั้งสามลักษณะผิดปกติเกิดจากสาเหตุเดียวกันคือ residual moisture สูงเกินไปหลัง secondary drying เท่านั้น",
      "Meltback เกิดจากการแช่แข็งที่ช้าเกินไปเสมอ ในขณะที่ skin formation และ cracking ไม่มีความเกี่ยวข้องกับกระบวนการแช่แข็งหรืออบแห้งแต่อย่างใด",
      "ลักษณะผิดปกติทั้งสามแบบไม่มีนัยสำคัญต่อคุณภาพผลิตภัณฑ์ ตราบใดที่ผลการทดสอบ reconstitution time ยังผ่านเกณฑ์ที่กำหนด",
      "Skin formation เกิดจาก product temperature เกิน critical collapse temperature เช่นเดียวกับ meltback โดยไม่มีความแตกต่างเชิงกลไกใดๆ",
    ],
    rationale:
      "ข้อบกพร่องของ freeze-dried cake แต่ละแบบมีกลไก/สาเหตุที่แตกต่างกัน: Meltback เกิดเมื่อ product temperature เกิน critical collapse/eutectic temperature ระหว่าง primary drying ทำให้โครงสร้างที่รองรับด้วยน้ำแข็งยุบตัวลงบางส่วนคล้ายการละลาย Skin formation มักสัมพันธ์กับการแช่แข็งที่เร็วเกินไป (rapid freezing) ซึ่งทำให้เกิดผลึกน้ำแข็งขนาดเล็กจำนวนมากที่ผิวจนโครงสร้างผิวแน่นผิดปกติ ขัดขวางเส้นทางการระเหิดของไอน้ำจากชั้นล่างขึ้นสู่ผิว ทำให้เนื้อในแห้งช้ากว่าผิว ส่วน cracking มักเกิดจากอัตราการให้ความร้อน/อบแห้งที่เร็วเกินไปหรือการกระจายความร้อนที่ไม่สม่ำเสมอ ทำให้เกิดความเค้นเชิงกลสะสมภายในโครงสร้าง cake จนแตกร้าว การวินิจฉัยสาเหตุที่ถูกต้องจึงต้องพิจารณากลไกที่แตกต่างกันของแต่ละข้อบกพร่อง ไม่ใช่สาเหตุเดียวกันทั้งหมด",
    traps: [
      "ผิด — ข้อบกพร่องแต่ละแบบมีกลไกที่แตกต่างกันชัดเจน (product temperature เกิน critical temperature สำหรับ meltback, การแช่แข็งเร็วเกินไปสำหรับ skin formation, ความเค้นจากอัตราอบแห้งที่เร็ว/ไม่สม่ำเสมอสำหรับ cracking) ไม่ใช่สาเหตุเดียวกันทั้งหมดจาก residual moisture สูง",
      "ผิด — Meltback มักสัมพันธ์กับ product temperature ที่เกิน critical collapse temperature ระหว่าง primary drying ไม่ใช่การแช่แข็งที่ช้า และ skin formation/cracking ก็มีความเกี่ยวข้องโดยตรงกับกระบวนการแช่แข็งและอบแห้งตามลำดับ",
      "ผิด — ข้อบกพร่องเชิงโครงสร้างของ cake เช่น meltback, skin formation, และ cracking อาจส่งผลต่อ reconstitution time, ความสม่ำเสมอของปริมาณยา, หรือ residual moisture distribution ซึ่งมีนัยสำคัญต่อคุณภาพผลิตภัณฑ์ ไม่ใช่เพียงลักษณะภายนอกที่ไม่มีผลใดๆ",
      "ผิด — Skin formation สัมพันธ์กับการแช่แข็งที่เร็วเกินไป ซึ่งเป็นกลไกที่แตกต่างจาก meltback ที่เกี่ยวข้องกับการควบคุมอุณหภูมิระหว่าง primary drying ทั้งสองข้อบกพร่องมีสาเหตุเชิงกลไกที่แยกจากกัน",
    ],
    difficulty: "medium",
    ref: "Lyophilization cycle troubleshooting — freeze-dried cake defect diagnosis (meltback, skin formation, cracking)",
  },
  {
    topic: "Roller compaction — ribbon solid fraction calculation",
    prompt:
      "การควบคุมกระบวนการ roller compaction ใช้ค่า ribbon solid fraction (SF = envelope density ของ ribbon ÷ true density ของผงที่ใช้) เป็น in-process control ที่สำคัญ ผงตำรับมี true density = 1.5 g/cm³ และวัด envelope density ของ ribbon ที่ผลิตได้ = 1.05 g/cm³ จงคำนวณค่า solid fraction ของ ribbon นี้",
    options: [
      "SF = 1.43 (คำนวณจาก true density ÷ envelope density ซึ่งเป็นการสลับตัวหาร/ตัวตั้ง ทำให้ได้ค่าเกิน 1 ซึ่งเป็นไปไม่ได้สำหรับนิยามของ solid fraction)",
      "SF = 0.30 (คำนวณ porosity (1−SF) แทนที่จะเป็น solid fraction ที่โจทย์ถามหา)",
      "SF = 0.70 [คำนวณจาก envelope density ÷ true density = 1.05÷1.5]",
      "SF ไม่สามารถคำนวณได้จากข้อมูลที่ให้มา เพราะต้องทราบความเร็วของ roller (roller speed) เพิ่มเติมเสมอ",
      "SF = 1.05 (ใช้ค่า envelope density โดยตรงเป็นคำตอบโดยไม่หารด้วย true density)",
    ],
    rationale:
      "Solid fraction คำนวณจากอัตราส่วนของ envelope (bulk) density ของ ribbon ต่อ true (particle) density ของผงที่ใช้: SF = 1.05 ÷ 1.5 = 0.70 หรือ 70% ค่านี้สะท้อนสัดส่วนของปริมาตร ribbon ที่เป็นเนื้อผงอัดแน่นจริง (ไม่รวมช่องว่าง/porosity) ซึ่งเป็นตัวชี้วัดสำคัญที่ใช้ควบคุมความสม่ำเสมอของกระบวนการ roller compaction และทำนายคุณภาพของเม็ดยาที่จะได้จากการอัดเม็ดในขั้นตอนถัดไป (ribbon ที่มี solid fraction ต่ำหรือสูงเกินไปอาจทำให้เม็ดยาที่ได้มีความแข็งแรงหรือ dissolution ที่ไม่เหมาะสม)",
    traps: [
      "ผิด — สูตรที่ถูกต้องคือ envelope density หารด้วย true density ไม่ใช่กลับด้าน การสลับตัวหาร/ตัวตั้งทำให้ได้ค่าที่เกิน 1 (143%) ซึ่งขัดกับนิยามของ solid fraction ที่ต้องมีค่าระหว่าง 0 ถึง 1 เสมอ",
      "ผิด — Porosity (1−SF) เป็นคนละค่ากับ solid fraction แม้จะคำนวณจากข้อมูลเดียวกัน แต่มีความหมายตรงข้ามกัน โจทย์ถามหา solid fraction ไม่ใช่ porosity",
      "ผิด — Solid fraction คำนวณได้จากอัตราส่วนของ envelope density ต่อ true density ที่ให้มาเพียงสองค่านี้ก็เพียงพอ ไม่จำเป็นต้องทราบความเร็วของ roller เพิ่มเติมสำหรับการคำนวณค่านี้",
      "ผิด — Envelope density เพียงอย่างเดียวไม่มีความหมายเป็น solid fraction ต้องนำไปเทียบสัดส่วนกับ true density ของผงก่อนจึงจะได้ค่า solid fraction ที่มีความหมาย",
    ],
    difficulty: "hard",
    ref: "Roller compaction process control — ribbon solid fraction (envelope density/true density ratio) principles",
    calc: [
      "SF = envelope density ÷ true density = 1.05 g/cm³ ÷ 1.5 g/cm³",
      "SF = 0.70 (70%)",
    ],
  },
  {
    topic: "Process validation lifecycle — traditional (3-batch) approach vs Continued Process Verification (CPV)",
    prompt:
      "ข้อใดอธิบายความแตกต่างระหว่างแนวทาง process validation แบบดั้งเดิม (traditional, มักอ้างอิงการผลิต 3 batch ติดต่อกันเพื่อยืนยัน) กับแนวทาง lifecycle approach ที่รวม Continued Process Verification (CPV, Stage 3) ตามกรอบแนวทาง FDA Process Validation Guidance (2011) ได้ถูกต้องที่สุด",
    options: [
      "แนวทางดั้งเดิมมุ่งยืนยันความสามารถของกระบวนการที่จุดเวลาหนึ่ง (เช่น จาก 3 batch ติดต่อกัน) แล้วถือว่าผ่านการ validate อย่างถาวร ในขณะที่แนวทาง lifecycle approach มองว่า process validation เป็นกิจกรรมต่อเนื่องตลอดวงจรชีวิตผลิตภัณฑ์ โดย Stage 3 (CPV) ติดตามและวิเคราะห์ข้อมูลกระบวนการผลิตเชิงพาณิชย์อย่างต่อเนื่องเพื่อยืนยัน state of control ตลอดเวลา ไม่ใช่เพียงช่วงเวลาเดียว",
      "ทั้งสองแนวทางมีความหมายเดียวกันทุกประการ เป็นเพียงชื่อเรียกที่ต่างกันสำหรับกิจกรรมเดียวกัน",
      "Continued Process Verification (CPV) เป็นกิจกรรมที่ทำเพียงครั้งเดียวหลังผลิต 3 batch แรกเสร็จสิ้น เช่นเดียวกับแนวทางดั้งเดิม โดยไม่มีการติดตามต่อเนื่องในระยะยาว",
      "แนวทาง lifecycle approach ไม่จำเป็นต้องมีขั้นตอน process design (Stage 1) หรือ process qualification (Stage 2) เลย เพราะ CPV (Stage 3) เพียงพอสำหรับการยืนยันกระบวนการทั้งหมด",
      "จำนวน batch ที่ต้องผลิตเพื่อยืนยันกระบวนการต้องเป็น 3 batch เสมอไม่ว่าจะใช้แนวทางใดก็ตาม เพราะเป็นข้อกำหนดตายตัวของ GMP",
    ],
    rationale:
      "แนวทาง process validation แบบดั้งเดิมมักอาศัยการผลิต batch จำนวนคงที่ (เช่น 3 batch ติดต่อกัน) เพื่อยืนยันความสามารถของกระบวนการ ณ จุดเวลาหนึ่งแล้วถือว่าผ่านการ validate ในขณะที่กรอบแนวทาง lifecycle approach ตาม FDA Process Validation Guidance (2011) แบ่งเป็น 3 ระยะ: Stage 1 (Process Design), Stage 2 (Process Qualification), และ Stage 3 (Continued Process Verification) โดย Stage 3 เน้นการติดตามและวิเคราะห์ข้อมูลกระบวนการผลิตเชิงพาณิชย์อย่างต่อเนื่องตลอดวงจรชีวิตผลิตภัณฑ์ เพื่อยืนยันว่ากระบวนการยังคงอยู่ใน state of control อย่างสม่ำเสมอ ไม่ใช่เพียงยืนยัน ณ ช่วงเวลาใดเวลาหนึ่งแล้วจบสิ้นไป",
    traps: [
      "ผิด — ทั้งสองแนวทางมีความแตกต่างเชิงปรัชญาที่สำคัญ: แนวทางดั้งเดิมมองการ validate เป็นกิจกรรมที่จบสิ้น ณ จุดเวลาหนึ่ง ในขณะที่ lifecycle approach มองเป็นกิจกรรมต่อเนื่องตลอดวงจรชีวิตผลิตภัณฑ์",
      "ผิด — CPV (Stage 3) เป็นกิจกรรมติดตามต่อเนื่องตลอดช่วงการผลิตเชิงพาณิชย์ ไม่ใช่กิจกรรมที่ทำเพียงครั้งเดียวหลังผลิต 3 batch แรกเหมือนแนวทางดั้งเดิม",
      "ผิด — แนวทาง lifecycle approach ยังคงต้องมีขั้นตอน Stage 1 (Process Design) และ Stage 2 (Process Qualification) ก่อน CPV (Stage 3) เสมอ ทั้งสามระยะเป็นส่วนประกอบที่ต่อเนื่องกันของกรอบแนวทางเดียวกัน ไม่ใช่ CPV เพียงอย่างเดียวที่เพียงพอ",
      "ผิด — กรอบแนวทาง lifecycle approach ไม่ได้กำหนดจำนวน batch ที่ตายตัวไว้เสมอ (เช่น 3 batch) แต่เน้นการใช้ข้อมูลและความเข้าใจกระบวนการ (process understanding) ในการกำหนดจำนวนที่เหมาะสมและการติดตามต่อเนื่องแทน",
    ],
    difficulty: "medium",
    ref: "FDA Guidance for Industry — Process Validation: General Principles and Practices (2011); lifecycle approach (Stage 1-2-3)",
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
    id: `ip1set2_d08_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 8/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 8 · ${d.topic}\n\n${d.prompt}`,
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
      "Manually drafted original IP1 item (Daily Set 2, Day 8/30) — not copied from any past exam. Editorial/technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-30 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 230,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY08: McqQuestion[] = D.map(buildQuestion);
