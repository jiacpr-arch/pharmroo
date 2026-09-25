// Story engine — ส่วน logic ล้วนของเกมตัดสินใจ (ไม่มี DOM/React)
//
// ตอบถูก → node ใน then ของตัวเลือกถูก run ก่อนแล้วไปข้อถัดไป
// ตอบผิด → หัก HP (ความปลอดภัยผู้ป่วย), เล่นจุดตัดสินใจเดิมซ้ำ

import type { ChoiceOption, Grade, NodeFx, GameState, StoryNode } from "./types";

export interface Difficulty {
  id: string;
  label: string;
  decisionTime: number;
  hp: number;
  hints: boolean;
  showWhyOnWrong: boolean;
  gradeStrict: boolean;
}

// ระดับความยาก — คุมเวลาตัดสินใจ, จำนวน HP, การใบ้/เฉลย, และความเข้มของ grade
export const DIFFICULTY: Record<string, Difficulty> = {
  easy: { id: "easy", label: "ง่าย", decisionTime: 30, hp: 7, hints: true, showWhyOnWrong: true, gradeStrict: false },
  normal: { id: "normal", label: "ปกติ", decisionTime: 20, hp: 5, hints: false, showWhyOnWrong: true, gradeStrict: false },
  hard: { id: "hard", label: "ยาก", decisionTime: 12, hp: 3, hints: false, showWhyOnWrong: false, gradeStrict: true },
};
export const DEFAULT_DIFFICULTY = "normal";
export const DIFFICULTY_IDS = Object.keys(DIFFICULTY);

export function getDifficulty(id: string): Difficulty {
  return DIFFICULTY[id] || DIFFICULTY[DEFAULT_DIFFICULTY];
}

export function createInitialState(difficultyId: string = DEFAULT_DIFFICULTY): GameState {
  const diff = getDifficulty(difficultyId);
  return {
    difficulty: diff.id,
    ptr: 0,
    queue: [],
    simTime: 0,
    hp: diff.hp,
    maxHp: diff.hp,
    wrong: 0,
    timeline: [],
    referred: false,
    dispensed: 0,
    counseled: false,
    labelDraft: [],
  };
}

// ผลของ node ต่อสถานะเคส (mutate state ที่ถือใน ref ของหน้าเกม)
// `alert` เป็นเอฟเฟกต์เสียง/ภาพล้วน — ไม่แตะ state
export function applyFx(state: GameState, fx?: NodeFx): void {
  if (!fx) return;
  if (fx.refer) state.referred = true;
  if (fx.dispense) state.dispensed += 1;
  if (fx.counsel) state.counseled = true;
}

// ดึง node ถัดไป — queue (จาก then ของตัวเลือก) มาก่อน story หลัก
export function nextNode(state: GameState, story: StoryNode[]): StoryNode | null {
  if (state.queue.length) return state.queue.shift() ?? null;
  if (state.ptr < story.length) return story[state.ptr++];
  return null;
}

export function recordCorrect(state: GameState, option: ChoiceOption): void {
  state.timeline.push({ t: state.simTime, ok: true, text: option.label });
  state.simTime += 8;
  if (option.onLabel) state.labelDraft.push(option.onLabel);
  state.queue.push(...(option.then || []));
}

/** ดึงฉลากที่สะสมไว้ออกมาแสดง แล้วเคลียร์ร่างทิ้ง — กันบรรทัดเก่าค้างข้ามฉลากถัดไป */
export function takeLabelDraft(state: GameState): { heading: string; text: string }[] {
  const draft = state.labelDraft;
  state.labelDraft = [];
  return draft;
}

export function recordWrong(state: GameState, option: ChoiceOption): void {
  state.wrong += 1;
  state.hp = Math.max(0, state.hp - 1);
  state.simTime += 20; // ความผิดพลาดกินเวลาเสมอ
  state.timeline.push({
    t: state.simTime,
    ok: false,
    text: option.timeout ? "(หมดเวลา — ไม่ได้ตัดสินใจ)" : "ตัดสินใจพลาด",
    note: option.why,
  });
}

export function gradeFor(state: GameState, won: boolean): Grade {
  if (!won) return "C";
  const strict = getDifficulty(state.difficulty).gradeStrict;
  if (strict) {
    // โหมดยาก: เกณฑ์เข้มขึ้น (ผิดแม้ครั้งเดียวก็ตกจาก S)
    if (state.wrong === 0) return "S";
    if (state.wrong === 1) return "B";
    return "C";
  }
  if (state.wrong === 0) return "S";
  if (state.wrong === 1) return "A";
  if (state.wrong <= 3) return "B";
  return "C";
}

export function scoreFor(state: GameState, won: boolean): number {
  return won ? Math.max(10, 100 - state.wrong * 15) : 0;
}

export function fmtTime(s: number): string {
  if (s < 0) return "--:--";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
