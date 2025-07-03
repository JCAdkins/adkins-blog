import {
  createLikeNotificationServ,
  createReplyNotificationServ,
  fetchUnreadUserNotifications,
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
  const { commentId, authorName, userId, actorId } = req.body;
  if (!commentId || !authorName || !userId || !actorId) {
    res.status(400).json({
      error:
        "Comment ID, Author Name, UserId, and ActorId are required. One or more were missing.",
    });
    return;
  }
  try {
    const data = await createReplyNotificationServ(
      commentId as string,
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

export async function getUserNotifications(
  req: express.Request,
  res: express.Response
) {
  try {
    const userId = req.params.userId;
    console.log("userId: ", userId);
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
