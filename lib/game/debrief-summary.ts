// ตัวช่วย pure สำหรับจอ debrief ท้ายเกม — ไม่มี I/O

import type { TimelineItem } from "./types";

export interface WeakestPoint {
  t: number;
  text: string;
  note: string | null;
  /** จำนวนจุดที่พลาดอื่นๆ นอกจากจุดนี้ — ใช้บอก "และอีก N จุด" */
  moreErrors: number;
}

/**
 * จุดที่พลาดที่ควรโชว์เด่นสุด — เลือกจุดแรกที่มี note (คำอธิบายว่าทำไมผิด)
 * ก่อน ถ้าไม่มีจุดไหนมี note เลยก็ใช้จุดผิดแรกสุดแทน คืน null เมื่อไม่พลาดเลย
 */
export function weakestPoint(timeline: readonly TimelineItem[]): WeakestPoint | null {
  const errors = timeline.filter((it) => !it.ok);
  if (errors.length === 0) return null;
  const withNote = errors.find((it) => it.note && it.note.trim());
  const chosen = withNote ?? errors[0];
  return {
    t: chosen.t,
    text: chosen.text,
    note: chosen.note?.trim() || null,
    moreErrors: errors.length - 1,
  };
}
