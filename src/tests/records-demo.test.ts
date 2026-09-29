import { describe, expect, it } from "vitest";
import {
  countRecords,
  enrollmentSequence,
  initialApplicants,
  initialStudents,
  nextEnrollmentStep,
  validSampleSchedule,
} from "../features/records/demo-data";
import { portalRoutes } from "../server/access-control/navigation";

describe("P3-M5 Records demo fixtures", () => {
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
