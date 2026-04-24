"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (role === "nursing_admin") {
      router.replace("/nursing/admin");
    } else if (role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/profile");
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
    </div>
  );
}
