import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const statusStyles = {
  success: "bg-success-soft text-success-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  destructive: "bg-destructive-soft text-destructive-foreground",
  info: "bg-info-soft text-info-foreground",
  neutral: "bg-muted text-foreground",
};
export type StatusTone = keyof typeof statusStyles;

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentProps<"span"> & { tone?: StatusTone }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-[4px] px-2 py-1 text-sm leading-5 font-semibold",
        statusStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
