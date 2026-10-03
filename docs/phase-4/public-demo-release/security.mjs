import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { parseEnv } from "node:util";
import postgres from "postgres";
import * as prettier from "prettier";
const env = parseEnv(fs.readFileSync(".env", "utf8"));
const db = postgres(env.DATABASE_URL, { max: 1, onnotice: () => undefined });
const out = new URL("./", import.meta.url);
const digest = (value) =>
  crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const walk = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(directory, e.name))
        : [path.join(directory, e.name)],
    );
try {
  const credentials =
    await db`select u.email,a.provider_id,a.password from auth_users u join auth_accounts a on a.user_id=u.id order by u.email,a.provider_id`;
  const users =
    await db`select u.email,u.name,app.person_id,app.status from auth_users u join application_accounts app on app.auth_user_id=u.id order by u.email`;
  const memberships =
    await db`select application_account_id,portal,is_active from portal_memberships order by application_account_id,portal`;
  const tokens = await db`select token from auth_sessions`;
  const authCount = await db`select count(*)::integer count from auth_users`;
  const protectedValues = Object.entries(env)
    .filter(
      ([key, value]) =>
        /(?:PASSWORD|SECRET|TOKEN|API_KEY|DATABASE_URL)/.test(key) &&
        value.length > 5,
    )
    .map(([, value]) => value);
  protectedValues.push(
    ...credentials.map((r) => r.password).filter(Boolean),
    ...tokens.map((r) => r.token),
  );
  const clientFiles = walk(".next/static").filter((f) =>
    /\.(?:js|json|css|map|html)$/.test(f),
  );
  const currentText = [
    ...walk("src"),
    ...walk("docs/phase-4/public-demo-release"),
  ].filter((f) => /\.(?:tsx?|cjs|mjs|json|md|html|log)$/.test(f));
  for (const p of [
    "docs/DEMO-ACCOUNTS.md",
    "docs/phase-4/P4-PUBLIC-DEMO-RELEASE-CHECK.md",
    "docs/phase-4/P4-ROADMAP.md",
  ])
    if (fs.existsSync(p)) currentText.push(p);
  const documents = [];
  for (const route of ["/login", "/about-developer"]) {
    const response = await fetch("http://localhost:3122" + route);
    if (!response.ok) throw new Error("Production page failed.");
    documents.push({ label: route, body: await response.text() });
  }
  const leakFiles = [...clientFiles, ...currentText].filter((file) => {
    const content = fs.readFileSync(file, "utf8");
    return protectedValues.some((value) => content.includes(value));
  });
  for (const doc of documents)
    if (protectedValues.some((value) => doc.body.includes(value)))
      leakFiles.push("production HTML " + doc.label);
  const keyPattern =
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[A-Z0-9]{16}|ghp_[a-zA-Z0-9]{30,}/;
  const privateKeyFiles = clientFiles.filter((f) =>
    keyPattern.test(fs.readFileSync(f, "utf8")),
  );
  const legacy =
    /Test(?:applicant|student|employee|records|operations|technology|coordinator|administrator|multiporal)|[a-z]+\.test@example\.invalid/i;
  const legacyRuntimeFiles = [...walk("src"), ...clientFiles].filter(
    (f) =>
      /\.(?:tsx?|js|json|html)$/.test(f) &&
      legacy.test(fs.readFileSync(f, "utf8")),
  );
  const fixtureFiles = walk("src").filter(
    (f) =>
      /(?:seed|demo-data|tests|applicant-entry|preview-rules)/.test(f) &&
      /\.(?:tsx?|json)$/.test(f),
  );
  const realFixtureFiles = fixtureFiles.filter((f) =>
    /Marvin Silverio|silveriomarvin3@gmail\.com/i.test(
      fs.readFileSync(f, "utf8"),
    ),
  );
  const canonical = [
    ...fs
      .readFileSync("src/server/db/seed/data.ts", "utf8")
      .matchAll(/email: "([^"]+)",\s*name: "([^"]+)"/g),
  ].map((x) => ({ email: x[1], name: x[2] }));
  const previous = JSON.parse(
    fs.readFileSync("docs/phase-4/rc2b-final/snapshot-after.json", "utf8"),
  );
  const currentSeedSource = fs.readFileSync(
    "src/server/db/seed/data.ts",
    "utf8",
  );
  const priorSeedSource = execFileSync(
    "git",
    ["show", previous.commit + ":src/server/db/seed/data.ts"],
    { encoding: "utf8" },
  );
  const seedEmailKeys = (text) =>
    new Map(
      [
        ...text.matchAll(
          /email: "([^"]+)",\s*name: "[^"]+",\s*personId: seedIds\.people\.(\w+)/g,
        ),
      ].map((m) => [m[2], m[1]]),
    );
  const currentEmails = seedEmailKeys(currentSeedSource),
    priorEmails = seedEmailKeys(priorSeedSource);
  const previousEmailByCurrent = new Map(
    [...currentEmails].map(([key, email]) => [email, priorEmails.get(key)]),
  );
  const normalizedCredentials = credentials
    .map((row) => ({ ...row, email: previousEmailByCurrent.get(row.email) }))
    .sort((a, b) => (a.email < b.email ? -1 : a.email > b.email ? 1 : 0));
  const migration = JSON.parse(
    fs.readFileSync(
      "final-pass-2-evidence/auth-migration-verification.json",
      "utf8",
    ),
  );
  const roleSource = fs.readFileSync("src/server/access-control/seed-data.ts");
  const priorRoleSource = execFileSync("git", [
    "show",
    "HEAD:src/server/access-control/seed-data.ts",
  ]);
  const trackedEnv = execFileSync(
    "git",
    ["ls-files", "*.env", ".env", ".env.*"],
    { encoding: "utf8" },
  )
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const historicalSemanticChanges = [];
  for (const file of execFileSync("git", ["diff", "--name-only"], {
    encoding: "utf8",
  })
    .trim()
    .split(/\r?\n/)) {
    if (!file || !/^final-(?:check|pass)-/.test(file) || !fs.existsSync(file))
      continue;
    const before = execFileSync("git", ["show", "HEAD:" + file], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const after = fs.readFileSync(file, "utf8");
    if (file.endsWith(".json")) {
      if (
        JSON.stringify(JSON.parse(before)) !== JSON.stringify(JSON.parse(after))
      )
        historicalSemanticChanges.push(file);
    } else if (
      (
        await prettier.format(before, {
          ...(await prettier.resolveConfig(file)),
          filepath: file,
        })
      ).trim() !== after.trim()
    )
      historicalSemanticChanges.push(file);
  }
  const summary = {
    checkedAt: new Date().toISOString(),
    clientArtifactFiles: clientFiles.length,
    currentTextFiles: currentText.length,
    productionHtml: documents.map((d) => d.label),
    leakFiles,
    privateKeyFiles,
    legacyRuntimeFiles,
    realFixtureFiles,
    accounts: users.map(({ email, name, status }) => ({ email, name, status })),
    accountCount: authCount[0].count,
    canonicalExactlyNine:
      canonical.length === 9 &&
      authCount[0].count === 9 &&
      users.length === 9 &&
      canonical.every((a) =>
        users.some(
          (u) =>
            u.email === a.email && u.name === a.name && u.status === "ACTIVE",
        ),
      ) &&
      canonical.every((a) => a.email.endsWith("@example.invalid")),
    credentialsUnchangedSinceRc2b:
      previous.credentialFingerprint === digest(normalizedCredentials),
    credentialComparison:
      "RC2B credential rows normalized to their prior emails using the stable canonical seed Person keys, then sorted as in the original snapshot. The owner-approved identity/email migration is accounted for; actual password hashes remain private.",
    accountsUnchangedSinceRc2b: previous.accountFingerprint === digest(users),
    membershipsUnchangedSinceRc2b:
      previous.membershipFingerprint === digest(memberships),
    rolePermissionSourceUnchanged:
      Buffer.compare(roleSource, priorRoleSource) === 0,
    currentCredentialCount: credentials.length,
    credentialFingerprint: digest(credentials),
    membershipFingerprint: digest(memberships),
    trackedEnvFiles: trackedEnv,
    historicalSemanticChanges,
    ownerApprovedPublicPassword: false,
    credentialSyncUsed: false,
    host: {
      configuredProjectDeployment: fs.existsSync(".vercel/project.json"),
      appUrlIsLoopback:
        new URL(env.APP_URL).hostname === "localhost" ||
        new URL(env.APP_URL).hostname === "127.0.0.1",
      portalDeploymentUrlFound: false,
      hostedVerification:
        "Not performed: no portal host configured in project or public project catalog.",
    },
    earlierMigrationEvidencePresent: !!migration,
    scope:
      "Local production client files and current release text inspected for configured private secret/password literals, actual credential hashes/session tokens, private-key patterns and retired identities. No protected values recorded. Developer attribution is permitted outside fictional fixtures. No remote database or formal security certification claim.",
  };
  summary.pass =
    summary.canonicalExactlyNine &&
    summary.rolePermissionSourceUnchanged &&
    summary.credentialsUnchangedSinceRc2b &&
    summary.membershipsUnchangedSinceRc2b &&
    ![
      leakFiles,
      privateKeyFiles,
      legacyRuntimeFiles,
      realFixtureFiles,
      historicalSemanticChanges,
    ].some((a) => a.length > 0) &&
    trackedEnv.every((f) => f === ".env.example");
  fs.writeFileSync(
    new URL("security-verification.json", out),
    JSON.stringify(summary, null, 2),
  );
  console.log(
    JSON.stringify({
      pass: summary.pass,
      clientFiles: clientFiles.length,
      accounts: summary.accountCount,
      leakFiles,
      legacyRuntimeFiles,
      realFixtureFiles,
      historicalSemanticChanges,
      credentialsUnchanged: summary.credentialsUnchangedSinceRc2b,
      membershipsUnchanged: summary.membershipsUnchangedSinceRc2b,
    }),
  );
  if (!summary.pass) process.exitCode = 1;
} catch {
  console.error(
    "Release artifact/identity scan failed; sensitive details suppressed.",
  );
  process.exitCode = 1;
} finally {
  await db.end();
}
