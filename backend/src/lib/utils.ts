// utils/comments-utils.ts
import type { CommentWithRelations } from "../types/types.js";
import { db } from "./prisma.js";

export async function getTopLevelComments(
  postId: string,
  page = 1,
  limit = 10
) {
  const offset = (page - 1) * limit;

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
            hasMore: nestedRepliesCount > (reply.replies?.length ?? 0), // usually 0 unless you preload deeper
          };
        })
      );

      return {
        ...comment,
        replies: repliesWithCounts,
        repliesCount,
        hasMore: repliesCount > comment.replies.length,
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
  hasMore?: boolean;
};

// 1. Full comment tree from flat list
export function buildCommentMap(
  comments: CommentWithRelations[]
): Map<string, CommentNode> {
  const map = new Map<string, CommentNode>();
  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }
  for (const comment of comments) {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      const child = map.get(comment.id);
      if (parent && child) parent.replies.push(child);
    }
  }
  return map;
}

export function findThreadPath(
  map: Map<string, CommentNode>,
  targetId: string
): string[] {
  const path: string[] = [];
  let current = map.get(targetId);
  while (current) {
    path.unshift(current.id);
    if (!current.parentId) break;
    current = map.get(current.parentId);
  }
  return path;
}

export function buildThreadSubtree(
  map: Map<string, CommentNode>,
  path: string[]
): CommentNode[] {
  let child: CommentNode | undefined;

  for (let i = path.length - 1; i >= 0; i--) {
    const nodeId = path[i];
    const original = map.get(nodeId);
    if (!original) continue;

    const totalReplies = original.replies.length;
    const nextId = path[i + 1];
    const visibleReply = original.replies.find((r) => r.id === nextId);

    const replies = visibleReply ? [child ?? visibleReply] : [];
    const hasMore = totalReplies > replies.length;

    const clone: CommentNode = {
      ...original,
      replies,
      hasMore,
    };

    child = clone;
  }

  return child ? [child] : [];
}
