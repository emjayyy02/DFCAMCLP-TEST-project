import { useId, type ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const titleId = useId();
  return (
    <section className="empty-state" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </section>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state-indicator" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  title = "This information could not be loaded",
  description,
  action,
}: {
  title?: string;
  description: string;
  action?: ReactNode;
}) {
  const titleId = useId();
  return (
    <section className="error-state" role="alert" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
      {action ? <div className="error-state-action">{action}</div> : null}
    </section>
  );
}
