// components/ContactFormButton.tsx
"use client";

import { Button, type ButtonProps } from "@/components/ui/button";

export function ContactFormButton(props: ButtonProps) {
  return (
    <Button type="submit" variant="default" size="default" {...props}>
      {props.children ?? "Send Message"}
    </Button>
  );
}
