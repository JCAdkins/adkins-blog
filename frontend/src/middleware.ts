// frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./app/(auth)/auth"; // ✅ This should be the real session function
import NextAuth from "next-auth";
import authConfig from "./app/(auth)/auth.config";

// Use auth as middleware
const { auth: authMiddleware } = NextAuth(authConfig);

export default authMiddleware(async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  // ✅ Use imported auth to get session
  const session = await auth(); // no args needed in middleware (edge runtime auto-extracts request)

  console.log("isAdminRoute: ", isAdminRoute);
  console.log("session: ", session);

  if (isAdminRoute) {
    const isLoggedIn = !!session?.user;
    const isAdmin = session?.user?.role === "admin";

    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
