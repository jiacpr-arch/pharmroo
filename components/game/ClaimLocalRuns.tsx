"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { claimPendingLocalRuns } from "@/lib/game/record";

/**
 * ยกเคสที่เล่นไว้ตอนยังไม่ล็อกอินเข้าบัญชี ทันทีที่ผู้ใช้ที่ล็อกอินแล้วเปิดหน้ารวมเกม
 * ไม่เรนเดอร์อะไร — refresh หน้าเมื่อยกสำเร็จ เพื่อให้เกรดดีสุดที่ server เรนเดอร์อัปเดต
 */
export default function ClaimLocalRuns() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    void claimPendingLocalRuns().then((claimed) => {
      if (claimed > 0 && !cancelled) router.refresh();
    });
    return () => { cancelled = true; };
  }, [router]);

  return null;
}
