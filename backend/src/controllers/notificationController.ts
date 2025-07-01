import {
  createLikeNotificationServ,
  createReplyNotificationServ,
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
