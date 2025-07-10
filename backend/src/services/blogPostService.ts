import { PrismaClient } from "@prisma/client";
import type { BlogPostInput } from "../types/types.js";

const prisma = new PrismaClient();

export async function getAllBlogPosts() {
  return await prisma.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
    orderBy: {
      createdAt: "desc",
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
  const { title, description, genre, content, featured, images } = input;

  const blogPost = await prisma.blogPost.create({
    data: {
      title,
      description,
      genre,
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

// Delete a blog post by ID
export async function deleteBlogPost(id: string) {
  return await prisma.blogPost.delete({
    where: { id },
  });
}
