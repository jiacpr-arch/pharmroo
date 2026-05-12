import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import LINE from "next-auth/providers/line";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { upsertLineUser, verifyLineIdToken } from "@/lib/auth-line";

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
    LINE({
      clientId: process.env.LINE_LOGIN_CHANNEL_ID!,
      clientSecret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
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
    Credentials({
      id: "line-liff",
      name: "LINE LIFF",
      credentials: {
        idToken: { type: "text" },
      },
      async authorize(credentials) {
        const idToken = credentials?.idToken;
        if (!idToken || typeof idToken !== "string") return null;

        try {
          const payload = await verifyLineIdToken(idToken);
          const user = await upsertLineUser(payload.sub, {
            name: payload.name ?? null,
            email: payload.email ?? null,
            picture: payload.picture ?? null,
          });
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (err) {
          console.error("[line-liff] authorize failed:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
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

      if (account?.provider === "line") {
        const lineUserId = account.providerAccountId;
        if (!lineUserId) return false;

        const upserted = await upsertLineUser(lineUserId, {
          name:
            user.name ||
            (profile as { name?: string } | undefined)?.name ||
            null,
          email: user.email ?? null,
          picture: (profile as { picture?: string } | undefined)?.picture ?? null,
        });
        user.id = upserted.id;
        user.email = upserted.email;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.membership_type = (user as { membership_type?: string }).membership_type;
        token.membership_expires_at = (user as { membership_expires_at?: string | null }).membership_expires_at;
        token.exam_category = (user as { exam_category?: string | null }).exam_category;
      }
      // For OAuth providers, fetch fresh user data from DB
      if (
        (account?.provider === "google" || account?.provider === "line") &&
        token.email
      ) {
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
          token.exam_category = dbUser.exam_category;
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
        (session.user as { exam_category?: string | null }).exam_category = token.exam_category as string | null;
      }
      return session;
    },
  },
});
