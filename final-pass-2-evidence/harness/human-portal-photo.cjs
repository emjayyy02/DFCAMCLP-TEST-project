/* eslint-disable @typescript-eslint/no-require-imports -- Node verification harness uses workstation CommonJS dependencies. */
const fs = require("fs"),
  assert = require("assert/strict"),
  { parseEnv } = require("node:util"),
  {
    chromium,
  } = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = "http://localhost:3000",
  env = parseEnv(fs.readFileSync(".env", "utf8"));
(async () => {
  const b = await chromium.launch({
      headless: true,
      executablePath:
        "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    }),
    c = await b.newContext({ viewport: { width: 1440, height: 900 } }),
    p = await c.newPage();
  const r = await c.request.post(base + "/api/portal-login", {
    headers: { origin: base },
    data: {
      email: "michael.castro@example.invalid",
      password: env.AUTH_SEED_PASSWORD,
      portal: "ACADEMIC",
    },
  });
  assert.equal(r.status(), 200);
  await p.goto(base + "/account");
  await p.waitForLoadState("networkidle");
  const gate = p.locator("dialog.demo-disclosure-dialog[open]");
  if (await gate.count())
    await gate
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
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
  const src = await p
    .locator(".account-profile-identity .demo-photo-control > .avatar img")
    .getAttribute("src");
  await p.getByRole("link", { name: "Open Academic", exact: true }).click();
  await p.waitForURL("**/academic");
  await p.locator(".account-trigger img").waitFor();
  assert.equal(
    await p.locator(".account-trigger img").getAttribute("src"),
    src,
  );
  await p.locator("summary").filter({ hasText: "Switch portal" }).click();
  await p
    .locator("details[open]")
    .getByRole("link", { name: "Technology", exact: true })
    .click();
  await p.waitForURL("**/technology");
  await p.locator(".account-trigger img").waitFor();
  assert.equal(
    await p.locator(".account-trigger img").getAttribute("src"),
    src,
  );
  await p.locator(".account-trigger").click();
  assert.equal(
    await p.locator("details[open] .identity-summary-name").innerText(),
    "Michael Castro",
  );
  assert.equal(
    await p.locator("details[open] .identity-summary-detail").innerText(),
    "michael.castro@example.invalid",
  );
  fs.writeFileSync(
    "final-pass-2-evidence/portal-photo-verification.json",
    JSON.stringify(
      {
        identity: "Michael Castro",
        account: true,
        academic: true,
        technology: true,
        samePhoto: true,
      },
      null,
      2,
    ),
  );
  console.log("Same photo persists across Account, Academic and Technology");
  await b.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
