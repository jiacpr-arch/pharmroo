import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { blogPosts, appSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getExistingTitles, getAllSlugs } from "@/lib/blog";
import { postToFacebook } from "@/lib/facebook";

export const runtime = "nodejs";
export const maxDuration = 120;

// Public-facing health & medicine topics (for the general public, not exam prep).
const PUBLIC_CATEGORIES: { name: string; emoji: string }[] = [
  { name: "ใช้ยาให้ถูก", emoji: "💊" },
  { name: "สุขภาพทั่วไป", emoji: "🩺" },
  { name: "โรคใกล้ตัว", emoji: "🤒" },
  { name: "กินดีอยู่ดี", emoji: "🥗" },
  { name: "สมุนไพรน่ารู้", emoji: "🌿" },
  { name: "สุขภาพใจ", emoji: "🧠" },
  { name: "ดูแลผู้สูงวัย", emoji: "👵" },
  { name: "ป้องกันก่อนป่วย", emoji: "🛡️" },
];

const ARTICLES_PER_RUN = 2;

const DISCLAIMER_HTML =
  '<div class="article-disclaimer">⚠️ บทความนี้จัดทำเพื่อให้ความรู้ทั่วไป ไม่ใช่คำวินิจฉัยหรือคำแนะนำเฉพาะบุคคล หากมีอาการผิดปกติ หรือมีข้อสงสัยเรื่องการใช้ยา ควรปรึกษาแพทย์หรือเภสัชกรก่อนเสมอ</div>';

const SITE_URL = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://pharmroo.com";

function isAuthorized(request: NextRequest): boolean {
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "health-article"
  );
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = slugify(base);
  if (!taken.has(slug)) return slug;
  let i = 2;
  while (taken.has(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}

function coverUrl(title: string, category: string, emoji: string): string {
  const q = new URLSearchParams({ title, cat: category, e: emoji });
  return `${SITE_URL()}/api/blog/cover?${q.toString()}`;
}

interface GeneratedArticle {
  title: string;
  slug: string;
  description: string;
  content: string;
}

async function generateArticle(
  anthropic: Anthropic,
  category: { name: string; emoji: string },
  avoidTitles: string[]
): Promise<GeneratedArticle | null> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 2200,
    system:
      "คุณเป็นเภสัชกรและนักสื่อสารสุขภาพ เขียนบทความสั้น กระชับ อ่านง่าย สำหรับ 'ประชาชนทั่วไป' " +
      "ใช้ภาษากันเองเหมือนคุยกับเพื่อน หลีกเลี่ยงศัพท์แพทย์ที่ยาก ถ้าจำเป็นต้องใช้ให้อธิบายสั้น ๆ " +
      "ข้อมูลต้องถูกต้องตามหลักการแพทย์ ไม่แนะนำขนาดยาเฉพาะเจาะจงที่อาจเป็นอันตราย " +
      "และกระตุ้นให้ปรึกษาแพทย์หรือเภสัชกรเมื่อเหมาะสม",
    messages: [
      {
        role: "user",
        content: `เขียนบทความสุขภาพ 1 บทความ หมวดหมู่: ${category.name}

หัวข้อที่เคยเขียนแล้ว (ห้ามซ้ำ/ใกล้เคียง): ${avoidTitles.slice(-25).join(", ") || "ยังไม่มี"}

ข้อกำหนด:
- เนื้อหาสั้น อ่าน 2-3 นาทีจบ (ประมาณ 250-400 คำ) เน้นเข้าใจง่าย ตัวหนังสือไม่เยอะ
- โครงสร้างให้อ่านสบายตา: เปิดด้วยย่อหน้านำสั้น 1-2 ประโยค, ตามด้วยหัวข้อย่อย <h2> 2-3 หัวข้อ (ขึ้นต้นด้วยอิโมจิ), ใช้ <ul><li> สรุปเป็นข้อ ๆ, เน้นคำสำคัญด้วย <strong>
- ปิดท้ายด้วย <blockquote> สรุปสั้นจำง่าย 1 ประโยค
- ห้ามใส่ <h1> และห้ามใส่รูป

ตอบเป็น JSON เท่านั้น (ห้ามมี markdown code fence):
{
  "title": "หัวข้อภาษาไทย ดึงดูด ไม่เกิน 60 ตัวอักษร",
  "slug": "english-url-slug",
  "description": "สรุป 1 ประโยคสั้น ๆ ดึงดูดให้อยากอ่าน",
  "content": "<p>...</p><h2>...</h2><ul><li>...</li></ul><blockquote>...</blockquote>"
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const data = JSON.parse(jsonMatch[0]) as GeneratedArticle;
    if (!data.title || !data.content) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Cron: AI Blog Generation — daily, public-facing health & medicine articles.
 * Generates ARTICLES_PER_RUN articles → save to DB (with branded cover) → post to Facebook.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not set" },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const existingTitles = await getExistingTitles();
  const takenSlugs = new Set(await getAllSlugs());
  const avoidTitles = [...existingTitles];

  // Pick distinct random categories for this run.
  const shuffled = [...PUBLIC_CATEGORIES].sort(() => Math.random() - 0.5);

  const created: { postId: string; title: string; slug: string }[] = [];
  const errors: string[] = [];

  for (let i = 0; i < ARTICLES_PER_RUN; i++) {
    const category = shuffled[i % shuffled.length];
    try {
      const data = await generateArticle(anthropic, category, avoidTitles);
      if (!data) {
        errors.push(`generation ${i} failed to parse`);
        continue;
      }

      const slug = uniqueSlug(data.slug || data.title, takenSlugs);
      takenSlugs.add(slug);
      avoidTitles.push(data.title);

      const cover = coverUrl(data.title, category.name, category.emoji);
      const content = data.content + DISCLAIMER_HTML;
      const postId = randomUUID();

      await db.insert(blogPosts).values({
        id: postId,
        slug,
        title: data.title,
        description: data.description,
        category: category.name,
        reading_time: Math.max(
          2,
          Math.ceil(data.content.replace(/<[^>]+>/g, " ").split(/\s+/).length / 200)
        ),
        content,
        cover_image: cover,
      });

      created.push({ postId, title: data.title, slug });

      // Post to Facebook as a photo (branded cover) with caption + link.
      const url = `${SITE_URL()}/blog/${slug}`;
      const tag = category.name.replace(/\s+/g, "");
      const message =
        `${category.emoji} ${data.title}\n\n` +
        `${data.description}\n\n` +
        `อ่านต่อ 👉 ${url}\n\n` +
        `#PharmRu #ฟาร์มรู้ #สุขภาพ #ความรู้เรื่องยา #${tag}`;

      await postToFacebook({
        message,
        imageUrl: cover,
        getUserToken: async () => {
          const row = await db
            .select({ value: appSettings.value })
            .from(appSettings)
            .where(eq(appSettings.key, "facebook_user_token"))
            .then((rows) => rows[0]);
          return row?.value || process.env.FACEBOOK_USER_TOKEN || "";
        },
        saveUserToken: async (token: string) => {
          await db
            .insert(appSettings)
            .values({
              key: "facebook_user_token",
              value: token,
              updated_at: new Date().toISOString(),
            })
            .onConflictDoUpdate({
              target: appSettings.key,
              set: { value: token, updated_at: new Date().toISOString() },
            });
        },
      }).catch((err) => console.error("[blog] Facebook post failed:", err));
    } catch (err) {
      console.error(`[blog-generate] article ${i} error:`, err);
      errors.push(String(err));
    }
  }

  return NextResponse.json({
    ok: created.length > 0,
    created,
    errors: errors.length ? errors : undefined,
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
