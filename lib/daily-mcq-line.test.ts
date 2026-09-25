/**
 * Tests for the pure helpers in lib/daily-mcq-line.ts — DB-backed functions
 * (loadDailyQuestion, handleDailyMcqPostback, ...) are exercised via the
 * webhook route in practice and aren't unit-tested here.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/line-flex-templates", () => ({
  buildDailyMcqFlex: vi.fn(),
  buildDailyMcqResultFlex: vi.fn(),
}));

import { bangkokToday, isWithinGrace, DAILY_GRACE_DAYS } from "./daily-mcq-line";

describe("bangkokToday", () => {
  it("returns YYYY-MM-DD in the Asia/Bangkok timezone", () => {
    // 2026-01-01 23:30 UTC = 2026-01-02 06:30 Bangkok (+7)
    const utcLateNight = new Date("2026-01-01T23:30:00Z");
    expect(bangkokToday(utcLateNight)).toBe("2026-01-02");
  });

  it("stays on the same day when UTC and Bangkok agree", () => {
    const noonUtc = new Date("2026-06-15T04:00:00Z"); // 11:00 Bangkok
    expect(bangkokToday(noonUtc)).toBe("2026-06-15");
  });
});

describe("isWithinGrace", () => {
  const NOW = new Date("2026-09-24T12:00:00Z");

  it("is true when never linked (nothing to be graceful about, never blocks)", () => {
    expect(isWithinGrace(null, NOW)).toBe(true);
    expect(isWithinGrace(undefined, NOW)).toBe(true);
  });

  it("is true within the grace window", () => {
    const linkedAt = new Date(NOW.getTime() - (DAILY_GRACE_DAYS - 1) * 24 * 60 * 60 * 1000).toISOString();
    expect(isWithinGrace(linkedAt, NOW)).toBe(true);
  });

  it("is false once the grace window has passed", () => {
    const linkedAt = new Date(NOW.getTime() - (DAILY_GRACE_DAYS + 1) * 24 * 60 * 60 * 1000).toISOString();
    expect(isWithinGrace(linkedAt, NOW)).toBe(false);
  });

  it("is true for an unparseable date (fail open)", () => {
    expect(isWithinGrace("garbage", NOW)).toBe(true);
  });
});
