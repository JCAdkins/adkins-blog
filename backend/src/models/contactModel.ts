import { db } from "../lib/prisma.js"; // adjust based on your DB client

export const getAdminListFromDb = async (): Promise<string[]> => {
  try {
    const admins = await db.user.findMany({
      where: {
        role: "admin",
      },
      select: {
        email: true,
      },
    });

    return admins.map((admin) => admin.email);
  } catch (error) {
    console.error("Error fetching admin list:", error);
    return [];
  }
};

interface DataParams {
  name: string;
  email: string;
  userId: string;
  subject: string;
  message: string;
}

export const saveContactMessageToDb = async (data: DataParams) => {
  try {
    const newMessage = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        userId: data.userId ?? null, // attach if exists, else leave null
      },
    });

    return { newMessage };
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }
};
