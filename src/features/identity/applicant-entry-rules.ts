import { campusProgramGroups } from "../../lib/institution-programs";
export const entryPrograms = campusProgramGroups.flatMap((campus) =>
  campus.programs.map((program) => ({ ...program, campus: campus.name })),
);
export const entrySteps = [
  "Applicant type and program",
  "Personal details",
  "Contact and verification",
  "Review, consent and account generation",
] as const;
export type EntryDraft = {
  applicantType: string;
  cycle: string;
  firstProgram: string;
  secondProgram: string;
  major: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  sex: string;
  nationality: string;
  email: string;
  mobile: string;
  mother: string;
  father: string;
  guardian: string;
  guardianContact: string;
  address: string;
  city: string;
  barangay: string;
};
export const emptyEntryDraft: EntryDraft = {
  applicantType: "",
  cycle: "",
  firstProgram: "",
  secondProgram: "",
  major: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthDate: "",
  sex: "",
  nationality: "",
  email: "",
  mobile: "",
  mother: "",
  father: "",
  guardian: "",
  guardianContact: "",
  address: "",
  city: "",
  barangay: "",
};
export type EntryErrors = Partial<Record<keyof EntryDraft | "photo", string>>;
export function personNameError(value: string, required = true) {
  const name = value.trim();
  if (!name) return required ? "Enter a name." : undefined;
  if (
    !/\p{L}/u.test(name) ||
    /\p{N}/u.test(name) ||
    !/^[\p{L}\p{M}\s.'’ʼ\-]+$/u.test(name)
  )
    return "Use letters for a person's name, with spaces, apostrophes or hyphens as needed.";
  if (name.length > 100) return "Keep the name within 100 characters.";
  return undefined;
}
export function emailError(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.length <= 254
    ? undefined
    : "Enter a valid email address.";
}
export function phoneError(value: string) {
  const clean = value.trim();
  const digits = clean.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(clean) &&
    digits.length >= 7 &&
    digits.length <= 15
    ? undefined
    : "Enter 7–15 digits; an optional country code and phone punctuation are allowed.";
}
export function validateEntryStep(
  draft: EntryDraft,
  step: number,
  hasPhoto: boolean,
  today = new Date().toISOString().slice(0, 10),
): EntryErrors {
  const errors: EntryErrors = {};
  const add = (key: keyof EntryErrors, error?: string) => {
    if (error) errors[key] = error;
  };
  if (step === 1) {
    if (!["Freshman", "Transferee", "Returnee"].includes(draft.applicantType))
      errors.applicantType = "Choose an applicant type.";
    if (draft.cycle !== "DCAT 2027")
      errors.cycle = "Choose the demo application cycle.";
    if (!entryPrograms.some((p) => p.code === draft.firstProgram))
      errors.firstProgram = "Choose your first-choice program.";
    if (
      draft.secondProgram &&
      (!entryPrograms.some((p) => p.code === draft.secondProgram) ||
        draft.secondProgram === draft.firstProgram)
    )
      errors.secondProgram =
        "Choose a different second-choice program or leave it empty.";
    if (
      draft.firstProgram === "BSBA" &&
      !entryPrograms
        .find((p) => p.code === "BSBA")!
        .majors.some((m) => m === draft.major)
    )
      errors.major = "Choose a BSBA major.";
  }
  if (step === 2) {
    add("firstName", personNameError(draft.firstName));
    add("lastName", personNameError(draft.lastName));
    add("middleName", personNameError(draft.middleName, false));
    add("suffix", personNameError(draft.suffix, false));
    const date = new Date(draft.birthDate + "T00:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(draft.birthDate) ||
      Number.isNaN(date.valueOf()) ||
      date.toISOString().slice(0, 10) !== draft.birthDate ||
      draft.birthDate >= today
    )
      errors.birthDate = "Enter a valid birthdate earlier than today.";
    if (!["Female", "Male", "Prefer not to say"].includes(draft.sex))
      errors.sex = "Choose an option for sex.";
    if (
      !draft.nationality.trim() ||
      !/\p{L}/u.test(draft.nationality) ||
      /\p{N}/u.test(draft.nationality)
    )
      errors.nationality = "Enter your nationality using words.";
    if (!hasPhoto) errors.photo = "Add a photo for this demo preview.";
  }
  if (step === 3) {
    add("email", emailError(draft.email));
    add("mobile", phoneError(draft.mobile));
    add("guardian", personNameError(draft.guardian));
    add("mother", personNameError(draft.mother, false));
    add("father", personNameError(draft.father, false));
    add("guardianContact", phoneError(draft.guardianContact));
    for (const key of ["city", "barangay"] as const)
      if (
        !draft[key].trim() ||
        !(key === "city" ? /\p{L}/u : /[\p{L}\p{N}]/u).test(draft[key])
      )
        errors[key] = `Enter a ${key === "city" ? "city" : "barangay"} name.`;
  }
  return errors;
}
export function followUpFocus(type: string) {
  return (
    {
      Freshman: "School background",
      Transferee: "Prior college background",
      Returnee: "Prior enrollment background",
    }[type] ?? "Academic background"
  );
}
