import Anthropic from "@anthropic-ai/sdk";
import type { BlogPost } from "@/lib/db/schema";

const client = new Anthropic();

export async function generateHook(post: Pick<BlogPost, "title" | "description" | "category">): Promise<string> {
  const prompt = `สร้าง hook สำหรับโพสต์ Facebook/Instagram จากบทความนี้:
ชื่อ: ${post.title}
คำอธิบาย: ${post.description ?? ""}
หมวดหมู่: ${post.category ?? "เภสัชศาสตร์"}

กฎ:
- ภาษาไทย กระชับ 1-2 ประโยค
- ดึงดูดนักศึกษาเภสัชหรือนักศึกษาพยาบาลที่เตรียมสอบ
- ต้องทำให้คนอยากคลิกอ่านต่อ
- ห้ามใช้ Markdown หรือ hashtag
- ตอบแค่ hook อย่างเดียว`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 150,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0]?.type === "text" ? response.content[0].text.trim() : post.title;
}
