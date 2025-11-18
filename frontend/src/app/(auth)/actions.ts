"use server";

import { z } from "zod";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "@/lib/db/queries";
import { signIn } from "./auth";
import { capitalizeFirstLetter } from "@/lib/utils";

const authLogInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

const authRegisterFormSchema = z.object({
  email: z.string().email(),
  username: z.string().min(6),
  password: z
    .string()
    .min(10)
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.string(),
});

export interface LoginActionState {
  status: "idle" | "success" | "failed" | "in_progress" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authLogInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return { status: "failed" };
    }

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "idle" };
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
  formData: FormData
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

    let user = await getUserByEmail(userData.email);
    if (user) return { status: "email_in_use" };

    user = await getUserByUsername(userData.username);
    if (user) return { status: "username_taken" };

    user = await createUser(userData);
    console.log("user after create: ", user);
    await signIn("credentials", {
      email: userData.email,
      password: userData.password,
      redirect: false,
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const err = error.errors.map((err) => {
        return (
          '"' + capitalizeFirstLetter(`${err.path.join(".")}" - ${err.message}`)
        );
      });
      return { status: "invalid_data", error: err };
    }

    return { status: "failed" };
  }
};
