import { useState } from "react";
import { fetchRepliesForComment } from "@/lib/db/queries";
import { BlogComment } from "next-auth";

export function useReplies(comment: BlogComment) {
  const [visibleReplies, setVisibleReplies] = useState(comment.replies || []);
  const [replyPage, setReplyPage] = useState(0);
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.hasMore);
  const [localRepliesCount, setLocalRepliesCount] = useState(
    comment.repliesCount || 0,
  );

  const handleNewReply = (newComment: BlogComment) => {
    setVisibleReplies((prev) => {
      const updated = [...prev, newComment].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      return updated;
    });
    setLocalRepliesCount((prev) => prev + 1);
  };

  const loadMoreReplies = async () => {
    const nextPage = replyPage + 1;
    try {
      const data = await fetchRepliesForComment(comment.id, nextPage);
      setVisibleReplies((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        return [
          ...prev,
          ...data.repliesWithCounts.filter(
            (r: BlogComment) => !existingIds.has(r.id),
          ),
        ].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
      setReplyPage(nextPage);
      if (!data.hasMore) setHasMoreReplies(false);
    } catch (err) {
      console.error("Failed to load more replies", err);
    }
  };

  return { visibleReplies, hasMoreReplies, handleNewReply, loadMoreReplies };
}
