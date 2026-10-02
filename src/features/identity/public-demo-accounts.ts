import "server-only";

import { portalDetails } from "../../lib/portals";
import {
  membershipSeed,
  roleSeed,
} from "../../server/access-control/seed-data";

export type DemoAccountOption = {
  email: string;
  label: string;
  portals: string[];
};

// Public presentation allowlist only. It cannot authorize or enumerate live users.
const demoEmails = [
  "applicant.test@example.invalid",
  "student.test@example.invalid",
  "faculty.test@example.invalid",
  "coordinator.test@example.invalid",
  "records.test@example.invalid",
  "operations.test@example.invalid",
  "school-admin.test@example.invalid",
  "technology.test@example.invalid",
  "faculty-it.test@example.invalid",
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
      label: labels.join(" + "),
      portals: memberships.map(
        (membership) => portalDetails[membership.portal].label,
      ),
    };
  },
);
