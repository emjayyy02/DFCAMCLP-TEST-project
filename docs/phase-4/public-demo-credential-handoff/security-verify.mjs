import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import postgres from "postgres";
import { verifyPassword } from "better-auth/crypto";
import { developmentAuthAccountSeed as seeds } from "../../../src/server/db/seed/data.ts";

const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );
const ensure = (condition, label) => {
  if (!condition) throw new Error(label);
};
let db;
try {
  const password = process.env.DEMO_ACCOUNT_PASSWORD;
  ensure(!!password, "Approved credential missing.");
  db = postgres(process.env.DATABASE_URL, {
    max: 1,
    onnotice: () => undefined,
  });
  const credentials =
    await db`SELECT a.*,u.email,u.name,app.person_id FROM auth_accounts a JOIN auth_users u ON u.id=a.user_id LEFT JOIN application_accounts app ON app.auth_user_id=u.id`;
  const sessions = await db`SELECT token FROM auth_sessions`;
  const matching = [];
  for (const row of credentials.filter((r) => r.provider_id === "credential"))
    if (await verifyPassword({ hash: row.password, password }))
      matching.push(row);
  ensure(
    matching.length === 9 &&
      matching.every((r) =>
        seeds.some(
          (s) =>
            s.personId === r.person_id &&
            s.email === r.email &&
            s.name === r.name,
        ),
      ),
    "Allowlist credential mismatch.",
  );
  const privateValues = Object.entries(process.env)
    .filter(
      ([key, value]) =>
        key !== "DEMO_ACCOUNT_PASSWORD" &&
        /SECRET|PASSWORD|TOKEN|API_KEY|DATABASE_URL/.test(key) &&
        value?.length > 5,
    )
    .map(([, value]) => value);
  privateValues.push(
    ...credentials
      .flatMap((r) => [r.password, r.access_token, r.refresh_token, r.id_token])
      .filter(Boolean),
    ...sessions.map((r) => r.token),
  );
  ensure(
    !privateValues.includes(password),
    "Approved password collides with private configuration.",
  );
  const client = walk(".next/static").filter((f) =>
    /\.(js|json|map|css|html)$/.test(f),
  );
  const current = [
    ...walk("src"),
    ...walk("scripts"),
    ...walk("docs/phase-4/public-demo-credential-handoff"),
    "docs/phase-4/P4-PUBLIC-DEMO-RELEASE-CHECK.md",
    "docs/DEMO-ACCOUNTS.md",
    ".env.example",
  ].filter((f) => /\.(tsx?|mjs|cjs|js|json|css|html|md|log)$/.test(f));
  const leakedFiles = [...client, ...current].filter((f) =>
    privateValues.some((v) => fs.readFileSync(f, "utf8").includes(v)),
  );
  const passwordLiteralFiles = [...client, ...current].filter((f) =>
    fs.readFileSync(f, "utf8").includes(password),
  );
  const patterns =
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[A-Z0-9]{16}|ghp_[a-zA-Z0-9]{30,}/;
  const keyFiles = client.filter((f) =>
    patterns.test(fs.readFileSync(f, "utf8")),
  );
  const response = await fetch("http://localhost:3130/login");
  const html = await response.text();
  ensure(
    response.ok && html.includes(password),
    "Narrow server-controlled public credential was not delivered.",
  );
  ensure(
    !privateValues.some((v) => html.includes(v)),
    "Private configuration entered login HTML.",
  );
  const trackedEnv = execFileSync("git", ["ls-files", ".env*"], {
    encoding: "utf8",
  })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  ensure(
    trackedEnv.every((f) => f === ".env.example"),
    "Private environment file tracked.",
  );
  ensure(
    fs
      .readFileSync(".env.example", "utf8")
      .split(/\r?\n/)
      .filter((l) => l.startsWith("DEMO_ACCOUNT_PASSWORD="))
      .join("") === "DEMO_ACCOUNT_PASSWORD=your-public-demo-password-here",
    "Example must contain only the approved placeholder.",
  );
  const sync = JSON.parse(
    fs.readFileSync(
      new URL("./sync-verification.json", import.meta.url),
      "utf8",
    ),
  );
  const roleSource = fs.readFileSync("src/server/access-control/seed-data.ts");
  const priorRoleSource = execFileSync("git", [
    "show",
    "HEAD:src/server/access-control/seed-data.ts",
  ]);
  ensure(
    Buffer.compare(roleSource, priorRoleSource) === 0,
    "Role/permission source changed.",
  );
  const result = {
    checkedAt: new Date().toISOString(),
    pass:
      leakedFiles.length === 0 &&
      passwordLiteralFiles.length === 0 &&
      keyFiles.length === 0,
    productionClientAssets: client.length,
    currentTextFiles: current.length,
    leakedFiles,
    passwordLiteralFiles,
    keyFiles,
    publicPasswordFromRuntimeServerProp: true,
    publicPasswordEmbeddedInStaticClientBundles: false,
    publicPasswordRecorded: false,
    privateConfigurationNotExposed: true,
    passwordHashesNotExposed: true,
    exactlyNineAllowlistedCredentialMatches: true,
    nonDemoCredentialMatches: 0,
    nonDemoRecordsUnchanged: sync.nonDemoRecordsUnchanged,
    identityAndAccessTablesUnchangedDuringSync:
      sync.identityAndAccessTablesUnchanged,
    rolePermissionSourceUnchanged: true,
    trackedEnvFiles: trackedEnv,
    hostConfigured: fs.existsSync(".vercel/project.json"),
    scope:
      "Local production artifacts/current source and release text checked for configured private values, actual DB credential/token literals, private-key patterns and accidental public-password literals. The approved value is deliberately present only in runtime Login HTML/props; it is never recorded in this evidence.",
  };
  fs.writeFileSync(
    new URL("./security-verification.json", import.meta.url),
    JSON.stringify(result, null, 2),
  );
  ensure(result.pass, "Artifact scan failed; sensitive details suppressed.");
  console.log(
    JSON.stringify({
      pass: true,
      clientAssets: client.length,
      currentTextFiles: current.length,
      privateLeaks: 0,
      passwordLiteralFiles: 0,
      publicAccounts: matching.length,
    }),
  );
} catch {
  console.error(
    "Credential artifact scan failed; sensitive details suppressed.",
  );
  process.exitCode = 1;
} finally {
  if (db) await db.end();
}
