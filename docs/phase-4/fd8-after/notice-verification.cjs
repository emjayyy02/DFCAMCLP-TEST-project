/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const f = {
  login: "src/app/login/page.tsx",
  create: "src/app/account/create/page.tsx",
  applicantEntry: "src/app/account/create/applicant/page.tsx",
  recovery: "src/app/account/recovery/page.tsx",
  entry: "src/features/identity/account-entry.tsx",
  profile: "src/features/identity/account-profile.tsx",
  photo: "src/components/ui/demo-profile-photo.tsx",
  applicant: "src/features/applicant/applicant-page.tsx",
  student: "src/features/student/student-page.tsx",
  scenario: "src/features/applicant/scenario-switcher.tsx",
  form: "src/features/applicant/application-form.tsx",
  shared: "src/features/applicant/shared.tsx",
  academics: "src/features/student/student-academics.tsx",
  academic: "src/features/academic/academic-page.tsx",
  records: "src/features/records/records-page.tsx",
  operations: "src/features/operations/operations-page.tsx",
  portal: "src/app/[portal]/[[...section]]/page.tsx",
  dashboard: "src/features/technology/technology-dashboard.tsx",
  accounts: "src/features/technology/technology-accounts.tsx",
  security: "src/features/technology/technology-security.tsx",
  system: "src/features/technology/technology-system.tsx",
  developer: "src/features/technology/technology-developer.tsx",
};
const cases = [
  [
    "B01",
    "login",
    ["Demo accounts only. Do not enter real student information."],
  ],
  ["B02", "create", ["Account entry preview", "No account"]],
  ["B03", "applicantEntry", ["Entry preview", "No password"]],
  ["B04", "recovery", ["Recovery preview", "No account lookup"]],
  [
    "B05",
    "entry",
    [
      "temporary preview",
      "No account or application was created",
      "not checked or contacted",
      "no upload fields",
      "does not match identities",
    ],
  ],
  [
    "B06",
    "entry",
    [
      "identity-check behavior are not connected",
      "does not look up accounts",
      "No recovery email was sent",
    ],
  ],
  [
    "B07",
    "profile",
    [
      "Photo and bio are temporary in this tab",
      "sign-out",
      "maxLength={240}",
      "Demo bio updated in this tab",
      "School-domain profiles remain separate",
    ],
  ],
  [
    "B08",
    "photo",
    [
      "Temporary sample photo. Not uploaded or saved",
      "Shown only in this tab",
      "up to 2 MB",
      "This image could not be opened",
    ],
  ],
  [
    "B09",
    "student",
    ["Sample school profile. Your sign-in identity", "Student ID is separate"],
  ],
  [
    "B10",
    "scenario",
    ["Changes the sample journey only. No school records change."],
  ],
  [
    "B11",
    "form",
    [
      "Submit this demo application?",
      "Nothing will be sent to",
      "Refresh resets the demo",
      "not available in this demo",
      "submitted in this tab only",
    ],
  ],
  ["B12", "applicant", ["No real appointment has been booked"]],
  [
    "B13",
    "shared",
    [
      "SAMPLE DOCUMENT · NOT VALID FOR OFFICIAL USE",
      "signatures",
      "not defined in this concept",
    ],
  ],
  ["B14", "applicant", ["This demo assigns no Student ID or membership"]],
  [
    "B15",
    "student",
    [
      "Sample · Not valid for official use",
      "not an issued school record",
      "No official record or school",
    ],
  ],
  [
    "B16",
    "student",
    [
      "This demo request stays in this browser session",
      "It is not sent to",
      "Review request",
      "Submit demo request",
    ],
  ],
  [
    "B17",
    "academics",
    ["Synthetic course list", "not an official curriculum", "V1 ASSUMPTION"],
  ],
  ["B18", "academic", ["Your changes in this session", "They reset when you"]],
  ["B19", "academic", ["Coordinator view: this sample roster is read-only"]],
  [
    "B20",
    "academic",
    [
      "Attendance saved in this demo session. It resets on refresh",
      "Past-session edits",
      "No official attendance",
    ],
  ],
  [
    "B21",
    "academic",
    [
      "No official record or notification is created",
      "has not been released to students",
      "does not define a scale",
    ],
  ],
  [
    "B22",
    "academic",
    [
      "Publishing, delivery, and official campus updates are not part of this demo",
    ],
  ],
  [
    "B23",
    "academic",
    [
      "No coordinator edits are saved",
      "V1 ASSUMPTION",
      "Official enrollment",
      "Changes to official schedules",
    ],
  ],
  [
    "B24",
    "records",
    [
      "Staff demo statuses only",
      "V1 ASSUMPTION",
      "not an official admissions decision",
      "checklist is locked",
    ],
  ],
  ["B25", "records", ["This demo does not create a Student ID"]],
  [
    "B26",
    "records",
    ["Review sample schedule", "Save sample schedule", "Confirm sample result"],
  ],
  [
    "B27",
    "records",
    ["sample statuses, not official releases", "Confirm sample step"],
  ],
  [
    "B28",
    "records",
    [
      "SAMPLE · DEMO · NOT VALID FOR OFFICIAL USE",
      "Print sample preview",
      "not an",
    ],
  ],
  [
    "B29",
    "operations",
    ["Service model", "No SLA or official service catalog is represented"],
  ],
  [
    "B30",
    "operations",
    [
      "It does not contact the student",
      "Admissions, DCAT, enrollment, student records, and official documents",
    ],
  ],
  [
    "B31",
    "operations",
    [
      "Directory scope",
      "not an official organization chart",
      "No HR or account-access workflow",
    ],
  ],
  ["B32", "operations", ["does not confirm an official department"]],
  [
    "B33",
    "operations",
    ["Facilities model", "No inventory or response-time policy is represented"],
  ],
  [
    "B34",
    "operations",
    [
      "Status changes stay in this browser session",
      "No response-time or emergency policy",
      "Sample ticket history",
    ],
  ],
  [
    "B35",
    "operations",
    [
      "Reference scope",
      "not official live settings",
      "V1 ASSUMPTION",
      "not an institutional configuration editor",
    ],
  ],
  ["B36", "portal", ["Read-only account directory"]],
  [
    "B37",
    "portal",
    ["System reporting", "No live monitoring or service-health reporting"],
  ],
  [
    "B38",
    "dashboard",
    [
      "Counts are derived from fictional development accounts and their current seeded memberships",
    ],
  ],
  [
    "B39",
    "accounts",
    [
      "review its account state, portal memberships",
      "Fictional demo accounts and their access summaries",
      "does not assign roles",
    ],
  ],
  [
    "B40",
    "security",
    [
      "not logs or recorded events",
      "No timestamps or IP addresses",
      "not persisted as an audit history",
      "MFA and production account-recovery delivery are not implemented",
    ],
  ],
  [
    "B41",
    "system",
    [
      "not live health",
      "Runtime mode only",
      "No live health checks",
      "No uptime, latency",
    ],
  ],
  [
    "B42",
    "developer",
    [
      "real authentication and access foundation",
      "technologyDemoLimitations.slice(2)",
      "they do not run from this page",
      "does not run an access test",
    ],
  ],
];
const normalize = (x) => x.replace(/\s+/g, " ").trim();
const result = {
  recordedAt: new Date().toISOString(),
  basis:
    "FD7 inventory + full source diff review; markers are regression sentinels, not complete workflow execution",
  contextual: cases.map(([id, file, markers]) => {
    const source = normalize(fs.readFileSync(f[file], "utf8"));
    const missing = markers.filter((x) => !source.includes(x));
    return { id, file: f[file], pass: missing.length === 0, markers, missing };
  }),
};
const additional = [
  ["B09", f.applicant, "Sample school profile. Your sign-in identity"],
  ["B12", f.shared, "Past demo appointment"],
  ["B26", "src/features/records/demo-context.tsx", "notification"],
  ["B42", "src/features/technology/demo-data.ts", "persistent audit history"],
];
result.additional = additional.map(([id, file, marker]) => ({
  id,
  file,
  marker,
  pass: normalize(fs.readFileSync(file, "utf8")).includes(marker),
}));
const changed = execFileSync("git", ["diff", "--name-only"], {
  encoding: "utf8",
})
  .trim()
  .split(/\r?\n/)
  .filter((x) => x.startsWith("src/"));
const protectedChanged = changed.filter((x) =>
  /\/server\/|\/lib\/auth|demo-data|demo-context|\.integration\.test|package/.test(
    x,
  ),
);
result.protectedFilesUnchanged = protectedChanged.length === 0;
result.protectedChanged = protectedChanged;
const files = [
  ...new Set([
    ...Object.values(f),
    ...changed,
    ...execFileSync(
      "git",
      ["ls-files", "--others", "--exclude-standard", "src"],
      { encoding: "utf8" },
    )
      .trim()
      .split(/\r?\n/)
      .filter(Boolean),
  ]),
];
result.sourceSHA256 = Object.fromEntries(
  files.map((file) => [
    file,
    crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
  ]),
);
result.errors = [...result.contextual, ...result.additional].filter(
  (x) => !x.pass,
);
fs.writeFileSync(
  "docs/phase-4/fd8-after/notice-verification.json",
  JSON.stringify(result, null, 2) + "\n",
);
process.stdout.write(
  JSON.stringify(
    {
      contextual: result.contextual.length,
      passed: result.contextual.filter((x) => x.pass).length,
      protectedFilesUnchanged: result.protectedFilesUnchanged,
      errors: result.errors,
    },
    null,
    2,
  ) + "\n",
);
process.exitCode = result.errors.length || protectedChanged.length ? 1 : 0;
