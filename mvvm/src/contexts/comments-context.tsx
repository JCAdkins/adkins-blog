// src/context/CommentsContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  createLikeNotification,
  deleteCommentLib,
  fetchBlogCommentsPaginated,
  fetchCommentByIdWithAncestors,
  fetchRepliesForComment,
  likeComment,
} from "@/lib/db/queries";
import { BlogComment } from "next-auth";

interface CommentsContextType {
  commentsById: Record<string, BlogComment>;
  topLevelIds: string[];
  allCommentCount: number;
  topLevelCount: number;
  isLoading: boolean;
  loadMoreTopLevel: () => void;
  loadMoreReplies: (commentId: string) => void;
  addComment: (newComment: BlogComment) => void;
  deleteComment: (commentId: string) => Promise<void>;
  toggleLike: (commentId: string, userId: string) => Promise<void>;
}

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined,
);

export const CommentsProvider = ({
  blogId,
  highlightedCommentId,
  children,
}: {
  blogId: string;
  highlightedCommentId?: string;
  children: React.ReactNode;
}) => {
  const PAGE_SIZE = 5;
  const [commentsById, setCommentsById] = useState<Record<string, BlogComment>>(
    {},
  );
  const [topLevelIds, setTopLevelIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [allCommentCount, setAllCommentCount] = useState(0);
  const [topLevelCount, setTopLevelCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [repliesPageById, setRepliesPageById] = useState<
    Record<string, number>
  >({});

  const normalizeComment = (c: any): BlogComment => {
    const childrenIds: string[] = [];

    c.replies?.forEach((reply: BlogComment) => childrenIds.push(reply.id));
    // rename if you want
    const returnComment = {
      ...c, // type assertion if needed temporarily
      parentId: c.parentId,
      repliesCount: c.repliesCount ?? 0,
      hasMore: c.hasMore ?? false,
      childrenIds: childrenIds,
      likesCount: c.likesCount ?? (c as any).likes?.length ?? 0,
      userHasLiked: c.userHasLiked ?? false,
    };
    return returnComment;
  };

  const addToState = useCallback(
    (comments: BlogComment[], parentId?: string) => {
      setCommentsById((prev) => {
        const updated = { ...prev };
        comments.forEach((c) => {
          const normalized = normalizeComment(c);
          if (updated[c.id]) {
            // Merge: preserve client-side data like childrenIds
            console.log(
              `Merging existing comment ${c.id} (preserving childrenIds length: ${updated[c.id].childrenIds?.length || 0})`,
            );
            updated[c.id] = {
              ...updated[c.id], // keep old data (especially childrenIds)
              ...normalized, // update with fresh server data
              childrenIds:
                updated[c.id].childrenIds || normalized.childrenIds || [], // never lose loaded children
              // You can add similar protection for other client-managed fields
            };
          } else {
            updated[c.id] = normalized;
          }
          if (c.replies?.length > 0) {
            c.replies.forEach((reply) => {
              const replyNorm = normalizeComment(reply);
              if (updated[reply.id]) {
                updated[reply.id] = {
                  ...updated[reply.id],
                  ...replyNorm,
                  childrenIds:
                    updated[reply.id].childrenIds ||
                    replyNorm.childrenIds ||
                    [],
                };
              } else {
                updated[reply.id] = replyNorm;
              }
            });
          }
        });
        return updated;
      });

      if (!parentId) {
        // Top-level: append to topLevelIds, sort by createdAt descending (or your preference)
        setTopLevelIds((prev) => {
          const newIds = comments
            .map((c) => c.id)
            .filter((id) => !prev.includes(id));

          if (newIds.length === 0) return prev;

          return [...prev, ...newIds].sort((a, b) => {
            return (
              new Date(commentsById[b]?.createdAt || 0).getTime() -
              new Date(commentsById[a]?.createdAt || 0).getTime()
            );
          });
        });
      } else {
        // Replies: append to parent's childrenIds, sort
        setCommentsById((prev) => {
          const parent = prev[parentId];
          if (!parent) return prev;
          const newChildren = [
            ...parent.childrenIds,
            ...comments.map((c) => c.id),
          ]
            .filter((id, idx, arr) => arr.indexOf(id) === idx)
            .sort((a, b) => {
              return (
                new Date(prev[a]?.createdAt || 0).getTime() -
                new Date(prev[b]?.createdAt || 0).getTime()
              );
            });
          return {
            ...prev,
            [parentId]: {
              ...parent,
              childrenIds: newChildren,
              repliesCount: Math.max(parent.repliesCount, newChildren.length),
            },
          };
        });
      }
    },
    [commentsById],
  );

  const loadComments = async (reset = false) => {
    setIsLoading(true);
    try {
      const response = await fetchBlogCommentsPaginated({
        blogId,
        page: reset ? 1 : page,
        pageSize: PAGE_SIZE,
      });

      addToState(response.comments);

      setAllCommentCount(response.allCommentCount);
      setTopLevelCount(response.topLevelCount);

      if (highlightedCommentId && reset) {
        const chain = await fetchCommentByIdWithAncestors({
          commentId: highlightedCommentId,
          postId: blogId,
        });
        // Add chain to tree: link via parentId
        chain.forEach((c: BlogComment, idx: number) => {
          const parent = idx > 0 ? chain[idx - 1] : undefined;
          addToState([c], parent?.id);
        });
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments(true);
  }, [blogId]);

  const loadMoreTopLevel = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  useEffect(() => {
    if (page > 1) loadComments();
  }, [page]);

  const loadMoreReplies = useCallback(
    async (commentId: string) => {
      const currentPage = repliesPageById[commentId] || 0;
      const nextPage = currentPage + 1;

      try {
        const data = await fetchRepliesForComment(commentId, nextPage);
        addToState(data.repliesWithCounts, commentId);
        setRepliesPageById((prev) => ({ ...prev, [commentId]: nextPage }));
        setCommentsById((prev) => ({
          ...prev,
          [commentId]: { ...prev[commentId] },
        }));
      } catch (err) {
        console.error("Failed to load replies:", err);
      }
    },
    [addToState, repliesPageById],
  );

  const addComment = useCallback(
    (newComment: BlogComment) => {
      addToState([newComment], newComment.parentId);

      if (newComment.parentId) {
        setCommentsById((prev) => {
          if (prev[newComment.id]) {
            console.warn(
              "Comment already exists, skipping duplicate add",
              newComment.id,
            );
            return prev;
          }
          const parent = prev[newComment.parentId!];
          return parent
            ? {
                ...prev,
                [newComment.parentId!]: {
                  ...parent,
                  repliesCount: parent.repliesCount + 1,
                },
              }
            : prev;
        });
      } else {
        setTopLevelCount((prev) => prev + 1);
      }
      setAllCommentCount((prev) => prev + 1);
    },
    [addToState],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      const comment = commentsById[commentId];
      if (!comment) return;

      // optimistic update ...
      if (comment.repliesCount > 0) {
        setCommentsById((prev) => ({
          ...prev,
          [commentId]: { ...comment, isDeleted: true, content: "[DELETED]" },
        }));
      } else {
        if (comment.parentId) {
          setCommentsById((prev) => {
            const parent = prev[comment.parentId!];
            if (!parent) return prev;
            return {
              ...prev,
              [comment.parentId!]: {
                ...parent,
                childrenIds: parent.childrenIds.filter(
                  (id) => id !== commentId,
                ),
                repliesCount: parent.repliesCount - 1,
              },
            };
          });
        } else {
          setTopLevelIds((prev) => prev.filter((id) => id !== commentId));
          setTopLevelCount((prev) => prev - 1);
        }
        setCommentsById((prev) => {
          const { [commentId]: _, ...rest } = prev;
          return rest;
        });
      }
      setAllCommentCount((prev) => prev - 1);

      // backend call
      await deleteCommentLib(
        commentId,
        comment.repliesCount === 0 ? "true" : "false",
      );
    },
    [commentsById, deleteCommentLib],
  );

  const toggleLike = useCallback(
    async (commentId: string, userId: string) => {
      const comment = commentsById[commentId];
      if (!comment || !userId) return;

      const wasLiked = comment.userHasLiked;
      const authorId = comment.author?.id;

      setCommentsById((prev) => {
        const c = prev[commentId];
        if (!c) return prev;
        return {
          ...prev,
          [commentId]: {
            ...c,
            likesCount: wasLiked ? c.likesCount - 1 : c.likesCount + 1,
            userHasLiked: !wasLiked,
          },
        };
      });

      try {
        const res = await likeComment(commentId, authorId, userId);

        if (res?.success) {
          setCommentsById((prev) => {
            const c = prev[commentId];
            if (!c) return prev;
            return {
              ...prev,
              [commentId]: {
                ...c,
                likesCount: res.likesCount ?? c.likesCount,
                userHasLiked: res.userHasLiked ?? !wasLiked,
              },
            };
          });

          if (!wasLiked && authorId !== userId) {
            await createLikeNotification({
              commentId,
              authorName: comment.author?.username ?? "User",
              userId: authorId,
              actorId: userId,
            });
          }
        }
      } catch (err) {
        console.error("Like toggle failed", err);
        // rollback
        setCommentsById((prev) => {
          const c = prev[commentId];
          if (!c) return prev;
          return {
            ...prev,
            [commentId]: {
              ...c,
              likesCount: wasLiked ? c.likesCount + 1 : c.likesCount - 1,
              userHasLiked: wasLiked,
            },
          };
        });
      }
    },
    [commentsById, likeComment, createLikeNotification],
  );

  return (
    <CommentsContext.Provider
      value={{
        commentsById,
        topLevelIds,
        allCommentCount,
        topLevelCount,
        isLoading,
        loadMoreTopLevel,
        loadMoreReplies,
        addComment,
        deleteComment,
        toggleLike,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error("useComments must be used within CommentsProvider");
  return ctx;
};
