"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins } from "lucide-react";
import { useSession } from "next-auth/react";

/**
 * Small navbar chip showing the user's credit balance, linking to the top-up
 * page. Balance is fetched from the API (not the JWT) so it doesn't require
 * re-issuing the session token; it refreshes on navigation and instantly when
 * anything dispatches a `credits:changed` event (e.g. after an unlock).
 */
export default function CreditBalance({
  className = "",
}: {
  className?: string;
}) {
  const { status } = useSession();
  const pathname = usePathname();
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
  }, [status, pathname]);

  useEffect(() => {
    const onChanged = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") setBalance(detail);
    };
    window.addEventListener("credits:changed", onChanged);
    return () => window.removeEventListener("credits:changed", onChanged);
  }, []);

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
