"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface LessonFormValues {
  title_th: string;
  subtitle_th: string;
  icon: string;
  est_minutes: number;
  xp_reward: number;
  quiz_count: number;
  status: "draft" | "published";
}

interface LessonEditorProps {
  initial?: Partial<LessonFormValues>;
  onSave: (values: LessonFormValues) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
}

export default function LessonEditor({
  initial,
  onSave,
  onCancel,
  saving,
}: LessonEditorProps) {
  const [values, setValues] = useState<LessonFormValues>({
    title_th: initial?.title_th ?? "",
    subtitle_th: initial?.subtitle_th ?? "",
    icon: initial?.icon ?? "⭐",
    est_minutes: initial?.est_minutes ?? 5,
    xp_reward: initial?.xp_reward ?? 10,
    quiz_count: initial?.quiz_count ?? 3,
    status: initial?.status ?? "draft",
  });

  const set = <K extends keyof LessonFormValues>(
    k: K,
    v: LessonFormValues[K]
  ) => setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <label className="text-sm">
          <span className="block text-muted-foreground mb-1">ไอคอน</span>
          <input
            value={values.icon}
            onChange={(e) => set("icon", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
        <label className="text-sm sm:col-span-3">
          <span className="block text-muted-foreground mb-1">ชื่อบทเรียน *</span>
          <input
            value={values.title_th}
            onChange={(e) => set("title_th", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
      </div>

      <label className="text-sm block">
        <span className="block text-muted-foreground mb-1">คำโปรย</span>
        <input
          value={values.subtitle_th}
          onChange={(e) => set("subtitle_th", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="text-sm">
          <span className="block text-muted-foreground mb-1">นาที</span>
          <input
            type="number"
            value={values.est_minutes}
            onChange={(e) => set("est_minutes", Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="block text-muted-foreground mb-1">XP</span>
          <input
            type="number"
            value={values.xp_reward}
            onChange={(e) => set("xp_reward", Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="block text-muted-foreground mb-1">จำนวน quiz</span>
          <input
            type="number"
            value={values.quiz_count}
            onChange={(e) => set("quiz_count", Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
      </div>

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
