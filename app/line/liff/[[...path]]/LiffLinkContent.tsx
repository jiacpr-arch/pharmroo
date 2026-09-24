"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveLiffNext } from "@/lib/line-links";

type Phase = "loading" | "signing-in" | "linking" | "done" | "error";

/**
 * LIFF entry point — the LIFF app's endpoint URL is /line/liff, and a deep
 * link like liff.line.me/{liffId}/pricing lands on /line/liff/pricing.
 *
 * - Not logged in to pharmroo: signs in with the LIFF id token (the
 *   "line-liff" credentials provider in lib/auth.ts verifies it with LINE and
 *   finds or creates the account), then continues to the target page.
 * - Already logged in: links the LINE account to the current session.
 */
export default function LiffLinkContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ path?: string[] }>();
  const next = resolveLiffNext(searchParams.get("next"), params.path);

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
        if (!idToken) throw new Error("missing LIFF id token");
        // Lets the server check OA friendship before granting the LINE bonus.
        const accessToken = liff.getAccessToken() ?? "";
        if (cancelled) return;

        if (status === "unauthenticated") {
          setPhase("signing-in");
          const result = await signIn("line-liff", { idToken, accessToken, redirect: false });
          if (cancelled) return;
          if (!result || result.error) {
            setPhase("error");
            setMessage("เข้าสู่ระบบด้วย LINE ไม่สำเร็จ กรุณาลองใหม่ หรือเข้าสู่ระบบด้วยวิธีอื่น");
            return;
          }
          setPhase("done");
          setMessage("เข้าสู่ระบบสำเร็จ!");
          // Full navigation so every component picks up the new session cookie.
          window.location.assign(next);
          return;
        }

        setPhase("linking");
        const res = await fetch("/api/auth/line/liff-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, accessToken }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setPhase("error");
          setMessage(data.error || "เชื่อมต่อไม่สำเร็จ");
          return;
        }

        setPhase("done");
        setMessage(data.bonusMessage || "เชื่อมต่อ LINE สำเร็จแล้ว!");
        setTimeout(() => router.push(next), 1800);
      } catch (err) {
        if (cancelled) return;
        console.error("[liff] failed:", err);
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
      {(phase === "loading" || phase === "signing-in" || phase === "linking") && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="mt-4 text-muted-foreground">
            {phase === "signing-in"
              ? "กำลังเข้าสู่ระบบด้วย LINE..."
              : phase === "linking"
                ? "กำลังเชื่อมต่อบัญชี LINE..."
                : "กำลังโหลด..."}
          </p>
        </>
      )}

      {phase === "done" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-brand" />
          <p className="mt-4 whitespace-pre-wrap font-medium">{message}</p>
        </>
      )}

      {phase === "error" && (
        <>
          <XCircle className="h-12 w-12 text-destructive" />
          <p className="mt-4 text-muted-foreground">{message}</p>
          <div className="mt-4 flex gap-2">
            {status === "unauthenticated" && (
              <Button onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(next)}`)}>
                เข้าสู่ระบบ
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push("/")}>
              กลับหน้าแรก
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
