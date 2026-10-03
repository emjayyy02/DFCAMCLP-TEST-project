import fs from "node:fs";
import { createRequire } from "node:module";
import postgres from "postgres";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = "http://localhost:3108";
const db = postgres(process.env.DATABASE_URL, {
  max: 1,
  onnotice: () => undefined,
});
let browser,
  context,
  original,
  renamed = false,
  stage = "database";
try {
  const users = await db`select email,name from auth_users order by email`;
  original = users.find((u) => u.email === "michael.castro@example.invalid");
  if (!original || users.length !== 9)
    throw new Error("Unexpected demo allowlist.");
  stage = "browser launch";
  browser = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  context = await browser.newContext();
  stage = "login request";
  const login = await context.request.post(base + "/api/portal-login", {
    headers: { origin: base },
    data: {
      email: original.email,
      password: process.env.AUTH_SEED_PASSWORD,
      portal: "ACADEMIC",
    },
  });
  stage = "login status " + login.status();
  if (login.status() !== 200) throw new Error("Probe login failed.");
  stage = "update request";
  const response = await context.request.post(base + "/api/auth/update-user", {
    headers: { origin: base },
    data: { name: "Fictional Release Probe" },
  });
  stage = "update status " + response.status();
  renamed = response.status() === 200;
  const [changed] =
    await db`select name from auth_users where email=${original.email}`;
  const sessions = await context.request.get(base + "/api/auth/list-sessions");
  stage = "list-sessions status " + sessions.status();
  const body = await sessions.json();
  const result = {
    updateUserStatus: response.status(),
    canonicalNameChanged: changed.name !== original.name,
    listSessionsStatus: sessions.status(),
    sessionTokenFieldsReturned:
      Array.isArray(body) && body.some((s) => typeof s.token === "string"),
    probeRestored: false,
  };
  if (renamed) {
    const restore = await context.request.post(base + "/api/auth/update-user", {
      headers: { origin: base },
      data: { name: original.name },
    });
    if (restore.status() !== 200) throw new Error("Probe restore failed.");
    renamed = false;
  }
  const [restored] =
    await db`select name from auth_users where email=${original.email}`;
  result.probeRestored = restored.name === original.name;
  await context.request.post(base + "/api/auth/sign-out", {
    headers: { origin: base },
  });
  fs.writeFileSync(
    new URL("./shared-account-before.json", import.meta.url),
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result));
} catch {
  console.error(
    "Shared-account probe failed at " +
      stage +
      "; sensitive details suppressed.",
  );
  process.exitCode = 1;
} finally {
  if (renamed && original)
    await db`update auth_users set name=${original.name} where email=${original.email}`;
  if (browser) await browser.close();
  await db.end();
}
