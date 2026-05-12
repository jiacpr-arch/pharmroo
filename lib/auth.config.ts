import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import LINE from "next-auth/providers/line";
import Credentials from "next-auth/providers/credentials";

const isProd = process.env.NODE_ENV === "production";

// Edge-compatible auth config (no Node.js modules like pg, bcrypt)
export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  // SameSite=None required so the session cookie survives inside the LINE
  // in-app webview (which treats requests as cross-site on iOS). Production
  // serves over HTTPS so Secure is fine; in dev we fall back to Lax.
  cookies: {
    sessionToken: {
      name: isProd
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LINE({
      clientId: process.env.LINE_LOGIN_CHANNEL_ID!,
      clientSecret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
    }),
    // Credentials listed here for middleware awareness, but authorize runs in Node runtime via auth.ts
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
    }),
    Credentials({
      id: "line-liff",
      credentials: {
        idToken: { type: "text" },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { membership_type?: string }).membership_type =
          token.membership_type as string;
        (
          session.user as { membership_expires_at?: string | null }
        ).membership_expires_at = token.membership_expires_at as string | null;
        (session.user as { exam_category?: string | null }).exam_category =
          token.exam_category as string | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
