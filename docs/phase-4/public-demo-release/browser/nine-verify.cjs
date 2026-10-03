/* eslint-disable @typescript-eslint/no-require-imports -- Node verification harness uses workstation CommonJS dependencies. */
const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict"),
  { parseEnv } = require("node:util");
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root = process.cwd(),
  base = "http://localhost:3122",
  out = path.join(root, "docs/phase-4/public-demo-release/browser");
const m = JSON.parse(fs.readFileSync("final-check-pass-4/manifest.json"));
const source = fs.readFileSync("src/server/db/seed/data.ts", "utf8");
const accounts = [
  ...source.matchAll(/email: "([^"]+)",\s*name: "([^"]+)"/g),
].map((x) => ({ email: x[1], name: x[2] }));
const env = parseEnv(fs.readFileSync(".env", "utf8"));
let results = [];
async function settle(p) {
  await p.waitForTimeout(150);
  await p.waitForLoadState("networkidle");
  const d = p.locator("dialog.demo-disclosure-dialog[open]");
  if (await d.count())
    await d
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
  await p.evaluate(() => document.fonts.ready);
}
async function screenshot(p, name) {
  await p.screenshot({
    path: path.join(out, name + ".png"),
    fullPage: true,
    animations: "disabled",
  });
}
async function menu(p, a) {
  await p.locator(".account-trigger").click();
  const link = p.getByRole("link", {
    name: "View profile for " + a.name,
    exact: true,
  });
  await link.waitFor();
  assert.equal(
    (await link.locator(".identity-summary-name").innerText()).trim(),
    a.name,
  );
  assert.equal(
    (await link.locator(".identity-summary-detail").innerText()).trim(),
    a.email,
  );
  const initials = a.name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  assert.equal((await link.locator(".avatar").innerText()).trim(), initials);
  return link;
}
(async () => {
  const b = await chromium.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  for (const item of m.accounts) {
    const a = accounts.find((account) => account.email === item.email);
    assert.ok(a);
    const c = await b.newContext({ viewport: { width: 1440, height: 900 } }),
      p = await c.newPage();
    const res = await c.request.post(base + "/api/portal-login", {
      headers: { origin: base },
      data: {
        email: a.email,
        password: env.AUTH_SEED_PASSWORD,
        portal: item.memberships[0].portal,
      },
    });
    assert.equal(res.status(), 200);
    let report = {
      group: item.group,
      ...a,
      portals: [],
      routes: [],
      photo: false,
    };
    for (const member of item.memberships) {
      const slug =
        member.portal === "ACADEMIC" ? "academic" : member.portal.toLowerCase();
      await p.goto(base + "/" + slug);
      await settle(p);
      if (slug === "student")
        assert.equal(
          await p.locator("main h1").innerText(),
          "Good morning, " + a.name.split(" ")[0] + ".",
        );
      if (slug === "academic")
        assert.equal(
          await p.locator("#academic-welcome-title").innerText(),
          "Good morning, " + a.name + ".",
        );
      await menu(p, a);
      await screenshot(p, item.group + "-" + slug + "-menu");
      await p
        .locator("details[open]")
        .getByRole("link", { name: "View profile", exact: true })
        .click();
      await p.waitForURL("**/account");
      await settle(p);
      assert.equal(new URL(p.url()).pathname, "/account");
      assert.equal(
        (
          await p
            .locator(".account-profile-identity .identity-summary-name")
            .innerText()
        ).trim(),
        a.name,
      );
      assert.equal(
        (
          await p
            .locator(".account-profile-identity .identity-summary-detail")
            .innerText()
        ).trim(),
        a.email,
      );
      const accountText = await p.locator("main").innerText();
      for (const mem of item.memberships) {
        const role = mem.role
          .split("_")
          .map((s) => s[0] + s.slice(1).toLowerCase())
          .join(" ");
        assert.ok(
          accountText.toLowerCase().includes(role.toLowerCase()),
          "Membership role missing " + role,
        );
      }
      await screenshot(p, item.group + "-account");
      report.portals.push(member.portal);
      await p
        .getByRole("link", {
          name: new RegExp(
            "Open " +
              (slug === "academic"
                ? "Academic"
                : slug === "technology"
                  ? "Technology"
                  : slug === "student"
                    ? "Student"
                    : slug === "applicant"
                      ? "Applicant"
                      : slug === "records"
                        ? "Admissions"
                        : "Operations"),
            "i",
          ),
        })
        .click();
      await settle(p);
      if (item.memberships.length > 1) {
        await p.locator("summary").filter({ hasText: "Switch portal" }).click();
        const next = item.memberships.find((x) => x.portal !== member.portal);
        await p
          .locator("details[open]")
          .filter({
            has: p.locator("summary").filter({ hasText: "Switch portal" }),
          })
          .getByRole("link", {
            name: new RegExp(
              next.portal === "TECHNOLOGY" ? "Technology" : "Academic",
            ),
          })
          .click();
        await p.waitForURL(
          "**/" + (next.portal === "TECHNOLOGY" ? "technology" : "academic"),
        );
        await settle(p);
        assert.ok(
          new URL(p.url()).pathname.startsWith(
            next.portal === "TECHNOLOGY" ? "/technology" : "/academic",
          ),
        );
        await menu(p, a);
        await p.locator(".account-trigger").click();
      }
    }
    for (const route of item.allowedRoutes) {
      await p.goto(base + route);
      await settle(p);
      let data = await p.evaluate(() => ({
        text: document.querySelector("main").innerText,
        inputs: [...document.querySelectorAll("main input,main textarea")]
          .filter((e) => e.type !== "password")
          .map((e) => e.value),
      }));
      assert.ok(
        !/silveriomarvin|gmail\.com|Marvin Silverio/i.test(
          data.text + " " + data.inputs.join(" "),
        ),
      );
      if (route === "/academic/classes") assert.ok(data.text.includes(a.name));
      report.routes.push(route);
      if (route.endsWith("/profile")) {
        assert.ok(data.text.includes(a.name));
        assert.ok(data.text.includes(a.email));
        assert.equal(
          (await p.locator("main .identity-summary-name").innerText()).trim(),
          a.name,
        );
        await screenshot(p, item.group + "-domain-profile");
      }
    }
    // Apply a synthetic pixel image through the real picker, then navigate with links.
    await p.goto(base + "/account");
    await settle(p);
    await p
      .getByRole("button", { name: "Add demo photo", exact: true })
      .click();
    await p.getByLabel("Choose demo profile image").setInputFiles({
      name: "synthetic.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=",
        "base64",
      ),
    });
    await p.getByRole("button", { name: "Use photo", exact: true }).click();
    await p
      .getByRole("link", { name: /^Open / })
      .first()
      .click();
    await p
      .locator(".account-trigger .avatar img")
      .waitFor({ state: "visible" });
    await settle(p);
    assert.equal(await p.locator(".account-trigger .avatar img").count(), 1);
    if (item.allowedRoutes.some((x) => x.endsWith("/profile"))) {
      await p
        .getByRole("link", { name: "Profile", exact: true })
        .filter({ visible: true })
        .click();
      await p
        .locator("main .demo-photo-control > .avatar img")
        .waitFor({ state: "visible" });
      await settle(p);
      assert.equal(
        await p.locator("main .demo-photo-control > .avatar img").count(),
        1,
      );
    }
    report.photo = true;
    results.push(report);
    fs.writeFileSync(
      path.join(out, "nine-account-verification.json"),
      JSON.stringify(results, null, 2),
    );
    console.log("Identity verified " + item.group);
    await p.goto(
      base +
        "/" +
        (item.memberships[0].portal === "ACADEMIC"
          ? "academic"
          : item.memberships[0].portal.toLowerCase()),
    );
    await settle(p);
    await p.locator(".account-trigger").click();
    await p.getByRole("button", { name: "Sign out", exact: true }).click();
    await p.waitForURL("**/login");
    report.signOut = true;
    fs.writeFileSync(
      path.join(out, "nine-account-verification.json"),
      JSON.stringify(results, null, 2),
    );
    await p.goto(base + "/account");
    await settle(p);
    assert.equal(new URL(p.url()).pathname, "/login");
    report.protectedAfterLogout = true;
    fs.writeFileSync(
      path.join(out, "nine-account-verification.json"),
      JSON.stringify(results, null, 2),
    );
    await c.close();
  }
  await b.close();
  console.log("Verified all nine identities");
})().catch((e) => {
  console.error(e.stack);
  process.exit(1);
});
