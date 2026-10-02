/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = "http://localhost:3108",
  out = path.join(process.cwd(), "docs/phase-4/fd8-after"),
  key = "dfcamclp.demoDisclosure.ackVersion";
const locked = JSON.parse(
  fs
    .readFileSync("src/features/disclosure/disclosure-content.ts", "utf8")
    .match(/export const disclosureParagraphs = (\[[\s\S]*?\]);/)[1]
    .replace(/,\s*]$/, "]"),
);
locked[2] = locked[2].replace(
  ", or institutional information",
  ", confidential, or institutional information",
);
const headings = [
  "Unofficial project",
  "Fictional demonstration data",
  "Do not enter real information",
  "Temporary demo state",
];
const result = {
  startedAt: new Date().toISOString(),
  commit: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  dirtyStatus: execFileSync("git", ["status", "--short"], { encoding: "utf8" }),
  browser:
    "Installed Edge Chromium / installed Playwright; production port 3108",
  before:
    "fd8-after/manifest.json and entry-initial-entry-* screenshots (original FD8)",
  sourceSHA256: Object.fromEntries(
    [
      "src/app/globals.css",
      "src/features/disclosure/demo-disclosure-provider.tsx",
    ].map((f) => [
      f,
      crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex"),
    ]),
  ),
  checks: [],
  captures: [],
  errors: [],
};
function check(name, pass, detail = "") {
  result.checks.push({ name, pass, detail });
  if (!pass) result.errors.push({ name, detail });
}
async function go(p, route) {
  await p.goto(base + route, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
}
async function capture(p, name, state) {
  const file = "correction-" + name + ".png";
  await p.screenshot({
    path: path.join(out, file),
    fullPage: true,
    animations: "disabled",
  });
  result.captures.push({
    file,
    route: new URL(p.url()).pathname + new URL(p.url()).search,
    viewport: p.viewportSize(),
    state,
    capturedAt: new Date().toISOString(),
    reducedMotion: await p.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  });
}
async function fit(p, label) {
  const m = await p.locator(".demo-disclosure-dialog").evaluate((d) => {
    const r = d.getBoundingClientRect(),
      a = d.querySelector(".demo-disclosure-actions").getBoundingClientRect(),
      b = d.querySelector(".demo-disclosure-body");
    return {
      viewport: { w: innerWidth, h: innerHeight },
      rect: { x: r.x, y: r.y, right: r.right, bottom: r.bottom },
      actionBottom: a.bottom,
      document: document.documentElement.scrollWidth,
      dialogWidth: d.clientWidth,
      dialogScrollWidth: d.scrollWidth,
      bodyWidth: b.clientWidth,
      bodyScrollWidth: b.scrollWidth,
      bodyScrollable: b.scrollHeight > b.clientHeight,
    };
  });
  check(
    label + " viewport and horizontal containment",
    m.rect.x >= 15 &&
      m.rect.y >= 15 &&
      m.rect.right <= m.viewport.w - 15 &&
      m.rect.bottom <= m.viewport.h - 15 &&
      m.document <= m.viewport.w &&
      m.dialogScrollWidth <= m.dialogWidth &&
      m.bodyScrollWidth <= m.bodyWidth &&
      m.actionBottom <= m.rect.bottom,
    m,
  );
  return m;
}
async function enlarge(p) {
  return p.evaluate(() => {
    const nodes = [...document.querySelectorAll("body *")].map((el) => ({
      el,
      size: parseFloat(getComputedStyle(el).fontSize),
      line: parseFloat(getComputedStyle(el).lineHeight),
    }));
    for (const { el, size, line } of nodes) {
      el.style.setProperty("font-size", size * 2 + "px", "important");
      if (Number.isFinite(line))
        el.style.setProperty("line-height", line * 2 + "px", "important");
    }
    return getComputedStyle(document.querySelector(".demo-disclosure-point p"))
      .fontSize;
  });
}
async function run() {
  const b = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  try {
    for (const [w, h] of [
      [320, 812],
      [375, 812],
      [768, 900],
      [1440, 900],
      [1920, 1080],
      [812, 375],
    ]) {
      const c = await b.newContext({ viewport: { width: w, height: h } }),
        p = await c.newPage();
      p.on("pageerror", (e) =>
        result.errors.push({ name: "runtime", detail: e.message }),
      );
      await go(p, "/login?portal=STUDENT");
      await p.locator("dialog[open]").waitFor();
      await fit(p, w + "x" + h);
      check(
        w + " named dialog",
        (await p.getByRole("dialog", { name: "About this demo" }).count()) ===
          1,
      );
      check(
        w + " four semantic rows",
        JSON.stringify(
          await p.locator(".demo-disclosure-point h3").allTextContents(),
        ) === JSON.stringify(headings),
      );
      check(
        w + " factual meaning / locked copy retained",
        JSON.stringify(
          await p
            .locator(".demo-disclosure-point p")
            .allTextContents()
            .then((x) => x.map((t) => t.trim())),
        ) === JSON.stringify(locked),
      );
      check(
        w + " symbols hidden from assistive technology",
        (await p
          .locator(".demo-disclosure-symbol[aria-hidden=true]")
          .count()) === 5,
      );
      check(
        w + " centered header and no input-like title frame",
        await p
          .locator("#demo-disclosure-title")
          .evaluate(
            (el) =>
              document.activeElement === el &&
              getComputedStyle(el).outlineStyle === "none" &&
              parseFloat(getComputedStyle(el).borderTopWidth) === 0 &&
              getComputedStyle(el.parentElement).textAlign === "center",
          ),
      );
      check(
        w + " exact supporting sentence",
        (await p.locator("#demo-disclosure-summary").textContent()) ===
          "Please review these project boundaries before exploring the demo.",
      );
      const columns = await p
        .locator(".demo-disclosure-body nav")
        .evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
        );
      check(
        w + " legal group responsive columns",
        columns === (w <= 600 ? 1 : 2),
        columns,
      );
      check(
        w + " Learn more resource group",
        (await p
          .getByRole("navigation", { name: "Learn more", exact: true })
          .count()) === 1,
      );
      check(
        w + " legal links underlined",
        await p
          .locator(".demo-disclosure-body nav a")
          .evaluateAll(
            (els) =>
              els.length === 4 &&
              els.every((el) =>
                getComputedStyle(el).textDecorationLine.includes("underline"),
              ),
          ),
      );
      await capture(
        p,
        w + "x" + h + "-top",
        "Initial header/title focus and scannable points",
      );
      await p.keyboard.press("Shift+Tab");
      check(
        w + " reverse focus trap",
        await p.evaluate(() =>
          document.activeElement.textContent.includes("Enter demo"),
        ),
      );
      await p.keyboard.press("Tab");
      check(
        w + " forward focus trap",
        await p.evaluate(
          () => document.activeElement.textContent === "Project Disclaimer",
        ),
      );
      check(
        w + " visible link keyboard focus",
        await p
          .locator(".demo-disclosure-body nav a")
          .first()
          .evaluate((el) => getComputedStyle(el).outlineStyle !== "none"),
      );
      await capture(
        p,
        w + "x" + h + "-resources",
        "Keyboard focus at pre-acknowledgement resources; body internally scrolled",
      );
      await p.keyboard.press("Escape");
      await p.waitForURL(base + "/disclaimer");
      check(
        w + " entry Escape no acknowledgement",
        await p.evaluate((k) => localStorage.getItem(k) === null, key),
      );
      await p
        .getByRole("link", { name: "Return to demo", exact: true })
        .click();
      await p.waitForURL(base + "/login?portal=STUDENT");
      await p.locator("dialog[open]").waitFor();
      for (const route of [
        "disclaimer",
        "terms",
        "privacy",
        "acceptable-use",
      ]) {
        await p.locator('dialog nav a[href="/' + route + '"]').click();
        await p.waitForURL(base + "/" + route);
        check(
          w + " legal " + route + " before ack",
          (await p.locator("dialog[open]").count()) === 0 &&
            (await p.evaluate((k) => localStorage.getItem(k) === null, key)),
        );
        await p
          .getByRole("link", { name: "Return to demo", exact: true })
          .click();
        await p.waitForURL(base + "/login?portal=STUDENT");
        await p.locator("dialog[open]").waitFor();
      }
      await p
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
      check(
        w + " exact version and original query",
        (await p.evaluate((k) => localStorage.getItem(k) === "fd7-v1", key)) &&
          new URL(p.url()).search === "?portal=STUDENT",
      );
      const trigger = p
        .locator("footer")
        .getByRole("button", { name: "About this demo", exact: true });
      await trigger.click();
      check(
        w + " manual mode Close only",
        (await p
          .getByRole("dialog")
          .getByRole("button", { name: "Close", exact: true })
          .count()) === 1 &&
          (await p
            .getByRole("button", {
              name: "I understand — Enter demo",
              exact: true,
            })
            .count()) === 0,
      );
      await p.keyboard.press("Escape");
      check(
        w + " manual Escape restores focus",
        await trigger.evaluate((el) => document.activeElement === el),
      );
      await trigger.click();
      await p
        .getByRole("dialog")
        .getByRole("button", { name: "Close", exact: true })
        .click();
      check(
        w + " manual Close restores focus",
        await trigger.evaluate((el) => document.activeElement === el),
      );
      await p.reload({ waitUntil: "networkidle" });
      check(
        w + " reload no repeat",
        (await p.locator("dialog[open]").count()) === 0,
      );
      await c.close();
    }
    for (const [w, h] of [
      [375, 812],
      [1440, 900],
    ]) {
      const c = await b.newContext({
          viewport: { width: w, height: h },
          reducedMotion: "reduce",
        }),
        p = await c.newPage();
      await go(p, "/login");
      await p.locator("dialog[open]").waitFor();
      check(w + " doubled body really 32px", (await enlarge(p)) === "32px");
      const m = await fit(p, w + " doubled text");
      check(w + " doubled body scrolls", m.bodyScrollable);
      check(
        w + " reduced motion immediate",
        await p
          .locator("dialog")
          .evaluate((el) => getComputedStyle(el).animationDuration === "0s"),
      );
      await capture(
        p,
        w + "-doubled-top",
        "Every computed text size/line height doubled; reduced motion; title initial focus",
      );
      await p.keyboard.press("Shift+Tab");
      await p.keyboard.press("Tab");
      await capture(
        p,
        w + "-doubled-resources",
        "Doubled text, pre-acknowledgement legal links reached by keyboard",
      );
      await p
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
      check(
        w + " doubled CTA works",
        (await p.locator("dialog[open]").count()) === 0,
      );
      await c.close();
    }
    const c = await b.newContext(),
      p = await c.newPage();
    await go(p, "/login");
    await p.locator("dialog[open]").waitFor();
    await p.getByRole("link", { name: "Leave demo", exact: true }).click();
    await p.waitForURL(base + "/disclaimer");
    check(
      "Leave demo preserves unacknowledged state",
      await p.evaluate((k) => localStorage.getItem(k) === null, key),
    );
    await c.close();
  } catch (e) {
    result.errors.push({ name: "harness exception", detail: e.message });
  } finally {
    await b.close();
    result.finishedAt = new Date().toISOString();
    fs.writeFileSync(
      path.join(out, "correction-manifest.json"),
      JSON.stringify(result, null, 2) + "\n",
    );
    process.stdout.write(
      JSON.stringify(
        {
          checks: result.checks.length,
          passed: result.checks.filter((x) => x.pass).length,
          captures: result.captures.length,
          errors: result.errors,
        },
        null,
        2,
      ) + "\n",
    );
    process.exitCode = result.errors.length ? 1 : 0;
  }
}
run();
