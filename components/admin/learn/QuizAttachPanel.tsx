"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Candidate {
  id: string;
  scenario: string;
  difficulty: string;
}

interface QuizAttachPanelProps {
  lessonId: string;
}

/**
 * Attach specific MCQ questions to a lesson's quiz, or set the fallback count
 * (random pull by subject). Saves to /api/admin/learn/lessons/[id]/quiz.
 */
export default function QuizAttachPanel({ lessonId }: QuizAttachPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [quizCount, setQuizCount] = useState(3);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/learn/lessons/${lessonId}/quiz`)
      .then((r) => r.json())
      .then((d) => {
        setCandidates(d.candidates ?? []);
        setSelected(d.selected ?? []);
        setQuizCount(d.quiz_count ?? 3);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/learn/lessons/${lessonId}/quiz`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_question_ids: selected,
          quiz_count: quizCount,
        }),
      });
      setMsg(res.ok ? "บันทึกแล้ว" : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 text-center">
        <Loader2 className="h-5 w-5 animate-spin text-brand mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        เลือกข้อสอบที่ต้องการให้เป็น quiz ของบทเรียน (ถ้าไม่เลือก ระบบจะสุ่ม{" "}
        {quizCount} ข้อจากวิชาของยูนิตให้อัตโนมัติ)
      </p>

      <label className="text-sm flex items-center gap-2">
        <span className="text-muted-foreground">จำนวนข้อสุ่ม (fallback):</span>
        <input
          type="number"
          value={quizCount}
          min={0}
          onChange={(e) => setQuizCount(Number(e.target.value))}
          className="w-20 border rounded-lg px-2 py-1 focus:ring-1 focus:ring-brand focus:outline-none"
        />
      </label>

      <div className="max-h-72 overflow-y-auto border rounded-lg divide-y">
        {candidates.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            ไม่มีข้อสอบในวิชานี้ (ผูกวิชาให้ยูนิตก่อน)
          </p>
        )}
        {candidates.map((c) => (
          <label
            key={c.id}
            className="flex items-start gap-2 p-3 text-sm cursor-pointer hover:bg-muted/40"
          >
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
              className="mt-1"
            />
            <span className="flex-1">{c.scenario}…</span>
            <Badge variant="secondary" className="text-[10px]">
              {c.difficulty}
            </Badge>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={save}
          disabled={saving}
          className="bg-brand hover:bg-brand-light text-white"
        >
          บันทึก quiz ({selected.length} ข้อที่เลือก)
        </Button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}
