import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseEnv } from "node:util";
import { execFileSync } from "node:child_process";
import postgres from "postgres";
const env = parseEnv(fs.readFileSync(".env", "utf8"));
const checks = [];
const check = (name, pass, detail) => checks.push({ name, pass, detail });
const notices = JSON.parse(
  fs.readFileSync("docs/phase-4/fd8-after/notice-verification.json", "utf8"),
);
const contextual = notices.contextual.map((row) => {
  const source = fs.readFileSync(row.file, "utf8").replace(/\s+/g, " ");
  const missing = row.markers.filter(
    (marker) => !source.includes(marker.replace(/\s+/g, " ")),
  );
  return { id: row.id, file: row.file, pass: missing.length === 0, missing };
});
check(
  "All contextual B01-B42 sentinels retained",
  contextual.length === 42 && contextual.every((row) => row.pass),
);
const before = JSON.parse(
  fs.readFileSync(new URL("./snapshot-before.json", import.meta.url), "utf8"),
);
for (const file of [
  "src/app/globals.css",
  "src/features/disclosure/demo-disclosure-provider.tsx",
  "src/features/disclosure/disclosure-content.ts",
  "src/server/auth/factory.ts",
  "src/server/access-control/seed-data.ts",
  "src/server/db/seed/data.ts",
  "package.json",
  "pnpm-lock.yaml",
])
  check(
    "Preserved " + file,
    before.sources[file] ===
      crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
  );
const protectedValues = Object.entries(env)
  .filter(
    ([key, value]) =>
      /(?:PASSWORD|AUTH_SECRET|DATABASE_URL)/.test(key) && value.length > 5,
  )
  .map(([, value]) => value);
const db = postgres(env.DATABASE_URL, { max: 1, onnotice: () => undefined });
try {
  const users = await db`select email,name from auth_users order by email`;
  const expected = JSON.parse(
    fs.readFileSync("final-check-before-uiux/manifest.json", "utf8"),
  )
    .accounts.map((account) => account.email)
    .sort();
  check(
    "Exactly nine canonical fictional auth identities",
    users.length === 9 &&
      JSON.stringify(users.map((u) => u.email).sort()) ===
        JSON.stringify(expected),
  );
  check(
    "Demo identity emails and names are fictional",
    users.every(
      (u) => u.email.endsWith("@example.invalid") && u.name.includes("Test"),
    ),
  );
  const hashes =
    await db`select password from auth_accounts where provider_id='credential'`;
  const tokens = await db`select token from auth_sessions`;
  protectedValues.push(
    ...hashes.map((row) => row.password).filter(Boolean),
    ...tokens.map((row) => row.token).filter(Boolean),
  );
  const bundles = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.(?:js|css|json|map)$/.test(file)) bundles.push(file);
    }
  };
  walk(".next/static");
  const leaks = [];
  for (const file of bundles) {
    const content = fs.readFileSync(file, "utf8");
    if (protectedValues.some((value) => content.includes(value)))
      leaks.push(file);
  }
  check(
    "No configured credential/env/hash/token literal in client assets",
    leaks.length === 0,
    { files: bundles.length, leakFiles: leaks },
  );
  const html = await (await fetch("http://localhost:3109/login")).text();
  check(
    "No configured credential/env/hash/token literal in public Login response",
    !protectedValues.some((value) => html.includes(value)),
  );
  const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .trim()
    .split(/\r?\n/);
  check(
    "Only env example tracked",
    tracked
      .filter((file) => /^\.env/.test(file))
      .every((file) => file === ".env.example"),
  );
  const textFiles = tracked.filter(
    (file) =>
      /\.(?:tsx?|jsx?|cjs|mjs|json|md|html|css|yaml|toml|sql)$/.test(file) &&
      fs.existsSync(file),
  );
  const sourceLeaks = textFiles.filter((file) => {
    const contents = fs.readFileSync(file, "utf8");
    return protectedValues
      .slice(0, 3)
      .some((value) => contents.includes(value));
  });
  check(
    "No configured secret literal in tracked text",
    sourceLeaks.length === 0,
    { files: textFiles.length, leakFiles: sourceLeaks },
  );
  const panel = fs.readFileSync(
    "src/features/identity/demo-accounts-panel.tsx",
    "utf8",
  );
  check(
    "Panel has no password or credential source",
    !/password|AUTH_SEED|process\.env|authClient|fetch\(/i.test(panel),
  );
  const result = {
    checkedAt: new Date().toISOString(),
    scope:
      "Local RC2B handoff gates; no passwords or token values recorded; hosted/history/mutating-endpoint review remains separate",
    checks,
    contextual,
    summary: {
      checks: checks.length,
      failed: checks.filter((c) => !c.pass).length,
    },
  };
  fs.writeFileSync(
    new URL("./release-checks.json", import.meta.url),
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result.summary));
  if (result.summary.failed) process.exitCode = 1;
} catch {
  console.error("Release check failed; database details suppressed.");
  process.exitCode = 1;
} finally {
  await db.end();
}
