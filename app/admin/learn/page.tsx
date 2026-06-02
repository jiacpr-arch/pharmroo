"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft, Plus, ChevronRight } from "lucide-react";
import UnitEditor, {
  type UnitFormValues,
} from "@/components/admin/learn/UnitEditor";
import type { McqSubject } from "@/lib/types-mcq";
import type { UnitWithLessons } from "@/lib/types-learn";

export default function AdminLearnPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const [units, setUnits] = useState<UnitWithLessons[]>([]);
  const [subjects, setSubjects] = useState<McqSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const load = useCallback(() => {
    fetch("/api/admin/learn/units")
      .then((r) => r.json())
      .then((d) => {
        setUnits(d.units ?? []);
        setSubjects(d.subjects ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const createUnit = async (values: UnitFormValues) => {
    setSaving(true);
    try {
      await fetch("/api/admin/learn/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setCreating(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (u: UnitWithLessons) => {
    await fetch(`/api/admin/learn/units/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: u.status === "published" ? "draft" : "published",
      }),
    });
    load();
  };

  const remove = async (u: UnitWithLessons) => {
    if (!confirm(`ลบยูนิต "${u.title_th}" และบทเรียนทั้งหมด?`)) return;
    await fetch(`/api/admin/learn/units/${u.id}`, { method: "DELETE" });
    load();
  };

  if (status === "loading") {
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
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Admin Dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการบทเรียน (Microlearning)</h1>
        <Button
          onClick={() => setCreating((v) => !v)}
          className="bg-brand hover:bg-brand-light text-white gap-2"
        >
          <Plus className="h-4 w-4" /> เพิ่มยูนิต
        </Button>
      </div>

      {creating && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">ยูนิตใหม่</h2>
            <UnitEditor
              subjects={subjects}
              onSave={createUnit}
              onCancel={() => setCreating(false)}
              saving={saving}
            />
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand mx-auto" />
        </div>
      ) : (
        <div className="space-y-3">
          {units.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <Link
                  href={`/admin/learn/${u.id}`}
                  className="flex items-center gap-3 min-w-0 flex-1 hover:text-brand"
                >
                  <span className="text-2xl">{u.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{u.title_th}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.subject_name_th ?? "ไม่ผูกวิชา"} ·{" "}
                      {u.lessons.length} บทเรียน
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant="secondary"
                    className={
                      u.status === "published"
                        ? "bg-green-100 text-green-700 cursor-pointer"
                        : "cursor-pointer"
                    }
                    onClick={() => togglePublish(u)}
                  >
                    {u.status === "published" ? "เผยแพร่" : "ร่าง"}
                  </Badge>
                  <button
                    onClick={() => remove(u)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    ลบ
                  </button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
          {units.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              ยังไม่มียูนิต — กด “เพิ่มยูนิต” หรือรัน seed script
            </p>
          )}
        </div>
      )}
    </div>
  );
}
