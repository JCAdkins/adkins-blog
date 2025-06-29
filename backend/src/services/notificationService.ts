import { db } from "../lib/prisma.ts";

export async function createLikeNotificationServ(
  commentId: string,
  authorName: string,
  userId: string,
  actorId: string
) {
  console.log("userId: ", userId);
  try {
    const exists = await db.notification.findFirst({
      where: {
        type: "LIKE",
        userId,
        actorId,
        commentId,
      },
    });

    if (exists) {
      const response = await db.notification.delete({
        where: {
          id: exists.id,
        },
      });
      return { ...response, operation: "DELETE" };
    }
    const response = await db.notification.create({
      data: {
        userId: userId,
        actorId: actorId,
        type: "LIKE",
        message: `${authorName} liked your comment.`,
        commentId: commentId,
      },
    });
    return { ...response, operation: "CREATE" };
  } catch (error) {
    console.error("An error occurred creating like notification.");
    return { error: error };
  }
}

export async function createReplyNotificationServ(
  commentId: string,
  authorName: string,
  userId: string,
  actorId: string
) {
  try {
    return await db.notification.create({
      data: {
        userId: userId,
        actorId: actorId,
        type: "REPLY",
        message: `${authorName} replied to your comment.`,
        commentId: commentId,
      },
    });
  } catch (error) {
    console.error("An error occurred creating reply notification.");
    return { error: error };
  }
}
