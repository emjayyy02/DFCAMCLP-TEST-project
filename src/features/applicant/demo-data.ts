/** P3-M2 synthetic fixtures only. No institutional policy or live applicant data. */
import { developmentAuthAccountSeed } from "../../server/db/seed/data";
const applicantAccount = developmentAuthAccountSeed[1];
export const applicantIdentity = {
  id: "APP-TEST-0001",
  firstName: applicantAccount.name.split(" ")[0],
  lastName: applicantAccount.name.split(" ").slice(1).join(" "),
  email: applicantAccount.email,
} as const;

export const campusOptions = [
  { code: "MAIN", label: "Main Campus" },
  { code: "IIT_CAA", label: "IIT Campus" },
] as const;

export const programOptions = [
  {
    code: "BSA",
    campus: "MAIN",
    label: "BSA — Bachelor of Science in Accountancy",
    majors: [],
  },
  {
    code: "BSBA",
    campus: "MAIN",
    label: "BSBA — Bachelor of Science in Business Administration",
    majors: [
      "Financial Management",
      "Marketing Management",
      "Human Resource Management",
    ],
  },
  {
    code: "BSIS",
    campus: "IIT_CAA",
    label: "BSIS — Bachelor of Science in Information Systems",
    majors: [],
  },
  {
    code: "CPE",
    campus: "IIT_CAA",
    label: "BSCpE — Bachelor of Science in Computer Engineering",
    majors: [],
  },
];

export const initialApplication = {
  firstName: applicantIdentity.firstName as string,
  lastName: applicantIdentity.lastName as string,
  birthDate: "2008-01-15",
  email: applicantIdentity.email as string,
  phone: "0900 000 0000",
  street: "12 Sample Street",
  barangay: "Sample Barangay",
  city: "Las Piñas",
  school: "Sample Senior High School",
  strand: "STEM",
  graduationYear: "2026",
  campus: "IIT_CAA",
  program: "CPE",
  major: "",
};
export type ApplicationDraft = typeof initialApplication;

export const scenarios = {
  draft: {
    label: "Application draft",
    stage: "Draft",
    journey: 0,
    verified: false,
    exam: "unavailable",
    enrollment: -1,
  },
  submitted: {
    label: "Waiting for document schedule",
    stage: "Application submitted",
    journey: 1,
    verified: false,
    exam: "unavailable",
    enrollment: -1,
  },
  documents: {
    label: "Physical documents scheduled",
    stage: "Document submission scheduled",
    journey: 1,
    verified: false,
    exam: "unavailable",
    enrollment: -1,
  },
  eligible: {
    label: "Waiting for DCAT schedule",
    stage: "Eligible for DCAT",
    journey: 3,
    verified: true,
    exam: "unavailable",
    enrollment: -1,
  },
  scheduled: {
    label: "DCAT scheduled",
    stage: "DCAT scheduled",
    journey: 3,
    verified: true,
    exam: "scheduled",
    enrollment: -1,
  },
  awaiting: {
    label: "Awaiting DCAT result",
    stage: "Awaiting result",
    journey: 4,
    verified: true,
    exam: "awaiting",
    enrollment: -1,
  },
  passed: {
    label: "Passed · for enrollment",
    stage: "For enrollment",
    journey: 5,
    verified: true,
    exam: "passed",
    enrollment: 1,
  },
  notQualified: {
    label: "Not Qualified",
    stage: "Not Qualified",
    journey: 4,
    verified: true,
    exam: "notQualified",
    enrollment: -1,
  },
  coe: {
    label: "COE available",
    stage: "COE issued",
    journey: 5,
    verified: true,
    exam: "passed",
    enrollment: 3,
  },
  cor: {
    label: "COR available",
    stage: "COR issued",
    journey: 5,
    verified: true,
    exam: "passed",
    enrollment: 4,
  },
} as const;
export type ScenarioKey = keyof typeof scenarios;
export type DemoScenario = (typeof scenarios)[ScenarioKey];

export const requirements = [
  { name: "Report card / academic record", prepared: true },
  { name: "Good Moral Certificate", prepared: true },
  { name: "PSA birth certificate", prepared: true },
  { name: "Proof of Las Piñas residency", prepared: false },
] as const;

export const demoSchedules = {
  documents: {
    date: "6 October 2026",
    time: "9:00 AM",
    location: "Sample submission desk",
    campus: "IIT Campus",
  },
  exam: {
    date: "12 October 2026",
    time: "8:00–10:00 AM",
    location: "Sample Room 204",
    campus: "IIT Campus",
  },
  registrar: {
    date: "20 October 2026",
    time: "9:30 AM",
    location: "Sample Registrar desk",
    campus: "IIT Campus",
  },
} as const;
export type Schedule = {
  date: string;
  time: string;
  location: string;
  campus: string;
};

export const journeySteps = [
  "Application",
  "Document submission",
  "Documents verified",
  "DCAT",
  "Results",
  "Enrollment",
];
export const enrollmentSteps = [
  "Qualified",
  "Registrar submission",
  "COE issued",
  "COR issued",
  "Enrolled",
];

export const announcements = [
  {
    id: "documents",
    title: "Preparing your physical requirements",
    date: "15 September 2026",
    category: "Application",
    summary:
      "In this sample journey, review your checklist before the document appointment.",
  },
  {
    id: "exam",
    title: "Finding your DCAT form",
    date: "14 September 2026",
    category: "DCAT",
    summary:
      "The sample exam form becomes available in DCAT when a demo schedule is assigned.",
  },
  {
    id: "enrollment",
    title: "Your next steps after results",
    date: "12 September 2026",
    category: "Enrollment",
    summary:
      "Explore the Passed scenario to preview Registrar scheduling and enrollment documents.",
  },
] as const;

export function programDisplay(draft: ApplicationDraft) {
  return (
    programOptions.find((program) => program.code === draft.program)?.label ??
    "Not selected"
  );
}
export function campusDisplay(draft: ApplicationDraft) {
  return (
    campusOptions.find((campus) => campus.code === draft.campus)?.label ??
    "Not selected"
  );
}

/** Demo field checks (V1 ASSUMPTION Q13), not official admissions rules. */
export function validateApplication(draft: ApplicationDraft) {
  const errors: Partial<Record<keyof ApplicationDraft, string>> = {};
  const required = [
    "firstName",
    "lastName",
    "birthDate",
    "email",
    "phone",
    "street",
    "barangay",
    "city",
    "school",
    "strand",
    "graduationYear",
    "campus",
    "program",
  ] as const;
  for (const field of required) {
    if (!draft[field].trim())
      errors[field] = "Complete this field for the demo.";
  }
  if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email))
    errors.email = "Enter an email such as jamie@example.invalid.";
  if (draft.phone && !/^[+\d ()-]{7,20}$/.test(draft.phone))
    errors.phone = "Use 7–20 characters: digits, spaces, +, ( ), or -.";
  if (
    draft.birthDate &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(draft.birthDate) ||
      !Number.isFinite(Date.parse(draft.birthDate)))
  )
    errors.birthDate = "Enter a valid date.";
  if (draft.graduationYear && !/^\d{4}$/.test(draft.graduationYear))
    errors.graduationYear = "Enter a four-digit year.";
  const program = programOptions.find(
    (item) => item.code === draft.program && item.campus === draft.campus,
  );
  if (!program) errors.program = "Choose a program at the selected campus.";
  if (program?.majors.length && !program.majors.includes(draft.major))
    errors.major = "Choose a BSBA major.";
  return errors;
}
