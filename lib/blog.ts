import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getBlogPosts(limit = 20) {
  return db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.published_at))
    .limit(limit);
}

export async function getBlogPost(slug: string) {
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .then((rows) => rows[0] ?? null);
}

export async function getAllSlugs() {
  return db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .then((rows) => rows.map((r) => r.slug));
}

export async function getExistingTitles() {
  return db
    .select({ title: blogPosts.title })
    .from(blogPosts)
    .then((rows) => rows.map((r) => r.title));
}
