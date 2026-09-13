import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { statusStyles, type StatusTone } from "@/components/ui/badge";

export function Alert({
  className,
  tone = "info",
  ...props
}: ComponentProps<"div"> & { tone?: StatusTone }) {
  return (
    <div
      className={cn(
        "rounded-md px-4 py-3 text-sm leading-6",
        statusStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
