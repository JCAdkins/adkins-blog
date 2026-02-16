"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";
import {
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
} from "@/lib/db/queries";

// ──────────────────────────────────────────────
//  Schemas
// ──────────────────────────────────────────────

const updateProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  username: z.string().min(3, "Username must be 3+ chars").max(30),
  email: z.string().email("Invalid email address"),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const toggle2FASchema = z.object({
  enabled: z.boolean(),
});

// ──────────────────────────────────────────────
//  1. Update Profile (name, username, email)
// ──────────────────────────────────────────────

export async function updateProfile(
  prevState: { error?: string; success?: string },
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be signed in to update your profile." };
    }

    const validated = updateProfileSchema.parse({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      username: formData.get("username"),
      email: formData.get("email"),
    });

    const res = await updateUserProfile(session.user.id, validated);

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update profile");
    }

    revalidatePath("/settings");
    return { success: "Profile updated successfully!" };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return {
      error: error.message || "Something went wrong. Please try again.",
    };
  }
}

// ──────────────────────────────────────────────
//  2. Update Password
// ──────────────────────────────────────────────

export async function updatePassword(
  prevState: { error?: string; success?: string },
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be signed in to change your password." };
    }

    const validated = updatePasswordSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    console.log("session.user:", session.user);
    const user = {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
    }; // Pass email for verification in API route

    const res = await updateUserPassword(user, validated);

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update password");
    }

    revalidatePath("/settings");
    return { success: "Password updated successfully!" };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return {
      error: error.message || "Something went wrong. Please try again.",
    };
  }
}

// ──────────────────────────────────────────────
//  3. Toggle 2FA (stub – adjust endpoint & payload)
// ──────────────────────────────────────────────

export async function toggle2FA(
  prevState: { error?: string; success?: string },
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const enabled = formData.get("enabled") === "on";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/2fa`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update 2FA settings");
    }

    revalidatePath("/settings");
    return {
      success: enabled ? "2FA has been enabled." : "2FA has been disabled.",
    };
  } catch (error: any) {
    return { error: error.message || "Failed to update 2FA." };
  }
}

// ──────────────────────────────────────────────
//  4. Get current user profile (used in page)
// ──────────────────────────────────────────────

export async function getCurrentUserProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const res = await getUserProfile(session.user.id);

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
}
