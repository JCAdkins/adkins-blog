import axios, { AxiosError } from "axios";

export async function getImageURLs(files: FormData): Promise<string[]> {
  const uploadEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/upload`;
  console.log("Uploading files...");

  try {
    const res = await fetch(uploadEndpoint, {
      method: "POST",
      body: files,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Upload failed:", errorText);
      return []; // Fail gracefully
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected upload response format:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("🚨 Error uploading files:", error);
    return [];
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
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${route}`;

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
