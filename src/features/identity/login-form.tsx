"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalCode } from "@/lib/portals";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { FormSection } from "@/components/ui/form-section";
import { DemoAccountsPanel } from "./demo-accounts-panel";
import type { DemoAccountOption } from "./public-demo-accounts";

const portalOptions = [
  { value: "APPLICANT", label: "Applicant" },
  { value: "STUDENT", label: "Student" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "RECORDS", label: "Admissions & Records" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "TECHNOLOGY", label: "Technology" },
] as const satisfies readonly { value: PortalCode; label: string }[];

export function LoginForm({
  defaultPortal = "",
  demoAccounts,
}: {
  defaultPortal?: string;
  demoAccounts: readonly DemoAccountOption[];
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailInput = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const portal = String(form.get("portal") ?? "");
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const response = await fetch("/api/portal-login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, portal }),
      });
      const result = (await response.json()) as {
        message?: string;
        redirectTo?: string;
      };
      if (!response.ok || !result.redirectTo) {
        setError(
          result.message ?? "Sign in could not be completed. Try again.",
        );
        return;
      }

      router.replace(result.redirectTo);
      router.refresh();
    } catch {
      setError("Sign in is unavailable right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="mt-7 space-y-5"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      {error ? (
        <Alert role="alert" tone="destructive">
          {error}
        </Alert>
      ) : null}

      <div>
        <label htmlFor="portal" className="block text-sm font-semibold">
          Portal
        </label>
        <Select
          id="portal"
          aria-describedby="portal-help"
          name="portal"
          required
          defaultValue={defaultPortal}
          className="mt-2"
        >
          <option value="" disabled>
            Select a portal
          </option>
          {portalOptions.map((portal) => (
            <option key={portal.value} value={portal.value}>
              {portal.label}
            </option>
          ))}
        </Select>
        <p
          id="portal-help"
          className="mt-2 text-sm leading-6 text-muted-foreground"
        >
          Use a portal your account has access to.
        </p>
      </div>

      <FormSection>
        <legend className="sr-only">Sign-in details</legend>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold">
            Email address
          </label>
          <Input
            ref={emailInput}
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="username"
            inputMode="email"
            required
            className="mt-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <div className="relative mt-2">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={12}
              className="pr-14"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="password"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-1 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-md text-primary hover:bg-primary-soft focus-visible:outline-offset-2"
            >
              {showPassword ? (
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A11.7 11.7 0 0 1 12 5c5 0 8.5 4.7 9.5 7-.4.9-1.2 2-2.3 3" />
                  <path d="M6.2 6.2C4.2 7.5 2.9 9.5 2.5 12c.9 2.3 4.5 7 9.5 7 1 0 2-.2 2.9-.5" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </FormSection>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <DemoAccountsPanel
        accounts={demoAccounts}
        onUseEmail={(email) => {
          if (!emailInput.current) return;
          emailInput.current.value = email;
          emailInput.current.focus();
        }}
      />
    </form>
  );
}
