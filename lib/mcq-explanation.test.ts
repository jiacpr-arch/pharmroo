import { describe, expect, it } from "vitest";
import { normalizeDetailedExplanation } from "./mcq-explanation";

const choices = [
  { label: "A", text: "Hydroxychloroquine" },
  { label: "B", text: "Methotrexate" },
];
const q = { choices, correct_answer: "B", explanation: "MTX เป็น anchor DMARD" };

describe("normalizeDetailedExplanation", () => {
  it("maps the legacy per-label shape onto the rendered shape", () => {
    const raw = JSON.stringify({ A: "ผิด — ไม่ใช่ anchor drug", B: "ถูก — first-line" });
    expect(normalizeDetailedExplanation(raw, q)).toEqual({
      summary: "MTX เป็น anchor DMARD",
      reason: "MTX เป็น anchor DMARD",
      choices: [
        { label: "A", text: "Hydroxychloroquine", is_correct: false, explanation: "ผิด — ไม่ใช่ anchor drug" },
        { label: "B", text: "Methotrexate", is_correct: true, explanation: "ถูก — first-line" },
      ],
      key_takeaway: "",
    });
  });

  it("keeps the current shape and fills in missing is_correct", () => {
    const raw = {
      summary: "s",
      reason: "r",
      choices: [
        { label: "A", text: "Hydroxychloroquine", explanation: "✗" },
        { label: "B", text: "Methotrexate", explanation: "✓" },
      ],
      key_takeaway: "k",
      calculation_steps: ["1"],
    };
    const out = normalizeDetailedExplanation(raw, q);
    expect(out?.reason).toBe("r");
    expect(out?.calculation_steps).toEqual(["1"]);
    expect(out?.choices.map((c) => c.is_correct)).toEqual([false, true]);
  });

  it("supports legacy string-array choices", () => {
    const out = normalizeDetailedExplanation({ A: "x", B: "y" }, { ...q, choices: ["HCQ", "MTX"] });
    expect(out?.choices.map((c) => c.text)).toEqual(["HCQ", "MTX"]);
  });

  it("returns null for empty or unusable values", () => {
    expect(normalizeDetailedExplanation(null, q)).toBeNull();
    expect(normalizeDetailedExplanation("not json", q)).toBeNull();
    expect(normalizeDetailedExplanation({ foo: 1 }, q)).toBeNull();
  });
});
