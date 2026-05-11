import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/leads";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      status_year?: string;
      exam_target?: string;
      reward_choice?: string;
      campaign?: string;
      ad_set?: string;
      consent_pdpa?: boolean;
    };

    if (!body.consent_pdpa) {
      return NextResponse.json({ error: "missing_consent" }, { status: 400 });
    }

    const result = await createLead({
      source: "landing",
      name: body.name,
      email: body.email,
      phone: body.phone,
      statusYear: body.status_year,
      examTarget: body.exam_target,
      rewardChoice: body.reward_choice,
      campaign: body.campaign,
      adSet: body.ad_set,
      consentPdpa: true,
    });

    return NextResponse.json({
      ok: true,
      leadId: result.leadId,
      code: result.code,
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    console.error("[/api/leads/create]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
