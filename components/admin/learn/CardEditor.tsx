"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CardType } from "@/lib/types-learn";

export interface CardFormValues {
  card_type: CardType;
  title_th: string;
  body_md: string;
  image_url: string;
}

const CARD_TYPES: { value: CardType; label: string }[] = [
  { value: "concept", label: "แนวคิด" },
  { value: "example", label: "ตัวอย่าง" },
  { value: "tip", label: "เคล็ดลับ" },
  { value: "mnemonic", label: "เทคนิคจำ" },
  { value: "warning", label: "ข้อควรระวัง" },
];

interface CardEditorProps {
  initial?: Partial<CardFormValues>;
  onSave: (values: CardFormValues) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
}

export default function CardEditor({
  initial,
  onSave,
  onCancel,
  saving,
}: CardEditorProps) {
  const [values, setValues] = useState<CardFormValues>({
    card_type: initial?.card_type ?? "concept",
    title_th: initial?.title_th ?? "",
    body_md: initial?.body_md ?? "",
    image_url: initial?.image_url ?? "",
  });

  const set = <K extends keyof CardFormValues>(k: K, v: CardFormValues[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="text-sm">
          <span className="block text-muted-foreground mb-1">ประเภท</span>
          <select
            value={values.card_type}
            onChange={(e) => set("card_type", e.target.value as CardType)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          >
            {CARD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="block text-muted-foreground mb-1">หัวข้อ</span>
          <input
            value={values.title_th}
            onChange={(e) => set("title_th", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
          />
        </label>
      </div>

      <label className="text-sm block">
        <span className="block text-muted-foreground mb-1">
          เนื้อหา (markdown: **ตัวหนา**, - รายการ, ## หัวข้อ)
        </span>
        <textarea
          value={values.body_md}
          onChange={(e) => set("body_md", e.target.value)}
          rows={6}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand focus:outline-none"
        />
      </label>

      <label className="text-sm block">
        <span className="block text-muted-foreground mb-1">URL รูปภาพ (ถ้ามี)</span>
        <input
          value={values.image_url}
          onChange={(e) => set("image_url", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand focus:outline-none"
        />
      </label>

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(values)}
          disabled={saving || !values.body_md.trim()}
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
