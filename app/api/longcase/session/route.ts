import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { longCaseSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Update Long Case session (advance phase, save data).
 */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = (await request.json()) as {
    sessionId: string;
    phase?: string;
    historyMessages?: unknown[];
    selectedPe?: unknown[];
    selectedLabs?: unknown[];
    diagnosisSubmission?: unknown;
    examinerMessages?: unknown[];
    scores?: unknown;
    totalScore?: number;
  };

  const updates: Record<string, unknown> = {};
  if (body.phase) updates.phase = body.phase;
  if (body.historyMessages) updates.history_messages = body.historyMessages;
  if (body.selectedPe) updates.selected_pe = body.selectedPe;
  if (body.selectedLabs) updates.selected_labs = body.selectedLabs;
  if (body.diagnosisSubmission)
    updates.diagnosis_submission = body.diagnosisSubmission;
  if (body.examinerMessages) updates.examiner_messages = body.examinerMessages;
  if (body.scores) updates.scores = body.scores;
  if (body.totalScore !== undefined) updates.total_score = body.totalScore;
  if (body.phase === "completed")
    updates.completed_at = new Date().toISOString();

  await db
    .update(longCaseSessions)
    .set(updates)
    .where(eq(longCaseSessions.id, body.sessionId));

  return NextResponse.json({ ok: true });
}
