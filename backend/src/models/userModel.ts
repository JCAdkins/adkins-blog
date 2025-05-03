import { db } from "../lib/prisma.ts"; // adjust based on your DB client
// import { Prisma, User } from "@prisma/client"; // or your custom type
import User, { Prisma } from "@prisma/client";

interface NewUser {
  email: string;
  username: string;
  password: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

export const getAllUsersInDb = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      first_name: true,
      last_name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // password: false, // Omit this by simply not including it
    },
  });
  return users;
  // ();
};

export const createUserInDb = async (userData: NewUser): Promise<NewUser> => {
  // Example using Prisma ORM:
  return await db.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      role: userData.role,
      first_name: userData.first_name ?? "",
      last_name: userData.last_name ?? "",
    },
  });
};

export const findUserInDb = async (args: {
  where: Prisma.UserWhereUniqueInput;
}) => {
  console.log("args: ", args);
  const user = await db.user.findUnique(args);
  console.log("user: ", user);
  return user;
};
