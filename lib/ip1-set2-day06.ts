import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 6 of 30 (10 questions/day plan)
// Topic focus: tablet compaction physics, stability study design (ICH Q1D
// bracketing/matrixing), Design of Experiments (DOE), analytical technique
// deep-dives (TGA vs Karl Fischer, DSC crystallinity), post-approval change
// classification (SUPAC), cleaning validation worst-case selection
// methodology, and Annual Product Review (APR/PQR).
// Distinct from IP1_PILOT_050 (lib/ip1-pilot-050.ts) and Days 1-5 — cross-
// checked against all of them:
//   - existing bank has "OOS investigation" (first-step SOP) and "OOS
//     reinjection" (assignable-cause / Phase II trigger) — both already
//     cover the Phase I -> Phase II escalation concept, so this day
//     deliberately avoids re-testing that ground and covers cleaning-
//     validation worst-case *selection methodology* instead (a scoring
//     matrix across multiple candidate products), which is a different
//     skill from Day 2's single-pair MACO *calculation*.
//   - existing bank's "Preformulation / DSC" and "Solid state / PXRD" only
//     test instrument/technique identification (which tool detects a
//     melting endotherm or a polymorph change) — neither computes a
//     Heckel yield pressure or a DSC % crystallinity from heat-of-fusion
//     data, so Q1 and Q6 test a genuinely different (calculation) skill.
//   - Day 2's stability question was ICH Q1E shelf-life extrapolation from
//     a single condition's data; Q2/Q3 here are ICH Q1D bracketing/
//     matrixing *study design* questions (which combinations/time points
//     get tested at all), a different guideline and a different skill.
//   - DOE/factorial run-count calculation (Q4), TGA vs Karl Fischer
//     specificity (Q5), volumetric vs coulometric Karl Fischer method
//     selection (Q7), SUPAC post-approval change classification (Q8), and
//     Annual Product Review / PQR content and purpose (Q10) do not appear
//     anywhere in the existing 150-question bank or in Days 1-5.
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
const answerPositions = [4, 2, 0, 1, 3, 3, 1, 0, 2, 4];

const D: Draft[] = [
  {
    topic: "Tablet compaction — Heckel equation yield pressure calculation",
    prompt:
      "การศึกษา compaction mechanism ของ granule 2 สูตรด้วย Heckel plot (ln[1/(1−D)] เทียบกับ compression pressure P) ได้ค่า slope (K) ดังนี้: Granule A มี K = 0.020 MPa⁻¹, Granule B มี K = 0.005 MPa⁻¹ จงคำนวณค่า yield pressure (Py) ของแต่ละสูตร (Py = 1/K) และสรุปว่าสูตรใดเกิด plastic deformation ได้ง่ายกว่า (ที่ pressure ต่ำกว่า)",
    options: [
      "Py(A) = 50 MPa, Py(B) = 200 MPa — Granule A มี yield pressure ต่ำกว่า จึงเกิด plastic deformation ได้ง่ายกว่าที่ compression pressure ต่ำกว่า Granule B",
      "Py(A) = 0.020 MPa, Py(B) = 0.005 MPa (ใช้ค่า slope เป็น Py โดยตรงโดยไม่กลับเศษส่วน) — Granule B มี Py ต่ำกว่าจึงเกิด plastic deformation ง่ายกว่า",
      "Py(A) = 50 MPa, Py(B) = 200 MPa — Granule B มี yield pressure สูงกว่า จึงเกิด plastic deformation ได้ง่ายกว่าที่ pressure ต่ำกว่า Granule A",
      "Py ยิ่งสูงยิ่งบ่งชี้ว่าวัสดุนั้นเกิด plastic deformation ได้ง่ายกว่าเสมอ ดังนั้น Granule B (Py สูงกว่า) จึงเป็นวัสดุที่ plastic มากกว่า",
      "ค่า slope จาก Heckel plot เป็นเพียงค่าทางสถิติจากการ fit เส้นตรง ไม่มีความหมายเชิงกลไกการเปลี่ยนรูปของอนุภาคที่แท้จริง",
    ],
    rationale:
      "จากสมการ Heckel, slope (K) ของกราฟสัมพันธ์กับ yield pressure (Py) โดย Py = 1/K ดังนั้น Py(A) = 1/0.020 = 50 MPa และ Py(B) = 1/0.005 = 200 MPa ค่า yield pressure ที่ต่ำกว่าบ่งชี้ว่าวัสดุนั้นเริ่มเกิด plastic deformation ได้ที่ compression pressure ต่ำกว่า (deform ได้ง่ายกว่า) ดังนั้น Granule A (Py=50 MPa) จึงมีแนวโน้มเป็นวัสดุที่ plastic/deform ง่ายกว่า Granule B (Py=200 MPa) ซึ่งมีแนวโน้มเป็นวัสดุที่แข็ง/เปราะ (brittle fragmentation) มากกว่า ต้องใช้ pressure สูงกว่าจึงจะเริ่มเปลี่ยนรูปแบบ plastic ได้อย่างมีนัยสำคัญ",
    traps: [
      "ผิด — ค่า slope (K) จาก Heckel plot ไม่ใช่ค่า Py โดยตรง ต้องคำนวณ Py = 1/K การใช้ K เป็น Py ตรงๆ ทำให้ตัวเลขและทิศทางการแปลผลคลาดเคลื่อนจากความเป็นจริง",
      "ผิด — Py(B) คำนวณได้ 200 MPa ซึ่งสูงกว่า Py(A) (50 MPa) ไม่ใช่ต่ำกว่า จึงสรุปสลับทิศทางว่า Granule B deform ง่ายกว่า ซึ่งไม่ถูกต้อง",
      "ผิด — ทิศทางของความสัมพันธ์กลับกัน ค่า Py ที่ต่ำกว่าต่างหากที่บ่งชี้ว่าวัสดุนั้นเกิด plastic deformation ได้ง่ายกว่าที่ pressure ต่ำกว่า ไม่ใช่ Py ที่สูงกว่า",
      "ผิด — Heckel plot และค่า yield pressure ที่ได้มีความหมายเชิงกลไกจริงในการอธิบายพฤติกรรมการเปลี่ยนรูปของอนุภาคระหว่าง compaction (plastic deformation vs brittle fragmentation) ไม่ใช่เพียงค่าทางสถิติที่ไม่มีความหมาย",
    ],
    difficulty: "hard",
    ref: "Heckel, R.W. — compaction mechanism analysis; pharmaceutical powder compaction principles",
    calc: [
      "Py = 1/K",
      "Py(A) = 1/0.020 MPa⁻¹ = 50 MPa",
      "Py(B) = 1/0.005 MPa⁻¹ = 200 MPa",
      "Py ต่ำกว่า → plastic deformation เกิดง่ายกว่าที่ pressure ต่ำกว่า → Granule A (50 MPa) deform ง่ายกว่า Granule B (200 MPa)",
    ],
  },
  {
    topic: "ICH Q1D — bracketing design (reduced testing combinations)",
    prompt:
      "ผลิตภัณฑ์ยาเม็ดมี 3 ขนาดความแรง (10, 25, 50 mg) และบรรจุใน 3 ขนาดบรรจุภัณฑ์ (30, 100, 500 เม็ด/ขวด) รวมทั้งหมด 9 combination ของ strength×container บริษัทต้องการใช้ bracketing design ตาม ICH Q1D (โดยถือว่า strength และ container size เป็น design factor ทั้งคู่ และระดับกลางสามารถแทนด้วยระดับปลายทั้งสองด้าน) จงระบุว่าต้องทดสอบ stability กี่ combination และ combination ใดบ้าง",
    options: [
      "4 combination ได้แก่ (10mg+30เม็ด), (10mg+500เม็ด), (50mg+30เม็ด), (50mg+500เม็ด) — คือค่าปลายสุดของทั้งสองปัจจัยจับคู่กันครบทุกแบบ ส่วน 25mg และขนาดบรรจุ 100 เม็ด (รวมถึง combination ใดๆ ที่มีค่าเหล่านี้) ไม่ต้องทดสอบโดยตรง",
      "9 combination ทั้งหมด เพราะ bracketing design ไม่ได้ช่วยลดจำนวนการทดสอบลงจากจำนวนเต็ม",
      "3 combination เท่านั้น (เฉพาะ strength 50mg จับคู่กับทุกขนาดบรรจุภัณฑ์ โดยไม่พิจารณา strength อื่น)",
      "1 combination เท่านั้น (เฉพาะ strength และขนาดบรรจุภัณฑ์ที่มากที่สุดเพียงคู่เดียว)",
      "6 combination (ตัดเฉพาะขนาดบรรจุภัณฑ์ 100 เม็ดออก แต่ยังคงทดสอบทุก strength กับขนาดบรรจุที่เหลือ)",
    ],
    rationale:
      "Bracketing design ตาม ICH Q1D ทดสอบเฉพาะตัวอย่างที่ระดับปลายสุด (extremes) ของ design factor ที่เลือก โดยสมมติว่าความคงตัวของระดับกลางสามารถแทนด้วยผลของระดับปลายทั้งสองด้าน เมื่อมีทั้ง strength และ container size เป็น design factor พร้อมกัน ต้องจับคู่ระดับปลายสุดของทั้งสองปัจจัยเข้าด้วยกันครบทุกแบบ (2×2 = 4 combination) คือ (ต่ำสุด+เล็กสุด), (ต่ำสุด+ใหญ่สุด), (สูงสุด+เล็กสุด), (สูงสุด+ใหญ่สุด) ส่วนระดับกลางของแต่ละปัจจัย (25mg, บรรจุ 100 เม็ด) และ combination ใดๆ ที่เกี่ยวข้องกับระดับกลางจะไม่ถูกทดสอบโดยตรง แต่อนุมานจากผลของ combination ปลายสุดที่ทดสอบจริง",
    traps: [
      "ผิด — จุดประสงค์หลักของ bracketing design คือการลดจำนวน combination ที่ต้องทดสอบลงจากจำนวนเต็ม (9 combination) ไม่ใช่ทดสอบทั้งหมดเหมือนเดิม",
      "ผิด — การ bracket เพียงปัจจัยเดียว (container size) โดยยังทดสอบทุก strength ไม่ตรงกับหลักการ bracketing ทั้งสองปัจจัยพร้อมกันตามที่โจทย์กำหนด ต้องจับคู่ระดับปลายสุดของทั้งสองปัจจัยเข้าด้วยกัน",
      "ผิด — Bracketing design ต้องทดสอบระดับปลายสุดของทั้งสองด้าน (ต่ำสุดและสูงสุด) ของแต่ละปัจจัย ไม่ใช่เพียง combination เดียวที่มากที่สุด ซึ่งจะไม่สามารถครอบคลุมช่วงของทั้งสองปัจจัยได้",
      "ผิด — การตัดเฉพาะขนาดบรรจุภัณฑ์ระดับกลางออกแต่ไม่ตัด strength ระดับกลางออกด้วย ไม่ตรงกับหลักการ bracketing ทั้งสองปัจจัยพร้อมกันตามที่โจทย์กำหนด (ต้องตัดทั้ง 25mg และ 100 เม็ดออกจากการทดสอบโดยตรง)",
    ],
    difficulty: "hard",
    ref: "ICH Q1D — Bracketing and Matrixing Designs for Stability Testing",
    calc: [
      "จำนวน combination ทั้งหมด = 3 strength × 3 container = 9",
      "Bracketing design ทดสอบเฉพาะระดับปลายสุดของทั้งสองปัจจัยจับคู่กัน = 2×2 = 4 combination",
      "4 combination ที่ทดสอบ: (10mg,30), (10mg,500), (50mg,30), (50mg,500)",
    ],
  },
  {
    topic: "ICH Q1D — matrixing vs bracketing design distinction",
    prompt:
      "ข้อใดอธิบายความแตกต่างพื้นฐานระหว่าง matrixing design และ bracketing design ตาม ICH Q1D ได้ถูกต้องที่สุด",
    options: [
      "Bracketing design ลดจำนวน combination ที่ทดสอบโดยเลือกเฉพาะระดับปลายสุดของ design factor (เช่น strength หรือ container size) แต่ combination ที่เลือกทดสอบจะถูกทดสอบครบทุกจุดเวลา ในขณะที่ matrixing design ทดสอบทุก combination แต่แบ่งกลุ่มตัวอย่าง (subset) ให้แต่ละกลุ่มถูกทดสอบที่บางจุดเวลาเท่านั้น (ไม่ใช่ทุกจุดเวลา) แล้วนำผลมาวิเคราะห์รวมกันทางสถิติ",
      "Matrixing และ bracketing เป็นแนวคิดเดียวกันโดยพื้นฐาน สามารถใช้คำสองคำนี้แทนกันได้เสมอในทุกบริบทของการออกแบบการศึกษาความคงตัว",
      "Matrixing ใช้ลดจำนวน strength/container ที่ทดสอบเช่นเดียวกับ bracketing โดยตัดระดับกลางออกจากการทดสอบทั้งหมด",
      "Bracketing ทดสอบทุก combination ที่จุดเวลาทั้งหมด แต่สุ่มเลือกเฉพาะบาง lot ในแต่ละจุดเวลาเพื่อลดภาระงาน",
      "ทั้ง matrixing และ bracketing ต้องใช้ full study design ที่ทดสอบทุก combination ในทุกจุดเวลาเสมอ เพื่อให้ผลมีความน่าเชื่อถือทางสถิติสูงสุด",
    ],
    rationale:
      "Bracketing design ลดจำนวน combination (เช่น strength หรือ container size) ที่ต้องทดสอบ โดยเลือกเฉพาะระดับปลายสุดของปัจจัยนั้น แต่ combination ที่ถูกเลือกจะยังคงทดสอบครบทุกจุดเวลาตามโปรโตคอลปกติ ในขณะที่ matrixing design ยังคง combination ทั้งหมดไว้ในการศึกษา แต่ลดจำนวนจุดเวลาที่ทดสอบต่อ combination ลง โดยแบ่งกลุ่มตัวอย่างให้แต่ละกลุ่มทดสอบที่จุดเวลาต่างกัน (ไม่ใช่ทุกกลุ่มทดสอบทุกจุดเวลา) แล้วนำข้อมูลทั้งหมดมาวิเคราะห์รวมกันทางสถิติเพื่อประเมินความคงตัวโดยรวม ทั้งสองแนวทางจึงลดภาระการทดสอบด้วยกลไกที่ต่างกัน (ตัด combination ทั้งหมด vs ตัดจุดเวลาบางส่วนต่อ combination)",
    traps: [
      "ผิด — แม้ทั้งสองแนวทางมีเป้าหมายลดภาระการทดสอบเหมือนกัน แต่เป็นกลไกที่แตกต่างกันอย่างชัดเจน (ตัด combination ทั้งหมด vs ตัดจุดเวลาบางส่วน) จึงไม่สามารถใช้แทนกันได้ในทุกบริบท",
      "ผิด — Matrixing ไม่ได้ตัดระดับกลางของ strength/container ออกจากการทดสอบทั้งหมดเหมือน bracketing แต่ยังคง combination ทุกตัวไว้ในการศึกษา เพียงลดจำนวนจุดเวลาที่แต่ละ combination ถูกทดสอบ",
      "ผิด — คำอธิบายนี้สลับกัน การทดสอบทุก combination ที่ทุกจุดเวลาแต่สุ่มเฉพาะบาง lot ไม่ใช่หลักการ bracketing ซึ่งเน้นการตัด combination ตามระดับปลายสุดของปัจจัยที่เลือก",
      "ผิด — จุดประสงค์หลักของทั้งสองการออกแบบคือการลดภาระการทดสอบลงจาก full study design ไม่ใช่การคงการทดสอบทุก combination ในทุกจุดเวลาเหมือนเดิม",
    ],
    difficulty: "medium",
    ref: "ICH Q1D — Bracketing and Matrixing Designs for Stability Testing",
  },
  {
    topic: "Design of Experiments (DOE) — factorial design run-count calculation",
    prompt:
      "การพัฒนาสูตรตำรับ granulation ต้องการศึกษาผลของ 4 ปัจจัย (mixing time, mixing speed, binder concentration, granulation liquid amount) ที่ 2 ระดับต่อปัจจัย (high/low) ต่อคุณภาพของ granule จงคำนวณจำนวนการทดลอง (runs) ขั้นต่ำที่ต้องใช้สำหรับ full factorial design (2^k) และเปรียบเทียบกับจำนวน runs หากใช้ half-fraction factorial design (2^(k−1)) พร้อมข้อแลกเปลี่ยนสำคัญของการเลือกใช้ fractional design",
    options: [
      "Full factorial = 2⁴ = 16 runs, half-fraction = 2³ = 8 runs — การใช้ fractional design ลดจำนวน runs ลงครึ่งหนึ่ง แต่แลกกับการที่บาง interaction effect (โดยทั่วไปคือ higher-order interaction) จะถูก confound/alias กับ effect อื่น ทำให้ไม่สามารถประมาณค่าแยกจากกันได้อย่างอิสระ",
      "Full factorial = 8 runs (คำนวณจาก 2×4 แทนที่จะเป็น 2⁴) — ไม่มีข้อแลกเปลี่ยนใดๆ จากการลดจำนวน runs",
      "Full factorial = 16 runs, half-fraction = 4 runs (หารครึ่งซ้ำสองครั้งแทนที่จะเป็นครั้งเดียว)",
      "Fractional factorial design ให้ข้อมูลเทียบเท่า full factorial design ทุกประการโดยไม่มีข้อเสียหรือข้อจำกัดใดๆ เลย",
      "จำนวน runs ไม่เปลี่ยนแปลงไม่ว่าจะเลือกใช้ full หรือ fractional factorial design เพราะขึ้นกับจำนวนปัจจัย (k) เพียงอย่างเดียวโดยไม่เกี่ยวกับสัดส่วน fraction ที่เลือกใช้",
    ],
    rationale:
      "Full factorial design สำหรับ k ปัจจัยที่ 2 ระดับต่อปัจจัย ต้องการจำนวน runs ขั้นต่ำ = 2^k = 2⁴ = 16 runs เพื่อประมาณค่า main effect และ interaction effect ทุกระดับได้อย่างอิสระ หากใช้ half-fraction factorial design (2^(k−1)) จะลดเหลือ 2³ = 8 runs ซึ่งประหยัดเวลา/ต้นทุนการทดลอง แต่แลกกับการที่บาง effect (โดยทั่วไปคือ higher-order interaction ที่มักถือว่ามีผลน้อย) จะถูก confound (aliased) กับ effect อื่น ทำให้ไม่สามารถแยกแยะผลของแต่ละ effect ที่ confound กันได้อย่างอิสระจากข้อมูลชุดนี้เพียงอย่างเดียว การเลือกใช้ fractional design จึงต้องอาศัยสมมติฐานว่า higher-order interaction ที่ถูก confound มีผลเล็กน้อยจนละเลยได้",
    traps: [
      "ผิด — จำนวน runs ของ full factorial design คำนวณจาก 2 ยกกำลัง k (2^k) ไม่ใช่ 2 คูณ k การใช้สูตรเชิงเส้นแทนเลขยกกำลังทำให้ตัวเลขต่ำกว่าความเป็นจริงมาก",
      "ผิด — Half-fraction หมายถึงการลดจำนวน runs ลงครึ่งหนึ่งจากค่าเต็ม (16÷2=8) เพียงครั้งเดียว ไม่ใช่การหารครึ่งซ้ำสองครั้ง (ซึ่งจะกลายเป็น quarter-fraction แทน)",
      "ผิด — Fractional factorial design มีข้อแลกเปลี่ยนสำคัญคือการ confound/alias บาง interaction effect เข้าด้วยกัน ทำให้สูญเสียความสามารถในการแยกแยะผลบางส่วนได้อย่างอิสระ ซึ่งเป็นข้อจำกัดที่แท้จริงเมื่อเทียบกับ full factorial design",
      "ผิด — สัดส่วน fraction ที่เลือกใช้ (เช่น half-fraction, quarter-fraction) มีผลโดยตรงต่อจำนวน runs ที่ต้องใช้ ไม่ใช่ขึ้นกับจำนวนปัจจัย (k) เพียงอย่างเดียวโดยไม่พิจารณาสัดส่วนที่เลือก",
    ],
    difficulty: "hard",
    ref: "Design of Experiments (DOE) — factorial and fractional factorial design principles; ICH Q8(R2) QbD",
    calc: [
      "Full factorial runs = 2^k = 2⁴ = 16",
      "Half-fraction factorial runs = 2^(k−1) = 2³ = 8",
      "Trade-off: บาง higher-order interaction ถูก confound/alias กันในการออกแบบแบบ fractional",
    ],
  },
  {
    topic: "Thermogravimetric Analysis (TGA) vs Karl Fischer — specificity for water content",
    prompt:
      "ตัวอย่างผงยาตรวจด้วย TGA (thermogravimetric analysis) พบน้ำหนักหายไป (weight loss) 3.5% เมื่อให้ความร้อนถึงอุณหภูมิที่กำหนด แต่เมื่อตรวจด้วย Karl Fischer titration (วิธีจำเพาะสำหรับน้ำ) ของตัวอย่างเดียวกันกลับพบปริมาณน้ำเพียง 1.8% ข้อใดอธิบายความแตกต่างระหว่างสองผลนี้ได้เหมาะสมที่สุด",
    options: [
      "TGA เป็นวิธี non-specific ที่วัด weight loss รวมทั้งหมดในช่วงอุณหภูมิที่กำหนด ซึ่งอาจรวมถึงน้ำ, residual solvent ที่ระเหยได้, หรือการสลายตัวบางส่วนของสาร ในขณะที่ Karl Fischer จำเพาะต่อน้ำเท่านั้น ผลต่าง (3.5%−1.8%=1.7%) จึงบ่งชี้สารระเหยอื่นที่ไม่ใช่น้ำ ซึ่งควรตรวจสอบเพิ่มเติมด้วยวิธีที่จำเพาะกว่า เช่น GC headspace",
      "TGA ให้ผลแม่นยำกว่า Karl Fischer เสมอเพราะเป็นเทคนิคที่ทันสมัยกว่าและใช้เครื่องมือที่ซับซ้อนกว่า",
      "ความแตกต่างของผลทั้งสองเกิดจากความผิดพลาดในการสอบเทียบเครื่องมือเพียงอย่างเดียว ไม่มีคำอธิบายเชิงหลักการอื่น",
      "Karl Fischer วัดค่าต่ำกว่าเพราะไม่สามารถตรวจจับน้ำที่จับแน่นกับโครงสร้างผลึก (bound/water of hydration) ได้เลยไม่ว่าในสภาวะใด",
      "ควรใช้ผลจาก TGA เป็นค่าที่รายงานสำหรับปริมาณน้ำ (water content) เสมอ เพราะเป็นวิธีที่วัดได้ง่ายและรวดเร็วกว่า",
    ],
    rationale:
      "TGA วัด weight loss โดยรวมที่เกิดขึ้นในช่วงอุณหภูมิที่กำหนด ซึ่งเป็นวิธีที่ไม่จำเพาะ (non-specific) — น้ำหนักที่หายไปอาจมาจากน้ำ, residual solvent, หรือแม้แต่การสลายตัวบางส่วนของสารในช่วงอุณหภูมินั้น ในขณะที่ Karl Fischer titration เป็นปฏิกิริยาเคมีที่จำเพาะต่อน้ำโดยตรง ผลต่างระหว่างสองวิธี (1.7%) จึงเป็นสัญญาณว่ามีสารระเหยอื่นที่ไม่ใช่น้ำปนอยู่ในตัวอย่าง ซึ่งควรตรวจสอบเพิ่มเติมด้วยวิธีที่จำเพาะกว่า เช่น GC headspace เพื่อระบุชนิดและปริมาณของสารระเหยที่แท้จริง",
    traps: [
      "ผิด — ความทันสมัยของเทคนิคไม่ได้เป็นตัวกำหนดความแม่นยำสำหรับวัตถุประสงค์เฉพาะ TGA เป็นวิธี non-specific ในขณะที่ Karl Fischer จำเพาะต่อน้ำ จึงเหมาะสมกว่าสำหรับการรายงานปริมาณน้ำโดยเฉพาะ",
      "ผิด — ความแตกต่างที่เกิดขึ้นมีคำอธิบายเชิงหลักการที่ชัดเจน (ความจำเพาะของวิธีวิเคราะห์ที่ต่างกัน) ไม่ใช่เพียงความผิดพลาดในการสอบเทียบเครื่องมือ",
      "ผิด — Karl Fischer สามารถตรวจจับน้ำที่จับแน่นกับโครงสร้าง (bound water/water of hydration) ได้เมื่อใช้เทคนิคที่เหมาะสม (เช่น การให้ความร้อนหรือการสกัดที่เหมาะสมก่อนไทเทรต) ไม่ใช่ไม่สามารถตรวจจับได้เลยในทุกสภาวะ",
      "ผิด — เนื่องจาก TGA เป็นวิธี non-specific ที่อาจรวมสารระเหยอื่นนอกจากน้ำ จึงไม่ควรใช้เป็นค่าที่รายงานสำหรับปริมาณน้ำโดยเฉพาะ ควรใช้ Karl Fischer ซึ่งจำเพาะต่อน้ำมากกว่า",
    ],
    difficulty: "medium",
    ref: "USP <891> Thermal Analysis; USP <921> Water Determination (Karl Fischer) — specificity comparison",
  },
  {
    topic: "DSC — percent crystallinity calculation from heat of fusion",
    prompt:
      "ตัวอย่างพอลิเมอร์/สารที่มีสัดส่วน crystalline และ amorphous ผสมกัน วัดค่า heat of fusion (ΔHf) ด้วย DSC ได้ 45 J/g ในขณะที่ค่า ΔHf ของสารอ้างอิงที่เป็น 100% crystalline (ค่ามาตรฐานที่ทราบแน่ชัด) เท่ากับ 150 J/g จงคำนวณ % crystallinity ของตัวอย่างนี้",
    options: [
      "30% (คำนวณจาก ΔHf sample ÷ ΔHf 100%-crystalline reference × 100 = 45÷150×100)",
      "333% (สลับตัวหาร/ตัวตั้ง: 150÷45×100 ซึ่งเป็นไปไม่ได้ในทางกายภาพเพราะ % crystallinity ต้องไม่เกิน 100%)",
      "45% (ใช้ค่า ΔHf ของตัวอย่างเป็นเปอร์เซ็นต์โดยตรงโดยไม่นำไปเทียบกับค่าอ้างอิง)",
      "195% (นำค่า ΔHf ทั้งสองมาบวกกันแทนที่จะหาร ซึ่งเป็นไปไม่ได้ในทางกายภาพเช่นกัน)",
      "ไม่สามารถคำนวณ % crystallinity ได้จากข้อมูลที่ให้มา เพราะต้องทราบอุณหภูมิ glass transition (Tg) ของตัวอย่างเพิ่มเติมเสมอ",
    ],
    rationale:
      "% crystallinity คำนวณจากอัตราส่วนของ heat of fusion ที่วัดได้จากตัวอย่างเทียบกับค่า heat of fusion ของสารอ้างอิงที่เป็น 100% crystalline: % crystallinity = (ΔHf sample ÷ ΔHf 100%-crystalline) × 100 = (45÷150)×100 = 30% ค่านี้สะท้อนสัดส่วนของโครงสร้างที่เป็นผลึก (crystalline) เทียบกับโครงสร้างอสัณฐาน (amorphous) ทั้งหมดในตัวอย่าง โดยไม่จำเป็นต้องทราบค่า glass transition temperature (Tg) เพิ่มเติมสำหรับการคำนวณนี้",
    traps: [
      "ผิด — สูตรที่ถูกต้องคือหาร ΔHf ของตัวอย่างด้วย ΔHf ของสารอ้างอิง 100%-crystalline ไม่ใช่กลับด้าน การกลับด้านทำให้ได้ค่าเกิน 100% ซึ่งเป็นไปไม่ได้ในทางกายภาพสำหรับตัวชี้วัดที่มีความหมายเป็นสัดส่วน (fraction)",
      "ผิด — ค่า ΔHf ของตัวอย่างเพียงอย่างเดียวไม่มีความหมายเป็นเปอร์เซ็นต์ ต้องนำไปเทียบกับค่าอ้างอิงของสารที่เป็น 100% crystalline ก่อนจึงจะได้ % crystallinity ที่ถูกต้อง",
      "ผิด — % crystallinity คำนวณจากอัตราส่วน (การหาร) ของสองค่า ไม่ใช่ผลรวม (การบวก) ซึ่งไม่มีความหมายทางกายภาพที่สอดคล้องกับนิยามของ % crystallinity",
      "ผิด — การคำนวณ % crystallinity จากอัตราส่วน heat of fusion ไม่จำเป็นต้องทราบค่า glass transition temperature (Tg) เพิ่มเติม เนื่องจากใช้ข้อมูล ΔHf ของตัวอย่างเทียบกับค่าอ้างอิงเพียงสองค่าที่ให้มาก็เพียงพอสำหรับการคำนวณนี้แล้ว",
    ],
    difficulty: "hard",
    ref: "DSC crystallinity determination via heat of fusion ratio — solid-state pharmaceutics/polymer characterization principles",
    calc: [
      "% crystallinity = (ΔHf sample ÷ ΔHf 100%-crystalline reference) × 100",
      "= (45 J/g ÷ 150 J/g) × 100 = 30%",
    ],
  },
  {
    topic: "Karl Fischer titration — volumetric vs coulometric method selection",
    prompt:
      "ต้องเลือกวิธี Karl Fischer titration ระหว่าง volumetric KF กับ coulometric KF สำหรับตรวจสอบปริมาณน้ำในตัวอย่างที่คาดว่ามีปริมาณน้ำต่ำมาก (ระดับ ppm ถึงต่ำกว่า 1% w/w) ข้อใดคือการเลือกและเหตุผลที่เหมาะสมที่สุด",
    options: [
      "Coulometric KF เหมาะสมกว่าสำหรับตัวอย่างที่มีปริมาณน้ำต่ำมาก (ระดับ ppm) เพราะมีความไวสูงกว่าและผลิต iodine ในเซลล์ด้วยกระแสไฟฟ้าโดยตรงตามปริมาณน้ำที่มีจริงโดยไม่ต้อง standardize titrant ในขณะที่ volumetric KF เหมาะกับตัวอย่างที่มีปริมาณน้ำสูงกว่า (ระดับ mg ขึ้นไป)",
      "Volumetric KF เหมาะสมกว่าเสมอสำหรับทุกช่วงความเข้มข้นของน้ำ เพราะเป็นวิธีดั้งเดิมที่มีความแม่นยำสูงกว่า coulometric KF ในทุกกรณี",
      "ทั้งสองวิธีให้ sensitivity เท่ากันทุกประการสำหรับการตรวจวัดน้ำในทุกช่วงความเข้มข้น ความแตกต่างอยู่ที่ราคาเครื่องมือเพียงอย่างเดียว",
      "Coulometric KF เหมาะกับตัวอย่างที่มีปริมาณน้ำสูงเท่านั้น เพราะกระบวนการผลิต iodine ด้วยกระแสไฟฟ้าทำได้อย่างจำกัดเฉพาะปริมาณมาก",
      "การเลือกวิธี Karl Fischer ไม่มีผลต่อความแม่นยำของผลที่ได้เลยไม่ว่าจะเป็นตัวอย่างที่มีปริมาณน้ำต่ำหรือสูง สามารถเลือกใช้วิธีใดก็ได้ตามความสะดวก",
    ],
    rationale:
      "Coulometric KF ผลิต iodine ที่ใช้ในปฏิกิริยาโดยตรงในเซลล์ด้วยกระแสไฟฟ้าตามปริมาณน้ำที่มีอยู่จริง (ตามกฎของ Faraday) ทำให้มีความไวสูงมากและเหมาะสำหรับตรวจวัดน้ำในระดับต่ำมาก (ppm ถึงต่ำกว่า 1%) โดยไม่ต้อง standardize titrant ล่วงหน้า ในขณะที่ volumetric KF ใช้ titrant ที่ต้อง standardize และมีขีดจำกัดความไวต่ำกว่า จึงเหมาะสมกว่าสำหรับตัวอย่างที่มีปริมาณน้ำสูงกว่า (โดยทั่วไปตั้งแต่ระดับ mg/ประมาณ 1% ขึ้นไป) การเลือกวิธีที่เหมาะสมกับช่วงความเข้มข้นจึงมีผลโดยตรงต่อความแม่นยำและความน่าเชื่อถือของผลที่ได้",
    traps: [
      "ผิด — Volumetric KF มีขีดจำกัดความไวต่ำกว่า coulometric KF จึงไม่เหมาะสมที่สุดสำหรับการตรวจวัดน้ำที่ระดับต่ำมาก (ppm) แม้จะเป็นวิธีที่ใช้กันมานานก็ตาม",
      "ผิด — Sensitivity ของทั้งสองวิธีแตกต่างกันอย่างมีนัยสำคัญ ไม่ใช่เพียงความแตกต่างด้านราคาเครื่องมือ coulometric KF มีความไวสูงกว่าอย่างชัดเจนสำหรับตัวอย่างที่มีน้ำปริมาณน้อย",
      "ผิด — ทิศทางกลับกัน coulometric KF เหมาะสมกับตัวอย่างที่มีปริมาณน้ำ**ต่ำ**มากกว่า เนื่องจากสามารถผลิต iodine ในปริมาณที่แม่นยำและควบคุมได้ในระดับที่ละเอียดมาก ไม่ใช่จำกัดเฉพาะปริมาณน้ำสูง",
      "ผิด — การเลือกวิธี Karl Fischer ที่เหมาะสมกับช่วงความเข้มข้นของน้ำมีผลโดยตรงต่อความแม่นยำของผลที่ได้ โดยเฉพาะที่ระดับความเข้มข้นต่ำมากซึ่งต้องอาศัยความไวของวิธีที่สูงเพียงพอ",
    ],
    difficulty: "medium",
    ref: "USP <921> Water Determination — Karl Fischer titration (volumetric vs coulometric methods)",
  },
  {
    topic: "SUPAC — post-approval change classification (Level 1/2/3)",
    prompt:
      "บริษัทต้องการเปลี่ยนแปลง 3 รายการหลังยาเม็ดได้รับอนุมัติทะเบียนแล้ว: (1) เปลี่ยนสถานที่ผลิต (site) ไปยังโรงงานใหม่ที่มีกระบวนการ/เครื่องจักร/สภาพแวดล้อมเทียบเท่ากับสถานที่เดิม, (2) ปรับปริมาณ lubricant (excipient ที่ไม่ควบคุมการปลดปล่อยยา) ลดลงเล็กน้อยแต่ยังอยู่ในช่วงที่กำหนดไว้เดิม, (3) เปลี่ยนกลไกการปลดปล่อยยาจาก immediate-release เป็น modified-release ทั้งสูตร จงจับคู่แต่ละการเปลี่ยนแปลงกับระดับการจัดประเภทการเปลี่ยนแปลงหลังอนุมัติ (Level 1/minor, Level 2/moderate, Level 3/major) ตามหลักการทั่วไปของ SUPAC",
    options: [
      "(1) เปลี่ยนสถานที่ผลิตที่เทียบเท่ากัน = Level 2 (moderate) ต้องแจ้ง/ยื่นเอกสารสนับสนุนตามความเสี่ยง; (2) ปรับ excipient ที่ไม่ควบคุมการปลดปล่อยยาเพียงเล็กน้อยในช่วงเดิม = Level 1 (minor) ต้องการเอกสารน้อยที่สุด; (3) เปลี่ยนกลไกการปลดปล่อยยาทั้งสูตร = Level 3 (major) ต้องการข้อมูลสนับสนุนที่ครอบคลุมที่สุด อาจรวมถึงการศึกษา bioequivalence ใหม่",
      "ทั้งสามรายการจัดเป็น Level 1 (minor) เหมือนกันหมด เพราะเป็นเพียงการเปลี่ยนแปลงหลังอนุมัติทะเบียนเท่านั้น ไม่มีความแตกต่างด้านความเสี่ยง",
      "การเปลี่ยนกลไกการปลดปล่อยยาทั้งสูตรจัดเป็น Level 1 (minor) เพราะไม่ได้เปลี่ยนแปลงตัวยาสำคัญ (active ingredient) แต่อย่างใด",
      "การเปลี่ยนสถานที่ผลิตจัดเป็น Level 3 (major) เสมอไม่ว่าสถานที่ใหม่จะมีกระบวนการ/เครื่องจักรเทียบเท่าสถานที่เดิมเพียงใดก็ตาม",
      "การปรับปริมาณ excipient ใดๆ (ไม่ว่าจะควบคุมการปลดปล่อยยาหรือไม่) จัดเป็น Level 3 (major) เสมอ เพราะถือเป็นการเปลี่ยนแปลงสูตรตำรับ",
    ],
    rationale:
      "การจัดประเภทการเปลี่ยนแปลงหลังอนุมัติตามหลักการ SUPAC พิจารณาจากระดับความเสี่ยงที่การเปลี่ยนแปลงนั้นอาจมีต่อคุณภาพ/ประสิทธิภาพของผลิตภัณฑ์ ไม่ใช่พิจารณาเพียงว่าเป็น 'การเปลี่ยนแปลงหลังอนุมัติ' โดยทั่วไป การเปลี่ยนสถานที่ผลิตที่มีกระบวนการเทียบเท่ากันมักจัดเป็นความเสี่ยงระดับปานกลาง (Level 2) การปรับปริมาณ excipient ที่ไม่ควบคุมการปลดปล่อยยาเพียงเล็กน้อยในช่วงที่กำหนดไว้เดิมมีความเสี่ยงต่ำที่สุด (Level 1) ในขณะที่การเปลี่ยนกลไกการปลดปล่อยยาทั้งสูตร (เช่น IR→MR) เป็นการเปลี่ยนแปลงที่มีนัยสำคัญสูงสุดต่อ pharmacokinetic profile ของผลิตภัณฑ์ จึงจัดเป็นความเสี่ยงสูงสุด (Level 3) แม้ตัวยาสำคัญจะไม่เปลี่ยนแปลงก็ตาม",
    traps: [
      "ผิด — ระดับการจัดประเภทสะท้อนความเสี่ยงที่แตกต่างกันของแต่ละการเปลี่ยนแปลง ไม่ใช่ทุกการเปลี่ยนแปลงหลังอนุมัติจะมีความเสี่ยงเท่ากันเสมอ",
      "ผิด — การเปลี่ยนกลไกการปลดปล่อยยาทั้งสูตรมีผลกระทบอย่างมากต่อ pharmacokinetic profile ของผลิตภัณฑ์ แม้ตัวยาสำคัญจะไม่เปลี่ยนแปลง จึงจัดเป็นการเปลี่ยนแปลงที่มีความเสี่ยงสูงสุด (Level 3) ไม่ใช่ต่ำสุด",
      "ผิด — การเปลี่ยนสถานที่ผลิตที่มีกระบวนการ/เครื่องจักรเทียบเท่ากันโดยทั่วไปมีความเสี่ยงต่ำกว่าการเปลี่ยนสถานที่ที่มีกระบวนการแตกต่างกันอย่างมาก การจัดเป็น Level 3 เสมอโดยไม่พิจารณาความเทียบเท่าไม่สอดคล้องกับหลักการประเมินความเสี่ยง",
      "ผิด — การปรับปริมาณ excipient ที่ไม่ควบคุมการปลดปล่อยยา (non-release-controlling) เพียงเล็กน้อยและยังอยู่ในช่วงที่กำหนดไว้เดิม มีความเสี่ยงต่ำ ไม่ควรจัดเป็น Level 3 เหมือนกับการเปลี่ยนแปลงสูตรตำรับที่มีนัยสำคัญกว่ามาก",
    ],
    difficulty: "medium",
    ref: "FDA SUPAC guidances — post-approval change classification (Level 1/2/3) principles",
  },
  {
    topic: "Cleaning validation — worst-case product selection via risk-scoring matrix",
    prompt:
      "สายการผลิตร่วม (shared equipment train) ผลิตยา 3 ชนิด (A, B, C) ต้องเลือกผลิตภัณฑ์ที่เป็น 'worst case' สำหรับการทำ cleaning validation โดยใช้ risk-based scoring matrix ที่ให้คะแนนตามปัจจัย 3 ด้าน (คะแนนยิ่งสูง ยิ่งมีความเสี่ยง/ยากต่อการทำความสะอาด, max 10 คะแนนต่อด้าน): solubility score, toxicity/potency score, minimum daily dose score ผลคะแนนเป็นดังนี้ — Product A: solubility=8, toxicity=6, dose=4; Product B: solubility=3, toxicity=9, dose=8; Product C: solubility=5, toxicity=5, dose=5 จงระบุว่าผลิตภัณฑ์ใดควรถูกเลือกเป็น worst-case สำหรับ cleaning validation",
    options: [
      "Product B (คะแนนรวม = 3+9+8 = 20 ซึ่งสูงสุด) ควรถูกเลือกเป็น worst-case แม้จะมี solubility score ต่ำกว่า Product A ก็ตาม เพราะคะแนนรวมที่พิจารณาทุกปัจจัยร่วมกันสูงที่สุด สะท้อนความเสี่ยงโดยรวมมากที่สุดหากมีสารตกค้าง",
      "Product A ควรถูกเลือกเป็น worst-case เพราะมี solubility score สูงสุด (ละลายยากที่สุด) ซึ่งเป็นปัจจัยเดียวที่สำคัญที่สุดในการพิจารณา โดยไม่จำเป็นต้องรวมปัจจัยอื่น",
      "Product C ควรถูกเลือกเป็น worst-case เพราะมีคะแนนที่สมดุลในทุกด้าน (5, 5, 5) ซึ่งบ่งชี้ความเสี่ยงโดยรวมสูงสุด",
      "ต้องเลือกทั้งสามผลิตภัณฑ์เป็น worst-case ร่วมกันเสมอ เพื่อให้มั่นใจในความปลอดภัยสูงสุดของ cleaning validation",
      "ไม่สามารถเปรียบเทียบคะแนนรวมข้ามผลิตภัณฑ์ได้ เพราะแต่ละปัจจัย (solubility, toxicity, dose) มีหน่วยวัดที่แตกต่างกันโดยพื้นฐาน",
    ],
    rationale:
      "การเลือก worst-case product สำหรับ cleaning validation ด้วย risk-based scoring matrix ต้องพิจารณาคะแนนรวมของทุกปัจจัยร่วมกัน ไม่ใช่ปัจจัยใดปัจจัยหนึ่งเพียงอย่างเดียว ในกรณีนี้ Product B มีคะแนนรวมสูงสุด (20 คะแนน) แม้ solubility score จะต่ำกว่า Product A (8) แต่ toxicity (9) และ dose (8) ที่สูงกว่ามากทำให้คะแนนรวมโดยรวมสูงที่สุด สะท้อนว่าหากมีสารตกค้างจาก Product B ปนเปื้อนไปยังผลิตภัณฑ์ถัดไป จะมีความเสี่ยงต่อผู้ป่วยสูงที่สุดเมื่อพิจารณาทุกมิติร่วมกัน จึงควรถูกเลือกเป็นตัวแทน worst-case สำหรับการออกแบบและทดสอบ cleaning validation ของสายการผลิตนี้",
    traps: [
      "ผิด — การพิจารณาปัจจัยเดียว (solubility) โดยไม่รวมปัจจัยอื่น (toxicity, dose) อาจพลาดความเสี่ยงโดยรวมที่แท้จริง ระบบ scoring matrix ถูกออกแบบมาให้พิจารณาคะแนนรวมของทุกปัจจัยร่วมกันเพื่อสะท้อนความเสี่ยงที่ครอบคลุมกว่า",
      "ผิด — คะแนนที่สมดุลในทุกด้านไม่ได้แปลว่ามีความเสี่ยงโดยรวมสูงสุด ต้องเปรียบเทียบผลรวมคะแนนจริงระหว่างผลิตภัณฑ์ ซึ่ง Product C มีคะแนนรวมต่ำที่สุด (15) ในกรณีนี้",
      "ผิด — การเลือก worst-case มีวัตถุประสงค์เพื่อใช้เป็นตัวแทนที่ครอบคลุมความเสี่ยงสูงสุดในการทดสอบ ไม่ใช่การทดสอบทุกผลิตภัณฑ์ทั้งหมด ซึ่งจะขัดกับหลักการ grouping/worst-case approach ที่มุ่งลดภาระการทดสอบซ้ำซ้อนอย่างมีเหตุผลทางวิทยาศาสตร์",
      "ผิด — ในระบบ scoring matrix ที่ออกแบบมาอย่างเหมาะสม คะแนนแต่ละด้านจะถูก normalize ให้อยู่ในสเกลเดียวกัน (เช่น 1-10 ตามที่โจทย์กำหนด) ทำให้สามารถนำคะแนนรวมมาเปรียบเทียบกันข้ามผลิตภัณฑ์ได้อย่างมีความหมาย",
    ],
    difficulty: "hard",
    ref: "Cleaning validation worst-case/grouping approach — risk-based scoring matrix principles (solubility, toxicity, dose)",
    calc: [
      "คะแนนรวม Product A = 8+6+4 = 18",
      "คะแนนรวม Product B = 3+9+8 = 20",
      "คะแนนรวม Product C = 5+5+5 = 15",
      "Product B มีคะแนนรวมสูงสุด (20) → เลือกเป็น worst-case product",
    ],
  },
  {
    topic: "Annual Product Review / Product Quality Review (APR/PQR) — content and purpose",
    prompt:
      "ข้อใดอธิบายวัตถุประสงค์หลักและเนื้อหาที่จำเป็นของ Annual Product Review / Product Quality Review (APR/PQR) ได้ถูกต้องที่สุด",
    options: [
      "APR/PQR มีวัตถุประสงค์เพื่อทบทวนและวิเคราะห์แนวโน้ม (trending) ของข้อมูลคุณภาพผลิตภัณฑ์ตลอดทั้งปีอย่างเป็นระบบ (เช่น ผลการทดสอบ batch, deviations, complaints, returns, ผลการศึกษา stability, การเปลี่ยนแปลงกระบวนการ) เพื่อยืนยันความสม่ำเสมอของกระบวนการผลิตที่มีอยู่ และระบุความจำเป็นในการปรับปรุงหรือ revalidate กระบวนการ",
      "APR/PQR คือการทบทวน batch record ของแต่ละ batch แยกกันเท่านั้น โดยไม่จำเป็นต้องวิเคราะห์แนวโน้มในภาพรวมของทั้งปี",
      "APR/PQR จัดทำขึ้นเพื่อวัตถุประสงค์ทางการตลาดเป็นหลัก ไม่ได้เกี่ยวข้องโดยตรงกับระบบควบคุมคุณภาพของผลิตภัณฑ์",
      "APR/PQR ไม่จำเป็นต้องรวมข้อมูล complaints หรือ returns เพราะถือเป็นข้อมูลที่อยู่นอกกระบวนการผลิตโดยตรง",
      "การจัดทำ APR/PQR เป็นทางเลือกที่บริษัทสามารถเลือกทำหรือไม่ทำก็ได้ หากมีระบบ change control ที่มีประสิทธิภาพอยู่แล้ว",
    ],
    rationale:
      "APR/PQR เป็นข้อกำหนดตามระบบ GMP ที่มุ่งทบทวนและวิเคราะห์แนวโน้มของข้อมูลคุณภาพผลิตภัณฑ์อย่างเป็นระบบตลอดรอบปี ครอบคลุมทั้งผลการทดสอบ batch, deviations, complaints, returns, ผลการศึกษา stability, และการเปลี่ยนแปลงกระบวนการที่เกิดขึ้น เพื่อยืนยันว่ากระบวนการผลิตที่มีอยู่ยังคงสม่ำเสมอและควบคุมได้ตามที่ออกแบบไว้ รวมถึงระบุสัญญาณที่บ่งชี้ความจำเป็นในการปรับปรุงกระบวนการหรือทำ revalidation ซึ่งเป็นกิจกรรมที่แตกต่างจากการทบทวน batch record รายตัวซึ่งเป็นการตรวจสอบเชิงลึกในระดับ batch เดียว ไม่ใช่การวิเคราะห์แนวโน้มในภาพรวม",
    traps: [
      "ผิด — การทบทวน batch record รายตัวเป็นกิจกรรมการควบคุมคุณภาพที่แยกจาก APR/PQR ซึ่งเน้นการวิเคราะห์แนวโน้มของข้อมูลในภาพรวมตลอดทั้งปี ไม่ใช่การทบทวนแต่ละ batch แยกกันโดยไม่เชื่อมโยงข้อมูล",
      "ผิด — APR/PQR เป็นเครื่องมือควบคุมคุณภาพที่สำคัญตามระบบ GMP ไม่ใช่เอกสารที่จัดทำเพื่อวัตถุประสงค์ทางการตลาด",
      "ผิด — Complaints และ returns เป็นข้อมูลที่สำคัญและโดยทั่วไปกำหนดให้ต้องรวมอยู่ใน APR/PQR เนื่องจากสะท้อนปัญหาคุณภาพที่อาจเกี่ยวข้องกับกระบวนการผลิตหรือผลิตภัณฑ์โดยตรง",
      "ผิด — การจัดทำ APR/PQR เป็นข้อกำหนดตามระบบ GMP ในตลาดที่มีการกำกับดูแลส่วนใหญ่ ไม่ใช่กิจกรรมทางเลือกที่ขึ้นอยู่กับดุลยพินิจของบริษัท แม้จะมีระบบ change control ที่ดีอยู่แล้วก็ตาม",
    ],
    difficulty: "medium",
    ref: "EU GMP Chapter 1 / Annex; FDA cGMP (21 CFR 211.180) — Annual Product Review / Product Quality Review requirements",
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
    id: `ip1set2_d06_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 6/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 6 · ${d.topic}\n\n${d.prompt}`,
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
      "Manually drafted original IP1 item (Daily Set 2, Day 6/30) — not copied from any past exam. Editorial/technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-28 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 210,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY06: McqQuestion[] = D.map(buildQuestion);
