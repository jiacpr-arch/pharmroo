// XP และ badge ของเกมร้านยา — pure ล้วน (client และ API route ใช้ร่วมกัน)
// ห้าม import อะไรที่แตะ DB ในไฟล์นี้

import type { Grade } from "./types";

/** XP ตามเกรด (แพ้ได้ปลอบใจ 10) */
export const GAME_XP: Record<Grade, number> = { S: 150, A: 100, B: 60, C: 30 };
export const GAME_XP_LOSS = 10;

export const GRADES: readonly Grade[] = ["S", "A", "B", "C"];

export function isGrade(x: unknown): x is Grade {
  return typeof x === "string" && (GRADES as readonly string[]).includes(x);
}

export function xpForRun(won: boolean, grade: Grade): number {
  return won ? GAME_XP[grade] : GAME_XP_LOSS;
}

/** badge ของเกม — เก็บใน user_challenges เหมือน challenge อื่นของแอป */
export const GAME_BADGES = {
  firstWin: "game_first_win",
  gradeS: "game_grade_s",
  noMistake: "game_no_mistake",
} as const;

export const GAME_BADGE_NAMES: Record<string, string> = {
  [GAME_BADGES.firstWin]: "จ่ายยาสำเร็จครั้งแรก",
  [GAME_BADGES.gradeS]: "เภสัชกรเกรด S",
  [GAME_BADGES.noMistake]: "ไร้ที่ติ — ไม่พลาดสักข้อ",
};
