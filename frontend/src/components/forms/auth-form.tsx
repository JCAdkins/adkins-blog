import { usePathname } from "next/navigation";
import React, { useState, useEffect, ButtonHTMLAttributes } from "react";
import Form from "next/form";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const isRegisterPage = usePathname().includes("/register");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    console.log("password: ", password);
    console.log("confirm-password: ", confirmPassword);
    if (isRegisterPage) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword, isRegisterPage]);

  return (
    <Form action={action} className="flex flex-col gap-3 px-4 sm:px-16">
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
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label
          htmlFor="password"
          className="font-normal text-zinc-600 dark:text-amber-200"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          placeholder="*********"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {isRegisterPage && (
        <>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="confirm-password"
              className="font-normal text-zinc-600 dark:text-amber-200"
            >
              Confirm Password
            </Label>

            <Input
              id="confirm-password"
              name="confirm-password"
              className="bg-muted text-md md:text-sm"
              type="password"
              placeholder="Re-enter password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && (
              <p className="text-sm text-red-500 mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Username and optional fields */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="username"
              className="font-normal text-zinc-600 dark:text-amber-200"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="first_name"
              className="font-normal text-zinc-600 dark:text-amber-200"
            >
              First Name (Optional)
            </Label>
            <Input
              id="first_name"
              name="first_name"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="First Name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="last_name"
              className="font-normal text-zinc-600 dark:text-amber-200"
            >
              Last Name (Optional)
            </Label>
            <Input
              id="last_name"
              name="last_name"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="Last Name"
            />
          </div>
        </>
      )}

      {/* You can disable the submit button if the passwords don't match */}
      <div className="mt-2 w-full flex justify-center">
        {React.cloneElement(
          children as React.ReactElement<
            ButtonHTMLAttributes<HTMLButtonElement>
          >,
          {
            disabled: isRegisterPage && !passwordsMatch,
          }
        )}
      </div>
      {isRegisterPage ? (
        <p className="mt-4 text-center text-sm text-white dark:text-amber-200">
          {"Already have an account? "}
          <Link
            href="/login"
            className="font-semibold text-white hover:underline dark:text-white"
          >
            Sign in
          </Link>
          {" instead."}
        </p>
      ) : (
        <p className="mt-4 text-center text-sm text-white dark:text-amber-200">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="font-semibold text-gray-800 hover:underline dark:text-white"
          >
            Sign up
          </Link>
          {" for free."}
        </p>
      )}
    </Form>
  );
}
