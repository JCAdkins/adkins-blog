import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/messages/unread/count`,
      {
        headers: {
          Authorization: `Bearer ${signedToken}`,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching unread count:", err);
  }
}
