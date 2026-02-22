import axios from "axios";
import FormData from "form-data";
import { console } from "inspector";

const API_KEY = process.env.IMMICH_API_KEY;
const BASE_URL = "http://localhost:2283/api";

export async function PostNewImmichImage(bFile: any, file: any) {
  const modifiedTime = new Date().toISOString();
  const createdTime = new Date().toISOString(); // or use stats.birthtime depending on your OS
  console.log("Uploading image to Immich.");
  const form = new FormData();

  form.append("deviceAssetId", "some device");
  form.append("deviceId", "nodejs");
  form.append("fileCreatedAt", createdTime);
  form.append("fileModifiedAt", modifiedTime);
  form.append("isFavorite", "false");
  form.append("assetData", bFile, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  try {
    const response = await axios.post(`${BASE_URL}/assets`, form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": API_KEY,
        Accept: "application/json",
      },
      maxBodyLength: Infinity, // Allow large files
    });
    const rData = response.data;
    if (response.status === 200) {
      console.log(rData);
      return await rData;
    } else {
      console.log("upload failed");
      console.log(rData);
      return await rData;
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Upload failed:", err.response?.data || err.message);
    } else if (err instanceof Error) {
      console.error("Unexpected error:", err.message);
    } else {
      console.error("Unknown error:", err);
    }
  }
}

export async function downloadImmichImage(id: string) {
  try {
    console.log("downloading asset at model...");
    const response = await axios.get(`${BASE_URL}/assets/${id}/original`, {
      headers: {
        Accept: "application/octet-stream",
        "x-api-key": API_KEY,
      },
      responseType: "arraybuffer", // or "blob" for browser
      maxBodyLength: Infinity,
      timeout: 10000, // 10 seconds timeout (adjust as needed)
    });

    if (response.status === 200) {
      console.log("Download successful");
      return response.data; // this will be the raw binary data
    } else {
      console.warn("Download failed with status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Download failed:", error);
    return null;
  }
}

export async function downloadImmichImageThumbnail(id: string) {
  try {
    const response = await axios.get(`${BASE_URL}/assets/${id}/thumbnail`, {
      headers: {
        Accept: "application/octet-stream",
        "x-api-key": API_KEY,
      },
      responseType: "arraybuffer", // or "blob" for browser
      maxBodyLength: Infinity,
      timeout: 10000, // 10 seconds timeout (adjust as needed)
    });

    if (response.status === 200) {
      console.log("Download successful");
      return response.data; // this will be the raw binary data
    } else {
      console.warn("Download failed with status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Download failed:", error);
    return null;
  }
}

export async function addAssetToAlbum(albumId: string, assetId: string) {
  await axios.put(
    `${BASE_URL}/albums/${albumId}/assets`,
    {
      ids: [assetId],
    },
    {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getOrCreateAvatarsAlbum(): Promise<string> {
  // Get all albums
  const res = await axios.get(`${BASE_URL}/albums`, {
    headers: { "x-api-key": API_KEY },
  });

  const existing = res.data.find((album: any) => album.albumName === "avatars");
  if (existing) return existing.id;

  // Create if it doesn't exist
  const created = await axios.post(
    `${BASE_URL}/albums`,
    {
      albumName: "avatars",
    },
    {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  return created.data.id;
}

export async function uploadAvatarToImmich(
  bFile: any,
  file: any,
): Promise<string> {
  const asset = await PostNewImmichImage(bFile, file);
  if (!asset?.id) throw new Error("Failed to upload avatar to Immich");

  const albumId = await getOrCreateAvatarsAlbum();
  await addAssetToAlbum(albumId, asset.id);

  return asset.id; // store this in your User.image column
}
