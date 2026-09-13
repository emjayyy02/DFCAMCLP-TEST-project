import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const controlStyle =
  "min-h-(--control-height) w-full min-w-0 rounded-md border border-input bg-surface px-3 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlStyle, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlStyle, className)} {...props} />;
}
