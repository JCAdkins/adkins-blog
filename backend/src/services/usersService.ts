import bcrypt, { hash } from "bcryptjs";
import { db } from "../lib/prisma.js";
import fs from "fs";
import { NewUserInput } from "../models/userModel.js";
import { UUID } from "crypto";
import { Prisma } from "prisma/generated/prisma/client.js";
import { uploadAvatarToImmich } from "./immichService.js";

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

// Find user by email
export const getUserPasswordById = async (id: UUID) => {
  const user = await _findUserInDb({ where: { id } });
  return user?.password;
};

export const getUserSessions = async (id: UUID) => {
  return await db.userSession.findMany({
    where: { userId: id },
    orderBy: { lastActiveAt: "desc" },
  });
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

type UserProfileProps = {
  id: UUID;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export const updateUserProfile = async (data: UserProfileProps) => {
  console.log("Updating user profile for user ID:", data.id);
  const user = await db.user.update({
    where: { id: data.id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
    },
  });
  return user;
};

export const changeUserPassword = async ({
  id,
  currentPassword,
  newPassword,
}: {
  id: UUID;
  currentPassword: string;
  newPassword: string;
}) => {
  const password = await getUserPasswordById(id);
  if (!password) throw new Error("USER_NOT_FOUND");

  const passwordsMatch = await bcrypt.compare(currentPassword, password);
  if (!passwordsMatch) throw new Error("INVALID_PASSWORD");

  const hashedPassword = await hash(newPassword, 10);
  await updatePassword({ id, hashedPassword });
};

export const updatePassword = async ({
  id,
  hashedPassword,
}: {
  id: UUID;
  hashedPassword: string;
}) => {
  console.log("Updating user password for user ID:", id);
  const user = await db.user.update({
    where: { id: id },
    data: {
      password: hashedPassword,
    },
  });
};

type UserVisibilityProps = {
  id: UUID;
  activityVisible: boolean;
  profileVisibility: string;
};

export const updateVisibility = async (data: UserVisibilityProps) => {
  console.log("Updating user visibility for user ID:", data.id);
  const user = await db.user.update({
    where: { id: data.id },
    data: {
      activityVisible: data.activityVisible,
      profileVisibility: data.profileVisibility,
    },
  });
  return user;
};

export const updateAvatar = async (id: string, avatar: Express.Multer.File) => {
  // Upload to Immich
  const binaryData = fs.createReadStream(avatar.path);
  const assetId = await uploadAvatarToImmich(binaryData, avatar);

  if (!assetId) throw new Error("Failed to upload avatar to Immich");

  // Save assetId to user record
  const user = await db.user.update({
    where: { id },
    data: { image: assetId },
  });

  // Clean up local temp file
  fs.unlinkSync(avatar.path);

  return user;
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
