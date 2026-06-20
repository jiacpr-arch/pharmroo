"use client";

import { useEffect, useRef } from "react";
import { phLandingView } from "@/lib/analytics/posthog";

/** Fires a single `landing_view` PostHog event when the home page mounts. */
export default function LandingViewTracker() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    phLandingView();
  }, []);
  return null;
}
