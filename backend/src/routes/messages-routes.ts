import { verifyToken } from "../middleware.ts";
import {
  fetchAllMessages,
  unreadMessageCount,
  markMessageAsRead,
} from "../controllers/messagesController.ts";
import express from "express";

const router = express.Router();

router.get("/unread/count", verifyToken, unreadMessageCount);

router.get("/", verifyToken, fetchAllMessages);

router.post("/mark-read", verifyToken, markMessageAsRead);

export default router;
