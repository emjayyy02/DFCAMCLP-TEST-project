/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const { parseEnv } = require("node:util");
const { execFileSync } = require("node:child_process");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = "http://localhost:3108";
const out = path.join(process.cwd(), "docs/phase-4/fd8-after");
const key = "dfcamclp.demoDisclosure.ackVersion";
const result = {
  date: "1 October 2026 Asia/Taipei",
  startedAt: new Date().toISOString(),
  commit: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  dirtyStatus: execFileSync("git", ["status", "--short"], { encoding: "utf8" }),
  browser: "Microsoft Edge Chromium, isolated production preview on port 3108",
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
async function capture(p, id, group, state) {
  const filename = id + ".png";
  await p.screenshot({
    path: path.join(out, filename),
    fullPage: true,
    animations: "disabled",
  });
  result.captures.push({
    filename,
    capturedAt: new Date().toISOString(),
    group,
    route: new URL(p.url()).pathname + new URL(p.url()).search,
    viewport: p.viewportSize(),
    state,
    reducedMotion: await p.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    before:
      "FD6 fd6-after/manifest.json for shared surfaces; new disclosure/legal states have no previous rendered counterpart",
  });
}
async function width(p, label) {
  const m = await p.evaluate(() => ({
    width: innerWidth,
    document: document.documentElement.scrollWidth,
    headings: document.querySelectorAll("main h1").length,
  }));
  check(label + " page containment", m.document <= m.width, m);
  check(label + " one main heading", m.headings === 1, m.headings);
}
async function dialogCheck(p, label) {
  await p.locator(".demo-disclosure-dialog[open]").waitFor();
  const m = await p.evaluate(() => {
    const d = document.querySelector(".demo-disclosure-dialog"),
      b = d.querySelector(".demo-disclosure-body"),
      a = d.querySelector(".demo-disclosure-actions");
    const rect = d.getBoundingClientRect(),
      action = a.getBoundingClientRect();
    return {
      viewport: { width: innerWidth, height: innerHeight },
      rect: { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom },
      actionBottom: action.bottom,
      scrollable: b.scrollHeight > b.clientHeight,
      links: d.querySelectorAll("nav a").length,
      dialogs: document.querySelectorAll("dialog[open]").length,
      focus: document.activeElement.id,
      animation: getComputedStyle(d).animationDuration,
    };
  });
  check(
    label + " dialog fits/actions reachable",
    m.rect.x >= 15 &&
      m.rect.y >= 15 &&
      m.rect.right <= m.viewport.width - 15 &&
      m.rect.bottom <= m.viewport.height - 15 &&
      m.actionBottom <= m.rect.bottom,
    m,
  );
  check(
    label + " one dialog/four pre-acceptance legal links",
    m.dialogs === 1 && m.links === 4,
    m,
  );
  check(
    label + " named dialog/title initially focused",
    (await p.getByRole("dialog", { name: "About this demo" }).count()) === 1 &&
      m.focus === "demo-disclosure-title",
    m.focus,
  );
  await capture(
    p,
    "entry-initial-" + label.replaceAll(" ", "-"),
    "public",
    "Initial title focus and top of disclosure; internal body scroll exposes remaining paragraphs/links",
  );
  await p.keyboard.press("Shift+Tab");
  check(
    label + " reverse focus contained",
    await p.evaluate(() =>
      document.activeElement.textContent.includes("Enter demo"),
    ),
  );
  await p.keyboard.press("Tab");
  check(
    label + " forward focus contained",
    await p.evaluate(
      () => document.activeElement.textContent === "Project Disclaimer",
    ),
  );
  return m;
}
async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const contexts = [];
  async function context(options = {}) {
    const c = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      ...options,
    });
    contexts.push(c);
    return c;
  }
  try {
    for (const [w, h] of [
      [320, 812],
      [375, 812],
      [768, 900],
      [1440, 900],
      [1920, 1080],
      [812, 375],
    ]) {
      const c = await context({ viewport: { width: w, height: h } }),
        p = await c.newPage();
      p.on("pageerror", (e) =>
        result.errors.push({ name: "browser runtime", detail: e.message }),
      );
      await go(p, "/login?portal=STUDENT");
      await dialogCheck(p, "entry " + w + "x" + h);
      await capture(
        p,
        "entry-" + w + "x" + h,
        "public",
        "Fresh storage, Login deep link, title and four links, no acknowledgement",
      );
      await p
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
      check(
        "ack preserves query " + w,
        new URL(p.url()).search === "?portal=STUDENT",
      );
      check(
        "one exact storage item " + w,
        await p.evaluate(
          (k) =>
            Object.keys(localStorage).length === 1 &&
            localStorage.getItem(k) === "fd7-v1",
          key,
        ),
      );
      for (const route of [
        "disclaimer",
        "terms",
        "privacy",
        "acceptable-use",
      ]) {
        await go(p, "/" + route);
        await width(p, route + " " + w);
        check(
          route + " no automatic prompt " + w,
          (await p.locator("dialog[open]").count()) === 0,
        );
        check(
          route + " current notice link " + w,
          (await p
            .locator('.project-page-navigation a[aria-current="page"]')
            .count()) === 1,
        );
        if (h > 375)
          await capture(
            p,
            route + "-" + w,
            "public",
            "Public notice, reading hierarchy and footer wrapping",
          );
      }
      await c.close();
    }
    const c = await context(),
      p = await c.newPage();
    await go(p, "/programs?review=fd8");
    await p
      .getByRole("dialog")
      .getByRole("link", { name: "Privacy & Data Notice", exact: true })
      .click();
    await p.waitForURL(base + "/privacy");
    check(
      "legal link does not acknowledge",
      await p.evaluate((k) => localStorage.getItem(k) === null, key),
    );
    check(
      "legal navigation no dialog",
      (await p.locator("dialog[open]").count()) === 0,
    );
    await p.getByRole("link", { name: "Return to demo", exact: true }).click();
    await p.waitForURL(base + "/programs?review=fd8");
    await p.locator(".demo-disclosure-dialog[open]").waitFor();
    check("safe return keeps origin query and prompts", true);
    await p.keyboard.press("Escape");
    await p.waitForURL(base + "/disclaimer");
    check(
      "entry Escape exits without ack",
      await p.evaluate((k) => localStorage.getItem(k) === null, key),
    );
    await p.goBack({ waitUntil: "networkidle" });
    await p.locator(".demo-disclosure-dialog[open]").waitFor();
    const mutations = [];
    p.on("request", (r) => {
      if (r.method() !== "GET")
        mutations.push(r.method() + " " + new URL(r.url()).pathname);
    });
    await p
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
    await p.reload({ waitUntil: "networkidle" });
    check(
      "reload retains acknowledgement",
      (await p.locator("dialog[open]").count()) === 0,
    );
    const reopen = p
      .locator("footer")
      .getByRole("button", { name: "About this demo", exact: true });
    await reopen.click();
    check(
      "manual reopen offers Close only",
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
      "manual Escape returns focus",
      await reopen.evaluate((el) => el === document.activeElement),
    );
    check("ack/reopen no mutation requests", mutations.length === 0, mutations);
    const other = await c.newPage();
    await go(other, "/");
    check(
      "new tab reads version",
      (await other.locator("dialog[open]").count()) === 0,
    );
    for (const value of ["fd7-old", "malformed", null]) {
      await p.evaluate(
        ({ key, value }) =>
          value === null
            ? localStorage.removeItem(key)
            : localStorage.setItem(key, value),
        { key, value },
      );
      await p.reload({ waitUntil: "networkidle" });
      await p.locator(".demo-disclosure-dialog[open]").waitFor();
      check("old/malformed/cleared version prompts " + value, true);
      await p
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
    }
    await p.emulateMedia({ reducedMotion: "reduce" });
    await reopen.click();
    check(
      "reduced-motion immediate",
      await p
        .locator(".demo-disclosure-dialog")
        .evaluate((el) => getComputedStyle(el).animationDuration === "0s"),
    );
    await p.emulateMedia({ reducedMotion: "no-preference" });
    await p.emulateMedia({ reducedMotion: "reduce" });
    check(
      "mid-dialog preference settles",
      await p
        .locator(".demo-disclosure-dialog")
        .evaluate((el) => getComputedStyle(el).animationDuration === "0s"),
    );
    await p.keyboard.press("Escape");
    await go(p, "/privacy");
    async function enlarge(page) {
      return page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll("body *")).map(
          (el) => ({
            el,
            size: parseFloat(getComputedStyle(el).fontSize),
            height: parseFloat(getComputedStyle(el).lineHeight),
          }),
        );
        for (const { el, size, height } of nodes) {
          el.style.setProperty("font-size", size * 2 + "px", "important");
          if (Number.isFinite(height))
            el.style.setProperty("line-height", height * 2 + "px", "important");
        }
        return getComputedStyle(
          document.querySelector("article p, .demo-disclosure-body p"),
        ).fontSize;
      });
    }
    check(
      "200 percent body text really doubles",
      (await enlarge(p)) === "32px",
    );
    await width(p, "200 percent computed-text simulation");
    await capture(
      p,
      "privacy-text-enlargement",
      "public",
      "Every computed font size/line height doubled, preserving hierarchy; not physical browser/OS zoom",
    );
    await go(p, "/login");
    await reopen.click();
    await enlarge(p);
    const enlarged = await p
      .locator(".demo-disclosure-dialog")
      .evaluate((el) => ({
        rect: el.getBoundingClientRect().toJSON(),
        width: innerWidth,
        height: innerHeight,
        scrollable:
          el.querySelector(".demo-disclosure-body").scrollHeight >
          el.querySelector(".demo-disclosure-body").clientHeight,
      }));
    check(
      "200 percent dialog fits and internally scrolls",
      enlarged.rect.right <= enlarged.width &&
        enlarged.rect.bottom <= enlarged.height &&
        enlarged.scrollable,
      enlarged,
    );
    await capture(
      p,
      "disclosure-text-enlargement",
      "public",
      "Manual disclosure with every computed text size doubled",
    );
    await p.keyboard.press("Escape");
    const fail = await context();
    await fail.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new DOMException("Blocked", "SecurityError");
      };
      Storage.prototype.setItem = () => {
        throw new DOMException("Blocked", "SecurityError");
      };
    });
    const fp = await fail.newPage();
    await go(fp, "/");
    await fp
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
    check(
      "storage denied announces fallback",
      (await fp
        .getByRole("status")
        .filter({ hasText: "Understood for this visit" })
        .count()) === 1,
    );
    await fp
      .locator('header a[href="/admissions"]')
      .filter({ visible: true })
      .click();
    await fp.waitForURL(base + "/admissions");
    check(
      "storage denied navigation stays usable",
      (await fp.locator("dialog[open]").count()) === 0,
    );
    await fp.reload({ waitUntil: "networkidle" });
    await fp.locator(".demo-disclosure-dialog[open]").waitFor();
    check("storage denied reload prompts", true);
    const nojs = await context({ javaScriptEnabled: false }),
      np = await nojs.newPage();
    await go(np, "/");
    check(
      "noJS same-copy static fallback",
      (await np.locator(".disclosure-fallback").isVisible()) &&
        (await np
          .getByRole("link", { name: "Continue to page content" })
          .count()) === 1,
    );
    await capture(
      np,
      "nojs-home",
      "public",
      "No JavaScript static disclosure and working information links",
    );
    for (const route of ["disclaimer", "terms", "privacy", "acceptable-use"]) {
      await go(np, "/" + route);
      check(
        "noJS legal exemption " + route,
        (await np.locator(".disclosure-fallback").count()) === 0 &&
          (await np.locator("main h1").count()) === 1,
      );
    }
    const baseline = JSON.parse(
        fs.readFileSync("final-check-before-uiux/manifest.json", "utf8"),
      ),
      env = parseEnv(fs.readFileSync(".env", "utf8"));
    for (const account of baseline.accounts) {
      const ac = await context({ viewport: { width: 375, height: 812 } }),
        ap = await ac.newPage();
      const login = await ac.request.post(base + "/api/portal-login", {
        headers: { origin: base },
        data: {
          email: account.email,
          password: env.AUTH_SEED_PASSWORD,
          portal: account.memberships[0].portal,
        },
      });
      check(
        account.group + " real permitted login",
        login.ok(),
        login.status(),
      );
      if (!login.ok()) continue;
      const route = "/" + account.memberships[0].portal.toLowerCase();
      await go(ap, route);
      await ap.locator(".demo-disclosure-dialog[open]").waitFor();
      check(account.group + " authenticated direct entry", true);
      await ap
        .getByRole("button", { name: "I understand — Enter demo", exact: true })
        .click();
      await width(ap, account.group + " clean dashboard");
      check(
        account.group + " no generic Demo workspace",
        (await ap.getByText("Demo workspace", { exact: true }).count()) === 0,
      );
      check(
        account.group + " legal footer",
        (await ap
          .locator('footer nav[aria-label="Project information"] a')
          .count()) === 4,
      );
      if (
        [
          "applicant",
          "student",
          "faculty",
          "records",
          "operations",
          "technology",
        ].includes(account.group)
      )
        await capture(
          ap,
          account.group + "-clean-dashboard",
          account.group,
          "Acknowledged dashboard; global strip removed and legal footer accessible",
        );
      await ap.locator("summary.account-trigger").click();
      await ap
        .locator("details[open]")
        .getByRole("button", { name: "About this demo", exact: true })
        .click();
      check(
        account.group + " account menu closed for dialog",
        (await ap.locator("details[open]").count()) === 0,
      );
      await ap.keyboard.press("Escape");
      check(
        account.group + " focus restored to Account",
        await ap
          .locator("summary.account-trigger")
          .evaluate((el) => el === document.activeElement),
      );
      await ap.locator('footer a[href="/privacy"]').click();
      await ap.waitForURL(base + "/privacy");
      await ap
        .getByRole("link", { name: "Return to demo", exact: true })
        .click();
      await ap.waitForURL(base + route);
      check(
        account.group + " public notice roundtrip session retained",
        (await ap.locator("summary.account-trigger").count()) === 1,
      );
      await go(ap, "/account");
      check(
        account.group + " Account temporary-state helper",
        (await ap
          .getByText("Photo and bio are temporary in this tab.", {
            exact: false,
          })
          .count()) === 1,
      );
      if (account.group === "student") {
        await ap.evaluate((k) => localStorage.removeItem(k), key);
        await go(ap, "/technology");
        await ap.locator(".demo-disclosure-dialog[open]").waitFor();
        check(
          "signed-in denied direct entry does not grant access",
          (await ap
            .getByRole("heading", { name: "Access denied", exact: true })
            .count()) === 1,
        );
        await ap
          .getByRole("button", {
            name: "I understand — Enter demo",
            exact: true,
          })
          .click();
        check(
          "denied state legal footer",
          (await ap
            .locator('footer nav[aria-label="Project information"] a')
            .count()) === 4,
        );
        await capture(
          ap,
          "denied-student",
          "student",
          "Actual server-authorized denied area with shared legal footer",
        );
        await go(ap, "/account");
      }
      await ap.getByRole("button", { name: "Sign out", exact: true }).click();
      await ap.waitForURL(base + "/login");
      check(
        account.group + " sign-out keeps version",
        await ap.evaluate((k) => localStorage.getItem(k) === "fd7-v1", key),
      );
      check(
        account.group + " sign-out no repeat disclosure",
        (await ap.locator("dialog[open]").count()) === 0,
      );
      await ac.close();
    }
    const ec = await context(),
      ep = await ec.newPage();
    await go(ep, "/missing-fd8");
    await ep.locator(".demo-disclosure-dialog[open]").waitFor();
    check("404 entry disclosure", true);
    await ep
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
    check(
      "404 legal footer",
      (await ep
        .locator('footer nav[aria-label="Project information"] a')
        .count()) === 4,
    );
    await go(ep, "/student");
    check(
      "anonymous guard still redirects",
      new URL(ep.url()).pathname === "/login",
    );
  } finally {
    for (const c of contexts) await c.close().catch(() => {});
    await browser.close();
  }
}
run()
  .catch((e) =>
    result.errors.push({ name: "harness exception", detail: e.stack }),
  )
  .finally(() => {
    result.finishedAt = new Date().toISOString();
    fs.writeFileSync(
      path.join(out, "manifest.json"),
      JSON.stringify(result, null, 2),
    );
    console.log(
      JSON.stringify(
        {
          checks: result.checks.length,
          passed: result.checks.filter((c) => c.pass).length,
          captures: result.captures.length,
          errors: result.errors,
        },
        null,
        2,
      ),
    );
    process.exitCode = result.errors.length ? 1 : 0;
  });
