import { db } from "../lib/prisma.ts";

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
