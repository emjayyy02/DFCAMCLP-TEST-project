"use client";

import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { DemoNotice } from "@/components/ui/demo-notice";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAcademicDemo } from "./demo-context";
import {
  academicDemoData,
  countAttendanceRecords,
  formatAcademicDate,
  formatAcademicTime,
  getFaculty,
  getMissingGradeStudentIds,
  getOffering,
  getOfferingRoster,
  getOfferingsForFaculty,
  getSubject,
} from "./demo-data";
import type {
  AcademicAnnouncement,
  AcademicOffering,
  AttendanceValue,
} from "./demo-data";
import "./academic.css";

type AcademicPageProps = {
  section: string;
  isCoordinator: boolean;
  offeringId?: string;
  date?: string;
};

const sectionTitles: Record<string, string> = {
  dashboard: "Academic portal",
  classes: "Teaching",
  attendance: "Attendance",
  grades: "Grades",
  announcements: "Announcements",
  management: "Academic management",
};

function courseLabel(offering: AcademicOffering) {
  const subject = getSubject(offering.subjectId);
  return subject ? `${subject.code} · ${subject.title}` : "Sample offering";
}

function courseHref(section: string, offeringId: string) {
  return `/academic/${section}?offering=${encodeURIComponent(offeringId)}`;
}

const sectionDescriptions: Record<string, string> = {
  dashboard: "Your teaching day, follow-up work, and academic updates.",
  classes: "Assigned offerings, class schedules, and sample rosters.",
  attendance: "Record attendance for a sample class meeting.",
  grades: "Enter and submit sample final grades for an assigned class.",
  announcements: "Fictional notices for the Academic portal demonstration.",
  management: "A read-only view of sample program offerings and assignments.",
};

function SectionHeading({
  id,
  eyebrow,
  title,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="academic-section-heading">
      <div>
        {eyebrow ? <p className="academic-eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function offeringSchedule(offering: AcademicOffering) {
  return offering.schedule
    .map(
      (slot) =>
        `${slot.day.slice(0, 3)} ${formatAcademicTime(slot.start)}–${formatAcademicTime(slot.end)}`,
    )
    .join(" · ");
}

function getAssignedOfferings(isCoordinator: boolean) {
  const facultyId = isCoordinator
    ? academicDemoData.identities.coordinator.facultyId
    : academicDemoData.identities.faculty.facultyId;
  return getOfferingsForFaculty(facultyId);
}

function DashboardView({ isCoordinator }: { isCoordinator: boolean }) {
  const { attendanceSessions, gradeBooks, activity } = useAcademicDemo();
  const assigned = getAssignedOfferings(isCoordinator);
  const today = academicDemoData.today;
  const todaysOfferings = assigned
    .filter((offering) =>
      offering.schedule.some((slot) => slot.day === today.day),
    )
    .sort((a, b) => {
      const aStart =
        a.schedule.find((slot) => slot.day === today.day)?.start ?? "";
      const bStart =
        b.schedule.find((slot) => slot.day === today.day)?.start ?? "";
      return aStart.localeCompare(bStart);
    });
  const incompleteGrades = assigned.filter((offering) => {
    const book = gradeBooks[offering.id];
    if (book?.status === "Submitted") return false;
    return (
      getMissingGradeStudentIds(offering.studentIds, book?.grades ?? {})
        .length > 0
    );
  });
  const todayAttendance = attendanceSessions.filter(
    (session) =>
      session.date === today.date &&
      assigned.some((item) => item.id === session.offeringId),
  );
  const announcement = academicDemoData.announcements.find(
    (item) => item.audience === "Campus" || item.audience === "Program",
  );
  const latestActivity = activity.filter((item) =>
    assigned.some((offering) => offering.id === item.offeringId),
  );
  const coordinatorCounts = {
    offerings: academicDemoData.offerings.length,
    faculty: new Set(academicDemoData.offerings.map((item) => item.facultyId))
      .size,
    students: new Set(
      academicDemoData.offerings.flatMap((item) => item.studentIds),
    ).size,
  };

  return (
    <div className="academic-view">
      <section
        className="academic-welcome"
        aria-labelledby="academic-welcome-title"
      >
        <div>
          <p className="academic-eyebrow">
            {isCoordinator ? "Program coordination" : "Faculty workspace"}
          </p>
          <h2 id="academic-welcome-title">
            {isCoordinator
              ? `Good morning, ${academicDemoData.identities.coordinator.name}.`
              : `Good morning, ${academicDemoData.identities.faculty.name}.`}
          </h2>
          <p>
            BSIS — Bachelor of Science in Information Systems{" "}
            <span aria-hidden="true">·</span> IIT Campus
          </p>
        </div>
        <time dateTime={today.date}>
          {new Intl.DateTimeFormat("en", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(new Date(`${today.date}T12:00:00Z`))}
        </time>
      </section>

      {isCoordinator ? (
        <section
          className="academic-program-summary"
          aria-labelledby="program-summary-title"
        >
          <div>
            <p className="academic-eyebrow">Program snapshot</p>
            <h2 id="program-summary-title">
              BSIS — Bachelor of Science in Information Systems
            </h2>
          </div>
          <dl>
            <div>
              <dt>Sample offerings</dt>
              <dd>{coordinatorCounts.offerings}</dd>
            </div>
            <div>
              <dt>Faculty assigned</dt>
              <dd>{coordinatorCounts.faculty}</dd>
            </div>
            <div>
              <dt>Students in section</dt>
              <dd>{coordinatorCounts.students}</dd>
            </div>
          </dl>
          <Link href="/academic/management">
            Review program offerings <span aria-hidden="true">→</span>
          </Link>
        </section>
      ) : null}

      <div className="academic-dashboard-grid">
        <section
          className="academic-panel academic-today-panel"
          aria-labelledby="today-classes-title"
        >
          <SectionHeading
            id="today-classes-title"
            eyebrow="Friday schedule"
            title="Today’s classes"
          />
          {todaysOfferings.length ? (
            <ol className="academic-today-list">
              {todaysOfferings.map((offering) => {
                const slot = offering.schedule.find(
                  (item) => item.day === today.day,
                );
                if (!slot) return null;
                return (
                  <li key={offering.id}>
                    <time>{formatAcademicTime(slot.start)}</time>
                    <div>
                      <Link href={courseHref("classes", offering.id)}>
                        {courseLabel(offering)}
                      </Link>
                      <span>
                        {offering.section} · {slot.room} ·{" "}
                        {formatAcademicTime(slot.start)}–
                        {formatAcademicTime(slot.end)}
                      </span>
                    </div>
                    <Link
                      className="academic-row-action"
                      href={courseHref("attendance", offering.id)}
                    >
                      Attendance
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="academic-empty">
              No sample class meetings are scheduled for today.
            </p>
          )}
          <Link className="academic-inline-link" href="/academic/classes">
            View all teaching
          </Link>
        </section>

        <section className="academic-panel" aria-labelledby="follow-up-title">
          <SectionHeading
            id="follow-up-title"
            eyebrow="Follow-up"
            title="Teaching tasks"
          />
          <ul className="academic-task-list">
            {assigned.map((offering) => {
              const book = gradeBooks[offering.id];
              const missing = getMissingGradeStudentIds(
                offering.studentIds,
                book?.grades ?? {},
              ).length;
              const attendanceSaved = todayAttendance.some(
                (item) => item.offeringId === offering.id,
              );
              return (
                <li key={offering.id}>
                  <div>
                    <strong>
                      {getSubject(offering.subjectId)?.code} ·{" "}
                      {book?.status === "Submitted"
                        ? "Grades submitted"
                        : `${missing} grade${missing === 1 ? "" : "s"} incomplete`}
                    </strong>
                    <span>{courseLabel(offering)}</span>
                  </div>
                  <Link href={courseHref("grades", offering.id)}>
                    {book?.status === "Submitted" ? "View" : "Open grades"}
                  </Link>
                  <div>
                    <strong>
                      {attendanceSaved
                        ? "Attendance saved"
                        : "Attendance not saved today"}
                    </strong>
                    <span>
                      {offering.section} · {today.date}
                    </span>
                  </div>
                  <Link
                    href={`/academic/attendance?offering=${encodeURIComponent(offering.id)}&date=${today.date}`}
                  >
                    {attendanceSaved ? "Review" : "Take attendance"}
                  </Link>
                </li>
              );
            })}
            {!assigned.length ? (
              <li className="academic-empty">
                No classes are assigned in this sample role.
              </li>
            ) : null}
          </ul>
          {incompleteGrades.length ? (
            <p className="academic-note">
              Final-grade completeness is checked before submission. No grading
              formula is assumed.
            </p>
          ) : null}
        </section>

        <section
          className="academic-panel"
          aria-labelledby="recent-activity-title"
        >
          <SectionHeading
            id="recent-activity-title"
            eyebrow="This demo session"
            title="Recent activity"
          />
          {latestActivity.length ? (
            <ul className="academic-activity-list">
              {latestActivity.slice(0, 4).map((item) => {
                const offering = getOffering(item.offeringId);
                if (!offering) return null;
                return (
                  <li key={item.id}>
                    <span
                      className="academic-activity-marker"
                      aria-hidden="true"
                    />
                    <div>
                      <strong>{item.label}</strong>
                      <span>
                        {courseLabel(offering)} · {item.date}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="academic-empty">
              Your changes in this session will appear here. They reset when you
              refresh.
            </p>
          )}
        </section>

        <section
          className="academic-panel academic-announcement-preview"
          aria-labelledby="academic-notice-title"
        >
          <SectionHeading
            id="academic-notice-title"
            eyebrow="Academic notice"
            title={announcement?.title ?? "No sample notices"}
          />
          {announcement ? (
            <>
              <p>{announcement.summary}</p>
              <span className="academic-audience">
                {announcement.audienceLabel} · {announcement.date}
              </span>
            </>
          ) : null}
          <Link className="academic-inline-link" href="/academic/announcements">
            View announcements
          </Link>
        </section>
      </div>
    </div>
  );
}

function TeachingView({
  isCoordinator,
  offeringId,
}: {
  isCoordinator: boolean;
  offeringId?: string;
}) {
  const [rosterQuery, setRosterQuery] = useState("");
  const offerings =
    isCoordinator && offeringId
      ? academicDemoData.offerings
      : getAssignedOfferings(isCoordinator);
  const selected = offerings.find((item) => item.id === offeringId);
  if (selected) {
    const subject = getSubject(selected.subjectId);
    const faculty = getFaculty(selected.facultyId);
    const students = getOfferingRoster(selected.id);
    const canTeachOffering =
      selected.facultyId ===
      (isCoordinator
        ? academicDemoData.identities.coordinator.facultyId
        : academicDemoData.identities.faculty.facultyId);
    const visibleStudents = students.filter((student) =>
      `${student.name} ${student.studentId}`
        .toLowerCase()
        .includes(rosterQuery.trim().toLowerCase()),
    );
    return (
      <div className="academic-view">
        <Link className="academic-back-link" href="/academic/classes">
          ← All teaching
        </Link>
        <section className="academic-panel academic-class-detail">
          <div className="academic-detail-title">
            <div>
              <p className="academic-eyebrow">
                {selected.section} · {selected.program}
              </p>
              <h2>
                {subject?.code} · {subject?.title}
              </h2>
              <p>{academicDemoData.term.label}</p>
            </div>
            <span className="academic-detail-units">
              {subject?.units} units
            </span>
          </div>
          <dl className="academic-facts-grid">
            <div>
              <dt>Instructor</dt>
              <dd>{faculty?.name}</dd>
            </div>
            <div>
              <dt>Campus</dt>
              <dd>{selected.campus}</dd>
            </div>
            <div>
              <dt>Schedule</dt>
              <dd>{offeringSchedule(selected)}</dd>
            </div>
            <div>
              <dt>Class size</dt>
              <dd>{students.length} sample students</dd>
            </div>
          </dl>
          {canTeachOffering ? (
            <div className="academic-action-row">
              <Link
                className="academic-button"
                href={courseHref("attendance", selected.id)}
              >
                Take attendance
              </Link>
              <Link
                className="academic-button academic-button-secondary"
                href={courseHref("grades", selected.id)}
              >
                Open grade entry
              </Link>
            </div>
          ) : (
            <p className="academic-note">
              Coordinator view: this sample roster is read-only. Teaching
              actions are available only for offerings assigned to your account.
            </p>
          )}
        </section>
        <section className="academic-panel" aria-labelledby="roster-title">
          <SectionHeading
            id="roster-title"
            eyebrow="Fictional roster"
            title="Enrolled students"
            action={
              <label className="academic-roster-search">
                <span>Search roster</span>
                <input
                  type="search"
                  value={rosterQuery}
                  onChange={(event) => setRosterQuery(event.target.value)}
                  placeholder="Name or student ID"
                />
              </label>
            }
          />
          <p className="academic-result-count" aria-live="polite">
            Showing {visibleStudents.length} of {students.length} sample
            students
          </p>
          <div className="academic-roster-table-wrap">
            <table className="academic-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Section</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id}>
                    <th scope="row">{student.name}</th>
                    <td>{student.studentId}</td>
                    <td>{student.section}</td>
                    <td>
                      <span className="academic-status">{student.status}</span>
                    </td>
                  </tr>
                ))}
                {!visibleStudents.length ? (
                  <tr>
                    <td colSpan={4}>No students match this search.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <ul className="academic-roster-cards">
            {visibleStudents.map((student) => (
              <li key={student.id}>
                <strong>{student.name}</strong>
                <span>{student.studentId}</span>
                <span>
                  {student.section} · {student.status}
                </span>
              </li>
            ))}
            {!visibleStudents.length ? (
              <li className="academic-empty">No students match this search.</li>
            ) : null}
          </ul>
          <p className="academic-note">
            All names and student identifiers on this page are fictional demo
            data.
          </p>
        </section>
      </div>
    );
  }

  return (
    <section className="academic-panel" aria-labelledby="teaching-list-title">
      <SectionHeading
        id="teaching-list-title"
        eyebrow="Assigned offerings"
        title="Your teaching"
      />
      {offerings.length ? (
        <div className="academic-offering-list">
          {offerings.map((offering) => {
            const subject = getSubject(offering.subjectId);
            const faculty = getFaculty(offering.facultyId);
            return (
              <article className="academic-offering-row" key={offering.id}>
                <div className="academic-offering-code">{subject?.code}</div>
                <div className="academic-offering-main">
                  <h3>{subject?.title}</h3>
                  <p>
                    {offering.section} · {offering.program}
                  </p>
                </div>
                <div className="academic-offering-meta">
                  <span>{offeringSchedule(offering)}</span>
                  <span>
                    {faculty?.name} · {getOfferingRoster(offering.id).length}{" "}
                    students
                  </span>
                </div>
                <Link
                  className="academic-offering-open"
                  href={courseHref("classes", offering.id)}
                >
                  Open class <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="academic-empty">
          There are no sample offerings assigned to this account.
        </p>
      )}
    </section>
  );
}

const attendanceLabels: AttendanceValue[] = [
  "Unmarked",
  "Present",
  "Late",
  "Absent",
];

function AttendanceView({
  isCoordinator,
  offeringId,
  date,
}: {
  isCoordinator: boolean;
  offeringId?: string;
  date?: string;
}) {
  const offerings = getAssignedOfferings(isCoordinator);
  const [selectedId, setSelectedId] = useState(
    offerings.some((item) => item.id === offeringId)
      ? offeringId!
      : (offerings[0]?.id ?? ""),
  );
  const selectedOffering = offerings.find((item) => item.id === selectedId);
  const availableDates: string[] =
    selectedOffering?.meetingDates.map((item) => item.date) ?? [];
  const initialDate =
    date && availableDates.includes(date) ? date : academicDemoData.today.date;
  const [selectedDate, setSelectedDate] = useState(
    availableDates.includes(initialDate)
      ? initialDate
      : (availableDates.at(-1) ?? ""),
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const {
    attendanceSessions,
    getAttendanceRecords,
    setAttendanceRecord,
    saveAttendance,
  } = useAcademicDemo();
  const students = selectedOffering
    ? getOfferingRoster(selectedOffering.id)
    : [];
  const records = selectedOffering
    ? getAttendanceRecords(selectedOffering.id, selectedDate)
    : {};
  const counts = countAttendanceRecords(records);
  const alreadySaved = attendanceSessions.some(
    (session) =>
      session.offeringId === selectedId && session.date === selectedDate,
  );
  const selectedMeeting = selectedOffering?.meetingDates.find(
    (meeting) => meeting.date === selectedDate,
  );
  const history = attendanceSessions
    .filter((session) =>
      offerings.some((item) => item.id === session.offeringId),
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  function changeOffering(nextId: string) {
    setSelectedId(nextId);
    const next = offerings.find((item) => item.id === nextId);
    setSelectedDate(
      next?.meetingDates.some(
        (item) => item.date === academicDemoData.today.date,
      )
        ? academicDemoData.today.date
        : (next?.meetingDates.at(-1)?.date ?? ""),
    );
    setSavedNotice(false);
  }

  function confirmSave() {
    if (!selectedOffering || alreadySaved) return;
    saveAttendance(selectedOffering.id, selectedDate, records);
    setReviewOpen(false);
    setSavedNotice(true);
  }

  return (
    <div className="academic-view">
      <section
        className="academic-panel"
        aria-labelledby="attendance-encoder-title"
      >
        <SectionHeading
          id="attendance-encoder-title"
          eyebrow="Attendance encoder"
          title="Take attendance"
        />
        <p className="academic-intro">
          Choose an assigned course and meeting date. New meetings start with
          every student unmarked.
        </p>
        {offerings.length ? (
          <>
            <div className="academic-form-grid">
              <label>
                Course offering
                <select
                  value={selectedId}
                  onChange={(event) => changeOffering(event.target.value)}
                >
                  {offerings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {courseLabel(item)} · {item.section}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Meeting date
                <select
                  value={selectedDate}
                  onChange={(event) => {
                    setSelectedDate(event.target.value);
                    setSavedNotice(false);
                  }}
                >
                  {selectedOffering?.meetingDates.map((meeting) => (
                    <option key={meeting.date} value={meeting.date}>
                      {formatAcademicDate(meeting.date)} · {meeting.day}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {selectedOffering ? (
              <div className="academic-meeting-context">
                <span>{selectedOffering.campus}</span>
                <span>{selectedOffering.section}</span>
                <span>
                  {selectedMeeting
                    ? `${selectedMeeting.day} · ${selectedOffering.schedule.find((slot) => slot.day === selectedMeeting.day)?.room ?? "Scheduled meeting"}`
                    : "Sample meeting"}
                </span>
              </div>
            ) : null}
            {alreadySaved ? (
              <div className="academic-inline-confirmation" role="status">
                Attendance for this meeting was saved in this demo and is
                read-only.
              </div>
            ) : null}
            {savedNotice ? (
              <div className="academic-inline-confirmation" role="status">
                Attendance saved in this demo session. It resets on refresh.
              </div>
            ) : null}
            <div className="academic-roster-toolbar">
              <div>
                <strong>{students.length} students</strong>
                <span aria-live="polite">
                  {counts.present} present · {counts.late} late ·{" "}
                  {counts.absent} absent · {counts.unmarked} unmarked
                </span>
              </div>
              {!alreadySaved ? (
                <button
                  className="academic-button academic-button-secondary"
                  type="button"
                  onClick={() =>
                    students.forEach((student) =>
                      setAttendanceRecord(
                        selectedId,
                        selectedDate,
                        student.id,
                        "Present",
                      ),
                    )
                  }
                >
                  Mark all present
                </button>
              ) : null}
            </div>
            <div
              className="academic-attendance-list"
              role="list"
              aria-label="Attendance roster"
            >
              {students.map((student) => (
                <div
                  className="academic-attendance-row"
                  role="listitem"
                  key={student.id}
                >
                  <div className="academic-student-identity">
                    <strong>{student.name}</strong>
                    <span>{student.studentId}</span>
                  </div>
                  <label className="academic-attendance-select">
                    <span className="academic-sr-only">
                      Attendance for {student.name}
                    </span>
                    <select
                      value={records[student.id] ?? "Unmarked"}
                      disabled={alreadySaved}
                      onChange={(event) =>
                        setAttendanceRecord(
                          selectedId,
                          selectedDate,
                          student.id,
                          event.target.value as AttendanceValue,
                        )
                      }
                    >
                      {attendanceLabels.map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
            <div className="academic-form-footer">
              <p>
                Unmarked is not recorded as Present. Review all rows before
                saving.
              </p>
              {!alreadySaved ? (
                <button
                  className="academic-button"
                  type="button"
                  onClick={() => setReviewOpen(true)}
                >
                  Review and save
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="academic-empty">
            No sample classes are assigned to this account.
          </p>
        )}
      </section>
      <section
        className="academic-panel"
        aria-labelledby="attendance-history-title"
      >
        <SectionHeading
          id="attendance-history-title"
          eyebrow="Saved demo sessions"
          title="Attendance history"
        />
        {history.length ? (
          <div className="academic-history-list">
            {history.map((session) => {
              const offering = getOffering(session.offeringId);
              const totals = countAttendanceRecords(session.records);
              return (
                <article key={session.id}>
                  <div>
                    <strong>
                      {offering ? courseLabel(offering) : "Sample class"}
                    </strong>
                    <span>
                      {offering?.section} · {formatAcademicDate(session.date)}
                    </span>
                  </div>
                  <div className="academic-history-counts">
                    <span>{totals.present} present</span>
                    <span>{totals.late} late</span>
                    <span>{totals.absent} absent</span>
                    <span>{totals.unmarked} unmarked</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="academic-empty">
            No attendance sessions have been saved for your sample classes.
          </p>
        )}
        <p className="academic-note">
          Saved demo sessions are read-only. Past-session edits and correction
          policy are not defined here.
        </p>
      </section>
      {reviewOpen ? (
        <ReviewDialog
          title="Review attendance"
          onClose={() => setReviewOpen(false)}
        >
          <p>
            {courseLabel(selectedOffering!)} · {selectedOffering?.section} ·{" "}
            {formatAcademicDate(selectedDate)}
          </p>
          <div className="academic-review-counts">
            <span>{counts.present} present</span>
            <span>{counts.late} late</span>
            <span>{counts.absent} absent</span>
            <span>{counts.unmarked} unmarked</span>
          </div>
          {counts.unmarked ? (
            <p className="academic-warning" role="alert">
              {counts.unmarked} student{counts.unmarked === 1 ? " is" : "s are"}{" "}
              still unmarked. Saving keeps those records explicitly unmarked.
            </p>
          ) : null}
          <p className="academic-dialog-demo">
            This saves only in your browser session. No official attendance
            record is created.
          </p>
          <div className="academic-dialog-actions">
            <button
              className="academic-button academic-button-secondary"
              type="button"
              onClick={() => setReviewOpen(false)}
            >
              Continue editing
            </button>
            <button
              className="academic-button"
              type="button"
              onClick={confirmSave}
            >
              Save demo attendance
            </button>
          </div>
        </ReviewDialog>
      ) : null}
    </div>
  );
}

function ReviewDialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="academic-dialog"
      aria-labelledby="academic-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const outside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;
        if (outside) onClose();
      }}
    >
      <h2 id="academic-dialog-title">{title}</h2>
      {children}
    </dialog>
  );
}

function GradesView({
  isCoordinator,
  offeringId,
}: {
  isCoordinator: boolean;
  offeringId?: string;
}) {
  const offerings = getAssignedOfferings(isCoordinator);
  const [selectedId, setSelectedId] = useState(
    offerings.some((item) => item.id === offeringId)
      ? offeringId!
      : (offerings[0]?.id ?? ""),
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const {
    gradeBooks,
    updateGrade,
    saveGradeDraft,
    markGradesReady,
    submitDemoGrades,
    submissionHistory,
  } = useAcademicDemo();
  const offering = offerings.find((item) => item.id === selectedId);
  const students = offering ? getOfferingRoster(offering.id) : [];
  const book = offering ? gradeBooks[offering.id] : undefined;
  const grades = book?.grades ?? {};
  const missingStudentIds = getMissingGradeStudentIds(
    students.map((student) => student.id),
    grades,
  );
  const isSubmitted = book?.status === "Submitted";
  const relevantHistory = submissionHistory.filter((item) =>
    offerings.some((candidate) => candidate.id === item.offeringId),
  );

  function prepareSubmission() {
    if (!offering) return;
    if (missingStudentIds.length) {
      setReviewOpen(true);
      return;
    }
    markGradesReady(offering.id);
    setReviewOpen(true);
  }

  function confirmSubmission() {
    if (!offering || missingStudentIds.length) return;
    submitDemoGrades(offering.id);
    setReviewOpen(false);
    setSubmittedNotice(true);
  }

  return (
    <div className="academic-view">
      <section className="academic-panel" aria-labelledby="grade-entry-title">
        <SectionHeading
          id="grade-entry-title"
          eyebrow="Final grade encoder"
          title="Grade entry"
        />
        <p className="academic-intro">
          Enter a final grade for each student in the selected offering. This
          demo checks that every row has a value; it does not define a scale or
          calculate grades.
        </p>
        {offerings.length ? (
          <>
            <div className="academic-form-grid academic-grade-controls">
              <label>
                Course offering
                <select
                  value={selectedId}
                  onChange={(event) => {
                    setSelectedId(event.target.value);
                    setSubmittedNotice(false);
                  }}
                >
                  {offerings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {courseLabel(item)} · {item.section}
                    </option>
                  ))}
                </select>
              </label>
              <div className="academic-grade-status">
                <span>Submission status</span>
                <strong
                  data-state={
                    book?.status?.toLowerCase().replaceAll(" ", "-") ?? "draft"
                  }
                >
                  {book?.status ?? "Draft"}
                </strong>
                {book?.updatedOn ? (
                  <small>
                    Last sample update: {formatAcademicDate(book.updatedOn)}
                  </small>
                ) : null}
              </div>
            </div>
            {isSubmitted ? (
              <div className="academic-inline-confirmation" role="status">
                This sample grade list has been submitted and is locked. Student
                visibility is still off until a separate release step.
              </div>
            ) : null}
            {submittedNotice ? (
              <div className="academic-inline-confirmation" role="status">
                Demo submission recorded for this session. It resets on refresh
                and has not been released to students.
              </div>
            ) : null}
            <div className="academic-grade-table-wrap">
              <table className="academic-table academic-grade-table">
                <thead>
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">Student ID</th>
                    <th scope="col">Final grade</th>
                    <th scope="col">Entry check</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const value = grades[student.id] ?? "";
                    const isMissing = !value.trim();
                    return (
                      <tr key={student.id}>
                        <th scope="row">{student.name}</th>
                        <td>{student.studentId}</td>
                        <td>
                          <label>
                            <span className="academic-sr-only">
                              Final grade for {student.name}
                            </span>
                            <input
                              className="academic-grade-input"
                              value={value}
                              disabled={isSubmitted}
                              inputMode="decimal"
                              onChange={(event) =>
                                updateGrade(
                                  selectedId,
                                  student.id,
                                  event.target.value,
                                )
                              }
                            />
                          </label>
                        </td>
                        <td>
                          <span
                            className={`academic-entry-state ${isMissing ? "is-missing" : "is-entered"}`}
                          >
                            {isMissing ? "Required" : "Entered"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <ul className="academic-grade-cards">
              {students.map((student) => {
                const value = grades[student.id] ?? "";
                const isMissing = !value.trim();
                return (
                  <li key={student.id}>
                    <div className="academic-grade-card-student">
                      <strong>{student.name}</strong>
                      <span>{student.studentId}</span>
                    </div>
                    <div className="academic-grade-card-entry">
                      <label>
                        Final grade
                        <span className="academic-sr-only">
                          for {student.name}
                        </span>
                        <input
                          className="academic-grade-input"
                          value={value}
                          disabled={isSubmitted}
                          inputMode="decimal"
                          onChange={(event) =>
                            updateGrade(
                              selectedId,
                              student.id,
                              event.target.value,
                            )
                          }
                        />
                      </label>
                      <span
                        className={`academic-entry-state ${isMissing ? "is-missing" : "is-entered"}`}
                      >
                        {isMissing ? "Required" : "Entered"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="academic-form-footer academic-grade-footer">
              <p aria-live="polite">
                {missingStudentIds.length
                  ? `${missingStudentIds.length} of ${students.length} grades need an entry before review.`
                  : `All ${students.length} rows have a value.`}
              </p>
              {!isSubmitted ? (
                <div className="academic-action-row">
                  <button
                    className="academic-button academic-button-secondary"
                    type="button"
                    onClick={() => {
                      saveGradeDraft(selectedId);
                      setSubmittedNotice(false);
                    }}
                  >
                    Save demo draft
                  </button>
                  <button
                    className="academic-button"
                    type="button"
                    onClick={prepareSubmission}
                  >
                    Review submission
                  </button>
                </div>
              ) : null}
            </div>
            <p className="academic-note">
              Saving is separate from submission. Submission does not release
              grades to students. All changes stay in this browser session only.
            </p>
          </>
        ) : (
          <p className="academic-empty">
            No sample offerings are assigned to this account.
          </p>
        )}
      </section>
      <section className="academic-panel" aria-labelledby="grade-history-title">
        <SectionHeading
          id="grade-history-title"
          eyebrow="Sample records"
          title="Submission history"
        />
        {relevantHistory.length ? (
          <div className="academic-history-list academic-grade-history">
            {relevantHistory.map((item) => {
              const subject = getSubject(item.subjectId);
              return (
                <article key={item.id}>
                  <div>
                    <strong>
                      {subject?.code} · {subject?.title}
                    </strong>
                    <span>
                      {item.section} · {item.termLabel}
                    </span>
                  </div>
                  <div>
                    <span>{item.studentCount} students</span>
                    <span>
                      Submitted {formatAcademicDate(item.submittedOn)}
                    </span>
                    <span className="academic-status">{item.status}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="academic-empty">
            There are no submitted sample grade lists for your assignments.
          </p>
        )}
      </section>
      {reviewOpen ? (
        <ReviewDialog
          title="Review final grades"
          onClose={() => setReviewOpen(false)}
        >
          {missingStudentIds.length ? (
            <>
              <p>
                Complete every final-grade row before submitting this sample
                list.
              </p>
              <ul className="academic-missing-list">
                {students
                  .filter((student) => missingStudentIds.includes(student.id))
                  .map((student) => (
                    <li key={student.id}>
                      {student.name} <span>{student.studentId}</span>
                    </li>
                  ))}
              </ul>
              <div className="academic-dialog-actions">
                <button
                  className="academic-button"
                  type="button"
                  onClick={() => setReviewOpen(false)}
                >
                  Return to grade entry
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                {courseLabel(offering!)} · {offering?.section} ·{" "}
                {students.length} sample students
              </p>
              <div className="academic-review-grade-list">
                {students.map((student) => (
                  <div key={student.id}>
                    <span>{student.name}</span>
                    <strong>{grades[student.id]}</strong>
                  </div>
                ))}
              </div>
              <p className="academic-warning">
                Submission locks these sample values. This does not release
                grades to students.
              </p>
              <p className="academic-dialog-demo">
                No official record or notification is created. Changes reset
                when the page is refreshed.
              </p>
              <div className="academic-dialog-actions">
                <button
                  className="academic-button academic-button-secondary"
                  type="button"
                  onClick={() => setReviewOpen(false)}
                >
                  Continue editing
                </button>
                <button
                  className="academic-button"
                  type="button"
                  onClick={confirmSubmission}
                >
                  Confirm demo submission
                </button>
              </div>
            </>
          )}
        </ReviewDialog>
      ) : null}
    </div>
  );
}

function AnnouncementsView({ isCoordinator }: { isCoordinator: boolean }) {
  const [filter, setFilter] = useState("All notices");
  const facultyOfferings = getAssignedOfferings(isCoordinator);
  const filters = ["All notices", "Campus", "Program", "Section", "Class"];
  const visible = useMemo(
    () =>
      academicDemoData.announcements.filter((announcement) => {
        const audienceMatches =
          filter === "All notices" || announcement.audience === filter;
        const classMatches =
          !announcement.offeringId ||
          facultyOfferings.some(
            (offering) => offering.id === announcement.offeringId,
          ) ||
          isCoordinator;
        return audienceMatches && classMatches;
      }),
    [facultyOfferings, filter, isCoordinator],
  );
  return (
    <section
      className="academic-panel"
      aria-labelledby="announcements-list-title"
    >
      <SectionHeading
        id="announcements-list-title"
        eyebrow="Read-only sample feed"
        title="Academic announcements"
      />
      <p className="academic-intro">
        These fictional notices are visible only as sample content. Publishing,
        delivery, and official campus updates are not part of this demo.
      </p>
      <div
        className="academic-filter-row"
        role="group"
        aria-label="Filter announcements by audience"
      >
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "is-active" : ""}
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="academic-announcement-list">
          {visible.map((item: AcademicAnnouncement) => (
            <article key={item.id}>
              <div className="academic-announcement-meta">
                <span>{item.audienceLabel}</span>
                <time>{item.date}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="academic-empty">No sample notices match this audience.</p>
      )}
    </section>
  );
}

function ManagementView() {
  const [query, setQuery] = useState("");
  const visible = academicDemoData.offerings.filter((offering) => {
    const haystack =
      `${courseLabel(offering)} ${offering.section} ${getFaculty(offering.facultyId)?.name} ${offering.program}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  return (
    <div className="academic-view">
      <section
        className="academic-panel academic-management-intro"
        aria-labelledby="program-overview-title"
      >
        <SectionHeading
          id="program-overview-title"
          eyebrow="Coordinator workspace"
          title="Program overview"
        />
        <p>
          This read-only screen summarizes fictional course offerings, section
          rosters, and faculty assignments. Changes to official schedules,
          enrollment, and assignments are not available in this milestone.
        </p>
        <p className="academic-assumption">
          <strong>V1 ASSUMPTION</strong> · Sample students are assigned to the
          BSIS-2A offerings shown here. Official enrollment synchronization and
          assignment policy remain undefined.
        </p>
      </section>
      <section
        className="academic-panel"
        aria-labelledby="offering-assignment-title"
      >
        <SectionHeading
          id="offering-assignment-title"
          eyebrow="AY 2026–2027 · 1st Semester"
          title="Program offerings"
        />
        <label className="academic-search-label">
          Filter offerings
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Course, section, or faculty"
          />
        </label>
        <p className="academic-result-count" role="status" aria-live="polite">
          {visible.length
            ? `Showing ${visible.length} ${visible.length === 1 ? "offering" : "offerings"}.`
            : "No offerings match your search."}
        </p>
        <div className="academic-management-list">
          {visible.map((offering) => {
            const subject = getSubject(offering.subjectId);
            const faculty = getFaculty(offering.facultyId);
            return (
              <article key={offering.id}>
                <div>
                  <span className="academic-offering-code">
                    {subject?.code}
                  </span>
                  <h3>{subject?.title}</h3>
                  <p>
                    {offering.program} · {offering.section} · {offering.campus}
                  </p>
                </div>
                <dl>
                  <div>
                    <dt>Faculty</dt>
                    <dd>{faculty?.name}</dd>
                  </div>
                  <div>
                    <dt>Schedule</dt>
                    <dd>{offeringSchedule(offering)}</dd>
                  </div>
                  <div>
                    <dt>Roster</dt>
                    <dd>{getOfferingRoster(offering.id).length} students</dd>
                  </div>
                </dl>
                <Link href={courseHref("classes", offering.id)}>
                  View teaching details <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      <section
        className="academic-panel"
        aria-labelledby="faculty-assignment-title"
      >
        <SectionHeading
          id="faculty-assignment-title"
          eyebrow="Sample staffing"
          title="Faculty assignments"
        />
        <div className="academic-faculty-list">
          {academicDemoData.faculty.map((faculty) => {
            const facultyOfferings = academicDemoData.offerings.filter(
              (offering) => offering.facultyId === faculty.id,
            );
            return (
              <article key={faculty.id}>
                <div>
                  <strong>{faculty.name}</strong>
                  <span>{faculty.roleLabel}</span>
                </div>
                <p>
                  {facultyOfferings.length
                    ? facultyOfferings
                        .map(
                          (offering) =>
                            `${getSubject(offering.subjectId)?.code} · ${offering.section}`,
                        )
                        .join("; ")
                    : "No sample offering"}
                </p>
              </article>
            );
          })}
        </div>
        <p className="academic-note">
          Names, assignments, and rosters are fictional. No coordinator edits
          are saved.
        </p>
      </section>
    </div>
  );
}

export function AcademicPage({
  section,
  isCoordinator,
  offeringId,
  date,
}: AcademicPageProps) {
  let view: React.ReactNode;
  switch (section) {
    case "classes":
      view = (
        <TeachingView isCoordinator={isCoordinator} offeringId={offeringId} />
      );
      break;
    case "attendance":
      view = (
        <AttendanceView
          isCoordinator={isCoordinator}
          offeringId={offeringId}
          date={date}
        />
      );
      break;
    case "grades":
      view = (
        <GradesView isCoordinator={isCoordinator} offeringId={offeringId} />
      );
      break;
    case "announcements":
      view = <AnnouncementsView isCoordinator={isCoordinator} />;
      break;
    case "management":
      view = <ManagementView />;
      break;
    default:
      view = <DashboardView isCoordinator={isCoordinator} />;
  }
  return (
    <div className="academic-page">
      <PageHeader
        title={sectionTitles[section] ?? "Academic portal"}
        description={
          sectionDescriptions[section] ?? sectionDescriptions.dashboard
        }
        eyebrow={`${academicDemoData.term.academicYear} · ${academicDemoData.term.semester}`}
      />
      <DemoNotice detail="Fictional academic records · Changes reset on refresh" />
      {view}
    </div>
  );
}
