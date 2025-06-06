import {
  getAllMessages,
  getUnreadMessageCount,
  markMsgAsRead,
} from "../services/messagesService.ts";
import express from "express";

export async function unreadMessageCount(
  _req: express.Request,
  res: express.Response
) {
  try {
    const count = await getUnreadMessageCount();
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching unread message count: ", error);
    res.status(500).json(error);
  }
}

export async function fetchAllMessages(
  _req: express.Request,
  res: express.Response
) {
  try {
    const messages = await getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages: ", error);
    res.status(500).json(error);
  }
}

export async function markMessageAsRead(
  req: express.Request,
  res: express.Response
) {
  const { id } = req.body;
  console.log("id: ", id);
  if (!id) {
    return res
      .status(400)
      .json({ error: "No id was included in the request." });
  }
  try {
    const result = await markMsgAsRead(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error marking message as read: ", error);
    res.status(500).json(error);
  }
}
