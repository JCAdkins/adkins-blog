import * as z from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(3).max(20),
  email: z.string().email(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export const privacySchema = z.object({
  profileVisibility: z.enum(["public", "friends", "private"]),
  activityVisible: z.boolean(),
  connectionsVisible: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type PrivacyFormValues = z.infer<typeof privacySchema>;
