"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ListToolbar, SortControl } from "@/components/ui/list-toolbar";
import { EmptyState } from "@/components/ui/states";
import { portalCodes, portalDetails } from "@/lib/portals";
import {
  filterTechnologyAccounts,
  type TechnologyAccount,
  type TechnologyAccountFilters,
} from "./demo-data";

const initialFilters: TechnologyAccountFilters = {
  query: "",
  status: "ALL",
  portal: "ALL",
};

function AccountStatusBadge({
  status,
}: {
  status: TechnologyAccount["status"];
}) {
  return (
    <Badge tone={status === "ACTIVE" ? "success" : "neutral"}>{status}</Badge>
  );
}

function RoleSummary({ account }: { account: TechnologyAccount }) {
  const roles = [...new Set(account.memberships.flatMap((item) => item.roles))];
  return <span>{roles.length ? roles.join(", ") : "No assigned role"}</span>;
}

function MembershipSummary({ account }: { account: TechnologyAccount }) {
  if (account.memberships.length === 0) {
    return <span className="text-muted-foreground">No portal memberships</span>;
  }

  return (
    <ul className="space-y-1">
      {account.memberships.map((membership) => (
        <li
          key={membership.portal}
          className="flex flex-wrap items-center gap-2"
        >
          <span>{portalDetails[membership.portal].label}</span>
          <Badge tone={membership.status === "ACTIVE" ? "success" : "neutral"}>
            {membership.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function AccountDetails({ account }: { account: TechnologyAccount | null }) {
  if (!account) {
    return (
      <aside className="rounded-lg border border-border bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Account details</h2>
        <p className="mt-3 leading-6 text-muted-foreground">
          Select a demo account to review its account state, portal memberships,
          and assigned roles.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-labelledby="technology-account-details"
      className="min-w-0 rounded-lg border border-border bg-white p-5 sm:p-6"
    >
      <h2 id="technology-account-details" className="text-lg font-semibold">
        Account details
      </h2>
      <p className="mt-1 break-all text-sm text-muted-foreground">
        {account.email}
      </p>

      <dl className="mt-5 divide-y divide-border border-y border-border">
        <div className="grid gap-1 py-4">
          <dt className="text-sm font-semibold text-muted-foreground">
            Demo identity
          </dt>
          <dd className="break-words">{account.name}</dd>
        </div>
        <div className="grid gap-2 py-4">
          <dt className="text-sm font-semibold text-muted-foreground">
            Account status
          </dt>
          <dd>
            <AccountStatusBadge status={account.status} />
          </dd>
        </div>
        <div className="grid gap-2 py-4">
          <dt className="text-sm font-semibold text-muted-foreground">
            Portal memberships
          </dt>
          <dd>
            {account.memberships.length ? (
              <ul className="space-y-4">
                {account.memberships.map((membership) => (
                  <li key={membership.portal}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {portalDetails[membership.portal].label}
                      </span>
                      <Badge
                        tone={
                          membership.status === "ACTIVE" ? "success" : "neutral"
                        }
                      >
                        {membership.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Roles:{" "}
                      {membership.roles.length
                        ? membership.roles.join(", ")
                        : "None"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">None</span>
            )}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Account state and portal membership are separate checks. Only the
        memberships listed here grant portal context.
      </p>
    </aside>
  );
}

export function TechnologyAccountsDirectory({
  accounts,
}: {
  accounts: TechnologyAccount[];
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("email");
  const filteredAccounts = useMemo(
    () => filterTechnologyAccounts(accounts, filters),
    [accounts, filters],
  );
  const sortedAccounts = useMemo(
    () =>
      [...filteredAccounts].sort((left, right) =>
        sortOrder === "name"
          ? left.name.localeCompare(right.name) ||
            left.email.localeCompare(right.email)
          : left.email.localeCompare(right.email),
      ),
    [filteredAccounts, sortOrder],
  );
  const selectedAccount = filteredAccounts.find(
    (account) => account.email === selectedEmail,
  );

  function updateFilter<Key extends keyof TechnologyAccountFilters>(
    key: Key,
    value: TechnologyAccountFilters[Key],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <form
        className="grid gap-4 rounded-lg border border-border bg-white p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-[minmax(18rem,1fr)_13rem_15rem]"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Filter demo accounts"
      >
        <div className="min-w-0">
          <label
            htmlFor="technology-account-query"
            className="mb-2 block text-sm font-semibold"
          >
            Search accounts
          </label>
          <Input
            id="technology-account-query"
            type="search"
            autoComplete="off"
            placeholder="Email or demo identity"
            value={filters.query}
            onChange={(event) => updateFilter("query", event.target.value)}
          />
        </div>
        <div className="min-w-0">
          <label
            htmlFor="technology-account-status"
            className="mb-2 block text-sm font-semibold"
          >
            Account status
          </label>
          <Select
            id="technology-account-status"
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value as TechnologyAccountFilters["status"],
              )
            }
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DISABLED">DISABLED</option>
          </Select>
        </div>
        <div className="min-w-0">
          <label
            htmlFor="technology-account-portal"
            className="mb-2 block text-sm font-semibold"
          >
            Portal membership
          </label>
          <Select
            id="technology-account-portal"
            value={filters.portal}
            onChange={(event) =>
              updateFilter(
                "portal",
                event.target.value as TechnologyAccountFilters["portal"],
              )
            }
          >
            <option value="ALL">All portals</option>
            {portalCodes.map((portal) => (
              <option key={portal} value={portal}>
                {portalDetails[portal].label}
              </option>
            ))}
          </Select>
        </div>
      </form>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
        <section aria-labelledby="technology-accounts-list" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="technology-accounts-list" className="text-xl font-semibold">
              Demo accounts
            </h2>
          </div>

          <ListToolbar
            count={
              <p aria-live="polite">
                Showing {filteredAccounts.length} of {accounts.length} accounts
              </p>
            }
            sort={
              <SortControl
                id="technology-account-sort"
                value={sortOrder}
                onChange={setSortOrder}
                options={[
                  { value: "email", label: "Email A–Z" },
                  { value: "name", label: "Name A–Z" },
                ]}
              />
            }
          />

          {filteredAccounts.length === 0 ? (
            <EmptyState
              title="No accounts match these filters"
              description="Try a different email, identity, status, or portal."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFilters(initialFilters)}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <ul className="space-y-3 xl:hidden">
                {sortedAccounts.map((account) => (
                  <li key={account.email}>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-border bg-white p-4 text-left hover:bg-muted aria-pressed:border-primary aria-pressed:bg-primary-soft sm:p-5"
                      aria-pressed={selectedEmail === account.email}
                      aria-label={`View details for ${account.name}`}
                      onClick={() => setSelectedEmail(account.email)}
                    >
                      <span className="block break-words font-semibold">
                        {account.name}
                      </span>
                      <span className="mt-1 block break-all text-sm text-muted-foreground">
                        {account.email}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-2">
                        <AccountStatusBadge status={account.status} />
                        <span className="text-sm text-muted-foreground">
                          {account.memberships.length} memberships
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="hidden overflow-hidden rounded-lg border border-border bg-white xl:block">
                <table className="data-table">
                  <caption className="sr-only">
                    Fictional demo accounts and their access summaries
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Demo identity</th>
                      <th scope="col">Account status</th>
                      <th scope="col">Portal memberships</th>
                      <th scope="col">Role summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAccounts.map((account) => (
                      <tr
                        key={account.email}
                        aria-selected={selectedEmail === account.email}
                      >
                        <td className="min-w-48">
                          <button
                            type="button"
                            className="min-h-11 text-left text-primary underline decoration-transparent underline-offset-4 hover:decoration-current"
                            aria-label={`View details for ${account.name}`}
                            aria-pressed={selectedEmail === account.email}
                            onClick={() => setSelectedEmail(account.email)}
                          >
                            <span className="block font-semibold">
                              {account.name}
                            </span>
                            <span className="mt-1 block break-all text-sm text-muted-foreground">
                              {account.email}
                            </span>
                          </button>
                        </td>
                        <td>
                          <AccountStatusBadge status={account.status} />
                        </td>
                        <td>
                          <MembershipSummary account={account} />
                        </td>
                        <td className="break-words">
                          <RoleSummary account={account} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <AccountDetails account={selectedAccount ?? null} />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        This directory does not assign roles, change account state, or alter
        memberships.
      </p>
    </div>
  );
}
