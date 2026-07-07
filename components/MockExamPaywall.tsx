import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function MockExamPaywall() {
  return (
    <Card className="border-brand/20 bg-brand/5">
      <CardContent className="p-8 text-center">
        <Lock className="h-8 w-8 mx-auto mb-3 text-brand" />
        <h3 className="text-lg font-bold mb-2">จำลองสอบสำหรับสมาชิก Premium</h3>
        <p className="text-sm text-muted-foreground mb-6">
          สมัครสมาชิกรายเดือน/รายปี เพื่อจำลองสอบจับเวลาแบบไม่จำกัดจำนวนข้อ
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          สมัครสมาชิก Premium
        </Link>
      </CardContent>
    </Card>
  );
}
