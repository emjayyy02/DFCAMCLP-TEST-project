/* eslint-disable @typescript-eslint/no-require-imports */
/* Isolated local production-browser checks. Never record credentials or cookies. */
const fs = require("node:fs"),
  path = require("node:path"),
  { parseEnv } = require("node:util");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = "http://localhost:3109",
  env = parseEnv(fs.readFileSync(".env", "utf8"));
const accounts = JSON.parse(
  fs.readFileSync("final-check-before-uiux/manifest.json", "utf8"),
).accounts;
const key = "dfcamclp.demoDisclosure.ackVersion";
const widths = [
  { width: 320, height: 812 },
  { width: 375, height: 812 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
const expected = [
  ["Applicant", "applicant.test@example.invalid", ["Applicant"]],
  ["Student", "student.test@example.invalid", ["Student"]],
  ["Faculty", "faculty.test@example.invalid", ["Academic"]],
  ["Program Coordinator", "coordinator.test@example.invalid", ["Academic"]],
  [
    "Admissions & Records",
    "records.test@example.invalid",
    ["Admissions & Records"],
  ],
  ["Maintenance Staff", "operations.test@example.invalid", ["Operations"]],
  ["School Admin", "school-admin.test@example.invalid", ["Operations"]],
  ["IT Admin", "technology.test@example.invalid", ["Technology"]],
  [
    "Faculty + Developer",
    "faculty-it.test@example.invalid",
    ["Academic", "Technology"],
  ],
];
const resume = process.argv.includes("--finish");
const result = resume
  ? JSON.parse(fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8"))
  : {
      startedAt: new Date().toISOString(),
      preview:
        "Fresh Next.js production build / isolated localhost:3109 / process-only auth origin",
      browser: "Installed Microsoft Edge Chromium",
      checks: [],
      responsive: [],
      captures: [],
      pageErrors: [],
    };
if (resume) {
  result.continuations = [
    ...(result.continuations || []),
    {
      startedAt: new Date().toISOString(),
      reason:
        "Finish after portal-switch selector correction; completed 220 assertions retained.",
    },
  ];
  delete result.fatal;
}
let browser;
function save() {
  fs.writeFileSync(
    path.join(__dirname, "manifest.json"),
    JSON.stringify(result, null, 2),
  );
}
function check(name, pass, detail) {
  result.checks.push({ name, pass, detail });
  save();
}
async function go(p, route) {
  const r = await p.goto(base + route, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  return r;
}
async function cap(p, name, group, state) {
  const file = name + "-" + p.viewportSize().width + ".png";
  await p.screenshot({
    path: path.join(__dirname, file),
    fullPage: true,
    animations: "disabled",
  });
  result.captures.push({
    file,
    group,
    route: new URL(p.url()).pathname + new URL(p.url()).search,
    viewport: p.viewportSize(),
    state,
    capturedAt: new Date().toISOString(),
  });
  save();
}
async function metric(p, name) {
  const m = await p.evaluate(() => ({
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    heading: document.querySelector("h1")?.textContent,
    dialogs: [...document.querySelectorAll("dialog[open]")].map((d) => {
      const r = d.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        height: innerHeight,
      };
    }),
  }));
  const pass =
    m.documentWidth <= m.width &&
    m.dialogs.every(
      (d) =>
        d.left >= 0 &&
        d.right <= m.width &&
        d.top >= -1 &&
        d.bottom <= d.height + 1,
    );
  result.responsive.push({
    name,
    route: new URL(p.url()).pathname,
    viewport: p.viewportSize(),
    ...m,
    pass,
  });
  check(name + " contains page/dialog", pass, m);
}
async function doubled(p) {
  await p.evaluate(() => {
    const nodes = [
      ...document.querySelectorAll("main,main *,dialog[open],dialog[open] *"),
    ];
    const styles = nodes.map((e) => ({
      e,
      size: parseFloat(getComputedStyle(e).fontSize),
      line: parseFloat(getComputedStyle(e).lineHeight),
    }));
    for (const { e, size, line } of styles) {
      if (size) e.style.fontSize = size * 2 + "px";
      if (line) e.style.lineHeight = line * 2 + "px";
    }
  });
}
async function context(
  group = "public",
  ack = true,
  viewport = { width: 1440, height: 900 },
) {
  const c = await browser.newContext({ viewport, timezoneId: "Asia/Manila" });
  if (ack) await c.addInitScript((k) => localStorage.setItem(k, "fd7-v1"), key);
  if (group !== "public") {
    const a = accounts.find((a) => a.group === group);
    const r = await c.request.post(base + "/api/portal-login", {
      headers: { origin: base },
      data: {
        email: a.email,
        password: env.AUTH_SEED_PASSWORD,
        portal: a.memberships[0].portal,
      },
    });
    check(group + " isolated login", r.ok(), r.status());
  }
  const p = await c.newPage();
  p.setDefaultTimeout(10000);
  p.on("pageerror", (e) => {
    result.pageErrors.push({ group, message: e.message });
    save();
  });
  return { c, p };
}
async function failureCase(surface, width, kind) {
  const { c, p } = await context("student", true, {
    width,
    height: width === 1920 ? 1080 : 812,
  });
  await go(p, surface === "account" ? "/account" : "/student");
  if (surface === "account") {
    await p.getByRole("button", { name: "Edit bio", exact: true }).click();
    await p
      .getByLabel("Your demo bio", { exact: true })
      .fill("Fictional RC2B failure state.");
    await p
      .getByRole("button", { name: "Apply demo bio", exact: true })
      .click();
  }
  let area = p;
  if (surface === "menu") {
    await p.locator("summary.account-trigger").click();
    area = p.locator("details[open]");
  }
  if (surface === "drawer") {
    await p.getByRole("button", { name: "Open portal navigation" }).click();
    area = p.locator("dialog[open]");
  }
  await p.route("**/api/auth/sign-out", async (r) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (kind === "network-abort") await r.abort("failed");
    else
      await r.fulfill({
        status: kind === "http-503" ? 503 : 200,
        contentType: "application/json",
        body: JSON.stringify(
          kind === "http-503"
            ? { message: "Injected test outage" }
            : { success: false },
        ),
      });
  });
  await area.getByRole("button", { name: "Sign out", exact: true }).click();
  check(
    surface + " " + width + " " + kind + " pending",
    await area
      .getByRole("button", { name: "Signing out…", exact: true })
      .isDisabled(),
  );
  await area
    .getByText("Sign-out could not be confirmed. Please try again.", {
      exact: true,
    })
    .waitFor();
  check(
    surface + " " + width + " " + kind + " stays authenticated page",
    new URL(p.url()).pathname ===
      (surface === "account" ? "/account" : "/student"),
  );
  check(
    surface + " " + width + " " + kind + " retry enabled",
    await area
      .getByRole("button", { name: "Sign out", exact: true })
      .isEnabled(),
  );
  check(
    surface + " " + width + " " + kind + " accessible alert",
    (await area.locator('p[role="alert"]').count()) === 1,
  );
  if (surface === "account")
    check(
      kind + " presentation retained",
      await p
        .getByText("Fictional RC2B failure state.", { exact: true })
        .isVisible(),
    );
  await metric(p, "Sign-out failure " + surface + " " + kind + " " + width);
  await cap(
    p,
    "signout-" + surface + "-" + kind,
    "student",
    "Injected sign-out failure: truthful state and enabled retry",
  );
  if (surface === "account" && width === 375 && kind === "http-503") {
    await doubled(p);
    await metric(p, "Sign-out error doubled");
    await cap(
      p,
      "signout-doubled",
      "student",
      "Doubled text on truthful failure feedback",
    );
  }
  await p.unroute("**/api/auth/sign-out");
  if (surface === "account") {
    await p.reload({ waitUntil: "networkidle" });
    check(
      kind + " refresh remains authenticated",
      new URL(p.url()).pathname === "/account" &&
        (await p.locator("main").innerText()).includes(
          "student.test@example.invalid",
        ),
    );
    check(
      kind + " normal reload clears temporary bio",
      (await p
        .getByText("Fictional RC2B failure state.", { exact: true })
        .count()) === 0,
    );
    area = p;
  }
  await area.getByRole("button", { name: "Sign out", exact: true }).click();
  await p.waitForURL(base + "/login");
  check(
    surface + " " + kind + " retry succeeds",
    new URL(p.url()).pathname === "/login",
  );
  await go(p, "/student");
  check(
    surface + " " + kind + " protected after success",
    new URL(p.url()).pathname === "/login",
  );
  await c.close();
}
async function run() {
  browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  if (!resume) {
    // First entry and public Demo Accounts: no password section or automatic auth.
    const { c: panelContext, p: panel } = await context("public", false, {
      width: 375,
      height: 812,
    });
    await go(panel, "/login?portal=TECHNOLOGY");
    await panel.locator(".demo-disclosure-dialog[open]").waitFor();
    check(
      "first entry has one modal",
      (await panel.locator("dialog[open]").count()) === 1,
    );
    await panel
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
    const authPosts = [];
    panel.on("request", (r) => {
      if (
        r.method() === "POST" &&
        new URL(r.url()).pathname.startsWith("/api/")
      )
        authPosts.push(new URL(r.url()).pathname);
    });
    await panelContext.grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: base,
    });
    await panel
      .getByRole("button", { name: "View demo accounts", exact: true })
      .click();
    const modal = panel.locator(".demo-accounts-dialog[open]");
    await modal.waitFor();
    check(
      "Demo Accounts has exactly nine rows",
      (await modal.locator(".demo-account-row").count()) === 9,
    );
    check(
      "Demo Accounts only one modal",
      (await panel.locator("dialog[open]").count()) === 1,
    );
    check(
      "Demo Accounts title focus",
      await panel.evaluate(
        () => document.activeElement.id === "demo-accounts-title",
      ),
    );
    check(
      "No password UI/placeholder",
      !/password|credential|token|secret/i.test(await modal.innerText()),
    );
    for (const [label, email, portals] of expected) {
      const row = modal
        .locator(".demo-account-row")
        .filter({ has: panel.getByText(email, { exact: true }) });
      check(
        label + " public row matches",
        (await row.locator("h3").innerText()) === label &&
          (await row.locator(".demo-account-portals").innerText()) ===
            "Portals: " + portals.join(" · "),
      );
      await row
        .getByRole("button", { name: "Copy email for " + label, exact: true })
        .click();
      await modal
        .getByRole("status")
        .filter({ hasText: "Copied " + email })
        .waitFor();
      const copied = await panel.evaluate(() => navigator.clipboard.readText());
      check(label + " native clipboard copy", copied === email);
    }
    await panel.keyboard.press("Escape");
    await modal.waitFor({ state: "hidden" });
    check(
      "Escape returns trigger focus",
      await panel
        .getByRole("button", { name: "View demo accounts", exact: true })
        .evaluate((e) => e === document.activeElement),
    );
    for (const label of ["Student", "IT Admin", "Faculty + Developer"]) {
      await panel
        .getByLabel("Password", { exact: true })
        .fill("NotSubmittedExample123");
      await panel
        .getByRole("button", { name: "View demo accounts", exact: true })
        .click();
      await panel
        .getByRole("button", {
          name: "Use this account: " + label,
          exact: true,
        })
        .click();
      await modal.waitFor({ state: "hidden" });
      const expectedEmail = expected.find((e) => e[0] === label)[1];
      await panel.waitForFunction(
        (email) => document.querySelector("#email").value === email,
        expectedEmail,
      );
      check(
        label + " prefill email only",
        (await panel
          .getByLabel("Email address", { exact: true })
          .inputValue()) === expectedEmail &&
          (await panel.getByLabel("Password", { exact: true }).inputValue()) ===
            "NotSubmittedExample123" &&
          (await panel.getByLabel("Portal", { exact: true }).inputValue()) ===
            "TECHNOLOGY",
      );
      check(
        label + " prefill email focus",
        await panel
          .getByLabel("Email address", { exact: true })
          .evaluate((e) => e === document.activeElement),
      );
    }
    check(
      "Account selection never signs in",
      authPosts.length === 0,
      authPosts,
    );
    await panel.getByLabel("Password", { exact: true }).fill("");
    await panel
      .getByRole("button", { name: "View demo accounts", exact: true })
      .click();
    const buttons = modal.getByRole("button");
    await panel.keyboard.press("Shift+Tab");
    check(
      "Panel reverse focus boundary",
      await buttons.last().evaluate((e) => e === document.activeElement),
    );
    await panel.keyboard.press("Tab");
    check(
      "Panel forward focus boundary",
      await buttons.first().evaluate((e) => e === document.activeElement),
    );
    for (let i = 0; i < (await buttons.count()); i++) {
      await panel.keyboard.press("Tab");
      check(
        "Panel keyboard traversal " + i,
        await panel.evaluate(
          () =>
            document.activeElement.closest(".demo-accounts-dialog[open]") !==
            null,
        ),
      );
    }
    const normalMotion = await modal.evaluate(
      (e) => getComputedStyle(e).animationDuration,
    );
    check("Panel uses FD6 180ms", normalMotion === "0.18s", normalMotion);
    await panel.emulateMedia({ reducedMotion: "reduce" });
    check(
      "Panel reduced motion mid-open",
      await modal.evaluate(
        (e) => getComputedStyle(e).animationDuration === "0s",
      ),
    );
    await panel.emulateMedia({ reducedMotion: "no-preference" });
    for (const viewport of widths) {
      await panel.setViewportSize(viewport);
      await modal
        .locator(".demo-accounts-body")
        .evaluate((e) => (e.scrollTop = 0));
      await metric(panel, "Demo Accounts " + viewport.width);
      await cap(
        panel,
        "demo-accounts",
        "public",
        "Start of nine-entry scrollable list; no password section",
      );
    }
    for (const viewport of [widths[1], widths[3]]) {
      await panel.setViewportSize(viewport);
      await doubled(panel);
      await metric(panel, "Demo Accounts doubled " + viewport.width);
      await cap(
        panel,
        "demo-accounts-doubled",
        "public",
        "Doubled text simulation",
      );
      await go(panel, "/login");
      await panel
        .getByRole("button", { name: "View demo accounts", exact: true })
        .click();
    }
    await panel.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("Injected clipboard denial");
          },
        },
      }),
    );
    await modal
      .getByRole("button", { name: "Copy email for Applicant", exact: true })
      .click();
    await modal
      .getByRole("status")
      .filter({ hasText: "Copy is unavailable." })
      .waitFor();
    check(
      "Clipboard failure offers selectable fallback",
      await modal
        .locator(".demo-account-email")
        .first()
        .evaluate((e) => getComputedStyle(e).userSelect === "text"),
    );
    await cap(
      panel,
      "clipboard-failure",
      "public",
      "Copy denied: truthful selectable-email fallback",
    );
    await modal.getByRole("button", { name: "Close", exact: true }).click();
    await panelContext.close();
    // All four pre-acknowledgement links, heading focus and native Back.
    const { c: legalContext, p: legal } = await context("public", false);
    await go(legal, "/login?portal=APPLICANT");
    for (const route of ["disclaimer", "terms", "privacy", "acceptable-use"]) {
      await legal.locator(".demo-disclosure-dialog[open]").waitFor();
      await legal
        .locator('.demo-disclosure-dialog[open] a[href="/' + route + '"]')
        .first()
        .click();
      await legal.waitForURL(base + "/" + route);
      await legal.waitForFunction(
        () => document.activeElement.tagName === "H1",
      );
      check(
        route + " destination H1 focus",
        await legal
          .getByRole("heading", { level: 1 })
          .evaluate((e) => e === document.activeElement),
      );
      check(
        route + " pre-ack no stored acceptance",
        await legal.evaluate((k) => localStorage.getItem(k) === null, key),
      );
      await legal.keyboard.press("Tab");
      check(
        route + " next Tab stays at destination content",
        await legal.evaluate(
          () => document.activeElement.textContent.trim() !== "Skip to content",
        ),
      );
      await cap(
        legal,
        "legal-" + route + "-focus",
        "public",
        "Pre-ack legal H1 focus and next Tab",
      );
      await legal.goBack({ waitUntil: "networkidle" });
      await legal.locator(".demo-disclosure-dialog[open]").waitFor();
      check(
        route + " Back restores query and disclosure",
        new URL(legal.url()).search === "?portal=APPLICANT",
      );
    }
    await legal
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
    await legal
      .getByRole("button", { name: "About this demo", exact: true })
      .click();
    await legal
      .locator('.demo-disclosure-dialog[open] a[href="/privacy"]')
      .click();
    await legal.waitForURL(base + "/privacy");
    await legal.waitForFunction(() => document.activeElement.tagName === "H1");
    await legal
      .getByRole("link", { name: "Return to demo", exact: true })
      .click();
    await legal.waitForURL(base + "/login?portal=APPLICANT");
    check(
      "Accepted legal return does not repeat disclosure",
      (await legal.locator("dialog[open]").count()) === 0,
    );
    for (const route of ["disclaimer", "terms", "privacy", "acceptable-use"])
      for (const viewport of widths) {
        await legal.setViewportSize(viewport);
        await go(legal, "/" + route);
        await metric(legal, "Legal " + route + " " + viewport.width);
        check(
          route + " direct legal exempt",
          (await legal.locator("dialog[open]").count()) === 0,
        );
        if (route === "privacy" && [375, 1920].includes(viewport.width))
          await cap(
            legal,
            "privacy-reading",
            "public",
            "Legal destination reading layout",
          );
      }
    for (const viewport of [widths[1], widths[3]]) {
      await legal.setViewportSize(viewport);
      await go(legal, "/privacy");
      await doubled(legal);
      await metric(legal, "Privacy doubled " + viewport.width);
      await cap(legal, "privacy-doubled", "public", "Doubled text simulation");
    }
    await legalContext.close();
    // Real UI invalid and valid sign-in.
    const { c: loginContext, p: login } = await context();
    await go(login, "/login?portal=STUDENT");
    await login
      .getByLabel("Email address", { exact: true })
      .fill("student.test@example.invalid");
    await login
      .getByLabel("Password", { exact: true })
      .fill("InvalidExamplePassword123");
    await login.getByRole("button", { name: "Sign in", exact: true }).click();
    await login
      .getByText("Invalid email or password", { exact: false })
      .waitFor();
    check(
      "Invalid UI login stays Login",
      new URL(login.url()).pathname === "/login",
    );
    await login
      .getByLabel("Password", { exact: true })
      .fill(env.AUTH_SEED_PASSWORD);
    await login.getByRole("button", { name: "Sign in", exact: true }).click();
    await login.waitForURL(base + "/student");
    check(
      "Valid UI login reaches Student",
      (await login.locator("summary.account-trigger").count()) === 1,
    );
    await cap(
      login,
      "successful-login",
      "student",
      "Valid fictional account, no credential visible",
    );
    await loginContext.close();
    // All nine identities/allowed URLs and exact denials, then normal logout.
    const denied = {
      applicant: "/technology",
      student: "/academic",
      faculty: "/academic/management",
      records: "/operations",
      operations: "/operations/employees",
      technology: "/technology/developer",
      coordinator: "/technology",
      "school-admin": "/technology",
      "faculty-it": "/technology/accounts",
    };
    for (const account of accounts) {
      const { c, p } = await context(account.group);
      for (const route of account.allowedRoutes) {
        const r = await go(p, route);
        check(
          account.group + " allowed " + route,
          r.status() === 200 &&
            (await p.getByRole("heading", { level: 1 }).count()) === 1,
        );
      }
      await go(p, "/account");
      check(
        account.group + " Account email correct",
        (await p.locator("main").innerText()).includes(account.email),
      );
      await go(p, denied[account.group]);
      check(
        account.group + " unauthorized direct URL",
        (await p
          .getByRole("heading", { name: "Access denied", exact: true })
          .count()) === 1,
      );
      if (account.group === "faculty-it") {
        await go(p, "/academic");
        await p
          .locator("header summary")
          .filter({ hasText: "Switch portal" })
          .click();
        await p
          .getByRole("link", { name: "Technology", exact: true })
          .filter({ visible: true })
          .click();
        await p.waitForURL(base + "/technology");
        check(
          "Multi-membership switch works",
          (await p.getByRole("heading", { level: 1 }).count()) === 1,
        );
        await go(p, "/technology/developer");
        check(
          "Multi-membership Developer permitted",
          (await p.getByRole("heading", { level: 1 }).count()) === 1,
        );
      }
      if (account.group === "technology") {
        await go(p, "/technology/accounts");
        check(
          "Directory warning exact once",
          (await p.locator(".demo-notice").innerText()).split(
            "Read-only account directory",
          ).length -
            1 ===
            1,
        );
        for (const viewport of [widths[1], widths[4]]) {
          await p.setViewportSize(viewport);
          await metric(p, "Technology correction " + viewport.width);
          await cap(
            p,
            "technology-correction",
            "technology",
            "Read-only directory heading once with useful detail",
          );
        }
        await p.setViewportSize(widths[1]);
        await doubled(p);
        await metric(p, "Technology doubled");
        await cap(
          p,
          "technology-doubled",
          "technology",
          "Doubled text on affected warning/directory",
        );
      }
      await go(p, "/account");
      await p.getByRole("button", { name: "Sign out", exact: true }).click();
      await p.waitForURL(base + "/login");
      await go(
        p,
        account.allowedRoutes.find((r) => r !== "/account"),
      );
      check(
        account.group + " normal logout protects route",
        new URL(p.url()).pathname === "/login",
      );
      await c.close();
    }
  }
  if (resume) {
    const { c, p } = await context("faculty-it");
    await go(p, "/academic");
    await p
      .locator("header summary")
      .filter({ hasText: "Switch portal" })
      .click();
    await p
      .getByRole("link", { name: "Technology", exact: true })
      .filter({ visible: true })
      .click();
    await p.waitForURL(base + "/technology");
    check(
      "Multi-membership switch works",
      (await p.getByRole("heading", { level: 1 }).count()) === 1,
    );
    await go(p, "/technology/developer");
    check(
      "Multi-membership Developer permitted",
      (await p.getByRole("heading", { level: 1 }).count()) === 1,
    );
    await go(p, "/account");
    await p.getByRole("button", { name: "Sign out", exact: true }).click();
    await p.waitForURL(base + "/login");
    await go(p, "/academic");
    check(
      "faculty-it normal logout protects route",
      new URL(p.url()).pathname === "/login",
    );
    await c.close();
    const { c: tc, p: tp } = await context("technology");
    await go(tp, "/technology/accounts");
    for (const viewport of [widths[0], widths[2], widths[3]]) {
      await tp.setViewportSize(viewport);
      await metric(tp, "Technology correction " + viewport.width);
      await cap(
        tp,
        "technology-correction",
        "technology",
        "Read-only directory warning once",
      );
    }
    await go(tp, "/account");
    await tp.getByRole("button", { name: "Sign out", exact: true }).click();
    await tp.waitForURL(base + "/login");
    await tc.close();
  }
  for (const width of [375, 1920])
    for (const kind of ["network-abort", "http-503"])
      await failureCase("account", width, kind);
  for (const width of [320, 768, 1440])
    await failureCase("account", width, "http-503");
  await failureCase("menu", 375, "network-abort");
  await failureCase("drawer", 375, "http-503");
  await failureCase("account", 375, "unconfirmed-200");
  result.finishedAt = new Date().toISOString();
  result.summary = {
    checks: result.checks.length,
    failed: result.checks.filter((c) => !c.pass).length,
    responsive: result.responsive.length,
    responsiveFailures: result.responsive.filter((c) => !c.pass).length,
    captures: result.captures.length,
    pageErrors: result.pageErrors.length,
  };
  save();
  console.log(JSON.stringify(result.summary));
  await browser.close();
}
run().catch(async (e) => {
  result.fatal = e.message;
  save();
  console.error(e.message);
  if (browser) await browser.close();
  process.exitCode = 1;
});
