"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { PortalCode } from "@/lib/portals";
import { portalDetails } from "@/lib/portals";
import type { NavigationItem } from "@/server/access-control/navigation";
import { SignOutButton } from "@/features/identity/sign-out-button";
import { cn } from "@/lib/utils";

type MembershipSummary = {
  portal: PortalCode;
  label: string;
  path: string;
  roleLabels: string[];
};

type AppShellProps = {
  children: React.ReactNode;
  currentPortal: PortalCode;
  memberships: MembershipSummary[];
  navigation: NavigationItem[];
  user: { name: string; email: string };
};

function Navigation({
  items,
  onNavigate,
}: {
  items: NavigationItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Portal navigation">
      <ul className="space-y-1">
        {items.map((item) => {
          const isCurrent = pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "navigation-item font-medium text-foreground transition-colors",
                  isCurrent && "font-semibold",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function PortalSwitcher({
  currentPortal,
  memberships,
}: Pick<AppShellProps, "currentPortal" | "memberships">) {
  if (memberships.length < 2) return null;

  return (
    <details className="group relative hidden md:block">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-sm font-semibold text-foreground hover:bg-muted">
        Switch portal
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="m6 8 4 4 4-4" />
        </svg>
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-64 rounded-lg bg-surface-elevated p-2 shadow-elevated">
        <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Authorized portals
        </p>
        <ul>
          {memberships.map((membership) => (
            <li key={membership.portal}>
              <Link
                href={membership.path}
                aria-current={
                  membership.portal === currentPortal ? "page" : undefined
                }
                className="navigation-item justify-between gap-3 text-sm font-medium"
              >
                <span>{membership.label}</span>
                {membership.portal === currentPortal ? (
                  <span className="text-xs text-primary-hover">Current</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function UserMenu({ user }: Pick<AppShellProps, "user">) {
  return (
    <details className="group relative">
      <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-md px-3 text-sm font-semibold text-foreground hover:bg-muted">
        <span className="hidden sm:inline">Account</span>
        <span className="sm:hidden">Menu</span>
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-lg bg-surface-elevated p-3 shadow-elevated">
        <div className="border-b border-border px-2 pb-3">
          <p className="font-semibold break-words">{user.name}</p>
          <p className="mt-1 text-sm text-muted-foreground break-all">
            {user.email}
          </p>
        </div>
        <Link href="/account" className="navigation-item mt-2 font-medium">
          Account
        </Link>
        <SignOutButton className="mt-1 w-full" variant="ghost" />
      </div>
    </details>
  );
}

function MobileDrawer({
  currentPortal,
  memberships,
  navigation,
}: Pick<AppShellProps, "currentPortal" | "memberships" | "navigation">) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeDrawer() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open portal navigation"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-primary-hover hover:bg-primary-soft lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-navigation-title"
        onClose={() => triggerRef.current?.focus()}
        className="m-0 h-dvh max-h-none w-[min(88vw,20rem)] max-w-none bg-surface p-0 text-foreground backdrop:bg-slate-950/45"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex min-h-16 items-center justify-between border-b border-border px-5">
            <div>
              <p id="mobile-navigation-title" className="font-semibold">
                {portalDetails[currentPortal].label}
              </p>
              <p className="text-xs text-muted-foreground">Portal navigation</p>
            </div>
            <button
              type="button"
              aria-label="Close portal navigation"
              onClick={closeDrawer}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-primary-hover hover:bg-primary-soft"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <Navigation items={navigation} onNavigate={closeDrawer} />
            {memberships.length > 1 ? (
              <section
                aria-labelledby="mobile-portals-title"
                className="mt-7 border-t border-border pt-5"
              >
                <h2
                  id="mobile-portals-title"
                  className="px-3 text-sm font-semibold"
                >
                  Switch portal
                </h2>
                <ul className="mt-2 space-y-1">
                  {memberships.map((membership) => (
                    <li key={membership.portal}>
                      <Link
                        href={membership.path}
                        onClick={closeDrawer}
                        aria-current={
                          membership.portal === currentPortal
                            ? "page"
                            : undefined
                        }
                        className="navigation-item justify-between gap-3 text-sm font-medium"
                      >
                        <span>{membership.label}</span>
                        {membership.portal === currentPortal ? (
                          <span className="text-xs text-primary-hover">
                            Current
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <div className="border-t border-border p-4">
            <Link
              href="/account"
              onClick={closeDrawer}
              className="navigation-item font-medium"
            >
              Account
            </Link>
            <SignOutButton className="mt-1 w-full" variant="ghost" />
          </div>
        </div>
      </dialog>
    </>
  );
}

export function AppShell({
  children,
  currentPortal,
  memberships,
  navigation,
  user,
}: AppShellProps) {
  const currentMembership = memberships.find(
    (membership) => membership.portal === currentPortal,
  );

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-surface focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:p-3"
      >
        Skip to content
      </a>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 w-full max-w-[100rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <MobileDrawer
            currentPortal={currentPortal}
            memberships={memberships}
            navigation={navigation}
          />
          <Link
            href={`/${portalDetails[currentPortal].slug}`}
            className="flex min-h-11 min-w-0 flex-1 flex-col justify-center lg:flex-none"
          >
            <span className="truncate font-semibold tracking-wide text-primary-hover">
              DFCAMCLP
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {portalDetails[currentPortal].label} portal
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <PortalSwitcher
              currentPortal={currentPortal}
              memberships={memberships}
            />
            <UserMenu user={user} />
          </div>
        </div>
      </header>
      <div className="mx-auto grid min-h-[calc(100vh-4.0625rem)] w-full max-w-[100rem] lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-border bg-surface px-5 py-7 lg:block">
          <div className="mb-6 border-b border-border pb-5">
            <p className="font-semibold">
              {portalDetails[currentPortal].label}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {currentMembership?.roleLabels.join(", ")}
            </p>
          </div>
          <Navigation items={navigation} />
        </aside>
        <div className="min-w-0">
          <main id="main" className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            {children}
          </main>
          <footer className="border-t border-border px-5 py-6 text-sm leading-6 text-muted-foreground sm:px-8 lg:px-10">
            <p className="max-w-3xl">
              Unofficial concept project for educational and portfolio purposes.
              Not affiliated with or endorsed by DFCAMCLP.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
