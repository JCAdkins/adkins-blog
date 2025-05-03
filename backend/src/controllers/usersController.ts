import express from "express";
import {
  createUserService,
  findUserByEmail,
  findUserByUsername,
  getAllUsers,
} from "../services/usersService.ts";

export const createNewUserController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("creating new user");
    const newUser = await createUserService(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("User creation failed:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const getAllUsersController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
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
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
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
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Error getting user by email:", err);
    res.status(500).json({ message: "Server error" });
  }
};
