"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReplyNotification, postNewComment } from "@/lib/db/queries";
import { useComments } from "@/contexts/comments-context";
import { BlogComment } from "next-auth";

export const CommentInput = ({
  blogId,
  authorId,
  parentId,
  closeReply,
  onCommentPosted,
}: {
  blogId: string;
  authorId: string;
  parentId?: string;
  closeReply?: () => void;
  onCommentPosted?: (comment: BlogComment) => void;
}) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const { refreshComments } = useComments();

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    if (!content.trim()) return;

    try {
      const newComment = await postNewComment({
        content,
        blogId,
        authorId: session.user.id,
        parentId,
      });
      // If the reply is not to a users own comment/reply create a notification
      if (authorId !== session.user.id)
        createReplyNotification({
          commentId: parentId as string,
          replyId: newComment.id,
          authorName: session.user.username,
          userId: authorId,
          actorId: session.user.id,
        });

      if (parentId && onCommentPosted) {
        onCommentPosted(newComment);
      }

      setContent("");
      refreshComments();
      if (closeReply) closeReply();
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return session ? (
    <div className="flex flex-col items-end w-full gap-2">
      <Input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="w-full"
      />
      <Button size="sm" onClick={handleSubmit} className="hover:bg-login">
        Submit
      </Button>
    </div>
  ) : (
    <p className="text-sm text-gray-600">You must be signed in to comment.</p>
  );
};
