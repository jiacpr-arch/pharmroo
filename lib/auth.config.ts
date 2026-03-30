import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Edge-compatible auth config (no Node.js modules like pg, bcrypt)
export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials listed here for middleware awareness, but authorize runs in Node runtime via auth.ts
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
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
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
