// src/context/CommentsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchBlogCommentsPaginated } from "@/lib/db/queries";

interface CommentsContextType {
  comments: globalThis.Comment[];
  totalCount: number;
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
  const [comments, setComments] = useState<globalThis.Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadComments = async (reset = false) => {
    const response = await fetchBlogCommentsPaginated({
      blogId,
      page: reset ? 1 : page,
    });
    if (reset) {
      setComments(response.comments);
    } else {
      setComments((prev) => [...prev, ...response.comments]);
    }
    setTotalCount(response.totalCount);
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
      value={{ comments, totalCount, loadMore, refreshComments }}
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
