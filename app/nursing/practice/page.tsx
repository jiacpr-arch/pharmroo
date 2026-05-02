export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getMcqSubjects, getMcqQuestions } from "@/lib/db/queries-mcq";
import McqPractice from "@/components/McqPractice";
import { Badge } from "@/components/ui/badge";
import GoodyEmbed from "@/components/GoodyEmbed";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ฝึกทำข้อสอบ NLE",
  description: "ฝึกทำข้อสอบ MCQ ใบประกอบวิชาชีพพยาบาล",
};

async function PracticeContent({ subjectId }: { subjectId?: string }) {
  const [subjects, questions] = await Promise.all([
    getMcqSubjects({ examCategory: "nursing" }),
    getMcqQuestions({
      subjectId,
      examType: "NLE",
      limit: 200,
      randomize: true,
    }),
  ]);

  const currentSubject = subjectId
    ? subjects.find((s) => s.id === subjectId)
    : null;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">
          สาขาการพยาบาล
        </h3>
        <div className="flex flex-wrap gap-2">
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

      <div className="mb-6 text-sm text-muted-foreground">
        {currentSubject ? (
          <span>
            {currentSubject.icon} {currentSubject.name_th} — {questions.length} ข้อ
          </span>
        ) : (
          <span>คละทุกสาขา — {questions.length} ข้อ</span>
        )}
      </div>

      {questions.length > 0 ? (
        <McqPractice questions={questions} examType="NLE" />
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/nursing"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-rose-600 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> กลับหน้า NLE
        </Link>
        <h1 className="text-2xl font-bold">ฝึกทำข้อสอบ NLE</h1>
        <p className="text-muted-foreground text-sm mt-1">
          เลือกตอบแล้วดูเฉลยทันที
        </p>
      </div>

      <Suspense
        fallback={<div className="text-center py-8">กำลังโหลดข้อสอบ...</div>}
      >
        <PracticeContent subjectId={subject} />
      </Suspense>

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">ข่าวสารสุขภาพ</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          <GoodyEmbed site="health" type="news" title="ข่าวสารสุขภาพ" />
        </div>
      </section>
    </div>
  );
}
