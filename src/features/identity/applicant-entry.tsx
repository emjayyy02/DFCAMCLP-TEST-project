"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Select, CheckboxInput } from "@/components/ui/input";
import { Avatar } from "@/components/ui/identity";
import { DemoProfilePhotoPicker } from "@/components/ui/demo-profile-photo";
import { PreviewInfo } from "./account-entry";
import {
  emptyEntryDraft,
  entryPrograms,
  entrySteps,
  emailError,
  followUpFocus,
  validateEntryStep,
  type EntryDraft,
  type EntryErrors,
} from "./applicant-entry-rules";

const labels: Record<keyof EntryDraft, string> = {
  applicantType: "Applicant type",
  cycle: "Application cycle",
  firstProgram: "First-choice program",
  secondProgram: "Second-choice program (optional)",
  major: "BSBA major",
  firstName: "First name",
  middleName: "Middle name (optional)",
  lastName: "Last name",
  suffix: "Suffix (optional)",
  birthDate: "Birthdate",
  sex: "Sex",
  nationality: "Nationality",
  email: "Email",
  mobile: "Mobile number",
  mother: "Mother name (optional)",
  father: "Father name (optional)",
  guardian: "Guardian / emergency contact name",
  guardianContact: "Guardian / emergency contact number",
  address: "Current address (optional)",
  city: "City",
  barangay: "Barangay",
};
const optional = new Set<keyof EntryDraft>([
  "middleName",
  "suffix",
  "secondProgram",
  "address",
  "mother",
  "father",
]);
function programLabel(code: string) {
  const program = entryPrograms.find((p) => p.code === code);
  return program
    ? `${program.code} — ${program.name} · ${program.campus}`
    : "Not selected";
}
function StepInput({
  field,
  draft,
  errors,
  update,
  options,
  type = "text",
}: {
  field: keyof EntryDraft;
  draft: EntryDraft;
  errors: EntryErrors;
  update: (key: keyof EntryDraft, value: string) => void;
  options?: { value: string; label: string }[];
  type?: string;
}) {
  const id = `entry-${field}`;
  const props = {
    id,
    name: field,
    value: draft[field],
    required: !optional.has(field),
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${id}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => update(field, event.target.value),
  };
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {labels[field]}
        {!optional.has(field) ? " *" : ""}
      </label>
      {options ? (
        <Select {...props}>
          <option value="">
            {optional.has(field) ? "No second choice" : "Select an option"}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          {...props}
          type={type}
          maxLength={field === "email" ? 254 : 100}
        />
      )}
      {errors[field] ? (
        <p className="field-error" id={`${id}-error`}>
          {errors[field]}
        </p>
      ) : null}
    </div>
  );
}
export function ApplicantEntryPreview() {
  const [draft, setDraft] = useState<EntryDraft>(emptyEntryDraft);
  const [step, setStep] = useState(1);
  const [reached, setReached] = useState(1);
  const [errors, setErrors] = useState<EntryErrors>({});
  const [photo, setPhoto] = useState<string>();
  const photoRef = useRef<string | undefined>(undefined);
  const [privacy, setPrivacy] = useState(false);
  const [truth, setTruth] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeMessage, setCodeMessage] = useState("");
  const [codeChecked, setCodeChecked] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(
    () => () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current);
    },
    [],
  );
  useEffect(() => {
    if (firstRender.current) firstRender.current = false;
    else heading.current?.focus();
  }, [step, applicationNumber]);
  function update(key: keyof EntryDraft, value: string) {
    setDraft((current) => ({
      ...current,
      [key]: value,
      ...(key === "firstProgram"
        ? {
            major: "",
            secondProgram:
              current.secondProgram === value ? "" : current.secondProgram,
          }
        : {}),
    }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setTruth(false);
    if (key === "email") {
      setCode("");
      setCodeInput("");
      setCodeMessage("");
      setCodeChecked(false);
    }
  }
  function commitPhoto(file: File | null) {
    if (photoRef.current) URL.revokeObjectURL(photoRef.current);
    const url = file ? URL.createObjectURL(file) : undefined;
    photoRef.current = url;
    setPhoto(url);
    setErrors((current) => ({ ...current, photo: undefined }));
    setTruth(false);
  }
  function go(next: number) {
    setErrors({});
    setConsentError("");
    setStep(next);
  }
  function check(currentStep: number) {
    const next = validateEntryStep(draft, currentStep, !!photo);
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return false;
    }
    return true;
  }
  function navigate(next: number) {
    if (next > step) {
      for (let current = 1; current < next; current++) {
        const invalid = validateEntryStep(draft, current, !!photo);
        if (Object.keys(invalid).length) {
          setStep(current);
          setErrors(invalid);
          requestAnimationFrame(() => errorSummary.current?.focus());
          return;
        }
      }
    }
    go(next);
  }
  function advance() {
    if (!check(step)) return;
    const next = step + 1;
    setReached(Math.max(reached, next));
    go(next);
  }
  function generate() {
    for (let current = 1; current <= 3; current++) {
      const next = validateEntryStep(draft, current, !!photo);
      if (Object.keys(next).length) {
        setStep(current);
        setErrors(next);
        requestAnimationFrame(() => errorSummary.current?.focus());
        return;
      }
    }
    if (!privacy || !truth) {
      setConsentError(
        "Check both declarations to generate the demo account preview.",
      );
      return;
    }
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    setApplicationNumber(
      `SAMPLE-DCAT2027-${bytes[0].toString(16).toUpperCase().padStart(8, "0")}`,
    );
  }
  const programOptions = entryPrograms.map((p) => ({
    value: p.code,
    label: `${p.code} — ${p.name}`,
  }));
  const input = (
    field: keyof EntryDraft,
    type = "text",
    options?: { value: string; label: string }[],
  ) => (
    <StepInput
      key={field}
      field={field}
      type={type}
      options={options}
      draft={draft}
      errors={errors}
      update={update}
    />
  );
  const name = [draft.firstName, draft.middleName, draft.lastName, draft.suffix]
    .filter(Boolean)
    .join(" ");
  if (applicationNumber)
    return (
      <section className="entry-complete">
        <h2 tabIndex={-1} ref={heading}>
          Demo account preview ready
        </h2>
        <p className="entry-boundary">
          Local preview only. No sign-in account or school application was
          created.
        </p>
        <dl className="identity-preview-facts">
          <div>
            <dt>Sample application number</dt>
            <dd>
              <strong>{applicationNumber}</strong>
            </dd>
          </div>
          <div>
            <dt>Applicant</dt>
            <dd>{name}</dd>
          </div>
          <div>
            <dt>Login email preview</dt>
            <dd>{draft.email}</dd>
          </div>
          <div>
            <dt>Password concept</dt>
            <dd>
              A temporary password would be issued by a connected account
              service. No password was created here.
            </dd>
          </div>
          <div>
            <dt>Next demo focus</dt>
            <dd>
              {followUpFocus(draft.applicantType)} in the Applicant portal.
            </dd>
          </div>
        </dl>
        <Link href="/login?portal=APPLICANT" className="text-link">
          Explore the existing Applicant demo
        </Link>
      </section>
    );
  return (
    <div className="entry-wizard">
      <nav aria-label="Application entry steps">
        <ol className="entry-stepper">
          {entrySteps.map((title, index) => (
            <li key={title}>
              <button
                type="button"
                disabled={index + 1 > reached}
                aria-current={step === index + 1 ? "step" : undefined}
                onClick={() => navigate(index + 1)}
              >
                <span aria-hidden="true">{index + 1}</span>
                <span>{title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <h2 ref={heading} tabIndex={-1} className="entry-stage-heading">
        {entrySteps[step - 1]}
      </h2>
      {Object.values(errors).some(Boolean) ? (
        <div
          className="entry-error-summary"
          ref={errorSummary}
          tabIndex={-1}
          role="alert"
        >
          <p>Check the highlighted fields.</p>
          <ul>
            {Object.entries(errors)
              .filter(([, message]) => message)
              .map(([key, message]) => (
                <li key={key}>
                  <a
                    href={`#${key === "photo" ? "entry-photo" : `entry-${key}`}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document
                        .getElementById(
                          key === "photo" ? "entry-photo" : `entry-${key}`,
                        )
                        ?.focus();
                    }}
                  >
                    {message}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
      <form
        className="preview-form entry-stage"
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (step < 4) advance();
          else generate();
        }}
      >
        {step === 1 ? (
          <>
            <div className="preview-fields">
              {input(
                "applicantType",
                "text",
                ["Freshman", "Transferee", "Returnee"].map((value) => ({
                  value,
                  label: value,
                })),
              )}
              {input("cycle", "text", [
                { value: "DCAT 2027", label: "DCAT 2027 — demo cycle" },
              ])}
              {input("firstProgram", "text", programOptions)}
              {input(
                "secondProgram",
                "text",
                programOptions.filter((p) => p.value !== draft.firstProgram),
              )}
              {draft.firstProgram === "BSBA"
                ? input(
                    "major",
                    "text",
                    entryPrograms
                      .find((p) => p.code === "BSBA")!
                      .majors.map((value) => ({ value, label: value })),
                  )
                : null}
            </div>
            {draft.applicantType ? (
              <p className="entry-context">
                Demo follow-up focus: {followUpFocus(draft.applicantType)}.
                Requirements are reviewed after account entry.
              </p>
            ) : null}
          </>
        ) : null}
        {step === 2 ? (
          <>
            <div className="entry-photo-area">
              <span className="field-label">Photo *</span>
              <div
                id="entry-photo"
                role="group"
                aria-label="Applicant photo"
                tabIndex={-1}
                aria-describedby={
                  errors.photo ? "entry-photo-error" : undefined
                }
              >
                <DemoProfilePhotoPicker
                  id="entry-photo-picker"
                  name={name || "Applicant"}
                  src={photo}
                  onSelect={commitPhoto}
                  placeholder
                />
              </div>
              {errors.photo ? (
                <p id="entry-photo-error" className="field-error">
                  {errors.photo}
                </p>
              ) : null}
            </div>
            <div className="preview-fields">
              {input("firstName")}
              {input("middleName")}
              {input("lastName")}
              {input("suffix")}
              {input("birthDate", "date")}
              {input(
                "sex",
                "text",
                ["Female", "Male", "Prefer not to say"].map((value) => ({
                  value,
                  label: value,
                })),
              )}
              {input("nationality")}
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <div className="preview-fields">
              {input("email", "email")}
              {input("mobile", "tel")}
              {input("guardian")}
              {input("guardianContact", "tel")}
              {input("address")}
              {input("city")}
              {input("barangay")}
              {input("mother")}
              {input("father")}
            </div>
            <section
              className="entry-verification"
              aria-labelledby="entry-verification-title"
            >
              <div className="entry-section-title">
                <h3 id="entry-verification-title">
                  Email verification preview
                </h3>
                <PreviewInfo>
                  <p>
                    Your email becomes your login and where your application
                    number or updates would be sent.
                  </p>
                  <p>
                    This local code preview sends no email and verifies no real
                    identity.
                  </p>
                </PreviewInfo>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const error = emailError(draft.email);
                  if (error) {
                    setErrors((current) => ({ ...current, email: error }));
                    document.getElementById("entry-email")?.focus();
                    return;
                  }
                  setCode("123456");
                  setCodeChecked(false);
                  setCodeMessage("");
                }}
              >
                Preview email code
              </Button>
              {code ? (
                <div className="entry-code">
                  <p>
                    Sample code: <strong>{code}</strong>
                  </p>
                  <label className="field-label" htmlFor="entry-code">
                    Preview code
                  </label>
                  <Input
                    id="entry-code"
                    inputMode="numeric"
                    maxLength={6}
                    value={codeInput}
                    aria-describedby="entry-code-status"
                    onChange={(event) => {
                      setCodeInput(event.target.value);
                      setCodeChecked(false);
                      setCodeMessage("");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const matches = codeInput === code;
                      setCodeChecked(matches);
                      setCodeMessage(
                        matches
                          ? "Local preview checked. No real email verification occurred."
                          : "Enter the displayed six-digit sample code.",
                      );
                    }}
                  >
                    Check preview code
                  </Button>
                  <p id="entry-code-status" role="status">
                    {codeMessage}
                  </p>
                </div>
              ) : null}
            </section>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <div className="entry-review">
              {[1, 2, 3].map((reviewStep) => (
                <section key={reviewStep}>
                  <div className="entry-review-heading">
                    <h3>{entrySteps[reviewStep - 1]}</h3>
                    <Button
                      type="button"
                      variant="tertiary"
                      onClick={() => go(reviewStep)}
                    >
                      Edit step {reviewStep}
                    </Button>
                  </div>
                  {reviewStep === 2 ? (
                    <Avatar name={name} src={photo} size="large" placeholder />
                  ) : null}
                  <dl className="identity-preview-facts">
                    {(reviewStep === 1
                      ? [
                          "applicantType",
                          "cycle",
                          "firstProgram",
                          "secondProgram",
                          ...(draft.firstProgram === "BSBA" ? ["major"] : []),
                        ]
                      : reviewStep === 2
                        ? [
                            "firstName",
                            "middleName",
                            "lastName",
                            "suffix",
                            "birthDate",
                            "sex",
                            "nationality",
                          ]
                        : [
                            "email",
                            "mobile",
                            "guardian",
                            "guardianContact",
                            "mother",
                            "father",
                            "address",
                            "city",
                            "barangay",
                          ]
                    ).map((key) => (
                      <div key={key}>
                        <dt>
                          {labels[key as keyof EntryDraft].replace(
                            " (optional)",
                            "",
                          )}
                        </dt>
                        <dd>
                          {key.includes("Program")
                            ? draft[key as keyof EntryDraft]
                              ? programLabel(draft[key as keyof EntryDraft])
                              : "No second choice"
                            : draft[key as keyof EntryDraft] || "Not provided"}
                        </dd>
                      </div>
                    ))}
                    {reviewStep === 3 ? (
                      <div>
                        <dt>Email code preview</dt>
                        <dd>
                          {codeChecked
                            ? "Checked locally; no real verification"
                            : "Not checked (optional demo)"}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </section>
              ))}
            </div>
            <section className="entry-consent">
              <h3>Consent and account generation</h3>
              <p>
                Temporary-password concept: a connected service would issue a
                password. This demo creates no credentials.
              </p>
              <label>
                <CheckboxInput
                  checked={privacy}
                  onChange={(event) => {
                    setPrivacy(event.target.checked);
                    setConsentError("");
                  }}
                  aria-describedby={
                    consentError ? "entry-consent-error" : undefined
                  }
                />{" "}
                <span>
                  I have read the{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy &amp; Data Notice (opens a new tab)
                  </Link>{" "}
                  and agree to use fictional details in this preview.
                </span>
              </label>
              <label>
                <CheckboxInput
                  checked={truth}
                  onChange={(event) => {
                    setTruth(event.target.checked);
                    setConsentError("");
                  }}
                  aria-describedby={
                    consentError ? "entry-consent-error" : undefined
                  }
                />{" "}
                <span>
                  I declare these demo entries accurately represent the
                  fictional applicant I am previewing.
                </span>
              </label>
              {consentError ? (
                <p
                  id="entry-consent-error"
                  role="alert"
                  className="field-error"
                >
                  {consentError}
                </p>
              ) : null}
            </section>
          </>
        ) : null}
        <div className="preview-actions">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => go(step - 1)}
            >
              Back
            </Button>
          ) : null}
          <Button type="submit">
            {step === 4 ? "Generate demo account" : "Continue"}
          </Button>
        </div>
      </form>
      <Link className="text-link preview-back" href="/account/create">
        Back to account options
      </Link>
    </div>
  );
}
