import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export default async function uploadAsset(filePath: string) {
  const API_KEY = process.env.IMMICH_API_KEY; // Replace with your real API key
  const BASE_URL = "http://192.168.0.40:2283/api"; // Replace if needed
  const stats = fs.statSync(filePath);
  const modifiedTime = new Date(stats.mtime).toISOString();
  const createdTime = new Date(stats.ctime).toISOString(); // or use stats.birthtime depending on your OS

  const form = new FormData();

  form.append("deviceAssetId", `${filePath}-${stats.mtime}`);
  form.append("deviceId", "nodejs");
  form.append("fileCreatedAt", createdTime);
  form.append("fileModifiedAt", modifiedTime);
  form.append("isFavorite", "false");
  form.append("assetData", fs.createReadStream(filePath));

  try {
    const response = await axios.post(`${BASE_URL}/assets`, form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": API_KEY,
        Accept: "application/json",
      },
      maxBodyLength: Infinity, // Allow large files
    });

    console.log(response.data);
    return await response.data;
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
