"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ListToolbar, SortControl } from "@/components/ui/list-toolbar";
import { SortableHeader } from "@/components/ui/sortable-header";
import { EmptyState } from "@/components/ui/states";
import { IdentitySummary } from "@/components/ui/identity";
import { portalCodes, portalDetails } from "@/lib/portals";
import {
  filterTechnologyAccounts,
  sortTechnologyAccounts,
  type TechnologyAccount,
  type TechnologyAccountFilters,
  type TechnologyAccountSort,
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
  const membershipsWithRoles = account.memberships.filter(
    (membership) => membership.roles.length > 0,
  );

  return membershipsWithRoles.length ? (
    <ul className="space-y-1">
      {membershipsWithRoles.map((membership) => (
        <li key={membership.portal}>
          <span className="text-muted-foreground">
            {portalDetails[membership.portal].label}:
          </span>
          {membership.roles.join(", ")}
        </li>
      ))}
    </ul>
  ) : (
    <span>No assigned role</span>
  );
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

function AccountDetails({
  account,
  headingId,
}: {
  account: TechnologyAccount | null;
  headingId: string;
}) {
  if (!account) {
    return (
      <aside
        aria-labelledby={headingId}
        className="rounded-lg border border-border bg-white p-5 sm:p-6"
      >
        <h2 id={headingId} className="text-lg font-semibold">
          Account details
        </h2>
        <p className="mt-3 leading-6 text-muted-foreground">
          Select a demo account to review its account state, portal memberships,
          and assigned roles.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-labelledby={headingId}
      className="min-w-0 rounded-lg border border-border bg-white p-5 sm:p-6"
    >
      <h2 id={headingId} className="mb-4 text-lg font-semibold">
        Account details
      </h2>
      <IdentitySummary name={account.name} detail={account.email} />

      <dl className="mt-5 divide-y divide-border border-y border-border">
        <div className="grid gap-2 py-4">
          <dt className="text-sm font-semibold text-muted-foreground">
            Account state
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
        Access requires an active application account linked to a project
        Person, an active membership in the portal, and a role permitted to open
        the requested page.
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
  const [sortOrder, setSortOrder] = useState<TechnologyAccountSort>("name");
  const [reverse, setReverse] = useState(false);
  function chooseSort(next: TechnologyAccountSort) {
    setSortOrder(next);
    setReverse(false);
  }
  function sortColumn(column: TechnologyAccountSort) {
    if (sortOrder === column) setReverse((current) => !current);
    else chooseSort(column);
  }
  const filteredAccounts = useMemo(
    () => filterTechnologyAccounts(accounts, filters),
    [accounts, filters],
  );
  const sortedAccounts = useMemo(() => {
    const sorted = sortTechnologyAccounts(filteredAccounts, sortOrder);
    return reverse ? sorted.toReversed() : sorted;
  }, [filteredAccounts, sortOrder, reverse]);
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
    <div className="technology-directory space-y-6">
      <form
        className="technology-directory-filters grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-[minmax(18rem,1fr)_13rem_15rem]"
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

      <div className="technology-account-layout min-w-0">
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
                className="table-mobile-sort"
                value={sortOrder}
                onChange={(value) => chooseSort(value as TechnologyAccountSort)}
                direction={reverse ? "descending" : "ascending"}
                onDirectionChange={() => setReverse((current) => !current)}
                options={[
                  { value: "name", label: "Name" },
                  { value: "email", label: "Email" },
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
              <ul className="technology-account-list">
                {sortedAccounts.map((account) => (
                  <li key={account.email}>
                    <button
                      type="button"
                      className="technology-account-row"
                      aria-pressed={selectedEmail === account.email}
                      aria-label={`View details for ${account.name}`}
                      onClick={() => setSelectedEmail(account.email)}
                    >
                      <span className="block break-words font-semibold">
                        {account.name}
                      </span>
                      <span className="mt-1 block break-words text-sm text-muted-foreground">
                        {account.email}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-2">
                        <AccountStatusBadge status={account.status} />
                        <span className="text-sm text-muted-foreground">
                          {account.memberships.length} memberships
                        </span>
                      </span>
                    </button>
                    {selectedEmail === account.email ? (
                      <div className="mt-3">
                        <AccountDetails
                          account={account}
                          headingId="technology-account-details-mobile"
                        />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="technology-account-table overflow-x-auto border border-border bg-white">
                <table className="data-table">
                  <caption className="sr-only">
                    Fictional demo accounts and their access summaries
                  </caption>
                  <thead>
                    <tr>
                      <SortableHeader
                        label="Name"
                        direction={
                          sortOrder === "name"
                            ? reverse
                              ? "descending"
                              : "ascending"
                            : undefined
                        }
                        onSort={() => sortColumn("name")}
                      />
                      <SortableHeader
                        label="Email"
                        direction={
                          sortOrder === "email"
                            ? reverse
                              ? "descending"
                              : "ascending"
                            : undefined
                        }
                        onSort={() => sortColumn("email")}
                      />
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
                          </button>
                        </td>
                        <td className="min-w-64 break-words text-sm text-muted-foreground">
                          {account.email}
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

        <div className="technology-account-rail">
          <AccountDetails
            account={selectedAccount ?? null}
            headingId="technology-account-details-desktop"
          />
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        This directory does not assign roles, change account state, or alter
        memberships.
      </p>
    </div>
  );
}
