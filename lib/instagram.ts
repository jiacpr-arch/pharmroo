const GRAPH_API = "https://graph.facebook.com/v24.0";

export interface InstagramPostResult {
  ok: boolean;
  mediaId?: string;
  error?: string;
}

export async function postToInstagram(options: {
  imageUrl: string;
  caption: string;
  getUserToken: () => Promise<string>;
  saveUserToken: (token: string) => Promise<void>;
}): Promise<InstagramPostResult> {
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!accountId) {
    return { ok: false, error: "INSTAGRAM_BUSINESS_ACCOUNT_ID not configured" };
  }

  if (process.env.INSTAGRAM_AUTOPOST_ENABLED !== "true") {
    return { ok: false, error: "Instagram autopost disabled" };
  }

  try {
    let userToken = await options.getUserToken();
    if (!userToken) {
      return { ok: false, error: "No user token available" };
    }

    // Refresh token
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (appId && appSecret) {
      const refreshUrl = new URL(`${GRAPH_API}/oauth/access_token`);
      refreshUrl.searchParams.set("grant_type", "fb_exchange_token");
      refreshUrl.searchParams.set("client_id", appId);
      refreshUrl.searchParams.set("client_secret", appSecret);
      refreshUrl.searchParams.set("fb_exchange_token", userToken);
      const refreshRes = await fetch(refreshUrl.toString());
      if (refreshRes.ok) {
        const data = (await refreshRes.json()) as { access_token?: string };
        if (data.access_token) {
          userToken = data.access_token;
          await options.saveUserToken(userToken);
        }
      }
    }

    // Step 1: Create media container
    const containerRes = await fetch(
      `${GRAPH_API}/${accountId}/media?access_token=${userToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: options.imageUrl,
          caption: options.caption,
          media_type: "IMAGE",
        }),
      }
    );

    if (!containerRes.ok) {
      const body = await containerRes.text();
      return { ok: false, error: `Container creation failed: ${body}` };
    }

    const container = (await containerRes.json()) as { id?: string };
    if (!container.id) {
      return { ok: false, error: "No container id returned" };
    }

    // Step 2: Publish
    const publishRes = await fetch(
      `${GRAPH_API}/${accountId}/media_publish?access_token=${userToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creation_id: container.id }),
      }
    );

    if (!publishRes.ok) {
      const body = await publishRes.text();
      return { ok: false, error: `Publish failed: ${body}` };
    }

    const published = (await publishRes.json()) as { id?: string };
    return { ok: true, mediaId: published.id };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
