import { describe, expect, it } from "vitest";
import {
  COUNTDOWN_COPY,
  COUNTDOWN_MILESTONES,
  countdownLine,
  daysUntil,
  milestoneFor,
  upcomingRound,
  type ExamRound,
} from "./exam-countdown";

const SCHEDULE: ExamRound[] = [
  { id: "cc1-old", targetExam: "PLE-CC1", label: "CC1 old", examDate: "2026-06-10" },
  { id: "cc1-next", targetExam: "PLE-CC1", label: "CC1 ครั้งที่ 6/2569", examDate: "2026-12-12" },
  { id: "cc1-later", targetExam: "PLE-CC1", label: "CC1 later", examDate: "2027-06-12" },
  { id: "pc1-next", targetExam: "PLE-PC", label: "PC1 ครั้งที่ 5/2569", examDate: "2026-12-13" },
];

describe("daysUntil", () => {
  it("counts whole calendar days", () => {
    expect(daysUntil("2026-12-12", "2026-11-12")).toBe(30);
    expect(daysUntil("2026-12-12", "2026-12-11")).toBe(1);
    expect(daysUntil("2026-12-12", "2026-12-12")).toBe(0);
    expect(daysUntil("2026-12-12", "2026-12-13")).toBe(-1);
  });
});

describe("upcomingRound", () => {
  it("picks the nearest round that hasn't happened yet", () => {
    expect(upcomingRound("PLE-CC1", "2026-10-01", SCHEDULE)?.id).toBe("cc1-next");
    expect(upcomingRound("PLE-CC1", "2026-12-12", SCHEDULE)?.id).toBe("cc1-next");
    expect(upcomingRound("PLE-CC1", "2026-12-13", SCHEDULE)?.id).toBe("cc1-later");
  });

  it("returns null for unknown or unscheduled exams", () => {
    expect(upcomingRound("NLE", "2026-10-01", SCHEDULE)).toBeNull();
    expect(upcomingRound(null, "2026-10-01", SCHEDULE)).toBeNull();
    expect(upcomingRound("PLE-PC", "2027-01-01", SCHEDULE)).toBeNull();
  });
});

describe("milestoneFor", () => {
  it("fires only on 30, 14, 7, 3 and 1 days out", () => {
    const fired = Array.from({ length: 40 }, (_, d) => milestoneFor(d)).filter((m) => m !== null);
    expect(fired.sort((a, b) => b - a)).toEqual([30, 14, 7, 3, 1]);
  });

  it("has copy for every milestone", () => {
    for (const m of COUNTDOWN_MILESTONES) expect(COUNTDOWN_COPY[m].path).toMatch(/^\//);
  });
});

describe("countdownLine", () => {
  const round = SCHEDULE[1];

  it("shows only in the last 7 days", () => {
    expect(countdownLine(round, 8)).toBeNull();
    expect(countdownLine(round, 7)).toBe("⏳ เหลืออีก 7 วันสอบ CC1 ครั้งที่ 6/2569");
    expect(countdownLine(round, 2)).toBe("⏳ เหลืออีก 2 วันสอบ CC1 ครั้งที่ 6/2569");
    expect(countdownLine(round, 1)).toContain("พรุ่งนี้สอบ");
    expect(countdownLine(round, 0)).toBeNull();
  });
});
