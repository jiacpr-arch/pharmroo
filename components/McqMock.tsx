"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Clock,
  Send,
  AlertTriangle,
} from "lucide-react";
import type { McqQuestion } from "@/lib/types-mcq";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Lock } from "lucide-react";

interface McqMockProps {
  questions: McqQuestion[];
  timeLimitMinutes: number;
  examType?: "PLE-PC" | "PLE-CC1" | "NLE";
}

type MockPhase = "exam" | "results" | "review";

interface SubjectResult {
  subjectId: string;
  subjectName: string;
  icon: string;
  correct: number;
  total: number;
}

export default function McqMock({
  questions,
  timeLimitMinutes,
  examType = "PLE-CC1",
}: McqMockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<MockPhase>("exam");
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60); // seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const { data: authSession } = useSession();
  const membershipType = (authSession?.user as { membership_type?: string })?.membership_type;
  const isPaid = membershipType === "monthly" || membershipType === "yearly";
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mcqSessionId, setMcqSessionId] = useState<string | null>(null);
  const hasSavedResults = useRef(false);

  // Calculate results (declared early for use in save effect)
  const getResults = useCallback(() => {
    let correct = 0;
    const subjectMap = new Map<string, SubjectResult>();

    questions.forEach((q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correct++;

      const subjectId = q.subject_id;
      const subjectName = q.mcq_subjects?.name_th || "ไม่ระบุ";
      const icon = q.mcq_subjects?.icon || "📝";

      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, { subjectId, subjectName, icon, correct: 0, total: 0 });
      }
      const entry = subjectMap.get(subjectId)!;
      entry.total++;
      if (isCorrect) entry.correct++;
    });

    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      subjects: Array.from(subjectMap.values()).sort((a, b) => b.total - a.total),
    };
  }, [questions, answers]);

  // Create session on mount
  useEffect(() => {
    const uid = (authSession?.user as { id?: string })?.id;
    if (!uid) return;
    fetch("/api/mcq/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "mock",
        exam_type: examType,
        total_questions: questions.length,
        time_limit_minutes: timeLimitMinutes,
      }),
    })
      .then((r) => r.json())
      .then((s) => setMcqSessionId(s.id))
      .catch(() => {});
  }, [authSession, questions.length, timeLimitMinutes, examType]);

  // Save results when entering results phase
  useEffect(() => {
    if (phase !== "results" || hasSavedResults.current || !mcqSessionId) return;
    hasSavedResults.current = true;
    const uid = (authSession?.user as { id?: string })?.id;
    if (!uid) return;

    const results = getResults();

    // Bulk save attempts
    const attemptData = questions.map((q, i) => ({
      question_id: q.id,
      selected_answer: answers[i] || "",
      is_correct: answers[i] === q.correct_answer,
    }));
    fetch("/api/mcq/attempts/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: mcqSessionId, attempts: attemptData }),
    }).catch(() => {});

    // Update session
    fetch("/api/mcq/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: mcqSessionId,
        correct_count: results.correct,
        completed_at: new Date().toISOString(),
      }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mcqSessionId]);

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit
          clearInterval(timerRef.current!);
          setPhase("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = useCallback(
    (label: string) => {
      if (phase !== "exam") return;
      setAnswers((prev) => ({ ...prev, [currentIndex]: label }));
    },
    [phase, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("results");
    setShowConfirmSubmit(false);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setPhase("exam");
    setTimeLeft(timeLimitMinutes * 60);
    setShowConfirmSubmit(false);
    setReviewIndex(0);
    setShowExplanation(false);
  }, [timeLimitMinutes]);

  const answeredCount = Object.keys(answers).length;
  const question = questions[currentIndex];

  if (!question) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">ไม่มีข้อสอบ</p>
      </div>
    );
  }

  // --- EXAM PHASE ---
  if (phase === "exam") {
    const isTimeLow = timeLeft < 300; // under 5 min

    return (
      <div className="space-y-6">
        {/* Timer & Progress */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur pb-3 pt-1 -mx-1 px-1">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              ข้อ {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                ตอบแล้ว {answeredCount}/{questions.length}
              </Badge>
              <Badge
                variant="secondary"
                className={
                  isTimeLow
                    ? "bg-red-100 text-red-700 animate-pulse"
                    : "bg-blue-100 text-blue-700"
                }
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-brand h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${(answeredCount / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Number Grid (mini nav) */}
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                i === currentIndex
                  ? "bg-brand text-white ring-2 ring-brand/30"
                  : answers[i] !== undefined
                    ? "bg-brand/20 text-brand"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Subject Badge */}
        {question.mcq_subjects && (
          <Badge variant="secondary" className="text-xs">
            {question.mcq_subjects.icon} {question.mcq_subjects.name_th}
            {question.exam_source && ` \u2022 ${question.exam_source}`}
          </Badge>
        )}

        {/* Question */}
        <Card>
          <CardContent className="p-6">
            <p className="text-base leading-relaxed whitespace-pre-line">
              {question.scenario}
            </p>
            {question.image_url && (
              <div className="mt-4">
                <img
                  src={question.image_url}
                  alt="โจทย์ประกอบ"
                  className="max-w-full rounded-lg border max-h-80 object-contain"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Choices - select but do NOT reveal answer */}
        <div className="space-y-3">
          {question.choices.map((choice) => {
            const isSelected = answers[currentIndex] === choice.label;

            return (
              <button
                key={choice.label}
                onClick={() => handleSelectAnswer(choice.label)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-brand bg-brand/5"
                    : "border-border hover:border-brand/50 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSelected
                        ? "bg-brand text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {choice.label}
                  </span>
                  <span className="text-sm leading-relaxed pt-1">
                    {choice.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrev}
            variant="outline"
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> ข้อก่อนหน้า
          </Button>

          <div className="flex gap-2">
            {currentIndex < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-brand hover:bg-brand-light text-white gap-2"
              >
                ข้อถัดไป <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}

            <Button
              onClick={() => setShowConfirmSubmit(true)}
              variant="outline"
              className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Send className="h-4 w-4" /> ส่งข้อสอบ
            </Button>
          </div>
        </div>

        {/* Confirm Submit Dialog */}
        {showConfirmSubmit && (
          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-2">ยืนยันส่งข้อสอบ?</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    ตอบแล้ว {answeredCount} จาก {questions.length} ข้อ
                  </p>
                  {answeredCount < questions.length && (
                    <p className="text-sm text-red-600 mb-3">
                      ยังมี {questions.length - answeredCount} ข้อที่ยังไม่ได้ตอบ
                    </p>
                  )}
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={handleSubmit}
                      className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                    >
                      <Send className="h-4 w-4" /> ยืนยันส่ง
                    </Button>
                    <Button
                      onClick={() => setShowConfirmSubmit(false)}
                      variant="outline"
                    >
                      ทำต่อ
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // --- RESULTS PHASE ---
  if (phase === "results") {
    const results = getResults();

    return (
      <div className="space-y-6">
        {/* Score Card */}
        <Card className="border-brand/20 bg-brand/5">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">ผลการสอบ</h2>
            <p className="text-5xl font-bold text-brand mb-2">
              {results.correct} / {results.total}
            </p>
            <Badge
              className={`text-lg px-4 py-1 ${
                results.percentage >= 60
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {results.percentage}%{" "}
              {results.percentage >= 80
                ? "ดีมาก!"
                : results.percentage >= 60
                  ? "ผ่านเกณฑ์"
                  : "ไม่ผ่านเกณฑ์"}
            </Badge>
            <p className="text-sm text-muted-foreground mt-3">
              เวลาที่ใช้: {formatTime(timeLimitMinutes * 60 - timeLeft)} /{" "}
              {formatTime(timeLimitMinutes * 60)}
            </p>
          </CardContent>
        </Card>

        {/* Subject Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">คะแนนแยกตามสาขา</h3>
            <div className="space-y-3">
              {results.subjects.map((s) => {
                const pct =
                  s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <div key={s.subjectId} className="flex items-center gap-3">
                    <span className="text-lg w-8">{s.icon}</span>
                    <span className="flex-1 text-sm">{s.subjectName}</span>
                    <span className="text-sm font-medium">
                      {s.correct}/{s.total}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`w-14 justify-center ${
                        pct >= 60
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {pct}%
                    </Badge>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          pct >= 60 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setPhase("review");
              setReviewIndex(0);
              setShowExplanation(false);
            }}
            className="bg-brand hover:bg-brand-light text-white gap-2"
          >
            <CheckCircle className="h-4 w-4" /> ดูเฉลยทุกข้อ
          </Button>
          <Button onClick={handleRestart} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> สอบใหม่
          </Button>
        </div>
      </div>
    );
  }

  // --- REVIEW PHASE ---
  if (phase === "review") {
    const reviewQuestion = questions[reviewIndex];
    const userAnswer = answers[reviewIndex];
    const isCorrect = userAnswer === reviewQuestion.correct_answer;

    return (
      <div className="space-y-6">
        {/* Review Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold">
            ทบทวนข้อ {reviewIndex + 1} / {questions.length}
          </h3>
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className={
                isCorrect
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {isCorrect ? "ถูก" : "ผิด"}
            </Badge>
            {!userAnswer && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                ไม่ได้ตอบ
              </Badge>
            )}
          </div>
        </div>

        {/* Subject Badge */}
        {reviewQuestion.mcq_subjects && (
          <Badge variant="secondary" className="text-xs">
            {reviewQuestion.mcq_subjects.icon}{" "}
            {reviewQuestion.mcq_subjects.name_th}
            {reviewQuestion.exam_source &&
              ` \u2022 ${reviewQuestion.exam_source}`}
          </Badge>
        )}

        {/* Question */}
        <Card>
          <CardContent className="p-6">
            <p className="text-base leading-relaxed whitespace-pre-line">
              {reviewQuestion.scenario}
            </p>
          </CardContent>
        </Card>

        {/* Choices - show correct/wrong */}
        <div className="space-y-3">
          {reviewQuestion.choices.map((choice) => {
            const isSelected = userAnswer === choice.label;
            const isChoiceCorrect =
              choice.label === reviewQuestion.correct_answer;

            let borderClass = "border-border opacity-60";
            let bgClass = "bg-white";

            if (isChoiceCorrect) {
              borderClass = "border-green-500";
              bgClass = "bg-green-50";
            } else if (isSelected && !isChoiceCorrect) {
              borderClass = "border-red-500";
              bgClass = "bg-red-50";
            }

            return (
              <div
                key={choice.label}
                className={`w-full text-left p-4 rounded-xl border-2 ${borderClass} ${bgClass}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isChoiceCorrect
                        ? "bg-green-500 text-white"
                        : isSelected && !isChoiceCorrect
                          ? "bg-red-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isChoiceCorrect ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : isSelected && !isChoiceCorrect ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      choice.label
                    )}
                  </span>
                  <span className="text-sm leading-relaxed pt-1">
                    {choice.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {(reviewQuestion.detailed_explanation || reviewQuestion.explanation) && (
          <div>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              {showExplanation ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {showExplanation ? "ซ่อนคำอธิบาย" : "ดูเฉลย"}
            </button>
            {showExplanation && (
              <div className="mt-3 space-y-4">
                {/* Short explanation — visible to everyone */}
                <Card className="border-green-300 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <h4 className="font-bold text-green-800">
                        คำตอบที่ถูกต้อง: {reviewQuestion.correct_answer}
                      </h4>
                    </div>
                    <p className="text-sm leading-relaxed text-green-900">
                      {reviewQuestion.detailed_explanation?.summary || reviewQuestion.explanation}
                    </p>
                  </CardContent>
                </Card>

                {/* Detailed — paid only */}
                {reviewQuestion.detailed_explanation && (
                  isPaid ? (
                    <>
                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-4">
                          <h4 className="font-bold text-blue-800 mb-2">เหตุผลโดยละเอียด</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                            {reviewQuestion.detailed_explanation.reason}
                          </p>
                        </CardContent>
                      </Card>

                      <div>
                        <h4 className="font-bold text-sm mb-3">อธิบายแต่ละตัวเลือก</h4>
                        <div className="space-y-2">
                          {reviewQuestion.detailed_explanation.choices?.map((ce) => (
                            <div
                              key={ce.label}
                              className={`p-3 rounded-lg border text-sm ${
                                ce.is_correct
                                  ? "border-green-300 bg-green-50/50"
                                  : "border-border bg-muted/30"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    ce.is_correct
                                      ? "bg-green-500 text-white"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {ce.label}
                                </span>
                                <div>
                                  <span className="font-medium">{ce.text}</span>
                                  <p className="text-muted-foreground mt-1 leading-relaxed">
                                    {ce.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {reviewQuestion.detailed_explanation.key_takeaway && (
                        <Card className="border-amber-200 bg-amber-50/30">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-amber-800 mb-1 text-sm">สรุปจุดสำคัญ</h4>
                            <p className="text-sm leading-relaxed text-amber-900">
                              {reviewQuestion.detailed_explanation.key_takeaway}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <div className="relative">
                      <div className="select-none pointer-events-none blur-[6px] opacity-60 space-y-4">
                        <Card className="border-blue-200 bg-blue-50/30">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-blue-800 mb-2">เหตุผลโดยละเอียด</h4>
                            <p className="text-sm text-foreground/80">
                              {reviewQuestion.detailed_explanation.reason || "เหตุผลโดยละเอียดสำหรับคำตอบที่ถูกต้อง..."}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-sm mb-2">อธิบายแต่ละตัวเลือก</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p>A: คำอธิบายตัวเลือก A โดยละเอียด...</p>
                              <p>B: คำอธิบายตัวเลือก B โดยละเอียด...</p>
                              <p>C: คำอธิบายตัวเลือก C โดยละเอียด...</p>
                              <p>D: คำอธิบายตัวเลือก D โดยละเอียด...</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-sm border-2 border-brand/30 rounded-2xl p-6 text-center shadow-lg max-w-sm">
                          <Lock className="h-8 w-8 text-brand mx-auto mb-3" />
                          <h4 className="font-bold text-lg mb-1">เฉลยละเอียด</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            สมัครสมาชิกเพื่อดูเหตุผลโดยละเอียด คำอธิบายทุกตัวเลือก และสรุปจุดสำคัญ
                          </p>
                          <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
                          >
                            สมัครสมาชิก
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Review Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              setReviewIndex((prev) => prev - 1);
              setShowExplanation(false);
            }}
            variant="outline"
            disabled={reviewIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> ข้อก่อนหน้า
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => setPhase("results")}
              variant="outline"
              className="gap-2"
            >
              กลับหน้าผล
            </Button>

            {reviewIndex < questions.length - 1 && (
              <Button
                onClick={() => {
                  setReviewIndex((prev) => prev + 1);
                  setShowExplanation(false);
                }}
                className="bg-brand hover:bg-brand-light text-white gap-2"
              >
                ข้อถัดไป <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
