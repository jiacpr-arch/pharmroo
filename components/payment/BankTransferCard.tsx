"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertCircle,
  Building2,
  Check,
  Copy,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import { BANK_INFO } from "@/lib/bank-info";

interface BankTransferCardProps {
  /** Amount due in baht. */
  amount: number;
  /** Called with the slip image as a base64 data URL when the user confirms. */
  onSubmit: (slipBase64: string) => Promise<void> | void;
  submitting?: boolean;
  /** External error from the submit call (validation errors are handled internally). */
  error?: string;
}

/**
 * Shared manual bank-transfer flow: account details, amount due, slip upload
 * with validation/preview, and the confirm button. Used by the subscription,
 * question-set, and credit top-up payment pages.
 */
export default function BankTransferCard({
  amount,
  onSubmit,
  submitting = false,
  error = "",
}: BankTransferCardProps) {
  const [copied, setCopied] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(BANK_INFO.accountNumberRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }
    setFileError("");
    const reader = new FileReader();
    reader.onload = (ev) => setSlipPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const shownError = fileError || error;

  return (
    <>
      <Card className="border-brand/20">
        <CardHeader>
          <h2 className="font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand" />
            ข้อมูลการโอนเงิน
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ธนาคาร</span>
              <span className="font-medium text-green-800">{BANK_INFO.bank}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">เลขที่บัญชี</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-green-800">
                  {BANK_INFO.accountNumber}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={copyAccountNumber}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ชื่อบัญชี</span>
              <span className="font-medium text-green-800">
                {BANK_INFO.accountName}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-green-200">
              <span className="text-sm font-medium text-green-700">
                ยอดที่ต้องโอน
              </span>
              <span className="text-xl font-bold text-green-800">
                ฿{amount.toLocaleString()}.00
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm text-amber-800">
              <strong>สำคัญ:</strong> กรุณาโอนเงินตามยอดที่ระบุ แล้วแนบสลิปด้านล่าง
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5 text-brand" />
            แนบสลิปการโอนเงิน
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {slipPreview ? (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slipPreview}
                  alt="สลิปการโอนเงิน"
                  className="w-full max-h-80 object-contain"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSlipPreview(null)}
              >
                เปลี่ยนรูป
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
              <ImageIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <span className="text-sm font-medium text-muted-foreground">
                คลิกเพื่อเลือกรูปสลิป
              </span>
              <span className="text-xs text-muted-foreground/60 mt-1">
                PNG, JPG ขนาดไม่เกิน 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
          {shownError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {shownError}
            </div>
          )}
          <Button
            className="w-full bg-brand hover:bg-brand-light text-white"
            size="lg"
            disabled={!slipPreview || submitting}
            onClick={() => slipPreview && onSubmit(slipPreview)}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              "ยืนยันการชำระเงิน"
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
