import { db } from "../lib/prisma.js";

export const fetchUnreadMessageCount = async () => {
  try {
    return await db.contactMessage.count({
      where: { read: false }, // assuming you have a `read` boolean field
    });
  } catch (error) {
    console.error("Failed to fetch unread count from db:", error);
    return Response.json({ error: "Failed to fetch count" }, { status: 500 });
  }
};

export const fetchMessages = async () => {
  try {
    return await db.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch messages from db:", error);
    return Response.json({ error: "Failed to fetch count" }, { status: 500 });
  }
};

export const markMessageReadInDb = async (id: string) => {
  try {
    const result = await db.$queryRawUnsafe<
      { mark_message_as_read: boolean }[]
    >(`SELECT mark_message_as_read(CAST($1 AS TEXT))`, id);
    return Response.json({ result: result });
  } catch (error) {
    console.error("Failed to mark message as read in db: ", error);
    return Response.json({ error: "Failed to mark as read" }, { status: 500 });
  }
};
