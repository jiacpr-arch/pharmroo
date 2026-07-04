"use client";

import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface CreditUnlockConfirmProps {
  creditBalance: number;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Lightweight confirm dialog for spending 1 credit to unlock a question's
 * detailed explanation. Follows the app's card-overlay pattern (no dialog lib).
 */
export default function CreditUnlockConfirm({
  creditBalance,
  loading = false,
  onConfirm,
  onCancel,
}: CreditUnlockConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative w-full max-w-sm rounded-2xl border-2 border-brand/30 bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
          <Coins className="h-6 w-6 text-brand" />
        </div>
        <h3 className="mb-1 text-lg font-bold">ปลดล็อกเฉลยละเอียด</h3>
        <p className="mb-1 text-sm text-muted-foreground">
          ใช้ 1 เครดิตเพื่อดูเฉลยละเอียดของข้อนี้แบบถาวร
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          เครดิตคงเหลือ {creditBalance} → {Math.max(creditBalance - 1, 0)}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 gap-2 bg-brand text-white hover:bg-brand-light"
          >
            <Coins className="h-4 w-4" />
            {loading ? "กำลังปลดล็อก..." : "ใช้ 1 เครดิต"}
          </Button>
          <Button
            onClick={onCancel}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            ยกเลิก
          </Button>
        </div>
      </div>
    </div>
  );
}
