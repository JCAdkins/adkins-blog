import axios from "axios";
import FormData from "form-data";
import { console } from "inspector";

const API_KEY = process.env.IMMICH_API_KEY; // Replace with your real API key
const BASE_URL = "http://192.168.0.40:2283/api"; // Replace if needed

export async function uploadAsset(bFile: any, file: any) {
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

export async function downloadAsset(id: string) {
  try {
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
