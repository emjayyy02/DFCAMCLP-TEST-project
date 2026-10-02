import { studentDemoData } from "../student/demo-data";
import { developmentAuthAccountSeed } from "../../server/db/seed/data";

export type AcademicWeekday =
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type AttendanceValue = "Unmarked" | "Present" | "Late" | "Absent";
export type GradeSubmissionStatus = "Draft" | "Ready for Review" | "Submitted";

export type AcademicSubject = {
  id: string;
  code: string;
  title: string;
  units: number;
};

export type AcademicFaculty = {
  id: string;
  name: string;
  roleLabel: string;
};

export type AcademicStudent = {
  id: string;
  studentId: string;
  name: string;
  section: string;
  status: "Enrolled";
};

export type AcademicMeetingSlot = {
  day: AcademicWeekday;
  start: string;
  end: string;
  room: string;
};

export type AcademicOffering = {
  id: string;
  subjectId: string;
  termId: string;
  section: string;
  campus: string;
  program: string;
  facultyId: string;
  studentIds: readonly string[];
  schedule: readonly AcademicMeetingSlot[];
  meetingDates: readonly { date: string; day: AcademicWeekday }[];
};

export type AcademicAttendanceSession = {
  id: string;
  offeringId: string;
  date: string;
  savedOn: string;
  records: Record<string, AttendanceValue>;
};

export type AcademicGradeBook = {
  offeringId: string;
  status: GradeSubmissionStatus;
  grades: Record<string, string>;
  updatedOn?: string;
  submittedOn?: string;
};

export type AcademicSubmissionHistoryItem = {
  id: string;
  offeringId: string;
  facultyId: string;
  subjectId: string;
  section: string;
  termLabel: string;
  submittedOn: string;
  studentCount: number;
  status: "Submitted";
};

export type AcademicAnnouncement = {
  id: string;
  date: string;
  audience: "Campus" | "Program" | "Section" | "Class";
  audienceLabel: string;
  offeringId?: string;
  title: string;
  summary: string;
};

const roster = [
  {
    id: "student-primary",
    studentId: "DEMO-STU-2026-0142",
    name: studentDemoData.identity.fullName,
    section: "BSIS-3A",
    status: "Enrolled",
  },
  {
    id: "student-nina",
    studentId: "DEMO-STU-2026-0186",
    name: "Nina Santos",
    section: "BSIS-3A",
    status: "Enrolled",
  },
  {
    id: "student-paolo",
    studentId: "DEMO-STU-2026-0204",
    name: "Paolo Garcia",
    section: "BSIS-3A",
    status: "Enrolled",
  },
  {
    id: "student-ella",
    studentId: "DEMO-STU-2026-0231",
    name: "Ella Cruz",
    section: "BSIS-3A",
    status: "Enrolled",
  },
  {
    id: "student-liam",
    studentId: "DEMO-STU-2026-0277",
    name: "Liam Ramos",
    section: "BSIS-3A",
    status: "Enrolled",
  },
  {
    id: "student-aria",
    studentId: "DEMO-STU-2026-0308",
    name: "Aria Lim",
    section: "BSIS-3A",
    status: "Enrolled",
  },
] as const satisfies readonly AcademicStudent[];

function sampleAttendanceRecords(
  values: readonly AttendanceValue[],
): Record<string, AttendanceValue> {
  return Object.fromEntries(
    roster.map((student, index) => [student.id, values[index] ?? "Unmarked"]),
  );
}

const weekdayDates = {
  monday: [
    "2027-02-08",
    "2027-02-15",
    "2027-02-22",
    "2027-03-01",
    "2027-03-08",
  ],
  tuesday: [
    "2027-02-09",
    "2027-02-16",
    "2027-02-23",
    "2027-03-02",
    "2027-03-09",
  ],
  wednesday: [
    "2027-02-10",
    "2027-02-17",
    "2027-02-24",
    "2027-03-03",
    "2027-03-10",
  ],
  thursday: [
    "2027-02-11",
    "2027-02-18",
    "2027-02-25",
    "2027-03-04",
    "2027-03-11",
  ],
  friday: [
    "2027-02-05",
    "2027-02-12",
    "2027-02-19",
    "2027-02-26",
    "2027-03-05",
  ],
} as const;

function meetingDatesFor(days: readonly AcademicWeekday[]) {
  return days
    .flatMap((day) => {
      const dates =
        weekdayDates[day.toLowerCase() as keyof typeof weekdayDates];
      return dates.map((date) => ({ date, day }));
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

const studentIds = roster.map((student) => student.id);

export const academicDemoData = {
  term: {
    id: "2026-2027-2",
    academicYear: "2026–2027",
    semester: "2nd Semester",
    label: "AY 2026–2027 · 2nd Semester",
  },
  today: {
    date: "2027-02-26",
    day: "Friday" as const,
  },
  identities: {
    faculty: {
      facultyId: "faculty-ldc",
      name: developmentAuthAccountSeed[2].name,
    },
    coordinator: {
      facultyId: "faculty-ag",
      name: developmentAuthAccountSeed[6].name,
    },
  },
  subjects: [
    { id: "is201", code: "IS 302", title: "Systems Design", units: 3 },
    { id: "is203", code: "IS 304", title: "Project Management", units: 3 },
    { id: "ge201", code: "GE 302", title: "Applied Research", units: 3 },
    {
      id: "is205",
      code: "IS 306",
      title: "Enterprise Applications",
      units: 3,
    },
    { id: "pe202", code: "PE 302", title: "Movement and Wellness", units: 2 },
  ] satisfies readonly AcademicSubject[],
  faculty: [
    { id: "faculty-ms", name: "M. Santos", roleLabel: "Faculty" },
    {
      id: "faculty-ldc",
      name: developmentAuthAccountSeed[2].name,
      roleLabel: "Faculty",
    },
    {
      id: "faculty-ag",
      name: developmentAuthAccountSeed[6].name,
      roleLabel: "Program Coordinator",
    },
    { id: "faculty-rl", name: "R. Lim", roleLabel: "Faculty" },
    { id: "faculty-jc", name: "J. Cruz", roleLabel: "Faculty" },
  ] satisfies readonly AcademicFaculty[],
  students: roster,
  offerings: [
    {
      id: "off-is201-bsis-2a",
      subjectId: "is201",
      termId: "2026-2027-2",
      section: "BSIS-3A",
      campus: "IIT Campus",
      program: "BSIS — Bachelor of Science in Information Systems",
      facultyId: "faculty-ms",
      studentIds,
      schedule: [
        { day: "Monday", start: "08:00", end: "09:30", room: "Room 204" },
        { day: "Friday", start: "08:00", end: "09:30", room: "Room 204" },
      ],
      meetingDates: meetingDatesFor(["Monday", "Friday"]),
    },
    {
      id: "off-is203-bsis-2a",
      subjectId: "is203",
      termId: "2026-2027-2",
      section: "BSIS-3A",
      campus: "IIT Campus",
      program: "BSIS — Bachelor of Science in Information Systems",
      facultyId: "faculty-ldc",
      studentIds,
      schedule: [
        { day: "Monday", start: "10:30", end: "12:00", room: "Room 302" },
        { day: "Friday", start: "10:30", end: "12:00", room: "Room 302" },
      ],
      meetingDates: meetingDatesFor(["Monday", "Friday"]),
    },
    {
      id: "off-ge201-bsis-2a",
      subjectId: "ge201",
      termId: "2026-2027-2",
      section: "BSIS-3A",
      campus: "IIT Campus",
      program: "BSIS — Bachelor of Science in Information Systems",
      facultyId: "faculty-ag",
      studentIds,
      schedule: [
        { day: "Wednesday", start: "13:00", end: "14:30", room: "Room 108" },
        { day: "Friday", start: "13:00", end: "14:30", room: "Room 108" },
      ],
      meetingDates: meetingDatesFor(["Wednesday", "Friday"]),
    },
    {
      id: "off-is205-bsis-2a",
      subjectId: "is205",
      termId: "2026-2027-2",
      section: "BSIS-3A",
      campus: "IIT Campus",
      program: "BSIS — Bachelor of Science in Information Systems",
      facultyId: "faculty-rl",
      studentIds,
      schedule: [
        {
          day: "Wednesday",
          start: "08:00",
          end: "09:30",
          room: "Computer Lab 2",
        },
        {
          day: "Thursday",
          start: "10:30",
          end: "12:00",
          room: "Computer Lab 2",
        },
      ],
      meetingDates: meetingDatesFor(["Wednesday", "Thursday"]),
    },
    {
      id: "off-pe202-bsis-2a",
      subjectId: "pe202",
      termId: "2026-2027-2",
      section: "BSIS-3A",
      campus: "IIT Campus",
      program: "BSIS — Bachelor of Science in Information Systems",
      facultyId: "faculty-jc",
      studentIds,
      schedule: [
        {
          day: "Thursday",
          start: "13:00",
          end: "14:00",
          room: "Covered Court",
        },
      ],
      meetingDates: meetingDatesFor(["Thursday"]),
    },
  ] satisfies readonly AcademicOffering[],
  announcements: [
    {
      id: "academic-notice-campus",
      date: "25 Feb 2027",
      audience: "Campus",
      audienceLabel: "IIT Campus",
      title: "Sample campus study-space note",
      summary:
        "A fictional note for the Academic portal demonstration. It does not describe a real campus update.",
    },
    {
      id: "academic-notice-program",
      date: "23 Feb 2027",
      audience: "Program",
      audienceLabel: "BSIS",
      title: "Sample program advising note",
      summary:
        "A fictional reminder to direct course questions to the appropriate school office.",
    },
    {
      id: "academic-notice-section",
      date: "19 Feb 2027",
      audience: "Section",
      audienceLabel: "BSIS-3A",
      title: "Sample section coordination note",
      summary:
        "An illustrative notice for one sample section. No official schedule change is represented.",
    },
    {
      id: "academic-notice-class",
      date: "17 Feb 2027",
      audience: "Class",
      audienceLabel: "IS 304 · Project Management",
      offeringId: "off-is203-bsis-2a",
      title: "Sample class reading note",
      summary:
        "A fictional class notice with no attached material or real student delivery.",
    },
  ] satisfies readonly AcademicAnnouncement[],
  attendanceHistory: [
    {
      id: "attendance-is203-2027-02-19",
      offeringId: "off-is203-bsis-2a",
      date: "2027-02-19",
      savedOn: "2027-02-19",
      records: sampleAttendanceRecords([
        "Present",
        "Present",
        "Late",
        "Present",
        "Present",
        "Absent",
      ]),
    },
    {
      id: "attendance-is203-2027-02-12",
      offeringId: "off-is203-bsis-2a",
      date: "2027-02-12",
      savedOn: "2027-02-12",
      records: sampleAttendanceRecords([
        "Absent",
        "Present",
        "Present",
        "Late",
        "Present",
        "Present",
      ]),
    },
    {
      id: "attendance-is203-2027-02-05",
      offeringId: "off-is203-bsis-2a",
      date: "2027-02-05",
      savedOn: "2027-02-05",
      records: sampleAttendanceRecords([
        "Present",
        "Absent",
        "Late",
        "Present",
        "Present",
        "Present",
      ]),
    },
    {
      id: "attendance-is201-2027-02-19",
      offeringId: "off-is201-bsis-2a",
      date: "2027-02-19",
      savedOn: "2027-02-19",
      records: sampleAttendanceRecords([
        "Present",
        "Present",
        "Present",
        "Late",
        "Present",
        "Present",
      ]),
    },
    {
      id: "attendance-is201-2027-02-12",
      offeringId: "off-is201-bsis-2a",
      date: "2027-02-12",
      savedOn: "2027-02-12",
      records: sampleAttendanceRecords([
        "Late",
        "Present",
        "Absent",
        "Present",
        "Present",
        "Present",
      ]),
    },
    {
      id: "attendance-ge201-2027-02-26",
      offeringId: "off-ge201-bsis-2a",
      date: "2027-02-26",
      savedOn: "2027-02-26",
      records: sampleAttendanceRecords([
        "Present",
        "Present",
        "Present",
        "Late",
        "Present",
        "Absent",
      ]),
    },
    {
      id: "attendance-ge201-2027-02-19",
      offeringId: "off-ge201-bsis-2a",
      date: "2027-02-19",
      savedOn: "2027-02-19",
      records: sampleAttendanceRecords([
        "Present",
        "Late",
        "Present",
        "Present",
        "Absent",
        "Present",
      ]),
    },
    {
      id: "attendance-is205-2027-02-25",
      offeringId: "off-is205-bsis-2a",
      date: "2027-02-25",
      savedOn: "2027-02-25",
      records: sampleAttendanceRecords([
        "Present",
        "Present",
        "Late",
        "Present",
        "Present",
        "Absent",
      ]),
    },
    {
      id: "attendance-is205-2027-02-18",
      offeringId: "off-is205-bsis-2a",
      date: "2027-02-18",
      savedOn: "2027-02-18",
      records: sampleAttendanceRecords([
        "Present",
        "Present",
        "Present",
        "Late",
        "Present",
        "Present",
      ]),
    },
  ] satisfies readonly AcademicAttendanceSession[],
  gradeBooks: [
    {
      offeringId: "off-is203-bsis-2a",
      status: "Draft",
      updatedOn: "2027-02-25",
      grades: {
        "student-primary": "1.50",
        "student-nina": "1.75",
        "student-paolo": "2.00",
        "student-ella": "1.75",
        "student-liam": "",
        "student-aria": "2.25",
      },
    },
    {
      offeringId: "off-is205-bsis-2a",
      status: "Submitted",
      updatedOn: "2027-02-19",
      submittedOn: "2027-02-19",
      grades: {
        "student-primary": "1.75",
        "student-nina": "2.00",
        "student-paolo": "1.50",
        "student-ella": "2.25",
        "student-liam": "1.75",
        "student-aria": "2.00",
      },
    },
    {
      offeringId: "off-ge201-bsis-2a",
      status: "Draft",
      updatedOn: "2027-02-24",
      grades: {
        "student-primary": "1.50",
        "student-nina": "1.75",
        "student-paolo": "",
        "student-ella": "2.00",
        "student-liam": "1.75",
        "student-aria": "",
      },
    },
    {
      offeringId: "off-is201-bsis-2a",
      status: "Draft",
      updatedOn: "2027-02-23",
      grades: {
        "student-primary": "1.75",
        "student-nina": "1.50",
        "student-paolo": "2.00",
        "student-ella": "",
        "student-liam": "2.25",
        "student-aria": "1.75",
      },
    },
    {
      offeringId: "off-pe202-bsis-2a",
      status: "Draft",
      updatedOn: "2027-02-21",
      grades: {
        "student-primary": "",
        "student-nina": "",
        "student-paolo": "",
        "student-ella": "",
        "student-liam": "",
        "student-aria": "",
      },
    },
  ] satisfies readonly AcademicGradeBook[],
  submissionHistory: [
    {
      id: "submission-is205-2027-02-19",
      offeringId: "off-is205-bsis-2a",
      facultyId: "faculty-rl",
      subjectId: "is205",
      section: "BSIS-3A",
      termLabel: "AY 2026–2027 · 2nd Semester",
      submittedOn: "2027-02-19",
      studentCount: 6,
      status: "Submitted",
    },
    {
      id: "submission-ge201-2026-05-29",
      offeringId: "off-ge201-bsis-2a",
      facultyId: "faculty-ag",
      subjectId: "ge201",
      section: "BSIS-2A",
      termLabel: "AY 2025–2026 · 2nd Semester",
      submittedOn: "2026-05-29",
      studentCount: 6,
      status: "Submitted",
    },
  ] satisfies readonly AcademicSubmissionHistoryItem[],
} as const;

export function getSubject(subjectId: string) {
  return academicDemoData.subjects.find((subject) => subject.id === subjectId);
}

export function getOffering(offeringId: string) {
  return academicDemoData.offerings.find(
    (offering) => offering.id === offeringId,
  );
}

export function getFaculty(facultyId: string) {
  return academicDemoData.faculty.find((person) => person.id === facultyId);
}

export function getOfferingRoster(offeringId: string) {
  const offering = getOffering(offeringId);
  if (!offering) return [];
  return academicDemoData.students
    .filter((student) => offering.studentIds.includes(student.id))
    .sort(
      (a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" }) ||
        a.studentId.localeCompare(b.studentId),
    );
}

export function getOfferingsForFaculty(facultyId: string) {
  return academicDemoData.offerings.filter(
    (offering) => offering.facultyId === facultyId,
  );
}

export function createUnmarkedAttendance(studentIds: readonly string[]) {
  return Object.fromEntries(
    studentIds.map((studentId) => [studentId, "Unmarked" as const]),
  );
}

export function countAttendanceRecords(
  records: Readonly<Record<string, AttendanceValue>>,
) {
  return {
    present: Object.values(records).filter((value) => value === "Present")
      .length,
    late: Object.values(records).filter((value) => value === "Late").length,
    absent: Object.values(records).filter((value) => value === "Absent").length,
    unmarked: Object.values(records).filter((value) => value === "Unmarked")
      .length,
  };
}

export function getMissingGradeStudentIds(
  studentIds: readonly string[],
  grades: Readonly<Record<string, string>>,
) {
  return studentIds.filter((studentId) => !grades[studentId]?.trim());
}

export function formatAcademicTime(value: string) {
  const [hoursText, minutes] = value.split(":");
  const hours = Number(hoursText);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${minutes} ${suffix}`;
}

export function formatAcademicDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}
