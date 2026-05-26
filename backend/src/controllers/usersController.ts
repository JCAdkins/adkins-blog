import express from "express";
import {
  createUserService,
  deleteAllOtherSessions,
  deleteSession,
  findUserByEmail,
  findUserByUsername,
  getAllUsers,
  getUserSessions,
  updateAvatar,
  updateUserLastLogin,
  updateUserProfile,
  updateVisibility,
  changeUserPassword,
  deactivateOtherSessions,
  createUserSession,
  createPasswordResetToken,
  consumePasswordResetToken,
  createVerificationToken,
  verifyAccountToken,
  deleteExpiredUnverifiedUsers,
} from "../services/usersService.js";
import {
  passwordResetEmail,
  verificationEmail,
  welcomeNewUserEmail,
} from "../services/contactService.js";
import { userSchema } from "../schemas/validation.js";
import { ZodError } from "zod";
import { UUID } from "crypto";
import "dotenv/config";
import { AuthenticatedRequest } from "../middleware.js";

const JWT_SECRET = process.env.NEXT_AUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

// ── Cleanup job: runs every hour, deletes expired unverified accounts ──────────
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
setInterval(async () => {
  try {
    await deleteExpiredUnverifiedUsers();
  } catch (err) {
    console.error("Cleanup job error:", err);
  }
}, CLEANUP_INTERVAL_MS);

// Run once immediately on server start
deleteExpiredUnverifiedUsers().catch((err) =>
  console.error("Initial cleanup error:", err),
);

// ================= GET =======================

export const getMeController = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  try {
    const { id, email } = req.user;
    const user = await findUserByEmail(email);
    const sessions = await getUserSessions(id);
    res.json({ ...user, sessions: sessions });
  } catch (err) {
    console.error("Error getting user data:", err);
    res.status(500).json({ message: "Server error" });
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
    console.error("Error getting the users.");
    res.status(500).json({ message: "There was a problem getting the users." });
  }
};

export const getUserByEmailController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const email = req.params.email;
    const includeParam = req.params.include;
    const include = includeParam === "true";
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

export const getUserSessionsController = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  const { id } = req.user;
  const sessions = await getUserSessions(id);
  res.status(200).json(sessions);
};

// =============== PATCH =======================

export const updateUserController = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  try {
    const data = req.body;
    const id = req.user.id as string;
    if (!data.username || !data.email) {
      res.status(400).json({ message: "Missing request data" });
      return;
    }

    const user = await updateUserProfile({ ...data, id: id });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating users profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserPassword = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const id = req.user.id as UUID;

    if (!currentPassword || !newPassword) {
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
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  try {
    const data = req.body;
    const id = req.user.id as string;
    if (
      !data.activityVisible === null ||
      !data.activityVisible === undefined ||
      !data.profileVisibility
    ) {
      res.status(400).json({ message: "Missing request data" });
      return;
    }

    const user = await updateVisibility({ ...data, id });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating users visibility:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserAvatar = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  try {
    const id = req.user.id as string;
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

    // Generate verification token and send the verification email.
    const token = await createVerificationToken(newUser.id);
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    verificationEmail(newUser.email, newUser.username, verifyUrl).catch((err) =>
      console.error("Error sending verification email:", err),
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error("User creation failed:", error);
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }

    res.status(500).json({ error: "Failed to create user" });
  }
};

export const loginUserController = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  try {
    console.log("logging user in...");
    const { userId, userAgent } = req.body;
    const session = await createUserSession(userId, userAgent, req);
    await deactivateOtherSessions(userId, session.id);
    await updateUserLastLogin(userId as UUID);
    res.status(200).json({ message: "User login time updated." });
  } catch (err) {
    console.error("Error updating users login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPasswordController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const token = await createPasswordResetToken(email);

    if (token) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await passwordResetEmail(email, resetUrl);
      console.log(`Password reset email sent to ${email}`);
    }

    res.status(200).json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPasswordController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required" });
      return;
    }

    await consumePasswordResetToken(token, newPassword);
    res.status(200).json({ message: "Password reset successful" });
  } catch (err: any) {
    if (err.message === "INVALID_OR_EXPIRED_TOKEN") {
      res.status(400).json({ message: "Invalid or expired reset token" });
    } else {
      console.error("Reset password error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const verifyEmailController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: "Token is required" });
      return;
    }

    const user = await verifyAccountToken(token);

    welcomeNewUserEmail(user.email, user.username).catch((err) =>
      console.error("Error sending welcome email:", err),
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err: any) {
    if (err.message === "INVALID_OR_EXPIRED_TOKEN") {
      res.status(400).json({ message: "Invalid or expired verification token" });
    } else {
      console.error("Verify email error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const deleteSessionController = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  console.log("deleting session...");
  const { sessionId } = req.params;
  console.log("sessionId: ", sessionId);
  await deleteSession(sessionId);
  res.status(200).json({ message: "Session deleted" });
};

export const deleteAllOtherSessionsController = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  console.log("deleting all other sessions...");
  const { sessionId } = req.params;
  const id = req.user.id as string;
  console.log("id: ", id);
  console.log("sessionId: ", sessionId);

  await deleteAllOtherSessions(id, sessionId);
  res.status(200).json({ message: "All other sessions signed out" });
};
