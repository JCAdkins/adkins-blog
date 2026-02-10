// proxy.ts   ← root level

import { auth } from "@/app/(auth)/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  console.log("[PROXY] Checking path:", request.nextUrl.pathname);

  const session = await auth();

  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath) {
    if (!session?.user) {
      console.log("[PROXY] No session → redirect to /login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (session.user.role !== "admin") {
      console.log("[PROXY] Not admin → redirect to /");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
