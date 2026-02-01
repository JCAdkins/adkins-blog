// src/components/containers/comments-section.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CommentCard } from "../cards/comment/comment-card";
import { CommentInput } from "../inputs/comment-input";
import { useComments } from "@/contexts/comments-context"; // Updated path if needed
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export const CommentsSection = ({
  blogId,
  highlightedCommentId,
}: {
  blogId: string;
  highlightedCommentId?: string;
}) => {
  const {
    commentsById,
    topLevelIds,
    allCommentCount,
    topLevelCount,
    isLoading,
    loadMoreTopLevel,
  } = useComments();
  const { data: session } = useSession();

  const canLoadMore = topLevelIds.length < topLevelCount;

  useEffect(() => {
    if (!highlightedCommentId) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(`comment-${highlightedCommentId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.remove("bg-header");
        el.classList.add("bg-yellow-100");
        setTimeout(() => {
          el.classList.remove("bg-yellow-100");
          el.classList.add("bg-header");
        }, 3000);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []); // Depend on commentsById to re-run if loaded

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({allCommentCount})</h3>
      {session && <CommentInput blogId={blogId} authorId={session.user.id} />}
      <div className="flex flex-col mt-6 gap-4">
        {topLevelIds.map((id) => {
          const comment = commentsById[id];
          return comment ? <CommentCard key={id} comment={comment} /> : null;
        })}
        {isLoading && (
          <div className="flex w-full justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && canLoadMore && (
          <Button onClick={loadMoreTopLevel} className="hover:bg-background">
            Load More Comments
          </Button>
        )}
      </div>
    </section>
  );
};
