"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { AuthForm } from "@/components/forms/auth-form";
import { SubmitButton } from "@/components/buttons/submit-button";

import { login, type LoginActionState } from "../actions";

const Page = () => {
  const router = useRouter();
  const { data: _, status, update } = useSession();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
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

  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-amber-900">Sign In</h3>
          <p className="text-sm text-amber-200 dark:text-amber-200">
            Use your email and password to sign in
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton
            className="border-1 border-black shadow-md hover:shadow-amber-700"
            isSuccessful={isSuccessful}
          >
            Sign in
          </SubmitButton>
        </AuthForm>
      </div>
    </div>
  );
};

export default Page;
