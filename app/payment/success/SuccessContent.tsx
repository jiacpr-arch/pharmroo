"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type VerifyStatus = "verifying" | "ok" | "pending" | "error";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<VerifyStatus>(() =>
    sessionId ? "verifying" : "ok"
  );

  useEffect(() => {
    if (!sessionId) return;

    fetch("/api/billing/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok" || data.alreadyProcessed) {
          setStatus("ok");
        } else if (data.status === "pending") {
          setStatus("pending");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold mb-2">กำลังตรวจสอบ...</h1>
            <p className="text-gray-500">
              กรุณารอสักครู่ ระบบกำลังยืนยันการชำระเงิน
            </p>
          </>
        )}

        {status === "ok" && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">ชำระเงินสำเร็จ!</h1>
            <p className="text-gray-500 mb-6">
              ขอบคุณที่สมัครสมาชิก PharmRoo คุณสามารถเข้าถึงข้อสอบทั้งหมดได้แล้ว
            </p>
            <Link
              href="/ple/practice"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              เริ่มทำข้อสอบเลย
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold mb-2">รอยืนยันการชำระเงิน</h1>
            <p className="text-gray-500 mb-6">
              การชำระเงินอยู่ระหว่างดำเนินการ กรุณารอสักครู่แล้วรีเฟรชหน้านี้
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              รีเฟรช
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-gray-500 mb-6">
              ไม่สามารถตรวจสอบการชำระเงินได้ กรุณาลองอีกครั้ง
              หากยังมีปัญหาติดต่อ LINE @pharmroo
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setStatus("verifying");
                  window.location.reload();
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
              >
                ลองอีกครั้ง
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
