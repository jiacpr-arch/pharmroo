"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Phase = "loading" | "linking" | "linked" | "needs-login" | "error";

/**
 * LIFF entry point (registered as this app's LIFF endpoint URL in the LINE
 * Developers console). Opened from a link inside a LINE Flex message or the
 * "เชื่อมต่ออัตโนมัติ" button on the profile page.
 *
 * - Already logged in to pharmroo: verifies the LIFF id token and links the
 *   LINE account to the current session in one tap (no code to type).
 * - Not logged in: sends the visitor through the normal login flow with a
 *   callbackUrl back to this page, so linking resumes once they're signed in.
 */
export default function LiffLinkContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/profile";

  const [phase, setPhase] = useState<Phase>("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      setPhase("error");
      setMessage("ฟีเจอร์นี้ยังไม่เปิดใช้งาน");
      return;
    }

    if (status === "unauthenticated") {
      setPhase("needs-login");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const liff = (await import("@line/liff")).default;
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        const idToken = liff.getIDToken();
        if (!idToken) throw new Error("ไม่พบ LINE token");

        if (cancelled) return;
        setPhase("linking");

        const res = await fetch("/api/auth/line/liff-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setPhase("error");
          setMessage(data.error || "เชื่อมต่อไม่สำเร็จ");
          return;
        }

        setPhase("linked");
        setMessage(data.bonusMessage || "เชื่อมต่อ LINE สำเร็จแล้ว!");
        setTimeout(() => router.push(next), 1800);
      } catch (err) {
        if (cancelled) return;
        console.error("[liff] link failed:", err);
        setPhase("error");
        setMessage("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, router, next]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      {(phase === "loading" || phase === "linking") && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="mt-4 text-muted-foreground">
            {phase === "linking" ? "กำลังเชื่อมต่อบัญชี LINE..." : "กำลังโหลด..."}
          </p>
        </>
      )}

      {phase === "linked" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-brand" />
          <p className="mt-4 whitespace-pre-wrap font-medium">{message}</p>
        </>
      )}

      {phase === "needs-login" && (
        <>
          <p className="mb-4 text-muted-foreground">เข้าสู่ระบบก่อนเพื่อเชื่อมต่อบัญชี LINE</p>
          <Button
            onClick={() =>
              router.push(`/login?callbackUrl=${encodeURIComponent(`/line/liff?next=${next}`)}`)
            }
          >
            เข้าสู่ระบบ
          </Button>
        </>
      )}

      {phase === "error" && (
        <>
          <XCircle className="h-12 w-12 text-destructive" />
          <p className="mt-4 text-muted-foreground">{message}</p>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/profile")}>
            กลับไปหน้าโปรไฟล์
          </Button>
        </>
      )}
    </div>
  );
}
