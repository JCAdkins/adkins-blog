// utils/comments-utils.ts
import { db } from "./prisma.ts";

export async function getTopLevelComments(
  postId: string,
  page = 1,
  limit = 10
) {
  const offset = (page - 1) * limit;
  console.log("lmiit: ", limit);
  console.log("typeof: ", typeof limit);

  return await db.comment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit as number,
    include: {
      author: true,
      likes: true,
      replies: {
        orderBy: { createdAt: "asc" },
        take: 1, // Only load 1 reply initially
        include: {
          author: true,
          likes: true,
        },
      },
    },
  });
}

export async function getCommentRepliesCount(commentId: string) {
  return await db.comment.count({ where: { parentId: commentId } });
}

export async function getTotalCommentCountForPost(postId: string) {
  return await db.comment.count({ where: { postId } });
}

export async function attachRepliesCountToComments(comments: any[]) {
  const withCounts = await Promise.all(
    comments.map(async (comment) => {
      const repliesCount = await getCommentRepliesCount(comment.id);

      const repliesWithCounts = await Promise.all(
        comment.replies.map(async (reply: any) => {
          const nestedRepliesCount = await getCommentRepliesCount(reply.id);
          return {
            ...reply,
            repliesCount: nestedRepliesCount,
          };
        })
      );

      return {
        ...comment,
        replies: repliesWithCounts,
        repliesCount,
      };
    })
  );

  return withCounts;
}
