import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function FormSection({
  className,
  ...props
}: ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn("min-w-0 space-y-5 border-t border-border pt-5", className)}
      {...props}
    />
  );
}
