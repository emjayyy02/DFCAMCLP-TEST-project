import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ui-button inline-flex min-h-(--control-height) items-center justify-center rounded-md px-4 py-2 text-center text-[15px] leading-[22px] font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:border-border disabled:bg-muted disabled:text-foreground-muted",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border border-input bg-surface text-foreground hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-border",
        ghost:
          "text-primary underline underline-offset-4 hover:bg-primary-soft",
        tertiary:
          "border border-transparent bg-transparent text-primary underline underline-offset-4 hover:bg-primary-soft",
        accent: "bg-accent-soft text-accent-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}
