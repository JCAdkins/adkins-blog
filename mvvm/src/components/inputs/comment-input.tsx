// src/components/inputs/comment-input.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReplyNotification, postNewComment } from "@/lib/db/queries";
import { useComments } from "@/contexts/comments-context";

export const CommentInput = ({
  blogId,
  authorId,
  parentId,
  closeReply,
}: {
  blogId: string;
  authorId: string;
  parentId?: string;
  closeReply?: () => void;
}) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const { addComment } = useComments();

  const handleSubmit = async () => {
    if (!session?.user?.id || !content.trim()) return;

    try {
      const newComment = await postNewComment({
        content,
        blogId,
        authorId: session.user.id,
        parentId,
      });
      addComment(newComment); // Update context

      if (authorId !== session.user.id && parentId) {
        createReplyNotification({
          commentId: parentId,
          replyId: newComment.id,
          authorName: session.user.username,
          userId: authorId,
          actorId: session.user.id,
        });
      }

      setContent("");
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
