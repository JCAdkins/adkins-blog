"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CommentCard = ({ comment }: { comment: any }) => {
  const [likes, setLikes] = useState(comment.likes?.length || 0);

  const handleLike = async () => {
    try {
      await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
      setLikes((l: number) => l + 1);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  return (
    <Card className="mb-4 p-4 bg-header text-foreground rounded-md">
      <div className="flex justify-between">
        <p className="text-sm font-medium mb-2">{comment.author?.username}</p>
        <p>{new Date(comment.createdAt).toLocaleString()}</p>
      </div>
      <p className="bg-header p-2">{comment.content}</p>
      <div className="mt-2 flex gap-4">
        <Button
          className="hover:cursor-pointer"
          size="sm"
          variant="ghost"
          onClick={handleLike}
        >
          👍 {likes}
        </Button>
      </div>
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
