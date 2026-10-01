/**
 * Exam-date countdown for LINE notifications.
 *
 * Exam dates come from the Pharmacy Council's registration page and change
 * each round — update EXAM_SCHEDULE when a new round is announced. Rounds
 * whose exam date has passed are ignored automatically.
 */

export type CountdownExam = "PLE-PC" | "PLE-CC1";

export interface ExamRound {
  /** Stable id used in the dedupe ref — never reuse across rounds. */
  id: string;
  /** Matches users.target_exam. */
  targetExam: CountdownExam;
  /** Short name shown in messages, e.g. "CC1 ครั้งที่ 6/2569". */
  label: string;
  /** First exam day, YYYY-MM-DD (Gregorian, Bangkok date). */
  examDate: string;
}

export const EXAM_SCHEDULE: ExamRound[] = [
  { id: "pc1-5-2569", targetExam: "PLE-PC", label: "PC1 ครั้งที่ 5/2569", examDate: "2026-12-13" },
  { id: "cc1-6-2569", targetExam: "PLE-CC1", label: "CC1 ครั้งที่ 6/2569", examDate: "2026-12-12" },
];

/** Days-before-exam on which a countdown message goes out. */
export const COUNTDOWN_MILESTONES = [30, 14, 7, 3, 1] as const;
export type CountdownMilestone = (typeof COUNTDOWN_MILESTONES)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from `today` to `examDate` (both YYYY-MM-DD, Bangkok dates). */
export function daysUntil(examDate: string, today: string): number {
  return Math.round((Date.parse(`${examDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS);
}

/** The next upcoming round (exam date today or later) for a target exam. */
export function upcomingRound(
  targetExam: string | null | undefined,
  today: string,
  schedule: ExamRound[] = EXAM_SCHEDULE
): ExamRound | null {
  const rounds = schedule
    .filter((r) => r.targetExam === targetExam && daysUntil(r.examDate, today) >= 0)
    .sort((a, b) => a.examDate.localeCompare(b.examDate));
  return rounds[0] ?? null;
}

export function milestoneFor(daysLeft: number): CountdownMilestone | null {
  return COUNTDOWN_MILESTONES.find((m) => m === daysLeft) ?? null;
}

export interface CountdownCopy {
  title: string;
  body: string;
  buttonLabel: string;
  path: string;
}

export const COUNTDOWN_COPY: Record<CountdownMilestone, CountdownCopy> = {
  30: {
    title: "📅 เหลืออีก 1 เดือน!",
    body: "ถึงเวลาวางแผนอ่าน 4 สัปดาห์สุดท้าย ไล่ทบทวนวิชาที่ยังไม่มั่นใจก่อน แล้วฝึกโจทย์ทุกวันให้เป็นนิสัย",
    buttonLabel: "เริ่มฝึกทำข้อสอบ",
    path: "/ple/practice",
  },
  14: {
    title: "📝 เหลืออีก 14 วัน",
    body: "ลองทำข้อสอบเสมือนจริงแบบจับเวลา จะได้รู้ว่าพร้อมแค่ไหนและควรเก็บเรื่องไหนเพิ่มใน 2 สัปดาห์นี้",
    buttonLabel: "ทำ Mock Exam",
    path: "/ple/mock",
  },
  7: {
    title: "🎯 เหลืออีก 7 วัน",
    body: "สัปดาห์สุดท้ายแล้ว! โฟกัสจุดอ่อนจากข้อที่เคยทำผิด ไม่ต้องอ่านเรื่องใหม่ทั้งหมด",
    buttonLabel: "ดูสถิติและจุดอ่อน",
    path: "/dashboard",
  },
  3: {
    title: "⚡ เหลืออีก 3 วัน",
    body: "ทบทวนเรื่องที่ออกสอบบ่อยแบบสั้น ๆ และพักผ่อนให้เพียงพอ สมองจะจำได้ดีกว่าอ่านโต้รุ่ง",
    buttonLabel: "ทบทวนบทเรียนสั้น",
    path: "/learn",
  },
  1: {
    title: "🍀 พรุ่งนี้สอบแล้ว!",
    body: "เช็กของให้พร้อม: บัตรประชาชน/บัตรประจำตัวสอบ ดินสอ-ปากกา และเส้นทางไปสนามสอบ คืนนี้นอนเร็ว ๆ ขอให้โชคดีนะ!",
    buttonLabel: "เปิด PharmRoo",
    path: "/dashboard",
  },
};

/** One-line daily reminder shown in the last week, e.g. "⏳ เหลืออีก 5 วันสอบ CC1 ครั้งที่ 6/2569". */
export function countdownLine(round: ExamRound, daysLeft: number): string | null {
  if (daysLeft < 1 || daysLeft > 7) return null;
  return daysLeft === 1
    ? `⏳ พรุ่งนี้สอบ ${round.label} แล้ว สู้ ๆ!`
    : `⏳ เหลืออีก ${daysLeft} วันสอบ ${round.label}`;
}
