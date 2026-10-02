/* eslint-disable @typescript-eslint/no-require-imports -- Browser verification uses workstation CommonJS dependencies. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");
const out = path.resolve("final-pass-3-evidence");
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
    await page.goto("http://localhost:3000" + route);
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
  await goto("/account/create/applicant");
  assert.equal(
    await page
      .locator("input:not([type=file])")
      .evaluateAll((es) => es.filter((e) => e.value).length),
    0,
  );
  await page
    .getByRole("button", { name: "Preview application", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("heading", { name: "Application preview", exact: true })
      .count(),
    0,
  );
  await page.getByLabel("First name").fill("Juan");
  await page.getByLabel("Last name").fill("Dela Cruz");
  await page
    .getByLabel("Email *", { exact: true })
    .fill("juan.delacruz@example.invalid");
  await page.getByLabel("Birth date").fill("2005-01-02");
  await page.getByLabel("Sex", { exact: true }).selectOption("Male");
  const fields = {
    mobile: "09120000000",
    address: "123 Sample Street",
    city: "Sample City",
    barangay: "Sample Barangay",
    school: "Example Secondary School",
    schoolAddress: "45 Example Road",
    education: "Grade 12 graduate, 2025",
    mother: "Example Mother",
    motherContact: "09120000001",
    father: "Example Father",
    fatherContact: "09120000002",
    guardian: "",
    guardianContact: "",
  };
  for (const [name, value] of Object.entries(fields))
    await page.locator(`input[name="${name}"]`).fill(value);
  await page.getByLabel("Degree program", { exact: true }).selectOption("BSBA");
  assert(await page.getByLabel("BSBA major").isVisible());
  await page.getByLabel("BSBA major").selectOption("Marketing Management");
  await page.getByLabel("Campus", { exact: true }).selectOption("IIT");
  assert.equal(
    await page.getByLabel("Degree program", { exact: true }).inputValue(),
    "BSIS",
  );
  assert.equal(await page.getByLabel("BSBA major").count(), 0);
  await page
    .getByLabel("Degree program", { exact: true })
    .selectOption("BSCpE");
  const photo = page.getByLabel("Photo", { exact: true });
  await photo.setInputFiles({
    name: "applicant.png",
    mimeType: "image/png",
    buffer: png,
  });
  await page.getByAltText("Applicant photo preview", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Remove image", exact: true }).click();
  assert.equal(
    await page.getByAltText("Applicant photo preview", { exact: true }).count(),
    0,
  );
  await photo.setInputFiles({
    name: "applicant.png",
    mimeType: "image/png",
    buffer: png,
  });
  await page.getByAltText("Applicant photo preview", { exact: true }).waitFor();
  assert(
    await page
      .getByRole("button", { name: "Submit application", exact: true })
      .isDisabled(),
  );
  await page
    .getByRole("button", { name: "Preview application", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Application preview", exact: true })
    .waitFor();
  assert(
    await page
      .locator("dd")
      .filter({ hasText: /^Juan$/ })
      .isVisible(),
  );
  assert(await page.locator("dd").filter({ hasText: "BSCpE" }).isVisible());
  await shot("application-preview");
  await page.getByRole("button", { name: "Edit details", exact: true }).click();
  assert.equal(await page.getByLabel("First name").inputValue(), "Juan");
  assert.equal(
    await page.getByLabel("Degree program", { exact: true }).inputValue(),
    "BSCpE",
  );
  assert.equal(writes.length, 0);
  page.off("request", watch);
  await page.reload();
  await page.waitForLoadState("networkidle");
  assert.equal(await page.getByLabel("First name").inputValue(), "");
  assert.equal(
    await page.getByAltText("Applicant photo preview", { exact: true }).count(),
    0,
  );
  const layouts = [];
  for (const route of ["/account/recovery", "/account/create/applicant"])
    for (const width of [320, 375, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await goto(route);
      const measured = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        columns: getComputedStyle(document.querySelector(".preview-fields"))
          .gridTemplateColumns,
      }));
      assert(measured.scroll <= width, JSON.stringify({ route, ...measured }));
      await shot(
        (route.includes("applicant") ? "applicant" : "recovery") + "-" + width,
      );
      layouts.push({ route, ...measured });
      const i = page.getByRole("button", { name: "About this preview" });
      await i.focus();
      assert.equal(await i.getAttribute("aria-expanded"), "true");
      await i.press("Escape");
      await i.press("Tab");
      assert(
        await page.evaluate(
          () =>
            document.activeElement.tagName === "INPUT" ||
            document.activeElement.tagName === "BUTTON",
        ),
      );
    }
  for (const route of ["/account/recovery", "/account/create/applicant"]) {
    await page.setViewportSize({ width: 375, height: 1000 });
    await goto(route);
    await page.addStyleTag({ content: "html{font-size:200% !important}" });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await shot(
      (route.includes("applicant") ? "applicant" : "recovery") + "-200-text",
    );
  }
  assert.equal(errors.length, 0, errors.join("\n"));
  fs.writeFileSync(
    path.join(out, "verification.json"),
    JSON.stringify(
      {
        validation: true,
        popoverHoverFocusClickEscape: true,
        imageTypeSizeDecodeRemove: true,
        dropdowns: true,
        ticketPreview: true,
        applicationPreview: true,
        editPreservesValues: true,
        reloadClearsValues: true,
        noFormNetworkWrites: true,
        keyboard: true,
        text200Percent: true,
        layouts,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log("Browser verification passed.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
