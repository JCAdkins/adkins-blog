import {
  createLikeNotification,
  createReplyNotification,
  getUnreadUserNotifications,
  getAllUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware.js";
import express from "express";

const router = express.Router();

// Creates a like notification
router.post("/like", verifyToken, createLikeNotification);

// Creates a reply notification
router.post("/reply", verifyToken, createReplyNotification);

router.post("/mark-read", verifyToken, markNotificationAsRead);

router.post("/mark-all-read", verifyToken, markAllNotificationsAsRead);

// Fetch
router.get("/unread/:userId", verifyToken, getUnreadUserNotifications);

router.get("/:userId", verifyToken, getAllUserNotifications);

export default router;
