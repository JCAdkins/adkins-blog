import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import axios from "axios";

// Fetch all user notifications from db
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration: secret missing" },
      { status: 500 }
    );
  }

  // Await added to remove pesky params must be awaited warning.
  const data = await params;
  const userId = data.userId;
  const token = await getToken({ req, secret });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const signedToken = jwt.sign(token, secret);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${userId}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${signedToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching paginated notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
