type SortDirection = "ascending" | "descending";

export function SortableHeader({
  label,
  direction,
  onSort,
}: {
  label: string;
  direction?: SortDirection;
  onSort: () => void;
}) {
  return (
    <th scope="col" aria-sort={direction ?? "none"}>
      <button
        className="sortable-header-button"
        type="button"
        onClick={onSort}
        aria-label={`Sort by ${label}${direction ? `, currently ${direction}` : ""}`}
      >
        <span>{label}</span>
        <span
          className={`sortable-header-indicator${direction ? " is-active" : ""}`}
          aria-hidden="true"
        >
          {direction === "ascending"
            ? "↑"
            : direction === "descending"
              ? "↓"
              : "↕"}
        </span>
      </button>
    </th>
  );
}
