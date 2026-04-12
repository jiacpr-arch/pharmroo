"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">กำลังโหลด...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
