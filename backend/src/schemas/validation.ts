import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"), // Ensure substantial content
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
      })
    )
    .optional(),
  featured: z.boolean().default(false),
});
