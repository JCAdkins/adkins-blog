import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Fetch all messages from db
export async function POST(req: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration: secret missing" },
      { status: 500 }
    );
  }

  const id = await req.json();
  if (!id)
    return NextResponse.json(
      { error: "User ID was not included" },
      { status: 400 }
    );

  const token = await getToken({ req, secret });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const signedToken = jwt.sign(token, secret);

  try {
    // Sign the decoded token to create a raw JWT string

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/mark-all-read`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${signedToken}`,
        },
        body: JSON.stringify({ id: id }),
      }
    );
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to mark message as read: ", error);
    return NextResponse.json({
      error: "There was an error marking the notification as read.",
    });
  }
}
