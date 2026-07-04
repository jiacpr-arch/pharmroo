import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mcqQuestions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import {
  getUserCreditBalance,
  spendCreditForUnlock,
} from "@/lib/db/queries-credits";
import { isPaidMember } from "@/lib/credits-gate";

/**
 * Spend 1 credit to unlock a question's detailed explanation.
 * On success (or if already owned) returns the detailed explanation content,
 * which the client renders in place of the locked prompt. 402 = out of credits.
 * Paid members are never charged — their subscription already covers it.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const question = await db
    .select({ detailed_explanation: mcqQuestions.detailed_explanation })
    .from(mcqQuestions)
    .where(and(eq(mcqQuestions.id, id), eq(mcqQuestions.status, "active")))
    .then((rows) => rows[0]);

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
  // Legacy rows may store the JSONB double-encoded as a string.
  let detailedExplanation = question.detailed_explanation;
  if (typeof detailedExplanation === "string") {
    try {
      detailedExplanation = JSON.parse(detailedExplanation);
    } catch {
      // keep as-is
    }
  }
  if (!detailedExplanation) {
    return NextResponse.json({ error: "No detailed explanation" }, { status: 400 });
  }

  const membershipType = (session.user as { membership_type?: string })
    .membership_type;
  if (isPaidMember(membershipType)) {
    return NextResponse.json({
      status: "member",
      credit_balance: await getUserCreditBalance(session.user.id),
      detailed_explanation: detailedExplanation,
    });
  }

  const result = await spendCreditForUnlock(session.user.id, id);

  if (result.status === "insufficient") {
    return NextResponse.json(
      { status: result.status, credit_balance: result.balance },
      { status: 402 }
    );
  }

  return NextResponse.json({
    status: result.status,
    credit_balance: result.balance,
    detailed_explanation: detailedExplanation,
  });
}
