"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

interface Props {
  slug: string;
  /** จำนวนรอบที่เก็บไว้ในเครื่อง */
  localRuns: number;
  rankTitle: string | null;
}

/**
 * CTA ท้ายเกมสำหรับคนที่ยังไม่ล็อกอิน — ยศ/XP ที่เห็นอยู่ยังอยู่แค่ในเครื่อง
 * ล็อกอินแล้วระบบยกทุกรอบเข้าบัญชีให้ (ClaimLocalRuns / claimPendingLocalRuns)
 */
export default function DebriefLoginCta({ slug, localRuns, rankTitle }: Props) {
  const callback = encodeURIComponent(`/game/${slug}`);
  const title =
    localRuns > 1 && rankTitle
      ? `ล็อกอินเพื่อเก็บยศ "${rankTitle}" และ ${localRuns} เคสที่เล่นไว้ให้ถาวร`
      : "ล็อกอินเพื่อเก็บผลเคสนี้ไว้ในบัญชีของคุณ";

  return (
    <div className="cbs-browse-cta">
      <div className="cbs-browse-title">{title}</div>
      <p className="cbs-cta-reason">
        ตอนนี้ผลถูกเก็บไว้ในเครื่องนี้เท่านั้น — ล็อกอินแล้วระบบจะยกทุกรอบเข้าบัญชีให้อัตโนมัติ
        พร้อมนับ badge บน Dashboard
      </p>
      <Link href={`/login?callbackUrl=${callback}`} className="cbs-btn-main">
        <LogIn size={16} strokeWidth={2.6} style={{ display: "inline", verticalAlign: "-2px", marginRight: 8 }} />
        ล็อกอิน / สมัครฟรี
      </Link>
      <p className="cbs-cta-secondary">
        ยังไม่มีบัญชี? <Link href={`/register?callbackUrl=${callback}`}>สมัครใช้งานฟรี</Link>
      </p>
    </div>
  );
}
