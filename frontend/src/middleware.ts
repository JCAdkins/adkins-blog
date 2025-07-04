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
  const isNotifRoute = req.nextUrl.pathname.startsWith("/notifications");

  // ✅ Use imported auth to get session
  const session = await auth(); // no args needed in middleware (edge runtime auto-extracts request)
  const isLoggedIn = !!session?.user;
  if (isAdminRoute) {
    const isAdmin = session?.user?.role === "admin";
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isNotifRoute && !isLoggedIn)
    return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/notifications",
    "/notifications/:path*",
  ],
};
