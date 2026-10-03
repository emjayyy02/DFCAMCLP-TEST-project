"use client";
import Link from "next/link";
import { useRef } from "react";
import type { PortalCode } from "@/lib/portals";
import { Avatar, IdentitySummary } from "@/components/ui/identity";
import { useAccountPresentation } from "./demo-presentation-provider";
import { SignOutButton } from "./sign-out-button";
import { AboutDemoButton } from "@/features/disclosure/demo-disclosure-provider";

export type MembershipSummary = {
  portal: PortalCode;
  label: string;
  path: string;
  roleLabels: string[];
};
export type AccountNavigation = {
  user: { id: string; name: string; email: string };
  currentPortal: PortalCode | null;
  memberships: MembershipSummary[];
};

export function AccountMenu({
  user,
  currentPortal,
  memberships,
}: AccountNavigation) {
  const { photo } = useAccountPresentation(user.id);
  const menu = useRef<HTMLDetailsElement>(null);
  function close() {
    if (menu.current) menu.current.open = false;
  }
  const current = memberships.find(
    (membership) => membership.portal === currentPortal,
  );
  const profile = current ? `${current.path}/profile` : null;
  return (
    <details
      ref={menu}
      className="account-menu group relative"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          close();
          menu.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary className="account-trigger flex min-h-11 cursor-pointer list-none items-center rounded-md border border-input px-3 text-[15px] font-semibold text-foreground hover:bg-muted">
        <Avatar name={user.name} src={photo} size="small" />
        <span className="account-trigger-label">Account</span>
      </summary>
      <div className="portal-popover absolute right-0 z-30 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-lg bg-surface-elevated p-3 shadow-elevated">
        {profile ? (
          <Link
            href={profile}
            onClick={close}
            aria-label={`View profile for ${user.name}`}
            className="account-identity-link border-b border-border px-2 pb-3"
          >
            <IdentitySummary
              name={user.name}
              detail={user.email}
              src={photo}
              size="small"
            />
          </Link>
        ) : (
          <IdentitySummary
            name={user.name}
            detail={user.email}
            src={photo}
            size="small"
          />
        )}
        {profile ? (
          <Link
            href={profile}
            onClick={close}
            className="navigation-item mt-2 font-medium"
          >
            View profile
          </Link>
        ) : (
          <p className="px-2 py-3 text-sm">No authorized portal access.</p>
        )}
        {memberships.length > 1 ? (
          <section className="account-menu-portals" aria-label="Switch portal">
            <p className="px-3 py-2 text-sm font-semibold">Switch portal</p>
            {memberships.map((membership) => (
              <Link
                key={membership.portal}
                href={membership.path}
                onClick={close}
                className="navigation-item text-sm"
                aria-current={
                  membership.portal === currentPortal ? "page" : undefined
                }
              >
                {membership.label}
              </Link>
            ))}
          </section>
        ) : null}
        <AboutDemoButton
          className="navigation-item w-full font-medium"
          onOpen={close}
          focusTarget={() => menu.current?.querySelector("summary") ?? null}
        />
        <SignOutButton className="mt-1 w-full" variant="ghost" />
      </div>
    </details>
  );
}
