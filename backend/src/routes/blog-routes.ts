// routes/blogPosts.js
import express from "express";
import {
  createNewBlogPost,
  getBlogPost,
  getBlogPosts,
  updateBlogPostController,
  deleteBlogPostController,
  getFeaturedBlogPosts,
} from "../controllers/blogPostController.ts";

const router = express.Router();

// Create a new blog post
router.post("/", createNewBlogPost);

// Get all blog posts
router.get("/", getBlogPosts);

// Get featured blogs
router.get("/featured", getFeaturedBlogPosts);

// Get a single blog post by ID
router.get("/:id", getBlogPost);

// Update a blog post by ID
router.put("/:id", updateBlogPostController);

// Delete a blog post by ID
router.delete("/:id", deleteBlogPostController);

export default router;
