"use client";

import { useEffect, useState } from "react";
import { Sparkles, Clock, BookOpen } from "lucide-react";

interface Props {
  totalActive: number;
  newThisWeek: number;
  nextReleaseAt: string; // ISO string
}

function useCountdown(targetIso: string) {
  const calcRemaining = () => {
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { days: d, hours: h, minutes: m, seconds: s, done: false };
  };

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return remaining;
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 border border-white/20 rounded-lg px-3 py-1.5 min-w-[48px] text-center">
        <span className="font-mono font-bold text-white text-xl leading-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-white/40 text-[10px] mt-1">{label}</span>
    </div>
  );
}

export default function NewQuestionsCountdown({ totalActive, newThisWeek, nextReleaseAt }: Props) {
  const { days, hours, minutes, seconds, done } = useCountdown(nextReleaseAt);

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm">
          <BookOpen className="h-3.5 w-3.5 text-brand-light" />
          <span className="font-bold text-brand-light">{totalActive.toLocaleString()}</span>
          <span className="text-white/70">ข้อสอบทั้งหมด</span>
        </div>
        {newThisWeek > 0 && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 rounded-full px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-bold text-green-200">+{newThisWeek}</span>
            <span>ข้อใหม่สัปดาห์นี้</span>
          </div>
        )}
      </div>

      {/* Countdown */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <Clock className="h-3.5 w-3.5" />
          {done ? (
            <span className="text-green-300 font-medium">✨ ข้อสอบชุดใหม่พร้อมแล้ว!</span>
          ) : (
            <span>ข้อสอบชุดใหม่เพิ่มในอีก</span>
          )}
        </div>
        {!done && (
          <div className="flex items-end gap-2">
            {days > 0 && <Digit value={days} label="วัน" />}
            <Digit value={hours} label="ชม." />
            <span className="text-white/40 font-bold text-xl mb-4">:</span>
            <Digit value={minutes} label="นาที" />
            <span className="text-white/40 font-bold text-xl mb-4">:</span>
            <Digit value={seconds} label="วินาที" />
          </div>
        )}
      </div>
    </div>
  );
}
