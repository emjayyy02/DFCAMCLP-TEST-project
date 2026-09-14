"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalCode } from "@/lib/portals";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { FormSection } from "@/components/ui/form-section";

const portalOptions = [
  { value: "APPLICANT", label: "Applicant" },
  { value: "STUDENT", label: "Student" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "RECORDS", label: "Admissions & Records" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "TECHNOLOGY", label: "Technology" },
] as const satisfies readonly { value: PortalCode; label: string }[];

export function LoginForm({ defaultPortal = "" }: { defaultPortal?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            id="email"
            name="email"
            type="email"
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
              className="pr-20"
            />
            <button
              type="button"
              aria-pressed={showPassword}
              aria-controls="password"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 min-h-11 min-w-16 rounded-md px-3 text-sm font-semibold text-primary hover:bg-primary-soft"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </FormSection>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
