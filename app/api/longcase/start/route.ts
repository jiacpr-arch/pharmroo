import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { longCases, longCaseSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Start a Long Case session.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { caseId } = (await request.json()) as { caseId: string };

  const longCase = await db
    .select()
    .from(longCases)
    .where(eq(longCases.id, caseId))
    .then((rows) => rows[0]);

  if (!longCase) {
    return NextResponse.json({ error: "case not found" }, { status: 404 });
  }

  const sessionId = randomUUID();
  await db.insert(longCaseSessions).values({
    id: sessionId,
    user_id: session.user.id,
    long_case_id: caseId,
    phase: "history",
  });

  return NextResponse.json({
    sessionId,
    patientInfo: longCase.patient_info,
    title: longCase.title,
    specialty: longCase.specialty,
  });
}
