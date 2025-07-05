import { db } from "../lib/prisma.ts";

export async function createLikeNotificationServ(
  commentId: string,
  authorName: string,
  userId: string,
  actorId: string
) {
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
        message: `${authorName} liked your comment`,
        commentId: commentId,
        replyId: null,
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
  replyId: string,
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
        message: `${authorName} replied to your comment`,
        commentId: commentId,
        replyId: replyId,
      },
    });
  } catch (error) {
    console.error("An error occurred creating reply notification.");
    return { error: error };
  }
}

export async function fetchUnreadUserNotifications(userId: string) {
  try {
    const notifications = await db.notification.findMany({
      where: {
        userId,
        read: false,
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
          },
        },
        comment: true,
        reply: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function fetchAllUserNotifications({
  userId,
  offset = 0,
  limit = 15,
}: {
  userId: string;
  offset: number;
  limit: number;
}) {
  try {
    const [notifications, totalCount] = await Promise.all([
      db.notification.findMany({
        where: { userId },
        include: {
          actor: {
            select: {
              id: true,
              username: true,
            },
          },
          comment: true,
          reply: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      db.notification.count({
        where: { userId },
      }),
    ]);

    const canLoadMore = offset + limit < totalCount;

    return { notifications, canLoadMore };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationReadServ(id: string) {
  try {
    const result = await db.notification.update({
      where: { id },
      data: {
        read: true,
      },
    });
    return Response.json(result);
  } catch (error) {
    console.error("Failed to mark notification as read in db: ", error);
    return Response.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

export async function markAllNotificationsAsReadServ(userId: string) {
  try {
    const result = await db.notification.updateMany({
      where: { userId },
      data: {
        read: true,
      },
    });
    return Response.json(result);
  } catch (error) {
    console.error("Failed to mark notification as read in db: ", error);
    return Response.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
