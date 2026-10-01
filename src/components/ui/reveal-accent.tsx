"use client";

import { useEffect, useRef, type ReactNode } from "react";

const visited = new Set<string>();

/** Only the decorative line animates. All editorial content is visible at t=0. */
export function RevealAccent({
  kind,
  children,
}: {
  kind: "journey" | "history";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const key = `${location.pathname}:${kind}`;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const restored =
      (
        performance.getEntriesByType("navigation")[0] as
          PerformanceNavigationTiming | undefined
      )?.type === "back_forward";
    if (
      visited.has(key) ||
      media.matches ||
      location.hash ||
      restored ||
      scrollY > 0
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        visited.add(key);
        if (!media.matches && !node.contains(document.activeElement))
          node.dataset.reveal = "true";
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    function settle() {
      node!.removeAttribute("data-reveal");
      observer.disconnect();
      visited.add(key);
    }
    observer.observe(node);
    media.addEventListener("change", settle);
    node.addEventListener("focusin", settle);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", settle);
      node.removeEventListener("focusin", settle);
    };
  }, [kind]);
  return (
    <div ref={ref} className={`reveal-accent reveal-${kind}`}>
      {children}
    </div>
  );
}
