import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import type { Lead } from "@/lib/db/schema";

interface GetOrCreateLeadArgs {
  channel: "fb_messenger" | "line_oa";
  channelUserId: string;
  campaign?: string;
  adSet?: string;
}

export async function getOrCreateLeadFromChannel(
  args: GetOrCreateLeadArgs
): Promise<Lead> {
  const { channel, channelUserId, campaign, adSet } = args;

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const existing = await db
    .select()
    .from(leads)
    .where(
      channel === "fb_messenger"
        ? eq(leads.fb_psid, channelUserId)
        : eq(leads.line_user_id, channelUserId)
    )
    .then((r) => r[0] ?? null);

  if (existing) {
    await db
      .update(leads)
      .set({ updated_at: now })
      .where(eq(leads.id, existing.id));
    return { ...existing, updated_at: now };
  }

  const newLead = {
    source: channel,
    stage: "new" as const,
    fb_psid: channel === "fb_messenger" ? channelUserId : null,
    line_user_id: channel === "line_oa" ? channelUserId : null,
    campaign: campaign ?? null,
    ad_set: adSet ?? null,
    consent_pdpa: false,
  };

  const inserted = await db
    .insert(leads)
    .values(newLead)
    .returning()
    .then((r) => r[0]);

  return inserted;
}
