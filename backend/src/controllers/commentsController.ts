import {
  getBlogMessagesPaginated,
  postNewCommentService,
  likeCommentService,
  softDeleteComment,
  hardDeleteComment,
  fetchCommentRepliesService,
  fetchCommentById,
  fetchCommentByIdWithAncestors,
} from "../services/commentsService.js";
import express from "express";
import { AuthenticatedRequest } from "../middleware.js";

export async function fetchBlogCommentsPaginated(
  req: express.Request,
  res: express.Response,
) {
  try {
    const { blogId, page = 1, pageSize = 10 } = req.query;
    const numericPage = parseInt(page as string, 10);
    const numericPageSize = parseInt(pageSize as string, 10);

    const comments = await getBlogMessagesPaginated(
      blogId as string,
      numericPage,
      numericPageSize,
    );
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching blog comments: ", error);
    res.status(500).json(error);
  }
}

export async function fetchCommentReplies(
  req: express.Request,
  res: express.Response,
) {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;

    const result = await fetchCommentRepliesService(commentId, page, limit);
    res.status(200).json(result); // or include hasMore etc if needed
  } catch (error) {
    console.error("Failed to fetch replies", error);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
}

export async function postNewComment(
  req: AuthenticatedRequest,
  res: express.Response,
) {
  const data = {
    ...req.body,
    authorId: req.user!.id,
  };
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
  res: express.Response,
) {
  try {
    const { commentId } = req.params;
    const hard = req.query.hard === "true";

    const result = hard
      ? await hardDeleteComment(commentId)
      : await softDeleteComment(commentId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching blog comments: ", error);
    res.status(500).json(error);
  }
}

export async function likeComment(
  req: AuthenticatedRequest,
  res: express.Response,
) {
  console.log("Liking comment");
  const { commentId } = req.body;
  try {
    const result = await likeCommentService(commentId, req.user!.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating new comment: ", error);
    res.status(500).json({ error: "Error creating new comment." });
  }
}

export async function getCommentById(
  req: express.Request,
  res: express.Response,
) {
  // Recurse is whether we want to fetch all parent replies/comments
  const { commentId } = req.params;
  const postId = req.query.postId;
  if (!commentId) {
    res.status(400).json({ error: "Comment Id was not supplied" });
    return;
  }

  try {
    const result = postId
      ? await fetchCommentByIdWithAncestors(postId as string, commentId)
      : fetchCommentById(commentId);
    res.status(200).json(result); // or include hasMore etc if needed
  } catch (error) {
    console.error("Error fetching comment: ", error);
    res.status(500).json({ error: "Error fetching comment." });
  }
}
