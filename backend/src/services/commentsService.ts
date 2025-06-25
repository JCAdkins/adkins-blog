import { db } from "../lib/prisma.ts";

export async function getBlogMessagesPaginated(postId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  if (!postId)
    return { error: "Post ID was not include in the fetch but is required." };

  const topLevelComments = await db.comment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
    include: {
      author: true,
      likes: true,
      replies: {
        orderBy: { createdAt: "asc" },
        take: 1, // Load only the first reply
        include: {
          author: true,
          likes: true,
        },
      },
    },
  });

  const totalCount = await db.comment.count({
    where: { postId },
  });

  return {
    comments: topLevelComments,
    totalCount,
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

export async function likeCommentService({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  // Optional: Check if already liked
  const existing = await db.like.findFirst({
    where: { commentId, userId },
  });

  if (existing) return { message: "Already liked" };

  return await db.like.create({
    data: { commentId, userId },
  });
}
