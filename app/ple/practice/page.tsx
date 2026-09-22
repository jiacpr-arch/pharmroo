export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getMcqSubjects, getMcqQuestions } from "@/lib/db/queries-mcq";
import { auth } from "@/lib/auth";
import { gateQuestionsForSession } from "@/lib/credits-gate";
import { getPlayAllowance } from "@/lib/play-limit";
import McqPractice from "@/components/McqPractice";
import { Badge } from "@/components/ui/badge";
import GoodyEmbed from "@/components/GoodyEmbed";
import Link from "next/link";
import { ArrowLeft, BookOpen, Factory, HeartPulse, ShieldCheck } from "lucide-react";
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
  const [session, subjects, rawQuestions] = await Promise.all([
    auth(),
    getMcqSubjects({ examCategory: "pharmacy" }),
    getMcqQuestions({
      subjectId,
      examType: "PLE-CC1",
      examDay: day,
      limit: day ? 120 : 240,
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

  const basePath = day
    ? `/ple/practice?day=${day}`
    : "/ple/practice";

  return (
    <div>
      {/* Exam structure */}
      <div className="mb-8 space-y-5">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">ปี 4</span>
            <h2 className="text-lg font-bold">CC1 — สอบพื้นฐานร่วม</h2>
          </div>
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-teal-900">
                  <BookOpen className="h-5 w-5" />
                  CC1
                </div>
                <p className="mt-1 text-sm text-teal-800">รวม 240 ข้อ · สอบ 2 วัน · วันละ 120 ข้อ</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs sm:w-64">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="font-bold text-teal-800">Day 1</div>
                  <div className="text-muted-foreground">120 ข้อ</div>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="font-bold text-blue-800">Day 2</div>
                  <div className="text-muted-foreground">120 ข้อ</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">ปี 6</span>
            <h2 className="text-lg font-bold">เลือกสอบตามสายวิชาชีพ — เลือก 1 สาย</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Link href="/sets?exam=PLE-PC1" className="rounded-2xl border bg-white p-4 transition hover:border-rose-200 hover:shadow-sm">
              <div className="flex items-center gap-2 font-bold"><HeartPulse className="h-5 w-5 text-rose-500" /> PC1</div>
              <p className="mt-1 text-sm font-medium">บริบาลเภสัชกรรม</p>
              <p className="mt-2 text-xs text-muted-foreground">Pharmaceutical Care · 120 ข้อ</p>
            </Link>
            <Link href="/sets?exam=PLE-IP1" className="rounded-2xl border bg-white p-4 transition hover:border-amber-200 hover:shadow-sm">
              <div className="flex items-center gap-2 font-bold"><Factory className="h-5 w-5 text-amber-500" /> IP1</div>
              <p className="mt-1 text-sm font-medium">เภสัชกรรมอุตสาหการ</p>
              <p className="mt-2 text-xs text-muted-foreground">Industrial Pharmacy · 120 ข้อ</p>
            </Link>
            <Link href="/sets?exam=PLE-PHCP1" className="rounded-2xl border bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm">
              <div className="flex items-center gap-2 font-bold"><ShieldCheck className="h-5 w-5 text-emerald-600" /> PHCP1</div>
              <p className="mt-1 text-sm font-medium">คุ้มครองผู้บริโภคด้านยาและสุขภาพ</p>
              <p className="mt-2 text-xs text-muted-foreground">Public Health & Consumer Protection · 120 ข้อ</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-2 border-t pt-6">
        <h2 className="text-lg font-bold">ฝึกข้อสอบ CC1</h2>
        <p className="text-sm text-muted-foreground">เลือกวันสอบและหมวดวิชาที่ต้องการฝึก</p>
      </div>

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
              รวม CC1 (240 ข้อ)
            </Badge>
          </Link>
          <Link href={subjectId ? `/ple/practice?day=1&subject=${subjectId}` : "/ple/practice?day=1"}>
            <Badge
              variant={day === 1 ? "default" : "secondary"}
              className={`cursor-pointer ${
                day === 1 ? "bg-teal-600 text-white" : "hover:bg-teal-50"
              }`}
            >
              Day 1 · 120 ข้อ
            </Badge>
          </Link>
          <Link href={subjectId ? `/ple/practice?day=2&subject=${subjectId}` : "/ple/practice?day=2"}>
            <Badge
              variant={day === 2 ? "default" : "secondary"}
              className={`cursor-pointer ${
                day === 2 ? "bg-blue-600 text-white" : "hover:bg-blue-50"
              }`}
            >
              Day 2 · 120 ข้อ
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
        <McqPractice
          questions={questions}
          initialCreditBalance={creditBalance}
          playAllowance={playAllowance}
        />
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

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">ข่าวสารสุขภาพ</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          <GoodyEmbed site="health" type="news" title="ข่าวสารสุขภาพ" />
        </div>
      </section>
    </div>
  );
}
