import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Fetch all messages from db
export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Sign the decoded token to create a raw JWT string
  const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/messages`, {
    headers: {
      Authorization: `Bearer ${signedToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
