"use client";

import { useForgotPasswordViewModel } from "@/view-models/auth/useForgotPasswordViewModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-fit border border-black shadow-md hover:shadow-amber-700"
    >
      {pending ? "Sending..." : "Send Reset Link"}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const { state, formAction } = useForgotPasswordViewModel();

  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden rounded-2xl px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-semibold text-black">
            Forgot your password?
          </h3>
          <p className="text-sm text-amber-200">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {state.status === "success" ? (
          <div className="rounded-lg border border-green-300 bg-green-50 px-6 py-5 text-center dark:border-green-700 dark:bg-green-950">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Check your inbox! If that email is registered, a reset link is on
              its way.
            </p>
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              The link will expire in 1 hour.
            </p>
          </div>
        ) : (
          <Form
            action={formAction}
            className="w-full flex flex-col items-center gap-4"
          >
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="email" className="font-normal text-amber-200">
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

        <p className="text-center text-sm text-amber-200">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-amber-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
