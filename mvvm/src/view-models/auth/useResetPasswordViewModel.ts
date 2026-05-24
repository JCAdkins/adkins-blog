"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword, ResetPasswordActionState } from "@/app/(auth)/actions";

export const useResetPasswordViewModel = () => {
  const router = useRouter();

  const [state, formAction] = useActionState<ResetPasswordActionState, FormData>(
    resetPassword,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Password reset successfully! Please sign in.");
      router.push("/login");
    } else if (state.status === "invalid_token") {
      toast.error("This reset link is invalid or has expired. Please request a new one.");
    } else if (state.status === "invalid_data") {
      state.error?.forEach((err) => toast.error(err));
    } else if (state.status === "failed") {
      toast.error("Something went wrong. Please try again.");
    }
  }, [state, router]);

  return { state, formAction };
};
