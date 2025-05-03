// routes/blogPosts.js
import express from "express";
import {
  createNewUserController,
  getUserByEmailController,
  getUserByUsernameController,
  getAllUsersController,
} from "../controllers/usersController.ts";

const router = express.Router();

// Create a new user
router.post("/", createNewUserController);

// GET /api/users/:email
router.get("/email/:email", getUserByEmailController);

// GET /api/users/:username
router.get("/username/:username", getUserByUsernameController);

// Get all users
router.get("/", getAllUsersController);

export default router;
