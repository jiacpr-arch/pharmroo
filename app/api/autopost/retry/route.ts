import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, appSettings } from "@/lib/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { postToFacebook } from "@/lib/facebook";
import { postToInstagram } from "@/lib/instagram";
import { buildBlogAnnounceFlex } from "@/lib/line-flex-templates";
import { broadcastLineMessages } from "@/lib/line";
import { generateHook } from "@/lib/autopost-copy";
import { pickAutopostFormat, categoryHashtag } from "@/lib/autopost-format";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCron(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = request.nextUrl.searchParams.get("secret");
  return (
    auth === `Bearer ${process.env.CRON_SECRET}` ||
    secret === process.env.BLOG_GENERATE_SECRET
  );
}

async function getUserToken(): Promise<string> {
  const stored = await db
    .select({ value: appSettings.value })
    .from(appSettings)
    .where(eq(appSettings.key, "facebook_user_token"))
    .then((r) => r[0]?.value);
  return stored ?? process.env.FACEBOOK_USER_TOKEN ?? "";
}

async function saveUserToken(token: string): Promise<void> {
  await db
    .insert(appSettings)
    .values({ key: "facebook_user_token", value: token })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value: token, updated_at: new Date().toISOString().replace("T", " ").slice(0, 19) },
    });
}

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") ?? "all";
  const slug = searchParams.get("slug");
  const limit = parseInt(searchParams.get("limit") ?? "1", 10);

  // Build query — pick 1 article with pending post per platform
  const postResults: Record<string, string> = {};

  const pending = await db
    .select()
    .from(blogPosts)
    .where(
      slug
        ? eq(blogPosts.slug, slug)
        : (platform === "fb" || platform === "all")
          ? isNull(blogPosts.fb_post_id)
          : isNull(blogPosts.ig_media_id)
    )
    .orderBy(desc(blogPosts.published_at))
    .limit(limit);

  for (const post of pending) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pharmroo.com";
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const hashtags = categoryHashtag(post.category);
    const hook = await generateHook(post).catch(() => post.title);
    const format = post.autopost_format ?? (await pickAutopostFormat());
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);

    // Facebook
    if ((platform === "fb" || platform === "all") && !post.fb_post_id) {
      let message = `${hook}\n\n${hashtags}`;
      if (format !== "quote_card") message += `\n\n${postUrl}`;

      const fbResult = await postToFacebook({
        message,
        link: format === "link_only" ? postUrl : undefined,
        imageUrl: format === "cover_caption" && post.cover_image ? post.cover_image : undefined,
        getUserToken,
        saveUserToken,
      });

      if (fbResult.ok) {
        await db
          .update(blogPosts)
          .set({ fb_post_id: fbResult.postId, fb_posted_at: now, autopost_format: format, fb_last_error: null })
          .where(eq(blogPosts.id, post.id));
        postResults[`fb:${post.slug}`] = "ok";
      } else {
        await db
          .update(blogPosts)
          .set({ fb_last_error: fbResult.error })
          .where(eq(blogPosts.id, post.id));
        postResults[`fb:${post.slug}`] = fbResult.error ?? "error";
      }
    }

    // LINE
    if ((platform === "line" || platform === "all") && !post.line_broadcast_at) {
      try {
        const flex = buildBlogAnnounceFlex({
          title: post.title,
          description: post.description ?? "",
          url: postUrl,
          imageUrl: post.cover_image ?? undefined,
        });
        await broadcastLineMessages([flex]);
        await db
          .update(blogPosts)
          .set({ line_broadcast_at: now, line_last_error: null })
          .where(eq(blogPosts.id, post.id));
        postResults[`line:${post.slug}`] = "ok";
      } catch (err) {
        await db
          .update(blogPosts)
          .set({ line_last_error: String(err) })
          .where(eq(blogPosts.id, post.id));
        postResults[`line:${post.slug}`] = String(err);
      }
    }

    // Instagram
    if ((platform === "ig" || platform === "all") && !post.ig_media_id && post.cover_image) {
      const caption = `${hook}\n\n${hashtags}\n\n${postUrl}`;
      const igResult = await postToInstagram({
        imageUrl: post.cover_image,
        caption,
        getUserToken,
        saveUserToken,
      });

      if (igResult.ok) {
        await db
          .update(blogPosts)
          .set({ ig_media_id: igResult.mediaId, ig_posted_at: now, ig_last_error: null })
          .where(eq(blogPosts.id, post.id));
        postResults[`ig:${post.slug}`] = "ok";
      } else {
        await db
          .update(blogPosts)
          .set({ ig_last_error: igResult.error })
          .where(eq(blogPosts.id, post.id));
        postResults[`ig:${post.slug}`] = igResult.error ?? "error";
      }
    }
  }

  return NextResponse.json({ ok: true, results: postResults });
}
