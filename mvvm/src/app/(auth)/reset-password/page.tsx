"use client";

import { useResetPasswordViewModel } from "@/view-models/auth/useResetPasswordViewModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Suspense } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-700 hover:shadow-amber-700/40 disabled:opacity-60 dark:bg-amber-700 dark:hover:bg-amber-600"
    >
      {pending ? "Resetting..." : "Reset Password"}
    </button>
  );
}

function ResetPasswordForm() {
  const { state, formAction } = useResetPasswordViewModel();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-5 text-center dark:border-red-700 dark:bg-red-950">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          This reset link is missing a token. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-3 inline-block text-sm font-semibold text-amber-800 hover:underline dark:text-amber-300"
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (state.status === "invalid_token") {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-5 text-center dark:border-red-700 dark:bg-red-950">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          This reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="mt-3 inline-block text-sm font-semibold text-amber-800 hover:underline dark:text-amber-300"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1">
        <Label htmlFor="password" className="font-normal text-zinc-600 dark:text-amber-200">
          New Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="*********"
          autoFocus
          required
          className="bg-muted text-md md:text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="confirm-password" className="font-normal text-zinc-600 dark:text-amber-200">
          Confirm New Password
        </Label>
        <Input
          id="confirm-password"
          name="confirm-password"
          type="password"
          placeholder="Re-enter password"
          required
          className="bg-muted text-md md:text-sm"
        />
      </div>

      <ul className="rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300 space-y-1">
        <li>• At least 10 characters</li>
        <li>• At least one uppercase letter</li>
        <li>• At least one lowercase letter</li>
        <li>• At least one special character (!@#$%^&amp;* etc.)</li>
      </ul>

      <SubmitButton />
    </Form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden rounded-2xl px-4 sm:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-200">
            Reset your password
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Enter a new password for your account.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-amber-200">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center text-sm text-white dark:text-amber-200">
          Back to{" "}
          <Link href="/login" className="font-semibold text-gray-800 hover:underline dark:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
