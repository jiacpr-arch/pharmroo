import type { McqQuestion } from "@/lib/types-mcq";

// IP1 Daily Set 2 — Day 1 of 30 (10 questions/day plan)
// Topic focus: Cleanroom / HVAC / GMP Annex 1 environmental classification.
// Distinct topics from IP1_PILOT_050 (lib/ip1-pilot-050.ts) — that set does not
// cover cleanroom grading, pressure cascade, HEPA integrity, recovery time,
// or ACH calculation, so this day introduces new ground rather than repeating it.
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
    topic: "Cleanroom classification vs airflow pattern",
    prompt:
      "ห้อง B วัด particle count ได้ผลดีกว่าเกณฑ์ที่กำหนดสำหรับ Grade B ทั้งสองสภาวะ (at rest และ in operation ผ่านเกณฑ์ ISO 5 ทั้งคู่) แต่เมื่อทำ smoke study ตรวจสอบ airflow pattern ที่ critical zone พบว่าเป็นแบบ turbulent (ไม่ใช่ unidirectional) ทั่วทั้งบริเวณ ข้อสรุปที่เหมาะสมที่สุดคือข้อใด",
    options: [
      "ห้องนี้ยังไม่สามารถจัดเป็น Grade A ได้ แม้ particle count จะผ่านเกณฑ์ ISO 5 ทั้งสองสภาวะ เพราะ Grade A กำหนดให้ critical zone ต้องมี unidirectional airflow ยืนยันด้วย ไม่ใช่พิจารณาจาก particle count เพียงอย่างเดียว",
      "ห้องนี้จัดเป็น Grade A ได้ทันทีเพราะ particle count ดีกว่าเกณฑ์ขั้นต่ำของ Grade B ทั้งสองสภาวะ",
      "ห้องนี้ควรลดระดับเป็น Grade D ทันทีเพราะ airflow ไม่เป็น unidirectional",
      "Turbulent airflow ไม่มีผลต่อการจัด Grade ตราบใดที่ particle count ผ่านเกณฑ์ตัวเลข",
      "ต้องเปลี่ยนไปวัด viable particle แทน non-viable particle เพื่อจัด Grade ให้ถูกต้อง",
    ],
    rationale:
      "การจัด EU GMP Grade ไม่ได้อิงจากตัวเลข particle count เพียงอย่างเดียว Grade A มีข้อกำหนดเพิ่มเติมว่า critical zone ต้องมี unidirectional airflow ที่ยืนยันได้จริงด้วย smoke study/airflow visualization เพื่อกวาดอนุภาคออกจากจุดวิกฤตอย่างต่อเนื่อง หากพบ turbulent flow แม้ particle count จะผ่านเกณฑ์ ISO 5 ก็ยังไม่เข้าเกณฑ์ Grade A และต้องแก้ไขปัญหา airflow ก่อน",
    traps: [
      "เป็นความเข้าใจผิดที่พบบ่อย — particle count ที่ดีกว่าเกณฑ์ไม่ได้แปลว่าเข้าเกณฑ์ Grade ที่สูงกว่าเสมอไป เพราะยังขาดคุณสมบัติ unidirectional airflow ที่ Grade A ต้องมี",
      "การลดระดับ Grade ทันทีโดยไม่พิจารณาว่าห้องยังผ่านเกณฑ์ particle count ของ Grade B อยู่เป็นการตอบสนองที่เกินความจำเป็น (over-reaction) ไม่ใช่ผลสรุปที่ถูกต้อง",
      "Airflow pattern มีผลโดยตรงต่อความสามารถในการกวาดอนุภาคและป้องกันการปนเปื้อนที่ critical zone จึงเป็นเกณฑ์ที่ต้องพิจารณาร่วมกับ particle count เสมอ",
      "การจัด Grade ต้องพิจารณาทั้ง non-viable และ viable particle รวมถึง airflow pattern ร่วมกัน ไม่ใช่เปลี่ยนไปดูตัวแปรใดตัวแปรหนึ่งแทน",
    ],
    difficulty: "hard",
    ref: "EU GMP Annex 1 (environmental monitoring & classification principles); ISO 14644-1",
  },
  {
    topic: "Pressure cascade deviation",
    prompt:
      "กระบวนการ aseptic filling ออกแบบ pressure cascade เรียงจาก Grade A (isolator) > Grade B > Grade C > Grade D > corridor ภายนอก โดยกำหนด differential pressure ระหว่างเกรดที่ติดกันไม่ต่ำกว่า 10-15 Pa วันหนึ่งพบว่า differential pressure ระหว่าง Grade B และ Grade C ลดลงเหลือ 3 Pa อย่างต่อเนื่อง ขณะที่ Grade A ต่อ B ยังปกติที่ 12 Pa การตัดสินใจที่เหมาะสมที่สุดคือข้อใด",
    options: [
      "มีความเสี่ยงที่อากาศจาก Grade C ซึ่งสะอาดน้อยกว่าไหลย้อนเข้าสู่ Grade B ได้ ควรหยุดกิจกรรมที่เกี่ยวข้องและสอบสวนสาเหตุ (เช่น ประตูค้าง, HVAC damper ผิดปกติ, filter อุดตัน) ก่อนดำเนินการต่อ",
      "ไม่มีผลกระทบใดๆ เพราะ differential pressure ระหว่าง Grade A กับ B ซึ่งเป็นจุดวิกฤตที่สุดยังคงปกติอยู่",
      "ควรเพิ่มความดันใน Grade D เพื่อชดเชยผลต่างที่ลดลงระหว่าง B และ C",
      "3 Pa ยังอยู่ในเกณฑ์ยอมรับได้เนื่องจากมีค่ามากกว่าศูนย์",
      "เป็นเรื่องปกติเพราะ pressure cascade มีการเปลี่ยนแปลงตามการเปิดปิดประตูอยู่แล้วตลอดเวลา",
    ],
    rationale:
      "Pressure cascade ทำหน้าที่ป้องกันการไหลย้อนของอากาศจากพื้นที่สะอาดน้อยกว่าไปยังพื้นที่สะอาดมากกว่าในทุกคู่ของเกรดที่ติดกัน ไม่ใช่เฉพาะคู่ที่อยู่ชั้นในสุด การที่ผลต่างความดันระหว่าง B และ C ลดลงต่ำกว่าเกณฑ์อย่างต่อเนื่อง (ไม่ใช่ transient จากการเปิดประตูชั่วคราว) เป็นสัญญาณของความผิดปกติในระบบ HVAC ที่ต้องหยุดตรวจสอบและแก้ไขก่อนดำเนินการต่อ เพื่อป้องกันการปนเปื้อนสะสมเข้าสู่ Grade B",
    traps: [
      "การป้องกันการปนเปื้อนต้องอาศัยผลต่างความดันที่เพียงพอในทุกคู่ของเกรดที่ติดกัน ไม่ใช่เฉพาะคู่ในสุด เพราะการรั่วไหลที่ B/C ก็ส่งผลต่อคุณภาพอากาศของ B ได้เช่นกัน",
      "การเพิ่มความดันใน Grade D ไม่ได้แก้ปัญหาที่ต้นเหตุของผลต่างระหว่าง B และ C และไม่ตรงจุดที่ตรวจพบความผิดปกติ",
      "เกณฑ์ทั่วไปกำหนดผลต่างความดันขั้นต่ำที่ชัดเจน (มักอ้างอิงราว 10-15 Pa) ไม่ใช่เพียงแค่มากกว่าศูนย์ เพื่อให้มั่นใจว่าทิศทางการไหลของอากาศเสถียรพอในทางปฏิบัติ",
      "โจทย์ระบุว่าเป็นการลดลงอย่างต่อเนื่อง ไม่ใช่การเปลี่ยนแปลงชั่วคราวจากการเปิดปิดประตู จึงต้องแยกแยะและสอบสวนเป็นความผิดปกติของระบบ",
    ],
    difficulty: "hard",
    ref: "EU GMP Annex 1 — pressure cascade principles for contamination control",
  },
  {
    topic: "Grade A airflow velocity qualification",
    prompt:
      "Unidirectional airflow ใน isolator สำหรับ aseptic filling (Grade A) วัดความเร็วลมเฉลี่ยที่ระดับ working height ได้ 0.30 m/s ซึ่งต่ำกว่าช่วงอ้างอิงทั่วไปที่มักใช้เป็นแนวทาง (ประมาณ 0.36-0.54 m/s) แนวทางการประเมินที่เหมาะสมที่สุดคือข้อใด",
    options: [
      "ความเร็วลมที่ต่ำกว่าช่วงอ้างอิงอาจไม่เพียงพอต่อการกวาดอนุภาคออกจาก critical zone ได้ทันเวลา ต้องยืนยันด้วย smoke study ว่ายังคง sweeping efficacy ที่เพียงพอในทุกจุดวิกฤตก่อนตัดสินว่าใช้งานได้",
      "0.30 m/s ผ่านเกณฑ์ได้ทันทีเพราะยังเป็นค่าที่ยอมรับได้ทั่วไปสำหรับห้องสะอาดทุกประเภท",
      "ต้องปรับความเร็วลมให้ตรง 0.45 m/s พอดีทุกจุดเสมอ เพราะเป็นค่ากำหนดตายตัวที่เปลี่ยนแปลงไม่ได้",
      "ความเร็วลมไม่มีผลต่อ aseptic assurance ตราบใดที่อากาศผ่าน HEPA filter แล้ว",
      "ค่าความเร็วลมนี้ใช้ประเมินเฉพาะสภาวะ at rest เท่านั้น ไม่จำเป็นต้องพิจารณาขณะ operation",
    ],
    rationale:
      "ความเร็วลมเป็นเพียงตัวแปรหนึ่งที่สนับสนุนการเกิด unidirectional sweep การที่ค่าต่ำกว่าช่วงอ้างอิงเป็นสัญญาณเตือนที่ต้องตรวจสอบเพิ่มเติมด้วยวิธีที่ตรงประเด็นกว่าคือ smoke study/airflow visualization ที่ critical zone จริง เพื่อยืนยันว่ายังกวาดอนุภาคออกจากจุดเสี่ยงต่อผลิตภัณฑ์ได้เพียงพอ ไม่ควรตัดสิน pass/fail จากตัวเลขความเร็วเพียงค่าเดียวโดยไม่ยืนยันด้วยการทดสอบ performance จริง",
    traps: [
      "ช่วงอ้างอิงที่ระบุเป็นค่าที่ใช้เฉพาะ critical zone แบบ unidirectional airflow ของ Grade A ไม่ใช่เกณฑ์ทั่วไปของห้องสะอาดทุกระดับ การอยู่ต่ำกว่าช่วงจึงเป็นสัญญาณที่ต้องตรวจสอบ",
      "แนวทางปัจจุบันเน้นการยืนยัน performance (เช่น smoke study) มากกว่าการยึดตัวเลขจุดเดียวแบบตายตัวโดยไม่มีความยืดหยุ่นตามการประเมินความเสี่ยง",
      "ความเร็วและรูปแบบการไหลของอากาศมีผลต่อการกวาดอนุภาคออกจาก critical zone อย่างมีนัยสำคัญ การกรองอากาศเพียงอย่างเดียวไม่ได้รับประกัน sweeping efficacy",
      "Critical zone ต้องรักษาการป้องกันในระหว่าง operation ซึ่งเป็นช่วงที่มีความเสี่ยงจากการปนเปื้อนสูงสุด ไม่ใช่พิจารณาเฉพาะ at rest",
    ],
    difficulty: "medium",
    ref: "EU GMP Annex 1 — Grade A unidirectional airflow qualification concepts",
  },
  {
    topic: "HEPA filter integrity test failure",
    prompt:
      "การทดสอบ HEPA filter integrity (aerosol photometer scan) ของ terminal filter ในห้อง Grade B พบ local leak ที่ขอบ filter frame เกินเกณฑ์ที่กำหนด (>0.01% ของ upstream concentration) ที่ตำแหน่งเดียว การปฏิบัติที่เหมาะสมที่สุดคือข้อใด",
    options: [
      "ถือว่า filter ไม่ผ่านเกณฑ์ integrity test ต้องดำเนินการซ่อม (repair patch ตามเกณฑ์ที่กำหนด) หรือเปลี่ยน filter แล้วทดสอบซ้ำก่อนอนุญาตให้ใช้งานห้องนั้นต่อ",
      "ผ่านเกณฑ์ได้เพราะ leak เกิดขึ้นเพียงจุดเดียว ไม่ใช่ทั่วทั้งแผ่นกรอง",
      "ไม่ต้องดำเนินการใดๆ เพิ่มเติมเพราะ Grade B ไม่จำเป็นต้องทำ integrity test เป็นประจำ",
      "เปลี่ยนไปวัด particle count ของห้องแทนเพื่อยืนยันผลแทนการซ่อมหรือเปลี่ยน filter",
      "ลดความเร็วลมที่ผ่าน filter เพื่อลด leak rate ที่ตรวจพบให้อยู่ในเกณฑ์",
    ],
    rationale:
      "Integrity test ที่พบ local leak เกินเกณฑ์แม้เพียงจุดเดียวถือว่า filter นั้นไม่ผ่านเกณฑ์ เนื่องจากรอยรั่วเป็นช่องทางให้อนุภาคที่ไม่ผ่านการกรองเล็ดลอดเข้าสู่พื้นที่ผลิตได้โดยตรง ต้องดำเนินการแก้ไข (ซ่อมแบบมีเกณฑ์กำกับ หรือเปลี่ยน filter) แล้วทดสอบยืนยันซ้ำก่อนกลับมาใช้งาน ไม่สามารถใช้วิธีอื่นทดแทนการแก้ไขที่ต้นเหตุได้",
    traps: [
      "เกณฑ์ integrity test พิจารณาจากการพบ leak ที่ตำแหน่งใดก็ตามที่เกินค่าที่กำหนด ไม่ใช่พิจารณาสัดส่วนพื้นที่ที่รั่วเทียบกับทั้งแผ่น",
      "Grade B เป็นพื้นที่สนับสนุน critical zone ที่ต้องมีการทดสอบ integrity ของ terminal filter อย่างสม่ำเสมอตามโปรแกรมที่กำหนด",
      "Particle count เป็นการทดสอบคนละวัตถุประสงค์ ไม่สามารถใช้แทนการยืนยันความสมบูรณ์ของแผ่นกรองที่ตรวจพบรอยรั่วแล้วได้",
      "การลดความเร็วลมเป็นการหลีกเลี่ยงการตรวจพบปัญหาโดยไม่แก้ไขที่สาเหตุทางกายภาพของรอยรั่ว ไม่ใช่แนวทางที่ยอมรับได้",
    ],
    difficulty: "medium",
    ref: "HEPA filter integrity testing principles (aerosol photometer / DOP-PAO challenge)",
  },
  {
    topic: "Room recovery time interpretation",
    prompt:
      "ห้อง Grade C ทดสอบ recovery time โดยปล่อยอนุภาคทดสอบให้ระดับสูงขึ้นถึง ISO 8 ชั่วคราว แล้ววัดเวลาที่ห้องกลับสู่การจัดระดับ ISO 7 (at-rest classification) ได้ผล 25 นาที ขณะที่แนวทางทั่วไปมักอ้างอิงว่าห้องควรกลับสู่สภาวะที่กำหนดภายในเวลาสั้น (มักอ้างอิงราว 15-20 นาที) ข้อสรุปที่เหมาะสมที่สุดคือข้อใด",
    options: [
      "Recovery time 25 นาทีนานกว่าค่าที่แนะนำทั่วไป ควรตรวจสอบ air change rate ตำแหน่ง supply/return grille และการปรับสมดุลระบบ HVAC ของห้องนี้ พร้อมประเมินความเสี่ยงต่อการปฏิบัติงานที่ต้องพึ่งพาการกลับสู่สภาวะสะอาดอย่างรวดเร็ว",
      "25 นาทีผ่านเกณฑ์เสมอเนื่องจากไม่มีข้อกำหนดตายตัวเรื่อง recovery time ในทุกกรณี",
      "Recovery time ไม่เกี่ยวข้องกับ air change rate ของห้อง",
      "ควรลด air change rate ของห้องนี้ลงเพื่อประหยัดพลังงานเนื่องจากผลการทดสอบผ่านอยู่แล้ว",
      "ควรทดสอบซ้ำในสภาวะ operation แทน at rest เพราะให้ผลที่แม่นยำกว่าเสมอ",
    ],
    rationale:
      "Air change rate เป็นปัจจัยหลักที่กำหนด recovery time ของห้องสะอาด ผลลัพธ์ 25 นาทีที่ช้ากว่าค่าที่มักใช้อ้างอิงทั่วไปเป็นสัญญาณที่ควรตรวจสอบการออกแบบ/สมดุลระบบ HVAC มากกว่าการยอมรับผลโดยไม่พิจารณา เนื่องจากห้องที่กลับสู่สภาวะสะอาดช้าเพิ่มความเสี่ยงต่อกิจกรรมที่ต้องอาศัยการฟื้นตัวเร็วหลังการรบกวน (เช่น หลังการแทรกแซง/ทำความสะอาด)",
    traps: [
      "แม้ไม่มีตัวเลขบังคับที่ตายตัวในทุกสถานการณ์ แต่ผลที่ช้ากว่าค่าที่ใช้อ้างอิงทั่วไปอย่างชัดเจนยังควรได้รับการทบทวนเชิงวิศวกรรม/ความเสี่ยง ไม่ใช่ยอมรับเป็นการทั่วไปโดยไม่พิจารณา",
      "Air change rate เป็นตัวแปรสำคัญที่กำหนดอัตราการเจือจาง/กำจัดอนุภาคออกจากห้อง จึงมีผลโดยตรงต่อ recovery time",
      "ผลลัพธ์ที่ได้ช้ากว่าค่าที่มักใช้อ้างอิงทั่วไป ไม่ควรถูกตีความว่า 'ผ่านอยู่แล้ว' และการลด air change rate ลงอีกจะยิ่งทำให้ recovery time แย่ลง",
      "การทดสอบ recovery time มีวัตถุประสงค์เฉพาะเพื่อประเมินการฟื้นตัวจากสภาวะถูกรบกวนกลับสู่สภาวะที่กำหนดตามโปรโตคอลที่ออกแบบไว้ ไม่ใช่เปลี่ยนสภาวะทดสอบตามความสะดวก",
    ],
    difficulty: "hard",
    ref: "Cleanroom recovery time / air change rate concepts (ISO 14644 series; cleanroom engineering guidance)",
  },
  {
    topic: "Viable monitoring alert result",
    prompt:
      "การเก็บตัวอย่าง settle plate ในห้อง Grade A ระหว่าง batch ปกติคาดหวังว่าจะไม่พบการเจริญของจุลินทรีย์ (no growth) แต่ผลที่ได้พบ 1 CFU การปฏิบัติที่เหมาะสมที่สุดคือข้อใด",
    options: [
      "ถือเป็นเหตุการณ์เบี่ยงเบนที่ต้องสอบสวนทันที แม้จะพบเพียง 1 CFU เนื่องจาก Grade A ควรปราศจากการเจริญของจุลินทรีย์ในทางปฏิบัติ ต้องประเมินผลกระทบต่อ batch ที่ผลิตร่วมด้วยการสอบสวนสาเหตุ เช่น personnel practice, garment integrity, หรือการรบกวน airflow",
      "1 CFU ยอมรับได้เสมอเพราะยังต่ำกว่า action limit ที่ใช้กับ Grade C",
      "ไม่จำเป็นต้องสอบสวนเพราะเป็นเพียงระดับ alert ไม่ใช่ action limit",
      "ให้ทำความสะอาดห้องใหม่แล้วดำเนินการผลิตต่อโดยไม่ต้องบันทึกเหตุการณ์",
      "ควรเปลี่ยนมาใช้ active air sampler แทน settle plate เพื่อลดโอกาสตรวจพบผลบวก",
    ],
    rationale:
      "Grade A เป็นพื้นที่วิกฤตที่สุดต่อผลิตภัณฑ์ปราศจากเชื้อ การพบจุลินทรีย์แม้เพียง 1 CFU จากวิธีใดก็ตามถือเป็นเหตุการณ์ที่ต้องสอบสวนทันทีตามระบบคุณภาพ เพื่อประเมินความเสี่ยงต่อ batch และหาสาเหตุที่แท้จริง ไม่สามารถเปรียบเทียบกับเกณฑ์ของเกรดที่ต่ำกว่า หรือมองข้ามเพราะเป็นเพียงระดับ alert ได้ เนื่องจากความคาดหวังของ Grade A คือไม่พบการเจริญเลยในทางปฏิบัติ",
    traps: [
      "เกณฑ์ยอมรับของแต่ละ Grade แยกจากกันโดยเจตนา การนำเกณฑ์ของ Grade ที่ต่ำกว่ามาเทียบกับผลใน Grade A เป็นการเปรียบเทียบที่ไม่เหมาะสม",
      "แม้จัดเป็นระดับ alert ไม่ใช่ action ตามระบบที่กำหนดไว้ แต่ความเข้มงวดของ Grade A ทำให้ผลบวกทางจุลชีววิทยาใดๆ ควรได้รับการสอบสวนเสมอ ไม่ใช่ปล่อยผ่าน",
      "ระบบคุณภาพกำหนดให้ทุกเหตุการณ์เบี่ยงเบนต้องมีการบันทึกและสอบสวนตามขั้นตอนที่กำหนด การข้ามขั้นตอนนี้ขัดต่อหลัก data integrity และ GMP",
      "การเปลี่ยนวิธีการตรวจติดตามเพื่อลดโอกาสตรวจพบผลบวกเป็นการบั่นทอนความน่าเชื่อถือของโปรแกรม environmental monitoring โดยตรง ไม่ใช่การแก้ปัญหาที่เหมาะสม",
    ],
    difficulty: "medium",
    ref: "EU GMP Annex 1 — environmental monitoring (viable) principles for Grade A",
  },
  {
    topic: "ISO 14644 vs GMP Grade concept",
    prompt:
      "ข้อใดอธิบายความแตกต่างระหว่างการจัดระดับตามมาตรฐาน ISO 14644-1 กับการจัดระดับ GMP Grade (เช่นตาม EU GMP Annex 1) ได้ถูกต้องที่สุด",
    options: [
      "ISO 14644-1 จัดระดับโดยใช้เกณฑ์ non-viable particle count ตามขนาดอนุภาคเป็นหลัก ขณะที่ GMP Grade นำ ISO class มาเป็นส่วนประกอบหนึ่ง แต่เพิ่มข้อกำหนดด้าน microbiological monitoring, สถานะการปฏิบัติงาน (at rest/in operation), รูปแบบการไหลของอากาศ และข้อกำหนดเชิงปฏิบัติการที่เกี่ยวข้องกับความเสี่ยงต่อผลิตภัณฑ์ปราศจากเชื้อ",
      "ทั้งสองระบบใช้เกณฑ์เดียวกันทุกประการ จึงสามารถใช้แทนกันได้เสมอในทุกบริบท",
      "GMP Grade ใช้เฉพาะเกณฑ์ viable particle เท่านั้น ไม่พิจารณา non-viable particle เลย",
      "ISO 14644-1 เป็นมาตรฐานที่กำหนดเฉพาะสำหรับอุตสาหกรรมยาเท่านั้น",
      "GMP Grade ไม่พิจารณาความแตกต่างระหว่างสถานะ at rest กับ in operation เพราะใช้ค่าเดียวตลอด",
    ],
    rationale:
      "ISO 14644-1 เป็นมาตรฐานทั่วไปสำหรับห้องสะอาดที่ใช้ในหลายอุตสาหกรรม จัดระดับด้วย non-viable particle count ตามขนาดอนุภาคเป็นหลัก ส่วน GMP Grade นำแนวคิด ISO class มาใช้อ้างอิง แต่ผนวกข้อกำหนดเพิ่มเติมที่เจาะจงต่อความเสี่ยงของผลิตภัณฑ์ยาปราศจากเชื้อ เช่น เกณฑ์ microbiological monitoring, การกำหนดสถานะ at rest และ in operation แยกกัน, และข้อกำหนดด้าน airflow pattern ที่ critical zone",
    traps: [
      "GMP Grade มีข้อกำหนดที่ครอบคลุมกว่าและเจาะจงต่อความเสี่ยงทางเภสัชกรรมมากกว่า ISO 14644-1 ล้วนๆ จึงไม่สามารถใช้แทนกันได้ในทุกบริบท",
      "GMP Grade พิจารณาทั้ง viable และ non-viable particle ร่วมกัน ไม่ได้ใช้เฉพาะ viable particle เพียงอย่างเดียว",
      "ISO 14644-1 เป็นมาตรฐานทั่วไปที่ใช้ได้ในหลายอุตสาหกรรม (เช่น semiconductor, aerospace) ไม่ได้จำกัดเฉพาะอุตสาหกรรมยา",
      "GMP Grade กำหนดเกณฑ์ที่แตกต่างกันอย่างชัดเจนระหว่างสถานะ at rest และ in operation ซึ่งเป็นหนึ่งในความแตกต่างสำคัญจาก ISO class เพียงอย่างเดียว",
    ],
    difficulty: "medium",
    ref: "ISO 14644-1; EU GMP Annex 1 — conceptual framework comparison",
  },
  {
    topic: "Containment pressure direction (cytotoxic)",
    prompt:
      "โรงงานผลิตยา cytotoxic ต้องออกแบบ pressure cascade เพื่อป้องกันการฟุ้งกระจายของสารออกฤทธิ์ที่มีความเป็นพิษสูงสู่พื้นที่ข้างเคียงและบุคลากร ข้อใดถูกต้องเกี่ยวกับทิศทางความดันที่เหมาะสมที่สุด",
    options: [
      "พื้นที่ผลิต cytotoxic ควรมีความดันเป็นลบเทียบกับพื้นที่ข้างเคียง (negative pressure cascade) เพื่อป้องกันสารออกฤทธิ์แพร่กระจายออกจากพื้นที่ผลิต ซึ่งตรงข้ามกับหลักการ positive pressure cascade ที่ใช้ป้องกันการปนเปื้อนเข้าสู่ผลิตภัณฑ์ปราศจากเชื้อทั่วไป",
      "ควรใช้ positive pressure cascade แบบเดียวกับห้อง aseptic ทั่วไปเสมอ ไม่ว่าจะผลิตยาชนิดใด",
      "ไม่จำเป็นต้องควบคุมทิศทางความดัน ตราบใดที่มี local exhaust ที่จุดผลิตโดยเฉพาะ",
      "ควรให้ทุกพื้นที่มีความดันเท่ากันเพื่อความสมดุลของระบบ HVAC โดยรวม",
      "ควรใช้ positive pressure cascade เฉพาะช่วงทำความสะอาด แต่เปลี่ยนเป็น negative เฉพาะช่วงการผลิต",
    ],
    rationale:
      "เป้าหมายของการควบคุมความดันมีสองแบบที่ตรงข้ามกันตามวัตถุประสงค์: การป้องกันผลิตภัณฑ์จากสิ่งแวดล้อม (product protection) ใช้ positive pressure cascade ให้อากาศไหลจากพื้นที่สะอาดกว่าออกสู่ภายนอก ส่วนการป้องกันบุคลากร/สิ่งแวดล้อมจากสารที่มีความเป็นอันตรายสูงอย่าง cytotoxic (containment) ต้องใช้ negative pressure cascade ให้อากาศไหลเข้าสู่พื้นที่ผลิตแทน เพื่อไม่ให้สารออกฤทธิ์ฟุ้งกระจายออกไป",
    traps: [
      "เป็นกับดักคลาสสิกที่สับสนระหว่างเป้าหมาย product protection (positive) กับเป้าหมาย personnel/environment protection สำหรับสารออกฤทธิ์สูง (negative) ซึ่งเป็นหลักการคนละแบบกัน",
      "Local exhaust เพียงอย่างเดียวไม่เพียงพอโดยไม่มีกลยุทธ์ควบคุมทิศทางความดันโดยรวมของพื้นที่",
      "ความดันเท่ากันทุกพื้นที่ทำให้ไม่มีทิศทางการไหลของอากาศที่ควบคุมได้ ซึ่งจำเป็นทั้งสำหรับ containment และ product protection",
      "หลักการออกแบบมาตรฐานคือรักษา negative pressure cascade ตลอดช่วงที่มีความเสี่ยงต่อการฟุ้งกระจายสูงสุด ซึ่งคือช่วงการผลิตเอง ไม่ใช่สลับทิศทางตามกิจกรรม",
    ],
    difficulty: "hard",
    ref: "Containment design principles for highly potent/cytotoxic API manufacturing",
  },
  {
    topic: "Airlock / interlock design",
    prompt:
      "การออกแบบ airlock เชื่อมระหว่าง Grade C corridor กับ Grade B core สำหรับนำวัสดุ (material) เข้าสู่พื้นที่ผลิตปราศจากเชื้อ ข้อใดเป็นหลักการออกแบบที่เหมาะสมที่สุด",
    options: [
      "ควรใช้ pass-through hatch หรือ material airlock ที่มีระบบ interlock ป้องกันไม่ให้เปิดประตูทั้งสองฝั่งพร้อมกัน และอาจมีขั้นตอนทำความสะอาด/ฆ่าเชื้อผิว (เช่น UV หรือ VHP) ระหว่างขั้นตอน เพื่อลด bioburden ก่อนเข้าสู่พื้นที่ Grade สูงกว่า",
      "เปิดประตูทั้งสองฝั่งของ airlock พร้อมกันได้หากต้องการความรวดเร็วในการทำงาน",
      "ใช้ airlock เดียวกันสำหรับทั้งบุคลากรและวัสดุเสมอเพื่อประหยัดพื้นที่ก่อสร้าง",
      "ไม่จำเป็นต้องมีระบบ interlock หากพื้นที่นั้นมี pressure cascade อยู่แล้ว",
      "ควรเปิดประตู airlock ค้างไว้ตลอดช่วงเวลาที่มีการผลิตเพื่อความสะดวกในการลำเลียงวัสดุ",
    ],
    rationale:
      "Airlock ทำหน้าที่เป็นกำแพงกั้นทางกายภาพ/อากาศพลศาสตร์ระหว่างพื้นที่ต่างเกรด การมี interlock ป้องกันการเปิดสองฝั่งพร้อมกันเป็นหัวใจของการทำงาน เพื่อไม่ให้เกิดเส้นทางอากาศตรงระหว่างสองพื้นที่ นอกจากนี้การเพิ่มขั้นตอนลด bioburden ของวัสดุระหว่างขั้นตอนช่วยลดความเสี่ยงการนำการปนเปื้อนเข้าสู่พื้นที่ Grade สูงกว่าเพิ่มเติม",
    traps: [
      "การเปิดสองฝั่งพร้อมกันทำลายหน้าที่หลักของ airlock โดยตรง เปิดเส้นทางอากาศให้ไหลตรงระหว่างสองพื้นที่ต่างเกรด",
      "การใช้ airlock ร่วมกันระหว่างบุคลากรและวัสดุเพิ่มความเสี่ยงการปนเปื้อนข้าม (cross-contamination) และความเสี่ยงต่อ gowning breach โดยไม่จำเป็น",
      "Pressure cascade และ interlock เป็นมาตรการที่ทำหน้าที่เสริมกัน ไม่ใช่สามารถใช้แทนกันได้ทั้งหมด",
      "การเปิด airlock ค้างไว้ตลอดเวลาทำลายหน้าที่กั้นทางกายภาพของ airlock อย่างสิ้นเชิง ไม่ต่างจากการไม่มี airlock เลย",
    ],
    difficulty: "medium",
    ref: "Cleanroom airlock / material transfer design principles",
  },
  {
    topic: "Air changes per hour (ACH) calculation",
    prompt:
      "ห้อง Grade C มีขนาด 5 m × 4 m × 3 m (กว้าง × ยาว × สูง) ระบบ HVAC จ่ายลม supply air flow rate 900 m³/hr จงคำนวณ air changes per hour (ACH) ของห้องนี้ และประเมินว่าผ่านเกณฑ์อ้างอิงทั่วไปสำหรับ Grade C หรือไม่ (เกณฑ์อ้างอิงทั่วไปมักใช้ไม่ต่ำกว่าประมาณ 20 เท่า/ชั่วโมง)",
    options: [
      "ACH = 900 ÷ 60 = 15 เท่า/ชั่วโมง ซึ่งต่ำกว่าเกณฑ์อ้างอิงทั่วไปสำหรับ Grade C (≥20 เท่า/ชั่วโมง) ควรเพิ่ม supply air flow rate หรือทบทวนการออกแบบระบบ HVAC ของห้องนี้",
      "ACH = 900 ÷ 20 = 45 เท่า/ชั่วโมง ผ่านเกณฑ์ (คำนวณจากพื้นที่ห้อง 20 ตร.ม. แทนปริมาตรห้อง)",
      "ACH = 60 ÷ 900 = 0.067 เท่า/ชั่วโมง ไม่ผ่านเกณฑ์อย่างมาก",
      "ACH = 15 เท่า/ชั่วโมง ผ่านเกณฑ์เพราะมากกว่า 10 เท่า/ชั่วโมง",
      "ไม่สามารถคำนวณ ACH ได้เพราะไม่ทราบอัตราการไหลของ return air",
    ],
    rationale:
      "ปริมาตรห้อง = 5 × 4 × 3 = 60 m³ ; ACH = supply air flow rate ÷ ปริมาตรห้อง = 900 ÷ 60 = 15 เท่า/ชั่วโมง ซึ่งต่ำกว่าเกณฑ์อ้างอิงทั่วไปสำหรับ Grade C ที่มักกำหนดไม่ต่ำกว่าประมาณ 20 เท่า/ชั่วโมง จึงยังไม่ผ่านเกณฑ์ และควรพิจารณาเพิ่ม supply air flow rate หรือทบทวนการออกแบบระบบ",
    traps: [
      "การคำนวณ ACH ต้องใช้ปริมาตรห้อง (m³) ไม่ใช่พื้นที่ห้อง (m²) การใช้พื้นที่แทนปริมาตรทำให้ตัวเลขและข้อสรุปผิดพลาด",
      "สูตร ACH คือ supply air flow rate หารด้วยปริมาตรห้อง ไม่ใช่กลับด้าน การกลับด้านทำให้ค่าที่ได้ผิดหลักมิติและไม่มีความหมายในทางปฏิบัติ",
      "เกณฑ์อ้างอิงทั่วไปสำหรับ Grade C มักอยู่ที่ประมาณ 20 เท่า/ชั่วโมงขึ้นไป ไม่ใช่ 10 เท่า/ชั่วโมง การใช้เกณฑ์ที่ต่ำกว่าความเป็นจริงทำให้ประเมินผลผิดพลาด",
      "ในทางปฏิบัติ ACH สามารถประมาณจากอัตราการไหลของ supply air และปริมาตรห้องได้โดยไม่จำเป็นต้องทราบ return air flow rate แยกต่างหากเสมอไป",
    ],
    difficulty: "hard",
    ref: "Cleanroom air change rate (ACH) calculation principles",
    calc: [
      "ปริมาตรห้อง = 5 × 4 × 3 = 60 m³",
      "ACH = Supply air flow rate ÷ ปริมาตรห้อง = 900 m³/hr ÷ 60 m³ = 15 เท่า/ชั่วโมง",
      "เทียบกับเกณฑ์อ้างอิงทั่วไป Grade C (≥20 ACH) → 15 < 20 → ยังไม่ผ่านเกณฑ์",
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
    id: `ip1set2_d01_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Daily Set 2 (Day 1/30)",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Daily Set 2 · Day 1 · ${d.topic}\n\n${d.prompt}`,
    image_url: null,
    choices: shuffled.map((text, j) => ({ label: labels[j], text })),
    correct_answer: answer,
    explanation: `หลักการ: ${d.rationale}\n\nReference: ${d.ref}`,
    detailed_explanation: {
      summary: `เฉลย ${answer}. ${correct}`,
      reason: `【หลักการสำคัญ】\n${d.rationale}\n\n【วิธีคิดแบบข้อสอบ IP1】\nโจทย์ข้อนี้อยู่ในหัวข้อ "${d.topic}" ต้องเชื่อมข้อมูลเชิงตัวเลข/สถานการณ์ในโจทย์เข้ากับหลักการ GMP/engineering ที่เกี่ยวข้อง แล้วแยกตัวเลือกที่ดูสมเหตุสมผลบางส่วนแต่ไม่ใช่ single best answer ออกจากคำตอบที่ตอบโจทย์ได้ตรงและครบถ้วนที่สุด\n\n【Reference / หลักอ้างอิง】\n${d.ref}`,
      choices: choiceExplanations,
      key_takeaway: `Exam Pearl: ${d.rationale}`,
      ...(d.calc ? { calculation_steps: d.calc } : {}),
    },
    difficulty: d.difficulty,
    is_ai_enhanced: false,
    ai_notes:
      "Manually drafted original IP1 item (Daily Set 2, Day 1/30) — not copied from any past exam. Editorial/clinical-technical verification recommended before high-stakes commercial use.",
    status: "review",
    created_at: "2026-09-23 00:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 160,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_SET2_DAY01: McqQuestion[] = D.map(buildQuestion);
