import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, inArray, isNull } from "drizzle-orm";
import { broadcastLineMessages, checkLineQuota } from "@/lib/line";
import { buildBlogDigestCarousel } from "@/lib/line-flex-templates";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest): boolean {
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Cron (weekly): broadcasts a carousel of blog posts published since the
 * last broadcast to every OA follower, gated behind LINE_AUTOPOST_ENABLED so
 * it can be turned off without a redeploy. Posts are marked
 * line_broadcast_at on success so a re-run only picks up new ones.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.LINE_AUTOPOST_ENABLED !== "true") {
    return NextResponse.json({ ok: true, skipped: "autopost_disabled" });
  }

  const quota = await checkLineQuota();
  if (quota.throttled) {
    return NextResponse.json({ ok: true, skipped: "quota_throttled" });
  }

  const unbroadcast = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      description: blogPosts.description,
      cover_image: blogPosts.cover_image,
    })
    .from(blogPosts)
    .where(isNull(blogPosts.line_broadcast_at))
    .orderBy(desc(blogPosts.published_at))
    .limit(10);

  if (unbroadcast.length === 0) {
    return NextResponse.json({ ok: true, broadcast: 0 });
  }

  const result = await broadcastLineMessages([buildBlogDigestCarousel(unbroadcast)]);
  const ids = unbroadcast.map((p) => p.id);

  if (result.ok) {
    await db
      .update(blogPosts)
      .set({ line_broadcast_at: new Date().toISOString(), line_last_error: null })
      .where(inArray(blogPosts.id, ids));
    return NextResponse.json({ ok: true, broadcast: unbroadcast.length });
  }

  await db
    .update(blogPosts)
    .set({ line_last_error: (result.error ?? "unknown error").slice(0, 500) })
    .where(inArray(blogPosts.id, ids));
  console.error("[line-weekly-blog-digest] broadcast failed:", result.error);
  return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
}
