import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseEnv } from "node:util";
import { execFileSync } from "node:child_process";
import postgres from "postgres";
const phase = process.argv.includes("--after") ? "after" : "before";
const env = parseEnv(fs.readFileSync(".env", "utf8"));
const digest = (value) =>
  crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const files = [];
for (const directory of ["src", "scripts", "public", "drizzle"])
  if (fs.existsSync(directory)) {
    const walk = (p) => {
      for (const e of fs.readdirSync(p, { withFileTypes: true })) {
        const file = path.join(p, e.name);
        if (e.isDirectory()) walk(file);
        else files.push(file);
      }
    };
    walk(directory);
  }
for (const file of [
  "package.json",
  "pnpm-lock.yaml",
  "next.config.ts",
  "next-env.d.ts",
  "tsconfig.json",
  "AGENTS.md",
  "DFCAMCLP.md",
  "compose.yaml",
])
  if (fs.existsSync(file)) files.push(file);
const sources = Object.fromEntries(
  files
    .sort()
    .map((file) => [
      file.replaceAll("\\", "/"),
      crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
    ]),
);
const db = postgres(env.DATABASE_URL, { max: 1, onnotice: () => undefined });
try {
  const credentials =
    await db`select u.email,a.provider_id,a.password from auth_users u join auth_accounts a on a.user_id=u.id order by u.email,a.provider_id`;
  const users =
    await db`select u.email,u.name,app.person_id,app.status from auth_users u join application_accounts app on app.auth_user_id=u.id order by u.email`;
  const memberships =
    await db`select application_account_id,portal,is_active from portal_memberships order by application_account_id,portal`;
  const result = {
    timestamp: new Date().toISOString(),
    commit: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    sources,
    credentialCount: credentials.length,
    credentialFingerprint: digest(credentials),
    accountFingerprint: digest(users),
    membershipFingerprint: digest(memberships),
    accounts: users.map(({ email, name, status }) => ({ email, name, status })),
  };
  if (phase === "before")
    result.dirtyStatus = execFileSync("git", ["status", "--short"], {
      encoding: "utf8",
    });
  else {
    const before = JSON.parse(
      fs.readFileSync(
        new URL("./snapshot-before.json", import.meta.url),
        "utf8",
      ),
    );
    result.changedSources = [
      ...new Set([...Object.keys(before.sources), ...Object.keys(sources)]),
    ].filter((file) => before.sources[file] !== sources[file]);
    result.credentialsUnchanged =
      before.credentialFingerprint === result.credentialFingerprint;
    result.accountsUnchanged =
      before.accountFingerprint === result.accountFingerprint;
    result.membershipsUnchanged =
      before.membershipFingerprint === result.membershipFingerprint;
  }
  fs.writeFileSync(
    new URL("./snapshot-" + phase + ".json", import.meta.url),
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify({
      phase,
      sourceFiles: files.length,
      accountCount: users.length,
      credentialCount: credentials.length,
      credentialsUnchanged: result.credentialsUnchanged,
      accountsUnchanged: result.accountsUnchanged,
      membershipsUnchanged: result.membershipsUnchanged,
      changedSources: result.changedSources,
    }),
  );
} catch {
  console.error("Snapshot failed; database details suppressed.");
  process.exitCode = 1;
} finally {
  await db.end();
}
