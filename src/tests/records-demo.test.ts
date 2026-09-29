import { describe, expect, it } from "vitest";
import {
  countRecords,
  enrollmentSequence,
  initialApplicants,
  initialStudents,
  nextEnrollmentStep,
  validSampleSchedule,
} from "../features/records/demo-data";
import {
  canonicalCampuses,
  canonicalPrograms,
  canonicalYearLevels,
  matchesApplicantSearch,
  matchesDcatSearch,
  matchesDocumentSearch,
  matchesRequirementsSearch,
  matchesStudentSearch,
  sortApplicants,
  sortStudents,
} from "../features/records/list-utils";
import { portalRoutes } from "../server/access-control/navigation";

describe("P3-M5 Records demo fixtures", () => {
  it("searches useful applicant and Student fields with trimmed case-insensitive text", () => {
    const applicant = initialApplicants.find(
      (item) => item.id === "DEMO-APP-002",
    )!;
    const student = initialStudents.find(
      (item) => item.id === "DEMO-STU-2026-0175",
    )!;

    expect(matchesApplicantSearch(applicant, "  ALEX.RIVERA ")).toBe(true);
    expect(matchesApplicantSearch(applicant, "MAIN CAMPUS")).toBe(true);
    expect(matchesApplicantSearch(applicant, "Needs Attention")).toBe(false);
    expect(matchesRequirementsSearch(applicant, "Needs Attention")).toBe(true);
    expect(matchesApplicantSearch(applicant, "not-a-match")).toBe(false);
    expect(matchesStudentSearch(student, "example.invalid")).toBe(true);
    expect(matchesStudentSearch(student, "1ST YEAR")).toBe(true);

    const sam = initialApplicants.find(
      (item) => item.name === "Sam Dela Cruz",
    )!;
    const scheduled = initialApplicants.find(
      (item) => item.id === "DEMO-APP-004",
    )!;
    expect(matchesApplicantSearch(sam, "  sam   dela ")).toBe(true);
    expect(matchesApplicantSearch(scheduled, "Sample Room")).toBe(false);
    expect(matchesDcatSearch(scheduled, "awaiting exam")).toBe(true);
    expect(matchesDcatSearch(scheduled, "DCAT scheduled")).toBe(false);
    expect(matchesDcatSearch(scheduled, "Sample Room")).toBe(false);
    expect(matchesDocumentSearch(student, "Issued")).toBe(true);
    expect(matchesDocumentSearch(scheduled, "Sample Room")).toBe(false);
  });

  it("keeps complete canonical filters and applies stable directory sorting", () => {
    expect(canonicalCampuses).toEqual(["Main Campus", "IIT Campus"]);
    expect(canonicalPrograms).toEqual([
      "BSA — Bachelor of Science in Accountancy",
      "BSBA — Bachelor of Science in Business Administration",
      "BSIS — Bachelor of Science in Information Systems",
      "BSCpE — Bachelor of Science in Computer Engineering",
    ]);
    expect(canonicalYearLevels).toEqual([
      "1st Year",
      "2nd Year",
      "3rd Year",
      "4th Year",
    ]);
    expect(sortApplicants(initialApplicants, "attention")[0].id).toBe(
      "DEMO-APP-002",
    );
    expect(
      sortApplicants(initialApplicants, "oldest").map((item) => item.id),
    ).toEqual([
      "DEMO-APP-006",
      "DEMO-APP-005",
      "DEMO-APP-004",
      "DEMO-APP-003",
      "APP-TEST-0001",
      "DEMO-APP-002",
    ]);
    expect(
      sortStudents(initialStudents, "name").map((item) => item.name),
    ).toEqual(["John Paul Reyes", "Morgan Flores", "Riley Mendoza"]);
    expect(
      sortStudents(initialStudents, "year").map((item) => item.year),
    ).toEqual(["1st Year", "3rd Year", "3rd Year"]);
  });

  it("keeps applicant and existing Student IDs distinct and sample-only", () => {
    expect(initialApplicants.some((item) => item.id === "APP-TEST-0001")).toBe(
      true,
    );
    expect(
      initialStudents.some((item) => item.id === "DEMO-STU-2026-0142"),
    ).toBe(true);
    expect(
      initialStudents.find((item) => item.id === "DEMO-STU-2026-0142"),
    ).toMatchObject({
      name: "John Paul Reyes",
      year: "3rd Year",
      term: "2026–2027 · 2nd Semester",
    });
    expect(
      initialApplicants.every(
        (item) => !initialStudents.some((student) => student.id === item.id),
      ),
    ).toBe(true);
    expect(new Set(initialApplicants.map((item) => item.id)).size).toBe(
      initialApplicants.length,
    );
  });

  it("derives work counts from the displayed fixtures", () => {
    expect(countRecords(initialApplicants, initialStudents)).toEqual({
      requirements: 2,
      scheduling: 1,
      results: 1,
      enrollment: 1,
      documents: 2,
    });
  });

  it("requires a Passed result before Registrar progression and document issuance before the next step", () => {
    const eligible = initialApplicants.find(
      (item) => item.id === "DEMO-APP-003",
    )!;
    const passed = initialApplicants.find(
      (item) => item.id === "DEMO-APP-006",
    )!;
    expect(nextEnrollmentStep(eligible)).toBeNull();
    expect(nextEnrollmentStep(passed)).toBe("Registrar Submission");
    expect(
      nextEnrollmentStep({
        ...passed,
        enrollment: "COE Available",
        coe: "Available",
      }),
    ).toBeNull();
    expect(
      nextEnrollmentStep({
        ...passed,
        enrollment: "COE Issued",
        coe: "Issued",
      }),
    ).toBe("COR Available");
    expect(enrollmentSequence.at(-1)).toBe("Enrolled");
  });

  it("validates sample schedule fields without claiming room availability", () => {
    expect(validSampleSchedule("2026-10-05", "08:00", "Sample Room 204")).toBe(
      true,
    );
    expect(validSampleSchedule("2026-02-30", "08:00", "Sample Room 204")).toBe(
      false,
    );
    expect(validSampleSchedule("2026-10-05", "25:00", "Sample Room 204")).toBe(
      false,
    );
    expect(validSampleSchedule("2026-10-05", "08:00", " ")).toBe(false);
  });

  it("registers exactly six guarded Records destinations using existing permissions", () => {
    expect(portalRoutes.RECORDS.map((item) => item.path)).toEqual([
      "/records",
      "/records/applicants",
      "/records/dcat",
      "/records/students",
      "/records/enrollment",
      "/records/documents",
    ]);
    expect(
      portalRoutes.RECORDS.find((item) => item.path === "/records/dcat")
        ?.permission,
    ).toBe("records.applicants.view");
    expect(
      portalRoutes.RECORDS.find((item) => item.path === "/records/documents")
        ?.permission,
    ).toBe("records.enrollment.view");
  });
});
