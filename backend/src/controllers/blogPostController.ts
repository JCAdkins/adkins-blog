import express from "express";
import {
  createBlogPost,
  getFeaturedBlogs,
  getBlogPostById,
  getAllBlogPosts,
  deleteBlogPost,
} from "../services/blogPostService.js";
import { BlogPostInputSchema } from "../schemas/validation.js";
import z, { ZodError } from "zod";

// Get all featured blog posts
export async function getFeaturedBlogPosts(
  _req: express.Request,
  res: express.Response
) {
  try {
    const posts = await getFeaturedBlogs();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all blog posts
export async function getBlogPosts(
  _req: express.Request,
  res: express.Response
) {
  try {
    const posts = await getAllBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get a single blog post by ID
export async function getBlogById(req: express.Request, res: express.Response) {
  console.log("fetching blog by id..");
  try {
    const { id } = req.params;
    const post = await getBlogPostById(id);
    if (!post) {
      res.status(404).json({ message: "Blog post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create a new blog post
export async function createNewBlogPost(
  req: express.Request,
  res: express.Response
) {
  console.log("creating new blog post..");
  try {
    console.log("req.body: ", req.body);
    const validation = BlogPostInputSchema.safeParse(req.body); // Validate input with Zod
    validation.error?.errors.forEach((err) => {
      console.log(`Path: ${err.path.join(" > ")}`); // This will show the error path (nested fields)
      console.log(`Message: ${err.message}`); // This will show the error message for the field
      // console.log(`Expected Type: ${err.}`); // This shows the expected type for the field
    });
    if (!validation.success) {
      // If validation fails, send an error response
      res.status(400).json({
        message: "Invalid data",
        errors: validation.error.errors,
      });
      return;
    }
    const newPost = await createBlogPost(validation.data);
    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a blog post
export async function deleteBlogPostController(
  req: express.Request,
  res: express.Response
) {
  const { id } = req.params;

  // Validate the ID format (e.g., UUID)
  const idValidation = z.string().uuid().safeParse(id);

  if (!idValidation.success) {
    res.status(400).json({ message: "Invalid blog post ID" });
    return;
  }

  try {
    await deleteBlogPost(id);
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
