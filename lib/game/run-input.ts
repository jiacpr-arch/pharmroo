// ตรวจ payload ที่ client ส่งมาบันทึกผล — pure ล้วน ใช้ได้ทั้ง API route และเทสต์
//
// แอปนี้ไม่มี zod จึงตรวจมือแบบเดียวกับ isValidRun ใน local-progress.ts
// ห้ามเชื่อ xp จาก client — API คำนวณเองจาก won/grade เสมอ

import { DIFFICULTY_IDS } from "./engine";
import { isValidRun, MAX_LOCAL_RUNS, type LocalRun } from "./local-progress";
import type { Grade, TimelineItem } from "./types";
import { isGrade } from "./xp";

export interface RunInput {
  slug: string;
  difficulty: string;
  won: boolean;
  grade: Grade;
  score: number;
  wrong: number;
  durationSec: number;
  timeline: TimelineItem[];
  referred: boolean;
  dispensed: number;
}

const MAX_TIMELINE = 200;

function isFiniteInt(x: unknown, min = 0): x is number {
  return typeof x === "number" && Number.isFinite(x) && x >= min;
}

function isTimelineItem(x: unknown): x is TimelineItem {
  if (!x || typeof x !== "object") return false;
  const it = x as Record<string, unknown>;
  return (
    typeof it.t === "number" && Number.isFinite(it.t) &&
    typeof it.ok === "boolean" &&
    typeof it.text === "string" && it.text.length <= 500 &&
    (it.note === undefined || (typeof it.note === "string" && it.note.length <= 1000))
  );
}

/** คืน null เมื่อ payload ผิดรูป — route ตอบ 400 */
export function parseRunInput(body: unknown, knownSlugs: ReadonlySet<string>): RunInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.slug !== "string" || !knownSlugs.has(b.slug)) return null;
  if (typeof b.difficulty !== "string" || !DIFFICULTY_IDS.includes(b.difficulty)) return null;
  if (typeof b.won !== "boolean") return null;
  if (!isGrade(b.grade)) return null;
  if (!isFiniteInt(b.score) || !isFiniteInt(b.wrong) || !isFiniteInt(b.durationSec)) return null;
  const timelineRaw = Array.isArray(b.timeline) ? b.timeline : [];
  if (timelineRaw.length > MAX_TIMELINE || !timelineRaw.every(isTimelineItem)) return null;
  return {
    slug: b.slug,
    difficulty: b.difficulty,
    won: b.won,
    grade: b.grade,
    score: Math.floor(b.score),
    wrong: Math.floor(b.wrong),
    durationSec: Math.floor(b.durationSec),
    timeline: timelineRaw.map((it) => ({ t: it.t, ok: it.ok, text: it.text, ...(it.note ? { note: it.note } : {}) })),
    referred: b.referred === true,
    dispensed: isFiniteInt(b.dispensed) ? Math.floor(b.dispensed) : 0,
  };
}

/** กรอง run ที่ยกจากเครื่องมา — ทิ้งตัวที่ผิดรูป/slug ไม่รู้จัก และตัดที่เพดาน */
export function parseClaimInput(body: unknown, knownSlugs: ReadonlySet<string>): LocalRun[] {
  if (!body || typeof body !== "object") return [];
  const runs = (body as Record<string, unknown>).runs;
  if (!Array.isArray(runs)) return [];
  return runs
    .filter(isValidRun)
    .filter((r) => knownSlugs.has(r.slug) && isGrade(r.grade) && DIFFICULTY_IDS.includes(r.difficulty))
    .slice(-MAX_LOCAL_RUNS);
}
