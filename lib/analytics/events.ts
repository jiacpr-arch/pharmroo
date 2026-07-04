import { track as vercelTrack } from "@vercel/analytics";
import posthog from "posthog-js";

/**
 * Fire a product event to both analytics sinks: Vercel Analytics (lightweight
 * counts) and PostHog (funnels/cohorts). Client-side only; PostHog is skipped
 * when it hasn't been initialized (no NEXT_PUBLIC_POSTHOG_KEY).
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>
): void {
  vercelTrack(name, props);
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(name, props);
  }
}
