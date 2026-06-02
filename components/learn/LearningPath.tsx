import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Check, Star, Clock } from "lucide-react";
import type { PathUnitSection, PathLessonNode } from "@/lib/types-learn";

function LessonNode({ lesson }: { lesson: PathLessonNode }) {
  const completed = lesson.progress_status === "completed";
  const inProgress = lesson.progress_status === "in_progress";
  const locked = lesson.locked;

  let circle = "bg-muted text-muted-foreground";
  let icon = <Lock className="h-6 w-6" />;
  if (completed) {
    circle = "bg-green-500 text-white shadow-md";
    icon = <Check className="h-7 w-7" />;
  } else if (!locked) {
    circle = inProgress
      ? "bg-brand text-white shadow-md ring-4 ring-brand/20"
      : "bg-brand text-white shadow-md";
    icon = <span className="text-2xl">{lesson.icon}</span>;
  }

  const inner = (
    <div className="flex items-center gap-4">
      <div
        className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-transform ${circle} ${
          !locked ? "group-hover:scale-105" : ""
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className={`font-semibold ${locked ? "text-muted-foreground" : ""}`}
        >
          {lesson.title_th}
        </p>
        {lesson.subtitle_th && (
          <p className="text-sm text-muted-foreground truncate">
            {lesson.subtitle_th}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {lesson.est_minutes} นาที
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" /> {lesson.xp_reward} XP
          </span>
          {completed && lesson.quiz_total > 0 && (
            <span className="text-green-600">
              {lesson.score}/{lesson.quiz_total}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (locked) {
    return <div className="py-3 opacity-60 cursor-not-allowed">{inner}</div>;
  }

  return (
    <Link
      href={`/learn/${lesson.id}`}
      className="group block py-3 hover:bg-muted/40 rounded-xl px-2 -mx-2 transition-colors"
    >
      {inner}
    </Link>
  );
}

export default function LearningPath({
  units,
}: {
  units: PathUnitSection[];
}) {
  if (units.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <p className="text-lg">ยังไม่มีบทเรียนในตอนนี้</p>
          <p className="text-sm mt-1">กำลังเตรียมเนื้อหา โปรดกลับมาใหม่เร็ว ๆ นี้</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {units.map((unit) => {
        const total = unit.lessons.length;
        const done = unit.lessons.filter(
          (l) => l.progress_status === "completed"
        ).length;
        return (
          <section key={unit.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{unit.icon}</span>
                <div>
                  <h2 className="font-bold text-lg">{unit.title_th}</h2>
                  {unit.description_th && (
                    <p className="text-sm text-muted-foreground">
                      {unit.description_th}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="secondary">
                {done}/{total}
              </Badge>
            </div>
            <Card>
              <CardContent className="py-2 divide-y">
                {unit.lessons.length > 0 ? (
                  unit.lessons.map((lesson) => (
                    <LessonNode key={lesson.id} lesson={lesson} />
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    ยังไม่มีบทเรียน
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        );
      })}
    </div>
  );
}
