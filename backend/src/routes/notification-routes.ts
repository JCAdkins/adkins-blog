import {
  createLikeNotification,
  createReplyNotification,
} from "../controllers/notificationController.ts";
import { verifyToken } from "../middleware.ts";
import express from "express";

const router = express.Router();

router.post("/like", verifyToken, createLikeNotification);

router.post("/reply", verifyToken, createReplyNotification);

export default router;
