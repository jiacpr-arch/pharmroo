// One-off / manual blog post publisher.
//
// There is no admin UI for blog_posts (posts are normally created by the
// AI cron job at app/api/blog/generate/route.ts). This script lets you
// publish a hand-written post the same way: a JSON file with
// { slug, title, description, category, content } — content is raw HTML
// using only <h2> <h3> <p> <ul> <li> <strong>, matching the convention
// the frontend (app/blog/[slug]/page.tsx) renders via
// dangerouslySetInnerHTML inside a `prose` wrapper.
//
// Usage:
//   DATABASE_URL=postgres://... node scripts/publish-blog-post.mjs scripts/blog-posts/<file>.json
//   node scripts/publish-blog-post.mjs scripts/blog-posts/<file>.json --dry-run
//
// --dry-run validates the JSON and prints what would be inserted without
// touching the database (no DATABASE_URL required).

import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const file = args.find((a) => !a.startsWith("--"));

if (!file) {
  console.error("Usage: node scripts/publish-blog-post.mjs <path-to-post.json> [--dry-run]");
  process.exit(1);
}

const post = JSON.parse(readFileSync(file, "utf8"));

for (const field of ["slug", "title", "content"]) {
  if (!post[field] || typeof post[field] !== "string") {
    console.error(`Post JSON is missing required string field: ${field}`);
    process.exit(1);
  }
}
if (!/^[a-z0-9-]+$/.test(post.slug)) {
  console.error(`slug "${post.slug}" should be lowercase letters, digits and hyphens only.`);
  process.exit(1);
}

// Same formula as app/api/blog/generate/route.ts, so reading_time stays
// consistent with AI-generated posts.
const readingTime =
  post.reading_time ?? Math.max(3, Math.ceil(post.content.split(/\s+/).length / 200));

if (dryRun) {
  console.log("Dry run — nothing written. Would insert:");
  console.log(
    JSON.stringify(
      { ...post, reading_time: readingTime, id: "<generated>", published_at: "<now>" },
      null,
      2
    )
  );
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL env var (see lib/db/index.ts — same var the app uses).");
  process.exit(1);
}

const { Pool } = await import("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const existing = await pool.query("SELECT id FROM blog_posts WHERE slug = $1", [post.slug]);
  if (existing.rows.length > 0) {
    console.error(`A post with slug "${post.slug}" already exists (id ${existing.rows[0].id}). Aborting.`);
    process.exit(1);
  }

  const id = randomUUID();
  await pool.query(
    `INSERT INTO blog_posts (id, slug, title, description, category, reading_time, content, cover_image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      post.slug,
      post.title,
      post.description ?? null,
      post.category ?? null,
      readingTime,
      post.content,
      post.cover_image ?? null,
    ]
  );

  console.log(`Published "${post.title}" as /blog/${post.slug} (id ${id}, ~${readingTime} min read).`);
} finally {
  await pool.end();
}
