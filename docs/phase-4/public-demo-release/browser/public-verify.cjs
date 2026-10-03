/* eslint-disable @typescript-eslint/no-require-imports -- Local production-browser release evidence. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { parseEnv } = require("node:util");
const base = "http://localhost:3122",
  out = path.resolve("docs/phase-4/public-demo-release/browser");
const env = parseEnv(fs.readFileSync(".env", "utf8"));
const source = fs.readFileSync("src/server/db/seed/data.ts", "utf8");
const accounts = [
  ...source.matchAll(/email: "([^"]+)",\s*name: "([^"]+)"/g),
].map((x) => ({ email: x[1], name: x[2] }));
const manifest = JSON.parse(
  fs.readFileSync("final-check-pass-4/manifest.json", "utf8"),
);
const result = {
  public: [],
  legal: [],
  auth: [],
  access: [],
  responsive: [],
  keyboard: [],
  errors: [],
};
let browser,
  stage = "launch";
async function settle(p) {
  await p.waitForLoadState("networkidle");
  const d = p.locator("dialog.demo-disclosure-dialog[open]");
  if (await d.count())
    await d
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
  await p.evaluate(() => document.fonts.ready);
}
async function go(p, route) {
  await p.goto(base + route);
  await settle(p);
}
async function shot(p, name) {
  await p.screenshot({
    path: path.join(out, name + ".png"),
    fullPage: true,
    animations: "disabled",
  });
}
async function metric(p, label) {
  const m = await p.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert(m.scrollWidth <= m.width, label + " overflow");
  result.responsive.push({ label, ...m });
}
async function login(c, email, portal, password = env.AUTH_SEED_PASSWORD) {
  return c.request.post(base + "/api/portal-login", {
    headers: { origin: base },
    data: { email, password, portal },
  });
}
(async () => {
  browser = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  const c = await browser.newContext({
      permissions: ["clipboard-read", "clipboard-write"],
    }),
    p = await c.newPage();
  p.on("pageerror", (e) => result.errors.push(e.message));
  const routes = [
    "/",
    "/programs",
    "/admissions",
    "/about",
    "/login",
    "/account/create",
    "/account/recovery",
    "/release-fictional-missing",
    "/disclaimer",
    "/terms",
    "/privacy",
    "/acceptable-use",
    "/about-developer",
  ];
  for (const width of [320, 375, 768, 1440, 1920]) {
    await p.setViewportSize({
      width,
      height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
    });
    for (const route of routes) {
      stage = "public " + route + " " + width;
      const response = await p.goto(base + route);
      await settle(p);
      assert.equal(
        response.status(),
        route === "/release-fictional-missing" ? 404 : 200,
      );
      assert((await p.locator("main h1").count()) > 0);
      await metric(p, route);
      assert.equal(
        await p
          .locator("input:not([type=password]), textarea")
          .evaluateAll(
            (es) =>
              es.filter((e) =>
                /silveriomarvin|Marvin Silverio|gmail\.com/i.test(e.value),
              ).length,
          ),
        0,
      );
      if (
        ["/", "/login", "/release-fictional-missing"].includes(route) &&
        [375, 1440].includes(width)
      )
        await shot(
          p,
          (route === "/" ? "home" : route === "/login" ? "login" : "404") +
            "-" +
            width,
        );
      result.public.push({ route, width, status: response.status() });
    }
  }
  stage = "login hierarchy/panel";
  await go(p, "/login");
  await p.setViewportSize({ width: 375, height: 812 });
  for (const selector of [".login-heading h1", ".login-intro"])
    assert.equal(
      await p.locator(selector).evaluate((e) => getComputedStyle(e).textAlign),
      "center",
    );
  const create = await p.locator(".login-create-account").boundingBox(),
    recover = await p
      .getByRole("link", {
        name: "Forgot password / account help",
        exact: true,
      })
      .boundingBox();
  assert(create.y < recover.y);
  assert.equal(
    await p
      .getByText("Demo accounts only. Do not enter real student information.", {
        exact: true,
      })
      .count(),
    0,
  );
  await p
    .getByRole("button", { name: "View demo accounts", exact: true })
    .press("Enter");
  const modal = p.getByRole("dialog", { name: "Demo accounts", exact: true });
  await modal.waitFor();
  assert.equal(await modal.locator(".demo-account-row").count(), 9);
  for (const a of accounts)
    assert(
      (await modal.innerText()).includes(a.name) &&
        (await modal.innerText()).includes(a.email),
    );
  assert.equal(await modal.getByText(/shared demo password/i).count(), 0);
  await p.keyboard.press("Shift+Tab");
  assert(await modal.evaluate((e) => e.contains(document.activeElement)));
  await p.keyboard.press("Tab");
  assert(await modal.evaluate((e) => e.contains(document.activeElement)));
  await modal
    .getByRole("button", { name: /^Copy email for / })
    .first()
    .click();
  const copied = await p.evaluate(() => navigator.clipboard.readText());
  assert(accounts.some((a) => a.email === copied));
  await shot(p, "demo-accounts-375");
  const chosen = await modal.locator(".demo-account-email").first().innerText();
  await modal
    .getByRole("button", { name: /^Use this account:/ })
    .first()
    .click();
  assert.equal(await p.getByLabel("Email address").inputValue(), chosen);
  assert.equal(await p.getByLabel("Portal", { exact: true }).inputValue(), "");
  assert.equal(
    await p.getByLabel("Password", { exact: true }).inputValue(),
    "",
  );
  assert.equal(
    await p
      .getByLabel("Email address")
      .evaluate((e) => e === document.activeElement),
    true,
  );
  const invalid = await login(
    c,
    "johnpaul.reyes@example.invalid",
    "STUDENT",
    "incorrect-fictional-password",
  );
  assert.equal(invalid.status(), 401);
  const wrong = await login(c, "johnpaul.reyes@example.invalid", "ACADEMIC");
  assert.equal(wrong.status(), 403);
  await go(p, "/student");
  assert.equal(new URL(p.url()).pathname, "/login");
  result.auth.push({
    invalid: 401,
    wrongPortal: 403,
    noSessionAfterWrongPortal: true,
    panelCount: 9,
    copy: true,
    emailOnly: true,
    publicPasswordAbsent: true,
  });
  await p.getByLabel("Portal", { exact: true }).selectOption("STUDENT");
  await p.getByLabel("Email address").fill("johnpaul.reyes@example.invalid");
  await p.getByLabel("Password", { exact: true }).fill(env.AUTH_SEED_PASSWORD);
  await p.getByRole("button", { name: "Sign in", exact: true }).press("Enter");
  await p.waitForURL("**/student");
  await settle(p);
  result.auth.push({ formLogin: true });
  await p
    .getByRole("button", { name: "Open portal navigation", exact: true })
    .press("Enter");
  const drawer = p.locator("dialog.portal-drawer");
  await drawer.waitFor({ state: "visible" });
  const buttons = drawer.locator("a[href],button:not([disabled])");
  await buttons.last().focus();
  await p.keyboard.press("Tab");
  assert(await drawer.evaluate((e) => e.contains(document.activeElement)));
  await p.keyboard.press("Escape");
  assert.equal(
    await p
      .getByRole("button", { name: "Open portal navigation", exact: true })
      .evaluate((e) => e === document.activeElement),
    true,
  );
  const box = await p
    .getByRole("button", { name: "Open portal navigation", exact: true })
    .boundingBox();
  assert(box.width >= 44 && box.height >= 44);
  result.keyboard.push({ drawerContainmentReturn: true, touchTarget: true });
  for (const kind of ["network-abort", "http-503", "unconfirmed-200"]) {
    stage = "failed logout " + kind;
    await go(p, "/account");
    await p.route("**/api/auth/sign-out", async (r) =>
      kind === "network-abort"
        ? r.abort("failed")
        : r.fulfill({
            status: kind === "http-503" ? 503 : 200,
            contentType: "application/json",
            body: JSON.stringify(
              kind === "http-503"
                ? { message: "Fictional test outage" }
                : { success: false },
            ),
          }),
    );
    await p.getByRole("button", { name: "Sign out", exact: true }).click();
    await p
      .getByRole("alert")
      .filter({ hasText: "Sign-out could not be confirmed." })
      .waitFor();
    assert.equal(new URL(p.url()).pathname, "/account");
    assert(
      await p
        .getByRole("button", { name: "Sign out", exact: true })
        .isEnabled(),
    );
    await metric(p, "failed sign-out " + kind);
    if (kind === "http-503") await shot(p, "failed-signout-375");
    await p.unroute("**/api/auth/sign-out");
    await p.reload();
    await settle(p);
    assert.equal(new URL(p.url()).pathname, "/account");
    result.auth.push({
      failedSignOut: kind,
      truthfulError: true,
      retryEnabled: true,
      sessionRetained: true,
    });
  }
  await p.getByRole("link", { name: "Open Student", exact: true }).click();
  await p.waitForURL("**/student");
  await p.goBack();
  await settle(p);
  assert.equal(new URL(p.url()).pathname, "/account");
  await p.goForward();
  await settle(p);
  assert.equal(new URL(p.url()).pathname, "/student");
  result.auth.push({ backForward: true });
  await go(p, "/account");
  await p.getByRole("button", { name: "Sign out", exact: true }).click();
  await p.waitForURL("**/login");
  await go(p, "/account");
  assert.equal(new URL(p.url()).pathname, "/login");
  await c.close();
  for (const route of ["disclaimer", "terms", "privacy", "acceptable-use"]) {
    stage = "pre-ack legal " + route;
    const lc = await browser.newContext({
        viewport: { width: 375, height: 812 },
        reducedMotion: "reduce",
      }),
      lp = await lc.newPage();
    await lp.goto(base + "/login?portal=APPLICANT");
    const gate = lp.locator("dialog.demo-disclosure-dialog[open]");
    await gate.waitFor();
    await gate
      .locator('a[href="/' + route + '"]')
      .first()
      .press("Enter");
    await lp.waitForURL("**/" + route);
    await lp.waitForLoadState("networkidle");
    assert.equal(
      await lp.locator("main h1").evaluate((e) => e === document.activeElement),
      true,
    );
    await lp.goBack();
    await gate.waitFor();
    assert.equal(new URL(lp.url()).search, "?portal=APPLICANT");
    await lp.goForward();
    await lp.waitForURL("**/" + route);
    assert.equal(await gate.count(), 0);
    result.legal.push({
      route,
      beforeAcceptance: true,
      headingFocus: true,
      backForward: true,
      reducedMotion: true,
    });
    await lc.close();
  }
  const denied = {
    applicant: "/technology",
    student: "/academic",
    faculty: "/academic/management",
    records: "/operations",
    operations: "/operations/employees",
    technology: "/technology/developer",
    coordinator: "/technology",
    "school-admin": "/technology",
    "faculty-it": "/records",
  };
  for (const a of manifest.accounts) {
    stage = "access " + a.group;
    const sc = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      }),
      sp = await sc.newPage();
    assert.equal(
      (await login(sc, a.email, a.memberships[0].portal)).status(),
      200,
    );
    await go(sp, denied[a.group]);
    assert(
      await sp
        .getByRole("heading", { name: "Access denied", exact: true })
        .isVisible(),
    );
    if (a.group === "student") await shot(sp, "denied-student");
    const home =
      "/" +
      (a.memberships[0].portal === "ACADEMIC"
        ? "academic"
        : a.memberships[0].portal.toLowerCase());
    for (const width of [320, 375, 768, 1440, 1920]) {
      await sp.setViewportSize({
        width,
        height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
      });
      await go(sp, home);
      await metric(sp, a.group + " dashboard");
      await sp.locator(".account-trigger").press("Enter");
      await metric(sp, a.group + " account menu");
      if (width === 375 || width === 1440)
        await shot(sp, a.group + "-dashboard-" + width);
      await sp.keyboard.press("Escape");
      assert.equal(
        await sp
          .locator(".account-trigger")
          .evaluate((e) => e === document.activeElement),
        true,
      );
    }
    if (a.group === "student") {
      await sp.setViewportSize({ width: 375, height: 812 });
      await go(sp, "/account");
      await sp.evaluate(
        () => (document.documentElement.style.fontSize = "200%"),
      );
      await metric(sp, "account 200% text");
      await shot(sp, "account-text200");
    }
    if (a.group === "records") {
      await sp.setViewportSize({ width: 1440, height: 900 });
      await go(sp, "/records/students");
      const sort = sp.locator("th[aria-sort] button").first();
      assert(await sort.isVisible());
      assert.equal(
        await sort.locator("..").getAttribute("aria-sort"),
        "ascending",
      );
      await sort.press("Enter");
      await sp.waitForFunction(
        () =>
          document.querySelector("th[aria-sort]").getAttribute("aria-sort") ===
          "descending",
      );
      await sort.press("Enter");
      await sp.waitForFunction(
        () =>
          document.querySelector("th[aria-sort]").getAttribute("aria-sort") ===
          "ascending",
      );
      await go(sp, "/records/applicants?record=APP-TEST-0001");
      const tabs = sp.getByRole("tab");
      assert((await tabs.count()) > 1);
      await tabs.first().focus();
      await sp.keyboard.press("ArrowRight");
      await sp.waitForFunction(
        () =>
          document
            .querySelectorAll('[role="tab"]')[1]
            .getAttribute("aria-selected") === "true",
      );
      await sp.keyboard.press("End");
      await sp.waitForFunction(
        () =>
          [...document.querySelectorAll('[role="tab"]')]
            .at(-1)
            .getAttribute("aria-selected") === "true",
      );
      result.keyboard.push({ sortableHeader: true, tabArrowEnd: true });
    }
    result.access.push({
      group: a.group,
      denied: denied[a.group],
      reloadedAuthorizedDashboard: true,
    });
    await sc.request.post(base + "/api/auth/sign-out", {
      headers: { origin: base },
    });
    await sc.close();
  }
  stage = "independent shared-account presentation";
  const a = await browser.newContext(),
    b = await browser.newContext(),
    pa = await a.newPage(),
    pb = await b.newPage();
  for (const ctx of [a, b])
    assert.equal(
      (await login(ctx, "johnpaul.reyes@example.invalid", "STUDENT")).status(),
      200,
    );
  await go(pa, "/account");
  await go(pb, "/account");
  await pa.getByRole("button", { name: "Edit bio", exact: true }).click();
  await pa.getByLabel("Your demo bio").fill("Fictional reviewer A preview.");
  await pa.getByRole("button", { name: "Apply demo bio", exact: true }).click();
  assert(
    await pa
      .getByText("Fictional reviewer A preview.", { exact: true })
      .isVisible(),
  );
  assert.equal(
    await pb
      .getByText("Fictional reviewer A preview.", { exact: true })
      .count(),
    0,
  );
  for (const [endpoint, method, body] of [
    ["update-user", "POST", { name: "Fictional Release Probe" }],
    ["list-sessions", "GET"],
    ["revoke-other-sessions", "POST", {}],
  ]) {
    const response = await a.request.fetch(base + "/api/auth/" + endpoint, {
      method,
      headers: { origin: base },
      ...(body ? { data: body } : {}),
    });
    assert.equal(response.status(), 403);
  }
  await pa.getByRole("button", { name: "Sign out", exact: true }).click();
  await pa.waitForURL("**/login");
  await pb.reload();
  await settle(pb);
  assert.equal(new URL(pb.url()).pathname, "/account");
  assert(await pb.getByText("John Paul Reyes", { exact: true }).isVisible());
  result.auth.push({
    concurrentBioIsolated: true,
    sharedApiRestricted: true,
    oneLogoutLeavesOtherSignedIn: true,
  });
  await b.request.post(base + "/api/auth/sign-out", {
    headers: { origin: base },
  });
  await a.close();
  await b.close();
  assert.equal(result.errors.length, 0);
  fs.writeFileSync(
    path.join(out, "public-auth-verification.json"),
    JSON.stringify(result, null, 2),
  );
  await browser.close();
  console.log(
    "Public, access, keyboard, and concurrent-reviewer verification passed.",
  );
})().catch(async (error) => {
  if (browser) await browser.close();
  let message = error.message;
  for (const [key, value] of Object.entries(env))
    if (/PASSWORD|SECRET|TOKEN|DATABASE_URL/.test(key) && value)
      message = message.replaceAll(value, "[REDACTED]");
  console.error(
    "Release browser assertion failed at " + stage + ": " + message,
  );
  process.exitCode = 1;
});
