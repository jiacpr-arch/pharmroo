import { describe, expect, it } from "vitest";
import { applyFx, createInitialState, nextNode, recordCorrect } from "./engine";
import { GAME_CHARACTERS } from "./characters";
import { GAME_SCENARIOS, GAME_SCENARIO_SLUGS, getBuiltinScenario, nextScenarioSlug } from "./scenarios";
import { isValidScenario, type StoryNode } from "./types";

function walk(nodes: StoryNode[], fn: (n: StoryNode) => void) {
  for (const n of nodes) {
    fn(n);
    if ("choice" in n) {
      for (const o of n.choice.options) if (o.then) walk(o.then, fn);
    }
  }
}

describe("built-in pharmacy scenarios", () => {
  it("have unique slugs and pass the validator", () => {
    const slugs = GAME_SCENARIOS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of GAME_SCENARIOS) expect(isValidScenario(s)).toBe(true);
    expect(GAME_SCENARIO_SLUGS.has(slugs[0])).toBe(true);
  });

  it("reference only registered characters", () => {
    for (const s of GAME_SCENARIOS) {
      walk(s.story, (n) => {
        if ("say" in n) expect(GAME_CHARACTERS[n.say.who], `${s.slug}: ${n.say.who}`).toBeDefined();
      });
    }
  });

  it("every choice has exactly one correct option and each wrong option explains why", () => {
    for (const s of GAME_SCENARIOS) {
      walk(s.story, (n) => {
        if (!("choice" in n)) return;
        const oks = n.choice.options.filter((o) => o.ok);
        expect(oks, `${s.slug}: ${n.choice.q}`).toHaveLength(1);
        for (const o of n.choice.options) {
          if (!o.ok) expect(o.why, `${s.slug}: ${o.label}`).toBeTruthy();
        }
      });
    }
  });

  it("happy path reaches the end and records at least one dispense or referral", () => {
    for (const s of GAME_SCENARIOS) {
      const st = createInitialState();
      let node = nextNode(st, s.story);
      let ended = false;
      let guard = 0;
      while (node && guard++ < 500) {
        if ("say" in node) applyFx(st, node.say.fx);
        if ("inter" in node) applyFx(st, node.fx);
        if ("choice" in node) recordCorrect(st, node.choice.options.find((o) => o.ok)!);
        if ("end" in node) ended = true;
        node = nextNode(st, s.story);
      }
      expect(ended, s.slug).toBe(true);
      expect(st.wrong).toBe(0);
      expect(st.dispensed > 0 || st.referred, s.slug).toBe(true);
    }
  });

  it("lookup and next-slug cycle", () => {
    const first = GAME_SCENARIOS[0].slug;
    const last = GAME_SCENARIOS[GAME_SCENARIOS.length - 1].slug;
    expect(getBuiltinScenario(first)?.slug).toBe(first);
    expect(getBuiltinScenario("nope")).toBeNull();
    expect(nextScenarioSlug(last)).toBe(first);
    expect(nextScenarioSlug(first)).not.toBe(first);
  });
});
