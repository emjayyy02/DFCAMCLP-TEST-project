import { describe, expect, it } from "vitest";
import {
  emptyEntryDraft,
  validateEntryStep,
  personNameError,
  phoneError,
  emailError,
  followUpFocus,
  type EntryDraft,
} from "../features/identity/applicant-entry-rules";
const draft: EntryDraft = {
  ...emptyEntryDraft,
  applicantType: "Freshman",
  cycle: "DCAT 2027",
  firstProgram: "BSIS",
  firstName: "Juan",
  lastName: "Dela Cruz",
  birthDate: "2005-01-02",
  sex: "Male",
  nationality: "Filipino",
  email: "juan.delacruz@example.invalid",
  mobile: "+63 912 000 0000",
  guardian: "Maria Example",
  guardianContact: "09120000001",
  city: "Sample City",
  barangay: "Sample Barangay",
};
describe("Applicant entry validation", () => {
  it.each([1, 2, 3])("accepts complete stage %i", (step) =>
    expect(validateEntryStep(draft, step, true, "2026-10-02")).toEqual({}),
  );
  it.each([
    "Juan Dela Cruz",
    "María Santos",
    "Anne-Marie",
    "O’Connor",
    "王小明",
    "José de la Cruz",
  ])("accepts person name %s", (name) =>
    expect(personNameError(name)).toBeUndefined(),
  );
  it.each(["123456", "１２３", "Juan123", "---", "  ", "<script>"])(
    "rejects invalid person name %s",
    (name) => expect(personNameError(name)).toBeDefined(),
  );
  it.each(["firstName", "lastName"] as const)(
    "requires personal field %s",
    (key) =>
      expect(
        validateEntryStep({ ...draft, [key]: "" }, 2, true)[key],
      ).toBeDefined(),
  );
  it.each(["birthDate", "sex", "nationality"] as const)(
    "requires personal context %s",
    (key) =>
      expect(
        validateEntryStep({ ...draft, [key]: "" }, 2, true)[key],
      ).toBeDefined(),
  );
  it.each([
    "email",
    "mobile",
    "guardian",
    "guardianContact",
    "city",
    "barangay",
  ] as const)("requires contact field %s", (key) =>
    expect(
      validateEntryStep({ ...draft, [key]: " " }, 3, true)[key],
    ).toBeDefined(),
  );
  it.each(["mother", "father", "guardian"] as const)(
    "rejects numeric junk in %s",
    (key) =>
      expect(
        validateEntryStep({ ...draft, [key]: "1234" }, 3, true)[key],
      ).toBeDefined(),
  );
  it("requires a photo", () =>
    expect(validateEntryStep(draft, 2, false).photo).toBeDefined());
  it.each(["2025-02-29", "2026-10-02", "2030-01-01", "invalid"])(
    "rejects invalid/future birthdate %s",
    (birthDate) =>
      expect(
        validateEntryStep({ ...draft, birthDate }, 2, true, "2026-10-02")
          .birthDate,
      ).toBeDefined(),
  );
  it("accepts a numbered barangay without inventing an address policy", () => {
    expect(validateEntryStep({ ...draft, barangay: "183" }, 3, true)).toEqual(
      {},
    );
  });
  it("rejects duplicate and unknown programs", () => {
    expect(
      validateEntryStep({ ...draft, secondProgram: "BSIS" }, 1, true)
        .secondProgram,
    ).toBeDefined();
    expect(
      validateEntryStep({ ...draft, firstProgram: "unknown" }, 1, true)
        .firstProgram,
    ).toBeDefined();
  });
  it("requires a valid BSBA major only for BSBA", () => {
    expect(
      validateEntryStep({ ...draft, firstProgram: "BSBA" }, 1, true).major,
    ).toBeDefined();
    expect(
      validateEntryStep(
        { ...draft, firstProgram: "BSBA", major: "Financial Management" },
        1,
        true,
      ),
    ).toEqual({});
  });
  it("keeps optional names and second choice empty", () =>
    expect(validateEntryStep(draft, 3, true)).toEqual({}));
  it("validates email and phone independently", () => {
    expect(emailError("bad")).toBeDefined();
    expect(phoneError("call me")).toBeDefined();
    expect(phoneError("123")).toBeDefined();
    expect(phoneError("1234567890123456")).toBeDefined();
  });
  it("changes follow-up direction by demo applicant type", () => {
    expect(followUpFocus("Freshman")).toBe("School background");
    expect(followUpFocus("Transferee")).toBe("Prior college background");
    expect(followUpFocus("Returnee")).toBe("Prior enrollment background");
  });
});
