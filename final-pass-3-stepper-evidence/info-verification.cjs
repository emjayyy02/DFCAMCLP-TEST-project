/* eslint-disable @typescript-eslint/no-require-imports -- Workstation overlay verification. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const assert = require("node:assert/strict"),
  fs = require("node:fs");
(async () => {
  const b = await chromium.launch({
      executablePath:
        "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
      headless: true,
    }),
    p = await b.newPage();
  const results = [];
  for (const width of [320, 375, 768, 1440, 1920])
    for (const text200 of width === 375 ? [false, true] : [false]) {
      await p.setViewportSize({ width, height: 900 });
      await p.goto("http://localhost:3000/account/create/applicant");
      await p.waitForLoadState("networkidle");
      const d = p.locator("dialog.demo-disclosure-dialog[open]");
      if (await d.count())
        await d
          .getByRole("button", {
            name: "I understand — Enter demo",
            exact: true,
          })
          .click();
      if (text200)
        await p.addStyleTag({ content: "html{font-size:200% !important}" });
      const trigger = p.getByRole("button", { name: "About this preview" });
      await trigger.click();
      const box = await p
        .locator(".entry-title .preview-info-content")
        .boundingBox();
      assert(
        box.x >= 15 && box.x + box.width <= width - 15,
        JSON.stringify({ width, text200, box }),
      );
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await p.screenshot({
        path: `final-pass-3-stepper-evidence/info-open-${width}${text200 ? "-200-text" : ""}.png`,
        fullPage: true,
      });
      if (width === 375 && !text200)
        await p.screenshot({
          path: "final-pass-3-stepper-evidence/yellow-info-open.png",
          fullPage: true,
        });
      await trigger.press("Escape");
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
      await trigger.press("Tab");
      await p.mouse.move(0, 0);
      await trigger.hover();
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      await p.locator(".entry-title .preview-info-content").hover();
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      results.push({
        width,
        text200,
        left: box.x,
        right: box.x + box.width,
        hoverable: true,
      });
    }
  fs.writeFileSync(
    "final-pass-3-stepper-evidence/info-verification.json",
    JSON.stringify(results, null, 2),
  );
  await b.close();
  console.log("Open info bounds and hover verification passed.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
