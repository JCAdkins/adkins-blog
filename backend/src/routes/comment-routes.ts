import { verifyToken } from "../middleware.ts";
import {
  fetchBlogCommentsPaginated,
  fetchCommentReplies,
  postNewComment,
  likeComment,
  deleteComment,
} from "../controllers/commentsController.ts";
import express from "express";

const router = express.Router();

router.get("/", fetchBlogCommentsPaginated);

router.get("/:commentId/replies", fetchCommentReplies);

router.post("/", verifyToken, postNewComment);

router.post("/like", verifyToken, likeComment);

router.delete("/:commentId", verifyToken, deleteComment);

export default router;
