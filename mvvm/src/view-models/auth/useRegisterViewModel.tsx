"use client";

import { register, RegisterActionState } from "@/app/(auth)/actions";
import { welcomeNewUser } from "@/lib/services/contact-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export const useRegisterViewModel = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { data: _, status, update } = useSession();
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "username_taken") {
      toast.error("Username already exists");
    } else if (state.status === "email_in_use") {
      toast.error("Email already in use");
    } else if (state.status === "failed") {
      toast.error("Failed to create account");
    } else if (state.status === "invalid_data") {
      const toastee = (
        <div className="flex flex-col items-center">
          <ul className="list-disc space-y-2 pl-3">
            {state.error?.map((err, ind) => (
              <li key={ind}>{err}</li>
            ))}
          </ul>
        </div>
      );
      toast.error("Failed validating your submission!", {
        description: toastee,
      });
    } else if (state.status === "success") {
      toast.success("Account created successfully");
      setIsSuccessful(true);
      welcomeNewUser({ email, username });
      update();
      router.push("/");
    }
  }, [state.status, router]);

  const onSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    setUsername(formData.get("username") as string);
    formAction(formData);
  };
  return { email, username, isSuccessful, state, onSubmit };
};
