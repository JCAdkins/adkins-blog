import * as z from "zod";

const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

export const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().min(3).max(20),
  email: z.string().email("Invalid email address"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(10, "Minimum 10 characters required"),
    newPassword: z
      .string()
      .min(10, "Minimum 10 characters required")
      .refine(
        (val) => (val.match(specialCharRegex) ?? []).length >= 2,
        "Must contain at least 2 special characters",
      ),
    confirmPassword: z.string().min(10, "Minimum 10 characters required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export const privacySchema = z.object({
  profileVisibility: z.enum(["public", "users", "private"]),
  activityVisible: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type PrivacyFormValues = z.infer<typeof privacySchema>;
