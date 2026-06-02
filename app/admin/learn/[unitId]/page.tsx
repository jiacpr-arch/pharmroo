"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft, Plus, ChevronRight } from "lucide-react";
import LessonEditor, {
  type LessonFormValues,
} from "@/components/admin/learn/LessonEditor";
import type { UnitWithLessons, LearningLesson } from "@/lib/types-learn";

export default function AdminUnitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const [unit, setUnit] = useState<UnitWithLessons | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const load = useCallback(() => {
    fetch(`/api/admin/learn/units/${unitId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUnit(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [unitId]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const createLesson = async (values: LessonFormValues) => {
    setSaving(true);
    try {
      await fetch("/api/admin/learn/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          unit_id: unitId,
          sort_order: unit?.lessons.length ?? 0,
        }),
      });
      setCreating(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (l: LearningLesson) => {
    await fetch(`/api/admin/learn/lessons/${l.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: l.status === "published" ? "draft" : "published",
      }),
    });
    load();
  };

  const remove = async (l: LearningLesson) => {
    if (!confirm(`ลบบทเรียน "${l.title_th}"?`)) return;
    await fetch(`/api/admin/learn/lessons/${l.id}`, { method: "DELETE" });
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/learn"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> ยูนิตทั้งหมด
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{unit?.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{unit?.title_th}</h1>
            <p className="text-sm text-muted-foreground">
              {unit?.subject_name_th ?? "ไม่ผูกวิชา"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCreating((v) => !v)}
          className="bg-brand hover:bg-brand-light text-white gap-2"
        >
          <Plus className="h-4 w-4" /> เพิ่มบทเรียน
        </Button>
      </div>

      {creating && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">บทเรียนใหม่</h2>
            <LessonEditor
              onSave={createLesson}
              onCancel={() => setCreating(false)}
              saving={saving}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {(unit?.lessons ?? []).map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <Link
                href={`/admin/learn/${unitId}/${l.id}`}
                className="flex items-center gap-3 min-w-0 flex-1 hover:text-brand"
              >
                <span className="text-2xl">{l.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{l.title_th}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.est_minutes} นาที · {l.xp_reward} XP · quiz{" "}
                    {l.quiz_question_ids.length > 0
                      ? `${l.quiz_question_ids.length} ข้อ`
                      : `สุ่ม ${l.quiz_count}`}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant="secondary"
                  className={
                    l.status === "published"
                      ? "bg-green-100 text-green-700 cursor-pointer"
                      : "cursor-pointer"
                  }
                  onClick={() => togglePublish(l)}
                >
                  {l.status === "published" ? "เผยแพร่" : "ร่าง"}
                </Badge>
                <button
                  onClick={() => remove(l)}
                  className="text-sm text-red-600 hover:underline"
                >
                  ลบ
                </button>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
        {(unit?.lessons.length ?? 0) === 0 && (
          <p className="text-center text-muted-foreground py-12">
            ยังไม่มีบทเรียนในยูนิตนี้
          </p>
        )}
      </div>
    </div>
  );
}
