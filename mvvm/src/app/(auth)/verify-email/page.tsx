"use client";

import { useVerifyEmailViewModel } from "@/view-models/auth/useVerifyEmailViewModel";
import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Suspense, useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-700 disabled:opacity-60 dark:bg-amber-700 dark:hover:bg-amber-600"
    >
      {pending ? "Verifying..." : "Verify My Email"}
    </button>
  );
}

function VerifyEmailForm() {
  const { state, formAction } = useVerifyEmailViewModel();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      const formData = new FormData();
      formData.append("token", token);
      formAction(formData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-5 text-center dark:border-red-700 dark:bg-red-950">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          This verification link is missing a token. Please check your email for the correct link.
        </p>
        <Link href="/login" className="mt-3 inline-block text-sm font-semibold text-amber-800 hover:underline dark:text-amber-300">
          Back to sign in
        </Link>
      </div>
    );
  }

  if (state.status === "invalid_token") {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-5 text-center dark:border-red-700 dark:bg-red-950">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          This verification link is invalid or has expired.
        </p>
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          Unverified accounts are removed after 48 hours. Please sign up again.
        </p>
        <Link href="/register" className="mt-3 inline-block text-sm font-semibold text-amber-800 hover:underline dark:text-amber-300">
          Create a new account
        </Link>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 px-6 py-5 text-center dark:border-green-700 dark:bg-green-950">
        <p className="text-sm font-medium text-green-800 dark:text-green-300">
          🎉 Your email has been verified! Redirecting you to sign in...
        </p>
      </div>
    );
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <p className="text-center text-sm text-amber-700 dark:text-amber-300">
        Click the button below to confirm your email address.
      </p>
      <SubmitButton />
    </Form>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden rounded-2xl px-4 sm:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-200">
            Verifying your email...
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Hang tight, this only takes a moment.
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-sm text-amber-200 animate-pulse">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
        <p className="text-center text-sm text-white dark:text-amber-200">
          Need help?{" "}
          <Link href="/contact" className="font-semibold text-gray-800 hover:underline dark:text-white">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
