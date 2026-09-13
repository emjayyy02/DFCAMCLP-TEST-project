"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { FormSection } from "@/components/ui/form-section";

const portalOptions = [
  "Applicant",
  "Student",
  "Academic",
  "Admissions & Records",
  "Operations",
  "Technology",
] as const;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.replace("/account");
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
          defaultValue=""
          className="mt-2"
        >
          <option value="" disabled>
            Select a portal
          </option>
          {portalOptions.map((portal) => (
            <option key={portal} value={portal}>
              {portal}
            </option>
          ))}
        </Select>
        <p
          id="portal-help"
          className="mt-2 text-sm leading-6 text-muted-foreground"
        >
          This selection is context only. Portal access is not evaluated yet.
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
            aria-describedby="email-help"
            name="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            required
            className="mt-2"
          />
          <p
            id="email-help"
            className="mt-2 text-sm leading-6 text-muted-foreground"
          >
            Institutional username rules are intentionally deferred.
          </p>
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
