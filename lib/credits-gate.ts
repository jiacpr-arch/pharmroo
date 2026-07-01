import type { McqQuestion } from "@/lib/types-mcq";

/**
 * Server-side gating for detailed explanations.
 *
 * The full question (including `detailed_explanation`) is sent to the client to
 * render. Paid members and users who have unlocked a specific question with a
 * credit see the real content. For everyone else we strip the sensitive parts
 * (reason, per-choice explanations, calculation steps, key takeaway) BEFORE the
 * data leaves the server, so it can't be read out of the page props. The short
 * `summary` is kept because the free tier already shows it, and `detailed_locked`
 * tells the client to render the "unlock with 1 credit" prompt.
 */
export function gateQuestionsForViewer(
  questions: McqQuestion[],
  opts: { isPaid: boolean; unlockedIds: Iterable<string> }
): McqQuestion[] {
  if (opts.isPaid) {
    return questions.map((q) => ({ ...q, detailed_locked: false }));
  }

  const unlocked = new Set(opts.unlockedIds);

  return questions.map((q) => {
    if (!q.detailed_explanation || unlocked.has(q.id)) {
      return { ...q, detailed_locked: false };
    }
    return {
      ...q,
      detailed_locked: true,
      detailed_explanation: {
        summary: q.detailed_explanation.summary ?? "",
        reason: "",
        choices: [],
        key_takeaway: "",
        calculation_steps: [],
      },
    };
  });
}
