import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { createHash } from "crypto";
import { db } from "@/lib/db";
import { landingPages, pageVariants } from "@/lib/db/schema";

export const VISITOR_COOKIE = "pr_vid";

export type CopySlots = {
  headline?: string;
  subheadline?: string;
  cta_text?: string;
  hero_copy?: string;
  value_prop?: string;
  social_proof?: string;
};

interface ActiveVariantRow {
  id: string;
  traffic_pct: number;
  patch: unknown;
}

async function loadActiveVariant(landingPageId: string): Promise<ActiveVariantRow | null> {
  const rows = await db
    .select({
      id: pageVariants.id,
      traffic_pct: pageVariants.traffic_pct,
      patch: pageVariants.patch,
    })
    .from(pageVariants)
    .where(
      and(
        eq(pageVariants.landing_page_id, landingPageId),
        eq(pageVariants.is_active, true)
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

function extractCopy(patch: unknown): CopySlots {
  if (!patch || typeof patch !== "object") return {};
  const p = patch as { changes?: Array<{ field: string; new_value: string }> };
  if (!Array.isArray(p.changes)) return {};
  const out: CopySlots = {};
  for (const c of p.changes) {
    if (typeof c.new_value !== "string") continue;
    switch (c.field) {
      case "headline":
      case "subheadline":
      case "cta_text":
      case "hero_copy":
      case "value_prop":
      case "social_proof":
        out[c.field] = c.new_value;
    }
  }
  return out;
}

function bucketPercent(visitorId: string, variantId: string): number {
  const h = createHash("sha256").update(`${visitorId}:${variantId}`).digest();
  // first 4 bytes → uint32 → percent
  const n = h.readUInt32BE(0);
  return (n / 0xffffffff) * 100;
}

export interface ResolveResult {
  copy: CopySlots;
  variant_id: string | null;
  landing_page_id: string | null;
}

export async function resolveCopyForPath(
  path: string,
  defaults: CopySlots = {}
): Promise<ResolveResult> {
  const lp = await db
    .select({ id: landingPages.id })
    .from(landingPages)
    .where(eq(landingPages.path, path))
    .limit(1);

  if (!lp[0]) return { copy: defaults, variant_id: null, landing_page_id: null };

  const variant = await loadActiveVariant(lp[0].id);
  if (!variant || variant.traffic_pct <= 0) {
    return { copy: defaults, variant_id: null, landing_page_id: lp[0].id };
  }

  const jar = await cookies();
  const visitorId = jar.get(VISITOR_COOKIE)?.value;
  // No visitor cookie yet (middleware will set on this same response). For
  // this request, fall back to defaults so we don't bias future buckets.
  if (!visitorId) {
    return { copy: defaults, variant_id: null, landing_page_id: lp[0].id };
  }

  const pct = bucketPercent(visitorId, variant.id);
  const inVariant = pct < variant.traffic_pct;

  return {
    copy: inVariant ? { ...defaults, ...extractCopy(variant.patch) } : defaults,
    variant_id: inVariant ? variant.id : null,
    landing_page_id: lp[0].id,
  };
}
