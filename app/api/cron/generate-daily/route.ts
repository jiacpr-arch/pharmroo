import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SUBJECT_CONFIGS, generateMcqBatch } from "@/lib/ai/generate-mcq";

/**
 * GET /api/cron/generate-daily  (Vercel Cron)
 * POST /api/cron/generate-daily (manual trigger)
 *
 * Generates 10–20 mixed-subject MCQ questions per day and saves them to Supabase.
 * Secured by CRON_SECRET environment variable.
 *
 * Optional JSON body (POST only):
 *   { "total": 15 }   — override total question count (default 15, min 10, max 20)
 */
async function handler(req: Request) {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse options ─────────────────────────────────────────────────────────────
  let total = 15;
  try {
    const body = await req.json().catch(() => ({}));
    if (typeof body.total === "number") {
      total = Math.max(10, Math.min(20, body.total));
    }
  } catch {
    // use default
  }

  // ── Load subject IDs from Supabase ────────────────────────────────────────────
  const supabase = createAdminClient();
  const { data: dbSubjects, error: subErr } = await supabase
    .from("mcq_subjects")
    .select("id, name");

  if (subErr || !dbSubjects) {
    return NextResponse.json(
      { error: "Failed to load subjects", detail: subErr?.message },
      { status: 500 }
    );
  }

  const subjectIdMap: Record<string, string> = {};
  for (const s of dbSubjects) subjectIdMap[s.name] = s.id;

  // ── Pick subjects for today ───────────────────────────────────────────────────
  // Rotate deterministically by day-of-year so each day covers different subjects
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );

  const available = SUBJECT_CONFIGS.filter((s) => subjectIdMap[s.name]);
  if (available.length === 0) {
    return NextResponse.json({ error: "No matching subjects in DB" }, { status: 500 });
  }

  // Pick 3 subjects (wrapping around), distribute questions evenly
  const numSubjects = Math.min(3, available.length);
  const picked = Array.from({ length: numSubjects }, (_, i) =>
    available[(dayOfYear + i) % available.length]
  );

  const perSubject = Math.ceil(total / numSubjects);

  // ── Generate & insert ─────────────────────────────────────────────────────────
  const results: { subject: string; generated: number; inserted: number }[] = [];
  let totalInserted = 0;

  for (let i = 0; i < picked.length; i++) {
    const subject = picked[i];
    const subjectId = subjectIdMap[subject.name];
    const count = i < picked.length - 1 ? perSubject : total - perSubject * i;

    let questions;
    try {
      questions = await generateMcqBatch(subject, subjectId, Math.max(1, count), dayOfYear);
    } catch (err) {
      console.error(`[cron] generate failed for ${subject.name}:`, err);
      results.push({ subject: subject.name, generated: 0, inserted: 0 });
      continue;
    }

    if (questions.length === 0) {
      results.push({ subject: subject.name, generated: 0, inserted: 0 });
      continue;
    }

    // Insert in chunks of 10
    let inserted = 0;
    for (let j = 0; j < questions.length; j += 10) {
      const chunk = questions.slice(j, j + 10);
      const { error } = await supabase.from("mcq_questions").insert(chunk);
      if (error) {
        console.error(`[cron] insert error at ${subject.name}[${j}]:`, error.message);
        break;
      }
      inserted += chunk.length;
    }

    totalInserted += inserted;
    results.push({ subject: subject.name, generated: questions.length, inserted });
  }

  return NextResponse.json({
    date: new Date().toISOString().slice(0, 10),
    total_inserted: totalInserted,
    subjects: results,
  });
}

// Vercel Cron sends GET — manual trigger uses POST
export const GET = handler;
export const POST = handler;
