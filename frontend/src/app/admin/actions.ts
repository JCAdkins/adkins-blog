"use server";
import { getImageURLs } from "@/lib/services/immich-service";
import { createNewBlog } from "@/lib/db/queries";

export async function createPost(formData: FormData) {
  const imageUrls = await getImageURLs(formData);
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    genre: formData.get("genre") as string,
    content: formData.get("content") as string,
    featured: formData.get("featured") as string, // use boolean, not string
    images: imageUrls,
  };

  return await createNewBlog(data);
}
