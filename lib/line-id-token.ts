export interface LineIdTokenPayload {
  sub: string; // LINE userId
  email?: string;
  name?: string;
  picture?: string;
}

/**
 * Verifies a LINE LIFF id token against LINE's own verify endpoint (no local
 * JWT library needed — LINE does the signature/expiry/audience checks and
 * returns the decoded claims directly).
 */
export async function verifyLineIdToken(
  idToken: string,
  channelId: string
): Promise<LineIdTokenPayload | null> {
  if (!idToken || !channelId) return null;

  const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id_token: idToken, client_id: channelId }).toString(),
  });

  if (!res.ok) {
    console.error(`[line-id-token] verify failed status=${res.status}`);
    return null;
  }

  const data = (await res.json().catch(() => null)) as
    | { sub?: string; email?: string; name?: string; picture?: string }
    | null;

  if (!data?.sub) return null;
  return { sub: data.sub, email: data.email, name: data.name, picture: data.picture };
}
