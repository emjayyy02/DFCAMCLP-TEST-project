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
    email: "johnpaul.reyes@example.invalid",
    name: "John Paul Reyes",
    personId: seedIds.people.student,
  },
  {
    email: "juan.delacruz@example.invalid",
    name: "Juan Dela Cruz",
    personId: seedIds.people.applicant,
  },
  {
    email: "maria.santos@example.invalid",
    name: "Maria Santos",
    personId: seedIds.people.employee,
  },
  {
    email: "jose.garcia@example.invalid",
    name: "Jose Garcia",
    personId: seedIds.people.records,
  },
  {
    email: "mark.ramos@example.invalid",
    name: "Mark Ramos",
    personId: seedIds.people.operations,
  },
  {
    email: "angelo.cruz@example.invalid",
    name: "Angelo Cruz",
    personId: seedIds.people.technology,
  },
  {
    email: "angelica.bautista@example.invalid",
    name: "Angelica Bautista",
    personId: seedIds.people.coordinator,
  },
  {
    email: "marygrace.mendoza@example.invalid",
    name: "Mary Grace Mendoza",
    personId: seedIds.people.schoolAdmin,
  },
  {
    email: "michael.castro@example.invalid",
    name: "Michael Castro",
    personId: seedIds.people.facultyTechnology,
  },
] as const;

export const campusSeed = [
  {
    id: seedIds.campuses.main,
    code: "MAIN",
    name: "Main Campus",
    shortName: "Main Campus",
    locationLabel: "Talon III",
  },
  {
    id: seedIds.campuses.iitCaa,
    code: "IIT_CAA",
    name: "IIT Campus",
    shortName: "IIT Campus",
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
    name: "Bachelor of Science in Computer Engineering",
    shortName: "BSCpE",
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
