/* eslint-disable @typescript-eslint/no-require-imports -- Workstation browser verification. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { parseEnv } = require("node:util");
const out = path.resolve("final-pass-4-evidence"),
  base = "http://localhost:3001";
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    }),
    page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await context.addInitScript(() =>
    localStorage.setItem("dfcamclp.demoDisclosure.ackVersion", "fd7-v1"),
  );
  const gate = page.locator("dialog.demo-disclosure-dialog");
  await page.goto(base + "/login");
  await gate.waitFor({ state: "visible" });
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("dfcamclp.demoDisclosure.ackVersion"),
    ),
    null,
  );
  assert.equal(
    await page
      .locator("#demo-disclosure-title")
      .evaluate((e) => e === document.activeElement),
    true,
  );
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "I understand — Enter demo",
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Project Disclaimer",
  );
  await gate
    .getByRole("link", { name: "About the developer", exact: true })
    .click();
  await page.waitForURL("**/about-developer");
  assert.equal(await gate.evaluate((e) => e.open), false);
  await page.getByRole("link", { name: "Return to demo", exact: true }).click();
  await gate.waitFor({ state: "visible" });
  await gate
    .getByRole("button", { name: "I understand — Enter demo", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Programs", exact: true })
    .first()
    .click();
  await page.waitForURL("**/programs");
  assert.equal(await gate.evaluate((e) => e.open), false);
  await page
    .getByRole("button", { name: "About this demo", exact: true })
    .click();
  await gate.waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  assert.equal(await gate.evaluate((e) => e.open), false);
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    "About this demo",
  );
  await page.reload();
  await gate.waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await page.waitForURL("**/disclaimer");
  assert.equal(await gate.evaluate((e) => e.open), false);
  await page.getByRole("link", { name: "Return to demo", exact: true }).click();
  await gate.waitFor({ state: "visible" });
  await gate
    .getByRole("button", { name: "I understand — Enter demo", exact: true })
    .click();
  await page
    .getByRole("link", { name: "About the developer", exact: true })
    .click();
  await page.waitForURL("**/about-developer");
  const widths = [320, 375, 768, 1440, 1920],
    metrics = [];
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: w < 768 ? 812 : 900 });
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    assert.equal(
      await page.getByRole("heading", { level: 1 }).innerText(),
      "Hey, I'm Mj.",
    );
    for (const [name, href] of [
      ["GitHub", "https://github.com/emjayyy02"],
      ["Portfolio", "https://project-01-personal-developer-profi.vercel.app"],
      ["Instagram", "https://www.instagram.com/_emm.jayyy/"],
    ]) {
      const link = page.locator(".developer-socials").getByRole("link", {
        name: name + " (opens in a new tab)",
        exact: true,
      });
      assert.equal(await link.getAttribute("href"), href);
      assert.equal(await link.getAttribute("target"), "_blank");
      assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
      assert.equal(await link.locator("svg").count(), 1);
    }
    const width = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    assert.ok(width <= w, "developer overflow " + w);
    metrics.push({ viewport: w, scrollWidth: width });
    await page.screenshot({
      path: path.join(out, "developer-" + w + ".png"),
      fullPage: true,
      animations: "disabled",
    });
    await page
      .getByRole("button", { name: "About this demo", exact: true })
      .click();
    await gate.waitFor({ state: "visible" });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(out, "disclosure-" + w + ".png"),
      fullPage: false,
      animations: "disabled",
    });
    await gate.getByRole("button", { name: "Close", exact: true }).click();
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  assert.ok(
    (await page.evaluate(() => document.documentElement.scrollWidth)) <= 375,
  );
  await page.screenshot({
    path: path.join(out, "developer-375-text200.png"),
    fullPage: true,
  });
  await context.close();
  const env = parseEnv(fs.readFileSync(".env", "utf8")),
    signed = await browser.newContext({
      viewport: { width: 1024, height: 768 },
    });
  const response = await signed.request.post(base + "/api/portal-login", {
    headers: { origin: base },
    data: {
      email: "jose.garcia@example.invalid",
      password: env.AUTH_SEED_PASSWORD,
      portal: "RECORDS",
    },
  });
  assert.equal(response.status(), 200);
  const p = await signed.newPage(),
    records = [];
  for (const route of [
    "/records/students",
    "/records/documents",
    "/records/applicants?queue=requirements",
    "/records/documents?record=DEMO-STU-2026-0142",
  ]) {
    await p.goto(base + route);
    const d = p.locator("dialog.demo-disclosure-dialog");
    await d.waitFor({ state: "visible" });
    await d
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
    const result = await p.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll("main *")]
        .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
        .map((e) => ({
          tag: e.tagName,
          class: e.className,
          width: e.getBoundingClientRect().width,
          right: e.getBoundingClientRect().right,
        }))
        .slice(0, 30),
    }));
    records.push({ route, ...result });
    assert.ok(result.scrollWidth <= result.width, "Records overflow: " + route);
    await p.screenshot({
      path: path.join(out, "records-" + records.length + "-1024.png"),
      fullPage: true,
      animations: "disabled",
    });
  }
  assert.equal(errors.length, 0);
  fs.writeFileSync(
    path.join(out, "verification.json"),
    JSON.stringify(
      {
        disclosure: {
          initial: true,
          legacyStorageRemoved: true,
          clientNavigationUninterrupted: true,
          refreshReopens: true,
          manualReopen: true,
          focusTrap: true,
          escapeAndRestore: true,
          legalAndDeveloperNavigation: true,
        },
        developer: metrics,
        text200: true,
        records,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    "Disclosure and developer verification passed; Records measurements saved.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
