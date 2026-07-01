"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins } from "lucide-react";
import { useSession } from "next-auth/react";

/**
 * Small navbar chip showing the user's credit balance, linking to the top-up
 * page. Balance is fetched from the API (not the JWT) so it stays fresh after
 * a purchase or an unlock without needing to re-issue the session token.
 */
export default function CreditBalance({
  className = "",
}: {
  className?: string;
}) {
  const { status } = useSession();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    fetch("/api/credits/balance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data) setBalance(data.credit_balance ?? 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [status]);

  if (status !== "authenticated" || balance === null) return null;

  return (
    <Link
      href="/credits"
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 ${className}`}
      title="เครดิตของฉัน"
    >
      <Coins className="h-4 w-4" />
      {balance}
    </Link>
  );
}
