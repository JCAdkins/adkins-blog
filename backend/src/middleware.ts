// src/middleware/verifyToken.ts
import express from "express";
import jwt from "jsonwebtoken";

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
  next: express.NextFunction
): void => {
  const authHeader = req.headers.authorization;

  console.log("authHeader: ", authHeader);
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
