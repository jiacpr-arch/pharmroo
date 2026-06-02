"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, Loader2, Sparkles } from "lucide-react";
import { MiniMarkdown } from "./MiniMarkdown";

interface AskQuestionBoxProps {
  lessonId: string;
}

/**
 * "Ask about this lesson" box. Sends the question to /api/learn/ask which
 * answers via the API and auto-appends the answer as a permanent lesson card.
 */
export default function AskQuestionBox({ lessonId }: AskQuestionBoxProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/learn/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lessonId, question: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ตอบคำถามไม่สำเร็จ");
      } else {
        setAnswer(data.answer_md);
        setQuestion("");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-teal-200 bg-teal-50/30">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircleQuestion className="h-5 w-5 text-teal-600" />
          <h3 className="font-bold text-teal-800">ถามคำถามเกี่ยวกับบทเรียนนี้</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          คำตอบจะถูกเพิ่มเข้าบทเรียนนี้ให้เพื่อน ๆ ได้อ่านด้วย
        </p>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="เช่น ทำไมยานี้ห้ามใช้ในผู้ป่วยตับวาย?"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-muted-foreground">
            {question.length}/500
          </span>
          <Button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="bg-brand hover:bg-brand-light text-white gap-2"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> กำลังตอบ...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> ถาม
              </>
            )}
          </Button>
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        {answer && (
          <div className="mt-4 rounded-lg border border-teal-200 bg-white p-4">
            <h4 className="font-semibold text-teal-800 mb-1 text-sm">คำตอบ</h4>
            <div className="text-sm text-foreground/90">
              <MiniMarkdown source={answer} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              ✅ เพิ่มคำตอบนี้เข้าบทเรียนแล้ว
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
