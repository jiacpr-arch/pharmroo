import { describe, expect, it } from "vitest";
import { SUBJECT_CONFIGS, buildPrompt, explanationMatchesAnswer, pickExamDay } from "./generate-mcq";

const choices = (correct: string) =>
  ["A", "B", "C", "D", "E"].map((label) => ({
    label,
    text: label,
    is_correct: label === correct,
    explanation: "",
  }));

describe("explanationMatchesAnswer", () => {
  it("accepts a consistent question", () => {
    expect(
      explanationMatchesAnswer("A", {
        summary: "คำตอบที่ถูกต้อง: A — 26.3 mL/hr",
        choices: choices("A"),
      })
    ).toBe(true);
  });

  it("rejects when the explanation marks a different choice correct", () => {
    // norepinephrine 4 mg/250 mL @ 0.1 mcg/kg/min, 70 kg: key said B (10.5), explanation said A (26.25)
    expect(
      explanationMatchesAnswer("B", {
        summary: "คำตอบที่ถูกต้อง: B — 10.5 mL/hr",
        choices: choices("A"),
      })
    ).toBe(false);
  });

  it("rejects when the summary names a different answer", () => {
    expect(
      explanationMatchesAnswer("B", {
        summary: "คำตอบที่ถูกต้อง: C. 30.0 mL/hr",
        choices: choices("B"),
      })
    ).toBe(false);
  });

  it("rejects zero or multiple correct choices and missing explanations", () => {
    const multi = choices("A").map((c) => ({ ...c, is_correct: c.label <= "B" }));
    expect(explanationMatchesAnswer("A", { choices: multi })).toBe(false);
    expect(explanationMatchesAnswer("A", { choices: choices("Z") })).toBe(false);
    expect(explanationMatchesAnswer("A", null)).toBe(false);
  });
});

describe("PharmacyLaw generation", () => {
  const law = SUBJECT_CONFIGS.find((s) => s.name === "PharmacyLaw")!;
  const cardio = SUBJECT_CONFIGS.find((s) => s.name === "Cardiovascular")!;

  it("alternates law questions between exam Day 1 and Day 2", () => {
    expect(pickExamDay(law, 0)).toBe(1);
    expect(pickExamDay(law, 1)).toBe(2);
    expect(pickExamDay(cardio, 7)).toBe(1);
  });

  it("keeps the law prompt off pharmacotherapy cases", () => {
    const prompt = buildPrompt(law, 3, 0);
    expect(prompt).toContain("ห้ามออกโจทย์เภสัชบำบัด");
    expect(prompt).not.toContain("บังคับมี patient context");
    expect(prompt).not.toContain("dapagliflozin");
    expect(buildPrompt(cardio, 3, 0)).toContain("บังคับมี patient context");
  });
});
