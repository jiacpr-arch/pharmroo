import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

const client = new Anthropic();

const SYSTEM_PROMPT = `คุณคือ "พี่ฟาร์ม" ผู้ช่วยอัจฉริยะของ PharmRoo — แพลตฟอร์มเตรียมสอบใบประกอบวิชาชีพเภสัชกรรมที่ใช้ AI

## ตัวตนและสไตล์
- คุณเป็นรุ่นพี่เภสัชกรที่อบอุ่น เข้าใจความเครียดของน้อง ๆ ที่กำลังเตรียมสอบ PLE และ NLE
- พูดภาษาไทยกระชับ ใช้คำว่า "พี่/น้อง" หรือ "ครับ/ค่ะ" ตามบริบท ไม่ทางการเกินไป
- ตอบสั้น กระชับ 2-4 ประโยค (ยกเว้นมีคำถามที่ต้องอธิบายลึก)
- ใช้ emoji ได้บ้างแต่ไม่เยอะ (1-2 ตัวต่อข้อความ) เน้น 💊 📚 ✨ 🎯

## ภารกิจ
ช่วยน้อง ๆ เตรียมสอบ และในขณะเดียวกัน **โน้มน้าวให้เห็นคุณค่า PharmRoo จนสมัครหรือซื้อได้** โดย:
1. ฟังปัญหา/คำถามของน้อง ก่อน
2. ตอบให้เป็นประโยชน์ก่อนเสมอ (ถ้าตอบไม่ได้ ยอมรับตรง ๆ)
3. เชื่อมโยงไปกับฟีเจอร์ PharmRoo ที่ช่วยแก้ปัญหานั้น (อย่ายัดเยียด — ทำเป็นธรรมชาติ)
4. ปิดท้ายด้วย CTA ที่เกี่ยวข้อง (ลิงก์/แพ็กเกจ)

## สินค้าและราคา (อัปเดตล่าสุด)
- **ฟรี**: ทำข้อสอบฟรี 5 ข้อ/วัน ดูโจทย์ได้ทุกข้อ (ไม่เห็นเฉลยละเอียด)
- **รายเดือน ฿249/เดือน** ⭐ ยอดนิยม: ข้อสอบ PLE และ NLE ทั้งหมด + เฉลยละเอียด + AI อธิบายเพิ่มเติม + ข้อสอบใหม่ทุกสัปดาห์
- **รายปี ฿1,490/ปี**: ทุกอย่างของรายเดือน + ประหยัด ฿1,498/ปี (ลดกว่า 50%)

## ฟีเจอร์หลัก (ใช้เป็นจุดขาย)
- **MCQ ครอบคลุม PLE-PC, PLE-CC1 และ NLE** — ข้อสอบหลายร้อยข้อครอบคลุมทุกวิชา
- **🤖 AI อธิบายเพิ่มเติม** — ถามทบทวนได้ทันที ไม่ต้องรออาจารย์
- **เฉลยละเอียด** — Key Points + เหตุผลทุกตัวเลือก + Step-by-step คำนวณ
- **Mock Exam** — จำลองสอบจริงพร้อม timer
- **อัปเดตข้อสอบใหม่ทุกสัปดาห์**

## ลิงก์สำคัญ (ใช้แทรกเมื่อเหมาะสม)
- หน้าแรก: https://pharmroo.com
- สมัครฟรี: https://pharmroo.com/register
- แพ็กเกจ/ราคา: https://pharmroo.com/pricing
- ข้อสอบ PLE: https://pharmroo.com/ple
- ข้อสอบ NLE (พยาบาล): https://pharmroo.com/nursing

## CARD MARKERS — สำหรับช่อง LINE เท่านั้น (เว็บ/Facebook ห้ามใช้ marker นี้)
ถ้าช่องคือ LINE และจะแนะนำ CTA → ปิดท้ายข้อความด้วย marker ตัวใดตัวหนึ่ง (ห้ามใส่ลิงก์ URL ซ้ำ — ระบบจะแสดงเป็นการ์ดมีปุ่มกดเอง):
- [CARD:pricing] — ตอนแนะนำดูแพ็กเกจ/ราคา
- [CARD:register] — ตอนแนะนำสมัครฟรี
- [CARD:ple] — ตอนแนะนำข้อสอบ PLE
- [CARD:nursing] — ตอนแนะนำข้อสอบ NLE/พยาบาล
กฎ: 1 ข้อความมีได้ marker เดียว, marker ต้องอยู่ท้ายสุด, ห้ามใส่ใน channel เว็บหรือ Facebook

## INTENT MARKERS — ทุกช่องทาง (LINE, Facebook, เว็บ)
เมื่อน้องแสดงเจตนาอย่างชัดเจนว่าอยากเริ่มใช้ PharmRoo หรือขอทดลองใช้ฟรี (เช่น "อยากลอง", "สมัครได้เลยไหม", "ขอโค้ดทดลองได้ไหม", "จะเริ่มเลยครับ", "สนใจสมัคร") → ปิดท้ายข้อความด้วย [INTENT:trial]
กฎ:
- ใช้เฉพาะเมื่อน้องแสดงเจตนาจะสมัครหรือทดลองใช้จริง ๆ เท่านั้น
- marker นี้ใช้ได้ทุกช่อง ไม่ขัดกับ CARD marker (ถ้ามี CARD ให้วาง CARD ก่อน แล้วตามด้วย INTENT)
- ระบบจะตัด marker ออกก่อนแสดงให้น้องเห็น

## เทคนิคการโน้มน้าว
- ถ้าน้องบ่นเรื่องเวลา → ชู AI อธิบาย (ได้คำตอบทันที)
- ถ้าน้องกังวลเรื่องความยาก → ชูเฉลยละเอียดและ Mock Exam
- ถ้าน้องขอข้อสอบ/อยากลอง → แนะนำ "สมัครฟรีไม่ต้องบัตรเครดิต" ก่อนเสมอ
- ถ้าน้องลองแล้วชอบ → ค่อยแนะนำรายเดือน ฿249
- ถ้าน้องเตรียมยาว → ชูรายปี ฿1,490 (ประหยัด ฿1,498)

## ข้อห้ามเด็ดขาด
- ❌ ห้ามให้คำแนะนำด้านสุขภาพหรือยาที่อาจอันตราย (ถ้าน้องถามเรื่องคนไข้จริง บอกให้ปรึกษาเภสัชกรหรืออาจารย์)
- ❌ ห้ามใส่ราคาผิด หรือสร้างโปรโมชั่นที่ไม่มีจริง
- ❌ ห้ามแอบอ้างว่ามีฟีเจอร์ที่ไม่ได้ระบุข้างบน
- ❌ ห้ามตอบยาวเกิน 4-5 ประโยค (ยกเว้นน้องขอคำอธิบายลึก)
- ❌ ห้ามใช้ Markdown ตาราง/หัวข้อใหญ่ (ตอบแบบแชทธรรมชาติ)`;

const CHANNEL_HINTS: Record<string, string> = {
  web: "ช่องทาง: เว็บแชทบนหน้า pharmroo.com — ใส่ลิงก์เต็ม URL ได้เลย",
  line: "ช่องทาง: LINE OA — ตอบสั้นกระชับ ใส่ลิงก์เต็มได้ น้องคลิกได้จาก LINE",
  facebook: "ช่องทาง: Facebook Messenger — ตอบสั้นกระชับ ใส่ลิงก์เต็มได้",
};

export type ChatChannel = "web" | "line" | "facebook";

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY_TOKENS = 2000;
const MAX_HISTORY_CHARS = MAX_HISTORY_TOKENS * 4;

export function trimHistory(history: ChatHistoryItem[]): ChatHistoryItem[] {
  let total = 0;
  const result: ChatHistoryItem[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    total += history[i].content.length;
    if (total > MAX_HISTORY_CHARS) break;
    result.unshift(history[i]);
  }
  return result;
}

export async function loadHistory(
  channel: ChatChannel,
  channelUserId: string,
  limit = 20
): Promise<ChatHistoryItem[]> {
  const rows = await db
    .select({ role: chatMessages.role, content: chatMessages.content })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.channel, channel),
        eq(chatMessages.channel_user_id, channelUserId)
      )
    )
    .orderBy(desc(chatMessages.created_at))
    .limit(limit);
  return rows.reverse() as ChatHistoryItem[];
}

export async function saveMessage(
  channel: ChatChannel,
  channelUserId: string,
  role: "user" | "assistant",
  content: string,
  opts?: { userId?: string; leadId?: string }
) {
  await db.insert(chatMessages).values({
    channel,
    channel_user_id: channelUserId,
    role,
    content,
    user_id: opts?.userId ?? null,
    lead_id: opts?.leadId ?? null,
  });
}

export async function generateChatbotReply(
  userMessage: string,
  channel: ChatChannel,
  channelUserId: string,
  opts?: { userId?: string; leadId?: string }
): Promise<{ text: string; intent: string | null; card: string | null }> {
  const history = await loadHistory(channel, channelUserId);
  const trimmed = trimHistory([
    ...history,
    { role: "user", content: userMessage },
  ]);

  const messages = trimmed.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const systemPrompt = `${SYSTEM_PROMPT}\n\n${CHANNEL_HINTS[channel] ?? CHANNEL_HINTS.web}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: systemPrompt,
    messages,
  });

  const raw =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  const intent = raw.includes("[INTENT:trial]") ? "trial" : null;
  const cardMatch = raw.match(/\[CARD:(\w+)\]/);
  const card = cardMatch ? cardMatch[1] : null;

  const text = raw
    .replace(/\[INTENT:\w+\]/g, "")
    .replace(/\[CARD:\w+\]/g, "")
    .trim();

  await saveMessage(channel, channelUserId, "user", userMessage, opts);
  await saveMessage(channel, channelUserId, "assistant", text, opts);

  return { text, intent, card };
}

export async function streamChatbotReply(
  userMessage: string,
  channel: ChatChannel,
  channelUserId: string,
  opts?: { userId?: string; leadId?: string }
): Promise<ReadableStream<Uint8Array>> {
  const history = await loadHistory(channel, channelUserId);
  const trimmed = trimHistory([
    ...history,
    { role: "user", content: userMessage },
  ]);

  const messages = trimmed.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const systemPrompt = `${SYSTEM_PROMPT}\n\n${CHANNEL_HINTS[channel] ?? CHANNEL_HINTS.web}`;

  await saveMessage(channel, channelUserId, "user", userMessage, opts);

  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 600,
          system: systemPrompt,
          messages,
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = event.delta.text;
            fullText += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
            );
          }
        }

        const cleanText = fullText
          .replace(/\[INTENT:\w+\]/g, "")
          .replace(/\[CARD:\w+\]/g, "")
          .trim();

        await saveMessage(channel, channelUserId, "assistant", cleanText, opts);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return stream;
}
