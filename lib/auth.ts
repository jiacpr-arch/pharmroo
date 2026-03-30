import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .then(rows => rows[0]);

        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          membership_type: user.membership_type,
          membership_expires_at: user.membership_expires_at,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .then(rows => rows[0]);

        if (!existing) {
          const newId = crypto.randomUUID();
          await db.insert(users).values({
            id: newId,
            email: user.email,
            name: user.name || user.email.split("@")[0],
            membership_type: "free",
            role: "user",
          });
          user.id = newId;
        } else {
          user.id = existing.id;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.membership_type = (user as { membership_type?: string }).membership_type;
        token.membership_expires_at = (user as { membership_expires_at?: string | null }).membership_expires_at;
      }
      // For Google login, fetch fresh user data from DB
      if (account?.provider === "google" && token.email) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email))
          .then(rows => rows[0]);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.membership_type = dbUser.membership_type;
          token.membership_expires_at = dbUser.membership_expires_at;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { membership_type?: string }).membership_type = token.membership_type as string;
        (session.user as { membership_expires_at?: string | null }).membership_expires_at = token.membership_expires_at as string | null;
      }
      return session;
    },
  },
});
