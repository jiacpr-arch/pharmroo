import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  fetchLeadgenData,
  mapFieldData,
  rewardForForm,
  resolvePageAccessToken,
} from "@/lib/facebook-leads";
import { createLead } from "@/lib/leads";

export const runtime = "nodejs";
export const maxDuration = 60;

// Meta verify handshake
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.FACEBOOK_LEADS_VERIFY_TOKEN) {
    return new Response(challenge ?? "ok", { status: 200 });
  }

  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

// Lead Ads webhook
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  // Always return 200 after signature check to prevent Meta retries
  try {
    const payload = JSON.parse(rawBody) as {
      object: string;
      entry: Array<{
        changes: Array<{
          field: string;
          value: {
            leadgen_id: string;
            form_id: string;
            ad_id?: string;
            adgroup_id?: string;
          };
        }>;
      }>;
    };

    if (payload.object !== "page") {
      return NextResponse.json({ ok: true });
    }

    const pageToken = await resolvePageAccessToken();

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== "leadgen") continue;

        const { leadgen_id, form_id, ad_id } = change.value;

        const leadgenData = await fetchLeadgenData(leadgen_id, pageToken);
        const mapped = mapFieldData(leadgenData.field_data);
        const rewardChoice = rewardForForm(form_id);

        await createLead({
          source: "fb_leadgen_form",
          fbLeadId: leadgenData.id,
          email: mapped.email,
          name: mapped.name,
          phone: mapped.phone,
          statusYear: mapped.status_year,
          examTarget: mapped.exam_target,
          rewardChoice: mapped.reward_choice ?? rewardChoice,
          campaign: leadgenData.campaign_id,
          adSet: leadgenData.adset_id,
          consentPdpa: !!mapped.email,
          rawPayload: leadgenData as unknown as object,
        });
      }
    }
  } catch (err) {
    console.error("[fb-instant-form] processing error:", err);
  }

  return NextResponse.json({ ok: true });
}
