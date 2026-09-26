import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CampusPrograms } from "../components/public/institution-content";
import { academicDemoData } from "../features/academic/demo-data";
import { campusOptions, programOptions } from "../features/applicant/demo-data";
import {
  initialApplicants,
  initialStudents,
} from "../features/records/demo-data";
import { studentDemoData } from "../features/student/demo-data";
import {
  campusSeed,
  majorSeed,
  programSeed,
  seedIds,
} from "../server/db/seed/data";

const canonicalPrograms = [
  "BSA — Bachelor of Science in Accountancy",
  "BSBA — Bachelor of Science in Business Administration",
  "BSIS — Bachelor of Science in Information Systems",
  "BSCpE — Bachelor of Science in Computer Engineering",
];

describe("canonical institution data presentation", () => {
  it("keeps the four degree programs on their canonical campuses", () => {
    expect(campusSeed.map((campus) => campus.name)).toEqual([
      "Main Campus",
      "IIT Campus",
    ]);
    expect(campusSeed.map((campus) => campus.code)).toEqual([
      "MAIN",
      "IIT_CAA",
    ]);
    expect(campusSeed[0].locationLabel).toBe("Talon III");

    expect(programSeed).toHaveLength(4);
    expect(programSeed.map((program) => program.code)).toEqual([
      "BSA",
      "BSBA",
      "BSIS",
      "CPE",
    ]);
    expect(
      programSeed.filter((program) => program.code === "BSIS"),
    ).toHaveLength(1);
    expect(
      programSeed.find((program) => program.code === "BSIS"),
    ).toMatchObject({
      campusId: seedIds.campuses.iitCaa,
      name: "Bachelor of Science in Information Systems",
      shortName: "BSIS",
    });
    expect(
      programSeed.some(
        (program) =>
          program.campusId === seedIds.campuses.iitCaa &&
          ["BSA", "BSBA"].includes(program.code),
      ),
    ).toBe(false);
    expect(programSeed.find((program) => program.code === "CPE")).toMatchObject(
      {
        name: "Bachelor of Science in Computer Engineering",
        shortName: "BSCpE",
      },
    );
  });

  it("keeps the three named options as majors of BSBA", () => {
    expect(majorSeed).toHaveLength(3);
    expect(
      majorSeed.every((major) => major.programId === seedIds.programs.bsba),
    ).toBe(true);
    expect(majorSeed.map((major) => major.name).sort()).toEqual([
      "Financial Management",
      "Human Resource Management",
      "Marketing Management",
    ]);
    const programNames = new Set<string>(
      programSeed.map((program) => program.name),
    );
    expect(majorSeed.some((major) => programNames.has(major.name))).toBe(false);
  });

  it("uses the full canonical degree labels in public and demo experiences", () => {
    expect(programOptions.map((program) => program.label)).toEqual(
      canonicalPrograms,
    );
    expect(
      programOptions.find((program) => program.code === "BSIS"),
    ).toMatchObject({
      campus: "IIT_CAA",
      label: canonicalPrograms[2],
    });
    expect(campusOptions.map((campus) => campus.label)).toEqual([
      "Main Campus",
      "IIT Campus",
    ]);
    expect(studentDemoData.identity).toMatchObject({
      program: canonicalPrograms[2],
      programCode: "BSIS",
      campus: "IIT Campus",
    });
    expect(
      academicDemoData.offerings.every(
        (offering) => offering.program === canonicalPrograms[2],
      ),
    ).toBe(true);
    expect(
      [...initialApplicants, ...initialStudents].every((record) =>
        canonicalPrograms.includes(record.program),
      ),
    ).toBe(true);

    const publicCatalog = renderToStaticMarkup(
      createElement(CampusPrograms, { detailed: true }),
    );
    for (const label of canonicalPrograms) {
      const [code, degreeName] = label.split(" — ");
      expect(publicCatalog).toContain(code);
      expect(publicCatalog).toContain(degreeName);
    }
    for (const major of [
      "Financial Management",
      "Marketing Management",
      "Human Resource Management",
    ]) {
      expect(publicCatalog).toContain(major);
    }
    expect(publicCatalog).toContain("Main Campus");
    expect(publicCatalog).toContain("IIT Campus");
    expect(publicCatalog).not.toContain("IIT / CAA Campus");
    expect(publicCatalog).not.toContain("Main Campus — Talon III");
  });
});
