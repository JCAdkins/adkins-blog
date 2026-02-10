"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { AuthForm } from "@/components/forms/auth-form";
import { useRegisterViewModel } from "@/view-models/auth/useRegisterViewModel";

export default function Page() {
  const { email, isSuccessful, onSubmit } = useRegisterViewModel();

  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-8 pt-0 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-amber-900">Sign Up</h3>
          <p className="text-sm text-white dark:text-amber-200">
            Create an account with your email and password
          </p>
        </div>
        <AuthForm action={onSubmit} defaultEmail={email}>
          <SubmitButton
            className="border border-black shadow-md hover:shadow-amber-700"
            isSuccessful={isSuccessful}
            isRegisterForm={true}
          />
        </AuthForm>
      </div>
    </div>
  );
}
