"use client";
/* eslint-disable @next/next/no-img-element -- Local blob previews must never pass through an image service. */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/input";
import { supportIssues, validatePreviewImage } from "./preview-rules";

export function PreviewInfo({ children }: { children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
        setPinned(false);
      }
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return (
    <div
      ref={ref}
      className="preview-info"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!pinned && !ref.current?.contains(document.activeElement))
          setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setPinned(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          setPinned(false);
        }
      }}
    >
      <button
        type="button"
        className="preview-info-trigger"
        aria-label="About this preview"
        aria-expanded={open}
        aria-controls={id}
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onClick={() => {
          setPinned(!pinned);
          setOpen(!pinned);
        }}
      >
        ⓘ
      </button>
      <div id={id} className="preview-info-content" hidden={!open} role="note">
        {children}
      </div>
    </div>
  );
}
export function PreviewHeading({
  title,
  intro,
  children,
  inlineInfo = false,
}: {
  title: string;
  intro: string;
  children: ReactNode;
  inlineInfo?: boolean;
}) {
  return (
    <header className="preview-heading">
      {inlineInfo ? (
        <div className="entry-title">
          <h1>{title}</h1>
          <PreviewInfo>{children}</PreviewInfo>
        </div>
      ) : (
        <h1>{title}</h1>
      )}
      <p>{intro}</p>
      {!inlineInfo ? <PreviewInfo>{children}</PreviewInfo> : null}
    </header>
  );
}
type LocalImage = { url: string; name: string } | null;
function ImagePicker({
  label,
  image,
  setImage,
}: {
  label: string;
  image: LocalImage;
  setImage: (image: LocalImage) => void;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const version = useRef(0);
  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image.url);
    },
    [image],
  );
  useEffect(
    () => () => {
      version.current++;
    },
    [],
  );
  async function choose(file?: File) {
    const current = ++version.current;
    setError("");
    if (!file) return;
    const invalid = validatePreviewImage(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const decoded = new Image();
      decoded.src = url;
      await decoded.decode();
      if (current !== version.current) {
        URL.revokeObjectURL(url);
        return;
      }
      setImage({ url, name: file.name });
    } catch {
      URL.revokeObjectURL(url);
      if (current === version.current)
        setError("This image could not be opened. Choose another image.");
    }
  }
  return (
    <div className="preview-image-picker">
      {image ? (
        <>
          <img
            className="preview-local-image"
            src={image.url}
            alt={
              label === "Photo" ? "Applicant photo preview" : "Evidence preview"
            }
          />
          <span className="preview-image-name">{image.name}</span>
        </>
      ) : label === "Photo" ? (
        <span className="preview-photo-empty" aria-hidden="true">
          +
        </span>
      ) : null}
      <div className="preview-image-actions">
        <Button
          type="button"
          variant="outline"
          onClick={() => input.current?.click()}
        >
          {label === "Photo" ? "Choose photo" : "Attach image"}
        </Button>
        {image ? (
          <Button
            type="button"
            variant="tertiary"
            onClick={() => {
              version.current++;
              setImage(null);
              setError("");
            }}
          >
            Remove image
          </Button>
        ) : null}
      </div>
      <input
        ref={input}
        id={id}
        className="sr-only"
        tabIndex={-1}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        aria-label={label}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => {
          void choose(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
function PreviewResult({
  title,
  facts,
  image,
  onEdit,
}: {
  title: string;
  facts: [string, string][];
  image?: LocalImage;
  onEdit: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="preview-result" ref={ref} tabIndex={-1}>
      <h2>{title}</h2>
      {image ? (
        <img
          className="preview-local-image"
          src={image.url}
          alt="Selected image preview"
        />
      ) : null}
      <dl className="identity-preview-facts">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "Not provided"}</dd>
          </div>
        ))}
      </dl>
      <Button type="button" variant="outline" onClick={onEdit}>
        Edit details
      </Button>
    </div>
  );
}
function validateRequiredText(form: HTMLFormElement) {
  for (const control of form.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement
  >("input[required], textarea[required]")) {
    control.setCustomValidity(
      control.value.trim() ? "" : "Enter a value for this field.",
    );
  }
  return form.reportValidity();
}
function Field({
  label,
  name,
  type = "text",
  required = false,
  wide = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <div className={wide ? "preview-field-wide" : undefined}>
      <FieldLabel htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </FieldLabel>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={type === "text" ? 180 : undefined}
        max={
          type === "date" ? new Date().toLocaleDateString("en-CA") : undefined
        }
      />
    </div>
  );
}
export function ApplicantRecoveryPreview() {
  const [facts, setFacts] = useState<[string, string][] | null>(null);
  return (
    <section className="preview-recovery-section">
      <h2>Applicant</h2>
      <form
        className="preview-form"
        autoComplete="off"
        onInput={(event) => {
          const target = event.target;
          if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement
          )
            target.setCustomValidity("");
        }}
        onSubmit={(event) => {
          event.preventDefault();
          if (!validateRequiredText(event.currentTarget)) return;
          setFacts([
            ["To", String(new FormData(event.currentTarget).get("email"))],
            ["Subject", "Account recovery"],
            [
              "Message",
              "Your recovery email would guide you through restoring account access.",
            ],
          ]);
        }}
      >
        <Field label="Email address" name="email" type="email" required />
        <div className="preview-actions">
          <Button type="submit">Preview recovery email</Button>
        </div>
      </form>
      {facts ? (
        <PreviewResult
          title="Recovery email preview"
          facts={facts}
          onEdit={() => setFacts(null)}
        />
      ) : null}
    </section>
  );
}
export function SupportRequestPreview() {
  const form = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState<LocalImage>(null);
  const [facts, setFacts] = useState<[string, string][] | null>(null);
  return (
    <section className="preview-recovery-section">
      <h2>Student / employee</h2>
      <form
        ref={form}
        hidden={!!facts}
        className="preview-form"
        autoComplete="off"
        onInput={(event) => {
          const target = event.target;
          if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement
          )
            target.setCustomValidity("");
        }}
        onSubmit={(event) => {
          event.preventDefault();
          if (!validateRequiredText(event.currentTarget)) return;
          const data = new FormData(event.currentTarget);
          setFacts(
            ["email", "issue", "subject", "description"].map((key) => [
              {
                email: "Account email",
                issue: "Issue",
                subject: "Subject",
                description: "Description",
              }[key]!,
              String(data.get(key)).trim(),
            ]),
          );
        }}
      >
        <div className="preview-fields">
          <Field label="Account email" name="email" type="email" required />
          <div>
            <FieldLabel htmlFor="support-issue">Issue *</FieldLabel>
            <Select id="support-issue" name="issue" required defaultValue="">
              <option value="">Choose an issue</option>
              {supportIssues.map((issue) => (
                <option key={issue}>{issue}</option>
              ))}
            </Select>
          </div>
          <Field label="Subject" name="subject" required wide />
          <div className="preview-field-wide">
            <FieldLabel htmlFor="support-description">
              Describe the issue *
            </FieldLabel>
            <Textarea
              id="support-description"
              name="description"
              required
              rows={4}
              maxLength={4000}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Evidence</FieldLabel>
          <ImagePicker label="Evidence" image={image} setImage={setImage} />
        </div>
        <div className="preview-actions">
          <Button type="submit">Preview request</Button>
          <Button type="button" disabled>
            Send to administrator
          </Button>
        </div>
      </form>
      {facts ? (
        <PreviewResult
          title="Support request preview"
          facts={facts}
          image={image}
          onEdit={() => {
            setFacts(null);
            requestAnimationFrame(() =>
              form.current?.querySelector<HTMLInputElement>("input")?.focus(),
            );
          }}
        />
      ) : null}
    </section>
  );
}
