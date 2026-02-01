"use client";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useCommentLikes } from "@/hooks/useCommentLikes";
import { useReplies } from "@/hooks/useReplies";
import { CommentInput } from "../../inputs/comment-input";
import { CommentActions } from "./comment-actions";
import { formatDateToShortDateTime } from "@/lib/utils";
import { useState } from "react";
import { useReportModal } from "@/hooks/useReportModal";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/lib/db/queries";
import { useComments } from "@/contexts/comments-context";

export const CommentCard = ({
  comment,
  highlightedCommentId,
}: {
  comment: any;
  highlightedCommentId?: string;
}) => {
  const { data: session } = useSession();
  const { open: openReport } = useReportModal();
  const { open: openConfirm } = useConfirmModal();
  const isHighlighted = comment.id === highlightedCommentId;
  const { refreshComments } = useComments();

  const { likes, userLiked, handleLike } = useCommentLikes(
    comment,
    session?.user?.id,
  );
  const { visibleReplies, hasMoreReplies, handleNewReply, loadMoreReplies } =
    useReplies(comment);

  const [replyOpen, setReplyOpen] = useState(false);
  const toggleReply = () => setReplyOpen((prev) => !prev);

  async function confirmDelete(): Promise<void> {
    if (comment.repliesCount === 0) await deleteComment(comment.id, "true");
    else await deleteComment(comment.id, "false");
    refreshComments();
  }

  return (
    <Card
      id={`comment-${comment.id}`}
      className={`py-2 px-4 bg-header text-foreground rounded-md ${isHighlighted ? "bg-yellow-100 ring-2 ring-header" : ""}`}
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
        onDelete={() =>
          openConfirm({
            title: "Delete Comment",
            description: "Are you sure? This action cannot be undone.",
            confirmText: "Delete",
            onConfirm: confirmDelete,
          })
        }
        onReport={() => openReport(comment.id)}
      />

      {replyOpen && (
        <CommentInput
          blogId={comment.postId}
          authorId={comment.author?.id}
          parentId={comment.id}
          closeReply={toggleReply}
          onCommentPosted={handleNewReply}
        />
      )}

      {visibleReplies.length > 0 && (
        <div className="flex flex-col gap-4 border-l pl-4">
          {visibleReplies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              highlightedCommentId={highlightedCommentId}
            />
          ))}
        </div>
      )}

      {hasMoreReplies && (
        <div className="flex w-full mx-auto justify-center">
          <Button
            size="xs"
            onClick={loadMoreReplies}
            className="text-sm cursor-pointer"
          >
            <PlusCircleIcon />
            {comment.repliesCount - (visibleReplies.length ?? 0)} replies
          </Button>
        </div>
      )}
    </Card>
  );
};
