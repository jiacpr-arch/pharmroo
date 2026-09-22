// บันทึกผลการเล่น (client-safe)
//
// ล็อกอินแล้ว → POST /api/game/run (server คิด XP/badge เอง)
// ยังไม่ล็อกอิน → เก็บใน localStorage แล้วยกเข้าบัญชีทีหลัง (claimPendingLocalRuns)
// ทุกอย่าง non-blocking: พังเงียบๆ ไม่ทำให้จอ debrief ค้าง

import {
  appendLocalRun,
  clearLocalRuns,
  readLocalRuns,
  summarizeLocal,
} from "./local-progress";
import { NO_RANK_DELTA, rankDelta, type RankProgress } from "./rank";
import type { GameState, Grade } from "./types";
import { xpForRun } from "./xp";

export interface GameRunResult {
  won: boolean;
  grade: Grade;
  score: number;
}

export interface RecordedRun {
  loggedIn: boolean;
  /** ยศ/XP ที่แสดงมาจาก localStorage ไม่ใช่บัญชีจริง — จอ debrief ต้องบอกผู้เล่นตามตรง */
  isLocal: boolean;
  /** จำนวนรอบที่เก็บไว้ในเครื่อง (โหมดยังไม่ล็อกอิน) */
  localRuns: number;
  xpEarned: number;
  newBadges: string[];
  rankBefore: RankProgress | null;
  rankAfter: RankProgress | null;
  rankedUp: boolean;
}

function emptyRun(): RecordedRun {
  return { loggedIn: false, isLocal: false, localRuns: 0, xpEarned: 0, newBadges: [], ...NO_RANK_DELTA };
}

function recordLocalRun(slug: string, state: GameState, result: GameRunResult): RecordedRun {
  const xp = xpForRun(result.won, result.grade);
  const runs = appendLocalRun({
    slug,
    won: result.won,
    grade: result.grade,
    score: result.score,
    difficulty: state.difficulty,
    xp,
    at: Date.now(),
  });
  const before = summarizeLocal(runs.slice(0, -1));
  const after = summarizeLocal(runs);
  return {
    loggedIn: false,
    isLocal: true,
    localRuns: runs.length,
    xpEarned: xp,
    newBadges: [],
    ...rankDelta(before.xp, after.xp),
  };
}

/**
 * ยกประวัติที่ค้างในเครื่องเข้าบัญชี — คืนจำนวนรอบที่ยก (0 = ไม่มีอะไรให้ยก
 * หรือยิงไม่สำเร็จ) ล้างเครื่องก่อนยิงเสมอ: ถ้า insert ล้ม ยอมเสียประวัติดีกว่า
 * เสี่ยงยกซ้ำสองรอบแล้ว XP เด้งเป็นเท่าตัว
 */
export async function claimPendingLocalRuns(): Promise<number> {
  const runs = readLocalRuns();
  if (runs.length === 0) return 0;
  clearLocalRuns();
  try {
    const res = await fetch("/api/game/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runs }),
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as { claimed?: number };
    return Number(data.claimed ?? 0);
  } catch {
    return 0;
  }
}

interface RunResponse {
  xpEarned: number;
  newBadges: string[];
  xpBefore: number;
  xpAfter: number;
}

export async function recordGameRun(
  slug: string,
  state: GameState,
  result: GameRunResult,
  loggedIn: boolean,
): Promise<RecordedRun> {
  if (!loggedIn) return recordLocalRun(slug, state, result);
  const out = emptyRun();
  out.loggedIn = true;
  try {
    // ล็อกอินแล้วเจอประวัติค้างในเครื่อง = เพิ่งเข้าระบบ → ยกเข้าบัญชีก่อน
    await claimPendingLocalRuns();

    const res = await fetch("/api/game/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        difficulty: state.difficulty,
        won: result.won,
        grade: result.grade,
        score: result.score,
        wrong: state.wrong,
        durationSec: state.simTime,
        timeline: state.timeline,
        referred: state.referred,
        dispensed: state.dispensed,
      }),
    });
    if (!res.ok) return out;
    const data = (await res.json()) as RunResponse;
    out.xpEarned = data.xpEarned;
    out.newBadges = data.newBadges ?? [];
    Object.assign(out, rankDelta(data.xpBefore, data.xpAfter));
  } catch {
    // Non-blocking
  }
  return out;
}
