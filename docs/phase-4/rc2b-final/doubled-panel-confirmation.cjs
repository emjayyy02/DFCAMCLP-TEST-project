/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const result = {
    checkedAt: new Date().toISOString(),
    scope: "Keyboard action visibility with doubled text simulation",
    checks: [],
  };
  try {
    for (const width of [375, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 375 ? 812 : 900 },
      });
      await context.addInitScript(() =>
        localStorage.setItem("dfcamclp.demoDisclosure.ackVersion", "fd7-v1"),
      );
      const p = await context.newPage();
      await p.goto("http://localhost:3109/login", { waitUntil: "networkidle" });
      await p
        .getByRole("button", { name: "View demo accounts", exact: true })
        .click();
      await p.evaluate(() => {
        const styles = [
          ...document.querySelectorAll("dialog[open],dialog[open] *"),
        ].map((e) => ({
          e,
          size: parseFloat(getComputedStyle(e).fontSize),
          line: parseFloat(getComputedStyle(e).lineHeight),
        }));
        for (const { e, size, line } of styles) {
          if (size) e.style.fontSize = size * 2 + "px";
          if (line) e.style.lineHeight = line * 2 + "px";
        }
      });
      for (let i = 0; i < 19; i++) {
        await p.keyboard.press("Tab");
        const state = await p.evaluate(() => {
          const e = document.activeElement,
            d = document.querySelector("dialog[open]"),
            r = e.getBoundingClientRect(),
            b = d.querySelector(".demo-accounts-body").getBoundingClientRect();
          const inBody = !!e.closest(".demo-accounts-body");
          return {
            label: e.getAttribute("aria-label") || e.textContent.trim(),
            contained: d.contains(e),
            visible:
              r.width > 0 &&
              r.height > 0 &&
              r.left >= 0 &&
              r.right <= innerWidth + 1 &&
              r.top >= 0 &&
              r.bottom <= innerHeight + 1 &&
              (!inBody || (r.top >= b.top - 1 && r.bottom <= b.bottom + 1)),
          };
        });
        result.checks.push({
          name: width + " doubled action " + i,
          pass: state.contained && state.visible,
          detail: state,
        });
      }
      await p.keyboard.press("Escape");
      result.checks.push({
        name: width + " doubled Escape returns focus",
        pass: await p
          .getByRole("button", { name: "View demo accounts", exact: true })
          .evaluate((e) => document.activeElement === e),
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  result.summary = {
    checks: result.checks.length,
    failed: result.checks.filter((c) => !c.pass).length,
  };
  fs.writeFileSync(
    __dirname + "/doubled-panel-confirmation.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result.summary));
  if (result.summary.failed) process.exitCode = 1;
}
run().catch(() => {
  console.error("Doubled panel check failed.");
  process.exitCode = 1;
});
