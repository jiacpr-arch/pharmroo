/**
 * Meta Pixel conversion event helpers.
 *
 * All helpers are no-ops on the server and when the pixel hasn't loaded
 * (e.g. NEXT_PUBLIC_META_PIXEL_ID unset). Import and call from client
 * components only.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function fbq(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

/** Fire after a successful account registration. */
export function trackCompleteRegistration(): void {
  fbq("track", "CompleteRegistration");
}

/** Fire when the user starts a Stripe checkout from the payment page. */
export function trackInitiateCheckout(opts?: {
  value?: number;
  currency?: string;
}): void {
  const { value, currency = "THB" } = opts ?? {};
  fbq(
    "track",
    "InitiateCheckout",
    value != null ? { value, currency } : undefined
  );
}

/** Fire on the payment success page once payment is confirmed. */
export function trackPurchase(opts: {
  value: number;
  currency?: string;
}): void {
  const { value, currency = "THB" } = opts;
  fbq("track", "Purchase", { value, currency });
}

/** Fire when a visitor expresses intent (e.g. taps the LINE OA button). */
export function trackLead(params?: Record<string, unknown>): void {
  fbq("track", "Lead", params);
}
