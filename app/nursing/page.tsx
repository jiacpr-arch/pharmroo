import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, BookOpen, Shuffle, Target, UserPlus, Package, Sparkles } from "lucide-react";
import { getQuestionSets } from "@/lib/db/queries-mcq";
import { getMcqSubjects, getMcqSubjectCounts, getNewQuestionsStats } from "@/lib/db/queries-mcq";
import NewQuestionsCountdown from "@/components/NewQuestionsCountdown";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ข้อสอบ NLE พยาบาล — ใบประกอบวิชาชีพพยาบาล",
  description:
    "ฝึกทำข้อสอบขึ้นทะเบียนสภาการพยาบาล (NLE) ออนไลน์ ครบทุกสาขา การพยาบาลผู้ใหญ่ เด็ก สูติฯ จิตเวช ชุมชน พร้อมเฉลยละเอียด ฝึกฟรีไม่จำกัด",
  keywords: [
    "NLE", "ข้อสอบ NLE", "ข้อสอบพยาบาล", "ใบประกอบพยาบาล",
    "สภาการพยาบาล", "ขึ้นทะเบียนพยาบาล", "เตรียมสอบพยาบาล",
    "ข้อสอบสภาการพยาบาล", "MCQ พยาบาล",
  ],
  openGraph: {
    title: "ข้อสอบ NLE พยาบาล — ฟาร์มรู้",
    description: "ฝึก NLE ครบทุกสาขา เฉลยละเอียด ฝึกฟรีไม่จำกัด",
    url: "https://pharmru.com/nursing",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function NursingPage() {
  const [session, subjects, counts, stats, allSets] = await Promise.all([
    auth(),
    getMcqSubjects({ examCategory: "nursing" }),
    getMcqSubjectCounts("nursing"),
    getNewQuestionsStats({ examCategory: "nursing" }).catch(() => ({
      totalActive: 0,
      newThisWeek: 0,
      newBySubject: [] as { icon: string; name_th: string; count: number }[],
      nextReleaseAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    })),
    getQuestionSets().catch(() => []),
  ]);
  const isLoggedIn = Boolean(session?.user?.id);
  const nursingSets = allSets.filter((s) => s.exam_type === "NLE");
  const featuredSet = nursingSets[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-rose-100 text-rose-700">NLE Exam</Badge>
        </div>
        <h1 className="text-3xl font-bold">ข้อสอบขึ้นทะเบียนสภาการพยาบาล</h1>
        <p className="mt-2 text-muted-foreground">
          ฝึกทำข้อสอบ NLE แบบ MCQ ครบทุกสาขาการพยาบาล พร้อมเฉลยละเอียด
        </p>
      </div>

      {/* Stats + countdown banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-6 flex flex-col items-center text-center">
        <NewQuestionsCountdown
          totalActive={stats.totalActive}
          newThisWeek={stats.newThisWeek}
          newBySubject={stats.newBySubject}
          nextReleaseAt={stats.nextReleaseAt}
        />
      </div>

      {!isLoggedIn && (
        <div className="mb-8 rounded-2xl border-2 border-rose-200 bg-rose-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-left">
            <UserPlus className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-900">สมัครสมาชิกฟรี</h3>
              <p className="text-sm text-rose-800">
                บันทึกความคืบหน้า ฝึก NLE ได้เต็มรูปแบบ พร้อมเฉลยละเอียด
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/register">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                สมัครสมาชิก
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-100">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="group hover:shadow-lg hover:border-rose-300 transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-3">
              <Target className="h-6 w-6 text-rose-600" />
            </div>
            <h2 className="text-xl font-bold">ฝึกทำ (Practice)</h2>
            <p className="text-muted-foreground text-sm">
              เลือกสาขาที่ต้องการฝึก เฉลยทันทีหลังตอบ ไม่จับเวลา
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/nursing/practice">
              <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white gap-2">
                เริ่มฝึกทำ <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:border-purple-300 transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Shuffle className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold">จำลองสอบ (Mock)</h2>
            <p className="text-muted-foreground text-sm">
              สุ่มข้อคละทุกสาขา จับเวลาเหมือนสอบจริง เฉลยตอนจบ
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/nursing/mock">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
                เริ่มจำลองสอบ <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {featuredSet && (
        <div className="mb-12 rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Package className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">ชุดข้อสอบ NLE</span>
              </div>
              <h3 className="font-bold text-lg text-rose-900">{featuredSet.name_th}</h3>
              <p className="text-sm text-rose-700 mt-1">
                ซื้อครั้งเดียว ใช้ได้ตลอด ไม่มีวันหมดอายุ · {featuredSet.question_count} ข้อ พร้อมเฉลยละเอียด
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                {featuredSet.original_price && (
                  <p className="text-xs text-muted-foreground line-through">
                    ฿{featuredSet.original_price.toLocaleString()}
                  </p>
                )}
                <p className="text-2xl font-bold text-rose-700">
                  ฿{featuredSet.price.toLocaleString()}
                </p>
              </div>
              <Link href={`/sets/${featuredSet.id}`}>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white gap-2">
                  ดูรายละเอียด <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-rose-600" />
          <h2 className="text-2xl font-bold">สาขาการพยาบาล</h2>
        </div>
        {subjects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>ยังไม่มีสาขาในระบบ กำลังเตรียมข้อสอบ</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => {
              const count = counts[subject.id] || 0;
              return (
                <Link
                  key={subject.id}
                  href={`/nursing/practice?subject=${subject.id}`}
                >
                  <Card className="group h-full hover:shadow-md hover:border-rose-300 transition-all cursor-pointer">
                    <CardContent className="p-5 text-center">
                      <span className="text-3xl block mb-2">{subject.icon}</span>
                      <h3 className="font-medium text-sm mb-1">
                        {subject.name_th}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {count} ข้อ
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
