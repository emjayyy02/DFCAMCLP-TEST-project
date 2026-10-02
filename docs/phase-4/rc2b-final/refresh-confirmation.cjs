/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs"),
  path = require("node:path"),
  { parseEnv } = require("node:util");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const env = parseEnv(fs.readFileSync(".env", "utf8")),
  base = "http://localhost:3109";
const cases = [
  [375, "network-abort"],
  [375, "http-503"],
  [1920, "network-abort"],
  [1920, "http-503"],
  [320, "http-503"],
  [768, "http-503"],
  [1440, "http-503"],
  [375, "unconfirmed-200"],
];
const result = {
  startedAt: new Date().toISOString(),
  basis:
    "The eight original reload assertions incorrectly expected a portal summary on neutral /account. This run checks the guarded Account identity and protected Student access instead.",
  checks: [],
  captures: [],
  errors: [],
};
const save = () =>
  fs.writeFileSync(
    path.join(__dirname, "refresh-confirmation.json"),
    JSON.stringify(result, null, 2),
  );
function check(name, pass, detail) {
  result.checks.push({ name, pass, detail });
  save();
}
let browser;
async function run() {
  browser = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  for (const [width, kind] of cases) {
    const id = width + " " + kind,
      c = await browser.newContext({
        viewport: {
          width,
          height:
            width === 1920 ? 1080 : width === 768 || width === 1440 ? 900 : 812,
        },
      });
    await c.addInitScript(() =>
      localStorage.setItem("dfcamclp.demoDisclosure.ackVersion", "fd7-v1"),
    );
    const login = await c.request.post(base + "/api/portal-login", {
      headers: { origin: base },
      data: {
        email: "student.test@example.invalid",
        password: env.AUTH_SEED_PASSWORD,
        portal: "STUDENT",
      },
    });
    check(id + " login", login.ok());
    const p = await c.newPage();
    p.on("pageerror", (e) => {
      result.errors.push(e.message);
      save();
    });
    await p.goto(base + "/account", { waitUntil: "networkidle" });
    await p.route("**/api/auth/sign-out", (r) =>
      kind === "network-abort"
        ? r.abort("failed")
        : r.fulfill({
            status: kind === "http-503" ? 503 : 200,
            contentType: "application/json",
            body: JSON.stringify(
              kind === "http-503"
                ? { message: "Injected outage" }
                : { success: false },
            ),
          }),
    );
    await p.getByRole("button", { name: "Sign out", exact: true }).click();
    await p
      .getByText("Sign-out could not be confirmed. Please try again.", {
        exact: true,
      })
      .waitFor();
    check(
      id + " failure stays Account",
      new URL(p.url()).pathname === "/account",
    );
    check(
      id + " failure permits retry",
      await p
        .getByRole("button", { name: "Sign out", exact: true })
        .isEnabled(),
    );
    await p.unroute("**/api/auth/sign-out");
    const reload = await p.reload({ waitUntil: "networkidle" });
    check(
      id + " guarded Account remains signed in after reload",
      reload.status() === 200 &&
        new URL(p.url()).pathname === "/account" &&
        (await p.locator("main").innerText()).includes(
          "student.test@example.invalid",
        ),
    );
    check(
      id + " neutral Account H1 present",
      (await p
        .getByRole("heading", { name: "Account profile", exact: true })
        .count()) === 1,
    );
    const file = "reload-confirmation-" + width + "-" + kind + ".png";
    await p.screenshot({
      path: path.join(__dirname, file),
      fullPage: true,
      animations: "disabled",
    });
    result.captures.push({
      file,
      route: "/account",
      viewport: p.viewportSize(),
      state: "Guarded neutral Account after failed sign-out and reload",
      capturedAt: new Date().toISOString(),
    });
    save();
    const protectedResponse = await p.goto(base + "/student", {
      waitUntil: "networkidle",
    });
    check(
      id + " protected Student remains authenticated",
      protectedResponse.status() === 200 &&
        new URL(p.url()).pathname === "/student" &&
        (await p.locator("summary.account-trigger").count()) === 1,
    );
    await p.goto(base + "/account", { waitUntil: "networkidle" });
    await p.getByRole("button", { name: "Sign out", exact: true }).click();
    await p.waitForURL(base + "/login");
    check(id + " retry succeeds", new URL(p.url()).pathname === "/login");
    await p.goto(base + "/student", { waitUntil: "networkidle" });
    check(
      id + " successful retry revokes protected access",
      new URL(p.url()).pathname === "/login",
    );
    await c.close();
  }
  result.finishedAt = new Date().toISOString();
  result.summary = {
    checks: result.checks.length,
    failed: result.checks.filter((c) => !c.pass).length,
    captures: result.captures.length,
    pageErrors: result.errors.length,
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
