"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Coins,
} from "lucide-react";
import type { McqQuestion } from "@/lib/types-mcq";
import { useSession } from "next-auth/react";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { Lock } from "lucide-react";
import CreditUnlockConfirm from "@/components/CreditUnlockConfirm";

type DetailedExplanation = NonNullable<McqQuestion["detailed_explanation"]>;

interface McqPracticeProps {
  questions: McqQuestion[];
  examType?: "PLE-PC" | "PLE-CC1" | "NLE";
  initialCreditBalance?: number;
}

export default function McqPractice({
  questions,
  examType = "PLE-CC1",
  initialCreditBalance = 0,
}: McqPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/purity
  const questionStartTime = useRef<number>(Date.now());
  const { data: authSession } = useSession();

  // Credit-based unlocking of detailed explanations
  const [creditBalance, setCreditBalance] = useState(initialCreditBalance);
  const [unlockedContent, setUnlockedContent] = useState<
    Record<string, DetailedExplanation>
  >({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Get user on mount and create session
  useEffect(() => {
    async function init() {
      const uid = (authSession?.user as { id?: string })?.id;
      if (!uid) return;
      setUserId(uid);
      try {
        const res = await fetch("/api/mcq/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "practice",
            exam_type: examType,
            total_questions: questions.length,
          }),
        });
        if (res.ok) {
          const session = await res.json();
          setSessionId(session.id);
        }
      } catch {
        // skip saving
      }
    }
    init();
  }, [questions.length, authSession, examType]);

  // Reset question timer when question changes
  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentIndex]);

  const question = questions[currentIndex];

  const handleSelectAnswer = useCallback(
    (label: string) => {
      if (showResult) return;
      setSelectedAnswer(label);
      setShowResult(true);

      const isCorrect = label === question.correct_answer;
      setStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));

      // Save attempt to DB if logged in
      if (userId) {
        const timeSpent = Math.round(
          (Date.now() - questionStartTime.current) / 1000
        );
        fetch("/api/mcq/attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: question.id,
            selected_answer: label,
            is_correct: isCorrect,
            time_spent_seconds: timeSpent,
            mode: "practice",
            session_id: sessionId,
          }),
        }).catch(() => {
          // Silently fail — don't block UI
        });
      }
    },
    [showResult, question, userId, sessionId]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setStats({ correct: 0, total: 0 });
  }, []);

  const handleUnlock = useCallback(async () => {
    if (unlocking || !question) return;
    setUnlocking(true);
    try {
      const res = await fetch(`/api/mcq/questions/${question.id}/unlock`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 402) {
        setCreditBalance(data.credit_balance ?? 0);
        track("out_of_credits", { question_id: question.id });
        setConfirmOpen(false);
        return;
      }
      if (!res.ok || !data.detailed_explanation) {
        setConfirmOpen(false);
        return;
      }

      setUnlockedContent((prev) => ({
        ...prev,
        [question.id]: data.detailed_explanation as DetailedExplanation,
      }));
      if (typeof data.credit_balance === "number") {
        setCreditBalance(data.credit_balance);
      }
      track("credit_unlock", { question_id: question.id });
      setConfirmOpen(false);
    } catch {
      setConfirmOpen(false);
    } finally {
      setUnlocking(false);
    }
  }, [unlocking, question]);

  const isFinished = showResult && currentIndex === questions.length - 1;
  const percentage =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const hasUpdatedSession = useRef(false);
  useEffect(() => {
    if (isFinished && sessionId && !hasUpdatedSession.current) {
      hasUpdatedSession.current = true;
      fetch("/api/mcq/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sessionId,
          correct_count: stats.correct,
          completed_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
  }, [isFinished, sessionId, stats.correct]);

  if (!question) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">ไม่มีข้อสอบ</p>
      </div>
    );
  }

  // Merged detailed explanation: paid members and pre-unlocked questions arrive
  // with full content in props; freshly unlocked ones come from unlockedContent.
  const detail: DetailedExplanation | null =
    unlockedContent[question.id] ?? question.detailed_explanation ?? null;
  const detailLocked =
    question.detailed_locked === true && !unlockedContent[question.id];
  const answeredWrong =
    showResult && selectedAnswer !== question.correct_answer;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          ข้อ {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-green-600">✓ {stats.correct}</span>
          <span className="text-red-600">✗ {stats.total - stats.correct}</span>
          {stats.total > 0 && (
            <Badge
              variant="secondary"
              className={
                percentage >= 60
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {percentage}%
            </Badge>
          )}
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-brand h-1.5 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Subject Badge */}
      {question.mcq_subjects && (
        <Badge variant="secondary" className="text-xs">
          {question.mcq_subjects.icon} {question.mcq_subjects.name_th}
          {question.exam_source && ` • ${question.exam_source}`}
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

      {/* Choices */}
      <div className="space-y-3">
        {question.choices.map((choice) => {
          const isSelected = selectedAnswer === choice.label;
          const isCorrect = choice.label === question.correct_answer;

          let borderClass = "border-border hover:border-brand/50";
          let bgClass = "bg-white";

          if (showResult) {
            if (isCorrect) {
              borderClass = "border-green-500";
              bgClass = "bg-green-50";
            } else if (isSelected && !isCorrect) {
              borderClass = "border-red-500";
              bgClass = "bg-red-50";
            } else {
              borderClass = "border-border opacity-60";
            }
          } else if (isSelected) {
            borderClass = "border-brand";
            bgClass = "bg-brand/5";
          }

          return (
            <button
              key={choice.label}
              onClick={() => handleSelectAnswer(choice.label)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderClass} ${bgClass} ${
                !showResult ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    showResult && isCorrect
                      ? "bg-green-500 text-white"
                      : showResult && isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {showResult && isCorrect ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : showResult && isSelected && !isCorrect ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    choice.label
                  )}
                </span>
                <span className="text-sm leading-relaxed pt-1">
                  {choice.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (question.detailed_explanation || question.explanation) && (
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
                      คำตอบที่ถูกต้อง: {question.correct_answer}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-green-900">
                    {question.detailed_explanation?.summary || question.explanation}
                  </p>
                </CardContent>
              </Card>

              {/* Detailed explanation — unlocked (paid or bought with a credit) */}
              {detail && (
                !detailLocked ? (
                  <>
                    {/* Detailed reason */}
                    <Card className="border-blue-200 bg-blue-50/30">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-blue-800 mb-2">เหตุผลโดยละเอียด</h4>
                        <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                          {detail.reason}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Each choice explanation */}
                    <div>
                      <h4 className="font-bold text-sm mb-3">อธิบายแต่ละตัวเลือก</h4>
                      <div className="space-y-2">
                        {detail.choices?.map((ce) => (
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
                                {ce.is_correct && (
                                  <Badge className="ml-2 bg-green-100 text-green-700 text-[10px]">
                                    ถูกต้อง
                                  </Badge>
                                )}
                                <p className="text-muted-foreground mt-1 leading-relaxed">
                                  {ce.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Calculation Steps */}
                    {detail.calculation_steps &&
                      detail.calculation_steps.length > 0 && (
                      <Card className="border-purple-200 bg-purple-50/30">
                        <CardContent className="p-4">
                          <h4 className="font-bold text-purple-800 mb-2 text-sm">ขั้นตอนคำนวณ</h4>
                          <ol className="list-decimal pl-5 space-y-1">
                            {detail.calculation_steps.map((step, i) => (
                              <li
                                key={i}
                                className="text-sm leading-relaxed text-purple-900"
                              >
                                {step}
                              </li>
                            ))}
                          </ol>
                        </CardContent>
                      </Card>
                    )}

                    {/* Key takeaway */}
                    {detail.key_takeaway && (
                      <Card className="border-amber-200 bg-amber-50/30">
                        <CardContent className="p-4">
                          <h4 className="font-bold text-amber-800 mb-1 text-sm">สรุปจุดสำคัญ</h4>
                          <p className="text-sm leading-relaxed text-amber-900">
                            {detail.key_takeaway}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  /* Locked: blurred preview + unlock-with-credit / subscribe CTA */
                  <div className="relative">
                    <div className="select-none pointer-events-none blur-[6px] opacity-60 space-y-4">
                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-4">
                          <h4 className="font-bold text-blue-800 mb-2">เหตุผลโดยละเอียด</h4>
                          <p className="text-sm leading-relaxed text-foreground/80">
                            {examType === "NLE"
                              ? "เหตุผลโดยละเอียดสำหรับคำตอบที่ถูกต้อง อธิบายกลไกทางการพยาบาลและการดูแลผู้ป่วย..."
                              : "เหตุผลโดยละเอียดสำหรับคำตอบที่ถูกต้อง อธิบายกลไกทางเภสัชวิทยา..."}
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
                    {/* Unlock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`bg-white/95 backdrop-blur-sm border-2 rounded-2xl p-6 text-center shadow-lg max-w-sm ${
                          answeredWrong ? "border-red-300" : "border-brand/30"
                        }`}
                      >
                        <Lock
                          className={`h-8 w-8 mx-auto mb-3 ${
                            answeredWrong ? "text-red-500" : "text-brand"
                          }`}
                        />
                        <h4 className="font-bold text-lg mb-1">
                          {answeredWrong
                            ? "อยากรู้ว่าทำไมผิด?"
                            : "เฉลยละเอียด"}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          ดูเหตุผลโดยละเอียด คำอธิบายทุกตัวเลือก และสรุปจุดสำคัญ
                        </p>

                        {creditBalance >= 1 ? (
                          <>
                            <Button
                              onClick={() => setConfirmOpen(true)}
                              className={`w-full gap-2 text-white ${
                                answeredWrong
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-brand hover:bg-brand-light"
                              }`}
                            >
                              <Coins className="h-4 w-4" />
                              ปลดล็อกเฉลย (1 เครดิต)
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                              เครดิตคงเหลือ {creditBalance} •{" "}
                              <Link href="/pricing" className="text-brand hover:underline">
                                สมาชิกรายเดือนดูได้ไม่อั้น
                              </Link>
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-red-600 mb-3">
                              เครดิตของคุณหมดแล้ว
                            </p>
                            <div className="flex flex-col gap-2">
                              <Link
                                href="/credits"
                                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
                              >
                                <Coins className="h-4 w-4" />
                                เติมเครดิต
                              </Link>
                              <Link
                                href="/pricing"
                                className="text-sm text-brand hover:underline"
                              >
                                หรือสมัครสมาชิกดูได้ไม่อั้น (คุ้มกว่า)
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showResult && (
        <div className="flex items-center gap-3">
          {!isFinished ? (
            <Button
              onClick={handleNext}
              className="bg-brand hover:bg-brand-light text-white gap-2"
            >
              ข้อถัดไป <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="w-full">
              <Card className="border-brand/20 bg-brand/5">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">ทำครบแล้ว!</h3>
                  <p className="text-3xl font-bold text-brand mb-1">
                    {stats.correct} / {stats.total}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    ({percentage}%){" "}
                    {percentage >= 80
                      ? "ดีมาก!"
                      : percentage >= 60
                        ? "ผ่านเกณฑ์"
                        : "ต้องทบทวนเพิ่ม"}
                  </p>
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" /> ทำใหม่อีกครั้ง
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Confirm spending 1 credit */}
      {confirmOpen && (
        <CreditUnlockConfirm
          creditBalance={creditBalance}
          loading={unlocking}
          onConfirm={handleUnlock}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
