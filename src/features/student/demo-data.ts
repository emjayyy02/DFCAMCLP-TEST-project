export type StudentRequestStatus =
  "Pending" | "Ready" | "Completed" | "Cancelled";

export type StudentRequest = {
  id: string;
  document: "COR" | "COE";
  submittedOn: string;
  status: StudentRequestStatus;
};

export type ScheduleDay =
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export const academicViews = [
  "Schedule",
  "Subjects",
  "Grades",
  "Attendance",
  "Curriculum",
] as const;

export type AcademicView = (typeof academicViews)[number];

export const studentDemoData = {
  identity: {
    firstName: "Marvin",
    lastName: "Reyes",
    fullName: "Marvin Reyes",
    studentId: "DEMO-STU-2026-0142",
    email: "marvin.reyes.demo@example.invalid",
    program: "BSIS — Bachelor of Science in Information Systems",
    programCode: "BSIS",
    campus: "IIT Campus",
    yearLevel: "2nd Year",
    academicStatus: "Active Student",
  },
  term: {
    academicYear: "2026–2027",
    semester: "1st Semester",
    section: "BSIS-2A",
  },
  today: {
    day: "Friday" as ScheduleDay,
    date: "2026-09-25",
    nextClassId: "is203-fri",
  },
  subjects: [
    {
      id: "is201",
      code: "IS 201",
      title: "Data Management",
      units: 3,
      instructor: "M. Santos",
      status: "Enrolled",
    },
    {
      id: "is203",
      code: "IS 203",
      title: "Systems Analysis",
      units: 3,
      instructor: "L. Dela Cruz",
      status: "Enrolled",
    },
    {
      id: "ge201",
      code: "GE 201",
      title: "Ethics and Society",
      units: 3,
      instructor: "A. Garcia",
      status: "Enrolled",
    },
    {
      id: "is205",
      code: "IS 205",
      title: "Web Systems",
      units: 3,
      instructor: "R. Lim",
      status: "Enrolled",
    },
    {
      id: "pe202",
      code: "PE 202",
      title: "Movement and Wellness",
      units: 2,
      instructor: "J. Cruz",
      status: "Enrolled",
    },
  ],
  schedule: [
    {
      id: "is201-mon",
      subjectId: "is201",
      day: "Monday",
      start: "08:00",
      end: "09:30",
      room: "Room 204",
    },
    {
      id: "is203-mon",
      subjectId: "is203",
      day: "Monday",
      start: "10:30",
      end: "12:00",
      room: "Room 302",
    },
    {
      id: "is205-wed",
      subjectId: "is205",
      day: "Wednesday",
      start: "08:00",
      end: "09:30",
      room: "Computer Lab 2",
    },
    {
      id: "ge201-wed",
      subjectId: "ge201",
      day: "Wednesday",
      start: "13:00",
      end: "14:30",
      room: "Room 108",
    },
    {
      id: "is205-thu",
      subjectId: "is205",
      day: "Thursday",
      start: "10:30",
      end: "12:00",
      room: "Computer Lab 2",
    },
    {
      id: "pe202-thu",
      subjectId: "pe202",
      day: "Thursday",
      start: "13:00",
      end: "14:00",
      room: "Covered Court",
    },
    {
      id: "is201-fri",
      subjectId: "is201",
      day: "Friday",
      start: "08:00",
      end: "09:30",
      room: "Room 204",
    },
    {
      id: "is203-fri",
      subjectId: "is203",
      day: "Friday",
      start: "10:30",
      end: "12:00",
      room: "Room 302",
    },
    {
      id: "ge201-fri",
      subjectId: "ge201",
      day: "Friday",
      start: "13:00",
      end: "14:30",
      room: "Room 108",
    },
  ],
  grades: [
    {
      code: "IS 103",
      title: "Information Systems Concepts",
      units: 3,
      academicYear: "2025–2026",
      semester: "2nd Semester",
      grade: "1.75",
      status: "Released",
    },
    {
      code: "GE 102",
      title: "Readings in Philippine History",
      units: 3,
      academicYear: "2025–2026",
      semester: "2nd Semester",
      grade: "1.50",
      status: "Released",
    },
    {
      code: "CS 104",
      title: "Introduction to Programming",
      units: 3,
      academicYear: "2025–2026",
      semester: "2nd Semester",
      grade: "2.00",
      status: "Released",
    },
    {
      code: "IS 201",
      title: "Data Management",
      units: 3,
      academicYear: "2026–2027",
      semester: "1st Semester",
      grade: null,
      status: "Not yet released",
    },
    {
      code: "IS 203",
      title: "Systems Analysis",
      units: 3,
      academicYear: "2026–2027",
      semester: "1st Semester",
      grade: null,
      status: "Not yet released",
    },
    {
      code: "GE 201",
      title: "Ethics and Society",
      units: 3,
      academicYear: "2026–2027",
      semester: "1st Semester",
      grade: null,
      status: "Not yet released",
    },
    {
      code: "IS 205",
      title: "Web Systems",
      units: 3,
      academicYear: "2026–2027",
      semester: "1st Semester",
      grade: null,
      status: "Not yet released",
    },
  ],
  attendance: [
    {
      subjectId: "is201",
      present: 8,
      late: 1,
      absent: 0,
      recent: [
        { date: "18 Sep 2026", status: "Present" },
        { date: "11 Sep 2026", status: "Late" },
        { date: "04 Sep 2026", status: "Present" },
      ],
    },
    {
      subjectId: "is203",
      present: 7,
      late: 0,
      absent: 1,
      recent: [
        { date: "18 Sep 2026", status: "Present" },
        { date: "11 Sep 2026", status: "Absent" },
        { date: "04 Sep 2026", status: "Present" },
      ],
    },
    {
      subjectId: "ge201",
      present: 5,
      late: 0,
      absent: 0,
      recent: [
        { date: "25 Sep 2026", status: "Present" },
        { date: "18 Sep 2026", status: "Present" },
      ],
    },
    {
      subjectId: "is205",
      present: 4,
      late: 0,
      absent: 0,
      recent: [
        { date: "24 Sep 2026", status: "Present" },
        { date: "17 Sep 2026", status: "Present" },
      ],
    },
  ],
  curriculum: [
    {
      year: "1st Year",
      semester: "1st Semester",
      status: "Completed",
      subjects: [
        "Computing Fundamentals",
        "College Algebra",
        "Communication Skills",
      ],
    },
    {
      year: "1st Year",
      semester: "2nd Semester",
      status: "Completed",
      subjects: [
        "Introduction to Programming",
        "Information Systems Concepts",
        "Readings in Philippine History",
      ],
    },
    {
      year: "2nd Year",
      semester: "1st Semester",
      status: "Current",
      subjects: [
        "Data Management",
        "Systems Analysis",
        "Ethics and Society",
        "Web Systems",
      ],
    },
    {
      year: "2nd Year",
      semester: "2nd Semester",
      status: "Upcoming",
      subjects: ["Networking Fundamentals", "Systems Design", "Statistics"],
    },
    {
      year: "3rd Year",
      semester: "1st Semester",
      status: "Upcoming",
      subjects: [
        "Enterprise Systems",
        "Project Management",
        "Information Assurance",
      ],
    },
  ],
  documents: {
    COR: {
      available: true,
      title: "Certificate of Registration",
      term: "2026–2027 · 1st Semester",
    },
    COE: {
      available: true,
      title: "Certificate of Enrollment",
      term: "2026–2027 · 1st Semester",
    },
  },
  requests: [
    {
      id: "DEMO-REQ-104",
      document: "COE",
      submittedOn: "22 Sep 2026",
      status: "Pending",
    },
    {
      id: "DEMO-REQ-101",
      document: "COR",
      submittedOn: "16 Sep 2026",
      status: "Ready",
    },
    {
      id: "DEMO-REQ-096",
      document: "COE",
      submittedOn: "08 Sep 2026",
      status: "Completed",
    },
    {
      id: "DEMO-REQ-091",
      document: "COR",
      submittedOn: "02 Sep 2026",
      status: "Cancelled",
    },
  ] satisfies StudentRequest[],
  announcements: [
    {
      id: "notice-1",
      date: "24 Sep 2026",
      category: "Campus",
      title: "Sample study space update",
      summary:
        "A fictional campus notice for the Student portal demonstration.",
    },
    {
      id: "notice-2",
      date: "22 Sep 2026",
      category: "Program",
      title: "Sample BSIS advising note",
      summary:
        "A fictional program notice. Confirm academic guidance with the appropriate school office.",
    },
    {
      id: "notice-3",
      date: "19 Sep 2026",
      category: "Institution",
      title: "Sample student services update",
      summary:
        "An illustrative institution-wide notice. No real service change is represented.",
    },
  ],
  calendarEvents: [
    {
      id: "event-is201",
      date: "2026-09-25",
      time: "08:00",
      title: "Data Management",
      detail: "Room 204",
      category: "Class",
    },
    {
      id: "event-is203",
      date: "2026-09-25",
      time: "10:30",
      title: "Systems Analysis",
      detail: "Room 302",
      category: "Class",
    },
    {
      id: "event-ge201",
      date: "2026-09-25",
      time: "13:00",
      title: "Ethics and Society",
      detail: "Room 108",
      category: "Class",
    },
    {
      id: "event-sample",
      date: "2026-09-29",
      time: "11:00",
      title: "Sample academic planning date",
      detail: "Illustrative calendar item",
      category: "Sample event",
    },
  ],
} as const;

export function formatScheduleTime(value: string) {
  const [hoursText, minutes] = value.split(":");
  const hours = Number(hoursText);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
}

export function formatScheduleRange(start: string, end: string) {
  return `${formatScheduleTime(start)} – ${formatScheduleTime(end)}`;
}
