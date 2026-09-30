import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const controlStyle =
  "min-h-(--control-height) w-full min-w-0 rounded-md border border-input bg-surface px-3 py-2 text-base leading-6 text-foreground transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-muted aria-invalid:border-destructive";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlStyle, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlStyle, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full min-w-0 rounded-md border border-input bg-surface px-3 py-2 text-base leading-6 text-foreground transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-muted aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function CheckboxInput({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("form-choice", className)}
      {...props}
    />
  );
}

export function RadioInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input type="radio" className={cn("form-choice", className)} {...props} />
  );
}

export function FieldLabel({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("field-label", className)} {...props} />;
}

export function FieldHelp({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("field-help", className)} {...props} />;
}

export function FieldError({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("field-error", className)} role="alert" {...props} />;
}
