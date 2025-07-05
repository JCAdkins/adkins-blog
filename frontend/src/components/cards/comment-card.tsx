"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommentInput } from "../inputs/comment-input";
import { useComments } from "@/contexts/comments-context";
import {
  likeComment,
  fetchRepliesForComment,
  createLikeNotification,
  deleteComment,
} from "@/lib/db/queries";
import { ConfirmDeleteModal } from "../modals/confirm-delete-modal";
import { ThumbUpIcon, TrashIcon } from "../ui/icons";
import { BlogComment } from "next-auth";
import { Like } from "next-auth";
import { PlusCircleIcon } from "lucide-react";
import { cn, formatDateToShortDateTime } from "@/lib/utils";

export const CommentCard = ({
  comment,
  highlightedCommentId,
}: {
  comment: BlogComment;
  highlightedCommentId?: string;
}) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [reply, setReply] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(comment.replies || []);
  const [hasMoreReplies, setHasMoreReplies] = useState(
    (comment.repliesCount || 0) > (comment.replies?.length || 0)
  );
  const [replyPage, setReplyPage] = useState(0);
  const isHighlighted = comment.id === highlightedCommentId;

  const { refreshComments } = useComments();

  useEffect(() => {
    if (session?.user?.id && comment.likes) {
      const liked = comment.likes.some(
        (like: Like) => like.userId === session.user.id
      );
      setUserLiked(liked);
    }
  }, [session?.user?.id, comment.likes]);

  const handleLike = async () => {
    try {
      const res = await likeComment(
        comment.id,
        comment.authorId,
        session?.user?.id!
      );
      if (comment.authorId != session?.user?.id)
        await createLikeNotification({
          commentId: comment.id,
          authorName: session?.user.username as string,
          userId: comment.authorId,
          actorId: session?.user.id as string,
        });
      res.liked
        ? setLikes((l: number) => l + 1)
        : setLikes((l: number) => l - 1);
      setUserLiked((prev) => !prev);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // Opens and closes reply text field
  const handleReplyClicked = () => setReply((prev) => !prev);

  const confirmDelete = async () => {
    setShowConfirm(false);
    if (!comment.replies || comment.replies.length === 0)
      await deleteComment(comment.id, "true");
    else await deleteComment(comment.id, "false");
    refreshComments();
  };

  const loadMoreReplies = async () => {
    const nextPage = replyPage + 1;
    try {
      const data = await fetchRepliesForComment(comment.id, nextPage);

      setVisibleReplies((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const filteredNew = data.repliesWithCounts.filter(
          (r: BlogComment) => !existingIds.has(r.id)
        );
        return [...prev, ...filteredNew];
      });

      setReplyPage(nextPage);
      if (!data.hasMore) setHasMoreReplies(false);
    } catch (err) {
      console.error("Failed to load more replies", err);
    }
  };

  return (
    <Card
      id={`comment-${comment.id}`}
      className={cn(
        "py-2 px-4 bg-header text-foreground rounded-md",
        isHighlighted && "bg-yellow-100 ring-2 ring-header"
      )}
    >
      <div className="flex justify-between">
        <p className="text-sm font-xs">
          {comment.isDeleted ? "[deleted]" : comment.author?.username}
        </p>
        <p className="text-end">
          {formatDateToShortDateTime(
            new Date(comment.createdAt).toLocaleString()
          )}
        </p>
      </div>

      <p className="">{comment.isDeleted ? "[DELETED]" : comment.content}</p>

      <div className="flex gap-2">
        <Button
          className="cursor-pointer hover:scale-[1.05]"
          size="xs"
          onClick={handleLike}
          disabled={comment.isDeleted || !session?.user}
        >
          {userLiked ? (
            <>👍 {likes}</>
          ) : (
            <>
              <ThumbUpIcon size={12} />
              {likes}
            </>
          )}
        </Button>

        {session && (
          <Button size="xs" onClick={handleReplyClicked}>
            Reply
          </Button>
        )}
        {session && comment.authorId === session.user.id && (
          <>
            <Button
              className="hover:scale-[1.05]"
              size="xs"
              onClick={() => setShowConfirm(true)}
            >
              <TrashIcon />
            </Button>
            <ConfirmDeleteModal
              isOpen={showConfirm}
              onCancel={() => setShowConfirm(false)}
              onConfirm={confirmDelete}
            />
          </>
        )}
      </div>
      {reply && (
        <CommentInput
          blogId={comment.postId}
          authorId={comment.author.id}
          parentId={comment.id}
          closeReply={handleReplyClicked}
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
            replies
          </Button>
        </div>
      )}
    </Card>
  );
};
