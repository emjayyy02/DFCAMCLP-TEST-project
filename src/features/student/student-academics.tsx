"use client";

import { useRef, useState } from "react";
import {
  academicViews,
  formatScheduleRange,
  studentDemoData,
} from "./demo-data";
import type { AcademicView, ScheduleDay } from "./demo-data";

const weekdays: ScheduleDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const dayNames: Record<ScheduleDay, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
};

function getWeekDate(dayOffset: number, weekOffset: number) {
  return new Date(2027, 1, 22 + dayOffset + weekOffset * 7, 12);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatFullDay(date: Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function ScheduleMeeting({
  meeting,
}: {
  meeting: (typeof studentDemoData.schedule)[number];
}) {
  const subject = studentDemoData.subjects.find(
    (item) => item.id === meeting.subjectId,
  );
  if (!subject) return null;

  return (
    <li className="student-meeting">
      <time className="student-meeting-time">
        {formatScheduleRange(meeting.start, meeting.end)}
      </time>
      <div>
        <p className="font-semibold">
          <span className="student-subject-code">{subject.code}</span>
          {subject.title}
        </p>
        <p className="student-meeting-detail">
          {meeting.room} <span aria-hidden="true">·</span> {subject.instructor}
        </p>
      </div>
    </li>
  );
}

function ScheduleView() {
  const [selectedDay, setSelectedDay] = useState<ScheduleDay>(
    studentDemoData.today.day,
  );
  const [weekOffset, setWeekOffset] = useState(0);
  const selectedIndex = weekdays.indexOf(selectedDay);
  const selectedMeetings = studentDemoData.schedule.filter(
    (meeting) => meeting.day === selectedDay,
  );
  const nextMeeting = studentDemoData.schedule.find(
    (meeting) => weekdays.indexOf(meeting.day) > selectedIndex,
  );
  const weekStart = getWeekDate(0, weekOffset);
  const weekEnd = getWeekDate(4, weekOffset);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
  const weekMonthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(weekEnd);
  const weekLabel = sameMonth
    ? `${weekStart.getDate()}–${weekEnd.getDate()} ${weekMonthLabel}`
    : `${new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(weekStart)}–${new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(weekEnd)}`;

  return (
    <section
      className="student-academic-panel"
      aria-labelledby="schedule-title"
    >
      <div className="student-panel-heading">
        <div>
          <h2 id="schedule-title">Class schedule</h2>
          <p>Sample week · {weekLabel}</p>
        </div>
        <div
          className="student-week-controls"
          aria-label="Change schedule week"
        >
          <button
            type="button"
            className="student-button student-button-secondary"
            onClick={() => setWeekOffset((offset) => offset - 1)}
          >
            Previous week
          </button>
          <button
            type="button"
            className="student-button student-button-secondary"
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
          >
            This week
          </button>
          <button
            type="button"
            className="student-button student-button-secondary"
            onClick={() => setWeekOffset((offset) => offset + 1)}
          >
            Next week
          </button>
        </div>
      </div>

      <div className="student-mobile-day-picker" aria-label="Choose a day">
        {weekdays.map((day, index) => (
          <button
            key={day}
            type="button"
            aria-pressed={selectedDay === day}
            className="student-day-button"
            onClick={() => setSelectedDay(day)}
          >
            <span>{dayNames[day]}</span>
            <span>{getWeekDate(index, weekOffset).getDate()}</span>
          </button>
        ))}
      </div>

      <div className="student-week-grid" aria-label="Classes this week">
        {weekdays.map((day, index) => {
          const meetings = studentDemoData.schedule.filter(
            (meeting) => meeting.day === day,
          );
          return (
            <section className="student-week-day" key={day}>
              <h3>
                {day}
                <span>{formatShortDate(getWeekDate(index, weekOffset))}</span>
              </h3>
              {meetings.length ? (
                <ul className="student-week-meetings">
                  {meetings.map((meeting) => (
                    <ScheduleMeeting key={meeting.id} meeting={meeting} />
                  ))}
                </ul>
              ) : (
                <p className="student-muted student-empty-inline">No class</p>
              )}
            </section>
          );
        })}
      </div>

      <section className="student-mobile-agenda" aria-live="polite">
        <h3>{formatFullDay(getWeekDate(selectedIndex, weekOffset))}</h3>
        {selectedMeetings.length ? (
          <ul className="student-agenda-list">
            {selectedMeetings.map((meeting) => (
              <ScheduleMeeting key={meeting.id} meeting={meeting} />
            ))}
          </ul>
        ) : (
          <div className="student-empty-state">
            <p>No class is scheduled in this sample day.</p>
            {nextMeeting ? (
              <p>
                Next sample class:{" "}
                {
                  studentDemoData.subjects.find(
                    (item) => item.id === nextMeeting.subjectId,
                  )?.title
                }{" "}
                on {nextMeeting.day} at{" "}
                {formatScheduleRange(nextMeeting.start, nextMeeting.end)}.
              </p>
            ) : (
              <p>There are no more sample classes in this week.</p>
            )}
          </div>
        )}
      </section>
    </section>
  );
}

function SubjectView() {
  return (
    <section
      className="student-academic-panel"
      aria-labelledby="subjects-title"
    >
      <div className="student-panel-heading">
        <div>
          <h2 id="subjects-title">Current subjects</h2>
          <p>
            {studentDemoData.term.section} · {studentDemoData.term.academicYear}{" "}
            · {studentDemoData.term.semester}
          </p>
          <p className="student-muted">
            Synthetic course list for interface review; not an official
            curriculum.
          </p>
        </div>
      </div>
      <div className="student-subject-table-wrap">
        <table className="data-table student-subject-table">
          <caption className="sr-only">Sample enrolled subjects</caption>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Subject</th>
              <th scope="col">Units</th>
              <th scope="col">Section</th>
              <th scope="col">Instructor</th>
              <th scope="col">Meets</th>
            </tr>
          </thead>
          <tbody>
            {studentDemoData.subjects.map((subject) => {
              const meetings = studentDemoData.schedule.filter(
                (meeting) => meeting.subjectId === subject.id,
              );
              return (
                <tr key={subject.id}>
                  <th scope="row">{subject.code}</th>
                  <td>{subject.title}</td>
                  <td>{subject.units}</td>
                  <td>{studentDemoData.term.section}</td>
                  <td>{subject.instructor}</td>
                  <td>
                    {meetings.length
                      ? meetings
                          .map(
                            (meeting) =>
                              `${dayNames[meeting.day]} ${formatScheduleRange(meeting.start, meeting.end)}`,
                          )
                          .join(", ")
                      : "Not yet assigned"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul
        className="student-subject-cards"
        aria-label="Sample enrolled subjects"
      >
        {studentDemoData.subjects.map((subject) => {
          const meetings = studentDemoData.schedule.filter(
            (meeting) => meeting.subjectId === subject.id,
          );
          return (
            <li className="student-subject-card" key={subject.id}>
              <div className="student-subject-card-title">
                <div>
                  <p className="student-subject-code">{subject.code}</p>
                  <h3>{subject.title}</h3>
                </div>
                <span className="student-units">{subject.units} units</span>
              </div>
              <dl className="student-subject-meta">
                <div>
                  <dt>Section</dt>
                  <dd>{studentDemoData.term.section}</dd>
                </div>
                <div>
                  <dt>Instructor</dt>
                  <dd>{subject.instructor}</dd>
                </div>
                <div>
                  <dt>Schedule</dt>
                  <dd>
                    {meetings.length
                      ? meetings
                          .map(
                            (meeting) =>
                              `${meeting.day}, ${formatScheduleRange(meeting.start, meeting.end)} · ${meeting.room}`,
                          )
                          .join("; ")
                      : "Not yet assigned"}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function GradeView() {
  const years = [
    ...new Set(studentDemoData.grades.map((item) => item.academicYear)),
  ];
  const [academicYear, setAcademicYear] = useState<string>(
    studentDemoData.term.academicYear,
  );
  const semesters: string[] = [
    ...new Set(
      studentDemoData.grades
        .filter((item) => item.academicYear === academicYear)
        .map((item) => item.semester),
    ),
  ];
  const [semester, setSemester] = useState<string>(
    studentDemoData.term.semester,
  );
  const availableSemester = semesters.includes(semester)
    ? semester
    : semesters[0];
  const grades = studentDemoData.grades.filter(
    (item) =>
      item.academicYear === academicYear && item.semester === availableSemester,
  );

  return (
    <section className="student-academic-panel" aria-labelledby="grades-title">
      <div className="student-panel-heading">
        <div>
          <h2 id="grades-title">Grades</h2>
          <p>
            Sample grades and release statuses are shown by term. No average or
            standing is calculated.
          </p>
        </div>
        <div className="student-filter-row">
          <label>
            <span>Academic year</span>
            <select
              value={academicYear}
              onChange={(event) => setAcademicYear(event.target.value)}
            >
              {years.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Semester</span>
            <select
              value={availableSemester}
              onChange={(event) => setSemester(event.target.value)}
            >
              {semesters.map((term) => (
                <option key={term}>{term}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <p className="student-policy-note">
        Illustrative values only. Official grading scales, passing rules, and
        calculations are not represented.
      </p>
      {grades.length ? (
        <>
          <div className="student-grade-table-wrap">
            <table className="data-table student-grade-table">
              <caption className="sr-only">
                Sample grades for {academicYear}, {availableSemester}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Subject</th>
                  <th scope="col">Units</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((item) => (
                  <tr key={`${item.code}-${item.academicYear}`}>
                    <th scope="row">
                      <span className="student-subject-code">{item.code}</span>
                      {item.title}
                    </th>
                    <td>{item.units}</td>
                    <td>{item.grade ?? "—"}</td>
                    <td>
                      <span
                        className="student-status"
                        data-state={item.grade ? "released" : "pending"}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="student-grade-cards" aria-label="Sample grades">
            {grades.map((item) => (
              <li
                className="student-grade-card"
                key={`${item.code}-${item.academicYear}`}
              >
                <div>
                  <p className="student-subject-code">
                    {item.code} <span>· {item.units} units</span>
                  </p>
                  <h3>{item.title}</h3>
                </div>
                <div className="student-grade-result">
                  <strong>{item.grade ?? "—"}</strong>
                  <span
                    className="student-status"
                    data-state={item.grade ? "released" : "pending"}
                  >
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="student-empty-state">
          No sample grades are available for this term.
        </p>
      )}
    </section>
  );
}

function AttendanceView() {
  return (
    <section
      className="student-academic-panel"
      aria-labelledby="attendance-title"
    >
      <div className="student-panel-heading">
        <div>
          <h2 id="attendance-title">Attendance by subject</h2>
          <p>
            {studentDemoData.term.academicYear} ·{" "}
            {studentDemoData.term.semester}
          </p>
        </div>
      </div>
      <p className="student-policy-note">
        Sample recorded marks only. No attendance threshold or academic
        consequence is implied.
      </p>
      <ul className="student-attendance-list">
        {studentDemoData.attendance.map((record) => {
          const subject = studentDemoData.subjects.find(
            (item) => item.id === record.subjectId,
          );
          if (!subject) return null;
          return (
            <li className="student-attendance-item" key={record.subjectId}>
              <div className="student-attendance-heading">
                <div>
                  <p className="student-subject-code">{subject.code}</p>
                  <h3>{subject.title}</h3>
                </div>
                <p className="student-attendance-counts">
                  <span>
                    <strong>{record.present}</strong> present
                  </span>
                  <span>
                    <strong>{record.late}</strong> late
                  </span>
                  <span>
                    <strong>{record.absent}</strong> absent
                  </span>
                </p>
              </div>
              <details className="student-attendance-details">
                <summary>Recent sample records</summary>
                {record.recent.length ? (
                  <ul>
                    {record.recent.map((item) => (
                      <li key={`${record.subjectId}-${item.date}`}>
                        <time>{item.date}</time>
                        <span
                          className="student-status"
                          data-state={item.status.toLowerCase()}
                        >
                          {item.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="student-muted">
                    No attendance has been recorded in this sample.
                  </p>
                )}
              </details>
            </li>
          );
        })}
      </ul>
      <p className="student-muted student-attendance-footnote">
        An unlisted class meeting is not represented as absent.
      </p>
    </section>
  );
}

function CurriculumView() {
  return (
    <section
      className="student-academic-panel"
      aria-labelledby="curriculum-title"
    >
      <div className="student-panel-heading">
        <div>
          <h2 id="curriculum-title">Curriculum progress</h2>
          <p>Illustrative course map · organized by year and semester</p>
        </div>
      </div>
      <p className="student-policy-note">
        <strong>V1 ASSUMPTION</strong> · This synthetic course map is not an
        official curriculum, degree audit, or graduation-eligibility check.
      </p>
      <ol className="student-curriculum-list">
        {studentDemoData.curriculum.map((group) => (
          <li
            className="student-curriculum-group"
            key={`${group.year}-${group.semester}`}
          >
            <div className="student-curriculum-heading">
              <div>
                <h3>{group.year}</h3>
                <p>{group.semester}</p>
              </div>
              <span
                className="student-status"
                data-state={group.status.toLowerCase()}
              >
                {group.status}
              </span>
            </div>
            <ul>
              {group.subjects.map((subject) => (
                <li key={subject}>{subject}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function StudentAcademics({ initialView }: { initialView?: string }) {
  const selectedInitial =
    academicViews.find(
      (view) => view.toLowerCase() === initialView?.toLowerCase(),
    ) ?? academicViews[0];
  const [activeView, setActiveView] = useState<AcademicView>(selectedInitial);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = academicViews.indexOf(activeView);

  function selectByKeyboard(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight")
      nextIndex = (index + 1) % academicViews.length;
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + academicViews.length) % academicViews.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = academicViews.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveView(academicViews[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  }

  const views = {
    Schedule: <ScheduleView />,
    Subjects: <SubjectView />,
    Grades: <GradeView />,
    Attendance: <AttendanceView />,
    Curriculum: <CurriculumView />,
  } satisfies Record<AcademicView, React.ReactNode>;

  return (
    <section className="student-academics" aria-label="Academic information">
      <div className="student-term-context">
        <span>{studentDemoData.term.academicYear}</span>
        <span>{studentDemoData.term.semester}</span>
        <span>{studentDemoData.identity.campus}</span>
      </div>
      <div className="student-tabs" role="tablist" aria-label="Academic views">
        {academicViews.map((view, index) => (
          <button
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            key={view}
            type="button"
            role="tab"
            id={`student-tab-${view.toLowerCase()}`}
            aria-selected={activeView === view}
            aria-controls="student-academic-view"
            tabIndex={activeView === view ? 0 : -1}
            className="student-tab"
            onClick={() => setActiveView(view)}
            onKeyDown={(event) => selectByKeyboard(event, index)}
          >
            {view}
          </button>
        ))}
      </div>
      <div
        id="student-academic-view"
        role="tabpanel"
        aria-labelledby={`student-tab-${activeView.toLowerCase()}`}
        tabIndex={0}
        className="student-tab-panel"
      >
        {views[academicViews[activeIndex]]}
      </div>
    </section>
  );
}
