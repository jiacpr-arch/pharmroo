import Anthropic from "@anthropic-ai/sdk";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  landingPages,
  optimizationRuns,
  pageVariants,
} from "@/lib/db/schema";
import type { LandingPage } from "@/lib/db/schema";
import { validateProposal } from "./guardrails";
import type { Proposal } from "./guardrails";
import type { AggregatedMetrics, DetectionFlag } from "./detect";

const MODEL = "claude-opus-4-7";

interface RunRow {
  id: string;
  landing_page_id: string;
  status: string;
  reason: unknown;
  landing: LandingPage;
}

async function loadRun(runId: string): Promise<RunRow | null> {
  const rows = await db
    .select({
      id: optimizationRuns.id,
      landing_page_id: optimizationRuns.landing_page_id,
      status: optimizationRuns.status,
      reason: optimizationRuns.reason,
      landing: landingPages,
    })
    .from(optimizationRuns)
    .innerJoin(landingPages, eq(landingPages.id, optimizationRuns.landing_page_id))
    .where(eq(optimizationRuns.id, runId))
    .limit(1);
  return rows[0] ?? null;
}

async function loadCurrentVariant(landingPageId: string): Promise<Record<string, string> | null> {
  const rows = await db
    .select({ patch: pageVariants.patch })
    .from(pageVariants)
    .where(
      and(
        eq(pageVariants.landing_page_id, landingPageId),
        eq(pageVariants.is_active, true)
      )
    )
    .limit(1);
  if (!rows[0]) return null;
  const patch = rows[0].patch as { changes?: Array<{ field: string; new_value: string }> };
  if (!patch?.changes) return null;
  const out: Record<string, string> = {};
  for (const c of patch.changes) out[c.field] = c.new_value;
  return out;
}

function buildPrompt(
  landing: LandingPage,
  reason: { flags?: DetectionFlag[]; aggregate?: AggregatedMetrics },
  currentText: Record<string, string> | null
): string {
  const flags = reason.flags ?? [];
  const agg = reason.aggregate;
  const flagSummary = flags
    .map((f) => `- ${f.metric} = ${f.observed} (threshold ${f.threshold}, ${f.severity})`)
    .join("\n");

  const currentBlock = currentText
    ? Object.entries(currentText)
        .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
        .join("\n")
    : "  (using page defaults — no current variant on file)";

  return `You are optimizing a Thai pharmacy/nursing exam-prep landing page that is underperforming on paid ads.

LANDING PAGE
  path: ${landing.path}
  name: ${landing.name}
  primary conversion: ${landing.conversion_event}

OBSERVED METRICS (last window)
  impressions: ${agg?.impressions ?? "?"}
  clicks: ${agg?.clicks ?? "?"}
  ctr: ${agg?.ctr?.toFixed?.(4) ?? "?"}
  spend (THB): ${agg?.spend_thb ?? "?"}
  conversions: ${agg?.conversions ?? "?"}
  cpa (THB): ${agg?.cpa_thb ?? "?"}

FLAGS
${flagSummary || "  (none)"}

CURRENT COPY
${currentBlock}

RULES (HARD CONSTRAINTS)
- You may ONLY change these fields: headline, subheadline, cta_text, hero_copy, value_prop, social_proof.
- Thai-first audience: write Thai, English OK as accent. Tone: friendly, supportive, exam-savvy.
- DO NOT make medical/treatment/disease claims, dosage claims, or regulatory claims (อย, FDA).
- DO NOT promise "100% safe", "guaranteed", "no side effects", "lose X kg".
- Keep headline ≤ 80 chars, subheadline ≤ 160, cta_text ≤ 30, hero_copy ≤ 400.
- Each change must address at least one flag above.

OUTPUT
Return ONLY valid JSON matching this exact shape, no prose, no markdown:
{
  "summary": "<one short Thai sentence: why these changes>",
  "changes": [
    { "field": "headline", "new_value": "<text>", "rationale": "<short Thai>" }
  ],
  "confidence": <0.0-1.0>,
  "risk_level": "low" | "medium" | "high"
}`;
}

function extractJson(text: string): Proposal | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

export interface ProposeResult {
  run_id: string;
  status: "proposed" | "applied" | "rejected" | "failed";
  proposal?: Proposal;
  violations?: Array<{ rule: string; field: string; evidence: string }>;
  variant_id?: string;
  error?: string;
}

export async function proposeForRun(runId: string): Promise<ProposeResult> {
  const run = await loadRun(runId);
  if (!run) return { run_id: runId, status: "failed", error: "run not found" };
  if (run.status !== "pending") {
    return { run_id: runId, status: "failed", error: `run is ${run.status}, expected pending` };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { run_id: runId, status: "failed", error: "ANTHROPIC_API_KEY missing" };

  const current = await loadCurrentVariant(run.landing.id);
  const prompt = buildPrompt(
    run.landing,
    run.reason as { flags?: DetectionFlag[]; aggregate?: AggregatedMetrics },
    current
  );

  const client = new Anthropic({ apiKey });
  let proposal: Proposal | null = null;
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    proposal = extractJson(text);
  } catch (err) {
    await markFailed(runId, err instanceof Error ? err.message : String(err));
    return {
      run_id: runId,
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  if (!proposal || !Array.isArray(proposal.changes)) {
    await markFailed(runId, "claude returned no valid proposal");
    return { run_id: runId, status: "failed", error: "no valid proposal" };
  }

  const check = validateProposal(proposal);

  if (!check.ok && check.safeChanges.length === 0) {
    await db
      .update(optimizationRuns)
      .set({
        status: "rejected",
        proposal: { ...proposal, guardrail_violations: check.violations } as unknown as object,
        error: `guardrail blocked all changes: ${check.violations.map((v) => v.rule).join(", ")}`,
        completed_at: sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string,
      })
      .where(eq(optimizationRuns.id, runId));
    return {
      run_id: runId,
      status: "rejected",
      proposal,
      violations: check.violations,
    };
  }

  const finalProposal: Proposal = { ...proposal, changes: check.safeChanges };

  if (run.landing.auto_optimize && finalProposal.risk_level !== "high") {
    const variantInsert = await db
      .insert(pageVariants)
      .values({
        landing_page_id: run.landing.id,
        name: `auto-${new Date().toISOString().slice(0, 10)}`,
        patch: finalProposal as unknown as object,
        traffic_pct: 50,
        is_active: true,
        is_baseline: false,
        created_by: "claude",
      })
      .returning({ id: pageVariants.id });
    const variantId = variantInsert[0].id;

    await db
      .update(optimizationRuns)
      .set({
        status: "applied",
        proposal: { ...finalProposal, guardrail_violations: check.violations } as unknown as object,
        applied_variant_id: variantId,
        completed_at: sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string,
      })
      .where(eq(optimizationRuns.id, runId));

    return {
      run_id: runId,
      status: "applied",
      proposal: finalProposal,
      violations: check.violations,
      variant_id: variantId,
    };
  }

  await db
    .update(optimizationRuns)
    .set({
      status: "proposed",
      proposal: { ...finalProposal, guardrail_violations: check.violations } as unknown as object,
      completed_at: sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string,
    })
    .where(eq(optimizationRuns.id, runId));

  return {
    run_id: runId,
    status: "proposed",
    proposal: finalProposal,
    violations: check.violations,
  };
}

async function markFailed(runId: string, message: string) {
  await db
    .update(optimizationRuns)
    .set({
      status: "failed",
      error: message,
      completed_at: sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string,
    })
    .where(eq(optimizationRuns.id, runId));
}

export async function processPendingRuns(limit = 5): Promise<ProposeResult[]> {
  const pending = await db
    .select({ id: optimizationRuns.id })
    .from(optimizationRuns)
    .where(eq(optimizationRuns.status, "pending"))
    .orderBy(optimizationRuns.created_at)
    .limit(limit);

  const out: ProposeResult[] = [];
  for (const row of pending) {
    out.push(await proposeForRun(row.id));
  }
  return out;
}
