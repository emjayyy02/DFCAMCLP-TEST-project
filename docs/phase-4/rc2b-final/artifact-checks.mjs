import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import postgres from "postgres";
const env = parseEnv(fs.readFileSync(".env", "utf8"));
const db = postgres(env.DATABASE_URL, { max: 1, onnotice: () => undefined });
try {
  const protectedValues = Object.entries(env)
    .filter(
      ([key, value]) =>
        /(?:PASSWORD|AUTH_SECRET|DATABASE_URL)/.test(key) && value.length > 5,
    )
    .map(([, value]) => value);
  const hashes =
    await db`select password from auth_accounts where provider_id='credential'`;
  const tokens = await db`select token from auth_sessions`;
  protectedValues.push(
    ...hashes.map((r) => r.password).filter(Boolean),
    ...tokens.map((r) => r.token).filter(Boolean),
  );
  const files = [];
  const walk = (directory) => {
    for (const e of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, e.name);
      if (e.isDirectory()) walk(file);
      else if (/\.(?:cjs|mjs|json|md)$/.test(file)) files.push(file);
    }
  };
  walk("docs/phase-4/rc2b-final");
  files.push(
    "docs/phase-4/P4-RC2B-FINAL-DEFECT-FIXES.md",
    "docs/phase-4/P4-ROADMAP.md",
  );
  const snapshot = JSON.parse(
    fs.readFileSync("docs/phase-4/rc2b-final/snapshot-after.json", "utf8"),
  );
  files.push(...snapshot.changedSources);
  const leakFiles = files.filter((file) => {
    const content = fs.readFileSync(file, "utf8");
    return protectedValues.some((value) => content.includes(value));
  });
  const result = {
    checkedAt: new Date().toISOString(),
    scope:
      "RC2B new text artifacts, current roadmap, report and changed source; configured secret values, actual credential hashes and session token literals; no values recorded",
    files: files.length,
    leakFiles,
    pass: leakFiles.length === 0,
  };
  fs.writeFileSync(
    new URL("./artifact-checks.json", import.meta.url),
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify({
      files: result.files,
      leakFiles: result.leakFiles,
      pass: result.pass,
    }),
  );
  if (!result.pass) process.exitCode = 1;
} catch {
  console.error("Artifact scan failed; database details suppressed.");
  process.exitCode = 1;
} finally {
  await db.end();
}
