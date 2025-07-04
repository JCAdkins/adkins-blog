import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

// Fetch all unread User notifications from db
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Sign the decoded token to create a raw JWT string
  const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);
  const id = req.nextUrl.searchParams.get("id");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/unread/${id}`,
    {
      headers: {
        Authorization: `Bearer ${signedToken}`,
      },
      body: req.body,
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
