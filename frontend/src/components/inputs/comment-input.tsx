"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postNewComment } from "@/lib/db/queries";

export const CommentInput = ({
  blogId,
  authorId,
  parentId,
}: {
  blogId: string;
  authorId: string;
  parentId?: string;
}) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    if (!content.trim()) return;

    try {
      await postNewComment({ content, blogId, authorId, parentId });
      setContent("");
      // Optionally trigger comment reload
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
      <Button size="sm" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  ) : (
    <p className="text-sm text-gray-600">You must be signed in to comment.</p>
  );
};
