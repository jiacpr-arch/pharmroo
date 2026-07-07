import { getViewerGate } from "@/lib/credits-gate";
import { getTodayAttemptCount } from "@/lib/db/queries-mcq";
import { GUEST_DAILY_QUESTION_LIMIT, FREE_DAILY_QUESTION_LIMIT } from "@/lib/limits";

export interface PlayAllowance {
  isPaid: boolean;
  isGuest: boolean;
  /** null means unlimited (paid members). */
  dailyLimit: number | null;
  /** Questions already answered today, known to the server. Guests are tracked client-side instead. */
  playedToday: number;
}

/**
 * Daily question-play quota for the current viewer, independent of the
 * credit-based detailed-explanation gate in `lib/credits-gate.ts`.
 */
export async function getPlayAllowance(session: unknown): Promise<PlayAllowance> {
  const { userId, isPaid } = getViewerGate(session);

  if (isPaid) {
    return { isPaid: true, isGuest: false, dailyLimit: null, playedToday: 0 };
  }

  if (!userId) {
    return {
      isPaid: false,
      isGuest: true,
      dailyLimit: GUEST_DAILY_QUESTION_LIMIT,
      playedToday: 0,
    };
  }

  const playedToday = await getTodayAttemptCount(userId);
  return {
    isPaid: false,
    isGuest: false,
    dailyLimit: FREE_DAILY_QUESTION_LIMIT,
    playedToday,
  };
}
