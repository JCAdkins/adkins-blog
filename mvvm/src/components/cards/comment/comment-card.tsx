"use client";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useCommentLikes } from "@/hooks/useCommentLikes"; // Keep for now; could move to context
import { CommentInput } from "../../inputs/comment-input";
import { CommentActions } from "./comment-actions";
import { arraysEqual, formatDateToShortDateTime } from "@/lib/utils";
import { memo, useState } from "react";
import { useReportModal } from "@/hooks/useReportModal";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { Button } from "@/components/ui/button";
import { useComments } from "@/contexts/comments-context";
import { BlogComment } from "@/models/blog/blogCommentModel";

interface CommentCardProps {
  comment: BlogComment;
}

export const CommentCard = memo<CommentCardProps>(
  function CommentCard({ comment }) {
    const { data: session } = useSession();
    const { open: openReport } = useReportModal();
    const { open: openConfirm } = useConfirmModal();
    const { deleteComment, loadMoreReplies, commentsById } = useComments();

    const { likes, userLiked, handleLike } = useCommentLikes(
      comment,
      session?.user?.id,
    );

    const [replyOpen, setReplyOpen] = useState(false);
    const toggleReply = () => setReplyOpen((prev) => !prev);

    const handleDelete = () => {
      openConfirm({
        title: "Delete Comment",
        description: "Are you sure? This action cannot be undone.",
        confirmText: "Delete",
        onConfirm: () => deleteComment(comment.id),
      });
    };

    const visibleChildrenIds = comment.childrenIds || [];
    const hasMoreReplies = comment.repliesCount - visibleChildrenIds.length > 0;

    return (
      <Card
        id={`comment-${comment.id}`}
        className={"bg-header py-2 px-4 text-foreground rounded-md"}
      >
        <div className="flex justify-between">
          <p className="text-sm">
            {comment.isDeleted ? "[deleted]" : comment.author?.username}
          </p>
          <p>
            {formatDateToShortDateTime(
              new Date(comment.createdAt).toLocaleString(),
            )}
          </p>
        </div>

        <p>{comment.isDeleted ? "[DELETED]" : comment.content}</p>

        <CommentActions
          comment={comment}
          sessionUserId={session?.user?.id}
          likes={likes}
          userLiked={userLiked}
          onLike={handleLike}
          onReplyClick={toggleReply}
          onDelete={handleDelete}
          onReport={() => openReport(comment.id)}
        />

        {replyOpen && (
          <CommentInput
            blogId={comment.postId}
            authorId={comment.author?.id || ""}
            parentId={comment.id}
            closeReply={toggleReply}
          />
        )}

        {visibleChildrenIds.length > 0 && (
          <div className="flex flex-col gap-4 border-l pl-4">
            {visibleChildrenIds.map((childId: string) => {
              const child = commentsById[childId];
              return child ? (
                <CommentCard key={childId} comment={child} />
              ) : null;
            })}
          </div>
        )}

        {hasMoreReplies && (
          <div className="flex w-full mx-auto justify-center">
            <Button
              size="xs"
              onClick={() => loadMoreReplies(comment.id)}
              className="text-sm cursor-pointer"
            >
              Load {comment.repliesCount - visibleChildrenIds.length} more
              replies
            </Button>
          </div>
        )}
      </Card>
    );
  },
  (prev, next) => {
    // Fast path: same comment id + same highlight
    if (prev.comment.id !== next.comment.id) {
      return false;
    }

    // Compare only fields that actually affect rendering
    const p = prev.comment;
    const n = next.comment;

    return (
      p.content === n.content &&
      p.isDeleted === n.isDeleted &&
      p.createdAt === n.createdAt &&
      p.repliesCount === n.repliesCount &&
      p.hasMore === n.hasMore &&
      // Critical for preserving open/closed state of nested replies
      arraysEqual(p.childrenIds, n.childrenIds)
    );
  },
);
