import {
  attachRepliesCountToComments,
  buildCommentMap,
  buildThreadSubtree,
  findThreadPath,
  getTopLevelComments,
  getTopLevelCount,
  getTotalCommentCountForPost,
} from "../lib/utils.ts";
import { db } from "../lib/prisma.ts";
import type { CommentWithRelations } from "../types/types.ts";

export async function getBlogMessagesPaginated(
  postId: string,
  page = 1,
  limit = 10
) {
  if (!postId) {
    return { error: "Post ID is required." };
  }

  try {
    // Fetch top-level comments (with first reply included)
    const topLevelComments = await getTopLevelComments(postId, page, limit);
    const topLevelCount = await getTopLevelCount(postId);

    // Attach repliesCount to each top-level comment and its one reply
    const commentsWithCounts = await attachRepliesCountToComments(
      topLevelComments
    );

    // Get total count of all comments for the post
    const totalCount = await getTotalCommentCountForPost(postId);

    return {
      comments: commentsWithCounts,
      allCommentCount: totalCount,
      topLevelCount: topLevelCount,
    };
  } catch (error) {
    console.error("Error in getBlogMessagesPaginated:", error);
    throw error;
  }
}

export async function fetchCommentById(id: string) {
  const comment = await db.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      },
      post: true,
      replies: true,
    },
  });
  return comment;
}

export async function fetchCommentByIdWithAncestors(
  postId: string,
  targetCommentId: string
): Promise<CommentWithRelations[]> {
  // 1. Fetch all comments from DB
  const comments = await db.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      },
      post: true,
      replies: true,
      likes: true,
    },
  });

  const map = buildCommentMap(comments);
  const path = findThreadPath(map, targetCommentId);
  const threadSubtree = buildThreadSubtree(map, path);
  return threadSubtree;
}

export async function fetchCommentRepliesService(
  parentId: string,
  page = 1,
  limit = 3
) {
  if (!parentId) throw new Error("parentId is required");

  const offset = (page - 1) * limit;

  const replies = await db.comment.findMany({
    where: { parentId },
    orderBy: { createdAt: "asc" },
    skip: offset,
    take: limit,
    include: {
      author: true,
      likes: true,
      replies: {
        orderBy: { createdAt: "asc" },
        take: 0,
        include: {
          author: true,
          likes: true,
        },
      },
    },
  });

  const repliesWithCounts = await attachRepliesCountToComments(replies);

  const totalReplies = await db.comment.count({
    where: { parentId },
  });

  return {
    repliesWithCounts,
    totalCount: totalReplies,
    page,
    hasMore: offset + replies.length < totalReplies,
  };
}

export async function postNewCommentService(data: {
  content: string;
  blogId: string;
  parentId?: string;
  authorId: string;
}) {
  return await db.comment.create({
    data: {
      content: data.content,
      post: { connect: { id: data.blogId } },
      author: { connect: { id: data.authorId } },
      parent: data.parentId ? { connect: { id: data.parentId } } : undefined,
    },
    include: {
      author: true,
      parent: true,
    },
  });
}

export async function softDeleteComment(commentId: string) {
  try {
    await db.like.deleteMany({
      where: { commentId: commentId },
    });

    await db.comment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
      },
    });
    return { message: "Comment soft-deleted" };
  } catch (err) {
    console.error("Failed to soft-delete comment", err);
    return { error: "Failed to delete comment" };
  }
}

export async function hardDeleteComment(commentId: string) {
  return await db.comment.delete({
    where: {
      id: commentId,
    },
  });
}

export async function likeCommentService(commentId: string, userId: string) {
  // Optional: Check if already liked
  try {
    const existing = await db.like.findFirst({
      where: { commentId, userId },
    });

    if (existing) {
      await db.like.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });
      return { status: "success", liked: false };
    }

    await db.like.create({
      data: { commentId, userId },
    });
    return { status: "success", liked: true };
  } catch (error) {
    console.error("Failed to soft-delete comment", error);
    return { error: "Failed to like/unlike comment" };
  }
}
