import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const LINE_CHANNEL_ID = () =>
  (process.env.LINE_LOGIN_CHANNEL_ID ?? "").trim();
const SITE_URL = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://pharmroo.com";

/**
 * LINE Login — Authorization redirect.
 * GET /api/auth/line?mode=login
 */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode") ?? "login";
  const channelId = LINE_CHANNEL_ID();

  if (!channelId) {
    return NextResponse.json(
      { error: "LINE Login not configured" },
      { status: 500 }
    );
  }

  // Generate CSRF state
  const state = randomUUID();
  const callbackUrl = `${SITE_URL()}/api/auth/line/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: channelId,
    redirect_uri: callbackUrl,
    state,
    scope: "profile openid email",
  });

  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?${params}`;

  // Store state in httpOnly cookie
  const response = NextResponse.redirect(lineAuthUrl);
  response.cookies.set("line_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}
