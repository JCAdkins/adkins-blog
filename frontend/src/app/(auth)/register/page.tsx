"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { AuthForm } from "@/components/forms/auth-form";
import { SubmitButton } from "@/components/buttons/submit-button";
import { register, type RegisterActionState } from "../actions";
import { welcomeNewUser } from "@/lib/services/contact-service";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { data: _, status, update } = useSession();
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
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
            {state.error?.map((err, ind) => <li key={ind}>{err}</li>)}
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

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    setUsername(formData.get("username") as string);
    formAction(formData);
  };

  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-8 pt-0 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-amber-900">Sign Up</h3>
          <p className="text-sm text-white dark:text-amber-200">
            Create an account with your email and password
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton
            className="border-1 border-black shadow-md hover:shadow-amber-700"
            isSuccessful={isSuccessful}
          >
            Sign Up
          </SubmitButton>
        </AuthForm>
      </div>
    </div>
  );
}
