"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyEmail, VerifyEmailActionState } from "@/app/(auth)/actions";

export const useVerifyEmailViewModel = () => {
  const router = useRouter();

  const [state, formAction] = useActionState<VerifyEmailActionState, FormData>(
    verifyEmail,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Email verified! Welcome aboard.");
      router.push("/login");
    } else if (state.status === "invalid_token") {
      toast.error("This verification link is invalid or has expired.");
    } else if (state.status === "failed") {
      toast.error("Something went wrong. Please try again.");
    }
  }, [state, router]);

  return { state, formAction };
};
