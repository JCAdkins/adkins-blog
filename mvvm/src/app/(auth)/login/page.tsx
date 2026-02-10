// app/(auth)/login/page.tsx
"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { AuthForm } from "@/components/forms/auth-form";
import { useLoginViewModel } from "@/view-models/auth/useLoginViewModel";

const Page = () => {
  const { email, isSuccessful, state, onSubmit } = useLoginViewModel();

  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-amber-900">Sign In</h3>
          <p className="text-sm text-amber-200 dark:text-amber-200">
            Use your email and password to sign in
          </p>
        </div>
        <AuthForm action={onSubmit} defaultEmail={email}>
          <SubmitButton
            className="border border-black shadow-md hover:shadow-amber-700 flex flex-justify-between"
            disabled={state.status === "in_progress"}
            isSuccessful={isSuccessful}
            isRegisterForm={false}
          />
        </AuthForm>
      </div>
    </div>
  );
};

export default Page;
