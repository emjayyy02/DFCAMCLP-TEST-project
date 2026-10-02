"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ProjectInformationHeading({ title }: { title: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [pathname, title]);

  return (
    <h1 ref={heading} tabIndex={-1}>
      {title}
    </h1>
  );
}
