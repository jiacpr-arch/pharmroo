import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { issueRedeemCode } from "@/lib/redeem";
import { sendRedeemCodeEmail } from "@/lib/email/templates";

export interface CreateLeadArgs {
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  statusYear?: string;
  examTarget?: string;
  rewardChoice?: string;
  campaign?: string;
  adSet?: string;
  fbLeadId?: string;
  fbPsid?: string;
  lineUserId?: string;
  consentPdpa?: boolean;
  rawPayload?: object;
}

export async function createLead(args: CreateLeadArgs): Promise<{
  leadId: string;
  code?: string;
  expiresAt?: string;
  alreadyExisted: boolean;
}> {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  // Idempotency: skip duplicate fb_lead_id
  if (args.fbLeadId) {
    const existing = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.fb_lead_id, args.fbLeadId))
      .then((r) => r[0]);

    if (existing) {
      return { leadId: existing.id, alreadyExisted: true };
    }
  }

  const inserted = await db
    .insert(leads)
    .values({
      source: args.source,
      name: args.name ?? null,
      email: args.email ?? null,
      phone: args.phone ?? null,
      status_year: args.statusYear ?? null,
      exam_target: args.examTarget ?? null,
      reward_choice: args.rewardChoice ?? null,
      campaign: args.campaign ?? null,
      ad_set: args.adSet ?? null,
      fb_lead_id: args.fbLeadId ?? null,
      fb_psid: args.fbPsid ?? null,
      line_user_id: args.lineUserId ?? null,
      consent_pdpa: args.consentPdpa ?? false,
      consent_at: args.consentPdpa ? now : null,
      raw_payload: args.rawPayload ?? null,
      stage: "new",
    })
    .returning()
    .then((r) => r[0]);

  // Issue redeem code if email present
  let code: string | undefined;
  let expiresAt: string | undefined;

  if (args.email) {
    try {
      const result = await issueRedeemCode({
        rewardType: args.rewardChoice ?? "monthly_1m",
        source: args.source,
        campaign: args.campaign,
        leadId: inserted.id,
        issuedToEmail: args.email,
      });
      code = result.code;
      expiresAt = result.expiresAt;

      await db
        .update(leads)
        .set({ stage: "code_issued", updated_at: now })
        .where(eq(leads.id, inserted.id));

      // Fire-and-forget email
      sendRedeemCodeEmail(args.email, code, expiresAt, true).catch(() => {});
    } catch (err) {
      console.error("[createLead] Failed to issue code:", err);
    }
  }

  return { leadId: inserted.id, code, expiresAt, alreadyExisted: false };
}
