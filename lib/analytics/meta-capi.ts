/**
 * Meta Conversions API (server-side) helper.
 *
 * Sends conversion events directly from our server to Meta, in parallel with
 * the browser Meta Pixel (`lib/analytics/conversions.ts`). Server-side events
 * are far more reliable than the pixel alone: they survive ad-blockers, iOS
 * ITP, and the Stripe redirect that frequently drops the client-side Purchase
 * event. Each event carries an `eventId` that matches the pixel's `eventID`,
 * so Meta de-duplicates the pixel + CAPI copies of the same action.
 *
 * Everything here is a safe no-op when META_PIXEL_ID / META_CAPI_ACCESS_TOKEN
 * are unset (e.g. previews and forks), and never throws — conversion tracking
 * must never break a checkout or a registration.
 */

import { createHash } from "crypto";

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v21.0";
// Server can read the public pixel id too; META_PIXEL_ID lets you override.
const PIXEL_ID =
  process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
// Optional: when set, events show up in Events Manager → Test Events only.
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

/** SHA-256 hash of a normalized (trimmed, lower-cased) value, per Meta spec. */
function hash(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

export interface MetaUserData {
  /** Plain email — hashed before sending. */
  email?: string;
  /** Stable internal id (e.g. user id) — hashed before sending. */
  externalId?: string;
  /** `_fbp` cookie value — sent as-is (already in Meta's format). */
  fbp?: string;
  /** `_fbc` cookie value — sent as-is (already in Meta's format). */
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

export interface MetaConversionEvent {
  eventName: "Purchase" | "CompleteRegistration" | "InitiateCheckout" | "Lead";
  /** Dedup key — MUST match the browser pixel's `eventID` for the same action. */
  eventId: string;
  eventSourceUrl?: string;
  userData?: MetaUserData;
  customData?: Record<string, unknown>;
  /** Unix seconds; defaults to now. */
  eventTime?: number;
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

/**
 * Send a single conversion event to the Meta Conversions API.
 * Never throws — logs and resolves on any error.
 */
export async function sendMetaConversionEvent(
  event: MetaConversionEvent
): Promise<void> {
  if (!isMetaCapiConfigured()) return;

  const userData: Record<string, unknown> = {};
  const em = hash(event.userData?.email);
  if (em) userData.em = [em];
  const externalId = hash(event.userData?.externalId);
  if (externalId) userData.external_id = [externalId];
  if (event.userData?.fbp) userData.fbp = event.userData.fbp;
  if (event.userData?.fbc) userData.fbc = event.userData.fbc;
  if (event.userData?.clientIpAddress)
    userData.client_ip_address = event.userData.clientIpAddress;
  if (event.userData?.clientUserAgent)
    userData.client_user_agent = event.userData.clientUserAgent;

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: "website",
        ...(event.eventSourceUrl
          ? { event_source_url: event.eventSourceUrl }
          : {}),
        user_data: userData,
        ...(event.customData ? { custom_data: event.customData } : {}),
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
        ACCESS_TOKEN as string
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        `[meta-capi] ${event.eventName} failed: ${res.status} ${text}`
      );
    }
  } catch (err) {
    console.error(`[meta-capi] ${event.eventName} error:`, err);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Server-side Purchase, fired from the Stripe webhook / success-page verify
 * once a payment is confirmed. `sessionId` is the Stripe Checkout Session id,
 * which is also used as the browser pixel's `eventID`, so the two copies of
 * the Purchase de-duplicate on Meta's side.
 */
export async function reportPurchaseConversion(params: {
  sessionId: string;
  value: number;
  currency?: string;
  email?: string;
  userId?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
}): Promise<void> {
  await sendMetaConversionEvent({
    eventName: "Purchase",
    eventId: params.sessionId,
    eventSourceUrl: params.eventSourceUrl,
    userData: {
      email: params.email,
      externalId: params.userId,
      fbp: params.fbp,
      fbc: params.fbc,
    },
    customData: {
      value: params.value,
      currency: params.currency ?? "THB",
    },
  });
}
