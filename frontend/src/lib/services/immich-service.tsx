import axios from "axios";

export async function getImageURLs(files: FormData): Promise<string[]> {
  const uploadEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/upload`;
  console.log("files: ", files);

  try {
    const res = await fetch(uploadEndpoint, {
      method: "POST",
      body: files,
    });

    if (!res.ok) {
      const errorText = await res.text(); // await this to capture server message
      console.error("Upload failed response:", errorText);
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log("Upload response:", data);
    return data; // Ensure your backend returns an array of URLs
  } catch (error) {
    console.error("Error uploading files:", error);
    return [];
  }
}

type AssetType = "original" | "thumbnail";

interface GetImmichAssetParams {
  type: AssetType;
  id: number | string | undefined;
}

export async function getImmichAsset({ type, id }: GetImmichAssetParams) {
  console.log("trying to fetch immich asset...");
  console.log("id: ", id);
  if (!id) return;
  const route = type === "original" ? "images" : "thumbnail";
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/${route}`);
  try {
    console.log("attempting image download...");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${route}`,
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/octet-stream",
        },
        params: {
          id, // sends as ?id=yourId
        },
      },
    );

    const contentType = response.headers["content-type"] || "image/png";
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const dataUrl = `data:${contentType};base64,${base64Image}`;
    return dataUrl;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}
