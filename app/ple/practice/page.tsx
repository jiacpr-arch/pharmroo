import { Suspense } from "react";
import { getMcqSubjects, getMcqQuestions } from "@/lib/supabase/queries-mcq";
import McqPractice from "@/components/McqPractice";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ฝึกทำข้อสอบ PLE",
  description: "ฝึกทำข้อสอบ MCQ ใบประกอบวิชาชีพเภสัชกรรม",
};

async function PracticeContent({
  subjectId,
  day,
}: {
  subjectId?: string;
  day?: 1 | 2;
}) {
  const [subjects, questions] = await Promise.all([
    getMcqSubjects(),
    getMcqQuestions({
      subjectId,
      examType: "PLE-CC1",
      examDay: day,
      limit: 200,
      randomize: true,
    }),
  ]);

  const currentSubject = subjectId
    ? subjects.find((s) => s.id === subjectId)
    : null;

  const basePath = day
    ? `/ple/practice?day=${day}`
    : "/ple/practice";

  return (
    <div>
      {/* Day Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">
          วันสอบ
        </h3>
        <div className="flex gap-2">
          <Link href={subjectId ? `/ple/practice?subject=${subjectId}` : "/ple/practice"}>
            <Badge
              variant={!day ? "default" : "secondary"}
              className={`cursor-pointer ${
                !day ? "bg-brand text-white" : "hover:bg-brand/10"
              }`}
            >
              ทุกวัน
            </Badge>
          </Link>
          <Link href={subjectId ? `/ple/practice?day=1&subject=${subjectId}` : "/ple/practice?day=1"}>
            <Badge
              variant={day === 1 ? "default" : "secondary"}
              className={`cursor-pointer ${
                day === 1 ? "bg-teal-600 text-white" : "hover:bg-teal-50"
              }`}
            >
              Day 1
            </Badge>
          </Link>
          <Link href={subjectId ? `/ple/practice?day=2&subject=${subjectId}` : "/ple/practice?day=2"}>
            <Badge
              variant={day === 2 ? "default" : "secondary"}
              className={`cursor-pointer ${
                day === 2 ? "bg-blue-600 text-white" : "hover:bg-blue-50"
              }`}
            >
              Day 2
            </Badge>
          </Link>
        </div>
      </div>

      {/* Subject Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">
          หมวดวิชา
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link href={basePath}>
            <Badge
              variant={!subjectId ? "default" : "secondary"}
              className={`cursor-pointer ${
                !subjectId ? "bg-brand text-white" : "hover:bg-brand/10"
              }`}
            >
              คละทุกหมวด
            </Badge>
          </Link>
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`${basePath}${day ? "&" : "?"}subject=${subject.id}`}
            >
              <Badge
                variant={subjectId === subject.id ? "default" : "secondary"}
                className={`cursor-pointer ${
                  subjectId === subject.id
                    ? "bg-brand text-white"
                    : "hover:bg-brand/10"
                }`}
              >
                {subject.icon} {subject.name_th}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mb-6 text-sm text-muted-foreground">
        {currentSubject ? (
          <span>
            {currentSubject.icon} {currentSubject.name_th}
            {day ? ` · Day ${day}` : ""} — {questions.length} ข้อ
          </span>
        ) : (
          <span>
            คละทุกหมวด{day ? ` · Day ${day}` : ""} — {questions.length} ข้อ
          </span>
        )}
      </div>

      {/* Practice Component */}
      {questions.length > 0 ? (
        <McqPractice questions={questions} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">ยังไม่มีข้อสอบในหมวดนี้</p>
          <Link
            href="/ple/practice"
            className="text-brand hover:underline mt-2 inline-block"
          >
            ดูหมวดอื่น
          </Link>
        </div>
      )}
    </div>
  );
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; day?: string }>;
}) {
  const params = await searchParams;
  const { subject } = params;

  const dayParam = params.day ? Number(params.day) : null;
  const day = dayParam === 1 || dayParam === 2 ? dayParam : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/ple"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> กลับหน้า PLE
        </Link>
        <h1 className="text-2xl font-bold">ฝึกทำข้อสอบ PLE</h1>
        <p className="text-muted-foreground text-sm mt-1">
          เลือกตอบแล้วดูเฉลยทันที
        </p>
      </div>

      <Suspense
        fallback={<div className="text-center py-8">กำลังโหลดข้อสอบ...</div>}
      >
        <PracticeContent subjectId={subject} day={day} />
      </Suspense>
    </div>
  );
}
