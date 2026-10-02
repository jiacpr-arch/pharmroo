import type { McqChoice, McqQuestion } from "@/lib/types-mcq";

type DetailedExplanation = NonNullable<McqQuestion["detailed_explanation"]>;

/**
 * Coerce a stored `detailed_explanation` into the shape the UI renders.
 *
 * Two shapes exist in `mcq_questions`:
 * - current: `{ summary, reason, choices: [{label, text, explanation, is_correct?}], key_takeaway }`
 * - legacy:  `{ "A": "ผิด — ...", "B": "ถูก — ...", ... }` (one string per choice label)
 *
 * Legacy rows used to render an empty "เหตุผลโดยละเอียด" card, so they are mapped
 * onto the current shape using the question's choices and short explanation.
 * `is_correct` is also derived from `correct_answer` when a row omits it.
 */
export function normalizeDetailedExplanation(
  raw: unknown,
  q: { choices: unknown; correct_answer: string; explanation: string | null }
): DetailedExplanation | null {
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;

  const isCurrent = "reason" in obj || "choices" in obj || "summary" in obj;
  if (isCurrent) {
    const de = obj as Partial<DetailedExplanation>;
    return {
      summary: de.summary ?? q.explanation ?? "",
      reason: de.reason ?? "",
      choices: (Array.isArray(de.choices) ? de.choices : []).map((c) => ({
        ...c,
        is_correct: typeof c.is_correct === "boolean" ? c.is_correct : c.label === q.correct_answer,
      })),
      key_takeaway: de.key_takeaway ?? "",
      ...(de.calculation_steps ? { calculation_steps: de.calculation_steps } : {}),
    };
  }

  const perChoice = toChoices(q.choices)
    .filter((c) => typeof obj[c.label] === "string")
    .map((c) => ({
      label: c.label,
      text: c.text,
      is_correct: c.label === q.correct_answer,
      explanation: obj[c.label] as string,
    }));
  if (perChoice.length === 0) return null;

  return {
    summary: q.explanation ?? "",
    reason: q.explanation ?? "",
    choices: perChoice,
    key_takeaway: "",
  };
}

/** Choices may be `[{label, text}]` or a legacy `["text", ...]` (possibly JSON-encoded). */
function toChoices(raw: unknown): McqChoice[] {
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw.map((c, i) => {
    const label = String.fromCharCode(65 + i);
    if (typeof c === "string") return { label, text: c };
    const o = (c ?? {}) as { label?: unknown; text?: unknown };
    return {
      label: typeof o.label === "string" && o.label ? o.label : label,
      text: typeof o.text === "string" ? o.text : "",
    };
  });
}
