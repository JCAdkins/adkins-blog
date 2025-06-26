import {
  getBlogMessagesPaginated,
  postNewCommentService,
  likeCommentService,
  softDeleteComment,
  hardDeleteComment,
} from "../services/commentsService.ts";
import express from "express";

export async function fetchBlogCommentsPaginated(
  req: express.Request,
  res: express.Response
) {
  const { blogId, page = 1, limit = 10 } = req.query;
  console.log("postId: ", blogId);
  try {
    const comments = await getBlogMessagesPaginated(blogId, page, limit);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching blog comments: ", error);
    res.status(500).json(error);
  }
}

export async function postNewComment(
  req: express.Request,
  res: express.Response
) {
  const data = req.body;
  console.log("comment data: ", data);
  try {
    const result = await postNewCommentService(data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating new comment: ", error);
    res.status(500).json(error);
  }
}

export async function deleteComment(
  req: express.Request,
  res: express.Response
) {
  const { commentId } = req.params;
  const hard = req.query.hard === "true";

  console.log("commentId: ", commentId);
  console.log("hard: ", hard);

  try {
    const result = hard
      ? await hardDeleteComment(commentId)
      : await softDeleteComment(commentId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching blog comments: ", error);
    res.status(500).json(error);
  }
}

export async function likeComment(req: express.Request, res: express.Response) {
  const data = req.body;
  try {
    const result = await likeCommentService(data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating new comment: ", error);
    res.status(500).json(error);
  }
}
