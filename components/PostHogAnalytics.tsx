"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * PostHog bootstrap: init once, manual pageviews on route change, and identify
 * logged-in users by id + membership tier (no name/email — keep PII out).
 * A no-op when NEXT_PUBLIC_POSTHOG_KEY is unset.
 */
export default function PostHogAnalytics() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!KEY || posthog.__loaded) return;
    posthog.init(KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false, // captured manually below (App Router)
    });
  }, []);

  useEffect(() => {
    if (!KEY || !posthog.__loaded || !pathname) return;
    posthog.capture("$pageview");
  }, [pathname]);

  useEffect(() => {
    if (!KEY || !posthog.__loaded) return;
    if (status === "authenticated" && session?.user?.id) {
      posthog.identify(session.user.id, {
        membership_type:
          (session.user as { membership_type?: string }).membership_type ??
          "free",
      });
    } else if (status === "unauthenticated") {
      posthog.reset();
    }
  }, [status, session]);

  return null;
}
