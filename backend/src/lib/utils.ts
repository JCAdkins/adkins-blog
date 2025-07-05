// utils/comments-utils.ts
import type { CommentWithRelations } from "../types/types.ts";
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

export async function getTopLevelCount(postId: string) {
  return db.comment.count({
    where: {
      postId,
      parentId: null,
    },
  });
}

export type CommentNode = Omit<CommentWithRelations, "replies"> & {
  replies: CommentNode[];
};

// export function buildThreadTree(
//   flatComments: CommentWithRelations[]
// ): CommentNode | null {
//   if (flatComments.length === 0) return null;

//   let root = { ...flatComments[0], replies: [] } as CommentNode;
//   let current = root;

//   for (let i = 1; i < flatComments.length; i++) {
//     const next = { ...flatComments[i], replies: [] } as CommentNode;
//     current.replies.push(next);
//     current = next;
//   }

//   return root;
// }

export function buildThreadTree(
  comments: CommentWithRelations[]
): CommentNode[] {
  const commentMap = new Map<string, CommentNode>();

  // First pass: initialize map entries
  for (const comment of comments) {
    commentMap.set(comment.id, {
      ...comment,
      replies: [],
    });
  }

  const roots: CommentNode[] = [];

  // Second pass: link children to their parents
  for (const comment of comments) {
    const node = commentMap.get(comment.id)!;
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
      }
    } else {
      roots.push(node); // top-level comment
    }
  }

  return roots;
}
