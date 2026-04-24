import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Skip onboarding check for these paths
  const skipPaths = [
    "/login",
    "/register",
    "/onboarding",
    "/auth",
    "/api",
    "/privacy",
    "/terms",
  ];
  if (skipPaths.some((p) => pathname.startsWith(p))) {
    return undefined;
  }

  // Protect /nursing/admin — only nursing_admin or admin may access
  if (pathname.startsWith("/nursing/admin")) {
    const role = (req.auth?.user as { role?: string } | undefined)?.role;
    if (role !== "nursing_admin" && role !== "admin") {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return undefined;
});

export const config = {
  matcher: [
    // Exclude billing webhook from auth middleware
    "/((?!_next/static|_next/image|favicon.ico|api/billing/webhook|api/line/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
