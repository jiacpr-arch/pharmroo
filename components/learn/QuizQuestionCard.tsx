"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import type { McqQuestion } from "@/lib/types-mcq";

interface QuizQuestionCardProps {
  question: McqQuestion;
  selectedAnswer: string | null;
  showResult: boolean;
  onSelect: (label: string) => void;
}

/**
 * Presentational MCQ card (question + choices + short explanation) for the
 * lesson micro-quiz. Mirrors the choice styling used in McqPractice; selection
 * state is owned by the parent (LessonPlayer).
 */
export default function QuizQuestionCard({
  question,
  selectedAnswer,
  showResult,
  onSelect,
}: QuizQuestionCardProps) {
  return (
    <div className="space-y-4">
      {question.mcq_subjects && (
        <Badge variant="secondary" className="text-xs">
          {question.mcq_subjects.icon} {question.mcq_subjects.name_th}
        </Badge>
      )}

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
              onClick={() => onSelect(choice.label)}
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

      {showResult && (question.detailed_explanation?.summary || question.explanation) && (
        <Card className="border-green-300 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-1">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <h4 className="font-bold text-green-800">
                เฉลย: {question.correct_answer}
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-green-900">
              {question.detailed_explanation?.summary || question.explanation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
