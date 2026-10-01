/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const { parseEnv } = require("node:util");
const { execFileSync } = require("node:child_process");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = "http://localhost:3000";
const out = path.join(process.cwd(), "docs/phase-4/fd6-after");
const baseline = JSON.parse(
  fs.readFileSync("final-check-before-uiux/manifest.json", "utf8"),
);
const before = JSON.parse(
  fs.readFileSync("docs/phase-4/m7-final-rc/golden/manifest.json", "utf8"),
);
const env = parseEnv(fs.readFileSync(".env", "utf8"));
const result = {
  date: "2026-10-01 Asia/Taipei",
  startedAt: new Date().toISOString(),
  commit: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  dirty: execFileSync("git", ["status", "--short"], {
    encoding: "utf8",
  }).trim(),
  browser: "Microsoft Edge Chromium / Next.js production server",
  captures: [],
  checks: [],
  errors: [],
  responsive: [],
};
const save = () =>
  fs.writeFileSync(
    path.join(
      out,
      process.argv.includes("--keyboard")
        ? "keyboard-confirmation.json"
        : process.argv.includes("--interactions")
          ? "interactions-manifest.json"
          : "manifest.json",
    ),
    JSON.stringify(result, null, 2),
  );
function check(name, pass, detail = "") {
  result.checks.push({ name, pass, detail });
  if (!pass) result.errors.push({ name, detail });
  save();
}
async function go(page, route) {
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}
async function metrics(page) {
  return page.evaluate(() => ({
    width: innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    heading: document.querySelector("h1")?.textContent,
    columns: document.querySelector(
      ".applicant-task-layout,.applicant-dashboard-layout",
    )
      ? getComputedStyle(
          document.querySelector(
            ".applicant-task-layout,.applicant-dashboard-layout",
          ),
        ).gridTemplateColumns
      : null,
    motion: getComputedStyle(document.documentElement).getPropertyValue(
      "--motion-feedback",
    ),
  }));
}
async function capture(page, id, group, state, fullPage = true) {
  const m = await metrics(page),
    url = new URL(page.url()),
    name = id + "-" + m.width + ".png";
  await page.screenshot({
    path: path.join(out, name),
    fullPage,
    animations: "disabled",
  });
  result.captures.push({
    id,
    group,
    state,
    url: url.pathname + url.search,
    viewport: page.viewportSize(),
    motion: await page.evaluate(() =>
      matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "reduce"
        : "no-preference",
    ),
    expected: "Visible content and reachable controls, no page overflow",
    actual: m,
    after: name,
    before: before.captures
      .filter((c) => c.url === url.pathname + url.search)
      .flatMap((c) => c.after.map((p) => "../m7-final-rc/golden/" + p)),
  });
  check(id + " no overflow", m.pageWidth <= m.width, m);
}
async function scenario(page, value) {
  if (page.viewportSize().width < 1024) {
    await page.getByRole("button", { name: "Open portal navigation" }).click();
    await page
      .locator("dialog[open]")
      .getByRole("combobox", { name: "Demo scenario" })
      .selectOption(value);
    await page.keyboard.press("Escape");
  } else
    await page
      .getByRole("combobox", { name: "Demo scenario" })
      .filter({ visible: true })
      .selectOption(value);
}
async function openAccount(page) {
  await page.waitForLoadState("networkidle");
  await page.locator("summary.account-trigger").click();
  await page
    .getByRole("link", { name: "View profile", exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole("heading", { name: "Account profile", exact: true })
    .waitFor();
}
let browser;
async function run() {
  browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const pages = new Map(),
    contexts = new Map();
  for (const account of baseline.accounts.filter(
    (account) =>
      !process.argv.includes("--keyboard") || account.group === "applicant",
  )) {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      timezoneId: "Asia/Manila",
    });
    const login = await context.request.post(base + "/api/portal-login", {
      headers: { origin: base },
      data: {
        email: account.email,
        password: env.AUTH_SEED_PASSWORD,
        portal: account.memberships[0].portal,
      },
    });
    check(account.group + " login", login.ok(), login.status());
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on("pageerror", (error) => {
      result.errors.push({ group: account.group, error: error.message });
      save();
    });
    pages.set(account.group, page);
    contexts.set(account.group, context);
    await go(page, "/account");
    const identity = await page
      .locator(".account-profile-identity")
      .innerText();
    check(
      account.group + " account identity",
      identity.includes(account.email),
      identity,
    );
    check(
      account.group + " memberships",
      (await page.locator(".account-memberships li").count()) ===
        account.memberships.length,
    );
    if (
      ["student", "records"].includes(account.group) ||
      account.memberships.length > 1
    ) {
      for (const width of [1920, 375]) {
        await page.setViewportSize({
          width,
          height: width === 1920 ? 1080 : 812,
        });
        await capture(
          page,
          "F06-account-" + account.group,
          account.group,
          "Shared identity and memberships",
        );
      }
    }
  }
  if (process.argv.includes("--keyboard")) {
    const page = pages.get("applicant");
    for (const route of [
      "/applicant/application",
      "/applicant/dcat",
      "/applicant/enrollment",
    ]) {
      for (const width of [320, 375, 768, 1440, 1920]) {
        for (const reducedMotion of ["no-preference", "reduce"]) {
          await page.setViewportSize({
            width,
            height: width === 1920 ? 1080 : width >= 768 ? 900 : 812,
          });
          await page.emulateMedia({ reducedMotion });
          await go(page, route);
          const masthead = await page.evaluate(() => {
            const wordmark = document
              .querySelector(".institution-wordmark")
              .getBoundingClientRect();
            const account = document
              .querySelector(".account-trigger")
              .getBoundingClientRect();
            const line = getComputedStyle(
              document.querySelector(".page-header"),
              "::after",
            );
            return {
              wordmarkRight: wordmark.right,
              accountLeft: account.left,
              contextLine: {
                display: line.display,
                width: line.width,
                height: line.height,
                background: line.backgroundColor,
                visibility: line.visibility,
              },
            };
          });
          check(
            "Masthead separation " + route + " " + width + " " + reducedMotion,
            masthead.wordmarkRight <= masthead.accountLeft,
            masthead,
          );
          await page.getByRole("tab").first().focus();
          await page.keyboard.press("End");
          const detail = await page
            .getByRole("tab")
            .last()
            .evaluate((element) => {
              const rect = element.getBoundingClientRect();
              return {
                left: rect.left,
                right: rect.right,
                viewport: innerWidth,
                selected: element.getAttribute("aria-selected"),
                focused: element === document.activeElement,
                outline: getComputedStyle(element).outlineStyle,
                pageWidth: document.documentElement.scrollWidth,
              };
            });
          check(
            "End tab visible " + route + " " + width + " " + reducedMotion,
            detail.left >= 0 &&
              detail.right <= width &&
              detail.pageWidth <= width &&
              detail.selected === "true" &&
              detail.focused &&
              detail.outline === "solid",
            detail,
          );
          if (width <= 375 && reducedMotion === "no-preference")
            await capture(
              page,
              "keyboard-end-" + route.split("/").at(-1),
              "applicant",
              "End key / final tab fully visible",
              false,
            );
          await page.keyboard.press("Home");
          const home = await page
            .getByRole("tab")
            .first()
            .evaluate((element) => {
              const r = element.getBoundingClientRect();
              return (
                r.left >= 0 &&
                r.right <= innerWidth &&
                element.getAttribute("aria-selected") === "true" &&
                element === document.activeElement
              );
            });
          check(
            "Home tab visible " + route + " " + width + " " + reducedMotion,
            home,
          );
        }
      }
    }
    result.summary = {
      checks: result.checks.length,
      failed: result.checks.filter((c) => !c.pass).length,
      captures: result.captures.length,
    };
    result.finishedAt = new Date().toISOString();
    save();
    console.log(JSON.stringify(result.summary));
    await browser.close();
    return;
  }
  const publicContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const publicPage = await publicContext.newPage();
  pages.set("public", publicPage);
  const applicant = pages.get("applicant");
  if (!process.argv.includes("--interactions")) {
    for (const [group, route] of [
      ["public", "/"],
      ["public", "/admissions"],
      ["public", "/about"],
      ["applicant", "/applicant"],
      ["applicant", "/applicant/application"],
      ["applicant", "/applicant/dcat"],
      ["applicant", "/applicant/enrollment"],
      ["applicant", "/applicant/announcements"],
      ["applicant", "/applicant/profile"],
      ["student", "/account"],
      ["student", "/student/profile"],
      ["records", "/records/applicants"],
      ["faculty", "/academic/attendance"],
      ["school-admin", "/operations/employees"],
      ["technology", "/technology/accounts"],
    ]) {
      const page = pages.get(group);
      for (const [width, height] of [
        [320, 812],
        [375, 812],
        [768, 900],
        [1440, 900],
        [1920, 1080],
      ]) {
        await page.setViewportSize({ width, height });
        await go(page, route);
        const m = await metrics(page);
        result.responsive.push({
          group,
          route,
          ...m,
          pass: m.pageWidth <= width,
        });
        if (m.pageWidth > width) check(route + width, false, m);
        if (width === 375 || width === 1920)
          await capture(
            page,
            "F12-" + group + "-" + route.replaceAll("/", "_"),
            group,
            "Default route",
          );
      }
    }
    console.log("Responsive matrix complete");
    for (const width of [1920, 375]) {
      await applicant.setViewportSize({
        width,
        height: width === 1920 ? 1080 : 812,
      });
      for (const state of [
        "draft",
        "documents",
        "awaiting",
        "notQualified",
        "cor",
      ]) {
        await go(applicant, "/applicant");
        await scenario(applicant, state);
        await capture(applicant, "F01-dashboard-" + state, "applicant", state);
      }
      for (const [route, state, tabs] of [
        [
          "/applicant/application",
          "draft",
          ["Application form", "Requirements", "Status"],
        ],
        [
          "/applicant/dcat",
          "scheduled",
          ["Exam schedule", "DCAT form", "Results"],
        ],
        ["/applicant/dcat", "notQualified", ["Results"]],
        [
          "/applicant/enrollment",
          "draft",
          ["Progress", "Registrar schedule", "COE / COR"],
        ],
        [
          "/applicant/enrollment",
          "coe",
          ["Progress", "Registrar schedule", "COE / COR"],
        ],
        ["/applicant/enrollment", "cor", ["COE / COR"]],
      ]) {
        await go(applicant, route);
        await scenario(applicant, state);
        for (const tab of tabs) {
          await applicant.getByRole("tab", { name: tab, exact: true }).click();
          await capture(
            applicant,
            "F02-04-" +
              route.split("/").at(-1) +
              "-" +
              state +
              "-" +
              tab.replaceAll(/[^a-zA-Z]/g, ""),
            "applicant",
            state + " / " + tab,
          );
        }
      }
      await go(applicant, "/applicant/announcements");
      await applicant.getByLabel("Notice category").selectOption("DCAT");
      check(
        "Notice filter " + width,
        (
          await applicant.locator(".applicant-notice-meta").allTextContents()
        ).every((t) => t.includes("DCAT")),
      );
      await capture(
        applicant,
        "F05-filtered-notices",
        "applicant",
        "DCAT filter",
      );
    }
    console.log("Applicant state captures complete");
  }
  await require("./interactions.cjs")({
    browser,
    pages,
    contexts,
    baseline,
    go,
    check,
    capture,
    scenario,
    openAccount,
    result,
  });
  await require("./extra-checks.cjs")({ pages, go, check, capture, result });
  result.finishedAt = new Date().toISOString();
  result.summary = {
    checks: result.checks.length,
    failed: result.checks.filter((c) => !c.pass).length,
    responsive: result.responsive.length,
    captures: result.captures.length,
    errors: result.errors.length,
  };
  save();
  console.log(JSON.stringify(result.summary));
  await browser.close();
}
run().catch(async (error) => {
  result.errors.push({ fatal: error.stack });
  save();
  console.error(error.stack);
  if (browser) await browser.close();
  process.exitCode = 1;
});
