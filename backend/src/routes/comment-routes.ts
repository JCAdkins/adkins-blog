import {
  fetchBlogCommentsPaginated,
  postNewComment,
  likeComment,
  deleteComment,
} from "../controllers/commentsController.ts";
import express from "express";

const router = express.Router();

router.get("/", fetchBlogCommentsPaginated);

router.post("/", postNewComment);

router.post("/like", likeComment);

router.delete("/:commentId", deleteComment);

export default router;
