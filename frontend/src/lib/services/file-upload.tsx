export default async function getImageURLs(files: File[]): Promise<string[]> {
  const uploadEndpoint = `${process.env.BASE_URL}/upload`; // Change to your actual upload endpoint
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const formData = new FormData();
      formData.append("image", files[i]);
      console.log("fd: ", formData);
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        res.text().then((data) => console.log("err data: ", data));
        throw new Error(`Failed to upload ${files[i].name}`);
      }

      const data = await res.json();
      urls.push(data.url); // Adjust based on your backend's response structure
    } catch (error) {
      console.error(`Error uploading ${files[i].name}:`, error);
    }
  }

  return urls;
}
