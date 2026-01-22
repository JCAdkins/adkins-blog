import React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: number;
  currentStep: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {Array.from({ length: steps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-3 w-3 rounded-full transition-all duration-300",
            index === currentStep
              ? "scale-110 bg-rose-500"
              : "bg-rose-200 opacity-50",
          )}
        />
      ))}
    </div>
  );
};
