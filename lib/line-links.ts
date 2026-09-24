/**
 * LIFF deep links — a link opened from a LINE Flex message goes through
 * liff.line.me so it opens inside LINE's in-app browser (or the native app,
 * for a LIFF-registered path) instead of an external browser. Falls back to
 * a plain site URL when no LIFF app is configured.
 */

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pharmru.com").trim();
}

function liffId(): string | undefined {
  return process.env.NEXT_PUBLIC_LIFF_ID?.trim() || undefined;
}

/** Build a liff.line.me URL for a path relative to the site (e.g. "/pricing"). */
export function liffDeepLink(path: string): string {
  const id = liffId();
  if (!id) return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `https://liff.line.me/${id}${normalizedPath}`;
}

/** Convert a full pharmroo URL into its liff.line.me equivalent, if it belongs to this site. */
export function toLiffUri(fullUrl: string): string {
  const id = liffId();
  if (!id) return fullUrl;
  try {
    const url = new URL(fullUrl);
    const site = new URL(siteUrl());
    if (url.host !== site.host) return fullUrl;
    return `https://liff.line.me/${id}${url.pathname}${url.search}`;
  } catch {
    return fullUrl;
  }
}
