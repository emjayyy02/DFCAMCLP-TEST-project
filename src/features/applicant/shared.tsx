"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  applicantIdentity,
  campusDisplay,
  programDisplay,
  type Schedule,
} from "./demo-data";
import { useApplicantDemo } from "./demo-context";

export function Facts({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="applicant-facts">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || "Not provided"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ScheduleBlock({
  schedule,
  title,
  past = false,
}: {
  schedule: Schedule;
  title: string;
  past?: boolean;
}) {
  return (
    <section className="applicant-schedule" aria-label={title}>
      <div className="applicant-section-heading">
        <h3>{title}</h3>
        <Badge tone="neutral">
          {past ? "Past demo appointment" : "Demo appointment"}
        </Badge>
      </div>
      <Facts
        items={[
          ["Date", schedule.date],
          ["Time · Philippine time", schedule.time],
          ["Location", schedule.location],
          ["Campus", schedule.campus],
        ]}
      />
    </section>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="applicant-empty">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function Journey({
  steps,
  current,
  halted = false,
  compact = false,
}: {
  steps: string[];
  current: number;
  halted?: boolean;
  compact?: boolean;
}) {
  return (
    <ol
      className={`applicant-journey ${compact ? "applicant-journey-compact" : ""}`}
    >
      {steps.map((step, index) => {
        const done = current >= 0 && index < current;
        const active = index === current;
        return (
          <li
            key={step}
            data-state={done ? "complete" : active ? "current" : "future"}
            aria-current={active ? "step" : undefined}
          >
            <span className="applicant-step-marker" aria-hidden="true">
              {done ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <div>
              <span className="applicant-step-title">{step}</span>
              <span className="applicant-step-status">
                {done
                  ? "Completed"
                  : active
                    ? halted
                      ? "Not Qualified"
                      : "Current step"
                    : halted
                      ? "Not available"
                      : "Upcoming"}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Tabs({
  items,
  initial = 0,
}: {
  items: { label: string; content: ReactNode }[];
  initial?: number;
}) {
  const [selected, setSelected] = useState(initial);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="applicant-tab-area">
      <div role="tablist" aria-label="Page sections" className="applicant-tabs">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            ref={(node) => {
              refs.current[index] = node;
            }}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % items.length
                  : event.key === "ArrowLeft"
                    ? (index - 1 + items.length) % items.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? items.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                setSelected(next);
                refs.current[next]?.focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={selected !== index}
          tabIndex={0}
          className="applicant-tab-panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export function DemoDocument({
  kind,
  schedule,
}: {
  kind: "DCAT" | "COE" | "COR";
  schedule?: Schedule;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const { savedDraft } = useApplicantDemo();
  return (
    <>
      <Button
        variant="outline"
        ref={trigger}
        onClick={() => dialog.current?.showModal()}
      >
        Preview {kind} form
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        className="applicant-dialog applicant-document-dialog"
        onClose={() => trigger.current?.focus()}
      >
        <div className="applicant-dialog-actions">
          <Button variant="ghost" onClick={() => dialog.current?.close()}>
            Close preview
          </Button>
        </div>
        <article className="applicant-document shared-dialog-body">
          <p className="applicant-document-notice">
            SAMPLE DOCUMENT · NOT VALID FOR OFFICIAL USE
          </p>
          <h2 id={`${id}-title`}>
            {kind === "DCAT"
              ? "DCAT examination form"
              : `${kind} · Enrollment document`}
          </h2>
          <p>DFCAMCLP portal concept</p>
          <Facts
            items={[
              ["Applicant ID", applicantIdentity.id],
              ["Applicant", `${savedDraft.firstName} ${savedDraft.lastName}`],
              ["Program", programDisplay(savedDraft)],
              ["Campus", campusDisplay(savedDraft)],
              ...(savedDraft.major
                ? [["Major", savedDraft.major] as [string, ReactNode]]
                : []),
            ]}
          />
          {schedule ? (
            <ScheduleBlock title="Exam assignment" schedule={schedule} />
          ) : (
            <p className="applicant-document-body">
              This placeholder demonstrates viewing an enrollment document.
              Official content, subjects, signatures, and document formats are
              not defined in this concept.
            </p>
          )}
          <p className="applicant-document-footer">
            Fictional applicant and schedule. Demo version 1. This is not an
            issued school document.
          </p>
        </article>
        <div className="applicant-dialog-actions">
          <Button onClick={() => window.print()}>Print / Save as PDF</Button>
        </div>
      </dialog>
    </>
  );
}
