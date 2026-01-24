// hooks/useLoginViewModel.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState } from "react"; // placeholder for your MVVM action-state helper
import { useSession } from "next-auth/react";
import { login, type LoginActionState } from "@/app/(auth)/actions";

export const useLoginViewModel = () => {
  const router = useRouter();
  const { data: _, status, update } = useSession();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "invalid_data") {
      toast.error("Please enter valid inputs!");
    } else if (state.status === "success") {
      setIsSuccessful(true);
      router.push("/");
      update();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return { email, isSuccessful, state, handleSubmit };
};
