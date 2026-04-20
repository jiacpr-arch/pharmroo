import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, BookOpen, Shuffle, Target } from "lucide-react";
import { getMcqSubjects, getMcqSubjectCounts } from "@/lib/db/queries-mcq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ข้อสอบ NLE — ใบประกอบวิชาชีพพยาบาล",
  description:
    "ฝึกทำข้อสอบขึ้นทะเบียนสภาการพยาบาล (NLE) ครบทุกสาขา พร้อมเฉลยละเอียด",
};

export const dynamic = "force-dynamic";

export default async function NursingPage() {
  const [subjects, counts] = await Promise.all([
    getMcqSubjects({ examCategory: "nursing" }),
    getMcqSubjectCounts("nursing"),
  ]);

  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-rose-100 text-rose-700">NLE Exam</Badge>
          <Badge variant="secondary">{totalQuestions} ข้อ</Badge>
        </div>
        <h1 className="text-3xl font-bold">ข้อสอบขึ้นทะเบียนสภาการพยาบาล</h1>
        <p className="mt-2 text-muted-foreground">
          ฝึกทำข้อสอบ NLE แบบ MCQ ครบทุกสาขาการพยาบาล
        </p>
      </div>

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
