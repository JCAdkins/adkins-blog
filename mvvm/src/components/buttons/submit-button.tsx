"use client";

import { useFormStatus } from "react-dom";
import { LoaderIcon } from "../ui/icons";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  isSuccessful,
  isRegisterForm,
  className,
  disabled,
}: {
  children?: React.ReactNode;
  isSuccessful: boolean;
  isRegisterForm?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending || isSuccessful}
      disabled={pending || isSuccessful || disabled}
      className={cn("relative", className)}
    >
      {children}
      {!pending && isRegisterForm ? "Register" : "Sign in"}
      {(pending || isSuccessful) && (
        <span className="animate-spin">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? "Loading" : "Submit form"}
      </output>
    </Button>
  );
}
