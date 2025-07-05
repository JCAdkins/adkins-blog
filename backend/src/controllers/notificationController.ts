import {
  createLikeNotificationServ,
  createReplyNotificationServ,
  fetchUnreadUserNotifications,
  fetchAllUserNotifications,
  markNotificationReadServ,
  markAllNotificationsAsReadServ,
} from "../services/notificationService.ts";

import express from "express";

export async function createLikeNotification(
  req: express.Request,
  res: express.Response
) {
  const { commentId, authorName, userId, actorId } = req.body;
  if (!commentId || !authorName || !userId || !actorId) {
    res.status(400).json({
      error:
        "Comment ID, Author Name, UserId, and ActorId are required. One or more were missing.",
    });
    return;
  }
  try {
    const data = await createLikeNotificationServ(
      commentId as string,
      authorName as string,
      userId as string,
      actorId as string
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating like notification: ", error);
    res.status(500).json(error);
  }
}

export async function createReplyNotification(
  req: express.Request,
  res: express.Response
) {
  const { commentId, replyId, authorName, userId, actorId } = req.body;
  if (!commentId || !replyId || !authorName || !userId || !actorId) {
    res.status(400).json({
      error:
        "Comment ID, Reply ID, Author Name, UserId, and ActorId are required. One or more were missing.",
    });
    return;
  }
  try {
    const data = await createReplyNotificationServ(
      commentId as string,
      replyId as string,
      authorName as string,
      userId as string,
      actorId as string
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating reply notification: ", error);
    res.status(500).json(error);
  }
}

export async function getUnreadUserNotifications(
  req: express.Request,
  res: express.Response
) {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ error: "User ID was not included." });
      return;
    }

    const result = await fetchUnreadUserNotifications(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch replies", error);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
}

export async function getAllUserNotifications(
  req: express.Request,
  res: express.Response
) {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ error: "User ID was not included." });
      return;
    }

    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 15;

    const result = await fetchAllUserNotifications({ userId, offset, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
}

export async function markNotificationAsRead(
  req: express.Request,
  res: express.Response
) {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ error: "Notification ID was not included." });
    return;
  }
  try {
    const result = await markNotificationReadServ(id);
    const data = await result.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to mark notification as read: ", error);
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
}

export async function markAllNotificationsAsRead(
  req: express.Request,
  res: express.Response
) {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ error: "User ID was not included." });
    return;
  }
  try {
    const result = await markAllNotificationsAsReadServ(id);
    const data = await result.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to mark notification as read: ", error);
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
}
