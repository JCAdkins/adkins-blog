// src/components/ui/form.tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, useFormState } from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("space-y-6 px-4", className)} {...props} />
));
Form.displayName = "Form";

const FormFieldContext = React.createContext<any>({});

const FormField = ({ control, name, render, children }: FormFieldProps) => {
  const { errors } = useFormState({ control, name });
  const error = errors[name];

  return (
    <FormFieldContext.Provider value={{ name, control, error }}>
      {render ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => render({ field }) as React.ReactElement}
        />
      ) : (
        children
      )}
    </FormFieldContext.Provider>
  );
};

// Optional: improve type safety (if you want full shadcn-like typing)
type FormFieldProps =
  | {
      control: any;
      name: string;
      render: (props: { field: any }) => React.ReactNode;
      children?: never; // optional, but prevents using both
    }
  | {
      control: any;
      name: string;
      children: React.ReactNode;
      render?: never;
    };

const useFormField = () => {
  const field = React.useContext(FormFieldContext);
  if (!field) {
    throw new Error("useFormField must be used within a FormField");
  }
  return field;
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, forwardedRef) => {
  const { name, control, error } = useFormField();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        // Let Controller pass the ref automatically
        <Slot
          {...field}
          {...props}
          ref={forwardedRef}
          className={cn(
            props.className,
            error && "border-destructive focus-visible:ring-destructive",
          )}
        />
      )}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { error } = useFormField();

  if (error) return null;

  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
