// src/middleware/verifyToken.ts
import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { db } from "./lib/prisma.js";

const JWT_SECRET = process.env.NEXT_AUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

export interface AuthenticatedRequest extends express.Request {
  user?: any;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};

export const requireVerifiedUser = async (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized: Missing user" });
    return;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isVerified: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({
        error: "Please verify your email before commenting, replying, or liking comments.",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("Failed to check account verification:", err);
    res.status(500).json({ error: "Failed to verify account status" });
  }
};
