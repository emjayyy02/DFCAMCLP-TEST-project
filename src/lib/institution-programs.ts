// Public project presentation of the canonical program registry in DFCAMCLP.md.
export const campusProgramGroups = [
  {
    id: "MAIN",
    name: "Main Campus",
    programs: [
      {
        code: "BSA",
        name: "Bachelor of Science in Accountancy",
        majors: [],
      },
      {
        code: "BSBA",
        name: "Bachelor of Science in Business Administration",
        majors: [
          "Financial Management",
          "Marketing Management",
          "Human Resource Management",
        ],
      },
    ],
  },
  {
    id: "IIT",
    name: "IIT Campus",
    programs: [
      {
        code: "BSIS",
        name: "Bachelor of Science in Information Systems",
        majors: [],
      },
      {
        code: "BSCpE",
        name: "Bachelor of Science in Computer Engineering",
        majors: [],
      },
    ],
  },
] as const;

export type CampusCode = (typeof campusProgramGroups)[number]["id"];
