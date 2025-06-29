// src/context/CommentsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchBlogCommentsPaginated } from "@/lib/db/queries";

interface CommentsContextType {
  comments: globalThis.Comment[];
  allCommentCount: number;
  topLevelCount: number;
  isLoading: boolean;
  loadMore: () => void;
  refreshComments: () => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined
);

export const CommentsProvider = ({
  blogId,
  children,
}: {
  blogId: string;
  children: React.ReactNode;
}) => {
  const PAGE_SIZE = 5;
  const [comments, setComments] = useState<globalThis.Comment[]>([]);
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
      if (reset) {
        setComments(response.comments);
      } else {
        setComments((prev) => [...prev, ...response.comments]);
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
