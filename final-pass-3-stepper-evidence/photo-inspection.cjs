/* eslint-disable @typescript-eslint/no-require-imports -- Workstation visual verification. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
(async () => {
  const b = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  const p = await b.newPage();
  for (const width of [375, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    await p.goto("http://localhost:3000/account/create/applicant");
    await p.waitForLoadState("networkidle");
    const d = p.locator("dialog.demo-disclosure-dialog[open]");
    if (await d.count())
      await d
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
    await p.getByLabel("Applicant type").selectOption("Freshman");
    await p.getByLabel("Application cycle").selectOption("DCAT 2027");
    await p
      .getByLabel("First-choice program", { exact: false })
      .selectOption("BSIS");
    await p.getByRole("button", { name: "Continue", exact: true }).click();
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({
      path: `final-pass-3-stepper-evidence/photo-empty-${width}.png`,
      fullPage: true,
    });
    if (width === 375) {
      await p.getByRole("button", { name: "About this preview" }).click();
      await p.screenshot({
        path: "final-pass-3-stepper-evidence/yellow-info-open.png",
        fullPage: true,
      });
    }
  }
  await b.close();
  console.log("Photo and info captures complete.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
