// routes/blogPosts.js
import express from "express";
import {
  createNewUserController,
  deleteSessionController,
  deleteAllOtherSessionsController,
  getUserByEmailController,
  getUserByUsernameController,
  getAllUsersController,
  getMeController,
  loginUserController,
  updateUserController,
  updateUserPassword,
  updateUserAvatar,
  updateUserVisibility,
  getUserSessionsController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/usersController.js";
import { verifyToken } from "../middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "avatars/" });

// GET /api/users/email/:email
router.get("/email/:email", getUserByEmailController);

// GET /api/users/username/:username
router.get("/username/:username", getUserByUsernameController);

// Get all users
router.get("/", getAllUsersController);

// Get the user thats signed into the session
router.get("/me", verifyToken, getMeController);

// Retrieve all the users sessions
router.get("/me/sessions", verifyToken, getUserSessionsController);

// Update user profile
router.patch("/me", verifyToken, updateUserController);

// Update user password
router.patch("/me/password", verifyToken, updateUserPassword);

// Update user profile visibility
router.patch("/me/privacy", verifyToken, updateUserVisibility);

// Update user avatar
router.patch(
  "/me/avatar",
  verifyToken,
  upload.single("avatar"),
  updateUserAvatar,
);

// Login user
router.post("/login", loginUserController);

// Create new user
router.post("/register", createNewUserController);

// Request a password reset email
router.post("/forgot-password", forgotPasswordController);

// Consume reset token and set new password
router.post("/reset-password", resetPasswordController);

router.delete("/me/session/:sessionId", verifyToken, deleteSessionController);
router.delete(
  "/me/sessions/:sessionId",
  verifyToken,
  deleteAllOtherSessionsController,
);

export default router;
