"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLiff } from "../../providers";

const PLANS: Record<string, { name: string; price: number; period: string }> = {
  monthly: { name: "รายเดือน", price: 249, period: "/ เดือน" },
  yearly: { name: "รายปี", price: 1490, period: "/ ปี" },
};

export default function LiffPaymentPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const { plan } = use(params);
  const { liff } = useLiff();
  const { status } = useSession();
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState("");

  const planInfo = PLANS[plan];

  const openExternal = (url: string) => {
    if (liff) {
      liff.openWindow({ url, external: true });
    } else {
      window.open(url, "_blank");
    }
  };

  const handleStripe = async () => {
    setStripeLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subscription", plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        setStripeLoading(false);
        return;
      }
      openExternal(data.url);
      setStripeLoading(false);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setStripeLoading(false);
    }
  };

  if (!planInfo) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="text-xl font-bold">ไม่พบแพ็กเกจนี้</h1>
        <Link
          href="/liff/pricing"
          className="text-brand hover:underline mt-4 inline-block"
        >
          กลับไปเลือกแพ็กเกจ
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const externalSlipUrl = `${origin}/payment/${plan}`;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <Link
        href="/liff/pricing"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> กลับไปเลือกแพ็กเกจ
      </Link>
      <h1 className="text-2xl font-bold mb-5">ชำระเงิน</h1>

      <Card className="mb-4">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{planInfo.name}</p>
            <p className="text-xs text-muted-foreground">แพ็กเกจ{planInfo.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">฿{planInfo.price.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{planInfo.period}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <h2 className="font-semibold flex items-center gap-2 text-base">
            <CreditCard className="h-5 w-5 text-purple-600" />
            บัตรเครดิต / เดบิต
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            กดแล้วเปิดหน้า Stripe ในเบราว์เซอร์ภายนอก
            (LINE ภายในแอปไม่รองรับการชำระบัตร)
          </p>
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleStripe}
            disabled={stripeLoading}
          >
            {stripeLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                กำลังเปิด...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                ชำระผ่าน Stripe ฿{planInfo.price.toLocaleString()}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-brand/20">
        <CardHeader>
          <h2 className="font-semibold flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-brand" />
            โอนผ่านธนาคาร + แนบสลิป
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            เปิดหน้าฟอร์มแนบสลิปในเบราว์เซอร์ภายนอก สำหรับอัปโหลดรูป
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => openExternal(externalSlipUrl)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            ไปหน้าโอน + แนบสลิป
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
