import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const badgeVariants = {
  default: "bg-gray-200 text-gray-900",
  secondary: "bg-gray-100 text-gray-800",
  destructive: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-400 text-black",
};

const sizeVariants = {
  sm: "text-[10px] px-1.5 h-4 min-w-4",
  md: "text-xs px-2 h-5 min-w-5",
  lg: "text-sm px-2.5 h-6 min-w-6",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold",
          badgeVariants[variant],
          sizeVariants[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";
