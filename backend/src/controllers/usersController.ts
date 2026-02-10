import express from "express";
import {
  createUserService,
  findUserByEmail,
  findUserByUsername,
  getAllUsers,
  updateUserLastLogin,
} from "../services/usersService.js";
import { verifyPassword } from "../services/usersService.js";
import { userSchema } from "../schemas/validation.js";
import { ZodError } from "zod";
import { UUID } from "crypto";

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

// GET /api/users/email/:email
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

export const loginUserController = async (
  req: express.Request,
  res: express.Response,
) => {
  const { userId } = req.body;
  await updateUserLastLogin(userId as UUID);
  res.status(200).json({ message: "User login time updated." });
};
