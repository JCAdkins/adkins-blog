import axios from "axios";
import FormData from "form-data";
import { console } from "inspector";

export default async function uploadAsset(bFile: any, file: File) {
  const API_KEY = process.env.IMMICH_API_KEY; // Replace with your real API key
  const BASE_URL = "http://192.168.0.40:2283/api"; // Replace if needed
  const modifiedTime = new Date().toISOString();
  const createdTime = new Date().toISOString(); // or use stats.birthtime depending on your OS
  console.log("hi");
  const form = new FormData();

  form.append("deviceAssetId", "some device");
  form.append("deviceId", "nodejs");
  form.append("fileCreatedAt", createdTime);
  form.append("fileModifiedAt", modifiedTime);
  form.append("isFavorite", "false");
  form.append("assetData", bFile);

  console.log("formData: ", form);

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
    console.log(rData);
    return await rData;
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
