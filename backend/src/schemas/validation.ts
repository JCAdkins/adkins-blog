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

export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  username: z.string().min(6, "Username must be at least 6 characters"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
});
