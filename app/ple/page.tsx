import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, BookOpen, Shuffle, Target } from "lucide-react";
import { getMcqSubjects, getMcqSubjectCounts } from "@/lib/db/queries-mcq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ข้อสอบ PLE — ใบประกอบวิชาชีพเภสัชกรรม",
  description: "ฝึกทำข้อสอบ PLE-PC PLE-CC1 ใบประกอบวิชาชีพเภสัชกรรม ครบทุกหมวด",
};

export const revalidate = 60;

export default async function PLEPage() {
  const [subjects, counts] = await Promise.all([
    getMcqSubjects(),
    getMcqSubjectCounts(),
  ]);

  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-teal-100 text-teal-700">PLE Exam</Badge>
          <Badge variant="secondary">{totalQuestions} ข้อ</Badge>
        </div>
        <h1 className="text-3xl font-bold">ข้อสอบใบประกอบวิชาชีพเภสัชกรรม</h1>
        <p className="mt-2 text-muted-foreground">
          ฝึกทำข้อสอบ PLE-PC และ PLE-CC1 แบบ MCQ ครบทุกหมวดวิชา
        </p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="group hover:shadow-lg hover:border-brand/30 transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-3">
              <Target className="h-6 w-6 text-brand" />
            </div>
            <h2 className="text-xl font-bold">ฝึกทำ (Practice)</h2>
            <p className="text-muted-foreground text-sm">
              เลือกหมวดที่ต้องการฝึก เฉลยทันทีหลังตอบ ไม่จับเวลา
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/ple/practice">
              <Button className="w-full bg-brand hover:bg-brand-light text-white gap-2">
                เริ่มฝึกทำ <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:border-brand/30 transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Shuffle className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold">จำลองสอบ (Mock)</h2>
            <p className="text-muted-foreground text-sm">
              สุ่มข้อคละทุกหมวด จับเวลาเหมือนสอบจริง เฉลยตอนจบ
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/ple/mock">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
                เริ่มจำลองสอบ <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-brand" />
          <h2 className="text-2xl font-bold">หมวดวิชา</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const count = counts[subject.id] || 0;
            return (
              <Link
                key={subject.id}
                href={`/ple/practice?subject=${subject.id}`}
              >
                <Card className="group h-full hover:shadow-md hover:border-brand/30 transition-all cursor-pointer">
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
      </div>
    </div>
  );
}
