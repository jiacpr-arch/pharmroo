// เกมร้านยา — ชนิดข้อมูลของโจทย์ (story) และสถานะเกม
//
// โจทย์เป็น array ของ node:
//   { say: { who, pose, text, fx? }, t? }   — บทพูด
//   { inter: 'ข้อความ!!', drama?, green?, fx?, t? } — จังหวะเน้นเต็มจอ
//   { skip: 'คำบรรยาย', t }                — time-skip (เช่น รอลูกค้ากลับมาวันถัดไป)
//   { choice: { q, options: [{ tgt, label, ok, why?, worsen?, then?[] }] } }
//   { end: true }
//
// text เป็น plain text — เน้นคำด้วย **คำเน้น** (render ผ่าน parseEmphasis
// เท่านั้น ห้ามใช้ HTML/dangerouslySetInnerHTML เพื่อรองรับโจทย์จาก
// แอดมิน/AI ในอนาคตอย่างปลอดภัย)
//
// ยกมาจากเอนจิน Code Blue Sim ของ morroo แล้วตัดส่วน ACLS (ECG/CPR/shock)
// ออก แทนด้วย fx ที่มีความหมายในร้านยา

export type Pose = "idle" | "talk" | "panic" | "stern" | "happy";
export type Grade = "S" | "A" | "B" | "C";

export interface NodeFx {
  /** จังหวะ red flag — เสียงเตือน + จอแดง */
  alert?: boolean;
  /** ตัดสินใจส่งต่อแพทย์ */
  refer?: boolean;
  /** จ่ายยา/ผลิตภัณฑ์ 1 รายการ */
  dispense?: boolean;
  /** ให้คำแนะนำการใช้ยาครบถ้วน */
  counsel?: boolean;
}

export interface SayNode {
  say: { who: string; pose: Pose; text: string; fx?: NodeFx };
  t?: number;
}

export interface InterNode {
  inter: string;
  drama?: "red" | "white";
  green?: boolean;
  fx?: NodeFx;
  t?: number;
}

export interface SkipNode {
  skip: string;
  t: number;
}

export interface ChoiceOption {
  /** หมวดการกระทำ เช่น ซักประวัติ / ประเมิน / จ่ายยา / แนะนำ / ส่งต่อ / ปฏิเสธ */
  tgt: string;
  label: string;
  ok: boolean;
  why?: string;
  worsen?: boolean;
  then?: StoryNode[];
  /** ใส่โดย engine เมื่อหมดเวลา ไม่ได้มาจากข้อมูลโจทย์ */
  timeout?: boolean;
}

export interface ChoiceNode {
  choice: { q: string; options: ChoiceOption[] };
}

export interface EndNode {
  end: true;
}

export type StoryNode = SayNode | InterNode | SkipNode | ChoiceNode | EndNode;

export interface GameScenario {
  slug: string;
  title: string;
  subtitle: string;
  /** ป้ายระดับเนื้อหา (ไม่ใช่ความยากของเกม) เช่น 'basic' | 'advanced' */
  difficultyTag?: string;
  /** หมวดเคส เช่น 'otc' | 'interaction' | 'referral' — ใช้แค่ป้ายบนหน้ารวม */
  category?: string;
  /** ฉากหลังของเวที — id จาก lib/game/backgrounds.ts */
  bg?: string;
  story: StoryNode[];
}

export interface TimelineItem {
  t: number;
  ok: boolean;
  text: string;
  note?: string;
}

export interface GameState {
  difficulty: string;
  ptr: number;
  queue: StoryNode[];
  simTime: number;
  hp: number;
  maxHp: number;
  wrong: number;
  timeline: TimelineItem[];
  referred: boolean;
  dispensed: number;
  counseled: boolean;
}

export interface TextSegment {
  em: boolean;
  text: string;
}

/** แปลง **คำเน้น** เป็น segment สำหรับ render อย่างปลอดภัย (ไม่มี HTML) */
export function parseEmphasis(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const parts = text.split("**");
  parts.forEach((part, i) => {
    if (part) segments.push({ em: i % 2 === 1, text: part });
  });
  return segments;
}

/** ตรวจโครงโจทย์จาก DB/AI แบบหลวมๆ ก่อนเอาไปเล่น — กันข้อมูลพังทำเกมค้าง */
export function isValidScenario(x: unknown): x is GameScenario {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  if (typeof s.slug !== "string" || typeof s.title !== "string") return false;
  if (!Array.isArray(s.story) || s.story.length === 0) return false;
  return s.story.every((n) => {
    if (!n || typeof n !== "object") return false;
    const node = n as Record<string, unknown>;
    if (node.end === true) return true;
    if (typeof node.inter === "string") return true;
    if (typeof node.skip === "string") return typeof node.t === "number";
    if (node.say && typeof node.say === "object") {
      const say = node.say as Record<string, unknown>;
      return typeof say.who === "string" && typeof say.text === "string";
    }
    if (node.choice && typeof node.choice === "object") {
      const c = node.choice as Record<string, unknown>;
      return (
        typeof c.q === "string" &&
        Array.isArray(c.options) &&
        c.options.length >= 2 &&
        c.options.some((o) => (o as ChoiceOption)?.ok === true)
      );
    }
    return false;
  });
}
