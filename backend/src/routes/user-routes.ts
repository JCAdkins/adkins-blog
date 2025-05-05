// routes/blogPosts.js
import express from "express";
import {
  getUserByEmailController,
  getUserByUsernameController,
  getAllUsersController,
  loginUserController,
  createNewUserController,
} from "../controllers/usersController.ts";

const router = express.Router();

// GET /api/users/:email
router.get("/email/:email", getUserByEmailController);

// GET /api/users/:username
router.get("/username/:username", getUserByUsernameController);

// Get all users
router.get("/", getAllUsersController);

// Login user
router.post("/login", loginUserController);

// Create new user
router.post("/register", createNewUserController);

export default router;
