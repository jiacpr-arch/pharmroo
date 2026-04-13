/**
 * Facebook Auto-Post with Token Auto-Refresh.
 *
 * Token never expires as long as cron runs once every 60 days.
 * We refresh the long-lived user token on each use, then derive page token.
 */

const PAGE_ID = () => (process.env.FACEBOOK_PAGE_ID ?? "").trim();
const APP_ID = () => (process.env.FACEBOOK_APP_ID ?? "").trim();
const APP_SECRET = () => (process.env.FACEBOOK_APP_SECRET ?? "").trim();

/**
 * Refresh a long-lived user token (extends another 60 days).
 */
async function refreshLongLivedToken(
  currentToken: string
): Promise<string | null> {
  const url = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", APP_ID());
  url.searchParams.set("client_secret", APP_SECRET());
  url.searchParams.set("fb_exchange_token", currentToken);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

/**
 * Get page access token from user token.
 */
async function getPageToken(userToken: string): Promise<string | null> {
  const url = `https://graph.facebook.com/v19.0/${PAGE_ID()}?fields=access_token&access_token=${userToken}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export interface FacebookPostResult {
  ok: boolean;
  postId?: string;
  error?: string;
}

/**
 * Post to Facebook page.
 * Accepts message text and optional image URL or link.
 */
export async function postToFacebook(options: {
  message: string;
  link?: string;
  imageUrl?: string;
  getUserToken: () => Promise<string>;
  saveUserToken: (token: string) => Promise<void>;
}): Promise<FacebookPostResult> {
  const pageId = PAGE_ID();
  if (!pageId || !APP_ID() || !APP_SECRET()) {
    return { ok: false, error: "Facebook env vars not configured" };
  }

  try {
    // 1. Get current user token
    let userToken = await options.getUserToken();
    if (!userToken) {
      return { ok: false, error: "No Facebook user token available" };
    }

    // 2. Refresh for another 60 days
    const refreshed = await refreshLongLivedToken(userToken);
    if (refreshed) {
      userToken = refreshed;
      await options.saveUserToken(refreshed);
    }

    // 3. Get page token
    const pageToken = await getPageToken(userToken);
    if (!pageToken) {
      return { ok: false, error: "Failed to get page access token" };
    }

    // 4. Post to page
    let endpoint: string;
    let body: Record<string, string>;

    if (options.imageUrl) {
      endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
      body = {
        url: options.imageUrl,
        message: options.message,
        access_token: pageToken,
      };
    } else {
      endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
      body = {
        message: options.message,
        access_token: pageToken,
      };
      if (options.link) body.link = options.link;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as { id?: string; error?: { message: string } };

    if (!res.ok) {
      return { ok: false, error: data.error?.message ?? `HTTP ${res.status}` };
    }

    return { ok: true, postId: data.id };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
