export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { gateQuestionsForSession, getViewerGate } from "@/lib/credits-gate";
import McqMock from "@/components/McqMock";
import MockExamPaywall from "@/components/MockExamPaywall";
import { PC1_MOCK_SETS } from "@/lib/pc1-mock-sets";

export const metadata: Metadata = {
  title: "จำลองสอบ PC1 — Mock Exam 120 ข้อ",
  description: "จำลองสอบ PLE-PC1 บริบาลเภสัชกรรม 120 ข้อ 12 หมวด จับเวลา พร้อมคะแนนแยกหมวด",
};

export default async function Pc1MockPage({ params }: { params: Promise<{ set: string }> }) {
  const { set } = await params;
  const questions = PC1_MOCK_SETS[set];
  if (!questions) notFound();

  const session = await auth();
  const { isPaid } = getViewerGate(session);
  const gated = isPaid ? await gateQuestionsForSession(session, questions) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/ple/pc1-mock" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> เลือกชุดข้อสอบ
        </Link>
        <h1 className="text-2xl font-bold">จำลองสอบ PC1 — Mock Set {set}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {questions.length} ข้อ · 12 หมวด หมวดละ 10 ข้อ · จับเวลา {questions.length} นาที · เฉลยและคะแนนแยกหมวดตอนจบ
        </p>
      </div>
      {gated ? (
        <McqMock questions={gated.questions} timeLimitMinutes={questions.length} examType="PLE-PC" />
      ) : (
        <MockExamPaywall />
      )}
    </div>
  );
}
