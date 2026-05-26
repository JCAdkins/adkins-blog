"use client";

import { Button } from "@/components/ui/button";
import { ThumbUpIcon, TrashIcon } from "../../ui/icons";
import { FlagIcon } from "lucide-react";
import { toast } from "sonner";

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
  const handleUnverifiedClick = () => {
    toast.warning("Please verify your email address to like and reply to comments.", {
      description: "Check your inbox for the verification link.",
    });
  };

  const handleLike = () => {
    if (!canInteract) {
      handleUnverifiedClick();
      return;
    }
    onLike();
  };

  const handleReply = () => {
    if (!canInteract) {
      handleUnverifiedClick();
      return;
    }
    onReplyClick();
  };

  return (
    <div className="flex gap-2">
      <Button
        className="bg-transparent hover:bg-transparent dark:hover:bg-login-hover"
        size="xs"
        onClick={handleLike}
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
        <Button
          className="bg-transparent hover:bg-transparent dark:hover:bg-login-hover"
          size="xs"
          onClick={handleReply}
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
