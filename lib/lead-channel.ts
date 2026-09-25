import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Look up the lead row keyed by LINE userId, creating an embryo lead on
 * first contact so every conversation shows up in the admin chatbot log.
 * Embryo leads have no email yet — that's filled in later if the bot
 * collects it (see lib/bot-intent.ts).
 */
export async function getOrCreateLeadFromLine(lineUserId: string): Promise<string | null> {
  try {
    const existing = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.line_user_id, lineUserId))
      .then((rows) => rows[0]);

    if (existing) {
      // Touch updated_at so admins can sort by "most recent activity" — fire-and-forget.
      db.update(leads)
        .set({ updated_at: new Date().toISOString() })
        .where(eq(leads.id, existing.id))
        .catch((err) => console.error("[lead-channel] touch failed:", err));
      return existing.id;
    }

    const created = await db
      .insert(leads)
      .values({ line_user_id: lineUserId, source: "line_oa", stage: "new" })
      .returning({ id: leads.id })
      .then((rows) => rows[0]);

    return created?.id ?? null;
  } catch (err) {
    console.error("[lead-channel] getOrCreateLeadFromLine failed:", err);
    return null; // caller should skip lead linking but keep replying
  }
}
