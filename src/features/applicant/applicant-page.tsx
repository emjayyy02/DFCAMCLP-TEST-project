"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/portal/page-header";
import { DemoNotice } from "@/components/ui/demo-notice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckboxInput, Select } from "@/components/ui/input";
import { ApplicationForm } from "./application-form";
import { useApplicantDemo } from "./demo-context";
import {
  announcements,
  applicantIdentity,
  campusDisplay,
  demoSchedules,
  enrollmentSteps,
  journeySteps,
  programDisplay,
  requirements,
  scenarios,
  type ScenarioKey,
} from "./demo-data";
import {
  DemoDocument,
  EmptyState,
  Facts,
  Journey,
  ScheduleBlock,
  Tabs,
} from "./shared";

function DemoControls() {
  const { scenario, setScenario } = useApplicantDemo();
  return (
    <DemoNotice
      detail="Fictional applicant data · Changes reset on refresh"
      action={
        <details>
          <summary>Preview scenarios</summary>
          <div className="applicant-demo-controls">
            <label htmlFor="applicant-scenario">Demo scenario</label>
            <Select
              id="applicant-scenario"
              value={scenario}
              onChange={(event) =>
                setScenario(event.target.value as ScenarioKey)
              }
            >
              {Object.entries(scenarios).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </Select>
            <p>
              Switch the sample journey across all Applicant pages. No school
              records change.
            </p>
          </div>
        </details>
      }
    />
  );
}

function Dashboard() {
  const { scenario, state, savedDraft } = useApplicantDemo();
  const action =
    scenario === "draft"
      ? {
          title: "Complete your application",
          text: "Review your sample information before submitting.",
          href: "/applicant/application",
          label: "Continue application",
        }
      : scenario === "documents"
        ? {
            title: "Prepare your physical requirements",
            text: "Your sample document appointment is scheduled.",
            href: "/applicant/application?view=requirements",
            label: "View requirements",
          }
        : scenario === "scheduled"
          ? {
              title: "Get ready for DCAT",
              text: "Your sample examination form is ready to preview.",
              href: "/applicant/dcat",
              label: "View exam schedule",
            }
          : state.exam === "passed"
            ? {
                title:
                  scenario === "passed"
                    ? "Prepare for your Registrar appointment"
                    : "Review your enrollment documents",
                text:
                  scenario === "passed"
                    ? "The next step is physical submission to the Registrar."
                    : "Sample documents are available in Enrollment.",
                href: "/applicant/enrollment",
                label: "View enrollment",
              }
            : scenario === "notQualified"
              ? {
                  title: "Your DCAT result is available",
                  text: "Read your sample result in the DCAT area.",
                  href: "/applicant/dcat?view=results",
                  label: "View result",
                }
              : scenario === "awaiting"
                ? {
                    title: "Your result is not yet available",
                    text: "The demo exam is complete. Result release is pending.",
                    href: "/applicant/dcat?view=results",
                    label: "View result status",
                  }
                : scenario === "eligible"
                  ? {
                      title: "Waiting for your DCAT schedule",
                      text: "Documents are verified in this sample journey.",
                      href: "/applicant/dcat",
                      label: "View DCAT",
                    }
                  : {
                      title: "Waiting for your document schedule",
                      text: "Your demo application has been submitted.",
                      href: "/applicant/application?view=requirements",
                      label: "View requirements",
                    };
  const schedule =
    scenario === "documents"
      ? demoSchedules.documents
      : scenario === "scheduled"
        ? demoSchedules.exam
        : scenario === "passed"
          ? demoSchedules.registrar
          : null;
  return (
    <>
      <section className="applicant-next-action">
        <div className="applicant-section-heading">
          <h2>{action.title}</h2>
          <Badge tone={state.exam === "passed" ? "success" : "info"}>
            {state.stage}
          </Badge>
        </div>
        <p>{action.text}</p>
        {schedule ? (
          <Facts
            items={[
              ["Date", schedule.date],
              ["Time · Philippine time", schedule.time],
              ["Location", schedule.location],
            ]}
          />
        ) : null}
        <div className="applicant-actions">
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
          {schedule ? (
            <span className="applicant-small">
              Sample appointment · {campusDisplay(savedDraft)}
            </span>
          ) : null}
        </div>
      </section>
      <div className="applicant-dashboard-columns">
        <section className="applicant-journey-section">
          <div className="applicant-section-heading">
            <h2>Your application journey</h2>
            <Link
              className="applicant-link"
              href="/applicant/application?view=status"
            >
              View status
            </Link>
          </div>
          <Journey
            steps={[
              "Application",
              "Documents",
              "DCAT",
              "Results",
              "Enrollment",
            ]}
            current={
              state.journey < 3 ? Math.min(state.journey, 1) : state.journey - 1
            }
            halted={scenario === "notQualified"}
            compact
          />
        </section>
        <section className="applicant-summary">
          <h2>Your application</h2>
          <Facts
            items={[
              ["Applicant ID", applicantIdentity.id],
              ["Program", programDisplay(savedDraft)],
              ["Campus", campusDisplay(savedDraft)],
            ]}
          />
          <Link className="applicant-link" href="/applicant/profile">
            View profile
          </Link>
        </section>
      </div>
      <section className="applicant-notices">
        <div className="applicant-section-heading">
          <h2>Sample notices</h2>
          <Link className="applicant-link" href="/applicant/announcements">
            View all
          </Link>
        </div>
        {announcements.slice(0, 2).map((notice) => (
          <article key={notice.id}>
            <div>
              <h3>{notice.title}</h3>
              <p>{notice.summary}</p>
            </div>
            <span>{notice.date}</span>
          </article>
        ))}
      </section>
    </>
  );
}

function Requirements() {
  const { scenario, state, savedDraft, ready, setReady } = useApplicantDemo();
  return (
    <section className="applicant-surface">
      <div className="applicant-section-heading">
        <h2>Physical requirements</h2>
        <Badge tone={state.verified ? "success" : "warning"}>
          {state.verified ? "Documents verified" : "Pending verification"}
        </Badge>
      </div>
      <p className="applicant-muted">
        Bring physical documents. This checklist does not upload or verify them.
      </p>
      {scenario === "draft" || scenario === "submitted" ? (
        <EmptyState title="No submission schedule yet">
          <p>
            {scenario === "draft"
              ? "Submit the demo application to preview the next step."
              : "Your document appointment has not been assigned."}
          </p>
        </EmptyState>
      ) : (
        <ScheduleBlock
          title="Document submission"
          schedule={{
            ...demoSchedules.documents,
            campus: campusDisplay(savedDraft),
          }}
          past={state.verified}
        />
      )}
      <ul className="applicant-requirements">
        {requirements.map((item) => (
          <li key={item.name}>
            <div>
              <h3>{item.name}</h3>
              {!state.verified ? (
                <label className="applicant-check">
                  <CheckboxInput
                    aria-label={`${item.name} ready to bring`}
                    checked={ready.includes(item.name)}
                    onChange={(event) =>
                      setReady((current) =>
                        event.target.checked
                          ? [...current, item.name]
                          : current.filter((name) => name !== item.name),
                      )
                    }
                  />
                  Ready to bring
                </label>
              ) : (
                <p>Verified in this sample scenario.</p>
              )}
            </div>
            <Badge tone={state.verified ? "success" : "neutral"}>
              {state.verified
                ? "Verified"
                : ready.includes(item.name)
                  ? "Ready"
                  : "Pending"}
            </Badge>
          </li>
        ))}
      </ul>
      <p className="applicant-small">
        “Ready” is your preparation note. Verification belongs to Admissions
        staff.
      </p>
    </section>
  );
}

function ApplicationStatus() {
  const { state, scenario } = useApplicantDemo();
  return (
    <section className="applicant-surface">
      <div className="applicant-section-heading">
        <h2>Application status</h2>
        <Badge tone={state.exam === "passed" ? "success" : "info"}>
          {state.stage}
        </Badge>
      </div>
      <Journey
        steps={journeySteps}
        current={state.journey}
        halted={scenario === "notQualified"}
      />
      <p className="applicant-small">
        Sample progress only. A scheduled appointment does not mean it was
        attended.
      </p>
    </section>
  );
}

function DcatSchedule() {
  const { state, savedDraft } = useApplicantDemo();
  if (state.exam === "unavailable")
    return (
      <EmptyState title="DCAT schedule not yet available">
        <p>
          {state.verified
            ? "Your sample documents are verified. An exam assignment is pending."
            : "Document verification comes before a DCAT assignment."}
        </p>
        <Link
          className="applicant-link"
          href="/applicant/application?view=requirements"
        >
          View requirements
        </Link>
      </EmptyState>
    );
  return (
    <section className="applicant-surface">
      <h2>DCAT examination</h2>
      <p className="applicant-muted">
        Your sample admission examination assignment.
      </p>
      <ScheduleBlock
        title="Exam schedule"
        schedule={{ ...demoSchedules.exam, campus: campusDisplay(savedDraft) }}
        past={state.exam !== "scheduled"}
      />
      <DemoDocument
        kind="DCAT"
        schedule={{ ...demoSchedules.exam, campus: campusDisplay(savedDraft) }}
      />
      <p className="applicant-small mt-4">
        Sample assignment · version 1 · 24 September 2026
      </p>
    </section>
  );
}

function DcatForm() {
  const { state, savedDraft } = useApplicantDemo();
  return state.exam === "unavailable" ? (
    <EmptyState title="DCAT form not yet available">
      <p>Your sample exam form will appear after a schedule is assigned.</p>
    </EmptyState>
  ) : (
    <section className="applicant-surface">
      <h2>Your DCAT form</h2>
      <p className="applicant-muted">
        Preview the sample form, then print or save it as a PDF.
      </p>
      <Facts
        items={[
          ["Applicant ID", applicantIdentity.id],
          ["Name", `${savedDraft.firstName} ${savedDraft.lastName}`],
          ["Version", "Demo assignment 1"],
        ]}
      />
      <DemoDocument
        kind="DCAT"
        schedule={{ ...demoSchedules.exam, campus: campusDisplay(savedDraft) }}
      />
    </section>
  );
}

function Results() {
  const { state } = useApplicantDemo();
  const passed = state.exam === "passed";
  const released = passed || state.exam === "notQualified";
  return (
    <section className="applicant-result">
      <Badge tone={passed ? "success" : "neutral"}>
        {released
          ? "Sample result released"
          : state.exam === "scheduled"
            ? "Awaiting exam"
            : "Not yet released"}
      </Badge>
      <h2>
        {passed
          ? "Passed"
          : state.exam === "notQualified"
            ? "Not Qualified"
            : "Results not yet available"}
      </h2>
      <p>
        {passed
          ? "You can now follow the sample enrollment steps."
          : state.exam === "notQualified"
            ? "This sample result does not qualify for the enrollment stage."
            : state.exam === "awaiting"
              ? "The sample exam is complete. Your result is awaiting release."
              : state.exam === "scheduled"
                ? "Your exam is scheduled. A result has not been released."
                : "Complete the document and exam stages to reach results."}
      </p>
      {passed ? (
        <Button asChild>
          <Link href="/applicant/enrollment">Proceed to enrollment</Link>
        </Button>
      ) : (
        <Link className="applicant-link" href="/applicant">
          Back to dashboard
        </Link>
      )}
      {released ? (
        <p className="applicant-small">
          Demo release · 2 October 2026. Result wording is provisional.
        </p>
      ) : null}
    </section>
  );
}

function RegistrarSchedule() {
  const { state, savedDraft } = useApplicantDemo();
  return state.enrollment < 0 ? (
    <EmptyState title="Registrar schedule not yet available">
      <p>A released Passed result comes before enrollment.</p>
    </EmptyState>
  ) : (
    <section className="applicant-surface">
      <h2>Registrar submission</h2>
      <ScheduleBlock
        title="Physical submission"
        schedule={{
          ...demoSchedules.registrar,
          campus: campusDisplay(savedDraft),
        }}
        past={state.enrollment > 1}
      />
      <p className="applicant-small">
        Fictional date, time, and desk. No real appointment has been booked.
      </p>
    </section>
  );
}

function EnrollmentDocuments() {
  const { state } = useApplicantDemo();
  return (
    <section className="applicant-surface">
      <h2>Enrollment documents</h2>
      <p className="applicant-muted">
        Sample document availability for the current demo scenario.
      </p>
      <ul className="applicant-documents">
        {(["COE", "COR"] as const).map((kind, index) => {
          const available = state.enrollment >= index + 3;
          return (
            <li key={kind}>
              <div>
                <h3>{kind}</h3>
                <p>
                  {available ? "Available · sample preview" : "Not yet issued"}
                </p>
              </div>
              {available ? (
                <DemoDocument kind={kind} />
              ) : (
                <Badge tone="neutral">Not yet available</Badge>
              )}
            </li>
          );
        })}
      </ul>
      <p className="applicant-small">
        Preview files are placeholders, not genuine issued documents.
      </p>
    </section>
  );
}

function EnrollmentProgress() {
  const { state } = useApplicantDemo();
  return (
    <section className="applicant-surface">
      <div className="applicant-section-heading">
        <h2>Enrollment progress</h2>
        <Badge tone={state.enrollment < 0 ? "neutral" : "info"}>
          {state.enrollment < 0 ? "Not yet available" : state.stage}
        </Badge>
      </div>
      {state.enrollment < 0 ? (
        <p className="applicant-muted">
          A released Passed result is needed to begin enrollment.
        </p>
      ) : (
        <p className="applicant-muted">
          {state.enrollment === 1
            ? "Next: physical submission to the Registrar."
            : state.enrollment === 3
              ? "COE is available. COR issuance is pending."
              : "COE and COR are available. Enrollment confirmation is pending."}
        </p>
      )}
      <Journey steps={enrollmentSteps} current={state.enrollment} />
      <p className="applicant-small">
        Student identity and portal access are separate. This demo assigns no
        Student ID or membership.
      </p>
    </section>
  );
}

function Announcements() {
  const [category, setCategory] = useState("All notices");
  const filtered = announcements.filter(
    (notice) => category === "All notices" || notice.category === category,
  );
  return (
    <section className="applicant-announcements">
      <div className="applicant-section-heading">
        <p className="applicant-muted">
          Fictional notices for exploring this portal concept.
        </p>
        <div>
          <label className="sr-only" htmlFor="notice-category">
            Notice category
          </label>
          <Select
            id="notice-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {[
              "All notices",
              "Application",
              "DCAT",
              "Enrollment",
              "General",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </div>
      {filtered.length ? (
        <ul>
          {filtered.map((notice) => (
            <li key={notice.id}>
              <div className="applicant-notice-meta">
                <span>Sample · {notice.category}</span>
                <time>{notice.date}</time>
              </div>
              <h2>{notice.title}</h2>
              <p>{notice.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No sample notices">
          <p>No notices in this category.</p>
          <Button variant="ghost" onClick={() => setCategory("All notices")}>
            Show all notices
          </Button>
        </EmptyState>
      )}
    </section>
  );
}

function Profile() {
  const { savedDraft, state } = useApplicantDemo();
  return (
    <section className="applicant-surface">
      <div className="applicant-profile-identity">
        <span aria-hidden="true">
          {savedDraft.firstName.slice(0, 1)}
          {savedDraft.lastName.slice(0, 1)}
        </span>
        <div>
          <h2>
            {savedDraft.firstName} {savedDraft.lastName}
          </h2>
          <p>Sample applicant · {applicantIdentity.id}</p>
        </div>
      </div>
      <section className="applicant-review-group">
        <h3>Personal</h3>
        <Facts
          items={[
            ["Name", `${savedDraft.firstName} ${savedDraft.lastName}`],
            ["Applicant ID", applicantIdentity.id],
          ]}
        />
      </section>
      <section className="applicant-review-group">
        <h3>Contact</h3>
        <Facts
          items={[
            ["Email", savedDraft.email],
            ["Mobile", savedDraft.phone],
          ]}
        />
      </section>
      <section className="applicant-review-group">
        <h3>Application</h3>
        <Facts
          items={[
            ["Campus", campusDisplay(savedDraft)],
            ["Program", programDisplay(savedDraft)],
            ...(savedDraft.major
              ? [["Major", savedDraft.major] as [string, string]]
              : []),
            ["Status", state.stage],
          ]}
        />
      </section>
      <Link className="applicant-link" href="/applicant/application">
        View application information
      </Link>
    </section>
  );
}

const pageDetails: Record<string, [string, string]> = {
  dashboard: [
    "Your next step",
    "Follow your application from admission to enrollment.",
  ],
  application: [
    "Application",
    "Review your information and admission progress.",
  ],
  dcat: ["DCAT", "Your admission examination schedule, form, and result."],
  enrollment: [
    "Enrollment",
    "Follow your Registrar appointment and document progress.",
  ],
  announcements: [
    "Announcements",
    "Sample updates for your applicant journey.",
  ],
  profile: ["Profile", "Your sample applicant information."],
};

export function ApplicantPage({
  section,
  view,
}: {
  section: string;
  view?: string;
}) {
  const [title, description] = pageDetails[section];
  return (
    <div className="applicant-experience">
      <PageHeader title={title} description={description} />
      <DemoControls />
      {section === "dashboard" ? (
        <Dashboard />
      ) : section === "application" ? (
        <Tabs
          key={`application-${view}`}
          initial={view === "requirements" ? 1 : view === "status" ? 2 : 0}
          items={[
            { label: "Application form", content: <ApplicationForm /> },
            { label: "Requirements", content: <Requirements /> },
            { label: "Status", content: <ApplicationStatus /> },
          ]}
        />
      ) : section === "dcat" ? (
        <Tabs
          key={`dcat-${view}`}
          initial={view === "results" ? 2 : 0}
          items={[
            { label: "Exam schedule", content: <DcatSchedule /> },
            { label: "DCAT form", content: <DcatForm /> },
            { label: "Results", content: <Results /> },
          ]}
        />
      ) : section === "enrollment" ? (
        <Tabs
          items={[
            { label: "Progress", content: <EnrollmentProgress /> },
            { label: "Registrar schedule", content: <RegistrarSchedule /> },
            { label: "COE / COR", content: <EnrollmentDocuments /> },
          ]}
        />
      ) : section === "announcements" ? (
        <Announcements />
      ) : (
        <Profile />
      )}
    </div>
  );
}
