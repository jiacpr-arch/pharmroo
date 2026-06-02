export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  getLessonForPlayer,
  isLessonUnlocked,
  getUnitWithLessons,
} from "@/lib/db/queries-learn";
import LessonPlayer from "@/components/learn/LessonPlayer";
import { ArrowLeft } from "lucide-react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/learn/${lessonId}`);
  }

  const data = await getLessonForPlayer(lessonId, session.user.id);
  if (!data || data.lesson.status !== "published") {
    redirect("/learn");
  }

  const unlocked = await isLessonUnlocked(lessonId, session.user.id);
  if (!unlocked) {
    redirect("/learn");
  }

  // Find the next published lesson in the same unit (for the "next" button).
  let nextLessonId: string | null = null;
  if (data.unit) {
    const unit = await getUnitWithLessons(data.unit.id);
    const published = (unit?.lessons ?? [])
      .filter((l) => l.status === "published")
      .sort((a, b) => a.sort_order - b.sort_order);
    const idx = published.findIndex((l) => l.id === lessonId);
    if (idx >= 0 && idx < published.length - 1) {
      nextLessonId = published[idx + 1].id;
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> เส้นทางการเรียน
        </Link>
        <h1 className="text-2xl font-bold">{data.lesson.title_th}</h1>
        {data.lesson.subtitle_th && (
          <p className="text-muted-foreground text-sm mt-1">
            {data.lesson.subtitle_th}
          </p>
        )}
      </div>

      <LessonPlayer
        lesson={data.lesson}
        unit={data.unit}
        cards={data.cards}
        questions={data.questions}
        initialCardIndex={data.progress?.last_card_index ?? 0}
        nextLessonId={nextLessonId}
      />
    </div>
  );
}
