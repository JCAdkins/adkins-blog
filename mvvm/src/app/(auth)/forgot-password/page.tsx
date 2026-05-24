"use client";

import { useForgotPasswordViewModel } from "@/view-models/auth/useForgotPasswordViewModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-700 hover:shadow-amber-700/40 disabled:opacity-60 dark:bg-amber-700 dark:hover:bg-amber-600"
    >
      {pending ? "Sending..." : "Send Reset Link"}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const { state, formAction } = useForgotPasswordViewModel();

  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden rounded-2xl px-4 sm:px-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-200">
            Forgot your password?
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Success state - show confirmation instead of form */}
        {state.status === "success" ? (
          <div className="rounded-lg border border-green-300 bg-green-50 px-6 py-5 text-center dark:border-green-700 dark:bg-green-950">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Check your inbox! If that email is registered, a reset link is on its way.
            </p>
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              The link will expire in 1 hour.
            </p>
          </div>
        ) : (
          <Form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="email"
                className="font-normal text-zinc-600 dark:text-amber-200"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@acme.com"
                autoComplete="email"
                autoFocus
                required
                className="bg-muted text-md md:text-sm"
              />
            </div>
            <SubmitButton />
          </Form>
        )}

        {/* Back to login */}
        <p className="text-center text-sm text-white dark:text-amber-200">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-gray-800 hover:underline dark:text-white"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
