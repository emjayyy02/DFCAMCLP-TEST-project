/* eslint-disable @typescript-eslint/no-require-imports -- Browser verification uses workstation CommonJS dependencies. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");
const out = path.resolve("docs/phase-4/public-demo-release/recovery");
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aCioAAAAASUVORK5CYII=",
  "base64",
);
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  async function goto(route) {
    await page.goto("http://localhost:3122" + route);
    await page.waitForLoadState("networkidle");
    const d = page.locator("dialog.demo-disclosure-dialog[open]");
    if (await d.count())
      await d
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
  }
  async function shot(name) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.screenshot({
      path: path.join(out, name + ".png"),
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await goto("/account/recovery");
  const info = page.getByRole("button", { name: "About this preview" });
  await info.hover();
  assert.equal(await info.getAttribute("aria-expanded"), "true");
  await page.mouse.move(0, 0);
  await info.focus();
  assert.equal(await info.getAttribute("aria-expanded"), "true");
  await info.press("Escape");
  assert.equal(await info.getAttribute("aria-expanded"), "false");
  await info.click();
  assert.equal(await info.getAttribute("aria-expanded"), "true");
  await info.press("Escape");
  await page
    .getByRole("button", { name: "Preview recovery email", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("heading", { name: "Recovery email preview", exact: true })
      .count(),
    0,
  );
  await page.getByLabel("Email address").fill("not-an-email");
  assert.equal(
    await page.getByLabel("Email address").evaluate((e) => e.checkValidity()),
    false,
  );
  await page.getByLabel("Email address").fill("juan.delacruz@example.invalid");
  await page
    .getByRole("button", { name: "Preview recovery email", exact: true })
    .click();
  assert(
    await page
      .getByRole("heading", { name: "Recovery email preview", exact: true })
      .isVisible(),
  );
  assert(
    await page
      .locator("dd")
      .filter({ hasText: "juan.delacruz@example.invalid" })
      .isVisible(),
  );
  await page.getByRole("button", { name: "Edit details", exact: true }).click();
  await page.getByLabel("Account email").fill("johnpaul.reyes@example.invalid");
  for (const issue of [
    "Forgot password",
    "Cannot sign in",
    "Account locked",
    "Wrong account information",
    "Portal access problem",
    "Other",
  ]) {
    await page
      .getByLabel("Issue *", { exact: true })
      .selectOption({ label: issue });
  }
  await page.getByLabel("Subject").fill("Preview portal access question");
  await page
    .getByLabel("Describe the issue")
    .fill("Fictional example: I cannot open my assigned portal.");
  const file = page.getByLabel("Evidence", { exact: true });
  await file.setInputFiles({
    name: "unsupported.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("fictional"),
  });
  assert(await page.locator(".field-error[role=alert]").isVisible());
  await file.setInputFiles({
    name: "large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
  });
  assert(await page.locator(".field-error[role=alert]").isVisible());
  await file.setInputFiles({
    name: "corrupt.png",
    mimeType: "image/png",
    buffer: Buffer.from("bad"),
  });
  await page
    .getByText("This image could not be opened. Choose another image.")
    .waitFor();
  await file.setInputFiles({
    name: "evidence.png",
    mimeType: "image/png",
    buffer: png,
  });
  await page.getByAltText("Evidence preview", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Remove image", exact: true }).click();
  assert.equal(
    await page.getByAltText("Evidence preview", { exact: true }).count(),
    0,
  );
  await file.setInputFiles({
    name: "evidence.png",
    mimeType: "image/png",
    buffer: png,
  });
  await page.getByAltText("Evidence preview", { exact: true }).waitFor();
  assert(
    await page
      .getByRole("button", { name: "Send to administrator", exact: true })
      .isDisabled(),
  );
  const writes = [];
  const watch = (req) => {
    if (req.method() !== "GET") writes.push(req.url());
  };
  page.on("request", watch);
  await page
    .getByRole("button", { name: "Preview request", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Support request preview", exact: true })
    .waitFor();
  await shot("ticket-preview");
  await page.getByRole("button", { name: "Edit details", exact: true }).click();
  assert.equal(
    await page.getByLabel("Subject").inputValue(),
    "Preview portal access question",
  );

  const metrics = [];
  for (const width of [320, 375, 768, 1440, 1920]) {
    await page.setViewportSize({
      width,
      height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
    });
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    assert(scrollWidth <= width);
    await shot("recovery-" + width);
    metrics.push({ width, scrollWidth });
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await shot("recovery-text200");
  assert.equal(writes.length, 0);
  assert.equal(errors.length, 0);
  fs.writeFileSync(
    path.join(out, "verification.json"),
    JSON.stringify(
      {
        applicantEmail: true,
        supportComposer: true,
        issues: 6,
        imageTypeSizeDecodeRemove: true,
        previewEditable: true,
        realSendDisabled: true,
        infoHoverFocusClick: true,
        text200: true,
        nonGetRequests: writes.length,
        metrics,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log("Recovery release verification passed.");
})().catch(() => {
  console.error(
    "Recovery release assertion failed; sensitive details suppressed.",
  );
  process.exit(1);
});
