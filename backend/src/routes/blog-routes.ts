// routes/blogPosts.js
import express from "express";
import {
  createNewBlogPost,
  getBlogById,
  getBlogPosts,
  deleteBlogPostController,
  getFeaturedBlogPosts,
} from "../controllers/blogPostController.js";
import { verifyToken } from "../middleware.js";

const router = express.Router();

// Create a new blog post
router.post("/", verifyToken, createNewBlogPost);

// Get all blog posts
router.get("/", getBlogPosts);

// Get featured blogs
router.get("/featured", getFeaturedBlogPosts);

// Get a single blog post by ID
router.get("/:id", getBlogById);

// Delete a blog post by ID
router.delete("/:id", deleteBlogPostController);

export default router;
