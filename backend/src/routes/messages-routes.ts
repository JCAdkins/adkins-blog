import {
  fetchAllMessages,
  unreadMessageCount,
} from "../controllers/messagesController.ts";
import express from "express";

const router = express.Router();

router.get("/unread/count", unreadMessageCount);

// router.get("/unread", fetchUnreadMessages);

router.get("/", fetchAllMessages);

export default router;
