// frontend/auth.config.ts
import type { NextAuthConfig } from "next-auth";

const config = {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      // Include additional fields in the token
      if (user) {
        token.id = user.id;
        token.role = user.role; // Make sure to retrieve 'role' during authorization
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.token = token;
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user.role === "admin";
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isLoggedIn && (isOnLogin || isOnRegister))
        return Response.redirect(new URL("/", nextUrl));

      if (isOnAdmin && !isLoggedIn)
        return Response.redirect(new URL("/login", nextUrl));

      if (isOnAdmin && !isAdmin) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export default config;
