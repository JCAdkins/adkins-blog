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
}

// Create the Card component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, header, footer, ...props }, ref) => {
    return (
      <RadixCard
        ref={ref}
        className={cn(
          "rounded-lg border bg-white text-white shadow-md transition-shadow hover:shadow-lg",
          "space-y-4 p-4",
          className,
        )}
        {...props}
      >
        {header && (
          <div className="mb-4 border-b pb-2">
            <h3 className="text-center text-lg font-medium">{header}</h3>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="mt-4 border-t pt-2 text-sm">{footer}</div>}
      </RadixCard>
    );
  },
);

Card.displayName = "Card";
