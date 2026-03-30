"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card className="text-center">
        <CardContent className="py-12 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold">ชำระเงินสำเร็จ!</h1>
          <p className="text-muted-foreground">
            ระบบได้รับการชำระเงินของคุณแล้ว<br />
            บัญชีของคุณจะถูกอัปเกรดภายในไม่กี่วินาที
          </p>
          <div className="pt-4 space-y-2">
            <Link href="/ple">
              <Button className="w-full bg-brand hover:bg-brand-light text-white">
                เริ่มทำข้อสอบได้เลย
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full">ดูสถานะสมาชิก</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
