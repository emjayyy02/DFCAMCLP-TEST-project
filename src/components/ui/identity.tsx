import Image from "next/image";

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
}: {
  name: string;
  src?: string;
  size?: "small" | "medium" | "large";
}) {
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {src ? (
        <Image src={src} alt="" width={48} height={48} unoptimized />
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
}: {
  name: string;
  detail?: string;
  src?: string;
  size?: "small" | "medium" | "large";
}) {
  return (
    <div className="identity-summary">
      <Avatar name={name} src={src} size={size} />
      <div className="identity-summary-copy">
        <p className="identity-summary-name">{name}</p>
        {detail ? <p className="identity-summary-detail">{detail}</p> : null}
      </div>
    </div>
  );
}
