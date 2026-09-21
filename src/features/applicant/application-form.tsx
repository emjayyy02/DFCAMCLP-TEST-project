"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { FormSection } from "@/components/ui/form-section";
import { useApplicantDemo } from "./demo-context";
import {
  campusOptions,
  programOptions,
  applicantIdentity,
  campusDisplay,
  programDisplay,
  validateApplication,
  type ApplicationDraft,
} from "./demo-data";
import { Facts } from "./shared";

const fieldGroups: {
  title: string;
  fields: { key: keyof ApplicationDraft; label: string; type?: string }[];
}[] = [
  {
    title: "Personal information",
    fields: [
      { key: "firstName", label: "First name" },
      { key: "lastName", label: "Last name" },
      { key: "birthDate", label: "Date of birth", type: "date" },
    ],
  },
  {
    title: "Contact information",
    fields: [
      { key: "email", label: "Email address", type: "email" },
      { key: "phone", label: "Mobile number", type: "tel" },
    ],
  },
  {
    title: "Address",
    fields: [
      { key: "street", label: "House number & street" },
      { key: "barangay", label: "Barangay" },
      { key: "city", label: "City" },
    ],
  },
  {
    title: "Academic background",
    fields: [
      { key: "school", label: "Senior high school" },
      { key: "strand", label: "Strand / track" },
      { key: "graduationYear", label: "Graduation year" },
    ],
  },
];
const fieldLabels = Object.fromEntries(
  fieldGroups.flatMap((group) =>
    group.fields.map((field) => [field.key, field.label]),
  ),
);

export function ApplicationForm() {
  const {
    scenario,
    setScenario,
    draft,
    setDraft,
    savedDraft,
    setSavedDraft,
    savedAt,
    setSavedAt,
  } = useApplicantDemo();
  const [review, setReview] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplicationDraft, string>>
  >({});
  const [feedback, setFeedback] = useState("");
  const summary = useRef<HTMLDivElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const formHeading = useRef<HTMLHeadingElement>(null);
  const confirm = useRef<HTMLDialogElement>(null);
  const submitTrigger = useRef<HTMLButtonElement>(null);
  const editable = scenario === "draft";
  const dirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);
  const display = editable ? draft : savedDraft;
  const selectedProgram = programOptions.find(
    (item) => item.code === draft.program,
  );

  function update(key: keyof ApplicationDraft, value: string) {
    setDraft((current) => ({
      ...current,
      [key]: value,
      ...(key === "campus"
        ? { program: "", major: "" }
        : key === "program"
          ? { major: "" }
          : {}),
    }));
    setFeedback("");
    setErrors((current) => ({ ...current, [key]: undefined }));
  }
  function reviewApplication() {
    const nextErrors = validateApplication(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setReview(true);
    requestAnimationFrame(() => reviewHeading.current?.focus());
  }
  function saveDraft() {
    setSavedDraft({ ...draft });
    setSavedAt(
      new Date().toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Manila",
      }),
    );
    setFeedback(
      "Demo draft saved in this tab. Nothing was sent to the college.",
    );
  }
  return (
    <section className="applicant-form">
      <div className="applicant-section-heading">
        <div>
          <h2 ref={formHeading} tabIndex={-1}>
            Application form
          </h2>
          <p>{applicantIdentity.id}</p>
        </div>
        <Badge tone={editable ? "neutral" : "info"}>
          {editable ? "Draft" : "Submitted"}
        </Badge>
      </div>
      <p className="applicant-form-note">
        Use fake information only. Demo fields and required checks are
        provisional.
      </p>
      {!editable || review ? (
        <>
          <h3
            ref={reviewHeading}
            tabIndex={-1}
            className="applicant-review-title"
          >
            {editable ? "Review your application" : "Submitted information"}
          </h3>
          {fieldGroups.map((group) => (
            <section className="applicant-review-group" key={group.title}>
              <h3>{group.title}</h3>
              <Facts
                items={group.fields.map((field) => [
                  field.label,
                  display[field.key],
                ])}
              />
            </section>
          ))}
          <section className="applicant-review-group">
            <h3>Program selection</h3>
            <Facts
              items={[
                ["Campus", campusDisplay(display)],
                ["Program", programDisplay(display)],
                ...(display.major
                  ? [["Major", display.major] as [string, string]]
                  : []),
              ]}
            />
          </section>
          {editable ? (
            <div className="applicant-actions">
              <Button
                variant="outline"
                onClick={() => {
                  setReview(false);
                  requestAnimationFrame(() => formHeading.current?.focus());
                }}
              >
                Edit information
              </Button>
              <Button
                ref={submitTrigger}
                onClick={() => confirm.current?.showModal()}
              >
                Submit demo application
              </Button>
            </div>
          ) : (
            <div className="applicant-readonly-note">
              <p>
                Submitted information is read-only. Corrections require an
                Admissions process that is not available in this demo.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setScenario("draft");
                  setReview(false);
                  setFeedback("");
                }}
              >
                Try the draft form
              </Button>
            </div>
          )}
        </>
      ) : (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            reviewApplication();
          }}
        >
          <div
            ref={summary}
            tabIndex={-1}
            role={Object.values(errors).some(Boolean) ? "alert" : undefined}
            className={
              Object.values(errors).some(Boolean)
                ? "applicant-errors"
                : undefined
            }
          >
            {Object.values(errors).some(Boolean) ? (
              <>
                <h3>Check these fields</h3>
                <ul>
                  {Object.entries(errors)
                    .filter(([, message]) => message)
                    .map(([key, message]) => (
                      <li key={key}>
                        <a href={`#application-${key}`}>
                          {fieldLabels[key] ?? key}: {message}
                        </a>
                      </li>
                    ))}
                </ul>
              </>
            ) : null}
          </div>
          {fieldGroups.map((group) => (
            <FormSection key={group.title} className="applicant-fieldset">
              <legend>{group.title}</legend>
              <div className="applicant-fields">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <label htmlFor={`application-${field.key}`}>
                      {field.label}
                      <span aria-hidden="true"> *</span>
                    </label>
                    <Input
                      id={`application-${field.key}`}
                      name={field.key}
                      type={field.type ?? "text"}
                      required
                      value={draft[field.key]}
                      maxLength={field.type === "date" ? undefined : 150}
                      autoComplete="off"
                      inputMode={
                        field.key === "graduationYear" ? "numeric" : undefined
                      }
                      aria-invalid={Boolean(errors[field.key])}
                      aria-describedby={
                        errors[field.key] ? `error-${field.key}` : undefined
                      }
                      onChange={(event) =>
                        update(field.key, event.target.value)
                      }
                    />
                    {errors[field.key] ? (
                      <p
                        className="applicant-field-error"
                        id={`error-${field.key}`}
                      >
                        {errors[field.key]}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </FormSection>
          ))}
          <FormSection className="applicant-fieldset">
            <legend>Program selection</legend>
            <div className="applicant-fields">
              <div>
                <label htmlFor="application-campus">Campus *</label>
                <Select
                  id="application-campus"
                  required
                  value={draft.campus}
                  onChange={(event) => update("campus", event.target.value)}
                >
                  {campusOptions.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="application-program">Program *</label>
                <Select
                  id="application-program"
                  required
                  value={draft.program}
                  aria-invalid={Boolean(errors.program)}
                  aria-describedby={
                    errors.program ? "error-program" : undefined
                  }
                  onChange={(event) => update("program", event.target.value)}
                >
                  <option value="">Choose a program</option>
                  {programOptions
                    .filter((item) => item.campus === draft.campus)
                    .map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                </Select>
                {errors.program ? (
                  <p id="error-program" className="applicant-field-error">
                    {errors.program}
                  </p>
                ) : null}
              </div>
              {selectedProgram?.majors.length ? (
                <div>
                  <label htmlFor="application-major">BSBA major *</label>
                  <Select
                    id="application-major"
                    required
                    value={draft.major}
                    aria-invalid={Boolean(errors.major)}
                    aria-describedby={errors.major ? "error-major" : undefined}
                    onChange={(event) => update("major", event.target.value)}
                  >
                    <option value="">Choose a major</option>
                    {selectedProgram.majors.map((major) => (
                      <option key={major}>{major}</option>
                    ))}
                  </Select>
                  {errors.major ? (
                    <p id="error-major" className="applicant-field-error">
                      {errors.major}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </FormSection>
          <div className="applicant-form-save">
            <p>
              {dirty
                ? "Unsaved changes"
                : savedAt
                  ? `Saved at ${savedAt} · Philippine time`
                  : "Sample draft loaded"}
              <span>Changes stay in this tab until refresh.</span>
            </p>
            <div className="applicant-actions">
              <Button type="button" variant="outline" onClick={saveDraft}>
                Save demo draft
              </Button>
              <Button type="submit">Review application</Button>
            </div>
          </div>
        </form>
      )}
      <p role="status" className="applicant-feedback">
        {feedback}
      </p>
      <dialog
        ref={confirm}
        aria-labelledby="submit-demo-title"
        className="applicant-dialog"
        onClose={() => {
          if (scenario === "draft") submitTrigger.current?.focus();
          else formHeading.current?.focus();
        }}
      >
        <h2 id="submit-demo-title">Submit this demo application?</h2>
        <p>
          {draft.firstName} {draft.lastName} · {applicantIdentity.id}
        </p>
        <p>
          The form will become read-only in this tab. Nothing will be sent to
          DFCAMCLP. Refresh resets the demo.
        </p>
        <div className="applicant-actions">
          <Button variant="outline" onClick={() => confirm.current?.close()}>
            Keep reviewing
          </Button>
          <Button
            onClick={() => {
              setSavedDraft({ ...draft });
              setScenario("submitted");
              setReview(false);
              setFeedback(
                "Demo application submitted in this tab only. Your sample document schedule is not yet assigned.",
              );
              confirm.current?.close();
              requestAnimationFrame(() => formHeading.current?.focus());
            }}
          >
            Confirm demo submission
          </Button>
        </div>
      </dialog>
    </section>
  );
}
