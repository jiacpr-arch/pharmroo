import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const VISITOR_COOKIE = "pr_vid";

function ensureVisitorId(req: Request, res: NextResponse): NextResponse {
  const existing = (req as unknown as { cookies?: { get(name: string): { value: string } | undefined } })
    .cookies?.get(VISITOR_COOKIE);
  if (existing?.value) return res;
  const id = crypto.randomUUID().replace(/-/g, "");
  res.cookies.set({
    name: VISITOR_COOKIE,
    value: id,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return res;
}

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
    return ensureVisitorId(req, NextResponse.next());
  }

  // Protect /nursing/admin — only nursing_admin or admin may access
  if (pathname === "/nursing/admin" || pathname.startsWith("/nursing/admin/")) {
    const role = (req.auth?.user as { role?: string } | undefined)?.role;
    if (role !== "nursing_admin" && role !== "admin") {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin — only admin may access (mirrors /nursing/admin)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const role = (req.auth?.user as { role?: string } | undefined)?.role;
    if (role !== "admin") {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return ensureVisitorId(req, NextResponse.next());
});

export const config = {
  matcher: [
    // Exclude billing webhook from auth middleware
    "/((?!_next/static|_next/image|favicon.ico|api/billing/webhook|api/line/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
