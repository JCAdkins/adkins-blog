"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CommentCard } from "../cards/comment-card";
import { CommentInput } from "../inputs/comment-input";
import { useComments } from "@/contexts/comments-context";
import { Loader2 } from "lucide-react";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

export const CommentsSection = ({ blogId }: { blogId: string }) => {
  const { comments, allCommentCount, topLevelCount, isLoading, loadMore } =
    useComments();
  const [canLoadMore, setCanLoadMore] = useState(false);
  const { data: session } = useSession();

  const handleLoadMore = async () => {
    loadMore();
  };

  useEffect(() => {
    setCanLoadMore(comments.length < topLevelCount);
  }, [comments.length, topLevelCount]);

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({allCommentCount})</h3>
      {session && <CommentInput blogId={blogId} authorId={session.user.id} />}
      <div className="flex flex-col mt-6 gap-4">
        {comments.map((comment: any) => (
          <CommentCard key={comment.id} comment={comment} />
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
