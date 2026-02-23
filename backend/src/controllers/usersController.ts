import express from "express";
import {
  createUserService,
  findUserByEmail,
  findUserByUsername,
  getAllUsers,
  getUserSessions,
  updateAvatar,
  updateUserLastLogin,
  updateUserProfile,
  updateVisibility,
  changeUserPassword,
} from "../services/usersService.js";
import { userSchema } from "../schemas/validation.js";
import { ZodError } from "zod";
import { UUID } from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.NEXT_AUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

// ================= GET =======================

export const getMeController = async (
  req: express.Request,
  res: express.Response,
) => {
  console.log("inside controller");
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const user = await findUserByEmail(decoded.email);
    const sessions = await getUserSessions(decoded.id);
    res.json({ ...user, sessions: sessions });
  } catch (err) {
    console.error("Error getting user data:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/
export const getAllUsersController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.log("Error getting the users.");
    res.status(500).json({ message: "There was a problem getting the users." });
  }
};

// GET /api/users/email/:email
export const getUserByEmailController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const email = req.params.email;
    const includeParam = req.params.include;
    const include = includeParam === "true";

    console.log("include: ", include);
    const user = await findUserByEmail(email, include);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting user by email:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/user/:username
export const getUserByUsernameController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const username = req.params.username;
    const includeParam = req.params.include;
    const include = includeParam === "true";

    const user = await findUserByUsername(username, include);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting user by email:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============== PATCH =======================

export const updateUserController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const data = req.body;
    console.log("data: ", data);
    if (!data.id || !data.username || !data.email) {
      res.status(400).json({ message: "Missing request data" });
      return;
    }

    const user = await updateUserProfile(data);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating users profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserPassword = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    if (!id || !currentPassword || !newPassword) {
      res.status(400).json({ message: "Missing request data" });
      return;
    }

    await changeUserPassword({ id, currentPassword, newPassword });
    res.status(200).json({ message: "Password update successful" });
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "User not found." });
    } else if (err.message === "INVALID_PASSWORD") {
      res.status(401).json({ message: "Current password is incorrect." });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const updateUserVisibility = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const data = req.body;
    if (!data.id || !data.activityVisible || !data.profileVisibility) {
      res.status(400).json({ message: "Missing request data" });
      return;
    }

    const user = await updateVisibility(data);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating users visibility:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserAvatar = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.body;
    const avatar = req.file;

    if (!id || !avatar) {
      res.status(400).json({ message: "Missing request data" });
      return;
    }

    const user = await updateAvatar(id, avatar);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating avatar:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =============== POST ======================

export const createNewUserController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    console.log("creating new user...");
    const validatedData = userSchema.parse(req.body);

    const newUser = await createUserService(validatedData);

    res.status(201).json(newUser);
  } catch (error) {
    console.error("User creation failed:", error);
    if (error instanceof ZodError) {
      // Handle validation errors
      res.status(400).json({ errors: error.errors });
      return;
    }

    res.status(500).json({ error: "Failed to create user" });
  }
};

export const loginUserController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { userId } = req.body;
    await updateUserLastLogin(userId as UUID);
    res.status(200).json({ message: "User login time updated." });
  } catch (err) {
    console.error("Error updating users login:", err);
    res.status(500).json({ message: "Server error" });
  }
};
