// ความคืบหน้าของผู้เล่นที่ยังไม่ล็อกอิน — เก็บใน localStorage ของเครื่อง
//
// จุดขายคือ "เล่นได้เลย ไม่ต้องสมัคร" — เก็บไว้แล้วยกเข้าบัญชีตอนล็อกอิน
// (claimLocalRuns ใน record.ts) ทำให้ประโยค "ล็อกอินเพื่อเก็บผลที่เล่นไว้"
// เป็นเรื่องจริง

import type { Grade } from "./types";

export interface LocalRun {
  slug: string;
  won: boolean;
  grade: Grade;
  score: number;
  difficulty: string;
  xp: number;
  /** epoch ms ตอนเล่นจบ */
  at: number;
}

export interface LocalProgress {
  xp: number;
  wins: number;
  played: number;
  runs: LocalRun[];
}

export const LOCAL_PROGRESS_KEY = "pharmroo_game_local_progress";
const KEY = LOCAL_PROGRESS_KEY;

/**
 * เพดานจำนวน run ที่เก็บ — localStorage มีโควตาราว 5MB ต่อ origin
 * 200 รอบพอสำหรับคนที่เล่นหนักมากก่อนจะยอมสมัคร
 */
export const MAX_LOCAL_RUNS = 200;

const isBrowser = typeof window !== "undefined";

/** สรุปยอดจากรายการ run — pure เพื่อให้เทสต์ได้ */
export function summarizeLocal(runs: readonly LocalRun[]): LocalProgress {
  let xp = 0;
  let wins = 0;
  for (const run of runs) {
    xp += Number.isFinite(run.xp) && run.xp > 0 ? run.xp : 0;
    if (run.won) wins += 1;
  }
  return { xp, wins, played: runs.length, runs: [...runs] };
}

/**
 * กรองเฉพาะ run ที่หน้าตาถูกต้อง — localStorage ผู้ใช้แก้เองได้ และข้อมูลจาก
 * เวอร์ชันเก่าอาจคนละรูป จึงห้ามเชื่อสิ่งที่อ่านมาโดยไม่ตรวจ
 */
export function isValidRun(value: unknown): value is LocalRun {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.slug === "string" && r.slug.length > 0 &&
    typeof r.won === "boolean" &&
    typeof r.grade === "string" && r.grade.length > 0 &&
    typeof r.difficulty === "string" && r.difficulty.length > 0 &&
    typeof r.score === "number" && Number.isFinite(r.score) &&
    typeof r.xp === "number" && Number.isFinite(r.xp) &&
    typeof r.at === "number" && Number.isFinite(r.at)
  );
}

export function parseLocalRuns(raw: string | null): LocalRun[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidRun).slice(-MAX_LOCAL_RUNS);
  } catch {
    return [];
  }
}

export function readLocalRuns(): LocalRun[] {
  if (!isBrowser) return [];
  try {
    return parseLocalRuns(localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

/** เพิ่ม 1 รอบแล้วคืนรายการล่าสุด — เขียนไม่ได้ก็ไม่พัง (โหมดส่วนตัว/โควตาเต็ม) */
export function appendLocalRun(run: LocalRun): LocalRun[] {
  const runs = [...readLocalRuns(), run].slice(-MAX_LOCAL_RUNS);
  if (isBrowser) {
    try {
      localStorage.setItem(KEY, JSON.stringify(runs));
    } catch {
      // เต็มหรือถูกปิด — ยังคืนค่าให้จอ debrief แสดงรอบนี้ได้ตามปกติ
    }
  }
  return runs;
}

export function clearLocalRuns(): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ไม่เป็นไร
  }
}
