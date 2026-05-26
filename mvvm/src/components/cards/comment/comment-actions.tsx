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
  canInteract = false,
}: {
  comment: any;
  sessionUserId?: string;
  userLiked: boolean;
  likes: number;
  onLike: () => void;
  onReplyClick: () => void;
  onDelete: () => void;
  onReport: (id: string) => void;
  canInteract?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Button
        className="bg-transparent hover:bg-transparent dark:hover:bg-login-hover"
        size="xs"
        onClick={onLike}
        disabled={comment.isDeleted || !sessionUserId || !canInteract}
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
        <Button
          className="bg-transparent hover:bg-transparent dark:hover:bg-login-hover"
          size="xs"
          onClick={onReplyClick}
          disabled={!canInteract}
        >
          Reply
        </Button>
      )}

      {sessionUserId && comment.authorId !== sessionUserId && (
        <Button
          className="bg-transparent hover:bg-transparent dark:hover:bg-login-hover"
          size="xs"
          onClick={() => onReport(comment.id)}
        >
          <FlagIcon />
        </Button>
      )}

      {sessionUserId && comment.authorId === sessionUserId && (
        <Button
          className="bg-transparent hover:bg-transparent dark:hover:bg-login-hover"
          size="xs"
          onClick={onDelete}
        >
          <TrashIcon />
        </Button>
      )}
    </div>
  );
}
