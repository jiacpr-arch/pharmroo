"use client";

import { Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface InvoiceData {
  requested: boolean;
  type: "personal" | "company";
  name: string;
  taxId: string;
  address: string;
  branch: string;
}

interface Props {
  value: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const defaultInvoiceData: InvoiceData = {
  requested: false,
  type: "personal",
  name: "",
  taxId: "",
  address: "",
  branch: "",
};

export default function InvoiceForm({ value, onChange }: Props) {
  const update = (partial: Partial<InvoiceData>) => onChange({ ...value, ...partial });

  return (
    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 space-y-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value.requested}
          onChange={(e) => update({ requested: e.target.checked })}
          className="w-4 h-4 accent-brand"
        />
        <span className="flex items-center gap-2 text-sm font-medium">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          ต้องการใบกำกับภาษี / ใบเสร็จรับเงิน
        </span>
      </label>

      {value.requested && (
        <div className="space-y-3 pt-1">
          {/* ประเภท */}
          <div className="flex gap-4">
            {(["personal", "company"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="invoice_type"
                  checked={value.type === t}
                  onChange={() => update({ type: t })}
                  className="accent-brand"
                />
                {t === "personal" ? "บุคคลธรรมดา" : "นิติบุคคล / บริษัท"}
              </label>
            ))}
          </div>

          {/* ชื่อ */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {value.type === "personal" ? "ชื่อ-นามสกุล" : "ชื่อบริษัท / นิติบุคคล"}
            </label>
            <Input
              placeholder={value.type === "personal" ? "กรอกชื่อ-นามสกุล" : "กรอกชื่อบริษัท"}
              value={value.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </div>

          {/* เลขผู้เสียภาษี */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              เลขประจำตัวผู้เสียภาษี (13 หลัก)
            </label>
            <Input
              placeholder="0000000000000"
              maxLength={13}
              value={value.taxId}
              onChange={(e) => update({ taxId: e.target.value.replace(/\D/g, "") })}
            />
          </div>

          {/* สาขา (เฉพาะนิติบุคคล) */}
          {value.type === "company" && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                สาขา (ถ้ามี)
              </label>
              <Input
                placeholder="สำนักงานใหญ่ / Head Office / เลขสาขา"
                value={value.branch}
                onChange={(e) => update({ branch: e.target.value })}
              />
            </div>
          )}

          {/* ที่อยู่ */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">ที่อยู่สำหรับออกใบกำกับ</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
              value={value.address}
              onChange={(e) => update({ address: e.target.value })}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            ทีมงานจะส่งใบกำกับภาษี/ใบเสร็จให้ทางอีเมลภายใน 3 วันทำการ
          </p>
        </div>
      )}
    </div>
  );
}
