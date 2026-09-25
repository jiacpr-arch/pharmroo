import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SUBJECT_CONFIGS, generateMcqBatch } from "@/lib/ai/generate-mcq";

export const maxDuration = 300; // Pro plan: up to 300s

// Each generateMcqBatch() call asks for this many questions in a single
// Claude response (max_tokens: 8000). Detailed explanations run large, so a
// single call for a subject's full daily quota (e.g. 100 for PC1) would
// overflow max_tokens and get truncated mid-JSON. Chunk into calls this size
// instead and run them in parallel.
const MAX_QUESTIONS_PER_CALL = 10;

/**
 * GET /api/cron/generate-daily  (Vercel Cron)
 * POST /api/cron/generate-daily (manual trigger)
 *
 * Generates new MCQ questions daily, with separate quotas per exam category:
 * PLE-CC1 (pharmacy), PLE-PC (PC1 / pharmaceutical care), and NLE (nursing).
 * Secured by CRON_SECRET environment variable.
 *
 * Optional JSON body (POST only):
 *   { "pharmacy_total": 12, "pc1_total": 100, "nursing_total": 5 }
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
  let pharmacyTotal = 50;
  let pc1Total = 100;
  let nursingTotal = 50;
  try {
    const body = await req.json().catch(() => ({}));
    if (typeof body.pharmacy_total === "number") {
      pharmacyTotal = Math.max(0, Math.min(100, body.pharmacy_total));
    }
    if (typeof body.pc1_total === "number") {
      pc1Total = Math.max(0, Math.min(100, body.pc1_total));
    }
    if (typeof body.nursing_total === "number") {
      nursingTotal = Math.max(0, Math.min(100, body.nursing_total));
    }
  } catch {
    // use defaults
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

  // ── Build per-category job lists ─────────────────────────────────────────────
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );

  // PLE-CC1 pharmacy subjects share pharmacyTotal; PLE-PC (PC1) gets its own
  // dedicated pool/quota so it's never diluted by how many other subjects exist.
  const pharmacyPool = SUBJECT_CONFIGS.filter(
    (s) => s.exam_type === "PLE-CC1" && subjectIdMap[s.name]
  );
  const pc1Pool = SUBJECT_CONFIGS.filter(
    (s) => s.exam_type === "PLE-PC" && subjectIdMap[s.name]
  );
  const nursingPool = SUBJECT_CONFIGS.filter(
    (s) => s.exam_type === "NLE" && subjectIdMap[s.name]
  );

  function pickJobs(pool: typeof SUBJECT_CONFIGS, total: number) {
    if (pool.length === 0 || total === 0) return [];
    const perSubject = Math.floor(total / pool.length);
    const remainder = total % pool.length;
    return pool.map((subject, i) => ({
      subject,
      count: perSubject + (i < remainder ? 1 : 0),
    })).filter(j => j.count > 0);
  }

  const allJobs = [
    ...pickJobs(pharmacyPool, pharmacyTotal),
    ...pickJobs(pc1Pool, pc1Total),
    ...pickJobs(nursingPool, nursingTotal),
  ];

  if (allJobs.length === 0) {
    return NextResponse.json({ error: "No matching subjects in DB" }, { status: 500 });
  }

  // Split any job larger than MAX_QUESTIONS_PER_CALL into several smaller
  // Claude calls, each with its own batchIndex so prompt topic rotation
  // still varies call-to-call within the same subject/day.
  const callJobs: { subject: (typeof SUBJECT_CONFIGS)[number]; count: number; batchIndex: number }[] = [];
  for (const { subject, count } of allJobs) {
    let remaining = count;
    let batchOffset = 0;
    while (remaining > 0) {
      const batchCount = Math.min(MAX_QUESTIONS_PER_CALL, remaining);
      callJobs.push({ subject, count: batchCount, batchIndex: dayOfYear + batchOffset });
      remaining -= batchCount;
      batchOffset++;
    }
  }

  // ── Generate all calls in parallel ───────────────────────────────────────────
  const generated = await Promise.all(
    callJobs.map(async ({ subject, count, batchIndex }) => {
      const subjectId = subjectIdMap[subject.name];
      try {
        const questions = await generateMcqBatch(subject, subjectId, count, batchIndex);
        return { subject, subjectId, questions };
      } catch (err) {
        console.error(`[cron] generate failed for ${subject.name}:`, err);
        return { subject, subjectId, questions: [] };
      }
    })
  );

  // Merge per-subject: a subject can now have multiple call results (one per batch).
  const bySubject = new Map<string, { subject: (typeof SUBJECT_CONFIGS)[number]; questions: Awaited<ReturnType<typeof generateMcqBatch>> }>();
  for (const { subject, questions } of generated) {
    const existing = bySubject.get(subject.name);
    if (existing) {
      existing.questions.push(...questions);
    } else {
      bySubject.set(subject.name, { subject, questions: [...questions] });
    }
  }

  // ── Insert results ────────────────────────────────────────────────────────────
  const results: { subject: string; generated: number; inserted: number }[] = [];
  let totalInserted = 0;

  for (const { subject, questions } of bySubject.values()) {
    if (questions.length === 0) {
      results.push({ subject: subject.name, generated: 0, inserted: 0 });
      continue;
    }

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
    quotas: { pharmacy: pharmacyTotal, pc1: pc1Total, nursing: nursingTotal },
    subjects: results,
  });
}

// Vercel Cron sends GET — manual trigger uses POST
export const GET = handler;
export const POST = handler;
