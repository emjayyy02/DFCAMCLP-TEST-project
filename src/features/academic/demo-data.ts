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
    id: "student-marvin",
    studentId: "DEMO-STU-2026-0142",
    name: "Marvin Reyes",
    section: "BSIS-2A",
    status: "Enrolled",
  },
  {
    id: "student-nina",
    studentId: "DEMO-STU-2026-0186",
    name: "Nina Santos",
    section: "BSIS-2A",
    status: "Enrolled",
  },
  {
    id: "student-paolo",
    studentId: "DEMO-STU-2026-0204",
    name: "Paolo Garcia",
    section: "BSIS-2A",
    status: "Enrolled",
  },
  {
    id: "student-ella",
    studentId: "DEMO-STU-2026-0231",
    name: "Ella Cruz",
    section: "BSIS-2A",
    status: "Enrolled",
  },
  {
    id: "student-liam",
    studentId: "DEMO-STU-2026-0277",
    name: "Liam Ramos",
    section: "BSIS-2A",
    status: "Enrolled",
  },
  {
    id: "student-aria",
    studentId: "DEMO-STU-2026-0308",
    name: "Aria Lim",
    section: "BSIS-2A",
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
    "2026-09-07",
    "2026-09-14",
    "2026-09-21",
    "2026-09-28",
    "2026-10-05",
  ],
  tuesday: [
    "2026-09-08",
    "2026-09-15",
    "2026-09-22",
    "2026-09-29",
    "2026-10-06",
  ],
  wednesday: [
    "2026-09-09",
    "2026-09-16",
    "2026-09-23",
    "2026-09-30",
    "2026-10-07",
  ],
  thursday: [
    "2026-09-10",
    "2026-09-17",
    "2026-09-24",
    "2026-10-01",
    "2026-10-08",
  ],
  friday: [
    "2026-09-04",
    "2026-09-11",
    "2026-09-18",
    "2026-09-25",
    "2026-10-02",
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
    id: "2026-2027-1",
    academicYear: "2026–2027",
    semester: "1st Semester",
    label: "AY 2026–2027 · 1st Semester",
  },
  today: {
    date: "2026-09-25",
    day: "Friday" as const,
  },
  identities: {
    faculty: { facultyId: "faculty-ldc", name: "L. Dela Cruz" },
    coordinator: { facultyId: "faculty-ag", name: "A. Garcia" },
  },
  subjects: [
    { id: "is201", code: "IS 201", title: "Data Management", units: 3 },
    { id: "is203", code: "IS 203", title: "Systems Analysis", units: 3 },
    { id: "ge201", code: "GE 201", title: "Ethics and Society", units: 3 },
    { id: "is205", code: "IS 205", title: "Web Systems", units: 3 },
    { id: "pe202", code: "PE 202", title: "Movement and Wellness", units: 2 },
  ] satisfies readonly AcademicSubject[],
  faculty: [
    { id: "faculty-ms", name: "M. Santos", roleLabel: "Faculty" },
    { id: "faculty-ldc", name: "L. Dela Cruz", roleLabel: "Faculty" },
    { id: "faculty-ag", name: "A. Garcia", roleLabel: "Program Coordinator" },
    { id: "faculty-rl", name: "R. Lim", roleLabel: "Faculty" },
    { id: "faculty-jc", name: "J. Cruz", roleLabel: "Faculty" },
  ] satisfies readonly AcademicFaculty[],
  students: roster,
  offerings: [
    {
      id: "off-is201-bsis-2a",
      subjectId: "is201",
      termId: "2026-2027-1",
      section: "BSIS-2A",
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
      termId: "2026-2027-1",
      section: "BSIS-2A",
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
      termId: "2026-2027-1",
      section: "BSIS-2A",
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
      termId: "2026-2027-1",
      section: "BSIS-2A",
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
      termId: "2026-2027-1",
      section: "BSIS-2A",
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
      date: "24 Sep 2026",
      audience: "Campus",
      audienceLabel: "IIT Campus",
      title: "Sample campus study-space note",
      summary:
        "A fictional note for the Academic portal demonstration. It does not describe a real campus update.",
    },
    {
      id: "academic-notice-program",
      date: "22 Sep 2026",
      audience: "Program",
      audienceLabel: "BSIS",
      title: "Sample program advising note",
      summary:
        "A fictional reminder to direct course questions to the appropriate school office.",
    },
    {
      id: "academic-notice-section",
      date: "18 Sep 2026",
      audience: "Section",
      audienceLabel: "BSIS-2A",
      title: "Sample section coordination note",
      summary:
        "An illustrative notice for one sample section. No official schedule change is represented.",
    },
    {
      id: "academic-notice-class",
      date: "16 Sep 2026",
      audience: "Class",
      audienceLabel: "IS 203 · Systems Analysis",
      offeringId: "off-is203-bsis-2a",
      title: "Sample class reading note",
      summary:
        "A fictional class notice with no attached material or real student delivery.",
    },
  ] satisfies readonly AcademicAnnouncement[],
  attendanceHistory: [
    {
      id: "attendance-is203-2026-09-18",
      offeringId: "off-is203-bsis-2a",
      date: "2026-09-18",
      savedOn: "2026-09-18",
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
      id: "attendance-is203-2026-09-11",
      offeringId: "off-is203-bsis-2a",
      date: "2026-09-11",
      savedOn: "2026-09-11",
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
      id: "attendance-is203-2026-09-04",
      offeringId: "off-is203-bsis-2a",
      date: "2026-09-04",
      savedOn: "2026-09-04",
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
      id: "attendance-is201-2026-09-18",
      offeringId: "off-is201-bsis-2a",
      date: "2026-09-18",
      savedOn: "2026-09-18",
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
      id: "attendance-is201-2026-09-11",
      offeringId: "off-is201-bsis-2a",
      date: "2026-09-11",
      savedOn: "2026-09-11",
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
      id: "attendance-ge201-2026-09-25",
      offeringId: "off-ge201-bsis-2a",
      date: "2026-09-25",
      savedOn: "2026-09-25",
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
      id: "attendance-ge201-2026-09-18",
      offeringId: "off-ge201-bsis-2a",
      date: "2026-09-18",
      savedOn: "2026-09-18",
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
      id: "attendance-is205-2026-09-24",
      offeringId: "off-is205-bsis-2a",
      date: "2026-09-24",
      savedOn: "2026-09-24",
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
      id: "attendance-is205-2026-09-17",
      offeringId: "off-is205-bsis-2a",
      date: "2026-09-17",
      savedOn: "2026-09-17",
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
      updatedOn: "2026-09-24",
      grades: {
        "student-marvin": "1.50",
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
      updatedOn: "2026-09-18",
      submittedOn: "2026-09-18",
      grades: {
        "student-marvin": "1.75",
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
      updatedOn: "2026-09-23",
      grades: {
        "student-marvin": "1.50",
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
      updatedOn: "2026-09-22",
      grades: {
        "student-marvin": "1.75",
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
      updatedOn: "2026-09-20",
      grades: {
        "student-marvin": "",
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
      id: "submission-is205-2026-09-18",
      offeringId: "off-is205-bsis-2a",
      facultyId: "faculty-rl",
      subjectId: "is205",
      section: "BSIS-2A",
      termLabel: "AY 2026–2027 · 1st Semester",
      submittedOn: "2026-09-18",
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
  return academicDemoData.students.filter((student) =>
    offering.studentIds.includes(student.id),
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
