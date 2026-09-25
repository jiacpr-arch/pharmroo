import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 5 of 30 (10 questions/day plan)
// Topic focus: physical pharmacy / biopharmaceutics / cold-chain &
// packaging science calculations (isotonicity adjustment, Mean Kinetic
// Temperature, drug-release kinetics model identification, BCS solubility
// classification, rheology, blister packaging material selection, zeta
// potential, IVIVC, osmotic pump release, PAT/NIR real-time release
// testing).
// Distinct from IP1_PILOT_050 (lib/ip1-pilot-050.ts), Day 1 (cleanroom/
// HVAC), Day 2 (impurity/cleaning/elemental/scale-up), Day 3
// (sterilization/aseptic processing) and Day 4 (process capability/
// sampling/qualification/tech transfer) — cross-checked against all of
// them:
//   - existing bank has "Powder flow" (ranking three given Carr's
//     index/angle-of-repose value sets by flowability) and "Pharmaceutical
//     calculation" (a basic 0.9% w/v NaCl dilution) — neither computes an
//     isotonicity adjustment via the Sodium Chloride Equivalent (E-value)
//     method, so Q1 tests a genuinely different calculation.
//   - existing bank has "Stability / zero vs first order" and "Stability /
//     Arrhenius", both about *chemical degradation* kinetics of an API
//     over shelf life — a different application from Q3 here, which
//     identifies a *drug-release* mechanism from a hydrophilic matrix
//     tablet via the Higuchi square-root-of-time model (a model the
//     existing bank never tests).
//   - existing bank has "Suspensions" (flocculated vs deflocculated
//     sediment behavior) and "Ostwald ripening" — neither covers zeta
//     potential as an electrokinetic stability indicator (Q7).
//   - Mean Kinetic Temperature / cold-chain excursion (Q2), BCS
//     dose/solubility-ratio biowaiver classification (Q4), thixotropy in
//     topical semisolids (Q5), blister packaging MVTR material selection
//     (Q6), Level A IVIVC (Q8), elementary osmotic pump zero-order release
//     (Q9), and PAT/in-line NIR real-time release testing (Q10) do not
//     appear anywhere in the existing 150-question bank or in Days 1-4.
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
const answerPositions = [3, 1, 0, 4, 2, 4, 2, 0, 1, 3];

const D: Draft[] = [
  {
    topic: "Isotonicity adjustment — Sodium Chloride Equivalent (E-value) method",
    prompt:
      "ต้องการเตรียมยาหยอดตา Drug X 1% w/v ปริมาตร 100 mL ให้เป็น isotonic solution (เทียบเท่า 0.9% w/v NaCl) โดย Drug X มีค่า Sodium Chloride Equivalent (E-value) = 0.18 จงคำนวณปริมาณ NaCl (กรัม) ที่ต้องเติมเพิ่มเพื่อปรับให้สารละลายนี้เป็น isotonic",
    options: [
      "0.72 g",
      "0.9 g (ใช้ปริมาณ NaCl สำหรับ isotonic เต็มจำนวนโดยลืมหักลบส่วนที่ตัวยาช่วย contribute ไปแล้ว)",
      "0.18 g (นำผลคูณของน้ำหนักยากับ E-value มาเป็นคำตอบสุดท้ายโดยไม่นำไปหักออกจาก 0.9 g)",
      "1.08 g (บวก 0.9 g กับ 0.18 g แทนที่จะลบ)",
      "0.162 g (คูณ 0.9×0.18 แทนที่จะคำนวณผลต่าง)",
    ],
    rationale:
      "น้ำหนัก Drug X ใน 100 mL ของสารละลาย 1% w/v = 1 g ซึ่งมีฤทธิ์เทียบเท่า NaCl = น้ำหนักยา × E-value = 1×0.18 = 0.18 g (NaCl equivalent ที่ตัวยาช่วย contribute ต่อ tonicity ไปแล้ว) ปริมาณ NaCl ทั้งหมดที่ต้องการเพื่อให้ 100 mL เป็น isotonic (0.9% w/v) = 0.9 g จึงต้องเติม NaCl เพิ่มอีกเท่ากับส่วนต่าง = 0.9−0.18 = 0.72 g",
    traps: [
      "ผิด — ตัวยาเองมีฤทธิ์ต่อ tonicity อยู่แล้วบางส่วน (ผ่าน E-value) จึงต้องหักลบออกจากปริมาณ NaCl เต็มจำนวนก่อน ไม่ใช่เติม NaCl เต็ม 0.9 g ตรงๆ ซึ่งจะทำให้สารละลาย hypertonic",
      "ผิด — ผลคูณน้ำหนักยา×E-value (0.18 g) คือปริมาณ NaCl equivalent ที่ตัวยา contribute ไปแล้ว ไม่ใช่ปริมาณ NaCl ที่ต้องเติมเพิ่ม ต้องนำไปหักออกจาก 0.9 g ก่อน",
      "ผิด — ต้องคำนวณผลต่าง (ลบ) ระหว่างปริมาณ NaCl ที่ต้องการทั้งหมดกับส่วนที่ตัวยา contribute ไปแล้ว ไม่ใช่บวกรวมกัน ซึ่งจะทำให้ได้ปริมาณ NaCl มากเกินความจำเป็นและได้สารละลาย hypertonic",
      "ผิด — สูตรการคำนวณ E-value method ใช้การลบ (ปริมาณ NaCl ที่ต้องการทั้งหมด ลบด้วย NaCl equivalent ที่ตัวยา contribute) ไม่ใช่การคูณกัน",
    ],
    difficulty: "hard",
    ref: "Sodium Chloride Equivalent (E-value) method — isotonicity adjustment principles",
    calc: [
      "น้ำหนัก Drug X ใน 100 mL (1% w/v) = 1 g",
      "NaCl equivalent จาก Drug X = 1 g × E-value (0.18) = 0.18 g",
      "NaCl ทั้งหมดที่ต้องการสำหรับ isotonic (0.9% w/v ของ 100 mL) = 0.9 g",
      "NaCl ที่ต้องเติมเพิ่ม = 0.9 − 0.18 = 0.72 g",
    ],
  },
  {
    topic: "Cold-chain temperature excursion — Mean Kinetic Temperature (MKT) calculation",
    prompt:
      "การขนส่งยาภายใต้ระบบ cold chain บันทึกอุณหภูมิเฉลี่ยรายเดือนตลอด 4 เดือนได้ 25°C, 30°C, 28°C และ 27°C ตามลำดับ เมื่อคำนวณ Mean Kinetic Temperature (MKT) ตามสมการ Haynes (ใช้ effective activation energy ΔH = 83.144 kJ/mol) จะได้ค่าประมาณเท่าใด และมีความสัมพันธ์กับค่าเฉลี่ยเลขคณิตธรรมดาอย่างไร",
    options: [
      "MKT ≈ 27.7°C ซึ่งสูงกว่าค่าเฉลี่ยเลขคณิตธรรมดา (27.5°C) เล็กน้อย เพราะ MKT ถ่วงน้ำหนักตามความสัมพันธ์แบบ Arrhenius ทำให้ช่วงอุณหภูมิสูงมีผลต่อค่าที่คำนวณได้มากกว่าช่วงอุณหภูมิต่ำตามสัดส่วนที่เท่ากัน",
      "MKT ≈ 27.5°C ซึ่งเท่ากับค่าเฉลี่ยเลขคณิตธรรมดาพอดี (ใช้สูตรค่าเฉลี่ยเลขคณิตธรรมดาแทนสูตร MKT ที่แท้จริงซึ่งต้องผ่านการถ่วงน้ำหนักแบบ exponential)",
      "MKT ≈ 30°C (ใช้อุณหภูมิสูงสุดที่บันทึกได้ตลอดช่วงเป็นค่า MKT โดยตรง)",
      "MKT ≈ 25°C (ใช้อุณหภูมิต่ำสุดที่บันทึกได้ตลอดช่วงเป็นค่า MKT โดยตรง)",
      "MKT ต้องต่ำกว่าค่าเฉลี่ยเลขคณิตเสมอ เพราะการถ่วงน้ำหนักแบบ Arrhenius ลดผลของอุณหภูมิสูงลง",
    ],
    rationale:
      "MKT ตามสมการ Haynes คำนวณจาก MKT = (ΔH/R) ÷ ln[ Σexp(−ΔH/(R·Ti)) ÷ n ] ซึ่งเป็นการถ่วงน้ำหนักแบบ Arrhenius (exponential) ไม่ใช่ค่าเฉลี่ยเลขคณิตธรรมดา เมื่อคำนวณกับข้อมูล 25/30/28/27°C จะได้ MKT ≈ 27.7°C ซึ่งสูงกว่าค่าเฉลี่ยเลขคณิต (27.5°C) เล็กน้อยเสมอ เนื่องจากความสัมพันธ์แบบ Arrhenius เป็นฟังก์ชัน convex ทำให้ช่วงเวลาที่อุณหภูมิสูงกว่ามีผลกระทบต่อ cumulative thermal/degradation exposure มากกว่าสัดส่วนเวลาที่เท่ากันในช่วงอุณหภูมิต่ำกว่า MKT จึงมีค่า ≥ ค่าเฉลี่ยเลขคณิตเสมอ ไม่ใช่ต่ำกว่า",
    traps: [
      "ผิด — MKT ไม่ใช่ค่าเฉลี่ยเลขคณิตธรรมดา ต้องผ่านการถ่วงน้ำหนักแบบ Arrhenius (exponential) ตามสมการ Haynes ซึ่งในกรณีนี้ให้ค่าสูงกว่าค่าเฉลี่ยเลขคณิตเล็กน้อย",
      "ผิด — MKT คำนวณจากข้อมูลอุณหภูมิทั้งชุดผ่านสมการ Haynes ไม่ใช่การเลือกใช้เพียงค่าอุณหภูมิสูงสุดที่บันทึกได้",
      "ผิด — MKT คำนวณจากข้อมูลอุณหภูมิทั้งชุดผ่านสมการ Haynes ไม่ใช่การเลือกใช้เพียงค่าอุณหภูมิต่ำสุดที่บันทึกได้",
      "ผิด — ทิศทางกลับกัน เนื่องจากความสัมพันธ์แบบ Arrhenius เป็นฟังก์ชัน convex การถ่วงน้ำหนักแบบนี้ทำให้ MKT มีค่าสูงกว่าหรือเท่ากับค่าเฉลี่ยเลขคณิตเสมอ ไม่ใช่ต่ำกว่า",
    ],
    difficulty: "hard",
    ref: "USP <1150>; WHO Technical Report Series — Mean Kinetic Temperature (Haynes equation) for cold-chain/GDP thermal monitoring",
    calc: [
      "แปลงอุณหภูมิเป็น Kelvin: 298.15, 303.15, 301.15, 300.15 K",
      "คำนวณ Σexp(−ΔH/(R·Ti)) สำหรับแต่ละเดือน แล้วหาค่าเฉลี่ย (n=4)",
      "MKT (K) = (ΔH/R) ÷ [−ln(ค่าเฉลี่ยของ exponential terms)] ≈ 300.8 K",
      "MKT (°C) ≈ 300.8 − 273.15 ≈ 27.7°C (เทียบกับค่าเฉลี่ยเลขคณิต 27.5°C)",
    ],
  },
  {
    topic: "Drug-release kinetics — Higuchi model identification from matrix dissolution data",
    prompt:
      "ยาเม็ด matrix แบบ hydrophilic (HPMC matrix) มีข้อมูล cumulative % released ดังนี้: ที่ 1 ชั่วโมง = 20%, ที่ 4 ชั่วโมง = 40%, ที่ 9 ชั่วโมง = 60% กลไกการปลดปล่อยแบบใดสอดคล้องกับข้อมูลชุดนี้มากที่สุด และใช้หลักฐานใดยืนยัน",
    options: [
      "Higuchi model (Q=k√t) เพราะอัตราส่วน Q/√t คงที่เท่ากับ 20 ทุกจุดเวลา (20/√1=20, 40/√4=20, 60/√9=20) บ่งชี้กลไกการปลดปล่อยแบบ diffusion-controlled จาก matrix",
      "Zero-order release (Q=k₀t) เพราะปริมาณที่ปลดปล่อยเพิ่มขึ้นตามเวลาอย่างต่อเนื่องโดยไม่มีการชะลอตัว",
      "First-order release เพราะเปอร์เซ็นต์ยาที่เหลือในเม็ดลดลงตามเวลา",
      "Hixson-Crowell cube-root model เพราะพื้นที่ผิวของเม็ดยาลดลงระหว่างกระบวนการละลาย",
      "ไม่สามารถระบุกลไกการปลดปล่อยได้จากข้อมูลเพียง 3 จุดเวลา ต้องมีข้อมูลอย่างน้อย 6 จุดขึ้นไปเสมอ",
    ],
    rationale:
      "การตรวจสอบว่าข้อมูลสอดคล้องกับ Higuchi model ทำได้โดยคำนวณอัตราส่วน Q/√t ที่แต่ละจุดเวลา หากอัตราส่วนนี้คงที่ (constant k) แสดงว่าข้อมูลเป็นเส้นตรงเมื่อ plot กับ √t ซึ่งเป็นลักษณะเฉพาะของ Higuchi model (diffusion-controlled release จาก matrix system) ในกรณีนี้ Q/√t = 20 คงที่ทุกจุด (20/1=20, 40/2=20, 60/3=20) จึงยืนยันว่าข้อมูลสอดคล้องกับ Higuchi model ในขณะที่ Q/t (zero-order check) ให้ค่า 20, 10, 6.67 ซึ่งไม่คงที่ จึงไม่ใช่ zero-order",
    traps: [
      "ผิด — หากเป็น zero-order ต้องมีอัตราส่วน Q/t คงที่ แต่ข้อมูลนี้ให้ Q/t = 20, 10, 6.67 ตามลำดับซึ่งลดลงเรื่อยๆ ไม่คงที่ จึงไม่ใช่ zero-order",
      "ผิด — First-order release ต้องให้ ln(ปริมาณที่เหลือ) เป็นเส้นตรงเทียบกับ t แต่รูปแบบการลดลงของข้อมูลชุดนี้ไม่สอดคล้องกับความสัมพันธ์เชิงเส้นแบบ first-order เท่ากับที่ Q/√t ให้ค่าคงที่แบบสมบูรณ์สำหรับ Higuchi model",
      "ผิด — Hixson-Crowell model ใช้กับระบบที่พื้นที่ผิวเปลี่ยนแปลงระหว่างการละลาย (เช่น อนุภาคที่กัดกร่อน) ซึ่งเป็นกลไกคนละแบบกับ diffusion-controlled matrix release ที่ข้อมูลนี้แสดงให้เห็นชัดเจนผ่านอัตราส่วน Q/√t ที่คงที่",
      "ผิด — สามารถตรวจสอบความสอดคล้องกับโมเดลทางคณิตศาสตร์ได้จากรูปแบบความสัมพันธ์ของข้อมูลแม้มีจำนวนจุดจำกัด โดยเฉพาะเมื่อพบรูปแบบที่ชัดเจนอย่างอัตราส่วนคงที่เช่นในกรณีนี้ ไม่มีข้อกำหนดตายตัวว่าต้องมีอย่างน้อย 6 จุดเสมอ",
    ],
    difficulty: "hard",
    ref: "Higuchi, T. — Mechanism of sustained-action medication (1963); matrix drug-release kinetics models",
    calc: [
      "ตรวจสอบ Higuchi (Q/√t): 20/√1=20, 40/√4=20, 60/√9=20 → คงที่ทุกจุด (สอดคล้อง)",
      "ตรวจสอบ zero-order (Q/t): 20/1=20, 40/4=10, 60/9≈6.67 → ไม่คงที่ (ไม่สอดคล้อง)",
      "สรุป: ข้อมูลสอดคล้องกับ Higuchi model (diffusion-controlled release, k=20 %/√h)",
    ],
  },
  {
    topic: "BCS biowaiver — solubility classification (dose/solubility ratio) calculation",
    prompt:
      "เกณฑ์ BCS กำหนดว่า API จะจัดเป็น 'highly soluble' ก็ต่อเมื่อ maximum dose strength ละลายได้หมดในปริมาตรน้ำไม่เกิน 250 mL ตลอดช่วง pH 1.2–6.8 API ตัวหนึ่งมี maximum dose strength = 400 mg และมีค่าความสามารถในการละลายต่ำสุดที่วัดได้ตลอดช่วง pH ดังกล่าว = 1.5 mg/mL จงคำนวณปริมาตรขั้นต่ำที่ต้องใช้ละลาย dose นี้ให้หมด แล้วสรุปว่า API นี้จัดเป็น highly soluble ตามเกณฑ์ BCS หรือไม่",
    options: [
      "ต้องใช้ปริมาตรอย่างน้อย 266.7 mL ซึ่งเกิน 250 mL จึงไม่จัดเป็น highly soluble ตามเกณฑ์ BCS แม้จะใกล้เคียงเกณฑ์มากก็ตาม",
      "ต้องใช้ปริมาตรเพียง 0.00375 mL (สลับตัวหาร/ตัวตั้ง: solubility÷dose แทนที่จะเป็น dose÷solubility) จึงจัดเป็น highly soluble",
      "ต้องใช้ปริมาตรพอดี 250 mL เสมอ (เข้าใจผิดว่าต้องปัดผลลัพธ์ให้เท่ากับเกณฑ์สูงสุดที่กำหนดไว้)",
      "จัดเป็น highly soluble ได้ทันทีเพราะตัวเลข dose (400) มากกว่าตัวเลข solubility (1.5) เมื่อเทียบกันโดยตรงโดยไม่คำนึงหน่วยที่ต่างกัน (mg เทียบกับ mg/mL)",
      "ต้องใช้ปริมาตร 600 mL (คำนวณจาก 400×1.5 แทนที่จะหาร 400÷1.5)",
    ],
    rationale:
      "ปริมาตรขั้นต่ำที่ต้องใช้ละลาย dose ทั้งหมด = dose ÷ solubility = 400 mg ÷ 1.5 mg/mL ≈ 266.7 mL ซึ่งเกินเกณฑ์ 250 mL ของ BCS เล็กน้อย API นี้จึงไม่จัดเป็น 'highly soluble' ตามเกณฑ์ BCS (แม้ตัวเลขจะใกล้เคียงเกณฑ์มาก ซึ่งอาจส่งผลต่อการพิจารณาขอ biowaiver สำหรับผลิตภัณฑ์ generic ของ API นี้)",
    traps: [
      "ผิด — สูตรที่ถูกต้องคือ ปริมาตร = dose ÷ solubility ไม่ใช่ solubility ÷ dose การสลับตัวหาร/ตัวตั้งทำให้ได้ค่าที่เล็กผิดปกติและสรุปผิดทิศทาง",
      "ผิด — ผลการคำนวณจริง (266.7 mL) ไม่ใช่ 250 mL พอดี ต้องคำนวณจากตัวเลขที่ให้มาจริง ไม่ใช่ปัดให้ตรงกับค่าเกณฑ์",
      "ผิด — Dose (หน่วย mg) และ solubility (หน่วย mg/mL) เป็นคนละหน่วยกัน ไม่สามารถเปรียบเทียบตัวเลขกันโดยตรงได้ ต้องคำนวณปริมาตรที่ต้องใช้ก่อนแล้วจึงเทียบกับเกณฑ์ 250 mL",
      "ผิด — สูตรที่ถูกต้องคือการหาร (dose ÷ solubility) ไม่ใช่การคูณ ซึ่งจะให้หน่วยและค่าที่ไม่สอดคล้องกับความหมายทางกายภาพของ 'ปริมาตรที่ต้องใช้ละลาย'",
    ],
    difficulty: "hard",
    ref: "FDA/WHO BCS-based biowaiver guidance — solubility classification (dose/solubility ratio)",
    calc: [
      "ปริมาตรขั้นต่ำที่ต้องใช้ = dose ÷ solubility = 400 mg ÷ 1.5 mg/mL ≈ 266.7 mL",
      "เทียบกับเกณฑ์ BCS (≤250 mL): 266.7 mL > 250 mL → ไม่ผ่านเกณฑ์ highly soluble",
    ],
  },
  {
    topic: "Rheology — thixotropy in topical semisolid formulation",
    prompt:
      "การวัด rheogram (shear stress เทียบกับ shear rate) ของครีมทาผิวชนิดหนึ่งพบว่าเส้น up-curve (shear rate เพิ่มขึ้น) และ down-curve (shear rate ลดลง) ไม่ทับกัน เกิดเป็นพื้นที่ hysteresis loop โดยความหนืดที่วัดได้ในช่วง down-curve ต่ำกว่า up-curve ที่ shear rate เดียวกัน และค่อยๆ ฟื้นตัวกลับสู่ความหนืดเดิมเมื่อปล่อยทิ้งไว้ พฤติกรรมนี้เรียกว่าอะไร และมีประโยชน์อย่างไรต่อผลิตภัณฑ์ทาผิว",
    options: [
      "Thixotropy — ความหนืดลดลงชั่วคราวเมื่อถูกแรงเฉือน (เช่นขณะทาและถูนวด) ทำให้ผลิตภัณฑ์ไหล/กระจายตัวง่ายขึ้น แล้วฟื้นตัวกลับสู่ความหนืดเดิมเมื่อหยุดแรงเฉือน (ตั้งทิ้งไว้) ช่วยป้องกันการไหลย้อย/หยดจากผิวหลังทา",
      "Rheopexy — ความหนืดเพิ่มขึ้นตามระยะเวลาที่ถูกแรงเฉือน ซึ่งเป็นคุณสมบัติที่พึงประสงค์สำหรับครีมทาผิวเช่นเดียวกับ thixotropy",
      "Newtonian flow — ความหนืดคงที่ไม่ขึ้นกับ shear rate หรือระยะเวลา จึงไม่ควรเกิด hysteresis loop ใดๆ",
      "Dilatant (shear-thickening) flow — ความหนืดเพิ่มขึ้นเมื่อ shear rate เพิ่มขึ้น โดยไม่ขึ้นกับระยะเวลาที่ถูกแรงเฉือน",
      "พื้นที่ hysteresis loop ที่พบเป็นเพียงความคลาดเคลื่อนจากการวัด (measurement artifact) ที่ควรตัดออกจากการพิจารณา ไม่ใช่คุณสมบัติทาง rheology ที่มีความหมาย",
    ],
    rationale:
      "Thixotropy คือพฤติกรรมการไหลที่ขึ้นกับเวลา (time-dependent shear-thinning) ซึ่งความหนืดลดลงเมื่อถูกแรงเฉือนต่อเนื่องและค่อยๆ ฟื้นตัวกลับเมื่อหยุดแรงเฉือน แสดงออกเป็น hysteresis loop ระหว่าง up-curve และ down-curve บน rheogram คุณสมบัตินี้เป็นที่พึงประสงค์สำหรับผลิตภัณฑ์ทาผิวเพราะช่วยให้ผลิตภัณฑ์ไหล/กระจายตัวง่ายขณะทา (ภายใต้แรงเฉือนจากการถูนวด) แต่กลับมามีความหนืดสูงเมื่อหยุดแรงเฉือน (อยู่บนผิว) ช่วยป้องกันการไหลย้อยหรือหยดออกจากบริเวณที่ทา",
    traps: [
      "ผิด — Rheopexy เป็นพฤติกรรมตรงข้ามกับ thixotropy (ความหนืดเพิ่มขึ้นตามเวลาที่ถูกแรงเฉือน) ซึ่งพบได้น้อยมากและโดยทั่วไปไม่ใช่คุณสมบัติที่ต้องการสำหรับผลิตภัณฑ์ทาผิว",
      "ผิด — Newtonian flow มีความหนืดคงที่ไม่ว่าจะที่ shear rate ใดหรือระยะเวลาใด จึงไม่ควรเกิด hysteresis loop ระหว่าง up-curve และ down-curve เลย ซึ่งขัดกับข้อมูลที่ให้มา",
      "ผิด — Dilatant flow เป็นพฤติกรรมที่ไม่ขึ้นกับเวลา (time-independent) โดยความหนืดสัมพันธ์กับ shear rate ขณะนั้นเท่านั้น ไม่ได้อธิบายปรากฏการณ์ hysteresis loop ที่ขึ้นกับประวัติของแรงเฉือนและเวลาที่ให้มาในโจทย์",
      "ผิด — พื้นที่ hysteresis loop เป็นตัวชี้วัดเชิงปริมาณที่มีความหมายทาง rheology จริง สะท้อนระดับของ thixotropic breakdown/recovery ของโครงสร้างภายในผลิตภัณฑ์ ไม่ใช่ความคลาดเคลื่อนที่ควรมองข้าม",
    ],
    difficulty: "medium",
    ref: "Aulton's Pharmaceutics — rheology of semisolid dosage forms; thixotropy",
  },
  {
    topic: "Blister packaging material selection — Moisture Vapor Transmission Rate (MVTR)",
    prompt:
      "API ตัวหนึ่งไวต่อความชื้นสูงมาก (very hygroscopic) จำเป็นต้องเลือกวัสดุบรรจุแบบ blister ระหว่าง PVC/PVDC (moderate moisture barrier) กับ Alu-Alu (cold-form aluminum-aluminum, high moisture barrier) ข้อใดเป็นการเลือกและเหตุผลที่เหมาะสมที่สุด",
    options: [
      "เลือก Alu-Alu (cold-form aluminum) เพราะมีค่า MVTR ต่ำที่สุด (แทบเป็นศูนย์) ให้การป้องกันความชื้นสูงสุด เหมาะกับ API ที่ไวต่อความชื้นสูงมาก แม้จะมีต้นทุนสูงกว่า PVC/PVDC",
      "เลือก PVC/PVDC เพราะมีต้นทุนต่ำกว่าเสมอ โดยไม่จำเป็นต้องพิจารณาระดับความไวต่อความชื้นของ API",
      "MVTR ไม่มีผลต่อการเลือกวัสดุ blister ตราบใดที่ผลิตภัณฑ์ผ่านการตรวจสอบด้วยสายตา (visual inspection) ในขั้นตอนบรรจุ",
      "PVDC coating ที่หนาเพียงพอจะให้ moisture barrier เทียบเท่า Alu-Alu ได้เสมอในทุกความหนา",
      "ควรเลือกวัสดุที่มีต้นทุนต่ำที่สุดเป็นอันดับแรกเสมอ แล้วค่อยพิจารณาการปรับ formulation เพื่อชดเชยความไวต่อความชื้นภายหลัง",
    ],
    rationale:
      "MVTR (Moisture Vapor Transmission Rate) เป็นตัวชี้วัดสำคัญในการเลือกวัสดุบรรจุสำหรับ API ที่ไวต่อความชื้น Alu-Alu (cold-form aluminum-aluminum blister) มี MVTR ต่ำที่สุด (แทบเป็นศูนย์) เนื่องจากแผ่นอลูมิเนียมทึบแสงและกันความชื้นได้เกือบสมบูรณ์ จึงเหมาะสมที่สุดสำหรับ API ที่ไวต่อความชื้นสูงมาก แม้จะมีต้นทุนสูงกว่า PVC/PVDC ซึ่งเป็น moderate barrier ที่อาจไม่เพียงพอสำหรับกรณีนี้ การเลือกวัสดุบรรจุต้องพิจารณาความเสี่ยงด้าน stability ของผลิตภัณฑ์เป็นหลัก ไม่ใช่ต้นทุนเพียงอย่างเดียว",
    traps: [
      "ผิด — PVC/PVDC เป็นเพียง moderate moisture barrier ซึ่งอาจไม่เพียงพอสำหรับ API ที่ไวต่อความชื้นสูงมาก การเลือกวัสดุบรรจุต้องพิจารณาความไวต่อความชื้นของ API เป็นหลัก ไม่ใช่ต้นทุนเพียงอย่างเดียว",
      "ผิด — Visual inspection ตรวจพบเฉพาะข้อบกพร่องทางกายภาพที่มองเห็นได้ ไม่สามารถยืนยันคุณสมบัติ moisture barrier ของวัสดุบรรจุซึ่งเป็นคุณสมบัติเชิงฟิสิกส์/เคมีที่ต้องประเมินจากค่า MVTR",
      "ผิด — แม้ PVDC coating จะช่วยปรับปรุง moisture barrier ของ PVC ได้ในระดับหนึ่ง แต่ไม่สามารถให้ผลเทียบเท่า Alu-Alu ได้อย่างสมบูรณ์ไม่ว่าจะเพิ่มความหนาเท่าใด สำหรับ API ที่ไวต่อความชื้นสูงมาก",
      "ผิด — การเลือกวัสดุบรรจุที่ให้ moisture protection ไม่เพียงพอตั้งแต่ต้น แล้วหวังพึ่งการปรับ formulation ชดเชยภายหลัง เป็นแนวทางที่มีความเสี่ยงสูงต่อ product stability และไม่สอดคล้องกับหลัก Quality by Design ที่ควรออกแบบระบบบรรจุให้เหมาะสมตั้งแต่ต้น",
    ],
    difficulty: "medium",
    ref: "Pharmaceutical packaging science — MVTR and moisture-sensitive drug product packaging selection",
  },
  {
    topic: "Zeta potential — electrokinetic indicator of colloidal/suspension stability",
    prompt:
      "การวัด zeta potential ของอนุภาคในระบบ colloidal suspension มีประโยชน์อย่างไรต่อการทำนายเสถียรภาพทางกายภาพของระบบ",
    options: [
      "Zeta potential ที่มีค่าสัมบูรณ์สูง (บวกหรือลบมาก) บ่งชี้แรงผลักไฟฟ้าสถิตระหว่างอนุภาคสูง ลดแนวโน้มการรวมตัวกัน (aggregation) จึงช่วยทำนาย physical stability ของระบบได้ ในขณะที่ค่าที่ใกล้ศูนย์บ่งชี้แรงผลักต่ำและมีความเสี่ยงต่อการรวมตัวกันมากขึ้น",
      "Zeta potential ที่มีค่าสัมบูรณ์สูงเสมอบ่งชี้ว่าระบบไม่เสถียรและมีแนวโน้มตกตะกอนเร็วกว่าระบบที่มีค่าใกล้ศูนย์",
      "Zeta potential เป็นค่าที่ใช้วัด pH ของระบบ colloidal suspension โดยตรง",
      "Zeta potential ไม่มีความเกี่ยวข้องกับเสถียรภาพทางกายภาพของระบบ เกี่ยวข้องเฉพาะกับสี/ลักษณะภายนอกของผลิตภัณฑ์เท่านั้น",
      "Zeta potential ที่มีค่าใกล้ศูนย์แสดงว่าระบบมีเสถียรภาพสูงที่สุด เพราะอนุภาคอยู่ในสภาวะเป็นกลางทางไฟฟ้า",
    ],
    rationale:
      "Zeta potential คือศักย์ไฟฟ้าที่ผิว slipping plane ของอนุภาคในของเหลว ซึ่งสะท้อนขนาดของแรงผลักไฟฟ้าสถิตระหว่างอนุภาคที่มีประจุชนิดเดียวกัน ค่าสัมบูรณ์ที่สูง (ไม่ว่าจะเป็นบวกหรือลบมาก) บ่งชี้แรงผลักที่แข็งแรงเพียงพอที่จะป้องกันไม่ให้อนุภาคเข้าใกล้กันจนเกิดการรวมตัว (aggregation/coagulation) ทำให้ระบบมีเสถียรภาพทางกายภาพที่ดีกว่า ในขณะที่ค่าที่ใกล้ศูนย์บ่งชี้แรงผลักที่อ่อนแอและความเสี่ยงต่อการรวมตัวกันที่สูงขึ้น",
    traps: [
      "ผิด — ทิศทางกลับกัน ค่าสัมบูรณ์ที่สูงของ zeta potential บ่งชี้แรงผลักไฟฟ้าสถิตที่แข็งแรง ซึ่งโดยทั่วไปสัมพันธ์กับเสถียรภาพทางกายภาพที่ดีกว่า ไม่ใช่แย่กว่า",
      "ผิด — Zeta potential เป็นศักย์ไฟฟ้าที่ผิวอนุภาค (electrokinetic potential) ไม่ใช่การวัด pH ของระบบโดยตรง แม้ pH ของตัวกลางอาจมีผลต่อค่า zeta potential ที่วัดได้ก็ตาม",
      "ผิด — Zeta potential เป็นตัวชี้วัดสำคัญของเสถียรภาพทางกายภาพของ colloidal system (ผ่านทฤษฎี DLVO) ไม่ได้เกี่ยวข้องเฉพาะกับลักษณะภายนอกของผลิตภัณฑ์เท่านั้น",
      "ผิด — ค่าที่ใกล้ศูนย์บ่งชี้แรงผลักไฟฟ้าสถิตที่อ่อนแอ (isoelectric point) ซึ่งมักสัมพันธ์กับความเสี่ยงต่อการรวมตัวกันของอนุภาคที่สูงขึ้น ไม่ใช่เสถียรภาพที่ดีที่สุด",
    ],
    difficulty: "medium",
    ref: "DLVO theory; colloidal/suspension physical stability principles",
  },
  {
    topic: "In vitro-in vivo correlation (IVIVC) — Level A correlation",
    prompt:
      "ข้อใดอธิบาย Level A In Vitro-In Vivo Correlation (IVIVC) ได้ถูกต้องที่สุด และประโยชน์หลักในการพัฒนาผลิตภัณฑ์ modified-release",
    options: [
      "Level A คือความสัมพันธ์แบบจุดต่อจุด (point-to-point) ระหว่าง in vitro dissolution profile ทั้งเส้นกับ in vivo input/absorption profile ทั้งเส้น เป็นระดับที่มีประโยชน์สูงสุดเพราะสามารถใช้ dissolution data ทำนาย in vivo performance และช่วยกำหนด dissolution specification หรือสนับสนุนการขอ biowaiver สำหรับการเปลี่ยนแปลงหลัง approval ได้",
      "Level A คือความสัมพันธ์ระหว่างค่าเดียว (single point) ของ dissolution กับค่าเดียวของ pharmacokinetic parameter เช่น Cmax เท่านั้น",
      "Level A ใช้ได้เฉพาะกับผลิตภัณฑ์ immediate-release เท่านั้น ไม่สามารถประยุกต์ใช้กับผลิตภัณฑ์ modified-release ได้",
      "IVIVC ไม่ว่าระดับใดสามารถใช้ทดแทนการศึกษา bioequivalence ในมนุษย์ได้เสมอโดยไม่มีข้อจำกัดหรือการประเมินความเหมาะสมเพิ่มเติม",
      "Level A มีประโยชน์น้อยที่สุดในบรรดาทุกระดับของ IVIVC เพราะต้องใช้ข้อมูล dissolution และ pharmacokinetic ที่ละเอียดมากที่สุด",
    ],
    rationale:
      "Level A IVIVC เป็นระดับความสัมพันธ์ที่ละเอียดและมีประโยชน์สูงสุดในบรรดาระดับต่างๆ ของ IVIVC เพราะเป็นความสัมพันธ์แบบจุดต่อจุดระหว่าง in vitro dissolution profile ทั้งเส้นกับ in vivo input/absorption profile ทั้งเส้น (ไม่ใช่เพียงจุดเดียว) ทำให้สามารถใช้ dissolution data ในหลอดทดลองทำนายพฤติกรรมการดูดซึมในร่างกายได้อย่างน่าเชื่อถือ และมีประโยชน์อย่างมากในการกำหนด dissolution specification ที่มีความหมายทางคลินิก รวมถึงสนับสนุนการขอ biowaiver สำหรับการเปลี่ยนแปลงบางประเภทหลังการขึ้นทะเบียน (post-approval changes) ของผลิตภัณฑ์ modified-release โดยเฉพาะ",
    traps: [
      "ผิด — คำอธิบายนี้ใกล้เคียงกับ Level C มากกว่า (ความสัมพันธ์ระหว่างจุดเดียวของ dissolution กับพารามิเตอร์ทางเภสัชจลนศาสตร์จุดเดียว) ซึ่งเป็นระดับความสัมพันธ์ที่หยาบกว่าและมีประโยชน์น้อยกว่า Level A",
      "ผิด — Level A มีประโยชน์และมักถูกพัฒนาสำหรับผลิตภัณฑ์ modified/extended-release เป็นหลัก ไม่ใช่จำกัดเฉพาะ immediate-release",
      "ผิด — IVIVC แม้จะมีประโยชน์มากในการสนับสนุนการพัฒนาผลิตภัณฑ์และบางกรณีอาจสนับสนุน biowaiver ได้ แต่ยังต้องผ่านการประเมิน/qualify ความเหมาะสมตามบริบทการใช้งาน ไม่ใช่ทดแทนการศึกษา bioequivalence ในมนุษย์ได้เสมอไปโดยไม่มีข้อจำกัด",
      "ผิด — Level A ถือเป็นระดับ IVIVC ที่มีประโยชน์และน่าเชื่อถือมากที่สุดในบรรดาทุกระดับ แม้จะต้องใช้ข้อมูลที่ละเอียดมากกว่า Level B หรือ C ก็ตาม",
    ],
    difficulty: "hard",
    ref: "FDA Guidance for Industry — Extended Release Oral Dosage Forms: Development, Evaluation, and Application of IVIVC",
  },
  {
    topic: "Elementary osmotic pump (EOP) — zero-order, pH-independent drug release",
    prompt:
      "Osmotic pump tablet แบบ elementary osmotic pump (EOP) ที่มี semipermeable membrane และ delivery orifice ขนาดที่เหมาะสม ให้ลักษณะการปลดปล่อยยาแบบใด และปัจจัยใดควบคุมอัตราการปลดปล่อยเป็นหลักโดยไม่ขึ้นกับสภาวะ pH หรือเอนไซม์ของทางเดินอาหาร",
    options: [
      "ปลดปล่อยแบบ zero-order (อัตราคงที่) ควบคุมโดยอัตราการซึมผ่านของน้ำเข้าสู่แกนกลางผ่าน semipermeable membrane ตาม osmotic pressure gradient ซึ่งไม่ขึ้นกับ pH หรือเอนไซม์ของทางเดินอาหาร ทำให้ release profile ค่อนข้างสม่ำเสมอตลอดทางเดินอาหาร",
      "ปลดปล่อยแบบ first-order ควบคุมโดยอัตราการย่อยสลายของเปลือกเม็ดยา (membrane) ด้วยเอนไซม์ในทางเดินอาหาร",
      "อัตราการปลดปล่อยขึ้นกับ pH ของทางเดินอาหารเป็นหลัก เช่นเดียวกับกลไกของ enteric coating",
      "ขนาดของ delivery orifice ไม่มีผลต่ออัตราการปลดปล่อยตราบใดที่มีรูเปิดอยู่ ไม่ว่าจะมีขนาดเล็กหรือใหญ่เพียงใด",
      "กลไกหลักของการปลดปล่อยยาคือการกัดกร่อน (erosion) ของเม็ดยาทั้งเม็ด ไม่ใช่แรงดัน osmotic pressure",
    ],
    rationale:
      "Elementary osmotic pump ปลดปล่อยยาแบบ zero-order (อัตราคงที่) โดยควบคุมด้วยอัตราการซึมผ่านของน้ำจากสิ่งแวดล้อมเข้าสู่แกนกลางผ่าน semipermeable membrane ตาม osmotic pressure gradient ที่สร้างจากตัวยา/สารเสริม osmotic ภายในแกนกลาง น้ำที่ซึมเข้ามาจะละลาย/พองตัวแกนกลางและดันสารละลายยาออกทาง delivery orifice ในอัตราที่ค่อนข้างคงที่ กลไกนี้ไม่ขึ้นกับ pH หรือเอนไซม์ของทางเดินอาหาร จึงให้ release profile ที่สม่ำเสมอไม่ว่าจะอยู่ในสภาวะใดของทางเดินอาหาร ทั้งนี้ขนาดของ delivery orifice ต้องอยู่ในช่วงที่เหมาะสม (ไม่เล็กหรือใหญ่เกินไป) เพื่อรักษาการควบคุมแบบ zero-order",
    traps: [
      "ผิด — กลไกการปลดปล่อยของ osmotic pump ไม่เกี่ยวข้องกับการย่อยสลายด้วยเอนไซม์ แต่ควบคุมด้วยแรงดัน osmotic pressure ผ่าน semipermeable membrane ซึ่งเป็นกระบวนการทางฟิสิกส์ ไม่ใช่ทางชีวเคมี",
      "ผิด — จุดเด่นสำคัญของ osmotic pump คือการปลดปล่อยที่ไม่ขึ้นกับ pH (pH-independent) ต่างจาก enteric coating ที่อาศัย pH-dependent solubility ของ polymer เป็นกลไกหลัก",
      "ผิด — ขนาดของ delivery orifice มีผลสำคัญต่ออัตราการปลดปล่อย รูที่เล็กเกินไปอาจทำให้เกิดแรงดันสะสมภายในผิดปกติและการปลดปล่อยไม่สม่ำเสมอ ส่วนรูที่ใหญ่เกินไปอาจทำให้เกิดการสูญเสียยาผ่านการแพร่ (diffusion) แทนที่จะถูกดันออกอย่างควบคุม ทำให้ไม่รักษาลักษณะ zero-order ได้อย่างสมบูรณ์",
      "ผิด — กลไกหลักของ osmotic pump คือแรงดัน osmotic pressure ที่ดันสารละลายยาออกทาง orifice ไม่ใช่การกัดกร่อนของเม็ดยาทั้งเม็ดซึ่งเป็นกลไกของระบบปลดปล่อยยาประเภทอื่น",
    ],
    difficulty: "medium",
    ref: "Aulton's Pharmaceutics — osmotic drug delivery systems (elementary osmotic pump)",
  },
  {
    topic: "Process Analytical Technology (PAT) — in-line NIR real-time release testing",
    prompt:
      "กระบวนการผลิตยาเม็ดใช้ NIR (Near-Infrared spectroscopy) แบบ in-line เพื่อติดตาม blend uniformity แบบ real-time ระหว่างการผสม (blending) แทนการสุ่มตัวอย่างแบบ off-line ด้วย thief probe ตามธรรมเนียม ข้อใดอธิบายประโยชน์หลักของแนวทาง Process Analytical Technology (PAT) นี้ได้ถูกต้องที่สุด",
    options: [
      "PAT ด้วย in-line NIR ช่วยให้ตรวจติดตามและควบคุมกระบวนการแบบ real-time (เช่น กำหนดจุดสิ้นสุดการผสมตามความสม่ำเสมอที่วัดได้จริง) ลดความเสี่ยงจาก sampling error ของการสุ่มตัวอย่างด้วยมือที่อาจรบกวน powder bed หรือเกิด segregation ระหว่างการสุ่ม และสนับสนุนแนวคิด Quality by Design ในการสร้างคุณภาพเข้าไปในกระบวนการแทนการตรวจสอบคุณภาพในผลิตภัณฑ์สุดท้ายเพียงอย่างเดียว",
      "In-line NIR ให้ผลแม่นยำน้อยกว่า off-line HPLC เสมอ จึงไม่ควรนำมาใช้ทดแทนการสุ่มตัวอย่างแบบเดิมในกรณีใดๆ",
      "PAT สามารถใช้ได้เฉพาะกับกระบวนการ blending เท่านั้น ไม่สามารถประยุกต์ใช้กับ unit operation อื่น เช่น granulation หรือ coating ได้",
      "การใช้ NIR แบบ in-line ไม่จำเป็นต้องผ่านการ validate chemometric model ก่อนใช้งานจริง เนื่องจากเป็นเพียงเครื่องมือ monitoring เสริมที่ไม่มีผลต่อการตัดสินใจปล่อยผ่านผลิตภัณฑ์",
      "เป้าหมายหลักของ PAT คือการลดความถี่การตรวจสอบคุณภาพขั้นสุดท้ายเพื่อประหยัดต้นทุนเท่านั้น โดยไม่เกี่ยวข้องกับความเข้าใจหรือการควบคุมกระบวนการ",
    ],
    rationale:
      "PAT ด้วย in-line NIR spectroscopy ช่วยให้สามารถติดตามและควบคุมกระบวนการผลิต (เช่น การผสม) แบบ real-time ได้ ทำให้กำหนดจุดสิ้นสุดกระบวนการ (เช่น blending endpoint) ตามข้อมูลความสม่ำเสมอที่วัดได้จริงแทนระยะเวลาคงที่ ลดความเสี่ยงจาก sampling error ที่เกิดจากการสุ่มตัวอย่างด้วยมือ (เช่น thief probe ที่อาจรบกวนโครงสร้างของ powder bed หรือทำให้เกิด segregation ระหว่างการสุ่มตัวอย่าง) แนวทางนี้สอดคล้องกับหลักการ Quality by Design (QbD) ที่มุ่งสร้างคุณภาพเข้าไปในกระบวนการผลิต (build quality in) แทนที่จะพึ่งพาการตรวจสอบคุณภาพในผลิตภัณฑ์สุดท้ายเพียงอย่างเดียว",
    traps: [
      "ผิด — In-line NIR เมื่อผ่านการพัฒนาและ validate chemometric model อย่างเหมาะสมแล้วสามารถให้ผลที่น่าเชื่อถือสำหรับวัตถุประสงค์ที่ตั้งใจไว้ได้ จุดเด่นสำคัญของ PAT คือความสามารถในการติดตามแบบ real-time ซึ่งการทดสอบแบบ off-line ไม่สามารถให้ได้ ไม่ใช่เรื่องความแม่นยำที่ด้อยกว่าเสมอไป",
      "ผิด — PAT เป็นแนวคิดที่ประยุกต์ใช้ได้กว้างกับหลาย unit operation ในกระบวนการผลิตยา เช่น granulation, drying, coating ไม่ได้จำกัดเฉพาะการผสม (blending) เท่านั้น",
      "ผิด — เครื่องมือ PAT ที่ใช้ chemometric model (เช่น NIR calibration model) จำเป็นต้องผ่านการพัฒนาและ validate อย่างเข้มงวดก่อนนำไปใช้ตัดสินใจในกระบวนการผลิตจริง โดยเฉพาะหากใช้เพื่อการปล่อยผ่านผลิตภัณฑ์",
      "ผิด — เป้าหมายหลักของ PAT คือการสร้างความเข้าใจและควบคุมกระบวนการอย่างลึกซึ้งแบบ real-time ตามหลัก QbD ซึ่งอาจนำไปสู่การลดการทดสอบผลิตภัณฑ์สุดท้ายได้ในบางกรณี แต่นั่นเป็นผลพลอยได้ ไม่ใช่เป้าหมายหลักเพียงอย่างเดียว",
    ],
    difficulty: "medium",
    ref: "FDA Guidance for Industry — PAT: A Framework for Innovative Pharmaceutical Development, Manufacturing, and Quality Assurance; ICH Q8(R2)",
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
    id: `ip1set2_d05_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 5/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 5 · ${d.topic}\n\n${d.prompt}`,
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
      "Manually drafted original IP1 item (Daily Set 2, Day 5/30) — not copied from any past exam. Editorial/technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-25 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 200,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY05: McqQuestion[] = D.map(buildQuestion);
