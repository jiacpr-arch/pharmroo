import { describe, expect, it } from "vitest";
import { parseClaimInput, parseRunInput } from "./run-input";
import { MAX_LOCAL_RUNS } from "./local-progress";

const slugs = new Set(["headache-warfarin-01"]);
const good = {
  slug: "headache-warfarin-01",
  difficulty: "normal",
  won: true,
  grade: "S",
  score: 100,
  wrong: 0,
  durationSec: 120,
  timeline: [{ t: 0, ok: true, text: "x" }, { t: 20, ok: false, text: "y", note: "why" }],
  referred: true,
  dispensed: 1,
};

describe("parseRunInput", () => {
  it("accepts a well-formed payload and normalises numbers", () => {
    const out = parseRunInput({ ...good, score: 99.9, dispensed: 2.7 }, slugs);
    expect(out).not.toBeNull();
    expect(out!.score).toBe(99);
    expect(out!.dispensed).toBe(2);
    expect(out!.timeline).toHaveLength(2);
    expect(out!.timeline[0]).not.toHaveProperty("note");
  });

  it("rejects unknown slug, bad difficulty/grade, and bad numbers", () => {
    expect(parseRunInput({ ...good, slug: "nope" }, slugs)).toBeNull();
    expect(parseRunInput({ ...good, difficulty: "insane" }, slugs)).toBeNull();
    expect(parseRunInput({ ...good, grade: "Z" }, slugs)).toBeNull();
    expect(parseRunInput({ ...good, score: -1 }, slugs)).toBeNull();
    expect(parseRunInput({ ...good, wrong: "3" }, slugs)).toBeNull();
    expect(parseRunInput({ ...good, won: "yes" }, slugs)).toBeNull();
    expect(parseRunInput(null, slugs)).toBeNull();
  });

  it("rejects oversized or malformed timelines", () => {
    const big = Array.from({ length: 201 }, () => ({ t: 0, ok: true, text: "x" }));
    expect(parseRunInput({ ...good, timeline: big }, slugs)).toBeNull();
    expect(parseRunInput({ ...good, timeline: [{ t: "0", ok: true, text: "x" }] }, slugs)).toBeNull();
    expect(parseRunInput({ ...good, timeline: undefined }, slugs)?.timeline).toEqual([]);
  });
});

describe("parseClaimInput", () => {
  const run = { slug: "headache-warfarin-01", won: true, grade: "A", score: 85, difficulty: "normal", xp: 100, at: 1 };

  it("keeps only valid runs with known slugs and caps the count", () => {
    const runs = [run, { ...run, slug: "nope" }, { ...run, grade: "Q" }, { ...run, difficulty: "x" }, { slug: "bad" }];
    expect(parseClaimInput({ runs }, slugs)).toHaveLength(1);
    const many = Array.from({ length: MAX_LOCAL_RUNS + 10 }, (_, i) => ({ ...run, at: i }));
    expect(parseClaimInput({ runs: many }, slugs)).toHaveLength(MAX_LOCAL_RUNS);
  });

  it("returns [] for non-object bodies", () => {
    expect(parseClaimInput(null, slugs)).toEqual([]);
    expect(parseClaimInput({ runs: "x" }, slugs)).toEqual([]);
  });
});
