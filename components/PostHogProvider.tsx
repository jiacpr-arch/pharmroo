"use client";

import posthog from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * Fires $pageview on every App Router client-side navigation.
 * Wrapped in <Suspense> by the parent because useSearchParams requires it.
 */
function PageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY || typeof window === "undefined") return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Initialises posthog-js once on the client and tracks page views
 * across App Router navigations. No-op when NEXT_PUBLIC_POSTHOG_KEY is unset.
 */
export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!POSTHOG_KEY || initialized.current) return;
    initialized.current = true;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
      {children}
    </>
  );
}
