// src/context/CommentsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchBlogCommentsPaginated,
  fetchCommentByIdWithAncestors,
} from "@/lib/db/queries";
import { BlogComment } from "next-auth";

interface CommentsContextType {
  comments: BlogComment[];
  allCommentCount: number;
  topLevelCount: number;
  isLoading: boolean;
  loadMore: () => void;
  refreshComments: () => void;
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
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [page, setPage] = useState(1);
  const [allCommentCount, setAllCommentCount] = useState(0);
  const [topLevelCount, setTopLevelCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = async (reset = false) => {
    setIsLoading(true);
    try {
      const response = await fetchBlogCommentsPaginated({
        blogId,
        page: reset ? 1 : page,
        pageSize: PAGE_SIZE,
      });

      let baseComments = reset
        ? response.comments
        : [...comments, ...response.comments];

      // Inject highlighted comment chain if needed
      if (highlightedCommentId && reset) {
        const highlightedChain = await fetchCommentByIdWithAncestors({
          commentId: highlightedCommentId,
          postId: blogId,
        });

        // Filter out duplicates if any already in baseComments
        const merged = [
          ...highlightedChain,
          ...baseComments.filter(
            (c) => !highlightedChain.some((h: BlogComment) => h.id === c.id),
          ),
        ];

        setComments(merged);
      } else {
        setComments(baseComments);
      }

      setAllCommentCount(response.allCommentCount);
      setTopLevelCount(response.topLevelCount);
    } catch (error) {
      console.error("Error occurred: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments(true);
  }, [blogId]);

  const loadMore = () => setPage((p) => p + 1);

  useEffect(() => {
    if (page > 1) loadComments();
  }, [page]);

  const refreshComments = () => {
    setPage(1);
    loadComments(true);
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        allCommentCount,
        topLevelCount,
        isLoading,
        loadMore,
        refreshComments,
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
