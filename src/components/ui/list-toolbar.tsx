import type { ReactNode } from "react";
import { Select } from "@/components/ui/input";

export function ListToolbar({
  filters,
  count,
  sort,
}: {
  filters?: ReactNode;
  count?: ReactNode;
  sort?: ReactNode;
}) {
  return (
    <div className="list-toolbar">
      {filters ? <div className="list-toolbar-filters">{filters}</div> : null}
      <div className="list-toolbar-meta">
        {count ? <div className="list-toolbar-count">{count}</div> : null}
        {sort ? <div className="list-toolbar-sort">{sort}</div> : null}
      </div>
    </div>
  );
}

export function SortControl({
  id,
  value,
  onChange,
  options,
  direction,
  onDirectionChange,
  className = "",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  direction: "ascending" | "descending";
  onDirectionChange: () => void;
  className?: string;
}) {
  return (
    <div className={`inline-sort-control ${className}`}>
      <label htmlFor={id}>Sorted by:</label>
      <div className="inline-sort-actions">
        <Select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <button
          className="inline-sort-direction"
          type="button"
          onClick={onDirectionChange}
          aria-label={`Sort ${direction === "ascending" ? "descending" : "ascending"}`}
          title={`Sort ${direction === "ascending" ? "descending" : "ascending"}`}
        >
          <span aria-hidden="true">
            {direction === "ascending" ? "↑" : "↓"}
          </span>
        </button>
      </div>
    </div>
  );
}
