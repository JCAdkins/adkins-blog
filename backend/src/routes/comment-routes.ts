import {
  fetchBlogCommentsPaginated,
  postNewComment,
  likeComment,
} from "../controllers/commentsController.ts";
import express from "express";

const router = express.Router();

router.get("/", fetchBlogCommentsPaginated);

router.post("/", postNewComment);

router.post("/like", likeComment);

export default router;
