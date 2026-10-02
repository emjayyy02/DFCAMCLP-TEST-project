/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars -- Established self-contained browser capture recipes retain shared helpers. */

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const { parseEnv } = require("node:util");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root = process.cwd(),
  out = path.join(root, "final-check-pass-4"),
  base = "http://localhost:3001";
fs.mkdirSync(out, { recursive: true });
const baselineFiles = cp
  .execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  )
  .split("\0")
  .filter(
    (f) =>
      f &&
      !f.startsWith("final-check-before-uiux/") &&
      !f.startsWith("final-check-pass-4/") &&
      !f.startsWith("final-pass-4-evidence/"),
  );
const hash = (f) =>
  fs.existsSync(path.join(root, f))
    ? crypto
        .createHash("sha256")
        .update(fs.readFileSync(path.join(root, f)))
        .digest("hex")
    : null;
const baselinePath = path.join(out, "source-integrity-before.json");
const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, "utf8"))
  : Object.fromEntries(baselineFiles.map((f) => [f, hash(f)]));
fs.writeFileSync(
  path.join(out, "source-integrity-before.json"),
  JSON.stringify(baseline, null, 2),
);
const env = parseEnv(fs.readFileSync(path.join(root, ".env"), "utf8"));
const identityAccounts = require(
  path.join(root, "src/server/db/seed/data.ts"),
).developmentAuthAccountSeed;
const seed = fs
  .readFileSync(
    path.join(root, "src/server/access-control/seed-data.ts"),
    "utf8",
  )
  .replace(
    /email: developmentAuthAccountSeed\[(\d+)\]\.email/g,
    (_, i) => "email: " + JSON.stringify(identityAccounts[Number(i)].email),
  );
const accountGroups = {
  "johnpaul.reyes@example.invalid": "student",
  "juan.delacruz@example.invalid": "applicant",
  "maria.santos@example.invalid": "faculty",
  "jose.garcia@example.invalid": "records",
  "mark.ramos@example.invalid": "operations",
  "angelo.cruz@example.invalid": "technology",
  "angelica.bautista@example.invalid": "coordinator",
  "marygrace.mendoza@example.invalid": "school-admin",
  "michael.castro@example.invalid": "faculty-it",
};
const nav = fs.readFileSync(
  path.join(root, "src/server/access-control/navigation.ts"),
  "utf8",
);
const memberships = [
  ...seed
    .slice(seed.indexOf("export const membershipSeed"))
    .matchAll(/email: "([^"]+)",\s*portal: "([^"]+)",\s*role: "([^"]+)"/g),
].map((m) => ({ email: m[1], portal: m[2], role: m[3] }));
const rolePermissions = Object.fromEntries(
  [
    ...seed
      .slice(
        seed.indexOf("export const rolePermissionSeed"),
        seed.indexOf("export const membershipSeed"),
      )
      .matchAll(/(\w+): \[([\s\S]*?)\]/g),
  ].map((m) => [m[1], [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1])]),
);
const routes = [
  ...nav.matchAll(/path: "([^"]+)"[\s\S]*?permission: "([^"]+)"/g),
].map((m) => ({ path: m[1], permission: m[2] }));
const manifest = fs.existsSync(path.join(out, "manifest.json"))
  ? JSON.parse(fs.readFileSync(path.join(out, "manifest.json"), "utf8"))
  : {
      startedAt: new Date().toISOString(),
      baseURL: base,
      desktop: { width: 1920, height: 1080 },
      mobile: { width: 375, height: 812 },
      browser: "Microsoft Edge (Chromium), headless, deviceScaleFactor 1",
      routeInventory: routes.map((x) => x.path),
      accounts: [],
      captures: [],
      failures: [],
    };
manifest.captureRecoveries = (manifest.captureRecoveries || []).concat(
  manifest.failures.filter((f) => !f.fatal),
);
manifest.failures = [];
let count = manifest.captures.length,
  browser;
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 140);
const save = () =>
  fs.writeFileSync(
    path.join(out, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
const safeError = (e) =>
  String(e.message || e)
    .split("\n")
    .slice(0, 3)
    .join(" ")
    .slice(0, 400);

function setupPage(page) {
  const original = page.goto.bind(page);
  let visits = 0;
  page.goto = async (...args) => {
    const response = await original(...args);
    visits++;
    if (!(visits === 1 && args[0] === base + "/"))
      await acknowledgeDisclosure(page);
    return response;
  };
  return page;
}
async function applicantEntry(page) {
  await page.getByLabel("Applicant type").selectOption("Freshman");
  await page.getByLabel("Application cycle").selectOption("DCAT 2027");
  await page
    .getByLabel("First-choice program", { exact: false })
    .selectOption("BSBA");
  await shot(page, "public", "Applicant entry - BSBA major selection", {
    state: "conditional-form",
  });
  await page
    .getByLabel("BSBA major", { exact: false })
    .selectOption({ index: 1 });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await shot(page, "public", "Applicant entry - Personal details", {
    state: "entry-personal",
  });
  for (const [name, value] of Object.entries({
    firstName: "Juan",
    lastName: "Dela Cruz",
    birthDate: "2008-05-12",
    nationality: "Filipino",
  }))
    await page.locator('[name="' + name + '"]').fill(value);
  await page.getByLabel("Sex", { exact: false }).selectOption("Male");
  await page
    .getByRole("button", { name: "Add demo photo", exact: true })
    .click();
  await page.locator('input[type="file"]').setInputFiles({
    name: "fictional-preview.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aCioAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.getByRole("button", { name: "Use photo", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const [name, value] of Object.entries({
    email: "juan.delacruz@example.invalid",
    mobile: "09170000000",
    guardian: "Rosa Dela Cruz",
    guardianContact: "09170000001",
    city: "Sample City",
    barangay: "Barangay 12",
  }))
    await page.locator('[name="' + name + '"]').fill(value);
  await shot(page, "public", "Applicant entry - Contact details", {
    state: "entry-contact",
  });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await shot(page, "public", "Applicant entry - Review", {
    state: "entry-review",
  });
  for (const input of await page.locator('input[type="checkbox"]').all())
    await input.check();
  await page
    .getByRole("button", { name: "Generate demo account", exact: true })
    .click();
  await shot(page, "public", "Applicant entry - Preview result", {
    state: "entry-preview",
  });
}

async function acknowledgeDisclosure(page) {
  const gate = page.locator("dialog.demo-disclosure-dialog[open]");
  await gate.waitFor({ state: "visible", timeout: 7000 }).catch(() => {});
  if (await gate.count())
    await gate
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
}
async function settle(page) {
  await page
    .waitForLoadState("networkidle", { timeout: 12000 })
    .catch(() => {});
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) =>
        i.complete
          ? Promise.resolve()
          : new Promise((r) => {
              i.addEventListener("load", r, { once: true });
              i.addEventListener("error", r, { once: true });
              setTimeout(r, 4000);
            }),
      ),
    );
  });
  await page.waitForTimeout(100);
}
async function shot(page, group, label, meta = {}) {
  if (
    manifest.captures.some(
      (c) => c.group === group && c.label === label && c.url === page.url(),
    )
  )
    return;
  const id = String(++count).padStart(4, "0") + "-" + slug(label),
    entry = {
      id,
      group,
      label,
      url: page.url(),
      ...meta,
      files: [],
      dimensions: {},
      capturedAt: new Date().toISOString(),
    };
  for (const [size, viewport] of [
    ["desktop-1920x1080", manifest.desktop],
    ["desktop-1440x900", { width: 1440, height: 900 }],
    ["tablet-1024x768", { width: 1024, height: 768 }],
    ["tablet-768x900", { width: 768, height: 900 }],
    ["mobile-390x844", { width: 390, height: 844 }],
    ["mobile-375x812", manifest.mobile],
    ["mobile-360x800", { width: 360, height: 800 }],
    ["mobile-320x812", { width: 320, height: 812 }],
  ]) {
    await page.setViewportSize(viewport);
    await settle(page);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      for (const d of document.querySelectorAll("dialog[open]"))
        d.scrollTop = 0;
    });
    const folder = path.join(out, size, group);
    fs.mkdirSync(folder, { recursive: true });
    const add = async (suffix, fullPage = false) => {
      const file = path.join(folder, id + suffix + ".png");
      await page.screenshot({
        path: file,
        fullPage,
        animations: "disabled",
        timeout: 30000,
      });
      const png = fs.readFileSync(file);
      const rel = path.relative(out, file).split(path.sep).join("/");
      entry.files.push(rel);
      entry.dimensions[rel] = {
        width: png.readUInt32BE(16),
        height: png.readUInt32BE(20),
      };
    };
    await add("--viewport");
    const metrics = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      ),
      viewport: window.innerWidth,
      heading: document.querySelector("h1")?.textContent || "",
      missingImages: [...document.images]
        .filter((i) => !i.naturalWidth)
        .map((i) => i.getAttribute("src")),
    }));
    entry[size] = metrics;
    if (metrics.height > viewport.height + 1 || size.startsWith("desktop-"))
      await add("--full-page", true);
    const dialog = page.locator("dialog[open]").first();
    if (await dialog.count()) {
      const more = await dialog.evaluate(
        (d) => d.scrollHeight > d.clientHeight + 10,
      );
      if (more) {
        await dialog.evaluate((d) => (d.scrollTop = d.scrollHeight));
        await add("--dialog-bottom");
        await dialog.evaluate((d) => (d.scrollTop = 0));
      }
    }
  }
  await page.setViewportSize(manifest.desktop);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(80);
  manifest.captures.push(entry);
  save();
  console.log(
    JSON.stringify({
      capture: count,
      group,
      label,
      url: new URL(page.url()).pathname + new URL(page.url()).search,
      images: entry.files.length,
    }),
  );
}
function canonical(href, allowed) {
  try {
    const u = new URL(href, base);
    if (u.origin !== base || !allowed.has(u.pathname)) return null;
    const keys = [
      "record",
      "offering",
      "date",
      "request",
      "employee",
      "ticket",
      "queue",
      "view",
    ];
    const q = new URLSearchParams();
    for (const k of keys)
      if (u.searchParams.has(k)) q.set(k, u.searchParams.get(k));
    return u.pathname + (q.size ? "?" + q.toString() : "");
  } catch {
    return null;
  }
}
async function gather(page, queue, seen, allowed) {
  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((es) => es.map((e) => e.getAttribute("href")));
  for (const h of hrefs) {
    const c = canonical(h, allowed);
    if (c && !seen.has(c) && !queue.includes(c)) queue.push(c);
  }
  // These queues use a selectable row rather than a URL link. Preserve each detail explicitly.
  const pathname = new URL(page.url()).pathname;
  if (/^\/records\/(dcat|enrollment|documents)$/.test(pathname)) {
    const texts = await page
      .locator("button.records-select-row")
      .allTextContents();
    for (const t of texts) {
      const m = t.match(/DEMO-(?:APP|STU)-[A-Z0-9-]+|APP-TEST-\d+/);
      if (m) {
        const c = pathname + "?record=" + encodeURIComponent(m[0]);
        if (!seen.has(c) && !queue.includes(c)) queue.push(c);
      }
    }
  }
}
async function previewButtons(page, group, label) {
  const candidates = page.locator('main button, main [role="button"]').filter({
    hasText:
      /^(Preview (?:DCAT|COE|COR) form|View sample (?:COE|COR)|Preview sample|New request|Request document|View details for )/i,
  });
  const total = await candidates.count();
  for (let i = 0; i < total; i++) {
    const button = candidates.nth(i);
    if (!(await button.isVisible()) || !(await button.isEnabled())) continue;
    const name =
      (await button.innerText()).trim() ||
      (await button.getAttribute("aria-label")) ||
      "preview-" + i;
    try {
      await button.click();
      await settle(page);
      await shot(page, group, label + " - " + name + " " + (i + 1), {
        state: "preview",
      });
      const open = page.locator("dialog[open]");
      if (await open.count()) {
        const close = open
          .last()
          .getByRole("button", { name: /Close preview|Cancel|Close/i })
          .first();
        if (await close.count()) await close.click();
        else await page.keyboard.press("Escape");
      } else {
        const close = page.getByRole("button", {
          name: "Close preview",
          exact: true,
        });
        if (await close.count()) await close.first().click();
      }
    } catch (e) {
      manifest.failures.push({
        group,
        label: label + " preview " + name,
        error: safeError(e),
      });
      save();
    }
  }
}
async function tabsAndPreviews(page, group, label, queue, seen, allowed) {
  await gather(page, queue, seen, allowed);
  await previewButtons(page, group, label);
  const tabs = page.getByRole("tab");
  const n = await tabs.count();
  for (let i = 0; i < n; i++) {
    const tab = tabs.nth(i);
    if (!(await tab.isVisible())) continue;
    const text = (await tab.innerText()).trim();
    if ((await tab.getAttribute("aria-selected")) === "true") continue;
    await tab.click();
    await settle(page);
    await shot(page, group, label + " - " + text, { state: "tab", tab: text });
    await gather(page, queue, seen, allowed);
    await previewButtons(page, group, label + " - " + text);
  }
}
async function extraStates(page, group, route, label) {
  // Account detail panels and read-only saved attendance dates are distinct designs.
  if (route === "/technology/accounts") {
    const buttons = page.getByRole("button", { name: /^View details for / });
    const n = await buttons.count();
    const names = [];
    for (let i = 0; i < n; i++) {
      const b = buttons.nth(i);
      if (await b.isVisible()) names.push(await b.getAttribute("aria-label"));
    }
    for (const name of [...new Set(names)]) {
      await page
        .getByRole("button", { name, exact: true })
        .filter({ visible: true })
        .first()
        .click();
      await shot(page, group, label + " - " + name, {
        state: "account-detail",
      });
    }
  }
  if (new URL(page.url()).pathname === "/academic/attendance") {
    const dates = page.getByLabel("Meeting date", { exact: false });
    if (await dates.count()) {
      const options = await dates
        .locator("option")
        .evaluateAll((es) =>
          es.map((e) => ({ value: e.value, text: e.textContent })),
        );
      const current = await dates.inputValue();
      for (const o of options) {
        if (o.value === current) continue;
        await dates.selectOption(o.value);
        await shot(page, group, label + " - " + o.text, {
          state: "meeting-date",
        });
      }
    }
  }
  // Capture one unmatched search state in each directory (no persistent data mutations).
  const search = page
    .locator(
      'main input[type="search"], main input[placeholder*="Search"],main input[id="account-search"]',
    )
    .filter({ visible: true })
    .first();
  if (await search.count()) {
    const old = await search.inputValue();
    await search.fill("NO-MATCH-SCREENSHOT-ONLY");
    await settle(page);
    await shot(page, group, label + " - No search results", {
      state: "empty-search",
    });
    await search.fill(old);
  }
}
async function crawlAccount(email) {
  const mem = memberships.filter((m) => m.email === email),
    group = accountGroups[email];
  const allowed = new Set([
    "/account",
    ...routes
      .filter((r) =>
        mem.some((m) => rolePermissions[m.role]?.includes(r.permission)),
      )
      .map((r) => r.path),
  ]);
  const ctx = await browser.newContext({
    viewport: manifest.desktop,
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "Asia/Manila",
  });
  const res = await ctx.request.post(base + "/api/portal-login", {
    headers: { origin: base },
    data: { email, password: env.AUTH_SEED_PASSWORD, portal: mem[0].portal },
  });
  const account = {
    email,
    group,
    memberships: mem.map((m) => ({ portal: m.portal, role: m.role })),
    loginStatus: res.status(),
    allowedRoutes: [...allowed],
    visited: [],
  };
  manifest.accounts = manifest.accounts.filter((a) => a.email !== email);
  manifest.accounts.push(account);
  save();
  if (!res.ok()) {
    manifest.failures.push({
      group,
      label: "Sign in",
      error: "HTTP " + res.status(),
    });
    await ctx.close();
    return;
  }
  const page = setupPage(await ctx.newPage());
  page.setDefaultTimeout(10000);
  const queue = [...allowed],
    seen = new Set();
  while (queue.length) {
    const route = queue.shift();
    if (seen.has(route)) continue;
    seen.add(route);
    const label =
      route === "/account"
        ? "Account access"
        : route.slice(1).replace(/[/?=&]/g, " ");
    try {
      await page.setViewportSize(manifest.desktop);
      const response = await page.goto(base + route, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
      await settle(page);
      if (response.status() >= 400 || new URL(page.url()).pathname === "/login")
        throw new Error(
          "Route unavailable: HTTP " +
            response.status() +
            ", URL " +
            page.url(),
        );
      await shot(page, group, label, {
        route,
        httpStatus: response.status(),
        state: "page",
      });
      account.visited.push(route);
      await tabsAndPreviews(page, group, label, queue, seen, allowed);
      await extraStates(page, group, route, label);
    } catch (e) {
      manifest.failures.push({ group, label, route, error: safeError(e) });
      save();
      console.log(
        JSON.stringify({ failure: group, route, error: safeError(e) }),
      );
    }
  }
  // Every Applicant scenario, on every journey view, including all local tabs and available documents.
  if (mem.some((m) => m.portal === "APPLICANT")) {
    const applicantRoutes = [...allowed].filter(
      (r) => r.startsWith("/applicant") && !r.includes("?"),
    );
    for (const route of applicantRoutes) {
      if (route.endsWith("/profile") || route.endsWith("/announcements"))
        continue; // These views are independent of journey state and were captured above.
      await page.setViewportSize(manifest.desktop);
      await page.goto(base + route, { waitUntil: "networkidle" });
      await settle(page);
      const scenarioSelect = page
        .locator("select")
        .and(page.getByLabel("Demo scenario", { exact: true }))
        .filter({ visible: true })
        .first();
      const options = await scenarioSelect
        .locator("option")
        .evaluateAll((es) =>
          es.map((e) => ({ value: e.value, text: e.textContent })),
        );
      for (const o of options) {
        await page.setViewportSize(manifest.desktop);
        await page.goto(base + route, { waitUntil: "networkidle" });
        await settle(page);
        await page
          .locator("select")
          .and(page.getByLabel("Demo scenario", { exact: true }))
          .filter({ visible: true })
          .first()
          .selectOption(o.value);
        const label = route.slice(1).replaceAll("/", " ") + " - " + o.text;
        await shot(page, group, label, {
          route,
          state: "scenario",
          scenario: o.value,
        });
        await tabsAndPreviews(page, group, label, [], new Set(), allowed);
      }
    }
  }
  await ctx.request
    .post(base + "/api/auth/sign-out", { headers: { origin: base }, data: {} })
    .catch(() => {});
  await ctx.close();
  console.log(
    JSON.stringify({
      accountComplete: email,
      visited: account.visited.length,
      captures: manifest.captures.filter((c) => c.group === group).length,
    }),
  );
}
async function publicPages() {
  const ctx = await browser.newContext({
      viewport: manifest.desktop,
      deviceScaleFactor: 1,
      locale: "en-US",
      timezoneId: "Asia/Manila",
    }),
    page = setupPage(await ctx.newPage());
  page.setDefaultTimeout(10000);
  const publicRoutes = [
    "/",
    "/about",
    "/programs",
    "/admissions",
    "/login",
    "/account/create",
    "/account/create/applicant",
    "/account/recovery",
  ];
  for (const route of publicRoutes) {
    await page.setViewportSize(manifest.desktop);
    await page.goto(base + route, { waitUntil: "networkidle" });
    await shot(
      page,
      "public",
      route === "/" ? "Home" : route.slice(1).replaceAll("/", " "),
      { route, state: "page" },
    );
  }
  for (const portal of [
    "APPLICANT",
    "STUDENT",
    "ACADEMIC",
    "RECORDS",
    "OPERATIONS",
    "TECHNOLOGY",
  ]) {
    await page.goto(base + "/login?portal=" + portal, {
      waitUntil: "networkidle",
    });
    await shot(page, "public", "Sign in - " + portal, {
      route: "/login?portal=" + portal,
      state: "portal-selection",
    });
  }
  await page.goto(base + "/account/create/applicant", {
    waitUntil: "networkidle",
  });
  await applicantEntry(page);
  await page.goto(base + "/account/recovery", { waitUntil: "networkidle" });
  await page.getByLabel("Email address").fill("juan.delacruz@example.invalid");
  const btn = page.getByRole("button", {
    name: "Preview recovery email",
    exact: true,
  });
  await btn.click();
  await shot(page, "public", "Account recovery - Guidance result", {
    state: "recovery-guidance",
  });
  await page.goto(base + "/screenshot-missing-page", {
    waitUntil: "networkidle",
  });
  await shot(page, "public", "404 - Page not found", { state: "not-found" });
  // Capture the existing public menu and portal drawer without altering application styles.
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.setViewportSize(manifest.mobile);
  const menu = page
    .getByRole("button", { name: /Open.*menu|Open.*navigation|Menu/i })
    .filter({ visible: true })
    .first();
  if (await menu.count()) {
    await menu.click();
    await shot(page, "public", "Home - Mobile navigation expanded", {
      state: "mobile-menu",
    });
  }
  await ctx.close();
}
function makeIndex() {
  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll('"', "&quot;");
  const groups = [...new Set(manifest.captures.map((c) => c.group))];
  let html =
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DFCAMCLP screenshot inventory</title><style>body{font:16px Arial;margin:32px;background:#f5f6fa;color:#172033}h1{font-size:28px}nav{display:flex;gap:16px;flex-wrap:wrap}section{margin:40px 0}article{background:white;border:1px solid #d5dbe5;border-radius:8px;padding:20px;margin:16px 0}a{color:#0d13cd}ul{display:flex;flex-wrap:wrap;gap:12px;list-style:none;padding:0}img{max-width:480px;max-height:260px;object-fit:contain;object-position:top;border:1px solid #ddd}summary{cursor:pointer;font-weight:bold}small{overflow-wrap:anywhere}#search{font:inherit;padding:12px;width:min(95%,600px)}</style><h1>Final check before UI/UX</h1><p>Desktop 1920×1080 and 1440×900; tablet 1024×768 and 768×900; mobile 390×844, 375×812, and 360×800. Full-page images use the same viewport width. Application source unchanged.</p><p>' +
    manifest.captures.length +
    " views, " +
    manifest.captures.reduce((n, c) => n + c.files.length, 0) +
    " PNGs. Captured " +
    esc(manifest.completedAt) +
    '.</p><input id="search" placeholder="Filter page names, accounts, routes, or states"><nav>' +
    groups.map((g) => '<a href="#' + g + '">' + esc(g) + "</a>").join(" ") +
    "</nav>";
  for (const g of groups) {
    html += '<section id="' + g + '"><h2>' + esc(g) + "</h2>";
    for (const c of manifest.captures.filter((c) => c.group === g)) {
      html +=
        '<article data-text="' +
        esc(g + " " + c.label + " " + c.url) +
        '"><details><summary>' +
        esc(c.id + " · " + c.label) +
        "</summary><p><small>" +
        esc(c.url) +
        "</small></p><ul>" +
        c.files
          .map(
            (f) =>
              '<li><a href="' +
              encodeURI(f) +
              '" target="_blank">' +
              esc(f.split("/")[0]) +
              " " +
              esc(
                f.includes("--full-page")
                  ? "full page"
                  : f.includes("--dialog-bottom")
                    ? "dialog bottom"
                    : "viewport",
              ) +
              " (" +
              c.dimensions[f].width +
              "×" +
              c.dimensions[f].height +
              ")</a></li>",
          )
          .join("") +
        "</ul><div>" +
        c.files
          .filter((f) => f.includes("--viewport"))
          .map(
            (f) =>
              '<a href="' +
              encodeURI(f) +
              '" target="_blank"><img loading="lazy" src="' +
              encodeURI(f) +
              '" alt="' +
              esc(c.label) +
              '"></a>',
          )
          .join(" ") +
        "</div></details></article>";
    }
    html += "</section>";
  }
  html +=
    '<script>document.querySelector("#search").addEventListener("input",e=>{for(const a of document.querySelectorAll("article"))a.hidden=!a.dataset.text.toLowerCase().includes(e.target.value.toLowerCase())})</script></html>';
  fs.writeFileSync(path.join(out, "index.html"), html);
}

async function accountSession(email, work) {
  const member = memberships.find((m) => m.email === email),
    group = accountGroups[email];
  const ctx = await browser.newContext({
    viewport: manifest.desktop,
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "Asia/Manila",
  });
  const res = await ctx.request.post(base + "/api/portal-login", {
    headers: { origin: base },
    data: { email, password: env.AUTH_SEED_PASSWORD, portal: member.portal },
  });
  if (!res.ok())
    throw new Error(
      "Supplementary login failed for " + group + ": HTTP " + res.status(),
    );
  const page = setupPage(await ctx.newPage());
  page.setDefaultTimeout(10000);
  await page.goto(base + "/" + member.portal.toLowerCase(), {
    waitUntil: "networkidle",
  });
  await acknowledgeDisclosure(page);
  async function step(label, fn) {
    try {
      await fn();
    } catch (e) {
      manifest.failures.push({ group, label, error: safeError(e) });
      save();
      console.log(
        JSON.stringify({
          supplementFailure: group,
          label,
          error: safeError(e),
        }),
      );
    }
  }
  await work(page, group, step);
  await ctx.request
    .post(base + "/api/auth/sign-out", { headers: { origin: base }, data: {} })
    .catch(() => {});
  await ctx.close();
}
(async () => {
  browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  // Shell menus for every account and every assigned portal.
  for (const email of [...new Set(memberships.map((m) => m.email))]) {
    await accountSession(email, async (page, group, step) => {
      for (const member of memberships.filter((m) => m.email === email)) {
        await step("Navigation drawer " + member.portal, async () => {
          await page.goto(base + "/" + member.portal.toLowerCase(), {
            waitUntil: "networkidle",
          });
          await page.setViewportSize(manifest.mobile);
          await page
            .getByRole("button", {
              name: "Open portal navigation",
              exact: true,
            })
            .click();
          await shot(page, group, member.portal + " - Navigation drawer", {
            state: "mobile-navigation",
          });
          await page
            .getByRole("button", {
              name: "Close portal navigation",
              exact: true,
            })
            .click();
          await page.setViewportSize(manifest.desktop);
          await page
            .locator("header summary")
            .filter({ hasText: /Account/ })
            .click();
          await shot(page, group, member.portal + " - Account menu", {
            state: "account-menu",
          });
          await page
            .locator("header summary")
            .filter({ hasText: /Account/ })
            .click();
          const switcher = page
            .locator("header summary")
            .filter({ hasText: "Switch portal" });
          if (await switcher.count()) {
            await switcher.click();
            await shot(page, group, member.portal + " - Portal switcher", {
              state: "portal-switcher",
            });
          }
        });
      }
    });
  }
  await accountSession(
    "johnpaul.reyes@example.invalid",
    async (page, group, step) => {
      await step("Access denied", async () => {
        const res = await page.goto(base + "/technology", {
          waitUntil: "networkidle",
        });
        await shot(page, group, "Access denied - Unauthorized portal", {
          state: "access-denied",
          httpStatus: res.status(),
        });
      });
      await step("Missing section", async () => {
        const res = await page.goto(
          base + "/student/screenshot-missing-section",
          { waitUntil: "networkidle" },
        );
        await shot(page, group, "404 - Missing portal section", {
          state: "not-found",
          httpStatus: res.status(),
        });
      });
      await step("Request review", async () => {
        await page.goto(base + "/student/requests", {
          waitUntil: "networkidle",
        });
        await page
          .getByRole("button", { name: "New request", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Review request", exact: true })
          .click();
        await shot(page, group, "Requests - COE review dialog", {
          state: "review-dialog",
        });
        await page.getByRole("button", { name: "Back", exact: true }).click();
        await page.getByLabel("Document", { exact: true }).selectOption("COR");
        await page
          .getByRole("button", { name: "Review request", exact: true })
          .click();
        await shot(page, group, "Requests - COR review dialog", {
          state: "review-dialog",
        });
      });
      await step("Academic term histories", async () => {
        await page.goto(base + "/student/academics", {
          waitUntil: "networkidle",
        });
        await page.getByRole("tab", { name: "Grades", exact: true }).click();
        await settle(page);
        const year = page.getByLabel("Academic year", { exact: false }),
          term = page.getByLabel("Semester", { exact: false });
        const years = await year
          .locator("option")
          .evaluateAll((es) => es.map((e) => e.value));
        for (const y of years) {
          await year.selectOption(y);
          await settle(page);
          const terms = await term
            .locator("option")
            .evaluateAll((es) => es.map((e) => e.value));
          for (const t of terms) {
            await term.selectOption(t);
            await shot(page, group, "Academics grades - " + y + " " + t, {
              state: "grade-history",
            });
          }
        }
      });
      await step("Attendance history expanded", async () => {
        await page.goto(base + "/student/academics", {
          waitUntil: "networkidle",
        });
        await page
          .getByRole("tab", { name: "Attendance", exact: true })
          .click();
        for (const summary of await page.locator("main summary").all())
          await summary.click();
        await shot(
          page,
          group,
          "Academics attendance - Expanded sample histories",
          { state: "expanded-history" },
        );
      });
      await step("Schedule days", async () => {
        await page.goto(base + "/student/academics", {
          waitUntil: "networkidle",
        });
        for (const day of ["Mon", "Tue", "Wed", "Thu", "Fri"]) {
          await page.setViewportSize(manifest.mobile);
          const b = page
            .locator(".student-mobile-day-picker button")
            .filter({ hasText: day });
          await b.click();
          await shot(
            page,
            group,
            "Academics schedule - " + day + " mobile agenda",
            { state: "schedule-day" },
          );
        }
      });
      await step("Calendar empty and alternate month", async () => {
        await page.goto(base + "/student/calendar", {
          waitUntil: "networkidle",
        });
        const empty = page
          .getByRole("button", { name: /, no sample events$/ })
          .filter({ visible: true })
          .first();
        if (await empty.count()) {
          await empty.click();
          await shot(page, group, "Calendar - Date without sample events", {
            state: "empty-agenda",
          });
        }
        await page
          .getByRole("button", { name: "Previous month", exact: true })
          .click();
        await shot(page, group, "Calendar - Previous month", {
          state: "alternate-month",
        });
      });
    },
  );
  await accountSession(
    "juan.delacruz@example.invalid",
    async (page, group, step) => {
      await step("Application validation and review", async () => {
        await page.goto(base + "/applicant/application", {
          waitUntil: "networkidle",
        });
        await page
          .locator("select")
          .and(page.getByLabel("Demo scenario", { exact: true }))
          .filter({ visible: true })
          .first()
          .selectOption("draft");
        await settle(page);
        const phone = page.getByLabel("Mobile number", { exact: false });
        const old = await phone.inputValue();
        await phone.fill("invalid demo phone");
        await page
          .getByRole("button", { name: "Review application", exact: true })
          .click();
        await shot(page, group, "Application draft - Validation errors", {
          state: "validation-error",
        });
        await phone.fill(old);
        await page
          .getByRole("button", { name: "Review application", exact: true })
          .click();
        await shot(page, group, "Application draft - Review details", {
          state: "application-review",
        });
        await page
          .getByRole("button", { name: "Submit demo application", exact: true })
          .click();
        await shot(
          page,
          group,
          "Application draft - Submission confirmation dialog",
          { state: "review-dialog" },
        );
      });
    },
  );
  for (const email of [
    "maria.santos@example.invalid",
    "angelica.bautista@example.invalid",
    "michael.castro@example.invalid",
  ]) {
    await accountSession(email, async (page, group, step) => {
      await step("Attendance review", async () => {
        await page.goto(base + "/academic/attendance", {
          waitUntil: "networkidle",
        });
        const dates = page.getByLabel("Meeting date", { exact: false });
        const options = await dates
          .locator("option")
          .evaluateAll((es) => es.map((e) => e.value));
        for (const v of options) {
          await dates.selectOption(v);
          const review = page.getByRole("button", {
            name: "Review and save",
            exact: true,
          });
          if (await review.count()) {
            await review.click();
            await shot(page, group, "Attendance - Review and save dialog", {
              state: "review-dialog",
            });
            break;
          }
        }
      });
      await step("Grades validation and review", async () => {
        await page.goto(base + "/academic/grades", {
          waitUntil: "networkidle",
        });
        const offering = page.getByLabel("Course offering", { exact: false });
        const opts = await offering
          .locator("option")
          .evaluateAll((es) => es.map((e) => e.value));
        for (const v of opts) {
          await offering.selectOption(v);
          const review = page.getByRole("button", {
            name: "Review submission",
            exact: true,
          });
          if (await review.count()) {
            const inputs = page
              .locator('main input[inputmode="decimal"]')
              .filter({ visible: true });
            if (await inputs.count()) {
              await inputs.first().fill("");
              await review.click();
              await shot(page, group, "Grades - Missing entry validation", {
                state: "validation-error",
              });
              await page
                .getByRole("button", {
                  name: "Return to grade entry",
                  exact: true,
                })
                .click();
              for (const input of await inputs.all()) await input.fill("1.75");
            }
            await review.click();
            await shot(page, group, "Grades - Review submission dialog", {
              state: "review-dialog",
            });
            break;
          }
        }
      });
    });
  }
  await accountSession(
    "jose.garcia@example.invalid",
    async (page, group, step) => {
      await step("DCAT schedule review", async () => {
        await page.goto(base + "/records/dcat?record=DEMO-APP-003", {
          waitUntil: "networkidle",
        });
        await page.getByLabel("Date", { exact: true }).fill("2026-10-20");
        await page.getByLabel("Time", { exact: true }).fill("09:00");
        await page.getByLabel("Room", { exact: true }).fill("Sample Room 204");
        await page
          .getByRole("button", { name: "Review schedule", exact: true })
          .click();
        await shot(page, group, "DCAT - Review sample schedule", {
          state: "schedule-review",
        });
      });
      await step("DCAT result review", async () => {
        await page.goto(base + "/records/dcat?record=DEMO-APP-005", {
          waitUntil: "networkidle",
        });
        await page
          .getByRole("button", { name: "Review result", exact: true })
          .click();
        await shot(page, group, "DCAT - Review Passed result", {
          state: "result-review",
        });
        await page.getByRole("button", { name: "Cancel", exact: true }).click();
        await page
          .getByLabel("Sample result", { exact: false })
          .selectOption("Not Qualified");
        await page
          .getByRole("button", { name: "Review result", exact: true })
          .click();
        await shot(page, group, "DCAT - Review Not Qualified result", {
          state: "result-review",
        });
      });
      await step("Enrollment next-step review", async () => {
        await page.goto(base + "/records/enrollment?record=DEMO-APP-006", {
          waitUntil: "networkidle",
        });
        const advance = page
          .getByRole("button", { name: /^Advance to / })
          .first();
        if (await advance.count()) {
          await advance.click();
          await shot(page, group, "Enrollment - Next step confirmation", {
            state: "enrollment-review",
          });
        }
      });
    },
  );

  for (const email of [
    "mark.ramos@example.invalid",
    "marygrace.mendoza@example.invalid",
  ]) {
    await accountSession(email, async (page, group, step) => {
      for (const view of [
        "all",
        "mine",
        "open",
        "progress",
        "high",
        "unassigned",
      ]) {
        await step("Facilities view " + view, async () => {
          await page.goto(base + "/operations/facilities?view=" + view, {
            waitUntil: "networkidle",
          });
          await shot(page, group, "Facilities - " + view + " work view", {
            state: "work-view",
          });
        });
      }
    });
  }

  for (const email of [
    "juan.delacruz@example.invalid",
    "johnpaul.reyes@example.invalid",
    "michael.castro@example.invalid",
  ]) {
    await accountSession(email, async (page, group, step) => {
      await step("Account profile interaction states", async () => {
        await page.goto(base + "/account", { waitUntil: "networkidle" });
        await settle(page);
        await page
          .getByRole("button", { name: "Edit bio", exact: true })
          .click();
        await shot(page, group, "Account profile - Edit bio", {
          state: "bio-editor",
        });
        await page
          .getByLabel("Your demo bio", { exact: true })
          .fill("Fictional profile text for screenshot review.");
        await page
          .getByRole("button", { name: "Apply demo bio", exact: true })
          .click();
        await shot(page, group, "Account profile - Bio preview", {
          state: "bio-preview",
        });
        await page
          .getByRole("button", { name: "Add demo photo", exact: true })
          .click();
        await shot(page, group, "Account profile - Photo picker", {
          state: "photo-dialog",
        });
        await page
          .locator("dialog.demo-photo-dialog[open]")
          .getByRole("button", { name: "Cancel", exact: true })
          .click();
        await page
          .locator("main")
          .getByRole("button", { name: "About this demo", exact: true })
          .click();
        await shot(page, group, "About this demo - Reopened", {
          state: "manual-disclosure",
        });
      });
      if (group === "applicant" || group === "student")
        await step("Domain profile photo picker", async () => {
          await page.goto(base + "/" + group + "/profile", {
            waitUntil: "networkidle",
          });
          await settle(page);
          await page
            .getByRole("button", { name: "Add demo photo", exact: true })
            .click();
          await shot(page, group, group + " profile - Photo picker", {
            state: "domain-photo-dialog",
          });
        });
    });
  }
  const ctx = await browser.newContext({ viewport: manifest.desktop }),
    page = setupPage(await ctx.newPage());
  await page.goto(base + "/login?portal=APPLICANT", {
    waitUntil: "networkidle",
  });
  await acknowledgeDisclosure(page);
  await page
    .getByLabel("Email address", { exact: true })
    .fill("screenshot.invalid@example.invalid");
  await page
    .getByLabel("Password", { exact: true })
    .fill("ScreenshotOnlyInvalidPassword");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await settle(page);
  await shot(page, "public", "Sign in - Invalid credentials message", {
    state: "login-error",
  });
  await ctx.close();
  manifest.completedAt = new Date().toISOString();
  manifest.sourceIntegrity = {
    checkedFiles: Object.keys(baseline).length,
    changed: Object.keys(baseline).filter((f) => hash(f) !== baseline[f]),
  };
  manifest.totalViews = manifest.captures.length;
  manifest.totalPNGs = manifest.captures.reduce(
    (n, c) => n + c.files.length,
    0,
  );
  save();
  makeIndex();
  await browser.close();
  console.log(
    JSON.stringify({
      supplementsDone: true,
      views: manifest.totalViews,
      pngs: manifest.totalPNGs,
      failures: manifest.failures,
      integrity: manifest.sourceIntegrity,
    }),
  );
})().catch(async (e) => {
  manifest.failures.push({ fatal: true, error: safeError(e) });
  save();
  if (browser) await browser.close().catch(() => {});
  console.error(safeError(e));
  process.exit(1);
});
