"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft, Loader2, CheckCircle, AlertCircle, Package, CreditCard,
} from "lucide-react";
import InvoiceForm, { defaultInvoiceData, type InvoiceData } from "@/components/invoice-form";
import BankTransferCard from "@/components/payment/BankTransferCard";
import type { QuestionSet } from "@/lib/types-mcq";

export default function PaymentSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [set, setSet] = useState<QuestionSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/login?redirect=/payment/set/${id}`);
  }, [status, id, router]);

  useEffect(() => {
    fetch(`/api/payment/set/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setSet(data); else router.push("/sets"); setLoading(false); })
      .catch(() => { router.push("/sets"); });
  }, [id, router]);

  const handleStripeCheckout = async () => {
    if (!set) return;
    setStripeLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "set", setId: id, invoiceData }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "เกิดข้อผิดพลาด"); setStripeLoading(false); return; }
      window.location.href = data.url;
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setStripeLoading(false);
    }
  };

  const handleSubmit = async (slipBase64: string) => {
    if (!set) return;
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/payment/set/${id}`, {
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

    setSubmitted(true);
    setSubmitting(false);
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  if (!set) return null;

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="text-center">
          <CardContent className="py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-brand" />
            </div>
            <h1 className="text-2xl font-bold">ส่งหลักฐานเรียบร้อย!</h1>
            <p className="text-muted-foreground">เราจะตรวจสอบและเปิดใช้งาน <strong>{set.name_th}</strong><br />ภายใน <strong>1-2 ชั่วโมง</strong> ในเวลาทำการ</p>
            <div className="pt-4 space-y-2">
              <Link href="/sets"><Button className="w-full bg-brand hover:bg-brand-light text-white">กลับหน้าชุดข้อสอบ</Button></Link>
              <Link href="/profile"><Button variant="outline" className="w-full">ดูสถานะคำสั่งซื้อ</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href={`/sets/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-6">
        <ArrowLeft className="h-4 w-4" /> กลับ
      </Link>
      <h1 className="text-2xl font-bold mb-6">ชำระเงิน</h1>
      <div className="space-y-6">
        {/* Invoice Form */}
        <InvoiceForm value={invoiceData} onChange={setInvoiceData} />

        {/* Stripe */}
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader><h2 className="font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5 text-purple-600" />ชำระด้วยบัตรเครดิต / เดบิต</h2></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">ชำระผ่าน Stripe — ปลอดภัย เปิดใช้งานทันที รองรับ Visa, Mastercard</p>
            {error && <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</div>}
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg" onClick={handleStripeCheckout} disabled={stripeLoading}>
              {stripeLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />กำลังเปิดหน้าชำระเงิน...</> : <><CreditCard className="h-4 w-4 mr-2" />ชำระผ่าน Stripe ฿{set.price.toLocaleString()}</>}
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t" /><span className="text-sm text-muted-foreground">หรือโอนผ่านธนาคาร</span><div className="flex-1 border-t" />
        </div>

        <Card>
          <CardHeader><h2 className="font-semibold">สรุปคำสั่งซื้อ</h2></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-brand mt-0.5" />
                <div><p className="font-medium">{set.name_th}</p><p className="text-sm text-muted-foreground">{set.question_count} ข้อ · ซื้อครั้งเดียว ใช้ตลอด</p></div>
              </div>
              <div className="text-right">
                {set.original_price && <p className="text-xs text-muted-foreground line-through">฿{set.original_price.toLocaleString()}</p>}
                <p className="text-2xl font-bold">฿{set.price.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <BankTransferCard
          amount={set.price}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  );
}
