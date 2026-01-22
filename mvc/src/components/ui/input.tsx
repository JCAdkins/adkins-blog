import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const isFile = type === "file";

    return (
      <input
        type={type}
        className={cn(
          "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isFile &&
            "h-full w-full p-0 file:mr-4 file:cursor-pointer file:border-0 file:bg-rose-500 file:p-2 file:text-sm file:font-medium file:text-white file:transition file:hover:bg-rose-600",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
