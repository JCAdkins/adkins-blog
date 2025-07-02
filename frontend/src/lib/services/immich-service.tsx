import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function getImageURLs({
  formData,
  token,
}: {
  formData: FormData;
  token: any;
}) {
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Sign the decoded token to create a raw JWT string
  const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);
  const uploadEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/immich/upload`;
  console.log("Uploading files...");

  try {
    const res = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${signedToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Upload failed:", errorText);
      return NextResponse.json([]); // Fail gracefully
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("🚨 Error uploading files:", error);
    return NextResponse.json([]);
  }
}

type AssetType = "original" | "thumbnail";

interface GetImmichAssetParams {
  type: AssetType;
  id: number | string | undefined;
}

/**
 * Fetches and returns a base64 image data URL from Immich.
 * Returns `undefined` on failure instead of throwing.
 */
export async function getImmichAsset({
  type,
  id,
}: GetImmichAssetParams): Promise<string | undefined> {
  if (!id) {
    console.warn("No ID provided for Immich asset fetch.");
    return undefined;
  }
  const route = type === "original" ? "images" : "thumbnail";
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/immich/${route}`;

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
      },
      params: { id },
    });

    const contentType = response.headers["content-type"] || "image/png";
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    return `data:${contentType};base64,${base64Image}`;
  } catch (err) {
    const error = err as AxiosError;

    console.error(`❌ Failed to fetch ${type} asset (ID: ${id}) from ${url}`);
    if (error.response) {
      console.error(
        `  Status: ${error.response.status} \n Data:`,
        error.response.data
      );
    } else {
      console.error("  General error:", error.message);
    }

    // Always return undefined to prevent crashes
    return undefined;
  }
}
