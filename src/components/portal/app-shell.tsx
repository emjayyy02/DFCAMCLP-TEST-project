"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import type { PortalCode } from "@/lib/portals";
import { portalDetails } from "@/lib/portals";
import type { NavigationItem } from "@/server/access-control/navigation";
import { SignOutButton } from "@/features/identity/sign-out-button";
import { cn } from "@/lib/utils";
import { IdentitySummary } from "@/components/ui/identity";

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
  navigationTools?: ReactNode;
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
            <li
              key={item.path}
              className={
                item.sectionStart
                  ? "mt-6 border-t border-border pt-4"
                  : undefined
              }
            >
              <Link
                href={item.path}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "navigation-item text-foreground transition-colors",
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
      <summary className="account-trigger flex min-h-11 cursor-pointer list-none items-center rounded-md border border-input px-3 text-[15px] font-semibold text-foreground hover:bg-muted">
        Account
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-lg bg-surface-elevated p-3 shadow-elevated">
        <div className="border-b border-border px-2 pb-3">
          <IdentitySummary name={user.name} detail={user.email} size="small" />
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
  navigationTools,
}: Pick<
  AppShellProps,
  "currentPortal" | "memberships" | "navigation" | "navigationTools"
>) {
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
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((element) => element.getClientRects().length > 0);
          const first = focusable[0];
          const last = focusable.at(-1);
          if (!first || !last) return;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        className="portal-drawer m-0 h-dvh max-h-none w-[min(88vw,20rem)] max-w-none bg-surface p-0 text-foreground"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex min-h-16 items-center justify-between border-b border-border px-5">
            <div className="portal-identity">
              <p id="mobile-navigation-title" className="portal-identity-title">
                {portalDetails[currentPortal].label}
              </p>
              {memberships
                .find((membership) => membership.portal === currentPortal)
                ?.roleLabels.join(", ") !==
              portalDetails[currentPortal].label ? (
                <p className="portal-identity-role">
                  {memberships
                    .find((membership) => membership.portal === currentPortal)
                    ?.roleLabels.join(", ")}
                </p>
              ) : null}
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
            {navigationTools ? (
              <div className="mb-5 border-b border-border pb-5">
                {navigationTools}
              </div>
            ) : null}
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
  navigationTools,
  user,
}: AppShellProps) {
  const currentMembership = memberships.find(
    (membership) => membership.portal === currentPortal,
  );
  const portalLabel = portalDetails[currentPortal].label;
  const roleSummary = currentMembership?.roleLabels.join(", ");

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-surface focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:p-3"
      >
        Skip to content
      </a>
      <header className="institution-masthead">
        <div className="shell-width mx-auto flex min-h-16 w-full flex-wrap items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6 lg:px-8">
          <MobileDrawer
            currentPortal={currentPortal}
            memberships={memberships}
            navigation={navigation}
            navigationTools={navigationTools}
          />
          <Link
            href={`/${portalDetails[currentPortal].slug}`}
            className="flex min-h-11 min-w-0 flex-1 items-center gap-2 lg:flex-none"
          >
            <Image
              src="/images/dfcamclp-seal.webp"
              alt=""
              width={40}
              height={40}
              unoptimized
              className="h-10 w-10 shrink-0 object-contain"
            />
            <span className="flex min-w-0 flex-col justify-center">
              <span className="institution-wordmark">DFCAMCLP</span>
              <span className="institution-portal-label">
                {portalDetails[currentPortal].label} portal
              </span>
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
      <div className="shell-width mx-auto grid min-h-[calc(100vh-4.0625rem)] w-full lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="portal-sidebar hidden border-r border-border-strong bg-surface px-4 py-6 lg:block">
          <div className="portal-identity mb-6 border-b border-border-strong pb-4">
            <p className="portal-identity-title">{portalLabel}</p>
            {roleSummary && roleSummary !== portalLabel ? (
              <p className="portal-identity-role">{roleSummary}</p>
            ) : null}
          </div>
          {navigationTools ? (
            <div className="mb-5 border-b border-border pb-5">
              {navigationTools}
            </div>
          ) : null}
          <Navigation items={navigation} />
        </aside>
        <div className="min-w-0">
          <main
            id="main"
            className="portal-main px-4 pt-6 pb-8 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12"
          >
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
