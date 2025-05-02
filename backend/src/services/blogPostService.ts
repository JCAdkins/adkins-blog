import { PrismaClient } from "@prisma/client";
import type { BlogPostInput } from "../types/types.ts";

const prisma = new PrismaClient();

export async function getAllBlogPosts() {
  return await prisma.blogPost.findMany({
    include: {
      images: true, // Include associated images
    },
  });
}

// Get all featured blog posts
export const getFeaturedBlogs = async () => {
  return await prisma.blogPost.findMany({
    where: { featured: true },
    include: { images: true },
  });
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string) => {
  return await prisma.blogPost.findUnique({
    where: { id },
    include: { images: true },
  });
};

// Create a new blog post
export const createBlogPost = async (data: BlogPostInput) => {
  return await prisma.blogPost.create({
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      featured: data.featured,
      images: {
        create: data.images?.map((img) => ({
          url: img.url, // Only provide the URL, let Prisma handle ID and blogPostId
        })),
      },
    },
    include: { images: true },
  });
};

export const updateBlogPost = async (id: string, data: BlogPostInput) => {
  // Fetch the existing post with associated images
  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existingPost) {
    throw new Error("Blog post not found");
  }

  // Prepare new image URLs from the request body
  const newImageUrls = data.images?.map((img) => img.url) || [];

  // Step 1: Remove old images that are no longer in the request body
  const imagesToDelete = existingPost.images.filter(
    (img) => !newImageUrls.includes(img.url)
  );

  // Step 2: Delete the images that are no longer part of the post
  if (imagesToDelete.length > 0) {
    await prisma.image.deleteMany({
      where: { id: { in: imagesToDelete.map((img) => img.id) } },
    });
  }

  // Step 3: Add new images that are not already part of the post
  const existingImageUrls = existingPost.images.map((img) => img.url);
  const imagesToAdd = newImageUrls.filter(
    (url) => !existingImageUrls.includes(url)
  );

  // Step 2: Add the new images (if any)
  const updatedPost = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      featured: data.featured,
      images: {
        // Create new image records for the provided image URLs
        create: imagesToAdd.map((url) => ({ url })),
      },
    },
    include: { images: true },
  });

  return updatedPost;
};

// Delete a blog post by ID
export async function deleteBlogPost(id: string) {
  return await prisma.blogPost.delete({
    where: { id },
  });
}
