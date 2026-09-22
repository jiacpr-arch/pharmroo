import { describe, expect, it } from "vitest";
import { MAX_LOCAL_RUNS, parseLocalRuns, summarizeLocal, type LocalRun } from "./local-progress";

function run(overrides: Partial<LocalRun> = {}): LocalRun {
  return {
    slug: "headache-warfarin-01",
    won: true,
    grade: "A",
    score: 85,
    difficulty: "normal",
    xp: 100,
    at: 1,
    ...overrides,
  };
}

describe("summarizeLocal", () => {
  it("sums xp and counts wins", () => {
    const s = summarizeLocal([run(), run({ won: false, xp: 10 }), run({ xp: -5 })]);
    expect(s.played).toBe(3);
    expect(s.wins).toBe(2);
    expect(s.xp).toBe(110); // negative xp ignored
  });
});

describe("parseLocalRuns", () => {
  it("returns [] for empty or invalid json", () => {
    expect(parseLocalRuns(null)).toEqual([]);
    expect(parseLocalRuns("")).toEqual([]);
    expect(parseLocalRuns("{oops")).toEqual([]);
    expect(parseLocalRuns(JSON.stringify({ a: 1 }))).toEqual([]);
  });

  it("filters malformed entries", () => {
    const raw = JSON.stringify([run(), { slug: "x" }, run({ score: Number.NaN }), null, run({ grade: "" as unknown as LocalRun["grade"] })]);
    expect(parseLocalRuns(raw)).toHaveLength(1);
  });

  it("caps to MAX_LOCAL_RUNS keeping the newest", () => {
    const many = Array.from({ length: MAX_LOCAL_RUNS + 5 }, (_, i) => run({ at: i }));
    const out = parseLocalRuns(JSON.stringify(many));
    expect(out).toHaveLength(MAX_LOCAL_RUNS);
    expect(out[out.length - 1].at).toBe(MAX_LOCAL_RUNS + 4);
  });
});
