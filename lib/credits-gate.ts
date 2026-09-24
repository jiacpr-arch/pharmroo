import type { McqQuestion } from "@/lib/types-mcq";
import {
  getUserCreditBalance,
  getUserUnlockedQuestionIds,
} from "@/lib/db/queries-credits";
import { isTrialActive } from "@/lib/trial";

/** Single source of truth for which membership types count as paid. */
export function isPaidMember(
  membershipType: string | null | undefined
): boolean {
  return membershipType === "monthly" || membershipType === "yearly";
}

export interface ViewerGate {
  userId: string | null;
  isPaid: boolean;
}

/**
 * Extract viewer identity + paid status from a NextAuth session. An active
 * link-LINE trial counts as paid.
 */
export function getViewerGate(session: unknown): ViewerGate {
  const user = (
    session as {
      user?: {
        id?: string;
        membership_type?: string;
        line_trial_expires_at?: string | null;
      };
    } | null
  )?.user;
  return {
    userId: user?.id ?? null,
    isPaid:
      isPaidMember(user?.membership_type) ||
      isTrialActive(user?.line_trial_expires_at),
  };
}

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
/**
 * Strip the paid parts of a question's detailed explanation, keeping only the
 * free summary, and mark it locked. No-op for questions without one.
 */
export function stripDetailedContent(q: McqQuestion): McqQuestion {
  if (!q.detailed_explanation) return q;
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
}

export function gateQuestionsForViewer(
  questions: McqQuestion[],
  opts: { isPaid: boolean; unlockedIds: Iterable<string> }
): McqQuestion[] {
  if (opts.isPaid) return questions;

  const unlocked = new Set(opts.unlockedIds);

  return questions.map((q) =>
    unlocked.has(q.id) ? q : stripDetailedContent(q)
  );
}

/**
 * One-call viewer gating for server pages that render question components:
 * resolves the viewer from the session, fetches their unlocks (bounded to the
 * served questions) and credit balance, and returns the gated questions.
 * Server-only (touches the database).
 */
export async function gateQuestionsForSession(
  session: unknown,
  questions: McqQuestion[]
): Promise<{ questions: McqQuestion[]; creditBalance: number; isPaid: boolean }> {
  const { userId, isPaid } = getViewerGate(session);

  if (isPaid) {
    return { questions, creditBalance: 0, isPaid };
  }
  if (!userId) {
    return {
      questions: gateQuestionsForViewer(questions, {
        isPaid: false,
        unlockedIds: [],
      }),
      creditBalance: 0,
      isPaid,
    };
  }

  const [unlockedIds, creditBalance] = await Promise.all([
    getUserUnlockedQuestionIds(
      userId,
      questions.map((q) => q.id)
    ),
    getUserCreditBalance(userId),
  ]);

  return {
    questions: gateQuestionsForViewer(questions, { isPaid, unlockedIds }),
    creditBalance,
    isPaid,
  };
}
