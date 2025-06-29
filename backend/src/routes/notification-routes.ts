import {
  createLikeNotification,
  createReplyNotification,
} from "../controllers/notificationController.ts";
import express from "express";

const router = express.Router();

router.post("/like", createLikeNotification);

router.post("/reply", createReplyNotification);

export default router;
