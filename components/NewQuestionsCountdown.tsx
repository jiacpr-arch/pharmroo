"use client";

import { useEffect, useState } from "react";
import { Sparkles, Clock } from "lucide-react";

interface Props {
  totalActive: number;
  newThisWeek: number;
  nextReleaseAt: string; // ISO string
}

function useCountdown(targetIso: string) {
  const calcRemaining = () => {
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { days: d, hours: h, minutes: m, seconds: s };
  };

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return remaining;
}

export default function NewQuestionsCountdown({ totalActive, newThisWeek, nextReleaseAt }: Props) {
  const { days, hours, minutes, seconds } = useCountdown(nextReleaseAt);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-sm">
      {/* New questions badge */}
      {newThisWeek > 0 && (
        <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 rounded-full px-4 py-2">
          <Sparkles className="h-4 w-4 flex-shrink-0" />
          <span>
            <span className="font-bold text-green-200">{newThisWeek} ข้อสอบใหม่</span>
            {" "}เพิ่มในสัปดาห์นี้
          </span>
        </div>
      )}

      {/* Countdown */}
      <div className="flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-2">
        <Clock className="h-4 w-4 flex-shrink-0 text-brand-light" />
        <span className="text-white/60">ข้อสอบชุดใหม่ใน</span>
        <span className="font-mono font-bold text-white tracking-wide">
          {days > 0 && <>{days}ว </>}
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      {/* Total */}
      <div className="text-white/50 text-xs">
        รวม {totalActive.toLocaleString()} ข้อสอบทั้งหมด
      </div>
    </div>
  );
}
