import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import LINE from "next-auth/providers/line";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createUser } from "@/lib/db/create-user";
import { isLineOaFriend } from "@/lib/line";
import { grantLineBonus } from "@/lib/line-bonus";

const SESSION_DB_SYNC_MS = 5 * 60 * 1000;

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
      // Show the "add LINE OA as friend" option, pre-checked, on the LINE
      // consent screen. Adding it unlocks the new-member LINE bonus.
      authorization: { params: { bot_prompt: "aggressive" } },
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .then(rows => rows[0]);

        if (!existing) {
          user.id = await createUser({
            email: user.email,
            name: user.name || user.email.split("@")[0],
          });
        } else {
          user.id = existing.id;
        }
      }

      if (account?.provider === "line") {
        const lineUserId = account.providerAccountId;
        if (!lineUserId) return false;

        let existing = await db
          .select()
          .from(users)
          .where(eq(users.line_user_id, lineUserId))
          .then(rows => rows[0]);

        if (!existing && user.email) {
          existing = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .then(rows => rows[0]);

          if (existing) {
            await db
              .update(users)
              .set({
                line_user_id: lineUserId,
                line_linked_at: new Date().toISOString(),
              })
              .where(eq(users.id, existing.id));
          }
        }

        if (!existing) {
          const userEmail =
            user.email || `line_${lineUserId}@line.pharmroo.com`;
          const userName =
            user.name ||
            (profile as { name?: string } | undefined)?.name ||
            "LINE User";
          user.id = await createUser({
            email: userEmail,
            name: userName,
            line_user_id: lineUserId,
          });
          user.email = userEmail;
        } else {
          user.id = existing.id;
          user.email = existing.email;
        }

        // Added the OA as a friend (e.g. via the consent-screen checkbox)?
        // Grant the new-member LINE bonus right away — no link code needed.
        if (user.id && account.access_token) {
          try {
            if (await isLineOaFriend(account.access_token)) {
              await grantLineBonus(user.id);
            }
          } catch (err) {
            console.error("[auth] LINE bonus grant failed", err);
          }
        }
      }

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.membership_type = (user as { membership_type?: string }).membership_type;
        token.membership_expires_at = (user as { membership_expires_at?: string | null }).membership_expires_at;
        token.exam_category = (user as { exam_category?: string | null }).exam_category;
      }
      // Fetch fresh user data from DB for OAuth sign-ins, on a client-side
      // `update()`, and every few minutes otherwise, so membership changes made
      // server-side (e.g. the LINE webhook granting the bonus) reach the
      // session without signing out and in again.
      const stale =
        Date.now() - ((token.db_synced_at as number | undefined) ?? 0) >
        SESSION_DB_SYNC_MS;
      if (
        (account?.provider === "google" ||
          account?.provider === "line" ||
          trigger === "update" ||
          stale) &&
        token.email
      ) {
        token.db_synced_at = Date.now();
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
