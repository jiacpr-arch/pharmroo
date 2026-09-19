import { db } from "./index";
import { aiChatLogs } from "./schema";
import { and, eq, sql } from "drizzle-orm";

/** Count AI-chat questions a user has asked within the last `withinSeconds`. */
export async function countRecentAiChats(
  userId: string,
  withinSeconds: number
): Promise<number> {
  const since = sql`to_char(now() - (${withinSeconds} || ' seconds')::interval, 'YYYY-MM-DD HH24:MI:SS')`;
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(aiChatLogs)
    .where(
      and(
        eq(aiChatLogs.user_id, userId),
        sql`${aiChatLogs.created_at} >= ${since}`
      )
    )
    .then((rows) => rows[0]);
  return Number(row?.count ?? 0);
}

/** Record an AI-chat question for rate-limiting and auditing. */
export async function recordAiChatQuestion(params: {
  user_id: string;
  question_id?: string | null;
  user_question: string;
  status: "answered" | "failed";
}): Promise<void> {
  await db.insert(aiChatLogs).values({
    user_id: params.user_id,
    question_id: params.question_id ?? null,
    user_question: params.user_question,
    status: params.status,
  });
}
