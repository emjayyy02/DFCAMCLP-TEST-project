/** P3-M5 fictional, browser-only Records fixtures. No institutional record is represented. */
import {
  applicantIdentity,
  requirements as applicantRequirements,
} from "../applicant/demo-data";
import { studentDemoData } from "../student/demo-data";

export type RequirementStatus =
  "Pending" | "Presented" | "Verified" | "Needs Attention";
export type ExamStatus =
  "Awaiting Exam" | "Awaiting Result" | "Passed" | "Not Qualified";
export type EnrollmentStatus =
  | "Not Started"
  | "For Enrollment"
  | "Registrar Submission"
  | "COE Available"
  | "COE Issued"
  | "COR Available"
  | "COR Issued"
  | "Enrolled";
export type DocumentStatus = "Not Available" | "Available" | "Issued";
export type Requirement = { name: string; status: RequirementStatus };
export type ApplicantRecord = {
  id: string;
  name: string;
  email: string;
  campus: string;
  program: string;
  stage: string;
  submitted: string;
  requirements: Requirement[];
  dcat: { status: ExamStatus; date: string; time: string; room: string } | null;
  enrollment: EnrollmentStatus;
  coe: DocumentStatus;
  cor: DocumentStatus;
};
export type StudentRecord = {
  id: string;
  name: string;
  email: string;
  campus: string;
  program: string;
  year: string;
  standing: string;
  term: string;
  coe: DocumentStatus;
  cor: DocumentStatus;
};

const names = applicantRequirements.map((item) => item.name);
const allVerified = names.map((name) => ({
  name,
  status: "Verified" as const,
}));
const requirementsForJamie = names.map((name, index) => ({
  name,
  status: index === 3 ? ("Pending" as const) : ("Presented" as const),
}));

export const initialApplicants: ApplicantRecord[] = [
  {
    id: applicantIdentity.id,
    name: `${applicantIdentity.firstName} ${applicantIdentity.lastName}`,
    email: applicantIdentity.email,
    campus: "IIT Campus",
    program: "BSCpE — Bachelor of Science in Computer Engineering",
    stage: "Document submission scheduled",
    submitted: "15 Sep 2026",
    requirements: requirementsForJamie,
    dcat: null,
    enrollment: "Not Started",
    coe: "Not Available",
    cor: "Not Available",
  },
  {
    id: "DEMO-APP-002",
    name: "Alex Rivera",
    email: "alex.rivera.demo@example.invalid",
    campus: "Main Campus",
    program: "BSA — Bachelor of Science in Accountancy",
    stage: "Requirements review",
    submitted: "17 Sep 2026",
    requirements: names.map((name, index) => ({
      name,
      status: index === 1 ? "Needs Attention" : "Verified",
    })),
    dcat: null,
    enrollment: "Not Started",
    coe: "Not Available",
    cor: "Not Available",
  },
  {
    id: "DEMO-APP-003",
    name: "Sam Dela Cruz",
    email: "sam.delacruz.demo@example.invalid",
    campus: "IIT Campus",
    program: "BSIS — Bachelor of Science in Information Systems",
    stage: "Eligible for DCAT",
    submitted: "12 Sep 2026",
    requirements: allVerified,
    dcat: null,
    enrollment: "Not Started",
    coe: "Not Available",
    cor: "Not Available",
  },
  {
    id: "DEMO-APP-004",
    name: "Taylor Santos",
    email: "taylor.santos.demo@example.invalid",
    campus: "Main Campus",
    program: "BSBA — Bachelor of Science in Business Administration",
    stage: "DCAT scheduled",
    submitted: "10 Sep 2026",
    requirements: allVerified,
    dcat: {
      status: "Awaiting Exam",
      date: "2026-09-28",
      time: "08:00",
      room: "Sample Room 204",
    },
    enrollment: "Not Started",
    coe: "Not Available",
    cor: "Not Available",
  },
  {
    id: "DEMO-APP-005",
    name: "Casey Lim",
    email: "casey.lim.demo@example.invalid",
    campus: "IIT Campus",
    program: "BSCpE — Bachelor of Science in Computer Engineering",
    stage: "Awaiting result",
    submitted: "09 Sep 2026",
    requirements: allVerified,
    dcat: {
      status: "Awaiting Result",
      date: "2026-09-24",
      time: "08:00",
      room: "Sample Room 102",
    },
    enrollment: "Not Started",
    coe: "Not Available",
    cor: "Not Available",
  },
  {
    id: "DEMO-APP-006",
    name: "Jordan Bautista",
    email: "jordan.bautista.demo@example.invalid",
    campus: "Main Campus",
    program: "BSA — Bachelor of Science in Accountancy",
    stage: "For enrollment",
    submitted: "05 Sep 2026",
    requirements: allVerified,
    dcat: {
      status: "Passed",
      date: "2026-09-22",
      time: "08:00",
      room: "Sample Room 101",
    },
    enrollment: "For Enrollment",
    coe: "Not Available",
    cor: "Not Available",
  },
];

export const initialStudents: StudentRecord[] = [
  {
    id: studentDemoData.identity.studentId,
    name: studentDemoData.identity.fullName,
    email: studentDemoData.identity.email,
    campus: studentDemoData.identity.campus,
    program: studentDemoData.identity.program,
    year: studentDemoData.identity.yearLevel,
    standing: studentDemoData.identity.academicStatus,
    term: `${studentDemoData.term.academicYear} · ${studentDemoData.term.semester}`,
    coe: "Issued",
    cor: "Issued",
  },
  {
    id: "DEMO-STU-2026-0175",
    name: "Riley Mendoza",
    email: "riley.mendoza.demo@example.invalid",
    campus: "Main Campus",
    program: "BSA — Bachelor of Science in Accountancy",
    year: "1st Year",
    standing: "Active Student",
    term: "2026–2027 · 1st Semester",
    coe: "Available",
    cor: "Issued",
  },
  {
    id: "DEMO-STU-2026-0191",
    name: "Morgan Flores",
    email: "morgan.flores.demo@example.invalid",
    campus: "IIT Campus",
    program: "BSIS — Bachelor of Science in Information Systems",
    year: "3rd Year",
    standing: "Active Student",
    term: "2026–2027 · 1st Semester",
    coe: "Issued",
    cor: "Available",
  },
];

export const enrollmentSequence: EnrollmentStatus[] = [
  "For Enrollment",
  "Registrar Submission",
  "COE Available",
  "COE Issued",
  "COR Available",
  "COR Issued",
  "Enrolled",
];

export function nextEnrollmentStep(
  record: ApplicantRecord,
): EnrollmentStatus | null {
  if (record.dcat?.status !== "Passed") return null;
  if (
    record.enrollment === "COE Available" ||
    record.enrollment === "COR Available"
  )
    return null;
  const index = enrollmentSequence.indexOf(record.enrollment);
  return index >= 0 && index < enrollmentSequence.length - 1
    ? enrollmentSequence[index + 1]
    : null;
}

export function countRecords(
  records: ApplicantRecord[],
  students: StudentRecord[] = [],
) {
  return {
    requirements: records.filter((record) =>
      record.requirements.some((item) => item.status !== "Verified"),
    ).length,
    scheduling: records.filter((record) => record.stage === "Eligible for DCAT")
      .length,
    results: records.filter(
      (record) => record.dcat?.status === "Awaiting Result",
    ).length,
    enrollment: records.filter(
      (record) =>
        record.dcat?.status === "Passed" && record.enrollment !== "Enrolled",
    ).length,
    documents: [...records, ...students].filter(
      (record) => record.coe === "Available" || record.cor === "Available",
    ).length,
  };
}

export function validSampleSchedule(date: string, time: string, room: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    !room.trim()
  )
    return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}
