import {
  createLikeNotification,
  createReplyNotification,
  getUserNotifications,
} from "../controllers/notificationController.ts";
import { verifyToken } from "../middleware.ts";
import express from "express";

const router = express.Router();

router.post("/like", verifyToken, createLikeNotification);

router.post("/reply", verifyToken, createReplyNotification);

router.get("/unread/:userId", verifyToken, getUserNotifications);

export default router;
