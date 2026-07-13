"use client";

import { useResetPasswordViewModel } from "@/view-models/auth/useResetPasswordViewModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const { state, formAction } = useResetPasswordViewModel();
  const { pending } = useFormStatus();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="flex flex-col h-full items-end justify-center gap-4 rounded-lg border px-6 py-5 text-center">
        <p className="text-sm font-medium text-red-800">
          This reset link is missing a token. Please request a new one.
        </p>
        <Link href="/forgot-password" className="flex w-full justify-center">
          <Button className="w-fit border border-black shadow-md hover:shadow-amber-700 rounded-lg px-6 py-5 text-center text-sm font-semibold">
            Request a new link
          </Button>
        </Link>
      </div>
    );
  }

  if (state.status === "invalid_token") {
    return (
      <div className="flex flex-col h-full items-end justify-center gap-4 rounded-lg border px-6 py-5 text-center">
        <p className="text-sm font-medium text-red-800 ">
          This reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className="flex w-full justify-center">
          <Button className="w-fit border border-black shadow-md hover:shadow-amber-700 rounded-lg px-6 py-5 text-center text-sm font-semibold">
            Request a new link
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Form action={formAction} className="flex flex-col items-center gap-4">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col w-full gap-1">
        <Label
          htmlFor="password"
          className="font-normal text-zinc-600 dark:text-amber-200"
        >
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

      <div className="flex flex-col w-full gap-1">
        <Label
          htmlFor="confirm-password"
          className="font-normal text-zinc-600 dark:text-amber-200"
        >
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

      <Button
        type="submit"
        disabled={pending}
        className="w-fit border border-black shadow-md hover:shadow-amber-700"
      >
        {pending ? "Resetting..." : "Reset Password"}
      </Button>
    </Form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-login-bg flex h-dvh w-full items-start justify-center pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden rounded-2xl px-4 sm:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-semibold text-black">
            Reset your password
          </h3>
          <p className="text-sm text-amber-300">
            Enter a new password for your account.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center text-sm text-amber-200">Loading...</div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center text-sm text-amber-200">
          Back to{" "}
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
