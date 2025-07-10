import express from "express";
import {
  createUserService,
  findUserByEmail,
  findUserByUsername,
  getAllUsers,
} from "../services/usersService.js";
import { verifyPassword } from "../models/userModel.js";
import { userSchema } from "../schemas/validation.js";
import { ZodError } from "zod";

export const createNewUserController = async (
  req: express.Request,
  res: express.Response
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
  res: express.Response
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
  res: express.Response
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
  res: express.Response
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
  res: express.Response
) => {
  console.log("attempting to log in");
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    console.log("login successful.");
    // Optionally generate a session or token here
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong during login." });
  }
};
