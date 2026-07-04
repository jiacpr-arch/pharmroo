"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { track } from "@vercel/analytics";
import { trackInitiateCheckout } from "@/lib/analytics/conversions";
import InvoiceForm, {
  defaultInvoiceData,
  type InvoiceData,
} from "@/components/invoice-form";
import BankTransferCard from "@/components/payment/BankTransferCard";
import type { CreditPack } from "@/lib/db/schema";
import {
  ArrowLeft,
  Coins,
  Loader2,
  AlertCircle,
  Crown,
  Check,
  CheckCircle,
} from "lucide-react";

type Pack = Pick<CreditPack, "id" | "name_th" | "amount_credits" | "price">;

export default function CreditsClient({
  packs,
  balance,
  loggedIn,
}: {
  packs: Pack[];
  balance: number;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Manual bank-transfer state
  const [slipPackId, setSlipPackId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);

  const requireLogin = () => {
    if (!loggedIn) {
      router.push("/login?redirect=/credits");
      return true;
    }
    return false;
  };

  const handleStripe = async (pack: Pack) => {
    if (requireLogin()) return;
    setLoadingId(pack.id);
    setError("");
    trackInitiateCheckout({ value: pack.price, currency: "THB" });
    track("credit_checkout_started", {
      pack_id: pack.id,
      credits: pack.amount_credits,
      method: "stripe",
    });
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "credit", packId: pack.id, invoiceData }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        setLoadingId(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setLoadingId(null);
    }
  };

  const handleSlipSubmit = async (slipBase64: string) => {
    if (!slipPackId) return;
    if (requireLogin()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/payment/credit/${slipPackId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slipBase64, invoiceData }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "เกิดข้อผิดพลาด");
        setSubmitting(false);
        return;
      }
      track("credit_checkout_started", { pack_id: slipPackId, method: "slip" });
      setSubmitted(true);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPack = packs.find((p) => p.id === slipPackId) ?? null;

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="text-center">
          <CardContent className="py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-brand" />
            </div>
            <h1 className="text-2xl font-bold">ส่งหลักฐานเรียบร้อย!</h1>
            <p className="text-muted-foreground">
              เราจะตรวจสอบและเติมเครดิตให้บัญชีของคุณ
              <br />
              ภายใน <strong>1-2 ชั่วโมง</strong> ในเวลาทำการ
            </p>
            <Link href="/ple/practice">
              <Button className="w-full bg-brand hover:bg-brand-light text-white">
                กลับไปทำข้อสอบ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/ple/practice"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> กลับไปทำข้อสอบ
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">เติมเครดิต</h1>
        <p className="text-muted-foreground text-sm mt-1">
          1 เครดิต = ปลดล็อกเฉลยละเอียดของข้อสอบ 1 ข้อ (ดูซ้ำได้ตลอด)
        </p>
        {loggedIn && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
            <Coins className="h-4 w-4" />
            เครดิตคงเหลือ {balance}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Pack cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {packs.map((pack, i) => {
          const perQuestion = pack.price / pack.amount_credits;
          const popular = i === 1;
          return (
            <Card
              key={pack.id}
              className={popular ? "border-brand border-2 relative" : ""}
            >
              {popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-xs font-medium text-white">
                  คุ้มสุด
                </span>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold">
                    {pack.amount_credits}
                  </span>
                  <span className="text-sm text-muted-foreground">เครดิต</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-2xl font-bold">฿{pack.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    ~฿{perQuestion.toFixed(1)} / ข้อ
                  </p>
                </div>
                <Button
                  className="w-full gap-2 bg-brand hover:bg-brand-light text-white"
                  onClick={() => handleStripe(pack)}
                  disabled={loadingId === pack.id}
                >
                  {loadingId === pack.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      กำลังเปิด...
                    </>
                  ) : (
                    <>
                      <Coins className="h-4 w-4" />
                      ซื้อด้วยบัตร
                    </>
                  )}
                </Button>
                <button
                  onClick={() => {
                    setSlipPackId(pack.id);
                    setError("");
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-brand hover:underline"
                >
                  หรือโอนผ่านธนาคาร
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subscription upsell — keep membership the hero */}
      <Card className="mt-6 border-brand/30 bg-brand/5">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
          <div className="flex items-start gap-3">
            <Crown className="h-6 w-6 text-brand flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">ทำข้อสอบเยอะ? สมาชิกคุ้มกว่า</p>
              <p className="text-sm text-muted-foreground">
                รายเดือน ฿249 ดูเฉลยละเอียดได้ <strong>ไม่อั้นทุกข้อ</strong>{" "}
                (ทำเกิน ~60 ข้อก็คุ้มกว่าเติมเครดิตแล้ว)
              </p>
            </div>
          </div>
          <Link href="/pricing">
            <Button variant="outline" className="gap-2 whitespace-nowrap">
              <Check className="h-4 w-4" />
              ดูแพ็กเกจสมาชิก
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Tax invoice request — applies to both Stripe and bank-transfer purchases */}
      <div className="mt-6">
        <InvoiceForm value={invoiceData} onChange={setInvoiceData} />
      </div>

      {/* Manual bank transfer */}
      {selectedPack && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t" />
            <span className="text-sm text-muted-foreground">
              โอนผ่านธนาคาร — {selectedPack.name_th}
            </span>
            <div className="flex-1 border-t" />
          </div>
          <BankTransferCard
            amount={selectedPack.price}
            onSubmit={handleSlipSubmit}
            submitting={submitting}
            error={error}
          />
        </div>
      )}
    </div>
  );
}
