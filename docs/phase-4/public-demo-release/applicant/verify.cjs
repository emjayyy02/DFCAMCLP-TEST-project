/* eslint-disable @typescript-eslint/no-require-imports -- Workstation browser verification. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { parseEnv } = require("node:util");
const out = path.resolve("docs/phase-4/public-demo-release/applicant"),
  base = "http://localhost:3122";
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
  const c = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    }),
    p = await c.newPage();
  const errors = [],
    writes = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("request", (r) => {
    if (r.method() !== "GET") writes.push(r.url());
  });
  async function settle() {
    await p.waitForLoadState("networkidle");
    const d = p.locator("dialog.demo-disclosure-dialog[open]");
    if (await d.count())
      await d
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
  }
  async function start() {
    await p.goto(base + "/account/create/applicant");
    await settle();
  }
  async function shot(name) {
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(100);
    await p.screenshot({
      path: path.join(out, name + ".png"),
      fullPage: true,
      animations: "disabled",
    });
  }
  async function next() {
    await p.getByRole("button", { name: "Continue", exact: true }).click();
  }
  async function fill1(type = "Freshman") {
    await p.getByLabel("Applicant type").selectOption(type);
    await p.getByLabel("Application cycle").selectOption("DCAT 2027");
    await p
      .getByLabel("First-choice program", { exact: false })
      .selectOption("BSIS");
  }
  async function fill2() {
    for (const [k, v] of Object.entries({
      firstName: "Juan",
      lastName: "Dela Cruz",
      birthDate: "2005-01-02",
      nationality: "Filipino",
    }))
      await p.locator(`[name=${k}]`).fill(v);
    await p.getByLabel("Sex").selectOption("Male");
  }
  async function photo() {
    await p
      .getByRole("button", { name: "Add demo photo", exact: true })
      .click();
    const d = p.getByRole("dialog", {
      name: "Demo profile photo",
      exact: true,
    });
    assert.equal(
      await d
        .getByRole("button", { name: "Choose image", exact: true })
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await d.getByLabel("Choose demo profile image").setInputFiles({
      name: "fictional-avatar.png",
      mimeType: "image/png",
      buffer: png,
    });
    await d.getByRole("button", { name: "Use photo", exact: true }).click();
    await p
      .getByRole("button", { name: "Change demo photo", exact: true })
      .waitFor();
  }
  async function fill3() {
    for (const [k, v] of Object.entries({
      email: "juan.delacruz@example.invalid",
      mobile: "+63 912 000 0000",
      guardian: "Maria Example",
      guardianContact: "09120000001",
      city: "Sample City",
      barangay: "Sample Barangay",
      mother: "Example Mother",
      father: "Example Father",
    }))
      await p.locator(`[name=${k}]`).fill(v);
  }
  await start();
  const info = p.getByRole("button", { name: "About this preview" });
  await info.hover();
  assert.equal(await info.getAttribute("aria-expanded"), "true");
  await info.press("Escape");
  await info.focus();
  await info.click();
  assert.equal(await info.getAttribute("aria-expanded"), "true");
  await info.press("Escape");
  assert.equal(
    await p
      .getByRole("button", { name: "Personal details", exact: false })
      .isDisabled(),
    true,
  );
  await next();
  assert(
    await p
      .getByRole("alert")
      .filter({ hasText: "Check the highlighted fields." })
      .isVisible(),
  );
  assert.equal(await p.locator("[name=firstName]").count(), 0);
  await fill1("Transferee");
  assert(
    await p
      .getByText("Demo follow-up focus: Prior college background.", {
        exact: false,
      })
      .isVisible(),
  );
  await fill1("Returnee");
  assert(
    await p
      .getByText("Demo follow-up focus: Prior enrollment background.", {
        exact: false,
      })
      .isVisible(),
  );
  await fill1();
  await p
    .getByLabel("First-choice program", { exact: false })
    .selectOption("BSBA");
  await next();
  assert(await p.locator("#entry-major-error").isVisible());
  await p.getByLabel("BSBA major").selectOption("Marketing Management");
  await p
    .getByLabel("First-choice program", { exact: false })
    .selectOption("BSIS");
  assert.equal(await p.locator("#entry-major").count(), 0);
  await next();
  await next();
  assert(await p.locator("#entry-photo-error").isVisible());
  await fill2();
  await p.locator("[name=firstName]").fill("12345");
  await next();
  assert(await p.locator("#entry-firstName-error").isVisible());
  await fill2();
  await next();
  assert(await p.locator("#entry-photo-error").isVisible());
  const centered = await p
    .locator(".entry-photo-area .demo-photo-control")
    .boundingBox();
  const form = await p.locator(".entry-photo-area").boundingBox();
  assert(
    Math.abs(centered.x + centered.width / 2 - (form.x + form.width / 2)) < 1,
  );
  await p.getByRole("button", { name: "Add demo photo", exact: true }).click();
  let d = p.getByRole("dialog", { name: "Demo profile photo", exact: true });
  await d.getByLabel("Choose demo profile image").setInputFiles({
    name: "oversize.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
  });
  assert(await d.locator("[role=alert]").isVisible());
  await d.getByRole("button", { name: "Cancel", exact: true }).click();
  assert.equal(
    await p
      .getByRole("button", { name: "Add demo photo", exact: true })
      .evaluate((e) => e === document.activeElement),
    true,
  );
  await photo();
  await p
    .getByRole("button", { name: "Change demo photo", exact: true })
    .click();
  await p.getByRole("button", { name: "Remove photo", exact: true }).click();
  await next();
  assert(await p.locator("#entry-photo-error").isVisible());
  await photo();
  await next();
  await fill3();
  for (const name of ["mother", "father", "guardian"]) {
    await p.locator(`[name=${name}]`).fill("98765");
    await next();
    assert(await p.locator(`#entry-${name}-error`).isVisible());
    await fill3();
  }
  for (const name of ["city", "barangay"]) {
    await p.locator(`[name=${name}]`).fill("");
    await next();
    assert(await p.locator(`#entry-${name}-error`).isVisible());
    await fill3();
  }
  await p
    .getByRole("button", { name: "Preview email code", exact: true })
    .click();
  await p.getByLabel("Preview code", { exact: true }).fill("000000");
  await p
    .getByRole("button", { name: "Check preview code", exact: true })
    .click();
  assert(
    await p.getByText("Enter the displayed six-digit sample code.").isVisible(),
  );
  await p.getByLabel("Preview code", { exact: true }).fill("123456");
  await p
    .getByRole("button", { name: "Check preview code", exact: true })
    .click();
  assert(
    await p
      .getByText("Local preview checked. No real email verification occurred.")
      .isVisible(),
  );
  await p.locator("[name=email]").fill("juan.changed@example.invalid");
  assert.equal(await p.getByLabel("Preview code", { exact: true }).count(), 0);
  await fill3();
  await next();
  await p
    .getByRole("button", { name: "Generate demo account", exact: true })
    .click();
  assert(
    await p
      .getByText(
        "Check both declarations to generate the demo account preview.",
      )
      .isVisible(),
  );
  await p.getByRole("button", { name: "Edit step 2", exact: true }).click();
  assert.equal(await p.locator("[name=firstName]").inputValue(), "Juan");
  await p.locator("[name=firstName]").fill("");
  await p
    .getByRole("button", {
      name: "Review, consent and account generation",
      exact: false,
    })
    .click();
  assert(await p.locator("#entry-firstName-error").isVisible());
  await fill2();
  await next();
  await next();
  const checks = p.locator("input[type=checkbox]");
  await checks.nth(0).check();
  await checks.nth(1).check();
  await p
    .getByRole("button", { name: "Generate demo account", exact: true })
    .click();
  assert(
    await p
      .getByRole("heading", { name: "Demo account preview ready", exact: true })
      .isVisible(),
  );
  assert.match(
    await p.locator(".entry-complete").innerText(),
    /SAMPLE-DCAT2027-[A-F0-9]{8}/,
  );
  assert(
    await p
      .getByText(
        "Local preview only. No sign-in account or school application was created.",
      )
      .isVisible(),
  );
  assert.equal(writes.length, 0);
  const layouts = [];
  for (const width of [320, 375, 768, 1440, 1920]) {
    await p.setViewportSize({
      width,
      height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
    });
    await start();
    for (let step = 1; step <= 4; step++) {
      if (step === 1) await fill1();
      if (step === 2) {
        await fill2();
        await photo();
      }
      if (step === 3) await fill3();
      const measurement = await p.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        step: document.querySelector("[aria-current=step]").innerText,
        focus: document.activeElement.tagName,
      }));
      assert(measurement.scroll <= width, JSON.stringify(measurement));
      layouts.push(measurement);
      await shot("step-" + step + "-" + width);
      if (step < 4) await next();
    }
    await p.locator("input[type=checkbox]").nth(0).check();
    await p.locator("input[type=checkbox]").nth(1).check();
    await p
      .getByRole("button", { name: "Generate demo account", exact: true })
      .click();
    await shot("complete-" + width);
  }
  await p.setViewportSize({ width: 375, height: 812 });
  await start();
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.addStyleTag({ content: "html{font-size:200% !important}" });
  assert(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  await shot("stepper-200-text");
  await p.reload();
  await settle();
  assert.equal(await p.getByLabel("Applicant type").inputValue(), "");
  const env = parseEnv(fs.readFileSync(".env", "utf8"));
  const profiles = [];
  for (const account of [
    {
      email: "johnpaul.reyes@example.invalid",
      portal: "STUDENT",
      name: "John Paul Reyes",
      slug: "student",
    },
    {
      email: "juan.delacruz@example.invalid",
      portal: "APPLICANT",
      name: "Juan Dela Cruz",
      slug: "applicant",
    },
    {
      email: "maria.santos@example.invalid",
      portal: "ACADEMIC",
      name: "Maria Santos",
      slug: "academic",
    },
  ]) {
    const session = await browser.newContext(),
      page = await session.newPage();
    const response = await session.request.post(base + "/api/portal-login", {
      headers: { origin: base },
      data: {
        email: account.email,
        password: env.AUTH_SEED_PASSWORD,
        portal: account.portal,
      },
    });
    assert.equal(response.status(), 200);
    for (const width of account.slug === "student"
      ? [320, 375, 768, 1440, 1920]
      : [375, 1440]) {
      await page.setViewportSize({
        width,
        height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
      });
      await page.goto(base + "/account");
      await page.waitForLoadState("networkidle");
      const disclosure = page.locator("dialog.demo-disclosure-dialog[open]");
      if (await disclosure.count())
        await disclosure
          .getByRole("button", {
            name: "I understand — Enter demo",
            exact: true,
          })
          .click();
      const box = await page.locator(".demo-photo-control").boundingBox(),
        disk = await page.locator(".demo-photo-trigger > span").boundingBox(),
        target = await page.locator(".demo-photo-trigger").boundingBox();
      assert(target.width >= 44 && target.height >= 44);
      assert(Math.abs(disk.x + disk.width - (box.x + box.width)) < 1);
      assert(Math.abs(disk.y + disk.height - (box.y + box.height)) < 1);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert(await page.getByText(account.name, { exact: true }).isVisible());
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(out, "account-" + account.slug + "-" + width + ".png"),
        fullPage: true,
      });
      profiles.push({ identity: account.name, width, bottomRight: true });
    }
    await page
      .getByRole("button", { name: "Add demo photo", exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "Demo profile photo", exact: true })
      .getByLabel("Choose demo profile image")
      .setInputFiles({
        name: "fictional-profile.png",
        mimeType: "image/png",
        buffer: png,
      });
    await page.getByRole("button", { name: "Use photo", exact: true }).click();
    assert(
      await page
        .getByRole("button", { name: "Change demo photo", exact: true })
        .isVisible(),
    );
    await page
      .getByRole("button", { name: "Change demo photo", exact: true })
      .click();
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .getByRole("button", { name: "Change demo photo", exact: true })
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await session.close();
  }
  assert.equal(errors.length, 0, errors.join("\n"));
  fs.writeFileSync(
    path.join(out, "verification.json"),
    JSON.stringify(
      {
        stepper: true,
        requiredBlocks: true,
        numericNamesBlocked: true,
        cityBarangayRequired: true,
        photoRequired: true,
        centeredPhoto: true,
        photoDialogValidationRemoveFocus: true,
        reviewEdits: true,
        consentBlocks: true,
        applicationNumber: true,
        emailCodePreview: true,
        emailEditResetsCode: true,
        noEntryNetworkWrites: true,
        reloadReset: true,
        text200: true,
        reducedMotion: true,
        layouts,
        profiles,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log("Stepper and profile browser verification passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
