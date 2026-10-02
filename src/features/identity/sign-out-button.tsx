"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { usePresentationStore } from "./demo-presentation-provider";

export function SignOutButton({
  className,
  variant = "outline",
}: {
  className?: string;
  variant?: "outline" | "ghost";
} = {}) {
  const router = useRouter();
  const presentation = usePresentationStore();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  async function signOut() {
    if (isPending) return;
    setError(null);
    setIsPending(true);
    try {
      const result = await authClient.signOut();
      if (result.error || result.data?.success !== true) {
        setError("Sign-out could not be confirmed. Please try again.");
        return;
      }
      presentation.clear();
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Sign-out could not be confirmed. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-w-0">
      <Button
        type="button"
        disabled={isPending}
        aria-busy={isPending}
        aria-describedby={error ? errorId : undefined}
        className={className}
        variant={variant}
        onClick={signOut}
      >
        {isPending ? "Signing out…" : "Sign out"}
      </Button>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 max-w-xs text-sm leading-5 text-destructive-foreground"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
