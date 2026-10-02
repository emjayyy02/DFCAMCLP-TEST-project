import "server-only";
import { developmentAuthAccountSeed } from "../../server/db/seed/data";

import { portalDetails } from "../../lib/portals";
import {
  membershipSeed,
  roleSeed,
} from "../../server/access-control/seed-data";

export type DemoAccountOption = {
  email: string;
  name: string;
  label: string;
  portals: string[];
};

// Public presentation allowlist only. It cannot authorize or enumerate live users.
const demoEmails = [
  developmentAuthAccountSeed[1].email,
  developmentAuthAccountSeed[0].email,
  developmentAuthAccountSeed[2].email,
  developmentAuthAccountSeed[6].email,
  developmentAuthAccountSeed[3].email,
  developmentAuthAccountSeed[4].email,
  developmentAuthAccountSeed[7].email,
  developmentAuthAccountSeed[5].email,
  developmentAuthAccountSeed[8].email,
] as const;

export const publicDemoAccounts: DemoAccountOption[] = demoEmails.map(
  (email) => {
    const memberships = membershipSeed.filter(
      (membership) => membership.email === email,
    );
    const labels = memberships.map((membership) => {
      if (membership.role === "RECORDS_STAFF")
        return portalDetails.RECORDS.label;
      return roleSeed.find((role) => role.code === membership.role)!.label;
    });
    return {
      email,
      name: developmentAuthAccountSeed.find(
        (account) => account.email === email,
      )!.name,
      label: labels.join(" + "),
      portals: memberships.map(
        (membership) => portalDetails[membership.portal].label,
      ),
    };
  },
);
