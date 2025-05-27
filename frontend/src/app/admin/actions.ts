"use server";
import getImageURLs from "@/lib/services/file-upload";
import { createNewBlog } from "@/lib/db/queries";

export async function createPost(formData: FormData) {
  const images = formData.getAll("images") as File[];

  const imageUrls = await getImageURLs(images);
  formData.delete("images");
  imageUrls.forEach((image) => formData.append("images", image));
  console.log("formData ", formData);

  const blog = createNewBlog(formData);

  // TODO: handle actual upload and DB persistence
}
