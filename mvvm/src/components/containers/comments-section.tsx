"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CommentCard } from "../cards/comment-card";
import { CommentInput } from "../inputs/comment-input";
import { useComments } from "@/contexts/comments-context";
import { Loader2 } from "lucide-react";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { BlogComment } from "next-auth";

export const CommentsSection = ({
  blogId,
  highlightedCommentId,
}: {
  blogId: string;
  highlightedCommentId?: string;
}) => {
  const { comments, allCommentCount, topLevelCount, isLoading, loadMore } =
    useComments();
  const [canLoadMore, setCanLoadMore] = useState(false);
  const { data: session } = useSession();

  const handleLoadMore = async () => {
    loadMore();
  };

  useEffect(() => {
    const shouldLoad: boolean = comments.length < topLevelCount;
    setCanLoadMore((prev) => {
      if (prev !== shouldLoad) return shouldLoad;
      return prev;
    });
  }, [comments.length, topLevelCount]);

  useEffect(() => {
    if (!highlightedCommentId) return;

    // Delay to ensure DOM is updated with the highlighted comment
    const timeout = setTimeout(() => {
      const el = document.getElementById(`comment-${highlightedCommentId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "rounded-md");

        setTimeout(() => {
          el.classList.remove("ring-2", "ring-header", "bg-yellow-100");
          el.classList.add("bg-header");
        }, 4000);
      }
    }, 1000); // 100–300ms usually works

    return () => clearTimeout(timeout);
  }, [highlightedCommentId]);

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({allCommentCount})</h3>
      {session && <CommentInput blogId={blogId} authorId={session.user.id} />}
      <div className="flex flex-col mt-6 gap-4">
        {comments.map((comment: BlogComment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            highlightedCommentId={highlightedCommentId}
          />
        ))}
        {isLoading && (
          <div className="flex w-full justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && canLoadMore && (
          <Button onClick={handleLoadMore} className="hover:bg-background">
            <PlusCircleIcon /> Comments
          </Button>
        )}
      </div>
    </section>
  );
};
