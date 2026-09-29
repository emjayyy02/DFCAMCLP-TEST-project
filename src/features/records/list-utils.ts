import { campusProgramGroups } from "../../lib/institution-programs";
import type { ApplicantRecord, StudentRecord } from "./demo-data";

export const canonicalCampuses = campusProgramGroups.map(
  (campus) => campus.name,
);

export const canonicalPrograms = campusProgramGroups.flatMap((campus) =>
  campus.programs.map((program) => `${program.code} — ${program.name}`),
);

export const canonicalYearLevels = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
] as const;

export type DirectorySort = "attention" | "oldest" | "newest" | "name";
export type StudentSort = "name" | "id" | "year";
export type DocumentSort = "name" | "campus" | "program" | "status";
export type DcatSort = "name" | "exam-date";

function matchesSearch(values: Array<string | undefined>, query: string) {
  const normalizedQuery = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalizedQuery) return true;

  return values.some(
    (value) =>
      value?.toLowerCase().replace(/\s+/g, " ").includes(normalizedQuery) ??
      false,
  );
}

function applicantContextFields(record: ApplicantRecord) {
  return [record.id, record.name, record.email, record.campus, record.program];
}

function applicantIdentityFields(record: ApplicantRecord) {
  return [...applicantContextFields(record), record.stage];
}

export function matchesApplicantSearch(record: ApplicantRecord, query: string) {
  return matchesSearch(applicantIdentityFields(record), query);
}

export function matchesRequirementsSearch(
  record: ApplicantRecord,
  query: string,
) {
  return matchesSearch(
    [
      ...applicantIdentityFields(record),
      ...record.requirements.flatMap((requirement) => [
        requirement.name,
        requirement.status,
      ]),
    ],
    query,
  );
}

export function matchesDcatSearch(record: ApplicantRecord, query: string) {
  const visibleStatus =
    record.dcat?.status ??
    (record.stage === "Eligible for DCAT" ? "Eligible for DCAT" : undefined);
  return matchesSearch(
    [...applicantContextFields(record), visibleStatus],
    query,
  );
}

export function matchesDocumentSearch(
  record: ApplicantRecord | StudentRecord,
  query: string,
) {
  return matchesSearch(
    [
      record.id,
      record.name,
      record.email,
      record.campus,
      record.program,
      record.coe,
      record.cor,
    ],
    query,
  );
}

export function matchesStudentSearch(record: StudentRecord, query: string) {
  return matchesSearch(
    [
      record.id,
      record.name,
      record.email,
      record.campus,
      record.program,
      record.year,
      record.standing,
    ],
    query,
  );
}

function submittedTimestamp(value: string) {
  const [day, monthName, year] = value.split(" ");
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].indexOf(monthName);
  const timestamp = Date.UTC(Number(year), month, Number(day));
  return month >= 0 && Number.isFinite(timestamp) ? timestamp : 0;
}

function compareText(left: string, right: string) {
  return left.localeCompare(right, "en", { sensitivity: "base" });
}

function attentionRank(record: ApplicantRecord) {
  const statuses = record.requirements.map((requirement) => requirement.status);
  if (statuses.includes("Needs Attention")) return 0;
  if (statuses.includes("Pending")) return 1;
  if (statuses.includes("Presented")) return 2;
  return 3;
}

export function sortApplicants(
  records: ApplicantRecord[],
  sort: DirectorySort,
) {
  return records
    .map((record, index) => ({ record, index }))
    .sort((a, b) => {
      let order = 0;
      if (sort === "attention") {
        order =
          attentionRank(a.record) - attentionRank(b.record) ||
          submittedTimestamp(a.record.submitted) -
            submittedTimestamp(b.record.submitted);
      } else if (sort === "oldest") {
        order =
          submittedTimestamp(a.record.submitted) -
          submittedTimestamp(b.record.submitted);
      } else if (sort === "newest") {
        order =
          submittedTimestamp(b.record.submitted) -
          submittedTimestamp(a.record.submitted);
      } else {
        order = compareText(a.record.name, b.record.name);
      }
      return (
        order || compareText(a.record.id, b.record.id) || a.index - b.index
      );
    })
    .map(({ record }) => record);
}

export function sortDcatRecords(records: ApplicantRecord[], sort: DcatSort) {
  return records
    .map((record, index) => ({ record, index }))
    .sort((a, b) => {
      const order =
        sort === "exam-date"
          ? (a.record.dcat?.date ?? "9999-12-31").localeCompare(
              b.record.dcat?.date ?? "9999-12-31",
            )
          : compareText(a.record.name, b.record.name);
      return (
        order || compareText(a.record.id, b.record.id) || a.index - b.index
      );
    })
    .map(({ record }) => record);
}

const yearOrder: Record<string, number> = {
  "1st Year": 1,
  "2nd Year": 2,
  "3rd Year": 3,
  "4th Year": 4,
};

export function sortStudents(records: StudentRecord[], sort: StudentSort) {
  return records
    .map((record, index) => ({ record, index }))
    .sort((a, b) => {
      let order = 0;
      if (sort === "id") order = compareText(a.record.id, b.record.id);
      else if (sort === "year")
        order =
          (yearOrder[a.record.year] ?? Number.MAX_SAFE_INTEGER) -
          (yearOrder[b.record.year] ?? Number.MAX_SAFE_INTEGER);
      else order = compareText(a.record.name, b.record.name);
      return (
        order ||
        compareText(a.record.name, b.record.name) ||
        compareText(a.record.id, b.record.id) ||
        a.index - b.index
      );
    })
    .map(({ record }) => record);
}

export function sortDocumentRecords<T extends ApplicantRecord | StudentRecord>(
  records: T[],
  sort: DocumentSort,
) {
  function statusValue(record: T) {
    const statuses = [record.coe, record.cor];
    if (statuses.includes("Available")) return 0;
    if (statuses.includes("Issued")) return 1;
    return 2;
  }

  return records
    .map((record, index) => ({ record, index }))
    .sort((a, b) => {
      let order = 0;
      if (sort === "campus")
        order = compareText(a.record.campus, b.record.campus);
      else if (sort === "program")
        order = compareText(a.record.program, b.record.program);
      else if (sort === "status")
        order = statusValue(a.record) - statusValue(b.record);
      else order = compareText(a.record.name, b.record.name);
      return (
        order ||
        compareText(a.record.name, b.record.name) ||
        compareText(a.record.id, b.record.id) ||
        a.index - b.index
      );
    })
    .map(({ record }) => record);
}
