import { PrismaClient } from "@prisma/client";
import type { BlogPostInput, ImmichImage } from "../types/types.ts";

const prisma = new PrismaClient();

export async function getAllBlogPosts() {
  return await prisma.blogPost.findMany({
    include: {
      blogPostImages: {
        include: {
          image: true, // Include the associated image through the join table
        },
      },
    },
  });
}

export const getFeaturedBlogs = async () => {
  return await prisma.blogPost.findMany({
    where: {
      featured: "true", // If 'featured' is a string (e.g., "true" instead of boolean)
    },
    include: {
      // Include related images through the BlogPostImage model
      blogPostImages: {
        include: {
          image: true, // Assuming your BlogPostImage model has a relation to the Image model
        },
      },
    },
  });
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string) => {
  console.log("returning blog fetch...");
  return await prisma.blogPost.findUnique({
    where: { id },
    include: {
      blogPostImages: true,
    },
  });
};

export async function createBlogPost(input: BlogPostInput) {
  const { title, description, content, featured, images } = input;

  const blogPost = await prisma.blogPost.create({
    data: {
      title,
      description,
      content,
      featured,
      blogPostImages: {
        create: images?.map((image) => ({
          image: {
            connectOrCreate: {
              where: { id: image.id },
              create: {
                id: image.id,
                status: image.status,
              },
            },
          },
        })),
      },
    },
    include: {
      blogPostImages: {
        include: {
          image: true,
        },
      },
    },
  });

  // Optional: flatten the blogPostImages to directly return the linked images
  return {
    ...blogPost,
    images: blogPost.blogPostImages.map((bpImage) => bpImage.image),
  };
}

export const updateBlogPost = async (id: string, data: BlogPostInput) => {
  const imageData = JSON.parse(data.images as unknown as string) as {
    id: string;
    status: string;
  }[];
  // Fetch the existing post with associated images
  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existingPost) {
    throw new Error("Blog post not found");
  }

  // Prepare new image URLs from the request body
  const newImageUrls = data.images?.map((img) => img.id) || [];

  // Step 1: Remove old images that are no longer in the request body
  const imagesToDelete = existingPost.images.filter(
    (img) => !newImageUrls.includes(img.id)
  );

  // Step 2: Delete the images that are no longer part of the post
  if (imagesToDelete.length > 0) {
    await prisma.image.deleteMany({
      where: { id: { in: imagesToDelete.map((img) => img.id) } },
    });
  }

  // Step 3: Add new images that are not already part of the post
  const existingImageUrls = existingPost.images.map((img) => img.id);
  const imagesToAdd = newImageUrls.filter(
    (url) => !existingImageUrls.includes(url as string)
  );

  // Step 4: Add the new images (if any)
  const updatedPost = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      featured: data.featured,
      images: {
        // Create new image records for the provided image URLs
        create: imageData,
      },
    },
  });

  return updatedPost;
};

// Delete a blog post by ID
export async function deleteBlogPost(id: string) {
  return await prisma.blogPost.delete({
    where: { id },
  });
}
