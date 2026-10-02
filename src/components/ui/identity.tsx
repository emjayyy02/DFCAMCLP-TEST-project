import Image from "next/image";
import type { ReactNode } from "react";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "")
    .join("")
    .toLocaleUpperCase();
}

export function Avatar({
  name,
  src,
  size = "medium",
  placeholder = false,
}: {
  name: string;
  src?: string;
  size?: "small" | "medium" | "large";
  placeholder?: boolean;
}) {
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {src ? (
        <Image src={src} alt="" width={48} height={48} unoptimized />
      ) : placeholder ? (
        <svg
          className="avatar-placeholder"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
        </svg>
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function IdentitySummary({
  name,
  detail,
  src,
  size = "medium",
  avatar,
}: {
  name: string;
  detail?: string;
  src?: string;
  size?: "small" | "medium" | "large";
  avatar?: ReactNode;
}) {
  return (
    <div className="identity-summary">
      {avatar ?? <Avatar name={name} src={src} size={size} />}
      <div className="identity-summary-copy">
        <p className="identity-summary-name">{name}</p>
        {detail ? <p className="identity-summary-detail">{detail}</p> : null}
      </div>
    </div>
  );
}
