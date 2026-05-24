"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { forgotPassword, ForgotPasswordActionState } from "@/app/(auth)/actions";

export const useForgotPasswordViewModel = () => {
  const [state, formAction] = useActionState<ForgotPasswordActionState, FormData>(
    forgotPassword,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success("If that email is registered, a reset link is on its way!");
    } else if (state.status === "invalid_data") {
      toast.error(state.error ?? "Please enter a valid email address.");
    } else if (state.status === "failed") {
      toast.error("Something went wrong. Please try again.");
    }
  }, [state]);

  return { state, formAction };
};
