import { auth } from "@/app/(auth)/auth";
// import { encode } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jwToken = jwt.sign(
    {
      id: session.token.id,
      role: session.token.role,
      username: session.token.username,
      email: session.token.email,
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: "1h" },
  );

  return NextResponse.json({ token: jwToken });
}
