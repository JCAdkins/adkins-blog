import { z } from "zod";

// Define the schema for a single Immich image
const ImmichImageSchema = z.object({
  id: z.string().uuid(), // assuming it's a UUID
  status: z.string(), // optionally validate against enum if fixed values
});

export type ImmichImage = z.infer<typeof ImmichImageSchema>;

// Define the full BlogPostInput schema
export const BlogPostInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  featured: z.string().min(1, "Content is required"),
  images: z.array(ImmichImageSchema).optional(), // optional if sometimes missing
});

// Type inference (optional but recommended)
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

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
