import bcrypt, { hash } from "bcryptjs";
import { db } from "../lib/prisma.js";
import { NewUserInput } from "../models/userModel.js";
import { UUID } from "crypto";
import { Prisma } from "prisma/generated/prisma/client.js";

export const createUserService = async (userData: NewUserInput) => {
  const hashedPassword = await hash(userData.password, 10);
  return await db.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      role: userData.role,
      firstName: userData.firstName ?? "",
      lastName: userData.lastName ?? "",
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
        comments: true,
        contactMessages: true,
        likes: true,
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
        comments: true,
        contactMessages: true,
        likes: true,
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
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

export const updateUserLastLogin = async (userId: UUID) => {
  console.log("Updating last login for user ID:", userId);
  await db.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
