import {
  fetchMessages,
  fetchUnreadMessageCount,
} from "../models/messagesModel.ts";

export async function getUnreadMessageCount() {
  const count = await fetchUnreadMessageCount();
  return count;
}

export async function getAllMessages() {
  const messages = await fetchMessages();
  return messages;
}
