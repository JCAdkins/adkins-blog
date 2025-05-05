import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
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
      // Map additional fields from the token to the session
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // const isOnRoot = nextUrl.pathname.startsWith("/");
      const isAdmin = auth?.user.role === "admin";
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isLoggedIn && (isOnLogin || isOnRegister))
        return Response.redirect(new URL("/arcade", nextUrl));

      if (isOnAdmin && !isAdmin) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (isOnAdmin) console.log("I'm om admin");

      return true;
    },
  },
} satisfies NextAuthConfig;
