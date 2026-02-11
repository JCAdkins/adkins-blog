import * as React from "react";
import { cn } from "../../lib/utils"; // Utility function for conditional classNames (optional)
import {
  Card as RadixCard,
  CardProps as RadixCardProps,
} from "@radix-ui/themes";

// Define the props for the Card component
interface CardProps extends RadixCardProps {
  children?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  border?: boolean;
}

// Create the Card component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, header, footer, border, ...props }, ref) => {
    return (
      <RadixCard
        ref={ref}
        className={cn(
          "border bg-white text-white shadow-md transition-shadow hover:shadow-lg sm:m-0",
          "space-y-4",
          className,
        )}
        {...props}
      >
        {header && (
          <div
            className={cn("mb-4 pb-2", border ? "border-b border-black" : "")}
          >
            <h3 className="text-center text-lg font-medium">{header}</h3>
          </div>
        )}
        <div className="h-full flex flex-col">{children}</div>
        {footer && (
          <div
            className={cn(
              "mt-4 pt-2 text-sm",
              border ? "border-t border-black" : "",
            )}
          >
            {footer}
          </div>
        )}
      </RadixCard>
    );
  },
);

Card.displayName = "Card";
