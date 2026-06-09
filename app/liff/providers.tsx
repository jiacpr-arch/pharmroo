"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { signIn, useSession } from "next-auth/react";
import type { Liff } from "@line/liff";

type LiffStatus =
  | { state: "idle" }
  | { state: "initializing" }
  | { state: "authenticating" }
  | { state: "ready"; liff: Liff }
  | { state: "error"; message: string };

type LiffContextValue = {
  status: LiffStatus;
  liff: Liff | null;
};

const LiffContext = createContext<LiffContextValue>({
  status: { state: "idle" },
  liff: null,
});

export function useLiff() {
  return useContext(LiffContext);
}

export default function LiffProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<LiffStatus>({ state: "idle" });
  const [liffInstance, setLiffInstance] = useState<Liff | null>(null);
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
      if (!liffId) {
        setStatus({
          state: "error",
          message: "NEXT_PUBLIC_LIFF_ID is not configured",
        });
        return;
      }

      setStatus({ state: "initializing" });
      const { default: liff } = await import("@line/liff");
      try {
        await liff.init({ liffId });
      } catch (err) {
        if (!cancelled) {
          setStatus({
            state: "error",
            message: `LIFF init failed: ${(err as Error).message}`,
          });
        }
        return;
      }

      if (cancelled) return;

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }

      if (sessionStatus === "authenticated") {
        setLiffInstance(liff);
        setStatus({ state: "ready", liff });
        return;
      }

      if (sessionStatus === "loading") return;

      setStatus({ state: "authenticating" });
      const idToken = liff.getIDToken();
      if (!idToken) {
        setStatus({
          state: "error",
          message: "ไม่สามารถดึง ID token จาก LIFF ได้",
        });
        return;
      }

      const result = await signIn("line-liff", {
        idToken,
        redirect: false,
      });

      if (cancelled) return;

      if (result?.error) {
        setStatus({
          state: "error",
          message: `เข้าสู่ระบบไม่สำเร็จ: ${result.error}`,
        });
        return;
      }

      setLiffInstance(liff);
      setStatus({ state: "ready", liff });
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [sessionStatus]);

  if (status.state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-semibold mb-2">เปิด Mini App ไม่สำเร็จ</h1>
          <p className="text-sm text-muted-foreground">{status.message}</p>
        </div>
      </div>
    );
  }

  if (status.state !== "ready") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {status.state === "authenticating"
            ? "กำลังเข้าสู่ระบบ..."
            : "กำลังเตรียม Mini App..."}
        </p>
      </div>
    );
  }

  return (
    <LiffContext.Provider value={{ status, liff: liffInstance }}>
      {children}
    </LiffContext.Provider>
  );
}
