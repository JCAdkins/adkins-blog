// routes/blogPosts.js
import express from "express";
import {
  getUsersStats,
  getCommentsStats,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware.js";

const router = express.Router();

// Get all blog posts
router.get("/users/stats", verifyToken, getUsersStats);

// Get featured blogs
router.get("/comments/stats", verifyToken, getCommentsStats);

export default router;
