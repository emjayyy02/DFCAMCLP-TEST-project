"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const links = [
  ["/", "Home"],
  ["/programs", "Programs"],
  ["/admissions", "Admissions"],
  ["/about", "About"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  function closeMenu(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }
  return (
    <header
      className="public-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) closeMenu(true);
      }}
    >
      <div className="public-container header-inner">
        <Link
          href="/"
          className="site-identity"
          aria-label="DFCAMCLP home"
          onClick={() => closeMenu()}
        >
          <Image
            src="/images/dfcamclp-seal.webp"
            alt=""
            width={56}
            height={56}
            unoptimized
          />
          <span>
            <strong>DFCAMCLP</strong>
            <span>Student &amp; Employee Portal</span>
          </span>
        </Link>
        <button
          ref={trigger}
          type="button"
          className="public-menu-trigger"
          aria-expanded={open}
          aria-controls="public-navigation"
          onClick={() => setOpen(!open)}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
            />
          </svg>
          {open ? "Close" : "Menu"}
        </button>
        <nav
          id="public-navigation"
          aria-label="Public navigation"
          className="public-navigation"
          data-open={open}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => closeMenu()}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
