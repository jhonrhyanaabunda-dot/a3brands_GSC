import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import type { Role } from "@prisma/client";

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

/**
 * Edge-safe Auth.js config.
 * No Prisma, no bcrypt — safe to import from `middleware.ts`.
 * The full config (Prisma adapter + Credentials) lives in `auth.ts`.
 */
export default {
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role;
        token.dealerGroupId =
          (user as { dealerGroupId?: string | null }).dealerGroupId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = (token.role ?? "GENERAL_MANAGER") as Role;
        session.user.dealerGroupId =
          (token.dealerGroupId as string | null) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
