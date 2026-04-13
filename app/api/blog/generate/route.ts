import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { blogPosts, appSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getExistingTitles } from "@/lib/blog";
import { postToFacebook } from "@/lib/facebook";

export const runtime = "nodejs";
export const maxDuration = 120;

const BLOG_CATEGORIES = [
  "เภสัชวิทยา",
  "เคมีของยา",
  "กฎหมายยา",
  "สมุนไพร",
  "เทคนิคการสอบ",
  "ข่าวสารวงการเภสัช",
];

const SITE_URL = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://pharmroo.com";

function isAuthorized(request: NextRequest): boolean {
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron: AI Blog Generation — 2x/week (Tue + Fri).
 * Generate article with Claude Sonnet → save to DB → post to Facebook.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey });

  // Get existing titles to avoid duplicates
  const existingTitles = await getExistingTitles();
  const category =
    BLOG_CATEGORIES[Math.floor(Math.random() * BLOG_CATEGORIES.length)];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `คุณเป็นเภสัชกรผู้เชี่ยวชาญ เขียนบทความสำหรับเว็บ PharmRoo (เว็บข้อสอบเภสัชกรรม)

หมวดหมู่: ${category}
บทความที่เขียนไปแล้ว (ห้ามซ้ำ): ${existingTitles.slice(-20).join(", ") || "ยังไม่มี"}

สร้างบทความ 1 บทความ ตอบเป็น JSON เท่านั้น:
{
  "title": "หัวข้อบทความ (ภาษาไทย ดึงดูด)",
  "slug": "url-slug-in-english",
  "description": "คำอธิบายสั้น 1-2 ประโยค",
  "content": "เนื้อหา HTML 600-900 คำ ใช้ <h2> <h3> <p> <ul> <li> <strong>"
}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const data = JSON.parse(jsonMatch[0]) as {
      title: string;
      slug: string;
      description: string;
      content: string;
    };

    const postId = randomUUID();
    await db.insert(blogPosts).values({
      id: postId,
      slug: data.slug,
      title: data.title,
      description: data.description,
      category,
      reading_time: Math.max(3, Math.ceil(data.content.split(/\s+/).length / 200)),
      content: data.content,
    });

    // Post to Facebook (non-blocking)
    postToFacebook({
      message: `${data.title}\n\n${data.description}\n\n${SITE_URL()}/blog/${data.slug}`,
      link: `${SITE_URL()}/blog/${data.slug}`,
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

    return NextResponse.json({
      ok: true,
      postId,
      title: data.title,
      slug: data.slug,
    });
  } catch (err) {
    console.error("[blog-generate] error:", err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
