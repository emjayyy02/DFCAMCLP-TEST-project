import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
  context,
  className,
  density = "staff",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  context?: ReactNode;
  className?: string;
  density?: "staff" | "personal";
}) {
  return (
    <header className={cn("page-header", `page-header-${density}`, className)}>
      <div className="page-header-copy">
        {eyebrow ? <p className="page-header-eyebrow">{eyebrow}</p> : null}
        <h1 className="page-title">{title}</h1>
        {description ? (
          <p className="page-header-description">{description}</p>
        ) : null}
        {context ? <div className="page-header-context">{context}</div> : null}
      </div>
      {action ? <div className="page-header-actions">{action}</div> : null}
    </header>
  );
}
