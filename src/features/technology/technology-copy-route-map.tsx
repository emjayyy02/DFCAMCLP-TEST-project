"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TechnologyCopyRouteMap({
  routes,
}: {
  routes: { label: string; path: string }[];
}) {
  const [message, setMessage] = useState("");

  async function copyRouteMap() {
    try {
      await navigator.clipboard.writeText(
        routes.map((route) => `${route.label}: ${route.path}`).join("\n"),
      );
      setMessage("Route map copied.");
    } catch {
      setMessage("Copy is unavailable in this browser.");
    }
  }

  return (
    <div className="mt-4">
      <Button type="button" variant="outline" onClick={copyRouteMap}>
        Copy available route map
      </Button>
      <p
        aria-live="polite"
        className="mt-2 min-h-6 text-sm text-muted-foreground"
      >
        {message}
      </p>
    </div>
  );
}
