import { describe, expect, it, vi } from "vitest";
import { publicDemoAccounts } from "../features/identity/public-demo-accounts";
import { membershipSeed } from "../server/access-control/seed-data";
import { developmentAuthAccountSeed } from "../server/db/seed/data";
import { portalDetails } from "../lib/portals";

vi.mock("server-only", () => ({}));

describe("public demo account presentation boundary", () => {
  it("exposes exactly the nine existing fictional account emails", () => {
    expect(publicDemoAccounts).toHaveLength(9);
    expect(
      new Set(publicDemoAccounts.map((account) => account.email)).size,
    ).toBe(9);
    expect(publicDemoAccounts.map((account) => account.email).sort()).toEqual(
      developmentAuthAccountSeed.map((account) => account.email).sort(),
    );
    expect(
      publicDemoAccounts.every((account) =>
        account.email.endsWith("@example.invalid"),
      ),
    ).toBe(true);
  });

  it("projects only the approved public fields", () => {
    for (const account of publicDemoAccounts) {
      expect(Object.keys(account).sort()).toEqual([
        "email",
        "label",
        "portals",
      ]);
    }
  });

  it("uses the existing membership model for portal labels", () => {
    for (const account of publicDemoAccounts) {
      expect(account.portals).toEqual(
        membershipSeed
          .filter((membership) => membership.email === account.email)
          .map((membership) => portalDetails[membership.portal].label),
      );
    }
  });

  it("keeps IT Admin distinct from the two-portal Faculty + Developer", () => {
    expect(
      publicDemoAccounts.find(
        (account) => account.email === "technology.test@example.invalid",
      ),
    ).toMatchObject({ label: "IT Admin", portals: ["Technology"] });
    expect(
      publicDemoAccounts.find(
        (account) => account.email === "faculty-it.test@example.invalid",
      ),
    ).toMatchObject({
      label: "Faculty + Developer",
      portals: ["Academic", "Technology"],
    });
  });
});
