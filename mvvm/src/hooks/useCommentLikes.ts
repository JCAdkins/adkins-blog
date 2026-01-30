import { useState, useEffect } from "react";
import { likeComment, createLikeNotification } from "@/lib/db/queries";
import { Like, BlogComment } from "next-auth";

export function useCommentLikes(comment: BlogComment, userId?: string) {
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    if (userId && comment.likes) {
      setUserLiked(comment.likes.some((like: Like) => like.userId === userId));
    }
  }, [userId, comment.likes]);

  const handleLike = async () => {
    if (!userId) return;
    try {
      const res = await likeComment(comment.id, comment.authorId, userId);
      if (comment.authorId !== userId)
        await createLikeNotification({
          commentId: comment.id,
          authorName: comment.author?.username as string,
          userId: comment.authorId,
          actorId: userId,
        });

      res.liked ? setLikes((l) => l + 1) : setLikes((l) => l - 1);
      setUserLiked((prev) => !prev);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  return { likes, userLiked, handleLike };
}
