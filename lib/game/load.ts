// จุดรวมการโหลดโจทย์ — วันนี้มีแต่ built-in; ถ้าเพิ่มโจทย์ใน DB ให้ต่อที่นี่
// (ตรวจด้วย isValidScenario ก่อนคืนเสมอ)

import { getBuiltinScenario } from "./scenarios";
import type { GameScenario } from "./types";

export async function getScenario(slug: string): Promise<GameScenario | null> {
  return getBuiltinScenario(slug);
}
