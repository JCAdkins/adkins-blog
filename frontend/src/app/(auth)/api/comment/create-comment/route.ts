import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import axios from "axios";

// Fetch all messages from db
export async function POST(req: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration: secret missing" },
      { status: 500 }
    );
  }
  const token = await getToken({ req, secret });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Sign the decoded token to create a raw JWT string
    const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);

    const formData = await req.json();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments`,

      formData,
      { headers: { Authorization: `Bearer ${signedToken}` } }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
