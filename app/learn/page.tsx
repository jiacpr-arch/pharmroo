export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getLearningPath, getContinueLesson } from "@/lib/db/queries-learn";
import type { ExamCategory } from "@/lib/db/queries-mcq";
import LearningPath from "@/components/learn/LearningPath";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, PlayCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เรียนรู้ก่อนสอบ | ฟาร์มรู้",
  description:
    "บทเรียนสั้น ๆ แบบ microlearning เตรียมสอบใบประกอบวิชาชีพเภสัชกรรม เรียนทีละนิดพร้อมแบบทดสอบ",
};

export default async function LearnPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/learn");
  }

  const examCategory = (session.user as { exam_category?: string | null })
    .exam_category as ExamCategory | null | undefined;

  const [units, continueLesson] = await Promise.all([
    getLearningPath(session.user.id, examCategory ?? undefined),
    getContinueLesson(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-7 w-7 text-brand" />
          <h1 className="text-2xl font-bold">เรียนรู้ก่อนสอบ</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          อ่านบทเรียนสั้น ๆ แล้วทำแบบทดสอบทันที จัดตามวิชาที่ต้องสอบใบประกอบฯ
        </p>
      </div>

      {continueLesson && (
        <Card className="mb-6 border-brand/30 bg-brand/5">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl">{continueLesson.icon}</span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">เรียนต่อ</p>
                <p className="font-semibold truncate">
                  {continueLesson.title_th}
                </p>
              </div>
            </div>
            <Link href={`/learn/${continueLesson.lesson_id}`}>
              <Button className="bg-brand hover:bg-brand-light text-white gap-2 flex-shrink-0">
                <PlayCircle className="h-4 w-4" /> ไปต่อ
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <LearningPath units={units} />
    </div>
  );
}
