import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { developmentAuthAccountSeed as seeds } from "../../../src/server/db/seed/data.ts";

const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = "http://localhost:3130",
  password = process.env.DEMO_ACCOUNT_PASSWORD;
const out = new URL("./", import.meta.url);
const expected = JSON.parse(
  fs.readFileSync(new URL("./sync-verification.json", out), "utf8"),
).accounts;
const ensure = (condition, label) => {
  if (!condition) throw new Error(label);
};
let browser;
const results = [],
  geometry = [];
async function settle(page) {
  await page.waitForLoadState("networkidle");
  const d = page.locator("dialog.demo-disclosure-dialog[open]");
  if (await d.count())
    await d
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
}
async function identity(page, account) {
  const session = await (
    await page.request.get(base + "/api/auth/get-session")
  ).json();
  ensure(
    session?.user?.email === account.email &&
      session?.user?.name === account.name,
    "Authenticated identity mismatch.",
  );
  const menu = page.locator("header .account-trigger");
  await menu.click();
  const popup = page.locator("header .portal-popover").filter({
    has: page.getByRole("link", { name: "View profile", exact: true }),
  });
  ensure(
    (await popup.innerText()).includes(account.name) &&
      (await popup.innerText()).includes(account.email),
    "Account menu identity mismatch.",
  );
  await popup.getByRole("link", { name: "View profile", exact: true }).click();
  await page.waitForURL(base + "/account");
  await settle(page);
  const text = await page.locator("main").innerText();
  ensure(
    text.includes(account.name) && text.includes(account.email),
    "Account profile mismatch.",
  );
  for (const m of account.memberships)
    for (const role of m.roleLabels)
      ensure(text.includes(role), "Account role mismatch.");
}
try {
  ensure(
    typeof password === "string" && password.length >= 12,
    "Missing approved demo credential.",
  );
  browser = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  for (const seed of seeds) {
    const account = expected.find((a) => a.email === seed.email);
    ensure(!!account, "Missing canonical account expectation.");
    const programmatic = [];
    for (const m of account.memberships) {
      const c = await browser.newContext();
      const response = await c.request.post(base + "/api/portal-login", {
        headers: { origin: base },
        data: { email: seed.email, password, portal: m.portal },
      });
      ensure(
        response.status() === 200,
        "Canonical credential did not authenticate.",
      );
      const session = await (
        await c.request.get(base + "/api/auth/get-session")
      ).json();
      ensure(
        session?.user?.name === seed.name &&
          session?.user?.email === seed.email,
        "Programmatic identity mismatch.",
      );
      const profile = await c.request.get(base + "/account");
      const body = await profile.text();
      ensure(
        profile.status() === 200 &&
          m.roleLabels.every((role) => body.includes(role)),
        "Programmatic role verification failed.",
      );
      programmatic.push({
        portal: m.portal,
        roleCodes: m.roleCodes,
        identityMatches: true,
        authenticated: true,
      });
      await c.request.post(base + "/api/auth/sign-out", {
        headers: { origin: base },
      });
      await c.close();
    }
    const c = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        permissions: ["clipboard-read", "clipboard-write"],
      }),
      page = await c.newPage();
    let signInRequests = 0;
    page.on("request", (r) => {
      if (r.url().endsWith("/api/portal-login")) signInRequests++;
    });
    await page.goto(base + "/login");
    await settle(page);
    await page
      .getByRole("button", { name: "View demo accounts", exact: true })
      .click();
    const dialog = page.locator("dialog.demo-accounts-dialog[open]"),
      field = dialog.getByLabel("Demo password", { exact: true });
    ensure(
      (await field.getAttribute("type")) === "password",
      "Demo credential is not initially masked.",
    );
    ensure(
      (await field.inputValue()) === password,
      "Panel configuration mismatch.",
    );
    ensure(
      (await dialog.locator(".demo-account-row").count()) === 9,
      "Panel account count mismatch.",
    );
    const row = dialog
      .locator(".demo-account-row")
      .filter({ hasText: seed.email });
    await row.getByRole("button", { name: /Copy email/ }).click();
    ensure(
      (await page.evaluate(() => navigator.clipboard.readText())) ===
        seed.email,
      "Copy email failed.",
    );
    await dialog
      .getByRole("button", { name: "Show demo password", exact: true })
      .click();
    ensure(
      (await field.getAttribute("type")) === "text" &&
        (await field.inputValue()) === password,
      "Show demo password failed.",
    );
    await dialog
      .getByRole("button", { name: "Copy demo password", exact: true })
      .click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    ensure(copied === password, "Copy demo password failed.");
    await dialog
      .getByRole("button", { name: "Hide demo password", exact: true })
      .click();
    if (seed === seeds[0]) {
      for (const width of [320, 375, 768, 1440, 1920]) {
        await page.setViewportSize({
          width,
          height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
        });
        for (const font of ["100%", "200%"]) {
          await page.evaluate(
            (f) => (document.documentElement.style.fontSize = f),
            font,
          );
          const m = await page.evaluate(() => {
            const d = document.querySelector("dialog.demo-accounts-dialog"),
              b = d.querySelector(".demo-accounts-body"),
              r = d.getBoundingClientRect();
            return {
              width: innerWidth,
              scrollWidth: document.documentElement.scrollWidth,
              dialogWidth: r.width,
              dialogHeight: r.height,
              viewportHeight: innerHeight,
              bodyWidth: b.clientWidth,
              bodyScroll: b.scrollWidth,
            };
          });
          ensure(
            m.scrollWidth <= m.width &&
              m.dialogWidth <= m.width &&
              m.dialogHeight <= m.viewportHeight &&
              m.bodyScroll <= m.bodyWidth,
            "Demo panel overflow.",
          );
          geometry.push({ width, font, ...m });
          if ((width === 375 || width === 1440) && font === "100%")
            await page.screenshot({
              path: fileURLToPath(new URL("panel-" + width + ".png", out)),
              fullPage: true,
              animations: "disabled",
            });
        }
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.evaluate(
        () => (document.documentElement.style.fontSize = "100%"),
      );
      await dialog
        .getByRole("button", { name: "Copy demo password", exact: true })
        .focus();
      await page.keyboard.press("Escape");
      ensure(
        await page
          .getByRole("button", { name: "View demo accounts", exact: true })
          .evaluate((e) => e === document.activeElement),
        "Dialog focus did not return.",
      );
      await page
        .getByRole("button", { name: "View demo accounts", exact: true })
        .click();
      ensure(
        (await field.getAttribute("type")) === "password",
        "Reopened dialog must reset masking.",
      );
      await page.keyboard.press("Shift+Tab");
      ensure(
        await dialog
          .getByRole("button", { name: /Use this account/ })
          .last()
          .evaluate((e) => e === document.activeElement),
        "Dialog backward focus escape.",
      );
      await page.keyboard.press("Tab");
      ensure(
        await dialog
          .getByRole("button", { name: "Close", exact: true })
          .evaluate((e) => e === document.activeElement),
        "Dialog forward focus escape.",
      );
    }
    await row.getByRole("button", { name: /Use this account/ }).click();
    ensure(
      (await page.locator("#email").inputValue()) === seed.email,
      "Email prefill failed.",
    );
    ensure(
      (await page.locator("#password").inputValue()) === "" &&
        signInRequests === 0,
      "Panel must not auto-login or prefill the sign-in password.",
    );
    const primary = account.memberships[0];
    await page.locator("#portal").selectOption(primary.portal);
    await page.locator("#password").fill(copied);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL(base + "/" + primary.portal.toLowerCase());
    await settle(page);
    await identity(page, account);
    const switched = [];
    for (const m of account.memberships) {
      await page.goto(base + "/" + primary.portal.toLowerCase());
      await settle(page);
      if (m.portal !== primary.portal) {
        await page
          .locator("header summary")
          .filter({ hasText: "Switch portal" })
          .click();
        await page
          .locator("header .portal-popover")
          .getByRole("link", {
            name: new RegExp(
              m.portal === "TECHNOLOGY" ? "Technology" : "Academic",
            ),
          })
          .click();
        await page.waitForURL(base + "/" + m.portal.toLowerCase());
        await settle(page);
      }
      const session = await (
        await page.request.get(base + "/api/auth/get-session")
      ).json();
      ensure(
        session?.user?.email === seed.email,
        "Portal switching changed identity.",
      );
      switched.push(m.portal);
    }
    await page.locator("header .account-trigger").click();
    await page
      .locator("header .portal-popover")
      .getByRole("button", { name: "Sign out", exact: true })
      .click();
    await page.waitForURL(/\/login(?:\?|$)/);
    ensure(
      !(await (await page.request.get(base + "/api/auth/get-session")).json())
        ?.user,
      "Sign-out left an authenticated session.",
    );
    const protectedResponse = await page.request.get(base + "/account");
    ensure(
      new URL(protectedResponse.url()).pathname === "/login",
      "Protected route available after logout.",
    );
    results.push({
      name: seed.name,
      email: seed.email,
      programmatic,
      cleanBrowserSignIn: true,
      maskedByDefault: true,
      showHideCopy: true,
      emailPrefillOnly: true,
      profileAndRolesMatch: true,
      authorizedPortals: switched,
      signOut: true,
    });
    await c.close();
  }
  await browser.close();
  browser = null;
  fs.writeFileSync(
    new URL("browser-verification.json", out),
    JSON.stringify(
      {
        pass: true,
        accounts: results.length,
        results,
        geometry,
        keyboardFocus: true,
        noAutoLogin: true,
        passwordRecorded: false,
        production: "localhost:3130",
      },
      null,
      2,
    ),
  );
  console.log(
    "Credential and clean-browser verification passed for all nine accounts and ten authorized memberships.",
  );
} catch {
  if (browser) await browser.close();
  console.error(
    "Credential browser verification failed; sensitive details suppressed.",
  );
  process.exitCode = 1;
}
