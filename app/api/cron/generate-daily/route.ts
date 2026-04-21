import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SUBJECT_CONFIGS, generateMcqBatch } from "@/lib/ai/generate-mcq";

export const maxDuration = 300; // Pro plan: up to 300s

/**
 * GET /api/cron/generate-daily  (Vercel Cron)
 * POST /api/cron/generate-daily (manual trigger)
 *
 * Generates new MCQ questions daily, with separate quotas per exam category.
 * Secured by CRON_SECRET environment variable.
 *
 * Optional JSON body (POST only):
 *   { "pharmacy_total": 12, "nursing_total": 5 }
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
  let pharmacyTotal = 12;
  let nursingTotal = 5;
  try {
    const body = await req.json().catch(() => ({}));
    if (typeof body.pharmacy_total === "number") {
      pharmacyTotal = Math.max(0, Math.min(20, body.pharmacy_total));
    }
    if (typeof body.nursing_total === "number") {
      nursingTotal = Math.max(0, Math.min(20, body.nursing_total));
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

  const pharmacyPool = SUBJECT_CONFIGS.filter(
    (s) => s.exam_type !== "NLE" && subjectIdMap[s.name]
  );
  const nursingPool = SUBJECT_CONFIGS.filter(
    (s) => s.exam_type === "NLE" && subjectIdMap[s.name]
  );

  function pickJobs(pool: typeof SUBJECT_CONFIGS, total: number, offset: number) {
    if (pool.length === 0 || total === 0) return [];
    const num = Math.min(3, pool.length);
    const picked = Array.from({ length: num }, (_, i) =>
      pool[(dayOfYear + offset + i) % pool.length]
    );
    const perSubject = Math.ceil(total / num);
    return picked.map((subject, i) => ({
      subject,
      count: i < num - 1 ? perSubject : total - perSubject * i,
    }));
  }

  const allJobs = [
    ...pickJobs(pharmacyPool, pharmacyTotal, 0),
    ...pickJobs(nursingPool, nursingTotal, 100),
  ];

  if (allJobs.length === 0) {
    return NextResponse.json({ error: "No matching subjects in DB" }, { status: 500 });
  }

  // ── Generate all jobs in parallel ────────────────────────────────────────────
  const generated = await Promise.all(
    allJobs.map(async ({ subject, count }) => {
      const subjectId = subjectIdMap[subject.name];
      try {
        const questions = await generateMcqBatch(subject, subjectId, Math.max(1, count), dayOfYear);
        return { subject, subjectId, questions };
      } catch (err) {
        console.error(`[cron] generate failed for ${subject.name}:`, err);
        return { subject, subjectId, questions: [] };
      }
    })
  );

  // ── Insert results ────────────────────────────────────────────────────────────
  const results: { subject: string; generated: number; inserted: number }[] = [];
  let totalInserted = 0;

  for (const { subject, questions } of generated) {
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
    quotas: { pharmacy: pharmacyTotal, nursing: nursingTotal },
    subjects: results,
  });
}

// Vercel Cron sends GET — manual trigger uses POST
export const GET = handler;
export const POST = handler;
