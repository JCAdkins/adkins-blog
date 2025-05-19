export default async function getImageURLs(files: File[]): Promise<string[]> {
  const uploadEndpoint = `${process.env.BASE_URL}/upload`; // Change to your actual upload endpoint
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: files[i],
      });

      if (!res.ok) throw new Error(`Failed to upload ${files[i].name}`);

      const data = await res.json();
      urls.push(data.url); // Adjust based on your backend's response structure
    } catch (error) {
      console.error(`Error uploading ${files[i].name}:`, error);
    }
  }

  return urls;
}
