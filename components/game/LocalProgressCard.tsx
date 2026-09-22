"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { LOCAL_PROGRESS_KEY, parseLocalRuns, summarizeLocal } from "@/lib/game/local-progress";
import { xpToRank } from "@/lib/game/rank";

// localStorage เป็น external store — server snapshot เป็น null เสมอ จึงไม่มี hydration mismatch
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
function getSnapshot(): string | null {
  try {
    return localStorage.getItem(LOCAL_PROGRESS_KEY);
  } catch {
    return null;
  }
}
function getServerSnapshot(): string | null {
  return null;
}

/**
 * การ์ดความคืบหน้าของคนที่ยังไม่ล็อกอิน — ไม่มีประวัติในเครื่องก็ไม่แสดงอะไร
 */
export default function LocalProgressCard() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const progress = useMemo(() => {
    const runs = parseLocalRuns(raw);
    return runs.length > 0 ? summarizeLocal(runs) : null;
  }, [raw]);

  if (!progress) return null;
  const { rank, next, xpForNext, xpIntoRank } = xpToRank(progress.xp);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden>{rank.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-amber-900">{rank.title}</p>
          <p className="text-sm text-amber-800">
            เล่นแล้ว {progress.played} เคส · ชนะ {progress.wins} · {progress.xp.toLocaleString("th-TH")} XP
            {next && <> · อีก {(xpForNext - xpIntoRank).toLocaleString("th-TH")} XP ถึง{next.title}</>}
          </p>
          <p className="mt-2 text-xs text-amber-700">
            ผลนี้เก็บอยู่ในเครื่องนี้เท่านั้น —{" "}
            <Link href="/login?callbackUrl=%2Fgame" className="font-semibold underline">
              ล็อกอิน
            </Link>{" "}
            แล้วระบบจะยกเข้าบัญชีให้อัตโนมัติ
          </p>
        </div>
      </div>
    </div>
  );
}
