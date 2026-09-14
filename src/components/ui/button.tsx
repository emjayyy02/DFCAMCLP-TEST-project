import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-(--control-height) items-center justify-center rounded-md px-5 py-2 text-center text-sm font-semibold transition-[background-color,color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border border-border-strong bg-surface text-foreground hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-border",
        ghost: "text-primary hover:bg-primary-soft",
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
