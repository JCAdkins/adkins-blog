import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

// Fetch all messages from db
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("hard");
  const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!); // Sign the decoded token to create a raw JWT string

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${id}?hard=${type}`,
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
