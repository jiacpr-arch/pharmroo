"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Trophy, Sparkles } from "lucide-react";
import type {
  LearningLesson,
  LearningUnit,
  LessonCard as LessonCardType,
} from "@/lib/types-learn";
import type { McqQuestion } from "@/lib/types-mcq";
import LessonCardView from "./LessonCard";
import QuizQuestionCard from "./QuizQuestionCard";
import AskQuestionBox from "./AskQuestionBox";

interface LessonPlayerProps {
  lesson: LearningLesson;
  unit: LearningUnit | null;
  cards: LessonCardType[];
  questions: McqQuestion[];
  initialCardIndex?: number;
  nextLessonId?: string | null;
}

type Phase = "cards" | "quiz" | "complete";

export default function LessonPlayer({
  lesson,
  unit,
  cards,
  questions,
  initialCardIndex = 0,
  nextLessonId = null,
}: LessonPlayerProps) {
  const { data: authSession } = useSession();
  const userId = (authSession?.user as { id?: string })?.id ?? null;

  const hasCards = cards.length > 0;
  const hasQuiz = questions.length > 0;

  const [phase, setPhase] = useState<Phase>(hasCards ? "cards" : hasQuiz ? "quiz" : "complete");
  const [cardIndex, setCardIndex] = useState(
    Math.max(0, Math.min(initialCardIndex, Math.max(0, cards.length - 1)))
  );

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number>(lesson.xp_reward);
  // eslint-disable-next-line react-hooks/purity
  const questionStartTime = useRef<number>(Date.now());
  const completedRef = useRef(false);

  // Create an MCQ session for the quiz portion (so XP/streak update like practice).
  useEffect(() => {
    if (!userId || !hasQuiz) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/mcq/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "practice",
            exam_type: questions[0]?.exam_type ?? "PLE-CC1",
            subject_id: unit?.subject_id ?? null,
            total_questions: questions.length,
          }),
        });
        if (res.ok && !cancelled) {
          const s = await res.json();
          setSessionId(s.id);
        }
      } catch {
        /* skip */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, hasQuiz, questions, unit]);

  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [quizIndex]);

  // Persist reading progress (resume point).
  const saveProgress = useCallback(
    (idx: number) => {
      if (!userId) return;
      fetch("/api/learn/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lesson.id, last_card_index: idx }),
      }).catch(() => {});
    },
    [userId, lesson.id]
  );

  const finishLesson = useCallback(
    (correct: number, total: number) => {
      if (completedRef.current) return;
      completedRef.current = true;
      setPhase("complete");
      if (!userId) return;
      // Close the MCQ session (feeds dashboard XP/streak).
      if (sessionId) {
        fetch("/api/mcq/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: sessionId,
            correct_count: correct,
            completed_at: new Date().toISOString(),
          }),
        }).catch(() => {});
      }
      // Mark the lesson complete.
      fetch("/api/learn/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lesson.id,
          score: correct,
          quiz_total: total,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.xp_reward != null) setXpEarned(d.xp_reward);
        })
        .catch(() => {});
    },
    [userId, sessionId, lesson.id]
  );

  // ---- Cards phase ----
  const handleNextCard = () => {
    if (cardIndex < cards.length - 1) {
      const next = cardIndex + 1;
      setCardIndex(next);
      saveProgress(next);
    } else if (hasQuiz) {
      setPhase("quiz");
    } else {
      finishLesson(0, 0);
    }
  };

  const handlePrevCard = () => {
    if (cardIndex > 0) setCardIndex(cardIndex - 1);
  };

  // ---- Quiz phase ----
  const handleSelect = (label: string) => {
    if (showResult) return;
    setSelectedAnswer(label);
    setShowResult(true);
    const q = questions[quizIndex];
    const isCorrect = label === q.correct_answer;
    if (isCorrect) setCorrectCount((c) => c + 1);

    if (userId) {
      fetch("/api/mcq/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: q.id,
          selected_answer: label,
          is_correct: isCorrect,
          time_spent_seconds: Math.round(
            (Date.now() - questionStartTime.current) / 1000
          ),
          mode: "practice",
          session_id: sessionId,
        }),
      }).catch(() => {});
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < questions.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishLesson(correctCount, questions.length);
    }
  };

  // ---------- RENDER ----------

  if (phase === "complete") {
    const pct =
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 100;
    return (
      <div className="space-y-6">
        <Card className="border-brand/20 bg-brand/5">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-brand" />
            </div>
            <h2 className="text-2xl font-bold mb-1">จบบทเรียนแล้ว! 🎉</h2>
            <p className="text-muted-foreground mb-4">{lesson.title_th}</p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div>
                <p className="text-3xl font-bold text-brand">+{xpEarned}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              {questions.length > 0 && (
                <div>
                  <p className="text-3xl font-bold text-brand">
                    {correctCount}/{questions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    แบบทดสอบ ({pct}%)
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {nextLessonId ? (
                <Link href={`/learn/${nextLessonId}`}>
                  <Button className="bg-brand hover:bg-brand-light text-white gap-2">
                    ทำบทเรียนถัดไป <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : null}
              <Link href="/learn">
                <Button variant="outline">กลับสู่เส้นทางการเรียน</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <AskQuestionBox lessonId={lesson.id} />
      </div>
    );
  }

  if (phase === "quiz") {
    const q = questions[quizIndex];
    const isLast = quizIndex === questions.length - 1;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary">แบบทดสอบ</Badge>
          <span className="text-muted-foreground">
            ข้อ {quizIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-brand h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${((quizIndex + (showResult ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>

        <QuizQuestionCard
          question={q}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onSelect={handleSelect}
        />

        {showResult && (
          <Button
            onClick={handleNextQuestion}
            className="bg-brand hover:bg-brand-light text-white gap-2"
          >
            {isLast ? "จบบทเรียน" : "ข้อถัดไป"}{" "}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // phase === "cards"
  const card = cards[cardIndex];
  const isLastCard = cardIndex === cards.length - 1;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <Badge variant="secondary">
          {unit?.icon ?? "📘"} {unit?.title_th ?? "บทเรียน"}
        </Badge>
        <span className="text-muted-foreground">
          {cardIndex + 1} / {cards.length}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-brand h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((cardIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      <LessonCardView card={card} />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handlePrevCard}
          disabled={cardIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> ก่อนหน้า
        </Button>
        <Button
          onClick={handleNextCard}
          className="bg-brand hover:bg-brand-light text-white gap-2"
        >
          {isLastCard ? (
            hasQuiz ? (
              <>
                ทำแบบทดสอบ <Sparkles className="h-4 w-4" />
              </>
            ) : (
              <>
                จบบทเรียน <Trophy className="h-4 w-4" />
              </>
            )
          ) : (
            <>
              ถัดไป <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
