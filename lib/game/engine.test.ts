import { describe, expect, it } from "vitest";
import {
  applyFx,
  createInitialState,
  fmtTime,
  getDifficulty,
  gradeFor,
  nextNode,
  recordCorrect,
  recordWrong,
  scoreFor,
  shuffled,
} from "./engine";
import { isValidScenario, parseEmphasis } from "./types";
import type { StoryNode } from "./types";

describe("createInitialState", () => {
  it("uses difficulty hp and defaults", () => {
    const easy = createInitialState("easy");
    expect(easy.hp).toBe(7);
    expect(easy.maxHp).toBe(7);
    expect(easy.referred).toBe(false);
    expect(easy.dispensed).toBe(0);
    const unknown = createInitialState("nope");
    expect(unknown.difficulty).toBe("normal");
    expect(unknown.hp).toBe(getDifficulty("normal").hp);
  });
});

describe("applyFx", () => {
  it("tracks refer/dispense/counsel; alert is ui-only", () => {
    const st = createInitialState();
    applyFx(st, { alert: true });
    expect(st).toMatchObject({ referred: false, dispensed: 0, counseled: false });
    applyFx(st, { dispense: true });
    applyFx(st, { dispense: true, counsel: true });
    applyFx(st, { refer: true });
    expect(st.dispensed).toBe(2);
    expect(st.counseled).toBe(true);
    expect(st.referred).toBe(true);
    applyFx(st, undefined);
    expect(st.dispensed).toBe(2);
  });
});

describe("nextNode", () => {
  it("drains queue before main story", () => {
    const st = createInitialState();
    const story: StoryNode[] = [{ inter: "A" }, { end: true }];
    const queued: StoryNode = { inter: "Q" };
    st.queue.push(queued);
    expect(nextNode(st, story)).toBe(queued);
    expect(nextNode(st, story)).toEqual({ inter: "A" });
    expect(nextNode(st, story)).toEqual({ end: true });
    expect(nextNode(st, story)).toBeNull();
  });
});

describe("record + grade + score", () => {
  it("correct answers push then-nodes and advance clock", () => {
    const st = createInitialState();
    const then: StoryNode[] = [{ inter: "X" }];
    recordCorrect(st, { tgt: "ซักประวัติ", label: "ok", ok: true, then });
    expect(st.simTime).toBe(8);
    expect(st.queue).toEqual(then);
    expect(st.timeline[0].ok).toBe(true);
  });

  it("wrong answers cost hp and time; hp floors at 0", () => {
    const st = createInitialState("hard"); // hp 3
    for (let i = 0; i < 5; i++) {
      recordWrong(st, { tgt: "X", label: "bad", ok: false, why: "เหตุผล" });
    }
    expect(st.hp).toBe(0);
    expect(st.wrong).toBe(5);
    expect(st.simTime).toBe(100);
    expect(st.timeline.every((t) => !t.ok)).toBe(true);
    expect(st.timeline[0].note).toBe("เหตุผล");
  });

  it("timeout is labelled differently from a wrong pick", () => {
    const st = createInitialState();
    recordWrong(st, { tgt: "—", label: "", ok: false, timeout: true });
    expect(st.timeline[0].text).toContain("หมดเวลา");
  });

  it("grades by wrong count, stricter on hard", () => {
    const st = createInitialState("normal");
    expect(gradeFor(st, false)).toBe("C");
    expect(gradeFor(st, true)).toBe("S");
    st.wrong = 1;
    expect(gradeFor(st, true)).toBe("A");
    st.wrong = 3;
    expect(gradeFor(st, true)).toBe("B");
    st.wrong = 4;
    expect(gradeFor(st, true)).toBe("C");
    const hard = createInitialState("hard");
    hard.wrong = 1;
    expect(gradeFor(hard, true)).toBe("B");
  });

  it("score decays with mistakes, zero on loss", () => {
    const st = createInitialState();
    expect(scoreFor(st, true)).toBe(100);
    st.wrong = 2;
    expect(scoreFor(st, true)).toBe(70);
    st.wrong = 99;
    expect(scoreFor(st, true)).toBe(10);
    expect(scoreFor(st, false)).toBe(0);
  });
});

describe("fmtTime / shuffled", () => {
  it("formats mm:ss and dashes for negatives", () => {
    expect(fmtTime(-1)).toBe("--:--");
    expect(fmtTime(0)).toBe("00:00");
    expect(fmtTime(125)).toBe("02:05");
  });

  it("shuffled keeps all members", () => {
    const arr = [1, 2, 3, 4, 5];
    expect([...shuffled(arr)].sort()).toEqual(arr);
  });
});

describe("parseEmphasis / isValidScenario", () => {
  it("splits **em** segments without HTML", () => {
    expect(parseEmphasis("ก่อน **เน้น** หลัง")).toEqual([
      { em: false, text: "ก่อน " },
      { em: true, text: "เน้น" },
      { em: false, text: " หลัง" },
    ]);
    expect(parseEmphasis("ธรรมดา")).toEqual([{ em: false, text: "ธรรมดา" }]);
  });

  it("rejects malformed scenarios", () => {
    expect(isValidScenario(null)).toBe(false);
    expect(isValidScenario({ slug: "x", title: "t", story: [] })).toBe(false);
    expect(isValidScenario({ slug: "x", title: "t", story: [{ choice: { q: "q", options: [{ ok: false }] } }] })).toBe(false);
    expect(isValidScenario({ slug: "x", title: "t", story: [{ skip: "s" }] })).toBe(false);
    expect(isValidScenario({ slug: "x", title: "t", story: [{ say: { who: "a", text: "b" } }, { end: true }] })).toBe(true);
  });
});
