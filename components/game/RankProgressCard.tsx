"use client";

import { ChevronRight, GraduationCap } from "lucide-react";
import type { RankDelta } from "@/lib/game/rank";
import "./rank-card.css";

/**
 * ความคืบหน้าของ "ตัวละคร" ท้ายเกม — ยศเภสัชกร
 * คืน null เงียบ ๆ เมื่ออ่านยศไม่ได้ เพื่อไม่ให้จอ debrief พังเพราะข้อมูลเสริม
 */
export default function RankProgressCard({ rankAfter, rankBefore, rankedUp }: RankDelta) {
  if (!rankAfter) return null;
  const { rank, next, xpIntoRank, xpForNext, progress } = rankAfter;

  return (
    <div className="cbs-rank-card">
      {rankedUp && rankBefore && (
        <div className="cbs-rank-up">
          <span className="cbs-rank-up-label">เลื่อนขั้น!</span>
          <span className="cbs-rank-up-path">
            {rankBefore.rank.title}
            <ChevronRight size={14} strokeWidth={3} aria-hidden />
            <strong>{rank.title}</strong>
          </span>
        </div>
      )}

      <div className="cbs-rank-head">
        <span className="cbs-rank-icon" aria-hidden>{rank.icon}</span>
        <div className="cbs-rank-name">
          <span className="cbs-rank-title">{rank.title}</span>
          <span className="cbs-rank-trait">{rank.trait}</span>
        </div>
      </div>

      {next ? (
        <div className="cbs-rank-bar-wrap">
          <div
            className="cbs-rank-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`ความคืบหน้าไปยัง${next.title}`}
          >
            <span className="cbs-rank-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="cbs-rank-bar-cap">
            อีก {(xpForNext - xpIntoRank).toLocaleString("th-TH")} XP ถึง{" "}
            <strong>{next.title}</strong>
          </div>
        </div>
      ) : (
        <div className="cbs-rank-bar-cap cbs-rank-maxed">
          <GraduationCap size={14} strokeWidth={2.4} aria-hidden /> ขั้นสูงสุดของสายร้านยาแล้ว
        </div>
      )}
    </div>
  );
}
