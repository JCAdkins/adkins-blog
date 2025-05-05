// auth.config.ts
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt"; // For typing JWT
import type { User } from "next-auth"; // For typing User

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // Here we define the custom properties for the token
        token.id = user.id as string;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        // Define session user properties using token data
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
