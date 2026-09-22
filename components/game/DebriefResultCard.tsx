"use client";

// "ผลของคุณ" — การ์ดแรกที่เห็นตอนจบเกม: เกรด, จำนวนที่พลาด, เวลา, จุดที่พลาด

import { fmtTime } from "@/lib/game/engine";
import { weakestPoint } from "@/lib/game/debrief-summary";
import type { GameState } from "@/lib/game/types";

interface Props {
  result: { won: boolean; grade: string; score: number };
  state: Pick<GameState, "wrong" | "simTime" | "timeline">;
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="cbs-metric">
      <span className="cbs-metric-label">{label}</span>
      <span className={`cbs-metric-val ${tone ? `cbs-${tone}` : ""}`}>{value}</span>
    </div>
  );
}

export default function DebriefResultCard({ result, state }: Props) {
  const weak = weakestPoint(state.timeline);

  return (
    <div className="cbs-result-card">
      <div className="cbs-result-title">ผลของคุณ</div>
      <div className="cbs-grade-row">
        <div className="cbs-grade-box">
          <span className={`cbs-grade cbs-g-${result.grade.toLowerCase()}`}>{result.grade}</span>
          <span className="cbs-grade-label">GRADE</span>
        </div>
        <div className="cbs-metric-grid">
          <Metric
            label="ตัดสินใจพลาด"
            value={String(state.wrong)}
            tone={state.wrong === 0 ? "good" : state.wrong <= 2 ? "warn" : "badv"}
          />
          <Metric label="เวลาทั้งเคส" value={fmtTime(state.simTime)} tone="" />
        </div>
      </div>

      {weak ? (
        <p className="cbs-result-weak">
          จุดที่พลาด: {weak.text}
          {weak.note && <> — {weak.note}</>}
          {weak.moreErrors > 0 && ` (และอีก ${weak.moreErrors} จุด)`}
        </p>
      ) : (
        <p className="cbs-result-weak cbs-result-weak-clean">ไม่พลาดสักข้อ — ไร้ที่ติ</p>
      )}
    </div>
  );
}
