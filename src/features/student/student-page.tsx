"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { StudentAcademics } from "./student-academics";
import { PageHeader } from "@/components/portal/page-header";
import { IdentitySummary } from "@/components/ui/identity";
import { DemoProfilePhotoPicker } from "@/components/ui/demo-profile-photo";
import { useStudentDemo } from "./demo-context";
import {
  formatScheduleRange,
  formatScheduleTime,
  studentDemoData,
} from "./demo-data";
import type { StudentRequest } from "./demo-data";
import "./student.css";

type DocumentKind = "COR" | "COE";

const sectionTitles: Record<string, string> = {
  dashboard: "Dashboard",
  academics: "Academics",
  enrollment: "Enrollment",
  requests: "Requests",
  announcements: "Announcements",
  calendar: "Calendar",
  profile: "Profile",
};

const sectionDescriptions: Record<string, string> = {
  academics:
    "Your schedule, subjects, grades, attendance, and sample curriculum.",
  enrollment: `${studentDemoData.term.academicYear} · ${studentDemoData.term.semester}`,
  requests: "Additional copies of your sample enrollment documents.",
  announcements: "Fictional notices for this portal demonstration.",
  calendar: "Sample classes and illustrative dates.",
  profile: "Read-only sample student information.",
};

function DashboardPage() {
  const todayMeetings = studentDemoData.schedule
    .filter((meeting) => meeting.day === studentDemoData.today.day)
    .sort((a, b) => a.start.localeCompare(b.start));
  const nextClass = studentDemoData.schedule.find(
    (meeting) => meeting.id === studentDemoData.today.nextClassId,
  );
  const nextSubject = studentDemoData.subjects.find(
    (subject) => subject.id === nextClass?.subjectId,
  );
  const recentGrade = studentDemoData.grades.find(
    (grade) => grade.status === "Released",
  );
  const recentAnnouncement = studentDemoData.announcements[0];

  return (
    <>
      <div className="student-dashboard-grid">
        <section
          className="student-next-class"
          aria-labelledby="next-class-title"
        >
          <div>
            <p className="student-section-label">Next class</p>
            {nextClass && nextSubject ? (
              <>
                <h2 id="next-class-title">{nextSubject.title}</h2>
                <p className="student-class-code">
                  {nextSubject.code} · {studentDemoData.term.section}
                </p>
                <p className="student-next-class-time">
                  {formatScheduleRange(nextClass.start, nextClass.end)}
                </p>
                <p className="student-next-class-room">
                  {nextClass.room} · {nextSubject.instructor}
                </p>
              </>
            ) : (
              <div className="student-empty-state" id="next-class-title">
                <h2>No upcoming class</h2>
                <p>There are no more sample classes today.</p>
              </div>
            )}
          </div>
          <Link
            className="student-text-link"
            href="/student/academics?view=schedule"
          >
            View schedule
          </Link>
        </section>

        <section
          className="student-dashboard-surface"
          aria-labelledby="today-title"
        >
          <div className="student-section-heading">
            <h2 id="today-title">Today</h2>
            <time dateTime={studentDemoData.today.date}>
              {new Intl.DateTimeFormat("en", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(new Date(`${studentDemoData.today.date}T12:00:00`))}
            </time>
          </div>
          {todayMeetings.length ? (
            <ol className="student-today-list">
              {todayMeetings.map((meeting) => {
                const subject = studentDemoData.subjects.find(
                  (item) => item.id === meeting.subjectId,
                );
                if (!subject) return null;
                return (
                  <li key={meeting.id}>
                    <time>
                      {formatScheduleRange(meeting.start, meeting.end)}
                    </time>
                    <div>
                      <strong>{subject.title}</strong>
                      <span>{meeting.room}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="student-empty-state">
              No class is scheduled for this sample day.
            </p>
          )}
        </section>

        <section
          className="student-dashboard-surface"
          aria-labelledby="enrollment-title"
        >
          <div className="student-section-heading">
            <h2 id="enrollment-title">Enrollment</h2>
            <span className="student-status" data-state="current">
              Enrolled
            </span>
          </div>
          <p className="student-enrollment-term">
            AY {studentDemoData.term.academicYear} ·{" "}
            {studentDemoData.term.semester}
          </p>
          <div className="student-enrollment-document">
            <span>COR</span>
            <span className="student-status" data-state="released">
              Sample available
            </span>
          </div>
          <Link className="student-text-link" href="/student/enrollment">
            View enrollment
          </Link>
        </section>

        <section
          className="student-dashboard-surface"
          aria-labelledby="recent-title"
        >
          <div className="student-section-heading">
            <h2 id="recent-title">Recent</h2>
          </div>
          <ul className="student-recent-list">
            {recentGrade ? (
              <li>
                <span className="student-recent-kind">Grade released</span>
                <span>
                  {recentGrade.code} · {recentGrade.grade}
                </span>
              </li>
            ) : null}
            {recentAnnouncement ? (
              <li>
                <span className="student-recent-kind">Campus notice</span>
                <Link href="/student/announcements">
                  {recentAnnouncement.title}
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </>
  );
}

function EnrollmentPage() {
  const [activeDocument, setActiveDocument] = useState<DocumentKind | null>(
    null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const document = activeDocument
    ? studentDemoData.documents[activeDocument]
    : null;

  function openDocument(kind: DocumentKind) {
    setActiveDocument(kind);
    dialogRef.current?.showModal();
  }

  function closeDocument() {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }

  return (
    <section
      className="student-enrollment-page"
      aria-label="Sample enrollment information"
    >
      <section
        className="student-enrollment-summary"
        aria-labelledby="enrollment-status-title"
      >
        <div>
          <p className="student-section-label">Current status</p>
          <h2 id="enrollment-status-title">Enrolled</h2>
          <p>
            AY {studentDemoData.term.academicYear} ·{" "}
            {studentDemoData.term.semester}
          </p>
        </div>
        <span className="student-status" data-state="current">
          Active student
        </span>
      </section>

      <section aria-labelledby="enrollment-documents-title">
        <div className="student-panel-heading">
          <div>
            <h2 id="enrollment-documents-title">Enrollment documents</h2>
            <p>Sample previews for demonstration only.</p>
          </div>
        </div>
        <ul className="student-document-list">
          {(["COR", "COE"] as const).map((kind) => {
            const item = studentDemoData.documents[kind];
            return (
              <li className="student-document-row" key={kind}>
                <div>
                  <p className="student-document-kind">{kind}</p>
                  <h3>{item.title}</h3>
                  <p>{item.term}</p>
                  <span
                    className="student-status"
                    data-state={item.available ? "released" : "pending"}
                  >
                    {item.available ? "Sample available" : "Not yet available"}
                  </span>
                </div>
                {item.available ? (
                  <button
                    type="button"
                    className="student-button student-button-primary"
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      openDocument(kind);
                    }}
                  >
                    View sample {kind}
                  </button>
                ) : (
                  <p className="student-muted">
                    This sample document is not available.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <dialog
        ref={dialogRef}
        className="student-modal student-document-modal"
        aria-labelledby="student-document-title"
        onClose={() => {
          setActiveDocument(null);
          triggerRef.current?.focus();
        }}
      >
        {activeDocument && document ? (
          <>
            <div className="student-dialog-actions">
              <button
                type="button"
                className="student-button student-button-secondary"
                onClick={() => window.print()}
              >
                Print / Save as PDF
              </button>
              <button
                type="button"
                className="student-button student-button-secondary"
                onClick={closeDocument}
              >
                Close preview
              </button>
            </div>
            <article className="student-print-preview">
              <p className="student-sample-stamp">
                Sample · Not valid for official use
              </p>
              <h2 id="student-document-title">{document.title}</h2>
              <p className="student-document-term">{document.term}</p>
              <dl className="student-document-details">
                <div>
                  <dt>Student</dt>
                  <dd>{studentDemoData.identity.fullName}</dd>
                </div>
                <div>
                  <dt>Student ID</dt>
                  <dd>{studentDemoData.identity.studentId}</dd>
                </div>
                <div>
                  <dt>Program</dt>
                  <dd>{studentDemoData.identity.program}</dd>
                </div>
                <div>
                  <dt>Campus</dt>
                  <dd>{studentDemoData.identity.campus}</dd>
                </div>
              </dl>
              {activeDocument === "COR" ? (
                <>
                  <h3>Sample registered subjects</h3>
                  <ul className="student-print-subjects">
                    {studentDemoData.subjects.map((subject) => (
                      <li key={subject.id}>
                        <span>{subject.code}</span>
                        <span>{subject.title}</span>
                        <span>{subject.units} units</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="student-document-body">
                  This fictional preview demonstrates a Certificate of
                  Enrollment layout. It is not an issued school record.
                </p>
              )}
              <p className="student-document-disclaimer">
                Fictional demonstration content. No official record or school
                document has been generated.
              </p>
            </article>
          </>
        ) : null}
      </dialog>
    </section>
  );
}

function RequestDialog({
  onSubmit,
}: {
  onSubmit: (document: StudentRequest["document"]) => void;
}) {
  const [document, setDocument] = useState<StudentRequest["document"]>("COE");
  const [step, setStep] = useState<"choose" | "review">("choose");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openDialog() {
    setStep("choose");
    setDocument("COE");
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="student-button student-button-primary"
        onClick={openDialog}
      >
        New request
      </button>
      <dialog
        ref={dialogRef}
        className="student-modal"
        aria-labelledby="request-dialog-title"
        onClose={() => {
          setStep("choose");
          triggerRef.current?.focus();
        }}
      >
        <div className="student-modal-header">
          <h2 id="request-dialog-title">Request a document copy</h2>
          <button
            type="button"
            className="student-button student-button-secondary"
            onClick={closeDialog}
          >
            Close
          </button>
        </div>
        {step === "choose" ? (
          <div className="student-request-step">
            <label htmlFor="request-document">Document</label>
            <select
              id="request-document"
              value={document}
              onChange={(event) =>
                setDocument(event.target.value as StudentRequest["document"])
              }
            >
              <option value="COE">Additional copy of COE</option>
              <option value="COR">Additional copy of COR</option>
            </select>
            <p>Review the request before adding it to this demo list.</p>
            <button
              type="button"
              className="student-button student-button-primary"
              onClick={() => setStep("review")}
            >
              Review request
            </button>
          </div>
        ) : (
          <div className="student-request-step">
            <p>Additional copy of {document}</p>
            <p className="student-request-review-name">
              {studentDemoData.documents[document].title}
            </p>
            <p className="student-policy-note">
              This demo request stays in this browser session. It is not sent to
              the school.
            </p>
            <div className="student-dialog-actions">
              <button
                type="button"
                className="student-button student-button-secondary"
                onClick={() => setStep("choose")}
              >
                Back
              </button>
              <button
                type="button"
                className="student-button student-button-primary"
                onClick={() => {
                  onSubmit(document);
                  closeDialog();
                }}
              >
                Submit demo request
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function RequestsPage() {
  const { requests, addRequest, cancelRequest } = useStudentDemo();
  const [notice, setNotice] = useState("");

  function handleSubmit(document: StudentRequest["document"]) {
    addRequest(document);
    setNotice(
      `Demo request for an additional ${document} copy added as Pending.`,
    );
  }

  return (
    <section
      className="student-requests-page"
      aria-labelledby="requests-list-title"
    >
      <div className="student-page-actions">
        <p>Request additional copies of your sample COE or COR.</p>
        <RequestDialog onSubmit={handleSubmit} />
      </div>
      {notice ? (
        <p className="student-live-message" role="status">
          {notice}
        </p>
      ) : null}
      <h2 id="requests-list-title" className="student-list-title">
        My requests
      </h2>
      {requests.length ? (
        <ul className="student-request-list">
          {requests.map((request) => (
            <li className="student-request-row" key={request.id}>
              <div>
                <p className="student-subject-code">{request.id}</p>
                <h3>Additional copy of {request.document}</h3>
                <p>Added {request.submittedOn}</p>
              </div>
              <div className="student-request-actions">
                <span
                  className="student-status"
                  data-state={request.status.toLowerCase()}
                >
                  {request.status}
                </span>
                {request.status === "Pending" ? (
                  <button
                    type="button"
                    className="student-text-button"
                    onClick={() => cancelRequest(request.id)}
                  >
                    Cancel demo request
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="student-empty-state">
          No request history yet. Choose New request to preview a document-copy
          request.
        </p>
      )}
    </section>
  );
}

function AnnouncementsPage() {
  const categories = ["All", "Institution", "Campus", "Program", "Class"];
  const [category, setCategory] = useState("All");
  const announcements = studentDemoData.announcements.filter(
    (item) => category === "All" || item.category === category,
  );

  return (
    <section
      className="student-announcements-page"
      aria-labelledby="announcement-list-title"
    >
      <div className="student-filter-row student-announcement-filter">
        <label>
          <span>Audience</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <h2 id="announcement-list-title" className="sr-only">
        Sample announcements
      </h2>
      {announcements.length ? (
        <ul className="student-announcement-list">
          {announcements.map((item) => (
            <li key={item.id}>
              <div className="student-announcement-meta">
                <span className="student-status" data-state="information">
                  {item.category}
                </span>
                <time>{item.date}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="student-empty-state">
          <p>No sample announcements for this audience.</p>
          <button
            type="button"
            className="student-text-button"
            onClick={() => setCategory("All")}
          >
            Show all notices
          </button>
        </div>
      )}
    </section>
  );
}

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sampleEventCountLabel(count: number) {
  return `${count} sample ${count === 1 ? "event" : "events"}`;
}

function startOfWeek(date: Date) {
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
  );
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  return start;
}

function CalendarPage() {
  const initialDate = new Date(`${studentDemoData.today.date}T12:00:00`);
  const [selectedDate, setSelectedDate] = useState<string>(
    studentDemoData.today.date,
  );
  const [month, setMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 12),
  );
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
    12,
  ).getDate();
  const monthOffset = (monthStart.getDay() + 6) % 7;
  const cellCount = Math.ceil((monthOffset + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const day = index - monthOffset + 1;
    return day < 1 || day > daysInMonth
      ? null
      : new Date(month.getFullYear(), month.getMonth(), day, 12);
  });
  const calendarRows = Array.from({ length: cellCount / 7 }, (_, row) =>
    cells.slice(row * 7, row * 7 + 7),
  );
  const selected = new Date(`${selectedDate}T12:00:00`);
  const weekStart = startOfWeek(selected);
  const agendaDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const selectedEvents = studentDemoData.calendarEvents
    .filter((event) => event.date === selectedDate)
    .sort((first, second) => first.time.localeCompare(second.time));

  function changeMonth(offset: number) {
    const next = new Date(
      month.getFullYear(),
      month.getMonth() + offset,
      1,
      12,
    );
    setMonth(next);
    setSelectedDate(isoDate(next));
  }

  function changeWeek(offset: number) {
    const next = new Date(selected);
    next.setDate(next.getDate() + offset * 7);
    setSelectedDate(isoDate(next));
    setMonth(new Date(next.getFullYear(), next.getMonth(), 1, 12));
  }

  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(month);
  const selectedLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selected);

  return (
    <section
      className="student-calendar-page"
      aria-label="Sample student calendar"
    >
      <div className="student-calendar-toolbar">
        <h2>{monthLabel}</h2>
        <div className="student-week-controls student-calendar-month-controls">
          <button
            type="button"
            className="student-button student-button-secondary"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="student-button student-button-secondary"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            Next
          </button>
        </div>
      </div>
      <div className="student-calendar-layout">
        <div
          className="student-month-calendar"
          role="grid"
          aria-label={`${monthLabel} sample calendar`}
        >
          <div className="student-calendar-row" role="row">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                className="student-calendar-weekday"
                role="columnheader"
                key={day}
              >
                {day}
              </div>
            ))}
          </div>
          {calendarRows.map((row, rowIndex) => (
            <div
              className="student-calendar-row"
              role="row"
              key={`week-${rowIndex}`}
            >
              {row.map((date, index) => {
                if (!date)
                  return (
                    <div
                      className="student-calendar-blank"
                      role="gridcell"
                      key={`blank-${rowIndex}-${index}`}
                    />
                  );
                const value = isoDate(date);
                const eventCount = studentDemoData.calendarEvents.filter(
                  (event) => event.date === value,
                ).length;
                return (
                  <div
                    className="student-calendar-cell"
                    role="gridcell"
                    key={value}
                  >
                    <button
                      type="button"
                      aria-pressed={selectedDate === value}
                      aria-label={`${new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long" }).format(date)}${eventCount ? `, ${sampleEventCountLabel(eventCount)}` : ", no sample events"}`}
                      className="student-calendar-day"
                      onClick={() => setSelectedDate(value)}
                    >
                      <span>{date.getDate()}</span>
                      {eventCount ? (
                        <span className="student-calendar-count">
                          {eventCount} {eventCount === 1 ? "event" : "events"}
                        </span>
                      ) : null}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="student-calendar-agenda">
          <div className="student-mobile-week-controls">
            <button
              type="button"
              className="student-text-button"
              onClick={() => changeWeek(-1)}
            >
              Previous week
            </button>
            <button
              type="button"
              className="student-text-button"
              onClick={() => changeWeek(1)}
            >
              Next week
            </button>
          </div>
          <div
            className="student-mobile-date-picker"
            aria-label="Choose a calendar date"
          >
            {agendaDates.map((date) => {
              const value = isoDate(date);
              const count = studentDemoData.calendarEvents.filter(
                (event) => event.date === value,
              ).length;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selectedDate === value}
                  aria-label={`${new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date)}${count ? `, ${sampleEventCountLabel(count)}` : ", no sample events"}`}
                  className="student-day-button"
                  onClick={() => setSelectedDate(value)}
                >
                  <span>
                    {new Intl.DateTimeFormat("en", { weekday: "short" }).format(
                      date,
                    )}
                  </span>
                  <span>{date.getDate()}</span>
                  {count ? (
                    <span
                      className="student-date-event-indicator"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <h3>{selectedLabel}</h3>
          {selectedEvents.length ? (
            <ul className="student-calendar-event-list">
              {selectedEvents.map((event) => (
                <li key={event.id}>
                  <time dateTime={event.time}>
                    {formatScheduleTime(event.time)}
                  </time>
                  <div>
                    <span
                      className="student-status"
                      data-state={
                        event.category === "Class" ? "current" : "information"
                      }
                    >
                      {event.category}
                    </span>
                    <h4>{event.title}</h4>
                    <p>{event.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="student-empty-state">
              No sample events for this date.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ProfilePage() {
  const identity = studentDemoData.identity;
  const { profilePhoto, setProfilePhoto } = useStudentDemo();
  const groups = [
    {
      title: "Personal",
      rows: [
        ["Name", identity.fullName],
        ["Email", identity.email],
        ["Student ID", identity.studentId],
      ],
    },
    {
      title: "Academic",
      rows: [
        ["Program", identity.program],
        ["Campus", identity.campus],
        ["Year level", identity.yearLevel],
        ["Status", identity.academicStatus],
        ["Academic year", studentDemoData.term.academicYear],
        ["Semester", studentDemoData.term.semester],
      ],
    },
  ];

  return (
    <section
      className="student-profile-page"
      aria-label="Read-only student profile"
    >
      <div className="student-profile-identity">
        <IdentitySummary
          name={identity.fullName}
          detail={`${identity.studentId} · ${identity.yearLevel} · ${identity.campus}`}
          src={profilePhoto}
          size="large"
          avatar={
            <DemoProfilePhotoPicker
              id="student-profile-photo"
              name={identity.fullName}
              src={profilePhoto}
              onSelect={setProfilePhoto}
              domain
            />
          }
        />
      </div>
      <p className="student-policy-note">
        Fictional, read-only identity. The Student ID is separate from any
        Applicant ID. Sample school profile. Your sign-in identity is in{" "}
        <Link href="/account">Account profile</Link>.
      </p>
      {groups.map((group) => (
        <section
          className="student-profile-group"
          key={group.title}
          aria-labelledby={`profile-${group.title.toLowerCase()}`}
        >
          <h2 id={`profile-${group.title.toLowerCase()}`}>{group.title}</h2>
          <dl>
            {group.rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </section>
  );
}

export function StudentPage({
  section,
  view,
}: {
  section: string;
  view?: string;
}) {
  const isDashboard = section === "dashboard";
  const title = isDashboard
    ? `Good morning, ${studentDemoData.identity.firstName}.`
    : (sectionTitles[section] ?? "Student portal");
  const description = isDashboard
    ? `${studentDemoData.identity.program} · ${studentDemoData.identity.yearLevel} · ${studentDemoData.identity.campus} · AY ${studentDemoData.term.academicYear} · ${studentDemoData.term.semester}`
    : sectionDescriptions[section];

  return (
    <div
      className="student-experience"
      data-layout={
        section === "profile"
          ? "detail"
          : section === "academics"
            ? "wide"
            : "personal"
      }
      data-section={section}
    >
      <PageHeader title={title} description={description} density="personal" />
      <div className="student-page-content">
        {section === "dashboard" ? <DashboardPage /> : null}
        {section === "academics" ? (
          <StudentAcademics initialView={view} />
        ) : null}
        {section === "enrollment" ? <EnrollmentPage /> : null}
        {section === "requests" ? <RequestsPage /> : null}
        {section === "announcements" ? <AnnouncementsPage /> : null}
        {section === "calendar" ? <CalendarPage /> : null}
        {section === "profile" ? <ProfilePage /> : null}
      </div>
    </div>
  );
}
