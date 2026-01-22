import { cn } from "@/lib/utils"; // Import your utility function

interface BreakProps {
  className?: string; // Optional className prop
}
export default function Break({ className, ...rest }: BreakProps) {
  return (
    <div
      className={cn("my-1 w-full border border-black", className)} // Merge with passed className
      {...rest} // Spread any other props (like id, style, etc.)
    />
  );
}
