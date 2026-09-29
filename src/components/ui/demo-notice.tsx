import type { ReactNode } from "react";

export function DemoNotice({
  detail,
  label = "Demo workspace",
  action,
}: {
  detail: ReactNode;
  label?: string;
  action?: ReactNode;
}) {
  return (
    <aside className="demo-notice" aria-label={label}>
      <span className="demo-notice-marker" aria-hidden="true" />
      <div className="demo-notice-copy">
        <p className="demo-notice-label">{label}</p>
        <p className="demo-notice-detail">{detail}</p>
      </div>
      {action ? <div className="demo-notice-action">{action}</div> : null}
    </aside>
  );
}
