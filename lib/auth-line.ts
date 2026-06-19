import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type LineProfile = {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
};

export type UpsertedLineUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export async function upsertLineUser(
  lineUserId: string,
  profile: LineProfile,
): Promise<UpsertedLineUser> {
  let existing = await db
    .select()
    .from(users)
    .where(eq(users.line_user_id, lineUserId))
    .then((rows) => rows[0]);

  if (!existing && profile.email) {
    existing = await db
      .select()
      .from(users)
      .where(eq(users.email, profile.email))
      .then((rows) => rows[0]);

    if (existing) {
      await db
        .update(users)
        .set({
          line_user_id: lineUserId,
          line_linked_at: new Date().toISOString(),
        })
        .where(eq(users.id, existing.id));
    }
  }

  if (!existing) {
    const newId = crypto.randomUUID();
    const fallbackEmail =
      profile.email || `line_${lineUserId}@line.pharmroo.com`;
    const userName = profile.name || "LINE User";
    await db.insert(users).values({
      id: newId,
      email: fallbackEmail,
      name: userName,
      membership_type: "free",
      role: "user",
      line_user_id: lineUserId,
      line_linked_at: new Date().toISOString(),
    });
    return {
      id: newId,
      email: fallbackEmail,
      name: userName,
      image: profile.picture ?? null,
    };
  }

  return {
    id: existing.id,
    email: existing.email,
    name: existing.name,
    image: profile.picture ?? null,
  };
}

export type LineIdTokenPayload = {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
};

export async function verifyLineIdToken(
  idToken: string,
): Promise<LineIdTokenPayload> {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) {
    throw new Error("LINE_LOGIN_CHANNEL_ID is not configured");
  }

  const body = new URLSearchParams({
    id_token: idToken,
    client_id: channelId,
  });

  const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LINE id_token verify failed: ${res.status} ${text}`);
  }

  const payload = (await res.json()) as {
    sub?: string;
    aud?: string;
    iss?: string;
    exp?: number;
    name?: string;
    picture?: string;
    email?: string;
  };

  if (!payload.sub) throw new Error("LINE id_token missing sub");
  if (payload.aud !== channelId) {
    throw new Error("LINE id_token audience mismatch");
  }
  if (payload.iss !== "https://access.line.me") {
    throw new Error("LINE id_token issuer mismatch");
  }
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("LINE id_token expired");
  }

  return {
    sub: payload.sub,
    name: payload.name,
    picture: payload.picture,
    email: payload.email,
  };
}
