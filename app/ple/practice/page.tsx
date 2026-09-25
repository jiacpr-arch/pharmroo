export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getMcqSubjects, getMcqQuestions } from "@/lib/db/queries-mcq";
import { auth } from "@/lib/auth";
import { gateQuestionsForSession } from "@/lib/credits-gate";
import { getPlayAllowance } from "@/lib/play-limit";
import McqPractice from "@/components/McqPractice";
import { IP1_PILOT_050 } from "@/lib/ip1-pilot-050";
import { IP1_SET2_DAY01 } from "@/lib/ip1-set2-day01";
import { IP1_SET2_DAY02 } from "@/lib/ip1-set2-day02";
import { IP1_SET2_DAY03 } from "@/lib/ip1-set2-day03";
import { IP1_SET2_DAY04 } from "@/lib/ip1-set2-day04";
import { IP1_SET2_DAY05 } from "@/lib/ip1-set2-day05";
import { Badge } from "@/components/ui/badge";
import ExamNews, { ExamNewsSkeleton } from "@/components/ExamNews";
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
  track,
}: {
  subjectId?: string;
  day?: 1 | 2;
  track: "cc1" | "pc1" | "ip1" | "phcp1";
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

  const selectedQuestions =
    track === "ip1"
      ? [...IP1_PILOT_050, ...IP1_SET2_DAY01, ...IP1_SET2_DAY02, ...IP1_SET2_DAY03, ...IP1_SET2_DAY04, ...IP1_SET2_DAY05]
      : rawQuestions;

  const [{ questions, creditBalance }, playAllowance] = await Promise.all([
    gateQuestionsForSession(session, selectedQuestions),
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
      {track !== "cc1" && (
        <div className="mb-8 rounded-2xl border bg-white p-6">
          {track === "pc1" && (
            <div>
              <div className="flex items-center gap-2 text-xl font-bold"><HeartPulse className="h-6 w-6 text-rose-500" /> PC1 — บริบาลเภสัชกรรม</div>
              <p className="mt-2 text-sm text-muted-foreground">Pharmaceutical Care · 120 ข้อ</p>
              <Link href="/sets?exam=PLE-PC1" className="mt-5 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">ดูชุดข้อสอบ PC1 →</Link>
            </div>
          )}
          {track === "ip1" && (
            <div>
              <div className="flex items-center gap-2 text-xl font-bold"><Factory className="h-6 w-6 text-amber-500" /> IP1 — เภสัชกรรมอุตสาหการ</div>
              <p className="mt-2 text-sm text-muted-foreground">Industrial Pharmacy · Mock Set 1 จำนวน 150 ข้อ · ข้อ 101–150 เน้นอ่าน Monograph / Assay / Chromatography ระดับ Very Hard</p>
              <p className="mt-1 text-xs text-muted-foreground">Formulation · Manufacturing · Chromatography · Stability · Sterile · QA/QC · GMP · Validation</p>
              <p className="mt-1 text-xs text-muted-foreground">+ Daily Set 2 (ทยอยอัปเดตวันละ 10 ข้อ) · ตอนนี้มี {IP1_SET2_DAY01.length + IP1_SET2_DAY02.length + IP1_SET2_DAY03.length + IP1_SET2_DAY04.length + IP1_SET2_DAY05.length} ข้อ — Day 1: Cleanroom/HVAC/GMP Grade · Day 2: Impurity/Cleaning/Elemental/Scale-up calculations · Day 3: Sterilization/Aseptic processing validation · Day 4: Process capability/Sampling/Qualification/Tech transfer · Day 5: Physical pharmacy/Biopharmaceutics/Packaging calculations</p>
            </div>
          )}
          {track === "phcp1" && (
            <div>
              <div className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="h-6 w-6 text-emerald-600" /> PHCP1 — คุ้มครองผู้บริโภคด้านยาและสุขภาพ</div>
              <p className="mt-2 text-sm text-muted-foreground">Public Health & Consumer Protection · 120 ข้อ</p>
              <Link href="/sets?exam=PLE-PHCP1" className="mt-5 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">ดูชุดข้อสอบ PHCP1 →</Link>
            </div>
          )}
        </div>
      )}
      {track === "ip1" && (
        <div className="mt-6">
          <McqPractice
            questions={questions}
            initialCreditBalance={creditBalance}
            playAllowance={playAllowance}
          />
        </div>
      )}
      {track === "cc1" && (
        <>
      {/* Day Filter */}
      <div className="mb-3">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
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

      {/* Subject Filter — แถวเดียวเลื่อนซ้ายขวาบนมือถือ จะได้ไม่ดันข้อสอบลงไปไกล */}
      <div className="mb-3">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
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
      <div className="mb-4 text-sm text-muted-foreground">
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
        </>
      )}
    </div>
  );
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; day?: string; track?: string }>;
}) {
  const params = await searchParams;
  const { subject } = params;
  const track =
    params.track === "pc1" || params.track === "ip1" || params.track === "phcp1"
      ? params.track
      : "cc1";

  const dayParam = params.day ? Number(params.day) : null;
  const day = dayParam === 1 || dayParam === 2 ? dayParam : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/ple"
          aria-label="กลับหน้า PLE"
          className="text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">ฝึกทำข้อสอบ PLE</h1>
      </div>

      <Suspense
        fallback={<div className="text-center py-8">กำลังโหลดข้อสอบ...</div>}
      >
        <PracticeContent subjectId={subject} day={day} track={track} />
      </Suspense>

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">ข่าวการสอบ & วงการเภสัช</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          <Suspense fallback={<ExamNewsSkeleton />}>
            <ExamNews track="pharmacy" />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
