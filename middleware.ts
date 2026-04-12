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

  // If logged in and onboarding not done, redirect to onboarding
  // (onboarding_done is checked via session token — see auth callbacks)
  // For prototype: allow all through, onboarding redirect handled client-side
  return undefined;
});

export const config = {
  matcher: [
    // Exclude billing webhook from auth middleware
    "/((?!_next/static|_next/image|favicon.ico|api/billing/webhook|api/line/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
