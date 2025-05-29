"use server";
import getImageURLs from "@/lib/services/file-upload";
import { createNewBlog } from "@/lib/db/queries";

export async function createPost(formData: FormData) {
  const imageUrls = await getImageURLs(formData);
  console.log("imageUrls: ", imageUrls);
  formData.delete("images");
  formData.append("images", JSON.stringify(imageUrls));
  console.log("formData ", formData);
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    content: formData.get("content") as string,
    featured: formData.get("featured") as string, // use boolean, not string
    images: imageUrls,
  };

  return await createNewBlog(data);

  // TODO: handle actual upload and DB persistence
}
