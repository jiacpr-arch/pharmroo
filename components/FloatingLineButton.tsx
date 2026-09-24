"use client";

import { useCallback, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { X } from "lucide-react";
import { trackLead } from "@/lib/analytics/conversions";
import { CONTACT_INFO } from "@/lib/contact-info";
import LineIcon from "@/components/LineIcon";
import { LINE_BONUS_DAYS } from "@/lib/limits";

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
 *
 * Logged-out visitors go through LINE Login, whose consent screen offers
 * adding the OA (pre-checked); signing in as a friend grants the new-member
 * bonus. Logged-in users open the OA directly; the follow webhook grants it,
 * and the session is refreshed when they come back to the tab.
 */
export default function FloatingLineButton() {
  const pathname = usePathname();
  const { data: session, status, update } = useSession();
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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackLead({ source: "line_fab" });
      if (status === "unauthenticated") {
        e.preventDefault();
        signIn("line", { callbackUrl: pathname || "/" });
        return;
      }
      const onReturn = () => {
        if (document.visibilityState !== "visible") return;
        document.removeEventListener("visibilitychange", onReturn);
        update();
      };
      document.addEventListener("visibilitychange", onReturn);
    },
    [status, pathname, update]
  );

  if (pathname?.startsWith("/admin") || dismissed) return null;

  const user = session?.user as
    | { membership_type?: string }
    | undefined;
  const offerBonus = !user || user.membership_type === "free";

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center">
      <a
        href={LINE_OA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          offerBonus
            ? `แอด LINE ฟาร์มรู้ — รับสิทธิ์ทำข้อสอบ Premium ฟรี ${LINE_BONUS_DAYS} วัน`
            : "แอด LINE ฟาร์มรู้"
        }
        onClick={handleClick}
        className="group flex items-center gap-2 rounded-full bg-[#06C755] py-2.5 pl-3 pr-4 text-white shadow-lg transition-all hover:bg-[#05b34c] hover:scale-105 active:scale-95"
      >
        <LineIcon className="h-6 w-6 shrink-0" />
        <span className="text-sm font-semibold">
          {offerBonus
            ? `แอด LINE ทำข้อสอบฟรี ${LINE_BONUS_DAYS} วัน`
            : "แอด LINE ฟาร์มรู้"}
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
