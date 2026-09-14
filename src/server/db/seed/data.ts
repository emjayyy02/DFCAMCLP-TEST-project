export const seedIds = {
  campuses: {
    main: "10000000-0000-4000-8000-000000000001",
    iitCaa: "10000000-0000-4000-8000-000000000002",
  },
  programs: {
    bsa: "20000000-0000-4000-8000-000000000001",
    bsba: "20000000-0000-4000-8000-000000000002",
    bsis: "20000000-0000-4000-8000-000000000003",
    cpe: "20000000-0000-4000-8000-000000000004",
  },
  majors: {
    financialManagement: "30000000-0000-4000-8000-000000000001",
    marketingManagement: "30000000-0000-4000-8000-000000000002",
    humanResourceManagement: "30000000-0000-4000-8000-000000000003",
  },
  people: {
    student: "40000000-0000-4000-8000-000000000001",
    applicant: "40000000-0000-4000-8000-000000000002",
    employee: "40000000-0000-4000-8000-000000000003",
    records: "40000000-0000-4000-8000-000000000004",
    operations: "40000000-0000-4000-8000-000000000005",
    technology: "40000000-0000-4000-8000-000000000006",
    coordinator: "40000000-0000-4000-8000-000000000007",
    schoolAdmin: "40000000-0000-4000-8000-000000000008",
    facultyTechnology: "40000000-0000-4000-8000-000000000009",
  },
  profiles: {
    student: "50000000-0000-4000-8000-000000000001",
    applicant: "50000000-0000-4000-8000-000000000002",
    employee: "50000000-0000-4000-8000-000000000003",
  },
} as const;

export const developmentAuthAccountSeed = [
  {
    email: "student.test@example.invalid",
    name: "Alex Teststudent",
    personId: seedIds.people.student,
  },
  {
    email: "applicant.test@example.invalid",
    name: "Jamie Testapplicant",
    personId: seedIds.people.applicant,
  },
  {
    email: "faculty.test@example.invalid",
    name: "Taylor Testemployee",
    personId: seedIds.people.employee,
  },
  {
    email: "records.test@example.invalid",
    name: "Riley Testrecords",
    personId: seedIds.people.records,
  },
  {
    email: "operations.test@example.invalid",
    name: "Morgan Testoperations",
    personId: seedIds.people.operations,
  },
  {
    email: "technology.test@example.invalid",
    name: "Casey Testtechnology",
    personId: seedIds.people.technology,
  },
  {
    email: "coordinator.test@example.invalid",
    name: "Jordan Testcoordinator",
    personId: seedIds.people.coordinator,
  },
  {
    email: "school-admin.test@example.invalid",
    name: "Avery Testadministrator",
    personId: seedIds.people.schoolAdmin,
  },
  {
    email: "faculty-it.test@example.invalid",
    name: "Quinn Testmultiporal",
    personId: seedIds.people.facultyTechnology,
  },
] as const;

export const campusSeed = [
  {
    id: seedIds.campuses.main,
    code: "MAIN",
    name: "Main Campus — Talon III",
    shortName: "Main Campus",
    locationLabel: "Talon III",
  },
  {
    id: seedIds.campuses.iitCaa,
    code: "IIT_CAA",
    name: "IIT / CAA Campus",
    shortName: "IIT / CAA",
    locationLabel: "Las Piñas",
  },
] as const;

export const programSeed = [
  {
    id: seedIds.programs.bsa,
    campusId: seedIds.campuses.main,
    code: "BSA",
    name: "Bachelor of Science in Accountancy",
    shortName: "BSA",
  },
  {
    id: seedIds.programs.bsba,
    campusId: seedIds.campuses.main,
    code: "BSBA",
    name: "Bachelor of Science in Business Administration",
    shortName: "BSBA",
  },
  {
    id: seedIds.programs.bsis,
    campusId: seedIds.campuses.iitCaa,
    code: "BSIS",
    name: "Bachelor of Science in Information Systems",
    shortName: "BSIS",
  },
  {
    id: seedIds.programs.cpe,
    campusId: seedIds.campuses.iitCaa,
    code: "CPE",
    name: "Computer Engineering",
    shortName: "CpE",
  },
] as const;

export const majorSeed = [
  {
    id: seedIds.majors.financialManagement,
    programId: seedIds.programs.bsba,
    code: "FM",
    name: "Financial Management",
  },
  {
    id: seedIds.majors.marketingManagement,
    programId: seedIds.programs.bsba,
    code: "MM",
    name: "Marketing Management",
  },
  {
    id: seedIds.majors.humanResourceManagement,
    programId: seedIds.programs.bsba,
    code: "HRM",
    name: "Human Resource Management",
  },
] as const;
