"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { McqSubject } from "@/lib/types-mcq";

export interface UnitFormValues {
  title_th: string;
  subject_id: string | null;
  description_th: string;
  icon: string;
  status: "draft" | "published";
}

interface UnitEditorProps {
  subjects: McqSubject[];
  initial?: Partial<UnitFormValues>;
  onSave: (values: UnitFormValues) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
}

export default function UnitEditor({
  subjects,
  initial,
  onSave,
  onCancel,
  saving,
}: UnitEditorProps) {
  const [values, setValues] = useState<UnitFormValues>({
    title_th: initial?.title_th ?? "",
    subject_id: initial?.subject_id ?? null,
    description_th: initial?.description_th ?? "",
    icon: initial?.icon ?? "📘",
    status: initial?.status ?? "draft",
  });

  const set = <K extends keyof UnitFormValues>(k: K, v: UnitFormValues[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <label className="text-sm sm:col-span-1">
          <span className="block text-muted-foreground mb-1">ไอคอน</span>
          <input
            value={values.icon}
            onChange={(e) => set("icon", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
        <label className="text-sm sm:col-span-3">
          <span className="block text-muted-foreground mb-1">ชื่อยูนิต *</span>
          <input
            value={values.title_th}
            onChange={(e) => set("title_th", e.target.value)}
            placeholder="เช่น เภสัชวิทยาเบื้องต้น"
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
      </div>

      <label className="text-sm block">
        <span className="block text-muted-foreground mb-1">วิชา</span>
        <select
          value={values.subject_id ?? ""}
          onChange={(e) => set("subject_id", e.target.value || null)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
        >
          <option value="">— ไม่ผูกวิชา —</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.name_th}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm block">
        <span className="block text-muted-foreground mb-1">คำอธิบาย</span>
        <input
          value={values.description_th}
          onChange={(e) => set("description_th", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
        />
      </label>

      <label className="text-sm block">
        <span className="block text-muted-foreground mb-1">สถานะ</span>
        <select
          value={values.status}
          onChange={(e) =>
            set("status", e.target.value as "draft" | "published")
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
        >
          <option value="draft">ฉบับร่าง (ซ่อน)</option>
          <option value="published">เผยแพร่</option>
        </select>
      </label>

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(values)}
          disabled={saving || !values.title_th.trim()}
          className="bg-brand hover:bg-brand-light text-white"
        >
          บันทึก
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            ยกเลิก
          </Button>
        )}
      </div>
    </div>
  );
}
