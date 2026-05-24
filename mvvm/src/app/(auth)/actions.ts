"use server";

import { z } from "zod";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "@/lib/db/queries";
import { signIn } from "./auth";

const authLogInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

const authRegisterFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z.string().min(6, { message: "Username must be at least 6 characters long" }),
  password: z
    .string()
    .min(10, { message: "Password must be at least 10 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(10, { message: "Password must be at least 10 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface LoginActionState {
  status: "idle" | "success" | "failed" | "in_progress" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authLogInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      userAgent: formData.get("userAgent") ?? "",
      redirect: false,
    });

    if (result?.error) {
      return { status: "failed" };
    }

    return { status: "success" };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { status: "failed" };
    }
    const isCredentialsError =
      error?.type === "CredentialsSignin" ||
      error?.name === "CredentialsSignin" ||
      error?.constructor?.name === "CredentialsSignin";
    if (!isCredentialsError) {
      console.log("Login error:", error);
    }
    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status:
    | "idle"
    | "success"
    | "failed"
    | "invalid_data"
    | "username_taken"
    | "email_in_use"
    | "in_progress";
  error?: string[];
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const userData = authRegisterFormSchema.parse({
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      role: "user",
    });

    let tUser = await getUserByEmail(userData.email);
    if (tUser) return { status: "email_in_use" };

    tUser = await getUserByUsername(userData.username);
    if (tUser) return { status: "username_taken" };

    await createUser(userData);
    await signIn("credentials", {
      email: userData.email,
      password: userData.password,
      redirect: false,
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const err = error.errors.map((err) => err.message);
      return { status: "invalid_data", error: err };
    }
    return { status: "failed" };
  }
};

export interface ForgotPasswordActionState {
  status: "idle" | "success" | "failed" | "invalid_data";
  error?: string;
}

export const forgotPassword = async (
  _: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> => {
  try {
    const { email } = forgotPasswordSchema.parse({
      email: formData.get("email"),
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!res.ok) return { status: "failed" };
    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data", error: error.errors[0].message };
    }
    console.error("Forgot password action error:", error);
    return { status: "failed" };
  }
};

export interface ResetPasswordActionState {
  status: "idle" | "success" | "failed" | "invalid_data" | "invalid_token";
  error?: string[];
}

export const resetPassword = async (
  _: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> => {
  try {
    const { token, password } = resetPasswordSchema.parse({
      token: formData.get("token"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm-password"),
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      },
    );

    if (res.status === 400) return { status: "invalid_token" };
    if (!res.ok) return { status: "failed" };
    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errs = error.errors.map((e) => e.message);
      return { status: "invalid_data", error: errs };
    }
    console.error("Reset password action error:", error);
    return { status: "failed" };
  }
};
