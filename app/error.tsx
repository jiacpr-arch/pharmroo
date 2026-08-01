"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
        <AlertTriangle className="h-8 w-8 text-amber-600" />
      </div>
      <h1 className="text-2xl font-bold">เกิดข้อผิดพลาดชั่วคราว</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        ขออภัย ระบบมีปัญหาชั่วคราว กรุณาลองใหม่อีกครั้ง
        หากยังพบปัญหาอยู่ ลองกลับมาใหม่ในอีกสักครู่
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={reset}
          className="gap-2 bg-brand text-white hover:bg-brand-light"
        >
          <RefreshCw className="h-4 w-4" /> ลองใหม่
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" /> กลับหน้าแรก
          </Button>
        </Link>
      </div>
    </div>
  );
}
