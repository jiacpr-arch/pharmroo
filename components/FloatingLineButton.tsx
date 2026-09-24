"use client";

import { useCallback, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { trackLead } from "@/lib/analytics/conversions";
import { CONTACT_INFO } from "@/lib/contact-info";
import LineIcon from "@/components/LineIcon";
import { LINE_TRIAL_DAYS } from "@/lib/limits";

const LINE_OA_URL = CONTACT_INFO.lineUrl;
const DISMISS_KEY = "pharmroo_line_fab_dismissed";

const dismissListeners = new Set<() => void>();

function subscribe(cb: () => void) {
  dismissListeners.add(cb);
  return () => dismissListeners.delete(cb);
}

function getDismissed() {
  return sessionStorage.getItem(DISMISS_KEY) === "1";
}

/**
 * Always-visible LINE add-friend bubble, pinned bottom-left. Hidden on
 * admin routes and once the visitor dismisses it for the session. Fires a
 * Meta Pixel Lead event on click.
 */
export default function FloatingLineButton() {
  const pathname = usePathname();
  // Read dismissal from sessionStorage without an effect; server snapshot is
  // `true` so nothing renders until the client confirms it isn't dismissed.
  const dismissed = useSyncExternalStore(
    subscribe,
    getDismissed,
    () => true
  );

  const dismiss = useCallback(() => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    dismissListeners.forEach((cb) => cb());
  }, []);

  if (pathname?.startsWith("/admin") || dismissed) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center">
      <a
        href={LINE_OA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`แอด LINE ฟาร์มรู้ — รับสิทธิ์ทำข้อสอบ Premium ฟรี ${LINE_TRIAL_DAYS} วัน`}
        onClick={() => trackLead({ source: "line_fab" })}
        className="group flex items-center gap-2 rounded-full bg-[#06C755] py-2.5 pl-3 pr-4 text-white shadow-lg transition-all hover:bg-[#05b34c] hover:scale-105 active:scale-95"
      >
        <LineIcon className="h-6 w-6 shrink-0" />
        <span className="text-sm font-semibold">
          แอด LINE ทำข้อสอบฟรี {LINE_TRIAL_DAYS} วัน
        </span>
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="ปิดปุ่ม LINE"
        className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
