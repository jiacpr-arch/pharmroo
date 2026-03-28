"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Loader2, Shield, ImageIcon } from "lucide-react";

interface PaymentOrder {
  id: string;
  user_id: string;
  plan_type: string | null;
  order_type: string;
  amount: number;
  status: string;
  slip_url: string | null;
  created_at: string;
  user_email: string | null;
  user_name: string | null;
}

const planLabels: Record<string, string> = {
  monthly: "รายเดือน",
  yearly: "รายปี",
  set: "ชุดข้อสอบ",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "รอตรวจสอบ", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "อนุมัติแล้ว", color: "bg-green-100 text-green-700" },
  rejected: { label: "ปฏิเสธ", color: "bg-red-100 text-red-700" },
};

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const user = session?.user as { role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, [isAdmin]);

  const handleAction = async (orderId: string, action: "approved" | "rejected") => {
    setProcessing(orderId);
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: action } : o)));
    setProcessing(null);
  };

  if (status === "loading" || loading) {
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

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">จัดการการชำระเงิน</h1>
          <p className="text-muted-foreground mt-1">ตรวจสอบสลิปและอนุมัติสมาชิก</p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />รอตรวจ {pendingCount} รายการ
          </Badge>
        )}
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent><p className="text-muted-foreground">ยังไม่มีคำสั่งซื้อ</p></CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const label = order.order_type === "set" ? "ชุดข้อสอบ" : planLabels[order.plan_type || ""] || order.plan_type;
            return (
              <Card key={order.id} className={order.status === "pending" ? "border-yellow-300" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold">{order.user_name || order.user_email}</p>
                      <p className="text-sm text-muted-foreground">{order.user_email}</p>
                    </div>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">แพ็กเกจ</span>
                    <span className="font-medium">{label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">จำนวนเงิน</span>
                    <span className="font-bold text-lg">฿{order.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">วันที่</span>
                    <span>{new Date(order.created_at).toLocaleString("th-TH")}</span>
                  </div>
                  {order.slip_url && !order.slip_url.startsWith("pending") && (
                    <div className="rounded-lg border bg-muted/30 p-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <ImageIcon className="h-4 w-4" /> สลิปการโอนเงิน
                      </div>
                      {order.slip_url.startsWith("data:image") ? (
                        <img src={order.slip_url} alt="สลิป" className="max-h-64 object-contain rounded" />
                      ) : (
                        <p className="text-xs text-muted-foreground break-all">{order.slip_url}</p>
                      )}
                    </div>
                  )}
                  {order.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-brand hover:bg-brand-light text-white gap-1"
                        disabled={processing === order.id}
                        onClick={() => handleAction(order.id, "approved")}
                      >
                        {processing === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        อนุมัติ
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/30 gap-1"
                        disabled={processing === order.id}
                        onClick={() => handleAction(order.id, "rejected")}
                      >
                        <XCircle className="h-4 w-4" /> ปฏิเสธ
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
