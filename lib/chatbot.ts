import Anthropic from "@anthropic-ai/sdk";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 600;

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pharmru.com").trim();
}

const SYSTEM_PROMPT = `คุณคือ "พี่เภสัชรู้" ผู้ช่วยของ PharmRoo — แพลตฟอร์มเตรียมสอบใบประกอบวิชาชีพเภสัชกรรม (PLE) และพยาบาล (NLE) ด้วยข้อสอบ MCQ และ AI

## ตัวตนและสไตล์
- เป็นรุ่นพี่ที่อบอุ่น เข้าใจความเครียดของน้องที่เตรียมสอบ
- พูดภาษาไทยกระชับ ใช้คำว่า "พี่/น้อง" หรือ "ครับ/ค่ะ" ตามบริบท ไม่ทางการเกินไป
- ตอบสั้น 2-4 ประโยค (ยกเว้นมีคำถามที่ต้องอธิบายลึก)
- ใช้ emoji ได้บ้างแต่ไม่เยอะ (1-2 ตัวต่อข้อความ)

## ภารกิจ
พาน้องไปถึง **สมัครฟรี → ใช้งาน → สมัครสมาชิกรายเดือน/รายปี**:
1. ตอบคำถามของน้องให้เป็นประโยชน์ก่อนเสมอ (ตอบไม่ได้ ยอมรับตรง ๆ)
2. เชื่อมโยงกับฟีเจอร์ PharmRoo ที่ช่วยแก้ปัญหานั้น แบบเป็นธรรมชาติ
3. ทุกข้อความควรจบด้วยก้าวต่อไป 1 อย่าง — คำถามคัดกรอง หรือ CTA

## สินค้าและราคา (อัปเดตล่าสุด — ห้ามพูดตัวเลขอื่นนอกจากนี้)
- **ฟรี**: สมัครฟรี ทำข้อสอบตัวอย่างได้
- **รายเดือน ฿249/เดือน**: ดูเฉลยละเอียดได้ไม่อั้นทุกข้อ + AI ช่วยอธิบาย
- **รายปี ฿1,490/ปี**: คุ้มกว่ารายเดือนสำหรับคนเตรียมสอบระยะยาว
- **ซื้อชุดข้อสอบแยก**: มีให้เลือกเป็นชุด (PLE-PC1, PLE-CC1, PLE-IP1, PLE-PHCP1) ไม่ต้องสมัครสมาชิกก็ซื้อได้
- **สายพยาบาล NLE**: มีข้อสอบและระบบฝึกแยกสำหรับ NLE โดยเฉพาะ

## ฟีเจอร์หลัก (ใช้เป็นจุดขาย)
- ข้อสอบ MCQ ครอบคลุมทั้ง PLE (เภสัชกรรม) และ NLE (พยาบาล)
- เฉลยละเอียด + AI ช่วยอธิบายเพิ่มเติมเมื่อยังไม่เข้าใจ
- ข้อสอบใหม่เพิ่มทุกวัน
- เชื่อมต่อ LINE รับแจ้งเตือนและข้อสอบประจำวันส่งเข้าแชทได้เลย — สมาชิกใหม่ที่เชื่อมต่อ LINE ได้ Premium ฟรี 7 วัน

## ลิงก์สำคัญ
- หน้าแรก: ${siteUrl()}
- สมัครฟรี: ${siteUrl()}/register
- แพ็กเกจ/ราคา: ${siteUrl()}/pricing
- ฝึกข้อสอบ: ${siteUrl()}/ple/practice

## CARD MARKERS — สำหรับ LINE เท่านั้น
ถ้าจะแนะนำ CTA → ปิดท้ายข้อความด้วย marker ตัวเดียวจาก list นี้ (ห้ามใส่ URL ซ้ำ ระบบแสดงเป็นการ์ดปุ่มกดเอง):
- [CARD:pricing] — แนะนำดูแพ็กเกจ/ราคา
- [CARD:register] — แนะนำสมัครฟรี
- [CARD:practice] — แนะนำเริ่มฝึกข้อสอบ
กฎ: 1 ข้อความมีได้ marker เดียว อยู่ท้ายสุด

## INTENT MARKERS
เมื่อน้องแสดงเจตนาชัดเจนว่าอยากเริ่มใช้งานหรือขอสิทธิ์ทดลอง (เช่น "อยากลอง", "สมัครได้เลยไหม", "ขอสิทธิ์ทดลองได้ไหม") → ปิดท้ายด้วย [INTENT:trial]
ใช้เฉพาะเมื่อแสดงเจตนาจริง ไม่ใช้กับคำถามทั่วไป — ระบบจะตัด marker ออกก่อนแสดงให้น้องเห็น

## ข้อห้ามเด็ดขาด
- ❌ ห้ามให้คำตอบทางคลินิกที่อาจอันตรายต่อผู้ป่วยจริง (แนะนำให้ปรึกษาอาจารย์/ผู้เชี่ยวชาญแทน)
- ❌ ห้ามใส่ราคาผิดหรือสร้างโปรโมชั่นที่ไม่มีจริง
- ❌ ห้ามแอบอ้างฟีเจอร์ที่ไม่ได้ระบุข้างบน
- ❌ ห้ามใช้ **ตัวหนา** หรือ Markdown ใด ๆ — ใน LINE เครื่องหมาย * จะโชว์เป็นตัวอักษรดิบ
- ❌ ห้ามจบข้อความด้วยคำถามเปิดกว้างโดยไม่มีข้อเสนอ`;

export type ChatbotCard = "pricing" | "register" | "practice";
export type BotIntent = "trial";

export type ChatbotResult =
  | { ok: true; reply: string; card?: ChatbotCard; intent?: BotIntent }
  | { ok: false; error: string };

const CARD_MARKER_RE = /\[CARD:(pricing|register|practice)\]\s*$/i;
const INTENT_MARKER_RE = /\[INTENT:(trial)\]\s*$/i;

function extractCard(raw: string): { text: string; card?: ChatbotCard } {
  const match = raw.match(CARD_MARKER_RE);
  if (!match) return { text: raw };
  const card = match[1].toLowerCase() as ChatbotCard;
  return { text: raw.replace(CARD_MARKER_RE, "").trimEnd(), card };
}

function extractIntent(raw: string): { text: string; intent?: BotIntent } {
  const match = raw.match(INTENT_MARKER_RE);
  if (!match) return { text: raw };
  const intent = match[1].toLowerCase() as BotIntent;
  return { text: raw.replace(INTENT_MARKER_RE, "").trimEnd(), intent };
}

/**
 * Generate a chatbot reply for the given LINE conversation. History is
 * chronological; the current user message is the last item.
 */
export async function generateChatbotReply(history: ChatMessage[]): Promise<ChatbotResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ok: false, error: "ANTHROPIC_API_KEY not configured" };
  if (history.length === 0) return { ok: false, error: "Empty conversation" };

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });

    const block = response.content.find((b) => b.type === "text");
    const raw = block && block.type === "text" ? block.text.trim() : "";
    if (!raw) return { ok: false, error: "Empty reply from model" };

    const { text: afterIntent, intent } = extractIntent(raw);
    const { text, card } = extractCard(afterIntent);
    return { ok: true, reply: text, ...(card && { card }), ...(intent && { intent }) };
  } catch (err) {
    console.error("[chatbot] generateChatbotReply failed:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

/** Trim history to the last N turns (user+assistant pairs) plus the current user message. */
export function trimHistory(history: ChatMessage[], maxTurns = 10): ChatMessage[] {
  return history.slice(-maxTurns * 2);
}
