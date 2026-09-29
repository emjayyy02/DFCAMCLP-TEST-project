/** P3-M6 fictional Operations fixtures. No live school records are represented. */
import { campusOptions, programOptions } from "../applicant/demo-data";

export const operationsIdentity = {
  maintenanceStaffId: "EMP-DEMO-014",
  maintenanceStaffName: "Morgan Testoperations",
} as const;

export const operationsTerm = {
  academicYear: "AY 2026–2027",
  semester: "2nd Semester",
} as const;

export const studentServiceCategories = [
  "General student assistance",
  "Student ID concern",
  "Campus service inquiry",
  "Document/service guidance",
] as const;

export type StudentServiceCategory = (typeof studentServiceCategories)[number];
export type StudentServiceStatus = "New" | "In Review" | "Resolved" | "Closed";
export type FacilityCategory =
  "Electrical" | "Furniture" | "Equipment" | "Plumbing" | "General Maintenance";
export type FacilityPriority = "Low" | "Normal" | "High";
export type FacilityStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type DemoHistoryItem = { date: string; label: string };

export type StudentServiceRequest = {
  id: string;
  studentName: string;
  studentId: string;
  category: StudentServiceCategory;
  campus: string;
  createdOn: string;
  status: StudentServiceStatus;
  message: string;
  history: DemoHistoryItem[];
};

export type EmployeeFunctionalArea =
  | "Student Services"
  | "Facilities"
  | "Administration"
  | "Academic"
  | "Technology";
export type EmployeeDirectoryEntry = {
  id: string;
  name: string;
  functionalArea: EmployeeFunctionalArea;
  campus: string;
  position: string;
  listingStatus: "Listed";
};

export type FacilityTicket = {
  id: string;
  campus: string;
  area: string;
  issue: string;
  category: FacilityCategory;
  priority: FacilityPriority;
  status: FacilityStatus;
  reportedOn: string;
  assigneeId: string | null;
  history: DemoHistoryItem[];
};

export type OperationsActivity = {
  id: string;
  date: string;
  label: string;
  href: string;
};

export const initialStudentServiceRequests: StudentServiceRequest[] = [
  {
    id: "SS-26041",
    studentName: "John Paul Reyes",
    studentId: "DEMO-STU-2026-0142",
    category: "General student assistance",
    campus: "IIT Campus",
    createdOn: "26 Feb 2027",
    status: "New",
    message:
      "I have a question about where to ask for help with a campus service.",
    history: [{ date: "26 Feb 2027", label: "Sample request received" }],
  },
  {
    id: "SS-26038",
    studentName: "Nina Santos",
    studentId: "DEMO-STU-2026-0186",
    category: "Student ID concern",
    campus: "IIT Campus",
    createdOn: "24 Sep 2026",
    status: "In Review",
    message:
      "Could you point me to the right contact for a misplaced student ID?",
    history: [
      { date: "24 Sep 2026", label: "Sample request received" },
      { date: "25 Sep 2026", label: "Demo status changed to In Review" },
    ],
  },
  {
    id: "SS-26032",
    studentName: "Paolo Garcia",
    studentId: "DEMO-STU-2026-0204",
    category: "Campus service inquiry",
    campus: "Main Campus",
    createdOn: "19 Sep 2026",
    status: "Resolved",
    message:
      "I would like guidance on which office handles a general campus inquiry.",
    history: [
      { date: "19 Sep 2026", label: "Sample request received" },
      { date: "21 Sep 2026", label: "Demo request marked Resolved" },
    ],
  },
  {
    id: "SS-26027",
    studentName: "Ella Cruz",
    studentId: "DEMO-STU-2026-0231",
    category: "Document/service guidance",
    campus: "Main Campus",
    createdOn: "17 Sep 2026",
    status: "Closed",
    message:
      "I need help finding the right place to ask a non-academic service question.",
    history: [
      { date: "17 Sep 2026", label: "Sample request received" },
      { date: "18 Sep 2026", label: "Demo request marked Closed" },
    ],
  },
];

export const initialEmployees: EmployeeDirectoryEntry[] = [
  {
    id: "EMP-DEMO-014",
    name: "Morgan Testoperations",
    functionalArea: "Facilities",
    campus: "IIT Campus",
    position: "Facilities staff",
    listingStatus: "Listed",
  },
  {
    id: "EMP-DEMO-015",
    name: "Avery Testadministrator",
    functionalArea: "Administration",
    campus: "Main Campus",
    position: "Administrative support",
    listingStatus: "Listed",
  },
  {
    id: "EMP-DEMO-016",
    name: "Taylor Testemployee",
    functionalArea: "Academic",
    campus: "IIT Campus",
    position: "Faculty demo profile",
    listingStatus: "Listed",
  },
  {
    id: "EMP-DEMO-017",
    name: "Casey Testtechnology",
    functionalArea: "Technology",
    campus: "Main Campus",
    position: "Technology support",
    listingStatus: "Listed",
  },
  {
    id: "EMP-DEMO-018",
    name: "Sam Demo",
    functionalArea: "Student Services",
    campus: "Main Campus",
    position: "Student service support",
    listingStatus: "Listed",
  },
  {
    id: "EMP-DEMO-019",
    name: "Alex Demo",
    functionalArea: "Facilities",
    campus: "IIT Campus",
    position: "Facilities staff",
    listingStatus: "Listed",
  },
];

export const facilityCategories: FacilityCategory[] = [
  "Electrical",
  "Furniture",
  "Equipment",
  "Plumbing",
  "General Maintenance",
];

export const facilityStatuses: FacilityStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

export const studentServiceStatuses: StudentServiceStatus[] = [
  "New",
  "In Review",
  "Resolved",
  "Closed",
];

export const initialFacilityTickets: FacilityTicket[] = [
  {
    id: "FAC-26041",
    campus: "IIT Campus",
    area: "Room 302",
    issue: "A light fixture does not turn on.",
    category: "Electrical",
    priority: "High",
    status: "Open",
    reportedOn: "26 Sep 2026",
    assigneeId: operationsIdentity.maintenanceStaffId,
    history: [{ date: "26 Sep 2026", label: "Sample ticket reported" }],
  },
  {
    id: "FAC-26039",
    campus: "Main Campus",
    area: "Hallway",
    issue: "A desk has a loose leg and needs a check.",
    category: "Furniture",
    priority: "Normal",
    status: "In Progress",
    reportedOn: "25 Sep 2026",
    assigneeId: operationsIdentity.maintenanceStaffId,
    history: [
      { date: "25 Sep 2026", label: "Sample ticket reported" },
      { date: "26 Sep 2026", label: "Demo ticket moved to In Progress" },
    ],
  },
  {
    id: "FAC-26037",
    campus: "Main Campus",
    area: "Classroom",
    issue: "A projector does not start when switched on.",
    category: "Equipment",
    priority: "High",
    status: "Open",
    reportedOn: "24 Sep 2026",
    assigneeId: null,
    history: [{ date: "24 Sep 2026", label: "Sample ticket reported" }],
  },
  {
    id: "FAC-26033",
    campus: "IIT Campus",
    area: "Classroom",
    issue: "A tap handle is loose.",
    category: "Plumbing",
    priority: "Low",
    status: "Resolved",
    reportedOn: "21 Sep 2026",
    assigneeId: "EMP-DEMO-019",
    history: [
      { date: "21 Sep 2026", label: "Sample ticket reported" },
      { date: "22 Sep 2026", label: "Demo ticket marked Resolved" },
    ],
  },
  {
    id: "FAC-26031",
    campus: "Main Campus",
    area: "Classroom",
    issue: "A door closer needs a basic adjustment.",
    category: "General Maintenance",
    priority: "Low",
    status: "Closed",
    reportedOn: "18 Sep 2026",
    assigneeId: "EMP-DEMO-019",
    history: [
      { date: "18 Sep 2026", label: "Sample ticket reported" },
      { date: "20 Sep 2026", label: "Demo ticket marked Closed" },
    ],
  },
];

export const initialOperationsActivity: OperationsActivity[] = [
  {
    id: "activity-fac-26039",
    date: "26 Sep 2026",
    label: "Demo ticket FAC-26039 moved to In Progress",
    href: "/operations/facilities?ticket=FAC-26039",
  },
  {
    id: "activity-ss-26038",
    date: "25 Sep 2026",
    label: "Demo request SS-26038 moved to In Review",
    href: "/operations/student-services?request=SS-26038",
  },
  {
    id: "activity-fac-26033",
    date: "22 Sep 2026",
    label: "Demo ticket FAC-26033 marked Resolved",
    href: "/operations/facilities?ticket=FAC-26033",
  },
];

export const operationsInstitutionRegistry = campusOptions.map((campus) => ({
  code: campus.code,
  name: campus.label,
  programs: programOptions
    .filter((program) => program.campus === campus.code)
    .map((program) => ({
      code: program.code,
      label: program.label,
      majors: [...program.majors],
    })),
}));

export function filterStudentServiceRequests(
  requests: StudentServiceRequest[],
  filters: {
    search?: string;
    status?: string;
    campus?: string;
    category?: string;
  },
) {
  const query = filters.search?.trim().toLowerCase() ?? "";
  return requests.filter((request) => {
    const searchable = [
      request.id,
      request.studentName,
      request.studentId,
      request.category,
      request.message,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!query || searchable.includes(query)) &&
      (!filters.status ||
        filters.status === "All" ||
        request.status === filters.status) &&
      (!filters.campus ||
        filters.campus === "All" ||
        request.campus === filters.campus) &&
      (!filters.category ||
        filters.category === "All" ||
        request.category === filters.category)
    );
  });
}

export function filterEmployees(
  employees: EmployeeDirectoryEntry[],
  filters: { search?: string; campus?: string; functionalArea?: string },
) {
  const query = filters.search?.trim().toLowerCase() ?? "";
  return employees.filter((employee) => {
    const searchable = [
      employee.id,
      employee.name,
      employee.position,
      employee.functionalArea,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!query || searchable.includes(query)) &&
      (!filters.campus ||
        filters.campus === "All" ||
        employee.campus === filters.campus) &&
      (!filters.functionalArea ||
        filters.functionalArea === "All" ||
        employee.functionalArea === filters.functionalArea)
    );
  });
}

export function filterFacilityTickets(
  tickets: FacilityTicket[],
  filters: {
    search?: string;
    status?: string;
    campus?: string;
    priority?: string;
    category?: string;
    assigneeId?: string | null;
  },
) {
  const query = filters.search?.trim().toLowerCase() ?? "";
  return tickets.filter((ticket) => {
    const assignee = initialEmployees.find(
      (employee) => employee.id === ticket.assigneeId,
    )?.name;
    const searchable = [
      ticket.id,
      ticket.area,
      ticket.issue,
      ticket.category,
      assignee ?? "Unassigned",
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!query || searchable.includes(query)) &&
      (!filters.status ||
        filters.status === "All" ||
        ticket.status === filters.status) &&
      (!filters.campus ||
        filters.campus === "All" ||
        ticket.campus === filters.campus) &&
      (!filters.priority ||
        filters.priority === "All" ||
        ticket.priority === filters.priority) &&
      (!filters.category ||
        filters.category === "All" ||
        ticket.category === filters.category) &&
      (filters.assigneeId === undefined ||
        ticket.assigneeId === filters.assigneeId)
    );
  });
}

export function countOpenStudentServiceRequests(
  requests: StudentServiceRequest[],
) {
  return requests.filter(
    (request) => request.status === "New" || request.status === "In Review",
  ).length;
}

export function countOpenFacilityTickets(tickets: FacilityTicket[]) {
  return tickets.filter(
    (ticket) => ticket.status === "Open" || ticket.status === "In Progress",
  ).length;
}

export function countHighPriorityOpenFacilityTickets(
  tickets: FacilityTicket[],
) {
  return tickets.filter(
    (ticket) =>
      ticket.priority === "High" &&
      (ticket.status === "Open" || ticket.status === "In Progress"),
  ).length;
}

export function updateStudentServiceStatus(
  request: StudentServiceRequest,
  status: StudentServiceStatus,
  date: string,
  outcomeNote = "",
): StudentServiceRequest | null {
  if ((status === "Resolved" || status === "Closed") && !outcomeNote.trim()) {
    return null;
  }
  const label =
    status === "Resolved" || status === "Closed"
      ? `Demo request marked ${status}: ${outcomeNote.trim()}`
      : `Demo status changed to ${status}`;
  return {
    ...request,
    status,
    history: [...request.history, { date, label }],
  };
}

export function updateFacilityStatus(
  ticket: FacilityTicket,
  status: FacilityStatus,
  date: string,
  completionNote = "",
): FacilityTicket | null {
  if (
    (status === "Resolved" || status === "Closed") &&
    !completionNote.trim()
  ) {
    return null;
  }
  const label =
    status === "Resolved" || status === "Closed"
      ? `Demo ticket marked ${status}: ${completionNote.trim()}`
      : `Demo ticket moved to ${status}`;
  return {
    ...ticket,
    status,
    history: [...ticket.history, { date, label }],
  };
}

export function updateFacilityAssignee(
  ticket: FacilityTicket,
  assigneeId: string | null,
  date: string,
): FacilityTicket | null {
  if (
    assigneeId &&
    !initialEmployees.some(
      (employee) =>
        employee.id === assigneeId && employee.functionalArea === "Facilities",
    )
  ) {
    return null;
  }
  const assigneeName = initialEmployees.find(
    (employee) => employee.id === assigneeId,
  )?.name;
  return {
    ...ticket,
    assigneeId,
    history: [
      ...ticket.history,
      {
        date,
        label: assigneeName
          ? `Demo ticket assigned to ${assigneeName}`
          : "Demo ticket assignment cleared",
      },
    ],
  };
}
