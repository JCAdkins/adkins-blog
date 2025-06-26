"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { CommentCard } from "../cards/comment-card";
import { CommentInput } from "../inputs/comment-input";
import { useComments } from "@/contexts/comments-context";
import { Spinner } from "@radix-ui/themes";

export const CommentsSection = ({ blogId }: { blogId: string }) => {
  const { comments, totalCount, loadMore } = useComments();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleLoadMore = async () => {
    setLoading(true);
    loadMore();
    setLoading(false);
  };

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({totalCount})</h3>
      {session && <CommentInput blogId={blogId} authorId={session.user.id} />}
      <div className="flex flex-col mt-6 gap-4">
        {comments.map((comment: any) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        {loading || (!comments && <Spinner />)}
        {!loading && <button onClick={handleLoadMore}>Load more</button>}
      </div>
    </section>
  );
};
