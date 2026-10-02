/* eslint-disable @typescript-eslint/no-require-imports -- Node verification harness uses workstation CommonJS dependencies. */
const fs = require("fs"),
  { parseEnv } = require("node:util"),
  assert = require("assert/strict");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const env = parseEnv(fs.readFileSync(".env", "utf8")),
  base = "http://localhost:3000";
(async () => {
  const b = await chromium.launch({
      headless: true,
      executablePath:
        "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    }),
    c = await b.newContext({ viewport: { width: 1440, height: 900 } }),
    p = await c.newPage();
  async function login(email, portal) {
    const r = await c.request.post(base + "/api/portal-login", {
      headers: { origin: base },
      data: { email, password: env.AUTH_SEED_PASSWORD, portal },
    });
    assert.equal(r.status(), 200);
    await p.goto(base + "/" + portal.toLowerCase());
    await p.waitForLoadState("networkidle");
    const d = p.locator("dialog.demo-disclosure-dialog[open]");
    if (await d.count())
      await d
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
  }
  await login("johnpaul.reyes@example.invalid", "STUDENT");
  await p.locator(".account-trigger").click();
  await p
    .locator("details[open]")
    .getByRole("link", { name: "View profile", exact: true })
    .click();
  await p.waitForURL("**/account");
  await p.getByRole("button", { name: "Add demo photo", exact: true }).click();
  await p.getByLabel("Choose demo profile image").setInputFiles({
    name: "synthetic.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await p.getByRole("button", { name: "Use photo", exact: true }).click();
  await p.getByRole("button", { name: "Sign out", exact: true }).click();
  await p.waitForURL("**/login");
  await login("juan.delacruz@example.invalid", "APPLICANT");
  await p.locator(".account-trigger").waitFor();
  assert.equal(await p.locator(".account-trigger img").count(), 0);
  await p.locator(".account-trigger").click();
  assert.equal(
    await p.locator("details[open] .identity-summary-name").innerText(),
    "Juan Dela Cruz",
  );
  assert.equal(
    await p.locator("details[open] .identity-summary-detail").innerText(),
    "juan.delacruz@example.invalid",
  );
  fs.writeFileSync(
    "final-pass-2-evidence/session-change-verification.json",
    JSON.stringify(
      { signOut: true, newIdentity: "Juan Dela Cruz", stalePhoto: false },
      null,
      2,
    ),
  );
  console.log("Same-tab sign-out and identity/photo reset passed");
  await b.close();
})().catch((e) => {
  console.error(e.stack);
  process.exit(1);
});
