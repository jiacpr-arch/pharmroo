"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, PlayCircle, ArrowRight } from "lucide-react";
import type { PathUnitSection } from "@/lib/types-learn";

interface ContinueLesson {
  lesson_id: string;
  title_th: string;
  icon: string;
}

/**
 * Compact "learn" promo on the dashboard: resume the in-progress lesson, or
 * suggest the next available one (weak subjects bubble up first).
 */
export default function LearnDashboardCard({
  weakSubjectIds = [],
}: {
  weakSubjectIds?: string[];
}) {
  const [units, setUnits] = useState<PathUnitSection[]>([]);
  const [cont, setCont] = useState<ContinueLesson | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/learn/path")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setUnits(d.units ?? []);
          setCont(d.continueLesson ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || units.length === 0) return null;

  // Suggestion: first available (unlocked, not completed) lesson, preferring weak subjects.
  let suggestion: { lesson_id: string; title_th: string; icon: string } | null =
    null;
  const orderedUnits = [...units].sort((a, b) => {
    const aw = a.subject_id && weakSubjectIds.includes(a.subject_id) ? 0 : 1;
    const bw = b.subject_id && weakSubjectIds.includes(b.subject_id) ? 0 : 1;
    return aw - bw;
  });
  for (const u of orderedUnits) {
    const next = u.lessons.find(
      (l) => !l.locked && l.progress_status !== "completed"
    );
    if (next) {
      suggestion = { lesson_id: next.id, title_th: next.title_th, icon: next.icon };
      break;
    }
  }

  const target = cont ?? suggestion;

  return (
    <div className="rounded-xl border border-brand/20 bg-brand/5 px-5 py-4 flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <GraduationCap className="h-5 w-5 text-brand shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-sm">เรียนรู้ก่อนสอบ</p>
          <p className="text-xs text-muted-foreground truncate">
            {target
              ? `${cont ? "เรียนต่อ" : "แนะนำ"}: ${target.icon} ${target.title_th}`
              : "อ่านบทเรียนสั้น ๆ แล้วทำแบบทดสอบ"}
          </p>
        </div>
      </div>
      <Link href={target ? `/learn/${target.lesson_id}` : "/learn"}>
        <span className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shrink-0">
          {target ? (
            <>
              <PlayCircle className="h-4 w-4" /> {cont ? "ไปต่อ" : "เริ่มเรียน"}
            </>
          ) : (
            <>
              ดูบทเรียน <ArrowRight className="h-4 w-4" />
            </>
          )}
        </span>
      </Link>
    </div>
  );
}
