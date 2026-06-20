/**
 * PostHog event helpers — thin wrappers around posthog.capture().
 *
 * All functions are safe no-ops on the server. Import and call from client
 * components only. Calls before posthog.init() are queued and replayed
 * automatically by the posthog-js library.
 */

import posthog from "posthog-js";

function capture(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}

/** Fired once when a visitor lands on the home page. */
export function phLandingView(): void {
  capture("landing_view");
}

/** Fired when the user first interacts with the registration form. */
export function phRegisterStart(): void {
  capture("register_start");
}

/** Fired after a successful account creation. */
export function phRegisterSuccess(props?: { userId?: string }): void {
  capture("register_success", props);
}

/** Fired when the pricing page mounts. */
export function phViewPricing(): void {
  capture("view_pricing");
}

/** Fired when the user initiates Stripe checkout from the payment page. */
export function phCheckoutStart(props?: {
  plan?: string;
  value?: number;
}): void {
  capture("checkout_start", props);
}

/** Fired once on the success page after payment is confirmed. */
export function phPurchase(props?: {
  value?: number;
  currency?: string;
  sessionId?: string;
}): void {
  capture("purchase", props);
}
