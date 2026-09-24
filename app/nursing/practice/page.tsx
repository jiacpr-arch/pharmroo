export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getMcqSubjects, getMcqQuestions } from "@/lib/db/queries-mcq";
import { auth } from "@/lib/auth";
import { gateQuestionsForSession } from "@/lib/credits-gate";
import { getPlayAllowance } from "@/lib/play-limit";
import McqPractice from "@/components/McqPractice";
import { Badge } from "@/components/ui/badge";
import ExamNews, { ExamNewsSkeleton } from "@/components/ExamNews";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ฝึกทำข้อสอบ NLE",
  description: "ฝึกทำข้อสอบ MCQ ใบประกอบวิชาชีพพยาบาล",
};

async function PracticeContent({ subjectId }: { subjectId?: string }) {
  const [session, subjects, rawQuestions] = await Promise.all([
    auth(),
    getMcqSubjects({ examCategory: "nursing" }),
    getMcqQuestions({
      subjectId,
      examType: "NLE",
      limit: 200,
      randomize: true,
    }),
  ]);

  const [{ questions, creditBalance }, playAllowance] = await Promise.all([
    gateQuestionsForSession(session, rawQuestions),
    getPlayAllowance(session),
  ]);

  const currentSubject = subjectId
    ? subjects.find((s) => s.id === subjectId)
    : null;

  return (
    <div>
      {/* แถวเดียวเลื่อนซ้ายขวาบนมือถือ จะได้ไม่ดันข้อสอบลงไปไกล */}
      <div className="mb-3">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Link href="/nursing/practice">
            <Badge
              variant={!subjectId ? "default" : "secondary"}
              className={`cursor-pointer ${
                !subjectId ? "bg-rose-600 text-white" : "hover:bg-rose-50"
              }`}
            >
              คละทุกสาขา
            </Badge>
          </Link>
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/nursing/practice?subject=${subject.id}`}
            >
              <Badge
                variant={subjectId === subject.id ? "default" : "secondary"}
                className={`cursor-pointer ${
                  subjectId === subject.id
                    ? "bg-rose-600 text-white"
                    : "hover:bg-rose-50"
                }`}
              >
                {subject.icon} {subject.name_th}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {currentSubject ? (
          <span>
            {currentSubject.icon} {currentSubject.name_th} — {questions.length} ข้อ
          </span>
        ) : (
          <span>คละทุกสาขา — {questions.length} ข้อ</span>
        )}
      </div>

      {questions.length > 0 ? (
        <McqPractice
          questions={questions}
          examType="NLE"
          initialCreditBalance={creditBalance}
          playAllowance={playAllowance}
        />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">ยังไม่มีข้อสอบในสาขานี้</p>
          <Link
            href="/nursing/practice"
            className="text-rose-600 hover:underline mt-2 inline-block"
          >
            ดูสาขาอื่น
          </Link>
        </div>
      )}
    </div>
  );
}

export default async function NursingPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const params = await searchParams;
  const { subject } = params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/nursing"
          aria-label="กลับหน้า NLE"
          className="text-muted-foreground hover:text-rose-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">ฝึกทำข้อสอบ NLE</h1>
      </div>

      <Suspense
        fallback={<div className="text-center py-8">กำลังโหลดข้อสอบ...</div>}
      >
        <PracticeContent subjectId={subject} />
      </Suspense>

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">ข่าวการสอบ & วงการพยาบาล</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          <Suspense fallback={<ExamNewsSkeleton />}>
            <ExamNews track="nursing" />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
