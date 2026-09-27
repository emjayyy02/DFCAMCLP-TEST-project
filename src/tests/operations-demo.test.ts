import { describe, expect, it } from "vitest";
import {
  countHighPriorityOpenFacilityTickets,
  countOpenFacilityTickets,
  countOpenStudentServiceRequests,
  filterEmployees,
  filterFacilityTickets,
  filterStudentServiceRequests,
  initialEmployees,
  initialFacilityTickets,
  initialStudentServiceRequests,
  operationsInstitutionRegistry,
  updateFacilityAssignee,
  updateFacilityStatus,
  updateStudentServiceStatus,
} from "../features/operations/demo-data";

describe("Operations demo queues", () => {
  it("filters Student Services by student or request and by queue fields", () => {
    expect(
      filterStudentServiceRequests(initialStudentServiceRequests, {
        search: "DEMO-STU-2026-0186",
      }).map((request) => request.id),
    ).toEqual(["SS-26038"]);
    expect(
      filterStudentServiceRequests(initialStudentServiceRequests, {
        status: "In Review",
        campus: "IIT Campus",
      }).map((request) => request.id),
    ).toEqual(["SS-26038"]);
  });

  it("filters the basic employee directory without exposing account controls", () => {
    expect(
      filterEmployees(initialEmployees, { search: "EMP-DEMO-015" }).map(
        (employee) => employee.name,
      ),
    ).toEqual(["Avery Testadministrator"]);
    expect(
      filterEmployees(initialEmployees, {
        campus: "IIT Campus",
        functionalArea: "Facilities",
      }).map((employee) => employee.id),
    ).toEqual(["EMP-DEMO-014", "EMP-DEMO-019"]);
  });

  it("filters tickets by priority, status, and unassigned state", () => {
    expect(
      filterFacilityTickets(initialFacilityTickets, {
        priority: "High",
        status: "Open",
      }).map((ticket) => ticket.id),
    ).toEqual(["FAC-26041", "FAC-26037"]);
    expect(
      filterFacilityTickets(initialFacilityTickets, { assigneeId: null }).map(
        (ticket) => ticket.id,
      ),
    ).toEqual(["FAC-26037"]);
  });

  it("derives open queue counts from current demo statuses", () => {
    expect(countOpenStudentServiceRequests(initialStudentServiceRequests)).toBe(
      2,
    );
    expect(countOpenFacilityTickets(initialFacilityTickets)).toBe(3);
    expect(countHighPriorityOpenFacilityTickets(initialFacilityTickets)).toBe(
      2,
    );
  });

  it("requires outcome notes when resolving or closing demo work", () => {
    const request = initialStudentServiceRequests[0];
    expect(
      updateStudentServiceStatus(request, "Resolved", "27 Sep 2026"),
    ).toBeNull();
    expect(
      updateStudentServiceStatus(request, "In Review", "27 Sep 2026"),
    ).toMatchObject({
      status: "In Review",
      history: [
        ...request.history,
        { date: "27 Sep 2026", label: "Demo status changed to In Review" },
      ],
    });
    expect(
      updateStudentServiceStatus(
        request,
        "Resolved",
        "27 Sep 2026",
        "Shared the correct service contact.",
      ),
    ).toMatchObject({
      status: "Resolved",
      history: [
        ...request.history,
        {
          date: "27 Sep 2026",
          label:
            "Demo request marked Resolved: Shared the correct service contact.",
        },
      ],
    });
    const ticket = initialFacilityTickets[0];
    expect(updateFacilityStatus(ticket, "Resolved", "27 Sep 2026")).toBeNull();
    expect(updateFacilityStatus(ticket, "Closed", "27 Sep 2026")).toBeNull();
    expect(
      updateFacilityStatus(
        ticket,
        "Resolved",
        "27 Sep 2026",
        "Sample fixture replaced",
      ),
    ).toMatchObject({
      status: "Resolved",
      history: [
        ...ticket.history,
        {
          date: "27 Sep 2026",
          label: "Demo ticket marked Resolved: Sample fixture replaced",
        },
      ],
    });
    expect(
      updateFacilityStatus(
        ticket,
        "Closed",
        "27 Sep 2026",
        "Confirmed the sample fix and updated the fixture.",
      ),
    ).toMatchObject({
      status: "Closed",
      history: [
        ...ticket.history,
        {
          date: "27 Sep 2026",
          label:
            "Demo ticket marked Closed: Confirmed the sample fix and updated the fixture.",
        },
      ],
    });
    expect(
      updateFacilityAssignee(ticket, "EMP-DEMO-017", "27 Sep 2026"),
    ).toBeNull();
    expect(
      updateFacilityAssignee(ticket, "EMP-DEMO-019", "27 Sep 2026"),
    ).toMatchObject({ assigneeId: "EMP-DEMO-019" });
  });
});

describe("Operations campus and program reference", () => {
  it("derives the exact normalized registry from the canonical Applicant fixture", () => {
    expect(operationsInstitutionRegistry.map((campus) => campus.name)).toEqual([
      "Main Campus",
      "IIT Campus",
    ]);
    expect(
      operationsInstitutionRegistry.map((campus) =>
        campus.programs.map((program) => program.code),
      ),
    ).toEqual([
      ["BSA", "BSBA"],
      ["BSIS", "CPE"],
    ]);

    const programs = operationsInstitutionRegistry.flatMap(
      (campus) => campus.programs,
    );
    expect(programs.filter((program) => program.code === "BSIS")).toHaveLength(
      1,
    );
    expect(programs.find((program) => program.code === "BSIS")?.label).toBe(
      "BSIS — Bachelor of Science in Information Systems",
    );
    expect(
      operationsInstitutionRegistry[0].programs.find(
        (program) => program.code === "BSBA",
      )?.majors,
    ).toEqual([
      "Financial Management",
      "Marketing Management",
      "Human Resource Management",
    ]);
    expect(
      programs.some((program) => program.label.includes("IIT / CAA Campus")),
    ).toBe(false);
  });
});
