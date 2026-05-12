export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMcqQuestions } from "@/lib/db/queries-mcq";
import McqMock from "@/components/McqMock";
import MockSetup from "@/app/ple/mock/MockSetup";

async function MockExamContent({
  count,
  day,
}: {
  count: number;
  day?: 1 | 2;
}) {
  const questions = await getMcqQuestions({
    examType: "PLE-CC1",
    examDay: day,
    limit: count,
    randomize: true,
  });

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>ยังไม่มีข้อสอบในระบบ</p>
        <Link
          href="/liff"
          className="text-brand hover:underline mt-2 inline-block"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  const actualCount = Math.min(count, questions.length);

  return (
    <McqMock
      questions={questions.slice(0, actualCount)}
      timeLimitMinutes={count}
    />
  );
}

export default async function LiffMockPage({
  searchParams,
}: {
  searchParams: Promise<{ count?: string; day?: string }>;
}) {
  const params = await searchParams;

  const dayParam = params.day ? Number(params.day) : null;
  const day = dayParam === 1 || dayParam === 2 ? dayParam : undefined;

  const countParam = params.count;
  const validCounts = [20, 50, 100, 120];
  const count =
    countParam && validCounts.includes(Number(countParam))
      ? Number(countParam)
      : day
        ? 120
        : null;

  const dayLabel = day ? `Day ${day}` : null;

  return (
    <div className="mx-auto max-w-md px-4 py-5">
      <div className="mb-5">
        <Link
          href="/liff"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
        </Link>
        <h1 className="text-xl font-bold">
          จำลองสอบ PLE-CC1{dayLabel ? ` — ${dayLabel}` : ""}
        </h1>
        <p className="text-muted-foreground text-xs mt-1">
          {day
            ? `จำลองสอบ ${dayLabel} ข้อสอบ ${count} ข้อ จับเวลา 1 นาที/ข้อ`
            : "เลือกชุดข้อสอบเพื่อเริ่มจำลอง"}
        </p>
      </div>

      {count ? (
        <Suspense
          fallback={<div className="text-center py-8">กำลังโหลดข้อสอบ...</div>}
        >
          <MockExamContent count={count} day={day} />
        </Suspense>
      ) : (
        <MockSetup basePath="/liff/mock" />
      )}
    </div>
  );
}
