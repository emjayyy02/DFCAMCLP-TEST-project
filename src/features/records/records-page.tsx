"use client";

import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { ContextHeader } from "@/components/ui/context-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState as SharedEmptyState } from "@/components/ui/states";
import { ListToolbar, SortControl } from "@/components/ui/list-toolbar";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useEffect, useMemo, useState } from "react";
import { useRecordsDemo } from "./demo-context";
import {
  countRecords,
  enrollmentSequence,
  nextEnrollmentStep,
  validSampleSchedule,
  type ApplicantRecord,
  type StudentRecord,
} from "./demo-data";
import {
  canonicalCampuses,
  canonicalPrograms,
  canonicalYearLevels,
  matchesApplicantSearch,
  matchesDcatSearch,
  matchesDocumentSearch,
  matchesRequirementsSearch,
  matchesStudentSearch,
  sortApplicants,
  sortDcatRecords,
  sortDocumentRecords,
  sortStudents,
  type DirectorySort,
  type DcatSort,
  type DocumentSort,
  type StudentSort,
} from "./list-utils";
import "./records.css";

type Props = {
  section: string;
  recordId?: string;
  queue?: string;
  listState?: DirectoryState;
};
type DirectoryState = {
  search?: string;
  campus?: string;
  program?: string;
  stage?: string;
  year?: string;
  sort?: string;
  direction?: string;
};
const titles: Record<string, string> = {
  dashboard: "Admissions & Records",
  applicants: "Applicants",
  dcat: "DCAT",
  students: "Students",
  enrollment: "Enrollment",
  documents: "Documents",
};
const descriptions: Record<string, string> = {
  dashboard: "Work queues for sample admissions and student records.",
  applicants:
    "Find an application, review its stage, and check physical requirements.",
  dcat: "Schedule the DFCAMCLP College Admission Test (DCAT) for eligible applicants and record sample results.",
  students: "Read existing sample student records and enrollment documents.",
  enrollment:
    "Follow qualified applicants through the sample Registrar sequence.",
  documents:
    "Review sample Certificate of Enrollment (COE) and Certificate of Registration (COR) availability and issuance.",
};
const detailTabs = [
  "Overview",
  "Application",
  "Requirements",
  "DCAT",
  "Enrollment",
] as const;
type DetailTab = (typeof detailTabs)[number];

function Status({ children }: { children: string }) {
  const tone = [
    "Verified",
    "Passed",
    "Enrolled",
    "Issued",
    "Active Student",
  ].includes(children)
    ? "success"
    : ["Needs Attention", "Pending"].includes(children)
      ? "warning"
      : [
            "Awaiting Exam",
            "Awaiting Result",
            "Eligible for DCAT",
            "DCAT scheduled",
            "For Enrollment",
            "Registrar Submission",
            "Available",
            "COE Available",
            "COR Available",
          ].includes(children)
        ? "info"
        : "neutral";
  return <Badge tone={tone}>{children}</Badge>;
}
function Empty({
  title = "No matching records",
  detail = "Try another search or filter.",
}: {
  title?: string;
  detail?: string;
}) {
  return <SharedEmptyState title={title} description={detail} />;
}
function Heading({
  section,
  record,
  backHref,
}: {
  section: string;
  record?: ApplicantRecord | StudentRecord;
  backHref?: string;
}) {
  return (
    <>
      {record ? (
        <ContextHeader
          parent="Admissions & Records"
          parentHref="/records"
          title={record.name}
          metadata={
            <div className="records-context-metadata">
              <span>
                {"submitted" in record ? "Applicant ID" : "Student ID"}:{" "}
                {record.id}
              </span>
              <span>{record.campus}</span>
              <span>{record.program}</span>
              <Status>
                {"submitted" in record ? record.stage : record.standing}
              </Status>
            </div>
          }
          backHref={backHref}
          backLabel={
            section === "applicants" ? "Back to applicants" : "Back to students"
          }
        />
      ) : (
        <PageHeader
          title={titles[section] ?? titles.dashboard}
          description={descriptions[section] ?? descriptions.dashboard}
        />
      )}
    </>
  );
}
function QueueLink({
  href,
  label,
  count,
  detail,
}: {
  href: string;
  label: string;
  count: number;
  detail: string;
}) {
  return (
    <Link className="records-queue-link" href={href}>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <span
        className="records-queue-count"
        aria-label={`${count} ${count === 1 ? "record" : "records"}`}
      >
        {count}
      </span>
    </Link>
  );
}
function Dashboard() {
  const { applicants, students } = useRecordsDemo();
  const counts = countRecords(applicants, students);
  return (
    <div className="records-stack">
      <section className="records-panel">
        <div className="records-panel-head">
          <div>
            <h2>Work queues</h2>
            <p>Open a queue to review the relevant sample records.</p>
          </div>
        </div>
        <div className="records-queue-list">
          <QueueLink
            href="/records/applicants?queue=requirements"
            label="Requirements to review"
            count={counts.requirements}
            detail="Physical document checklist"
          />
          <QueueLink
            href="/records/dcat?queue=scheduling"
            label="Admission test scheduling"
            count={counts.scheduling}
            detail="Eligible applicants awaiting a sample DFCAMCLP College Admission Test (DCAT) schedule"
          />
          <QueueLink
            href="/records/dcat?queue=results"
            label="Results to record"
            count={counts.results}
            detail="Exam completed, result pending"
          />
          <QueueLink
            href="/records/enrollment"
            label="Enrollment progression"
            count={counts.enrollment}
            detail="Passed, not yet fully enrolled"
          />
          <QueueLink
            href="/records/documents?queue=available"
            label="Documents available"
            count={counts.documents}
            detail="Sample enrollment or registration documents ready to issue"
          />
        </div>
      </section>
      <section className="records-panel records-overview-grid">
        <div>
          <h2>Find a record</h2>
          <p>
            Search by name or ID in the applicant and student directories.
            Applicant IDs and Student IDs are separate.
          </p>
        </div>
        <div className="records-actions">
          <Link className="records-button" href="/records/applicants">
            Open applicants
          </Link>
          <Link
            className="records-button records-button-secondary"
            href="/records/students"
          >
            Open students
          </Link>
        </div>
        <p className="records-context">
          {applicants.length} sample applications · {students.length} existing
          sample student records
        </p>
      </section>
    </div>
  );
}

function basicSearchMatch<T extends { id: string; name: string }>(
  item: T,
  query: string,
) {
  return `${item.id} ${item.name}`
    .toLowerCase()
    .includes(query.trim().toLowerCase());
}

function useFilters<
  T extends { id: string; name: string; campus: string; program: string },
>(
  items: T[],
  initial: DirectoryState = {},
  searchMatch: (item: T, query: string) => boolean = basicSearchMatch,
) {
  const [search, setSearch] = useState(initial.search ?? "");
  const [campus, setCampus] = useState(initial.campus ?? "");
  const [program, setProgram] = useState(initial.program ?? "");
  const [stage, setStage] = useState(initial.stage ?? "");
  const campuses = canonicalCampuses;
  const programs = canonicalPrograms;
  const filtered = useMemo(
    () =>
      items.filter((item) => {
        return (
          searchMatch(item, search) &&
          (!campus || item.campus === campus) &&
          (!program || item.program === program) &&
          (!stage ||
            ("stage" in item && item.stage === stage) ||
            ("standing" in item && item.standing === stage))
        );
      }),
    [items, search, campus, program, stage, searchMatch],
  );
  return {
    search,
    setSearch,
    campus,
    setCampus,
    program,
    setProgram,
    stage,
    setStage,
    campuses,
    programs,
    filtered,
    clear: () => {
      setSearch("");
      setCampus("");
      setProgram("");
      setStage("");
    },
  };
}
function Filters({
  filters,
  stages,
  searchLabel,
  stageLabel = "Stage",
  yearFilter,
  onClear,
}: {
  filters: Omit<ReturnType<typeof useFilters<ApplicantRecord>>, "filtered">;
  stages?: string[];
  searchLabel: string;
  stageLabel?: string;
  yearFilter?: {
    options: string[];
    value: string;
    set: (value: string) => void;
  };
  onClear?: () => void;
}) {
  return (
    <div
      className={`records-filters ${yearFilter ? "records-student-filters" : ""}`}
    >
      <label>
        Search<span className="sr-only"> {searchLabel}</span>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => filters.setSearch(event.target.value)}
          placeholder={searchLabel}
        />
      </label>
      <label>
        Campus
        <select
          value={filters.campus}
          onChange={(event) => filters.setCampus(event.target.value)}
        >
          <option value="">All campuses</option>
          {filters.campuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Program
        <select
          value={filters.program}
          onChange={(event) => filters.setProgram(event.target.value)}
        >
          <option value="">All programs</option>
          {filters.programs.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      {stages && (
        <label>
          {stageLabel}
          <select
            value={filters.stage}
            onChange={(event) => filters.setStage(event.target.value)}
          >
            <option value="">
              {stageLabel === "Status" ? "All statuses" : "All stages"}
            </option>
            {stages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      )}
      {yearFilter && (
        <label>
          Year level
          <select
            value={yearFilter.value}
            onChange={(event) => yearFilter.set(event.target.value)}
          >
            <option value="">All years</option>
            {yearFilter.options.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      )}
      <button
        className="records-text-button"
        onClick={() => {
          filters.clear();
          yearFilter?.set("");
          onClear?.();
        }}
        type="button"
      >
        Clear filters
      </button>
    </div>
  );
}

const directoryStateKeys = [
  "search",
  "campus",
  "program",
  "stage",
  "year",
  "sort",
  "direction",
] as const;

function buildDirectoryHref(
  section: "applicants" | "students",
  state: DirectoryState,
  recordId?: string,
  from?: string,
) {
  const params = new URLSearchParams();
  for (const key of directoryStateKeys) {
    const value = state[key];
    if (value) params.set(key, value);
  }
  if (recordId) params.set("record", recordId);
  if (from) params.set("from", from);
  const query = params.toString();
  return `/records/${section}${query ? `?${query}` : ""}`;
}

function isDirectorySort(value: string | undefined): value is DirectorySort {
  return (
    value === "attention" ||
    value === "oldest" ||
    value === "newest" ||
    value === "name"
  );
}

function isStudentSort(value: string | undefined): value is StudentSort {
  return value === "name" || value === "id" || value === "year";
}
function ApplicantRows({
  records,
  from,
  state,
  sort,
  reverse,
  onSort,
}: {
  records: ApplicantRecord[];
  from: string;
  state: DirectoryState;
  sort: DirectorySort;
  reverse: boolean;
  onSort: (column: "name" | "attention" | "submitted") => void;
}) {
  if (!records.length) return <Empty />;
  return (
    <>
      <div className="records-table-wrap">
        <table>
          <thead>
            <tr>
              <SortableHeader
                label="Applicant"
                direction={
                  sort === "name"
                    ? reverse
                      ? "descending"
                      : "ascending"
                    : undefined
                }
                onSort={() => onSort("name")}
              />
              <th>Campus / program</th>
              {from === "requirements" ? (
                <SortableHeader
                  label="Review priority"
                  direction={
                    sort === "attention"
                      ? reverse
                        ? "descending"
                        : "ascending"
                      : undefined
                  }
                  onSort={() => onSort("attention")}
                />
              ) : (
                <th>Current stage</th>
              )}
              <SortableHeader
                label="Submitted"
                direction={
                  sort === "newest"
                    ? "descending"
                    : sort === "oldest"
                      ? "ascending"
                      : undefined
                }
                onSort={() => onSort("submitted")}
              />
              <th>
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  <strong>{record.name}</strong>
                  <small>{record.id}</small>
                </td>
                <td>
                  {record.campus}
                  <small>{record.program}</small>
                </td>
                <td>
                  {from === "requirements" ? (
                    <>
                      <Status>
                        {["Needs Attention", "Pending", "Presented"].find(
                          (status) =>
                            record.requirements.some(
                              (item) => item.status === status,
                            ),
                        ) ?? "Verified"}
                      </Status>
                      <small>{record.stage}</small>
                    </>
                  ) : (
                    <Status>{record.stage}</Status>
                  )}
                </td>
                <td>{record.submitted}</td>
                <td>
                  <Link
                    className="records-row-link"
                    href={buildDirectoryHref(
                      "applicants",
                      state,
                      record.id,
                      from,
                    )}
                  >
                    Open {record.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="records-mobile-list">
        {records.map((record) => (
          <Link
            className="records-mobile-row"
            key={record.id}
            href={buildDirectoryHref("applicants", state, record.id, from)}
          >
            <strong>{record.name}</strong>
            <small>
              {record.id} · {record.campus}
            </small>
            <span>{record.program}</span>
            <Status>{record.stage}</Status>
            <b>Open record →</b>
          </Link>
        ))}
      </div>
    </>
  );
}
function Applicants({
  queue,
  initialState,
}: {
  queue?: string;
  initialState?: DirectoryState;
}) {
  const { applicants } = useRecordsDemo();
  const filters = useFilters(
    applicants,
    initialState,
    queue === "requirements"
      ? matchesRequirementsSearch
      : matchesApplicantSearch,
  );
  const defaultSort: DirectorySort =
    queue === "requirements" ? "attention" : "newest";
  const [sort, setSort] = useState<DirectorySort>(
    isDirectorySort(initialState?.sort) ? initialState.sort : defaultSort,
  );
  const [reverse, setReverse] = useState(
    initialState?.direction === "desc" &&
      (initialState?.sort === "name" || initialState?.sort === "attention"),
  );
  function chooseSort(next: DirectorySort) {
    setSort(next);
    setReverse(false);
  }
  function sortColumn(column: "name" | "attention" | "submitted") {
    if (column === "submitted") {
      chooseSort(sort === "newest" ? "oldest" : "newest");
    } else if (sort === column) {
      setReverse((current) => !current);
    } else {
      chooseSort(column);
    }
  }
  const stages = [...new Set(applicants.map((item) => item.stage))];
  const queueRecords = applicants.filter(
    (item) =>
      queue !== "requirements" ||
      item.requirements.some(
        (requirement) => requirement.status !== "Verified",
      ),
  );
  const sortedRecords = sortApplicants(
    filters.filtered.filter((item) => queueRecords.includes(item)),
    sort,
  );
  const records = reverse ? sortedRecords.toReversed() : sortedRecords;
  const state = { ...filters, sort, direction: reverse ? "desc" : undefined };
  return (
    <section className="records-panel">
      <div className="records-panel-head">
        <div>
          <h2>
            {queue === "requirements"
              ? "Requirements to review"
              : "Applicant directory"}
          </h2>
          <p>
            {queue === "requirements"
              ? "Applications with at least one item awaiting verification."
              : "Select a record to see its stage and next action."}
          </p>
        </div>
        {queue && <Link href="/records/applicants">All applicants</Link>}
      </div>
      <ListToolbar
        filters={
          <Filters
            filters={filters}
            stages={stages}
            searchLabel={
              queue === "requirements"
                ? "Name, ID, email, campus, program, stage, requirement or status"
                : "Name, ID, email, campus, program or stage"
            }
            onClear={() => chooseSort(defaultSort)}
          />
        }
        count={
          <span role="status" aria-live="polite" aria-atomic="true">
            {records.length} of {queueRecords.length} applicants shown
          </span>
        }
        sort={
          <SortControl
            id="applicant-sort"
            className="table-mobile-sort"
            value={sort}
            onChange={(value) => isDirectorySort(value) && chooseSort(value)}
            direction={
              sort === "newest"
                ? "descending"
                : sort === "oldest"
                  ? "ascending"
                  : reverse
                    ? "descending"
                    : "ascending"
            }
            onDirectionChange={() => {
              if (sort === "newest") chooseSort("oldest");
              else if (sort === "oldest") chooseSort("newest");
              else setReverse((current) => !current);
            }}
            options={
              queue === "requirements"
                ? [
                    { value: "attention", label: "Review priority" },
                    { value: "oldest", label: "Oldest submission" },
                    { value: "newest", label: "Newest submission" },
                    { value: "name", label: "Applicant name" },
                  ]
                : [
                    { value: "newest", label: "Newest submission" },
                    { value: "oldest", label: "Oldest submission" },
                    { value: "name", label: "Applicant name" },
                  ]
            }
          />
        }
      />
      <ApplicantRows
        records={records}
        from={queue === "requirements" ? "requirements" : "applicants"}
        state={state}
        sort={sort}
        reverse={reverse}
        onSort={sortColumn}
      />
    </section>
  );
}

function RecordDetail({ record }: { record: ApplicantRecord }) {
  const { setRequirement, feedback } = useRecordsDemo();
  const [tab, setTab] = useState<DetailTab>("Overview");
  const activeTabId = `applicant-tab-${tab.toLowerCase()}`;
  const panelProps = {
    id: "applicant-panel",
    role: "tabpanel" as const,
    tabIndex: 0,
    "aria-labelledby": activeTabId,
  };
  const needsRequirements = record.requirements.some(
    (item) => item.status !== "Verified",
  );
  const nextArea =
    !needsRequirements && record.dcat?.status === "Passed"
      ? "enrollment"
      : "dcat";
  return (
    <div className="records-stack">
      <section className="records-panel">
        <div className="records-detail-head">
          <div>
            <h2>Applicant record</h2>
            <p>Submitted {record.submitted}</p>
          </div>
        </div>
        <div
          className="records-tabs"
          role="tablist"
          aria-label="Applicant record sections"
          onKeyDown={(event) => {
            const currentIndex = detailTabs.indexOf(tab);
            const lastIndex = detailTabs.length - 1;
            const nextIndex =
              event.key === "ArrowRight"
                ? (currentIndex + 1) % detailTabs.length
                : event.key === "ArrowLeft"
                  ? (currentIndex - 1 + detailTabs.length) % detailTabs.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? lastIndex
                      : currentIndex;
            if (nextIndex === currentIndex) return;
            event.preventDefault();
            const nextTab = detailTabs[nextIndex];
            setTab(nextTab);
            event.currentTarget
              .querySelectorAll<HTMLButtonElement>('[role="tab"]')
              [nextIndex]?.focus();
          }}
        >
          {detailTabs.map((item) => (
            <button
              key={item}
              id={`applicant-tab-${item.toLowerCase()}`}
              role="tab"
              type="button"
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
              aria-selected={tab === item}
              aria-controls="applicant-panel"
              tabIndex={tab === item ? 0 : -1}
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "Overview" && (
          <div className="records-detail-content" {...panelProps}>
            <div className="records-summary-grid">
              <div>
                <small>Current stage</small>
                <strong>{record.stage}</strong>
              </div>
              <div>
                <small>DFCAMCLP College Admission Test (DCAT)</small>
                <strong>{record.dcat?.status ?? "Not scheduled"}</strong>
              </div>
              <div>
                <small>Enrollment</small>
                <strong>{record.enrollment}</strong>
              </div>
            </div>
            <h3>Next review</h3>
            <p>
              {record.requirements.some((item) => item.status !== "Verified")
                ? "Check the physical requirements below before a DCAT schedule can be assigned."
                : !record.dcat
                  ? "All sample requirements are verified. Assign a DCAT schedule in the DCAT queue."
                  : record.dcat.status === "Awaiting Result"
                    ? "Confirm the sample DCAT result in the DCAT queue."
                    : record.dcat.status === "Passed"
                      ? "Continue the sample Registrar sequence in Enrollment."
                      : "Review the DCAT status in the DCAT queue."}
            </p>
            <div className="records-actions">
              {needsRequirements ? (
                <button
                  className="records-button"
                  onClick={() => setTab("Requirements")}
                >
                  Review requirements
                </button>
              ) : (
                <Link
                  className="records-button"
                  href={`/records/${nextArea}?record=${encodeURIComponent(record.id)}`}
                >
                  {nextArea === "enrollment" ? "Open enrollment" : "Open DCAT"}
                </Link>
              )}
              {!needsRequirements && (
                <button
                  className="records-button records-button-secondary"
                  onClick={() => setTab("Requirements")}
                >
                  View requirements
                </button>
              )}
              <Link
                className="records-button records-button-secondary"
                href={`/records/${nextArea === "dcat" ? "enrollment" : "dcat"}?record=${encodeURIComponent(record.id)}`}
              >
                {nextArea === "dcat" ? "View enrollment" : "View DCAT"}
              </Link>
            </div>
          </div>
        )}
        {tab === "Application" && (
          <div className="records-detail-content" {...panelProps}>
            <h3>Application summary</h3>
            <dl className="records-definition">
              <div>
                <dt>Applicant ID</dt>
                <dd>{record.id}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{record.name}</dd>
              </div>
              <div>
                <dt>Sample email</dt>
                <dd>{record.email}</dd>
              </div>
              <div>
                <dt>Campus</dt>
                <dd>{record.campus}</dd>
              </div>
              <div>
                <dt>Program</dt>
                <dd>{record.program}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{record.submitted}</dd>
              </div>
            </dl>
          </div>
        )}
        {tab === "Requirements" && (
          <div className="records-detail-content" {...panelProps}>
            <h3>Physical requirements</h3>
            <p className="records-context">
              Staff demo statuses only. Applicant preparation does not mean
              staff verification. No uploads or real documents are stored.
            </p>
            <div className="records-requirements">
              {record.requirements.map((item) => (
                <div key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <Status>{item.status}</Status>
                  </div>
                  <label>
                    Update sample status
                    <select
                      aria-label={`${item.name} status`}
                      disabled={Boolean(record.dcat)}
                      value={item.status}
                      onChange={(event) =>
                        setRequirement(
                          record.id,
                          item.name,
                          event.target.value as typeof item.status,
                        )
                      }
                    >
                      {[
                        "Pending",
                        "Presented",
                        "Verified",
                        "Needs Attention",
                      ].map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
            <p className="records-context">
              V1 ASSUMPTION: these four items and statuses illustrate physical
              checklist handling, not an official admissions decision. After a
              sample DCAT schedule, this checklist is locked for consistency.
            </p>
          </div>
        )}
        {tab === "DCAT" && (
          <div className="records-detail-content" {...panelProps}>
            <h3>DCAT state</h3>
            <p>
              {record.dcat
                ? `${record.dcat.status} · ${record.dcat.date} · ${record.dcat.time} · ${record.dcat.room}`
                : "No sample schedule assigned."}
            </p>
            <Link
              className="records-button"
              href={`/records/dcat?record=${encodeURIComponent(record.id)}`}
            >
              Open DCAT work area
            </Link>
          </div>
        )}
        {tab === "Enrollment" && (
          <div className="records-detail-content" {...panelProps}>
            <h3>Enrollment state</h3>
            <p>{record.enrollment}</p>
            <p className="records-context">
              Applicant ID remains {record.id}. This demo does not create a
              Student ID.
            </p>
            <Link
              className="records-button"
              href={`/records/enrollment?record=${encodeURIComponent(record.id)}`}
            >
              Open enrollment work area
            </Link>
          </div>
        )}
      </section>
      {feedback && (
        <p className="records-feedback" role="status">
          {feedback}
        </p>
      )}
    </div>
  );
}

function Dcat({ recordId, queue }: { recordId?: string; queue?: string }) {
  const { applicants, scheduleDcat, setExamStatus, feedback } =
    useRecordsDemo();
  const [selected, setSelected] = useState(recordId ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [review, setReview] = useState(false);
  const [result, setResult] = useState<"Passed" | "Not Qualified">("Passed");
  const [confirmResult, setConfirmResult] = useState(false);
  const [search, setSearch] = useState("");
  const [campus, setCampus] = useState("");
  const [program, setProgram] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<DcatSort>("exam-date");
  const [reverse, setReverse] = useState(false);
  function chooseDcatSort(next: DcatSort) {
    setSort(next);
    setReverse(false);
  }
  const candidates = applicants.filter(
    (item) => item.stage === "Eligible for DCAT" || item.dcat,
  );
  const queueCandidates = candidates.filter(
    (item) =>
      (queue !== "scheduling" && queue !== "results") ||
      (queue === "scheduling" && item.stage === "Eligible for DCAT") ||
      (queue === "results" && item.dcat?.status === "Awaiting Result"),
  );
  const sortedCandidates = sortDcatRecords(
    queueCandidates.filter(
      (item) =>
        matchesDcatSearch(item, search) &&
        (!campus || item.campus === campus) &&
        (!program || item.program === program) &&
        (!status || (item.dcat?.status ?? "Eligible for DCAT") === status),
    ),
    sort,
  );
  const visible = reverse ? sortedCandidates.toReversed() : sortedCandidates;
  const record = visible.find((item) => item.id === selected);
  return (
    <div className="records-stack">
      <section className="records-panel">
        <div className="records-panel-head">
          <div>
            <h2>
              {queue === "scheduling"
                ? "Ready for scheduling"
                : queue === "results"
                  ? "Results to record"
                  : "DCAT queue"}
            </h2>
            <p>Eligible applicants and existing sample exam states.</p>
          </div>
          {queue && <Link href="/records/dcat">All DCAT records</Link>}
        </div>
        <ListToolbar
          filters={
            <div className="records-filters records-dcat-filters">
              <label>
                Search
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, ID, email, campus, program or exam status"
                />
              </label>
              <label>
                Campus
                <select
                  value={campus}
                  onChange={(event) => setCampus(event.target.value)}
                >
                  <option value="">All campuses</option>
                  {canonicalCampuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Program
                <select
                  value={program}
                  onChange={(event) => setProgram(event.target.value)}
                >
                  <option value="">All programs</option>
                  {canonicalPrograms.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Exam status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">All statuses</option>
                  {[
                    ...new Set(
                      candidates.map(
                        (item) => item.dcat?.status ?? "Eligible for DCAT",
                      ),
                    ),
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <button
                className="records-text-button"
                type="button"
                onClick={() => {
                  setSearch("");
                  setCampus("");
                  setProgram("");
                  setStatus("");
                  chooseDcatSort("exam-date");
                }}
              >
                Clear filters
              </button>
            </div>
          }
          count={
            <span role="status" aria-live="polite" aria-atomic="true">
              {visible.length} of {queueCandidates.length} applicants shown
            </span>
          }
          sort={
            <SortControl
              id="dcat-sort"
              value={sort}
              onChange={(value) =>
                value === "name" || value === "exam-date"
                  ? chooseDcatSort(value)
                  : undefined
              }
              direction={reverse ? "descending" : "ascending"}
              onDirectionChange={() => setReverse((current) => !current)}
              options={[
                { value: "exam-date", label: "Exam date" },
                { value: "name", label: "Applicant name" },
              ]}
            />
          }
        />
        {visible.length ? (
          <div className="records-queue-list">
            {visible.map((item) => (
              <button
                type="button"
                className={`records-select-row ${selected === item.id ? "selected" : ""}`}
                aria-pressed={selected === item.id}
                key={item.id}
                onClick={() => {
                  setSelected(item.id);
                  setReview(false);
                  setConfirmResult(false);
                }}
              >
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.id} · {item.program}
                  </small>
                </span>
                <Status>{item.dcat?.status ?? "Eligible for DCAT"}</Status>
              </button>
            ))}
          </div>
        ) : (
          <Empty
            title={
              queueCandidates.length
                ? "No applicants match this search"
                : "Queue is clear"
            }
            detail={
              queueCandidates.length
                ? "Try another search or filter."
                : "There are no sample records in this DCAT state."
            }
          />
        )}
      </section>
      {record && (
        <section className="records-panel">
          <div className="records-panel-head">
            <div>
              <h2>{record.name}</h2>
              <p>
                {record.id} · {record.campus}
              </p>
            </div>
            <Link
              href={`/records/applicants?record=${encodeURIComponent(record.id)}`}
            >
              Applicant detail
            </Link>
          </div>
          {!record.dcat ? (
            <div className="records-detail-content">
              <h3>Assign a sample schedule</h3>
              <p>
                All four physical requirements are verified. This form does not
                book a room or send a notice.
              </p>
              <div className="records-form-grid">
                <label>
                  Date
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYY-MM-DD"
                    value={date}
                    onChange={(event) => {
                      setDate(event.target.value);
                      setReview(false);
                    }}
                  />
                </label>
                <label>
                  Time
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="HH:MM (24-hour)"
                    value={time}
                    onChange={(event) => {
                      setTime(event.target.value);
                      setReview(false);
                    }}
                  />
                </label>
                <label>
                  Room
                  <input
                    value={room}
                    onChange={(event) => {
                      setRoom(event.target.value);
                      setReview(false);
                    }}
                    placeholder="Sample Room 204"
                  />
                </label>
              </div>
              {review ? (
                <div className="records-review">
                  <strong>Review sample schedule</strong>
                  <p>
                    {date} · {time} · {room}
                  </p>
                  <button
                    className="records-button"
                    onClick={() => {
                      if (scheduleDcat(record.id, date, time, room))
                        setReview(false);
                    }}
                    type="button"
                  >
                    Save sample schedule
                  </button>
                  <button
                    className="records-text-button"
                    onClick={() => setReview(false)}
                    type="button"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <button
                  className="records-button"
                  disabled={!validSampleSchedule(date, time, room)}
                  onClick={() => setReview(true)}
                  type="button"
                >
                  Review schedule
                </button>
              )}
            </div>
          ) : (
            <div className="records-detail-content">
              <h3>Sample exam</h3>
              <dl className="records-definition">
                <div>
                  <dt>Status</dt>
                  <dd>{record.dcat.status}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{record.dcat.date}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{record.dcat.time}</dd>
                </div>
                <div>
                  <dt>Room</dt>
                  <dd>{record.dcat.room}</dd>
                </div>
              </dl>
              {record.dcat.status === "Awaiting Exam" && (
                <button
                  className="records-button"
                  onClick={() => setExamStatus(record.id, "Awaiting Result")}
                >
                  Mark exam completed
                </button>
              )}
              {record.dcat.status === "Awaiting Result" && (
                <div className="records-review">
                  <label>
                    Sample result
                    <select
                      value={result}
                      onChange={(event) => {
                        setResult(event.target.value as typeof result);
                        setConfirmResult(false);
                      }}
                    >
                      <option>Passed</option>
                      <option>Not Qualified</option>
                    </select>
                  </label>
                  {confirmResult ? (
                    <>
                      <p>
                        Confirm <strong>{result}</strong> for {record.name}.
                        This changes only the demo state.
                      </p>
                      <button
                        className="records-button"
                        onClick={() => {
                          setExamStatus(record.id, result);
                          setConfirmResult(false);
                        }}
                      >
                        Confirm sample result
                      </button>
                      <button
                        className="records-text-button"
                        onClick={() => setConfirmResult(false)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="records-button"
                      onClick={() => setConfirmResult(true)}
                    >
                      Review result
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}
      {feedback && (
        <p className="records-feedback" role="status">
          {feedback}
        </p>
      )}
    </div>
  );
}

function Students({
  recordId,
  initialState,
}: {
  recordId?: string;
  initialState?: DirectoryState;
}) {
  const { students } = useRecordsDemo();
  const filters = useFilters(students, initialState, matchesStudentSearch);
  const [year, setYear] = useState(initialState?.year ?? "");
  const [sort, setSort] = useState<StudentSort>(
    isStudentSort(initialState?.sort) ? initialState.sort : "name",
  );
  const [reverse, setReverse] = useState(initialState?.direction === "desc");
  function chooseSort(next: StudentSort) {
    setSort(next);
    setReverse(false);
  }
  function sortColumn(column: StudentSort) {
    if (sort === column) setReverse((current) => !current);
    else chooseSort(column);
  }
  const years = [...canonicalYearLevels];
  const standings = [...new Set(students.map((item) => item.standing))];
  const sortedStudents = sortStudents(
    filters.filtered.filter((item) => !year || item.year === year),
    sort,
  );
  const studentRows = reverse ? sortedStudents.toReversed() : sortedStudents;
  const state = {
    ...filters,
    year,
    sort,
    direction: reverse ? "desc" : undefined,
  };
  const record = students.find((item) => item.id === recordId);
  if (recordId && !record)
    return (
      <Empty
        title="Student record not found"
        detail="Return to the student directory and choose a sample record."
      />
    );
  if (record)
    return (
      <div className="records-stack">
        <section className="records-panel">
          <div className="records-detail-head">
            <div>
              <h2>Student profile</h2>
              <p>
                {record.year} · {record.term}
              </p>
            </div>
          </div>
          <div className="records-detail-content">
            <dl className="records-definition">
              <div>
                <dt>Student ID</dt>
                <dd>{record.id}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{record.email}</dd>
              </div>
              <div>
                <dt>Campus</dt>
                <dd>{record.campus}</dd>
              </div>
              <div>
                <dt>Program</dt>
                <dd>{record.program}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{record.year}</dd>
              </div>
              <div>
                <dt>Term</dt>
                <dd>{record.term}</dd>
              </div>
            </dl>
            <h3>Enrollment documents</h3>
            <p>
              Certificate of Enrollment (COE): <Status>{record.coe}</Status>
              <span aria-hidden="true"> · </span>
              Certificate of Registration (COR): <Status>{record.cor}</Status>
              <Status>{record.cor}</Status>
            </p>
            <Link
              className="records-button"
              href={`/records/documents?record=${encodeURIComponent(record.id)}`}
            >
              Open documents
            </Link>
          </div>
        </section>
      </div>
    );
  return (
    <section className="records-panel">
      <div className="records-panel-head">
        <div>
          <h2>Existing students</h2>
          <p>
            Sample Student IDs only. Applicant progression here does not create
            a student record.
          </p>
        </div>
      </div>
      <ListToolbar
        filters={
          <Filters
            filters={filters}
            searchLabel="Name, ID, email, campus, program, year or status"
            stages={standings}
            stageLabel="Status"
            yearFilter={{ options: years, value: year, set: setYear }}
            onClear={() => chooseSort("name")}
          />
        }
        count={
          <span role="status" aria-live="polite" aria-atomic="true">
            {studentRows.length} of {students.length} students shown
          </span>
        }
        sort={
          <SortControl
            id="student-sort"
            className="table-mobile-sort"
            value={sort}
            onChange={(value) => isStudentSort(value) && chooseSort(value)}
            direction={reverse ? "descending" : "ascending"}
            onDirectionChange={() => setReverse((current) => !current)}
            options={[
              { value: "name", label: "Student name" },
              { value: "id", label: "Student ID" },
              { value: "year", label: "Year level" },
            ]}
          />
        }
      />
      {studentRows.length ? (
        <>
          <div className="records-table-wrap">
            <table>
              <thead>
                <tr>
                  <SortableHeader
                    label="Student"
                    direction={
                      sort === "name"
                        ? reverse
                          ? "descending"
                          : "ascending"
                        : undefined
                    }
                    onSort={() => sortColumn("name")}
                  />
                  <SortableHeader
                    label="Student ID"
                    direction={
                      sort === "id"
                        ? reverse
                          ? "descending"
                          : "ascending"
                        : undefined
                    }
                    onSort={() => sortColumn("id")}
                  />
                  <th>Program</th>
                  <SortableHeader
                    label="Year"
                    direction={
                      sort === "year"
                        ? reverse
                          ? "descending"
                          : "ascending"
                        : undefined
                    }
                    onSort={() => sortColumn("year")}
                  />
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.id}</td>
                    <td>
                      {item.program}
                      <small>{item.campus}</small>
                    </td>
                    <td>{item.year}</td>
                    <td>
                      <Status>{item.standing}</Status>
                    </td>
                    <td>
                      <Link
                        className="records-row-link"
                        href={buildDirectoryHref("students", state, item.id)}
                      >
                        Open {item.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="records-mobile-list">
            {studentRows.map((item) => (
              <Link
                className="records-mobile-row"
                key={item.id}
                href={buildDirectoryHref("students", state, item.id)}
              >
                <strong>{item.name}</strong>
                <small>{item.id}</small>
                <span>Campus: {item.campus}</span>
                <span>Program: {item.program}</span>
                <span>Year level: {item.year}</span>
                <Status>{item.standing}</Status>
                <b>Open record →</b>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <Empty />
      )}
    </section>
  );
}

function Enrollment({ recordId }: { recordId?: string }) {
  const { applicants, advanceEnrollment, feedback } = useRecordsDemo();
  const candidates = applicants.filter(
    (item) => item.dcat?.status === "Passed",
  );
  const [selected, setSelected] = useState(recordId ?? "");
  const [confirm, setConfirm] = useState(false);
  const record = candidates.find((item) => item.id === selected);
  const next = record ? nextEnrollmentStep(record) : null;
  return (
    <div className="records-stack">
      <section className="records-panel">
        <div className="records-panel-head">
          <div>
            <h2>Qualified applicants</h2>
            <p>Sample progression after a Passed DCAT result.</p>
          </div>
        </div>
        {candidates.length ? (
          <div className="records-queue-list">
            {candidates.map((item) => (
              <button
                className={`records-select-row ${selected === item.id ? "selected" : ""}`}
                aria-pressed={selected === item.id}
                type="button"
                key={item.id}
                onClick={() => {
                  setSelected(item.id);
                  setConfirm(false);
                }}
              >
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.id} · {item.program}
                  </small>
                </span>
                <Status>{item.enrollment}</Status>
              </button>
            ))}
          </div>
        ) : (
          <Empty
            title="No qualified applicants"
            detail="A Passed sample DCAT result will appear here."
          />
        )}
      </section>
      {record && (
        <section className="records-panel">
          <div className="records-panel-head">
            <div>
              <h2>{record.name}</h2>
              <p>
                {record.id} · {record.campus}
              </p>
            </div>
            <Link
              href={`/records/applicants?record=${encodeURIComponent(record.id)}`}
            >
              Applicant detail
            </Link>
          </div>
          <div className="records-detail-content">
            <h3>Enrollment sequence</h3>
            <ol className="records-sequence">
              {enrollmentSequence.map((step, index) => (
                <li
                  key={step}
                  className={
                    enrollmentSequence.indexOf(record.enrollment) >= index
                      ? "done"
                      : ""
                  }
                >
                  <span>{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="records-context">
              Registrar physical submission is represented by a sample
              confirmation. Certificate of Enrollment (COE) and Certificate of
              Registration (COR) are sample statuses, not official releases.
            </p>
            {next &&
              (confirm ? (
                <div className="records-review">
                  <strong>Confirm {next}</strong>
                  <p>
                    This advances {record.name} in this browser session only.
                  </p>
                  <button
                    className="records-button"
                    onClick={() => {
                      advanceEnrollment(record.id);
                      setConfirm(false);
                    }}
                  >
                    Confirm sample step
                  </button>
                  <button
                    className="records-text-button"
                    onClick={() => setConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="records-button"
                  onClick={() => setConfirm(true)}
                >
                  Advance to {next}
                </button>
              ))}
            {!next && (
              <p className="records-context">
                {record.enrollment === "COE Available" ||
                record.enrollment === "COR Available"
                  ? "Mark the available sample document issued in Documents to continue."
                  : "Sample sequence complete. No Student ID was generated."}
              </p>
            )}
            <Link
              className="records-button records-button-secondary"
              href={`/records/documents?record=${encodeURIComponent(record.id)}`}
            >
              Review COE / COR
            </Link>
          </div>
        </section>
      )}
      {feedback && (
        <p className="records-feedback" role="status">
          {feedback}
        </p>
      )}
    </div>
  );
}

function Documents({ recordId, queue }: { recordId?: string; queue?: string }) {
  const {
    applicants,
    students,
    setApplicantDocument,
    setStudentDocument,
    feedback,
  } = useRecordsDemo();
  const rows = [
    ...applicants.filter((item) => item.dcat?.status === "Passed"),
    ...students,
  ];
  const [selected, setSelected] = useState(recordId ?? "");
  const [preview, setPreview] = useState<"coe" | "cor" | null>(null);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<"" | "coe" | "cor">("");
  const [status, setStatus] = useState("");
  const [recordType, setRecordType] = useState("");
  const [campus, setCampus] = useState("");
  const [program, setProgram] = useState("");
  const [sort, setSort] = useState<DocumentSort>("name");
  const [reverse, setReverse] = useState(false);
  function chooseDocumentSort(next: DocumentSort) {
    setSort(next);
    setReverse(false);
  }
  const queueRows = rows.filter(
    (item) =>
      queue !== "available" ||
      item.coe === "Available" ||
      item.cor === "Available",
  );
  const filtered = queueRows.filter(
    (item) =>
      matchesDocumentSearch(item, search) &&
      (!recordType ||
        (recordType === "student" ? "year" in item : "submitted" in item)) &&
      (!status ||
        (kind
          ? item[kind] === status
          : item.coe === status || item.cor === status)) &&
      (!campus || item.campus === campus) &&
      (!program || item.program === program),
  );
  const sortedDocuments = sortDocumentRecords(filtered, sort);
  const visible = reverse ? sortedDocuments.toReversed() : sortedDocuments;
  const record = visible.find((item) => item.id === selected);
  const applicant = record && "submitted" in record;
  function issue(kind: "coe" | "cor") {
    if (!record) return;
    if (applicant) setApplicantDocument(record.id, kind, "Issued");
    else setStudentDocument(record.id, kind, "Issued");
  }
  return (
    <div className="records-stack">
      <section className="records-panel">
        <div className="records-panel-head">
          <div>
            <h2>
              {queue === "available"
                ? "Available documents"
                : "Sample document register"}
            </h2>
            <p>
              COE and COR availability for qualified applicants and existing
              students.
            </p>
          </div>
          {queue && <Link href="/records/documents">All documents</Link>}
        </div>
        <ListToolbar
          filters={
            <div className="records-filters records-document-filters">
              <label>
                Search
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, ID, email, campus, program or COE/COR status"
                />
              </label>
              <label>
                Campus
                <select
                  value={campus}
                  onChange={(event) => setCampus(event.target.value)}
                >
                  <option value="">All campuses</option>
                  {canonicalCampuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Program
                <select
                  value={program}
                  onChange={(event) => setProgram(event.target.value)}
                >
                  <option value="">All programs</option>
                  {canonicalPrograms.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Document type
                <select
                  value={kind}
                  onChange={(event) =>
                    setKind(event.target.value as typeof kind)
                  }
                >
                  <option value="">All types</option>
                  <option value="coe">COE</option>
                  <option value="cor">COR</option>
                </select>
              </label>
              <label>
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">All statuses</option>
                  <option>Not Available</option>
                  <option>Available</option>
                  <option>Issued</option>
                </select>
              </label>
              <label>
                Record type
                <select
                  value={recordType}
                  onChange={(event) => setRecordType(event.target.value)}
                >
                  <option value="">All records</option>
                  <option value="applicant">Applicants</option>
                  <option value="student">Students</option>
                </select>
              </label>
              <button
                className="records-text-button"
                type="button"
                onClick={() => {
                  setSearch("");
                  setKind("");
                  setStatus("");
                  setRecordType("");
                  setCampus("");
                  setProgram("");
                  chooseDocumentSort("name");
                }}
              >
                Clear filters
              </button>
            </div>
          }
          count={
            <span role="status" aria-live="polite" aria-atomic="true">
              {visible.length} of {queueRows.length} records shown
            </span>
          }
          sort={
            <SortControl
              id="document-sort"
              value={sort}
              onChange={(value) =>
                value === "name" ||
                value === "campus" ||
                value === "program" ||
                value === "status"
                  ? chooseDocumentSort(value)
                  : undefined
              }
              direction={reverse ? "descending" : "ascending"}
              onDirectionChange={() => setReverse((current) => !current)}
              options={[
                { value: "name", label: "Record name" },
                { value: "campus", label: "Campus" },
                { value: "program", label: "Program" },
                { value: "status", label: "Document status" },
              ]}
            />
          }
        />
        {visible.length ? (
          <div className="records-queue-list">
            {visible.map((item) => (
              <button
                className={`records-select-row ${selected === item.id ? "selected" : ""}`}
                aria-pressed={selected === item.id}
                key={item.id}
                type="button"
                onClick={() => {
                  setSelected(item.id);
                  setPreview(null);
                }}
              >
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.id} · {item.program}
                  </small>
                </span>
                <span className="records-document-row-status">
                  <small>COE</small>
                  <Status>{item.coe}</Status>
                  <small>COR</small>
                  <Status>{item.cor}</Status>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <Empty
            title="No documents match filters"
            detail="Try another search or filter. Available documents appear after a sample enrollment step."
          />
        )}
      </section>
      {record && (
        <section className="records-panel">
          <div className="records-panel-head">
            <div>
              <h2>{record.name}</h2>
              <p>
                {record.id} · {applicant ? "Applicant" : "Existing student"}
              </p>
            </div>
          </div>
          <div className="records-document-list">
            {(["coe", "cor"] as const).map((kind) => (
              <div key={kind}>
                <div>
                  <h3>
                    {kind === "coe"
                      ? "Certificate of Enrollment"
                      : "Certificate of Registration"}
                  </h3>
                  <Status>{record[kind]}</Status>
                </div>
                <div className="records-actions">
                  <button
                    className="records-button records-button-secondary"
                    disabled={record[kind] === "Not Available"}
                    onClick={() => setPreview(kind)}
                  >
                    Preview sample
                  </button>
                  <button
                    className="records-button"
                    disabled={record[kind] !== "Available"}
                    onClick={() => issue(kind)}
                  >
                    Mark issued
                  </button>
                </div>
              </div>
            ))}
          </div>
          {preview && (
            <div className="records-document-preview">
              <p className="records-watermark">
                SAMPLE · DEMO · NOT VALID FOR OFFICIAL USE
              </p>
              <h3>
                {preview === "coe"
                  ? "Certificate of Enrollment"
                  : "Certificate of Registration"}
              </h3>
              <p>
                {record.name} · {record.id}
              </p>
              <p>
                {record.program} · {record.campus}
              </p>
              <p>
                Illustrative document preview for portal testing. This is not an
                issued school certificate.
              </p>
              <div className="records-actions records-print-actions">
                <button
                  className="records-button records-button-secondary"
                  onClick={() => window.print()}
                >
                  Print sample preview
                </button>
                <button
                  className="records-text-button"
                  onClick={() => setPreview(null)}
                >
                  Close preview
                </button>
              </div>
            </div>
          )}
        </section>
      )}
      {feedback && (
        <p className="records-feedback" role="status">
          {feedback}
        </p>
      )}
    </div>
  );
}

export function RecordsPage({
  section,
  recordId,
  queue,
  listState = {},
}: Props) {
  const { applicants, students, setFeedback } = useRecordsDemo();
  useEffect(() => setFeedback(""), [section, recordId, queue, setFeedback]);
  const applicant = applicants.find((item) => item.id === recordId);
  const student = students.find((item) => item.id === recordId);
  const selectedRecord =
    section === "applicants"
      ? applicant
      : section === "students"
        ? student
        : undefined;
  const recordBackHref =
    section === "applicants"
      ? buildDirectoryHref(
          "applicants",
          listState,
          undefined,
          queue === "requirements" ? "requirements" : undefined,
        )
      : section === "students"
        ? buildDirectoryHref("students", listState)
        : undefined;
  return (
    <div
      className="records-page"
      data-section={section}
      data-layout={
        section === "dashboard" ? "dashboard" : recordId ? "detail" : "wide"
      }
    >
      <Heading
        section={section}
        record={selectedRecord}
        backHref={recordBackHref}
      />
      {section === "dashboard" && <Dashboard />}
      {section === "applicants" &&
        (recordId ? (
          applicant ? (
            <RecordDetail record={applicant} />
          ) : (
            <Empty
              title="Applicant record not found"
              detail="Return to the applicant directory and choose a sample record."
            />
          )
        ) : (
          <Applicants queue={queue} initialState={listState} />
        ))}
      {section === "dcat" && <Dcat recordId={recordId} queue={queue} />}
      {section === "students" && (
        <Students recordId={recordId} initialState={listState} />
      )}
      {section === "enrollment" && <Enrollment recordId={recordId} />}
      {section === "documents" && (
        <Documents recordId={recordId} queue={queue} />
      )}
    </div>
  );
}
