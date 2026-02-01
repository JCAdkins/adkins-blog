"use client";

import { Button } from "@/components/ui/button";
import { ThumbUpIcon, TrashIcon } from "../../ui/icons";
import { FlagIcon } from "lucide-react";

export function CommentActions({
  comment,
  sessionUserId,
  userLiked,
  likes,
  onLike,
  onReplyClick,
  onDelete,
  onReport,
}: {
  comment: any;
  sessionUserId?: string;
  userLiked: boolean;
  likes: number;
  onLike: () => void;
  onReplyClick: () => void;
  onDelete: () => void;
  onReport: (id: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        size="xs"
        onClick={onLike}
        disabled={comment.isDeleted || !sessionUserId}
      >
        {userLiked ? (
          <>👍 {likes}</>
        ) : (
          <>
            <ThumbUpIcon size={12} /> {likes}
          </>
        )}
      </Button>

      {sessionUserId && (
        <Button size="xs" onClick={onReplyClick}>
          Reply
        </Button>
      )}

      {sessionUserId && comment.authorId !== sessionUserId && (
        <Button size="xs" onClick={() => onReport(comment.id)}>
          <FlagIcon />
        </Button>
      )}

      {sessionUserId && comment.authorId === sessionUserId && (
        <Button size="xs" onClick={onDelete}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
}
