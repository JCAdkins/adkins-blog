import { verifyToken } from "../middleware.js";
import {
  fetchBlogCommentsPaginated,
  fetchCommentReplies,
  postNewComment,
  likeComment,
  deleteComment,
  getCommentById,
} from "../controllers/commentsController.js";
import express from "express";

const router = express.Router();

router.get("/", fetchBlogCommentsPaginated);
router.get("/:commentId", getCommentById);

router.get("/:commentId/replies", fetchCommentReplies);

router.post("/", verifyToken, postNewComment);

router.post("/like", verifyToken, likeComment);

router.delete("/:commentId", verifyToken, deleteComment);

export default router;
