import Link from "next/link";
import type { ReactNode } from "react";

export function ContextHeader({
  parent,
  parentHref,
  title,
  metadata,
  description,
  backHref,
  backLabel,
  actions,
}: {
  parent: string;
  parentHref?: string;
  title: string;
  metadata?: ReactNode;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="context-header">
      <div className="context-header-copy">
        <p className="context-header-parent">
          {parentHref ? <Link href={parentHref}>{parent}</Link> : parent}
        </p>
        <h1 className="context-header-title">{title}</h1>
        {metadata ? (
          <div className="context-header-metadata">{metadata}</div>
        ) : null}
        {description ? (
          <p className="context-header-description">{description}</p>
        ) : null}
      </div>
      <div className="context-header-actions">
        {backHref ? (
          <Link className="context-header-back" href={backHref}>
            {backLabel ?? `Back to ${parent.toLowerCase()}`}
          </Link>
        ) : null}
        {actions}
      </div>
    </header>
  );
}
