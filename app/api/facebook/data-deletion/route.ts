import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export const runtime = "nodejs";

// Meta requires this endpoint for apps using Facebook Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const signedRequest = params.get("signed_request");

    if (!signedRequest) {
      return NextResponse.json({ error: "missing_signed_request" }, { status: 400 });
    }

    const [encodedSig, payload] = signedRequest.split(".");
    const appSecret = process.env.FACEBOOK_APP_SECRET ?? "";
    const expectedSig = createHmac("sha256", appSecret)
      .update(payload)
      .digest("base64url");

    if (encodedSig !== expectedSig) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }

    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      user_id?: string;
    };

    const confirmationCode = `pharmroo-del-${data.user_id ?? "unknown"}-${Date.now()}`;

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy`,
      confirmation_code: confirmationCode,
    });
  } catch (err) {
    console.error("[facebook/data-deletion]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
