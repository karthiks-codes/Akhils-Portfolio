import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { getAuthConfig } from "@/lib/env";
import { isAdminEmail } from "@/lib/auth/policy";

const config = getAuthConfig();
const googleProvider =
  config.env?.AUTH_GOOGLE_ID && config.env.AUTH_GOOGLE_SECRET
    ? Google({
        clientId: config.env.AUTH_GOOGLE_ID,
        clientSecret: config.env.AUTH_GOOGLE_SECRET,
      })
    : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: config.env?.AUTH_SECRET,
  trustHost: true,
  providers: googleProvider ? [googleProvider] : [],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const emailVerified = Boolean(profile && "email_verified" in profile && profile.email_verified);
      return emailVerified && isAdminEmail(profile?.email, config.adminEmails);
    },
  },
});
