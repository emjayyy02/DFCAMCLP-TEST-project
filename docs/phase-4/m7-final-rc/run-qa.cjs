/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const { parseEnv } = require("node:util");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const base = "http://localhost:3000";
const root = process.cwd();
const out = path.join(root, "docs/phase-4/m7-final-rc/runtime-checks.json");
const baseline = JSON.parse(
  fs.readFileSync(
    path.join(root, "final-check-before-uiux/manifest.json"),
    "utf8",
  ),
);
const env = parseEnv(fs.readFileSync(path.join(root, ".env"), "utf8"));
const result = {
  browser: "Microsoft Edge Chromium",
  startedAt: new Date().toISOString(),
  routes: [],
  accountGroups: [],
  responsive: [],
  contrast: [],
  interactions: [],
  errors: [],
};
const save = () => fs.writeFileSync(out, JSON.stringify(result, null, 2));
let browser;

function check(name, pass, detail = "") {
  result.interactions.push({ name, pass, detail });
  if (!pass) result.errors.push({ name, detail });
}

async function inspect(page) {
  return page.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    heading: document.querySelector("h1")?.textContent?.trim() || "",
    font: getComputedStyle(document.body).fontFamily,
    missingImages: [...document.images]
      .filter((image) => !image.naturalWidth)
      .map((image) => image.getAttribute("src")),
  }));
}

async function loginContext(account) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "Asia/Manila",
  });
  const response = await context.request.post(base + "/api/portal-login", {
    headers: { origin: base },
    data: {
      email: account.email,
      password: env.AUTH_SEED_PASSWORD,
      portal: account.memberships[0].portal,
    },
  });
  if (!response.ok())
    throw Error(`${account.group} login HTTP ${response.status()}`);
  return context;
}

async function navigate(page, route) {
  const response = await page.goto(base + route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return response;
}

async function run() {
  browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const contexts = new Map();
  const pages = new Map();
  for (const account of baseline.accounts) {
    const context = await loginContext(account);
    contexts.set(account.group, context);
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on("pageerror", (error) =>
      result.errors.push({ group: account.group, pageError: error.message }),
    );
    pages.set(account.group, page);
    const route = account.allowedRoutes.find((item) => item !== "/account");
    const response = await navigate(page, route);
    const metrics = await inspect(page);
    result.accountGroups.push({
      group: account.group,
      route,
      status: response.status(),
      heading: metrics.heading,
      pass: response.status() === 200 && !!metrics.heading,
    });
  }

  const publicContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const publicPage = await publicContext.newPage();
  publicPage.on("pageerror", (error) =>
    result.errors.push({ group: "public", pageError: error.message }),
  );
  pages.set("public", publicPage);
  const publicRoutes = [
    "/",
    "/programs",
    "/admissions",
    "/about",
    "/login",
    "/account/create",
    "/account/create/applicant",
    "/account/recovery",
  ];
  for (const route of publicRoutes) {
    const response = await navigate(publicPage, route);
    const metrics = await inspect(publicPage);
    result.routes.push({
      group: "public",
      route,
      status: response.status(),
      ...metrics,
      pass:
        response.status() === 200 &&
        !!metrics.heading &&
        metrics.documentWidth <= metrics.viewport &&
        !metrics.missingImages.length,
    });
  }
  for (const route of baseline.routeInventory) {
    const account = baseline.accounts.find((item) =>
      item.allowedRoutes.includes(route),
    );
    if (!account) throw Error(`No account for ${route}`);
    const page = pages.get(account.group);
    const response = await navigate(page, route);
    const metrics = await inspect(page);
    result.routes.push({
      group: account.group,
      route,
      status: response.status(),
      ...metrics,
      pass:
        response.status() === 200 &&
        !!metrics.heading &&
        metrics.documentWidth <= metrics.viewport &&
        !metrics.missingImages.length,
    });
  }
  save();

  await navigate(publicPage, "/login");
  result.contrast = await publicPage.evaluate(() => {
    const luminance = (value) => {
      const channels =
        value
          .match(/[\d.]+/g)
          ?.slice(0, 3)
          .map(Number) || [];
      if (channels.length !== 3) return NaN;
      const linear = channels.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    return [
      ["email input", document.querySelector("input[type='email']")],
      ["sign-in action", document.querySelector("button[type='submit']")],
    ].map(([name, element]) => {
      if (!element) return { name, pass: false, detail: "missing" };
      const style = getComputedStyle(element);
      const foreground = luminance(style.color);
      const background = luminance(style.backgroundColor);
      const ratio =
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05);
      return {
        name,
        foreground: style.color,
        background: style.backgroundColor,
        ratio: Number(ratio.toFixed(2)),
        pass: ratio >= 4.5,
      };
    });
  });
  for (const sample of result.contrast) {
    if (!sample.pass) result.errors.push({ contrast: sample });
  }

  const matrix = [
    ["public", "/"],
    ["public", "/programs"],
    ["public", "/login"],
    ["applicant", "/applicant/application"],
    ["student", "/student/calendar"],
    ["faculty", "/academic/attendance"],
    ["records", "/records/applicants"],
    ["school-admin", "/operations/employees"],
    ["technology", "/technology/accounts"],
    ["public", "/missing-m7-page"],
  ];
  for (const [group, route] of matrix) {
    const page = pages.get(group);
    for (const [width, height] of [
      [320, 812],
      [375, 812],
      [768, 900],
      [1440, 900],
      [1920, 1080],
    ]) {
      await page.setViewportSize({ width, height });
      const response = await navigate(page, route);
      const metrics = await inspect(page);
      result.responsive.push({
        group,
        route,
        width,
        height,
        status: response.status(),
        ...metrics,
        pass:
          response.status() === (route.includes("missing") ? 404 : 200) &&
          !!metrics.heading &&
          metrics.documentWidth <= width &&
          !metrics.missingImages.length,
      });
    }
  }
  for (const [group, route] of [
    ["public", "/login"],
    ["applicant", "/applicant/application"],
    ["student", "/student/calendar"],
    ["records", "/records/applicants"],
    ["technology", "/technology/accounts"],
  ]) {
    const page = pages.get(group);
    await page.setViewportSize({ width: 768, height: 900 });
    await navigate(page, route);
    const style = await page.addStyleTag({
      content: "html{font-size:32px!important}",
    });
    const metrics = await inspect(page);
    result.responsive.push({
      group,
      route,
      width: 768,
      height: 900,
      textSize: "200% computed root size",
      ...metrics,
      pass: metrics.documentWidth <= 768,
    });
    await style.evaluate((element) => element.remove());
  }
  save();

  await publicPage.setViewportSize({ width: 375, height: 812 });
  await navigate(publicPage, "/");
  await publicPage.keyboard.press("Tab");
  check(
    "public skip link first focus",
    await publicPage.evaluate(
      () => document.activeElement?.textContent?.trim() === "Skip to content",
    ),
  );
  const applicantPage = pages.get("applicant");
  await applicantPage.setViewportSize({ width: 375, height: 812 });
  await navigate(applicantPage, "/applicant");
  const drawerTrigger = applicantPage.getByRole("button", {
    name: "Open portal navigation",
  });
  await drawerTrigger.click();
  check(
    "drawer opens",
    (await applicantPage.locator("dialog[open]").count()) === 1,
  );
  check(
    "drawer uses restrained 180ms entrance",
    (await applicantPage
      .locator("dialog[open]")
      .evaluate((element) => getComputedStyle(element).animationDuration)) ===
      "0.18s",
  );
  for (let i = 0; i < 18; i++) {
    await applicantPage.keyboard.press("Tab");
    const inside = await applicantPage.evaluate(
      () => !!document.activeElement?.closest("dialog[open]"),
    );
    if (!inside) result.errors.push({ name: "drawer focus escaped", tab: i });
  }
  await applicantPage.keyboard.press("Escape");
  check(
    "drawer Escape and focus return",
    (await applicantPage.locator("dialog[open]").count()) === 0 &&
      (await drawerTrigger.evaluate(
        (element) => element === document.activeElement,
      )),
  );
  await applicantPage.emulateMedia({ reducedMotion: "reduce" });
  await drawerTrigger.click();
  const reducedDrawer = await applicantPage
    .locator("dialog[open]")
    .evaluate((element) => ({
      duration: getComputedStyle(element).animationDuration,
      visible: getComputedStyle(element).opacity === "1",
    }));
  check(
    "reduced motion drawer immediately complete",
    reducedDrawer.duration === "0s" && reducedDrawer.visible,
    JSON.stringify(reducedDrawer),
  );
  await applicantPage.keyboard.press("Escape");
  await applicantPage.emulateMedia({ reducedMotion: "no-preference" });
  await applicantPage.setViewportSize({ width: 1440, height: 900 });
  await navigate(applicantPage, "/applicant/dcat");
  await applicantPage
    .locator(".applicant-navigation-tools:visible select")
    .first()
    .selectOption("scheduled");
  const previewTrigger = applicantPage
    .getByRole("button", { name: "Preview DCAT form" })
    .first();
  await previewTrigger.click();
  check(
    "sample document dialog has reachable actions",
    (await applicantPage.getByRole("dialog").count()) === 1 &&
      (await applicantPage
        .getByRole("button", { name: "Close preview" })
        .count()) === 1 &&
      (await applicantPage
        .getByRole("button", { name: "Print / Save as PDF" })
        .count()) === 1,
  );
  await applicantPage.keyboard.press("Escape");
  check(
    "sample document Escape returns focus",
    (await applicantPage.getByRole("dialog").count()) === 0 &&
      (await previewTrigger.evaluate(
        (element) => element === document.activeElement,
      )),
  );

  const recordsPage = pages.get("records");
  await recordsPage.setViewportSize({ width: 1440, height: 900 });
  await navigate(recordsPage, "/records/applicants");
  const sortHeader = recordsPage.getByRole("button", {
    name: /Sort by Applicant/,
  });
  await sortHeader.focus();
  check(
    "sortable header focus visible",
    await sortHeader.evaluate((element) => element.matches(":focus-visible")),
  );
  await recordsPage.keyboard.press("Enter");
  check(
    "sortable header keyboard activates",
    (await recordsPage.locator("th[aria-sort='ascending']").count()) === 1,
  );
  await recordsPage.keyboard.press("Enter");
  check(
    "sortable header reverses",
    (await recordsPage.locator("th[aria-sort='descending']").count()) === 1,
  );

  const facultyPage = pages.get("faculty");
  await facultyPage.setViewportSize({ width: 1440, height: 900 });
  await navigate(facultyPage, "/academic/attendance");
  const tab = facultyPage
    .getByRole("tab", { name: "Grades", exact: true })
    .first();
  if (await tab.count()) {
    await tab.focus();
    await facultyPage.keyboard.press("ArrowRight");
    check(
      "academic tab Arrow key",
      (await facultyPage.locator("[role='tab']:focus").count()) === 1,
    );
  }

  const reduced = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reduced.newPage();
  await navigate(reducedPage, "/");
  await reducedPage.getByRole("button", { name: "Menu" }).click();
  const reducedState = await reducedPage.evaluate(() => {
    const element = document.querySelector(
      ".public-navigation[data-open='true']",
    );
    return {
      visible: !!element && getComputedStyle(element).display !== "none",
      animation: element
        ? getComputedStyle(element).animationDuration
        : "missing",
    };
  });
  check(
    "reduced motion public menu complete",
    reducedState.visible && reducedState.animation === "0s",
    JSON.stringify(reducedState),
  );
  await reduced.close();

  const session = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const sessionPage = await session.newPage();
  const student = baseline.accounts.find(
    (account) => account.group === "student",
  );
  await navigate(sessionPage, "/login");
  await sessionPage
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  check(
    "login required-field validation",
    (await sessionPage.locator("input:invalid").count()) > 0,
  );
  await sessionPage
    .getByLabel("Portal", { exact: true })
    .selectOption("STUDENT");
  await sessionPage
    .getByLabel("Email address", { exact: true })
    .fill(student.email);
  await sessionPage
    .getByLabel("Password", { exact: true })
    .fill(env.AUTH_SEED_PASSWORD);
  await sessionPage
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  await sessionPage.waitForURL(/\/student(?:\?.*)?$/);
  check(
    "UI sign in reaches Student",
    new URL(sessionPage.url()).pathname === "/student",
  );
  await navigate(sessionPage, "/technology");
  check(
    "direct denied route",
    (await sessionPage
      .getByRole("heading", { name: "Access denied" })
      .count()) === 1,
  );
  await navigate(sessionPage, "/student/profile");
  await navigate(sessionPage, "/");
  await sessionPage.goBack({ waitUntil: "networkidle" });
  check(
    "public Back retains session",
    new URL(sessionPage.url()).pathname === "/student/profile" &&
      (await sessionPage.getByRole("heading", { name: "Profile" }).count()) ===
        1,
  );
  await sessionPage.goForward({ waitUntil: "networkidle" });
  await sessionPage.goBack({ waitUntil: "networkidle" });
  await sessionPage.reload({ waitUntil: "networkidle" });
  check(
    "Forward Back reload retains session",
    new URL(sessionPage.url()).pathname === "/student/profile" &&
      (await sessionPage.getByRole("heading", { name: "Profile" }).count()) ===
        1,
  );
  await navigate(sessionPage, "/student");
  await sessionPage
    .locator("header summary")
    .filter({ hasText: "Account" })
    .click();
  check(
    "Account menu opens",
    (await sessionPage
      .getByRole("link", { name: "Account", exact: true })
      .count()) > 0,
  );
  const accountPopover = sessionPage.locator(
    "header details[open] .portal-popover",
  );
  check(
    "Account popover uses restrained 180ms entrance",
    (await accountPopover.evaluate(
      (element) => getComputedStyle(element).animationDuration,
    )) === "0.18s",
  );
  await sessionPage.emulateMedia({ reducedMotion: "reduce" });
  check(
    "reduced motion popover immediately complete",
    (await accountPopover.evaluate(
      (element) => getComputedStyle(element).animationDuration,
    )) === "0s",
  );
  await sessionPage.getByRole("button", { name: "Sign out" }).click();
  await sessionPage.waitForURL(/\/login/);
  check(
    "sign out returns to login",
    new URL(sessionPage.url()).pathname === "/login",
  );
  await session.close();

  const multiPage = pages.get("faculty-it");
  await multiPage.setViewportSize({ width: 1440, height: 900 });
  await navigate(multiPage, "/academic");
  await multiPage
    .locator("header summary")
    .filter({ hasText: "Switch portal" })
    .click();
  await multiPage
    .getByRole("link", { name: "Technology", exact: true })
    .click();
  await multiPage.waitForURL(/\/technology/);
  check(
    "multi-membership switch",
    new URL(multiPage.url()).pathname === "/technology",
  );
  const techNav = await multiPage.locator("aside nav a").allTextContents();
  check(
    "Technology role navigation",
    techNav.some((name) => name.includes("Developer")),
  );

  result.completedAt = new Date().toISOString();
  result.summary = {
    routes: result.routes.length,
    routeFailures: result.routes.filter((item) => !item.pass).length,
    accountGroups: result.accountGroups.length,
    accountFailures: result.accountGroups.filter((item) => !item.pass).length,
    responsive: result.responsive.length,
    responsiveFailures: result.responsive.filter((item) => !item.pass).length,
    contrast: result.contrast.length,
    contrastFailures: result.contrast.filter((item) => !item.pass).length,
    interactions: result.interactions.length,
    interactionFailures: result.interactions.filter((item) => !item.pass)
      .length,
    errors: result.errors.length,
  };
  save();
  for (const context of contexts.values()) await context.close();
  await publicContext.close();
  await browser.close();
  console.log(JSON.stringify(result.summary));
  if (
    result.summary.routeFailures ||
    result.summary.accountFailures ||
    result.summary.responsiveFailures ||
    result.summary.contrastFailures ||
    result.summary.interactionFailures ||
    result.summary.errors
  )
    process.exitCode = 1;
}

run().catch(async (error) => {
  result.errors.push({ fatal: error.message });
  save();
  console.error(error.stack);
  if (browser) await browser.close();
  process.exitCode = 1;
});
