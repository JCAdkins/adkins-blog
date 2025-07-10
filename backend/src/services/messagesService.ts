import {
  fetchMessages,
  fetchUnreadMessageCount,
  markMessageReadInDb,
} from "../models/messagesModel.js";

export async function getUnreadMessageCount() {
  const count = await fetchUnreadMessageCount();
  return count;
}

export async function getAllMessages() {
  const messages = await fetchMessages();
  return messages;
}

export async function markMsgAsRead(id: string) {
  const result = await markMessageReadInDb(id);
  return result;
}
