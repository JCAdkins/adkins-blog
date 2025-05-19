"use server";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const content = formData.get("content");
  const featured = formData.get("featured") === "true";
  const images = formData.getAll("images") as File[];

  // Save logic (DB, Immich, etc.)
  console.log({ title, description, content, featured, images });

  // TODO: handle actual upload and DB persistence
}
