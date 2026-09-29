"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldHelp, FieldLabel, Input, Select } from "@/components/ui/input";
import {
  campusProgramGroups,
  type CampusCode,
} from "@/lib/institution-programs";

export function ApplicantEntryPreview() {
  const [campusCode, setCampusCode] = useState<CampusCode>("MAIN");
  const [programCode, setProgramCode] = useState("BSA");
  const [major, setMajor] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const campus = campusProgramGroups.find((group) => group.id === campusCode)!;
  const programs = campus.programs;
  const program = programs.find((item) => item.code === programCode)!;

  function handleCampusChange(value: string) {
    const nextCampus = value as CampusCode;
    setCampusCode(nextCampus);
    setProgramCode(nextCampus === "MAIN" ? "BSA" : "BSIS");
    setMajor("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowPreview(true);
  }

  return (
    <section className="identity-flow-panel" aria-labelledby="entry-form-title">
      <h2 id="entry-form-title">Applicant entry preview</h2>
      <p className="identity-flow-intro">
        A connected system would use this information to begin an application.
        Here it stays in this page as a temporary preview.
      </p>

      {showPreview ? (
        <div className="identity-preview-result">
          <Alert role="status" tone="info">
            Preview only. No account or application was created, no email was
            sent, and nothing was saved.
          </Alert>
          <dl className="identity-preview-facts">
            <div>
              <dt>Name</dt>
              <dd>{fullName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{email}</dd>
            </div>
            <div>
              <dt>Preferred campus</dt>
              <dd>{campus.name}</dd>
            </div>
            <div>
              <dt>Preferred program</dt>
              <dd>
                {program.code} — {program.name}
                {major ? ` · ${major}` : ""}
              </dd>
            </div>
          </dl>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setShowPreview(false)}
          >
            Edit preview
          </Button>
        </div>
      ) : (
        <form className="identity-entry-form" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="applicant-name">Full name</FieldLabel>
            <Input
              id="applicant-name"
              name="name"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <FieldLabel htmlFor="applicant-email">Email address</FieldLabel>
            <Input
              id="applicant-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2"
              aria-describedby="applicant-email-help"
            />
            <FieldHelp id="applicant-email-help">
              Use fictional details. This address is not checked or contacted.
            </FieldHelp>
          </div>
          <div>
            <FieldLabel htmlFor="preferred-campus">Preferred campus</FieldLabel>
            <Select
              id="preferred-campus"
              name="campus"
              required
              value={campusCode}
              onChange={(event) => handleCampusChange(event.target.value)}
              className="mt-2"
            >
              {campusProgramGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel htmlFor="preferred-program">
              Preferred degree program
            </FieldLabel>
            <Select
              id="preferred-program"
              name="program"
              required
              value={programCode}
              onChange={(event) => {
                setProgramCode(event.target.value);
                setMajor("");
              }}
              className="mt-2"
            >
              {programs.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} — {item.name}
                </option>
              ))}
            </Select>
          </div>
          {program.code === "BSBA" ? (
            <div>
              <FieldLabel htmlFor="preferred-major">
                Preferred BSBA major
              </FieldLabel>
              <Select
                id="preferred-major"
                name="major"
                required
                value={major}
                onChange={(event) => setMajor(event.target.value)}
                className="mt-2"
              >
                <option value="" disabled>
                  Select a major
                </option>
                {program.majors.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
          <div className="identity-entry-actions">
            <Button type="submit">Preview entry</Button>
            <Link className="text-link" href="/account/create">
              Back to account options
            </Link>
          </div>
        </form>
      )}

      <div className="identity-flow-boundaries">
        <p>
          A future application would be linked to an annual cycle, but cycle
          names and dates are not set here. Physical documents remain part of a
          later in-person verification step; this screen has no upload fields.
        </p>
        <p>
          Already started an application? <Link href="/login">Sign in</Link> or
          use <Link href="/account/recovery">account recovery</Link>. This
          concept does not match identities or prevent duplicate people.
        </p>
      </div>
    </section>
  );
}

export function ApplicantRecoveryPreview() {
  const [email, setEmail] = useState("");
  const [showGuidance, setShowGuidance] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowGuidance(true);
  }

  return (
    <section
      className="identity-flow-panel"
      aria-labelledby="applicant-recovery"
    >
      <h2 id="applicant-recovery">Applicant account recovery</h2>
      <p className="identity-flow-intro">
        Applicant recovery is intended to use an email address. Delivery and
        identity-check behavior are not connected in this concept.
      </p>
      <form className="identity-entry-form" onSubmit={handleSubmit}>
        <div>
          <FieldLabel htmlFor="recovery-email">Email address</FieldLabel>
          <Input
            id="recovery-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2"
            aria-describedby="recovery-email-help"
          />
          <FieldHelp id="recovery-email-help">
            Use fictional details. This concept does not look up accounts.
          </FieldHelp>
        </div>
        <Button type="submit" variant="secondary">
          Show recovery guidance
        </Button>
      </form>
      {showGuidance ? (
        <Alert className="mt-5" role="status" tone="info">
          No recovery email was sent. Email delivery and account verification
          are not configured in this concept.
        </Alert>
      ) : null}
    </section>
  );
}
