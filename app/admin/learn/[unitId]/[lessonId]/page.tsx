"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft, Plus } from "lucide-react";
import LessonEditor, {
  type LessonFormValues,
} from "@/components/admin/learn/LessonEditor";
import CardEditor, {
  type CardFormValues,
} from "@/components/admin/learn/CardEditor";
import QuizAttachPanel from "@/components/admin/learn/QuizAttachPanel";
import type { LearningLesson, LessonCard } from "@/lib/types-learn";

type Tab = "content" | "quiz" | "settings";

export default function AdminLessonEditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;
  const lessonId = params.lessonId as string;
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const [lesson, setLesson] = useState<LearningLesson | null>(null);
  const [cards, setCards] = useState<LessonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("content");
  const [addingCard, setAddingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const load = useCallback(() => {
    fetch(`/api/admin/learn/lessons/${lessonId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setLesson(d.lesson);
          setCards(d.cards ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const saveSettings = async (values: LessonFormValues) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/learn/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      load();
    } finally {
      setSaving(false);
    }
  };

  const addCard = async (values: CardFormValues) => {
    setSaving(true);
    try {
      await fetch("/api/admin/learn/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, lesson_id: lessonId }),
      });
      setAddingCard(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const updateCard = async (id: string, values: CardFormValues) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/learn/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setEditingCardId(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm("ลบการ์ดนี้?")) return;
    await fetch(`/api/admin/learn/cards/${id}`, { method: "DELETE" });
    load();
  };

  if (status === "loading" || (loading && isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={`/admin/learn/${unitId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> กลับยูนิต
      </Link>
      <h1 className="text-2xl font-bold mb-1">{lesson?.title_th}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        แก้เนื้อหาการ์ด แนบ quiz และตั้งค่าบทเรียน
      </p>

      <div className="flex gap-2 mb-6 border-b">
        {(
          [
            ["content", "เนื้อหา"],
            ["quiz", "แบบทดสอบ"],
            ["settings", "ตั้งค่า"],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="space-y-3">
          {cards.map((c, i) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                {editingCardId === c.id ? (
                  <CardEditor
                    initial={{
                      card_type: c.card_type,
                      title_th: c.title_th ?? "",
                      body_md: c.body_md,
                      image_url: c.image_url ?? "",
                    }}
                    onSave={(v) => updateCard(c.id, v)}
                    onCancel={() => setEditingCardId(null)}
                    saving={saving}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {i + 1}. {c.card_type}
                        </Badge>
                        {c.source === "student_qa" && (
                          <Badge variant="outline" className="text-[10px]">
                            จากคำถามผู้เรียน
                          </Badge>
                        )}
                      </div>
                      {c.title_th && (
                        <p className="font-semibold">{c.title_th}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
                        {c.body_md}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0 text-sm">
                      <button
                        onClick={() => setEditingCardId(c.id)}
                        className="text-brand hover:underline"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => deleteCard(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {addingCard ? (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">การ์ดใหม่</h3>
                <CardEditor
                  onSave={addCard}
                  onCancel={() => setAddingCard(false)}
                  saving={saving}
                />
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              onClick={() => setAddingCard(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> เพิ่มการ์ด
            </Button>
          )}
        </div>
      )}

      {tab === "quiz" && <QuizAttachPanel lessonId={lessonId} />}

      {tab === "settings" && lesson && (
        <LessonEditor
          initial={{
            title_th: lesson.title_th,
            subtitle_th: lesson.subtitle_th ?? "",
            icon: lesson.icon,
            est_minutes: lesson.est_minutes,
            xp_reward: lesson.xp_reward,
            quiz_count: lesson.quiz_count,
            status: lesson.status,
          }}
          onSave={saveSettings}
          saving={saving}
        />
      )}
    </div>
  );
}
