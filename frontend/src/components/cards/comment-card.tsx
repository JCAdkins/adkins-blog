"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommentInput } from "../inputs/comment-input";
import { Comment } from "next-auth";
import { useComments } from "@/contexts/comments-context";
import { hardDeleteComment, softDeleteComment } from "@/lib/db/queries";
import { ConfirmDeleteModal } from "../modals/confirm-delete-modal";

export const CommentCard = ({ comment }: { comment: Comment }) => {
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [reply, setReply] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { refreshComments } = useComments();
  const { data: session } = useSession();

  const handleLike = async () => {
    try {
      await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
      setLikes((l: number) => l + 1);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleReplyClicked = () => setReply((prev) => !prev);
  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    !comment.replies || comment.replies.length === 0
      ? await hardDeleteComment(comment.id)
      : await softDeleteComment(comment.id);
    refreshComments();
  };

  const handleEdit = () => console.log("edit button clicked");

  return (
    <Card className="mb-4 p-4 bg-header text-foreground rounded-md">
      <div className="flex justify-between">
        <p className="text-sm font-medium mb-2">
          {comment.isDeleted ? "[deleted]" : comment.author?.username}
        </p>
        <p>{new Date(comment.createdAt).toLocaleString()}</p>
      </div>
      <p className="bg-header p-2">
        {comment.isDeleted ? "[DELETED]" : comment.content}
      </p>
      <div className="mt-2 flex gap-4">
        <Button
          className="hover:cursor-pointer"
          size="sm"
          variant="ghost"
          onClick={handleLike}
        >
          👍 {likes}
        </Button>
        {session && (
          <Button className="" size="sm" onClick={handleReplyClicked}>
            Reply
          </Button>
        )}
        {session && comment.authorId === session.user.id && (
          <Button className="" size="sm" onClick={handleEdit}>
            Edit
          </Button>
        )}
        {session && comment.authorId === session.user.id && (
          <>
            <Button className="" size="sm" onClick={handleDelete}>
              Delete
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
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-4 mt-4 bg-header border-l pl-4 space-y-4">
          {comment.replies.map((reply: any) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </Card>
  );
};
