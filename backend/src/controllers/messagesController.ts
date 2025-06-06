import {
  getAllMessages,
  getUnreadMessageCount,
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
