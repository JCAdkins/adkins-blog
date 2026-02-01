import bcrypt, { hash } from "bcryptjs";
import { db } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { NewUserInput } from "../models/userModel.js";

export const createUserService = async (userData: NewUserInput) => {
  const hashedPassword = await hash(userData.password, 10);
  return await db.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      role: userData.role,
      first_name: userData.first_name ?? "",
      last_name: userData.last_name ?? "",
    },
  });
};

const _findUserInDb = async (args: {
  where: Prisma.UserWhereUniqueInput;
  include?: Prisma.UserInclude;
}) => {
  const user = await db.user.findUnique(args);
  return user;
};

// Find user by email
export const findUserByEmail = async (email: string, include = false) => {
  let user;
  if (include)
    user = await _findUserInDb({
      where: { email },
      include: {
        Comment: true,
        contactMessages: true,
        Like: true,
        receivedNotifications: true,
        sentNotifications: true,
      },
    });
  else user = await _findUserInDb({ where: { email } });
  return user;
};

// Find user by email
export const findUserByUsername = async (username: string, include = false) => {
  let user;
  if (include)
    user = await _findUserInDb({
      where: { username },
      include: {
        Comment: true,
        contactMessages: true,
        Like: true,
        receivedNotifications: true,
        sentNotifications: true,
      },
    });
  else user = await _findUserInDb({ where: { username } });
  return user;
};

export const getAllUsers = async () => {
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
    },
  });
  return users;
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
