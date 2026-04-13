import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const LINE_CHANNEL_ID = () =>
  (process.env.LINE_LOGIN_CHANNEL_ID ?? "").trim();
const LINE_CHANNEL_SECRET = () =>
  (process.env.LINE_LOGIN_CHANNEL_SECRET ?? "").trim();
const SITE_URL = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://pharmroo.com";

interface LineTokenResponse {
  access_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

/**
 * LINE Login callback — exchange code for tokens, find/create user.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("line_oauth_state")?.value;

  // Verify CSRF state
  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${SITE_URL()}/login?error=invalid_state`);
  }

  const callbackUrl = `${SITE_URL()}/api/auth/line/callback`;

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: callbackUrl,
        client_id: LINE_CHANNEL_ID(),
        client_secret: LINE_CHANNEL_SECRET(),
      }),
    });

    if (!tokenRes.ok) {
      console.error("[LINE callback] token exchange failed:", tokenRes.status);
      return NextResponse.redirect(`${SITE_URL()}/login?error=token_failed`);
    }

    const tokenData = (await tokenRes.json()) as LineTokenResponse;

    // 2. Get LINE profile
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(`${SITE_URL()}/login?error=profile_failed`);
    }

    const profile = (await profileRes.json()) as LineProfile;

    // 3. Extract email from id_token (if available)
    let email: string | null = null;
    if (tokenData.id_token) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenData.id_token.split(".")[1], "base64").toString()
        );
        email = payload.email ?? null;
      } catch {
        // email not available in id_token
      }
    }

    // 4. Find or create user
    // Try matching by line_user_id first
    let user = await db
      .select()
      .from(users)
      .where(eq(users.line_user_id, profile.userId))
      .then((rows) => rows[0]);

    if (!user && email) {
      // Try matching by email
      user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((rows) => rows[0]);

      if (user) {
        // Link LINE to existing user
        await db
          .update(users)
          .set({
            line_user_id: profile.userId,
            line_linked_at: new Date().toISOString(),
          })
          .where(eq(users.id, user.id));
      }
    }

    if (!user) {
      // Create new user
      const userId = randomUUID();
      const userEmail =
        email || `line_${profile.userId}@line.pharmroo.com`;

      await db.insert(users).values({
        id: userId,
        email: userEmail,
        name: profile.displayName,
        role: "user",
        membership_type: "free",
        line_user_id: profile.userId,
        line_linked_at: new Date().toISOString(),
      });

      user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .then((rows) => rows[0]);
    }

    // 5. Redirect to dashboard (in production, create a session/JWT here)
    // For prototype, redirect with user indicator
    const response = NextResponse.redirect(
      `${SITE_URL()}/dashboard?line_login=success`
    );

    // Clear CSRF cookie
    response.cookies.delete("line_oauth_state");

    return response;
  } catch (err) {
    console.error("[LINE callback] error:", err);
    return NextResponse.redirect(`${SITE_URL()}/login?error=line_failed`);
  }
}
