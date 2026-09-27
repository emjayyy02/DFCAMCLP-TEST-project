import { describe, expect, it } from "vitest";
import {
  filterTechnologyAccounts,
  groupTechnologyAccountRows,
  summarizeTechnologyAccounts,
  type TechnologyAccountRow,
} from "../features/technology/demo-data";

const accountRows: TechnologyAccountRow[] = [
  {
    name: "Ari Sample",
    email: "ari.sample@example.invalid",
    accountStatus: "ACTIVE",
    portal: "TECHNOLOGY",
    membershipActive: true,
    roleLabel: "IT Admin",
  },
  {
    name: "Ari Sample",
    email: "ari.sample@example.invalid",
    accountStatus: "ACTIVE",
    portal: "TECHNOLOGY",
    membershipActive: true,
    roleLabel: "Developer",
  },
  {
    name: "Ari Sample",
    email: "ari.sample@example.invalid",
    accountStatus: "ACTIVE",
    portal: "STUDENT",
    membershipActive: false,
    roleLabel: "Student",
  },
  {
    name: "Bea Sample",
    email: "bea.sample@example.invalid",
    accountStatus: "DISABLED",
    portal: "STUDENT",
    membershipActive: true,
    roleLabel: "Student",
  },
  {
    name: "No Portal Sample",
    email: "no.portal@example.invalid",
    accountStatus: "ACTIVE",
    portal: null,
    membershipActive: null,
    roleLabel: null,
  },
];

describe("Technology account directory data", () => {
  it("groups role rows while keeping account and membership state separate", () => {
    const accounts = groupTechnologyAccountRows(accountRows);

    expect(accounts).toHaveLength(3);
    expect(accounts[0]).toMatchObject({
      name: "Ari Sample",
      email: "ari.sample@example.invalid",
      status: "ACTIVE",
      memberships: [
        {
          portal: "STUDENT",
          status: "INACTIVE",
          roles: ["Student"],
        },
        {
          portal: "TECHNOLOGY",
          status: "ACTIVE",
          roles: ["IT Admin", "Developer"],
        },
      ],
    });
    expect(accounts[1]).toMatchObject({
      name: "Bea Sample",
      status: "DISABLED",
      memberships: [{ portal: "STUDENT", status: "ACTIVE" }],
    });
    expect(accounts[2]).toMatchObject({
      name: "No Portal Sample",
      status: "ACTIVE",
      memberships: [],
    });
  });

  it("filters by identity, account status, and portal membership", () => {
    const accounts = groupTechnologyAccountRows(accountRows);

    expect(
      filterTechnologyAccounts(accounts, {
        query: " ARI.SAMPLE ",
        status: "ACTIVE",
        portal: "TECHNOLOGY",
      }).map((account) => account.email),
    ).toEqual(["ari.sample@example.invalid"]);
    expect(
      filterTechnologyAccounts(accounts, {
        query: "",
        status: "DISABLED",
        portal: "STUDENT",
      }).map((account) => account.email),
    ).toEqual(["bea.sample@example.invalid"]);
    expect(
      filterTechnologyAccounts(accounts, {
        query: "",
        status: "ALL",
        portal: "TECHNOLOGY",
      }).map((account) => account.email),
    ).toEqual(["ari.sample@example.invalid"]);
  });

  it("summarizes accounts without counting roles as extra memberships", () => {
    expect(
      summarizeTechnologyAccounts(groupTechnologyAccountRows(accountRows)),
    ).toEqual({
      total: 3,
      active: 2,
      disabled: 1,
      memberships: 3,
    });
  });
});
