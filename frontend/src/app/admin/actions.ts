"use server";
import { getImageURLs } from "@/lib/services/immich-service";
import { createNewBlog } from "@/lib/db/queries";
import { auth } from "../(auth)/auth";

export async function createPost(formData: FormData) {
  const session = await auth();
  const token = session?.token;
  const response = await getImageURLs({
    formData,
    token,
  });
  const imageUrls = await response.json();
  const blogData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    genre: formData.get("genre") as string,
    content: formData.get("content") as string,
    featured: formData.get("featured") as string, // use boolean, not string
    images: imageUrls,
  };

  await createNewBlog({ blogData, token });
}
