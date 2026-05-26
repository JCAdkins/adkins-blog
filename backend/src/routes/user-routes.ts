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
  verifyEmailController,
} from "../controllers/usersController.js";
import { verifyToken } from "../middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "avatars/" });

router.get("/email/:email", getUserByEmailController);
router.get("/username/:username", getUserByUsernameController);
router.get("/", getAllUsersController);
router.get("/me", verifyToken, getMeController);
router.get("/me/sessions", verifyToken, getUserSessionsController);
router.patch("/me", verifyToken, updateUserController);
router.patch("/me/password", verifyToken, updateUserPassword);
router.patch("/me/privacy", verifyToken, updateUserVisibility);
router.patch("/me/avatar", verifyToken, upload.single("avatar"), updateUserAvatar);
router.post("/login", loginUserController);
router.post("/register", createNewUserController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/verify-email", verifyEmailController);
router.delete("/me/session/:sessionId", verifyToken, deleteSessionController);
router.delete("/me/sessions/:sessionId", verifyToken, deleteAllOtherSessionsController);

export default router;
