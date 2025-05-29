export default async function getImageURLs(files: FormData): Promise<string[]> {
  const uploadEndpoint = `${process.env.BASE_URL}/upload`;
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
