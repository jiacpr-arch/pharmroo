import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spendCreditForUnlock } from "@/lib/db/queries-credits";
import { getMcqQuestion } from "@/lib/db/queries-mcq";

/**
 * Spend 1 credit to unlock a question's detailed explanation.
 * On success (or if already owned) returns the detailed explanation content,
 * which the client renders in place of the locked prompt. 402 = out of credits.
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
  const question = await getMcqQuestion(id);
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
  if (!question.detailed_explanation) {
    return NextResponse.json({ error: "No detailed explanation" }, { status: 400 });
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
    detailed_explanation: question.detailed_explanation,
  });
}
