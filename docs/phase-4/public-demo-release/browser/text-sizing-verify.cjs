/* eslint-disable @typescript-eslint/no-require-imports -- Focused browser regression for the discovered enlarged-text overlap. */
const {
  chromium,
} = require("C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { parseEnv } = require("node:util");
const base = "http://localhost:3122",
  out = path.resolve("docs/phase-4/public-demo-release/browser"),
  env = parseEnv(fs.readFileSync(".env", "utf8"));
const manifest = JSON.parse(
  fs.readFileSync("final-check-pass-4/manifest.json", "utf8"),
);
const metrics = [];
let browser;
async function settle(p) {
  await p.waitForLoadState("networkidle");
  const d = p.locator("dialog.demo-disclosure-dialog[open]");
  if (await d.count())
    await d
      .getByRole("button", { name: "I understand — Enter demo", exact: true })
      .click();
  await p.evaluate(() => document.fonts.ready);
}
async function check(p, label) {
  const m = await p.evaluate(() => {
    const box = (e) => {
      const r = e.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    };
    const titles = [
      ...document.querySelectorAll(
        ".page-title,.context-header-title,.demo-notice-label,.demo-notice-detail",
      ),
    ].map((e) => ({
      font: parseFloat(getComputedStyle(e).fontSize),
      line: parseFloat(getComputedStyle(e).lineHeight),
    }));
    const photos = [
      ...document.querySelectorAll("main .demo-photo-control"),
    ].map((e) => ({
      control: box(e),
      avatar: box(e.querySelector(".avatar")),
      copy: e
        .closest(".identity-summary")
        ?.querySelector(".identity-summary-copy")
        ? box(
            e
              .closest(".identity-summary")
              .querySelector(".identity-summary-copy"),
          )
        : null,
    }));
    const textRects = (e) => {
      const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
        rects = [];
      let n;
      while ((n = walker.nextNode())) {
        if (!n.textContent.trim()) continue;
        const r = document.createRange();
        r.selectNodeContents(n);
        rects.push(
          ...[...r.getClientRects()].map((v) => ({
            left: v.left,
            right: v.right,
            top: v.top,
            bottom: v.bottom,
          })),
        );
      }
      return rects;
    };
    const brand = document.querySelector(".portal-masthead-brand");
    const branding = brand
      ? {
          box: box(brand),
          text: textRects(brand),
          account: box(document.querySelector(".account-trigger")),
          navigation: document.querySelector(
            'button[aria-label="Open portal navigation"]',
          )
            ? box(
                document.querySelector(
                  'button[aria-label="Open portal navigation"]',
                ),
              )
            : null,
        }
      : null;
    const academicControls = [
      ...document.querySelectorAll(".academic-button-compact"),
    ].map((e) => ({ box: box(e), text: textRects(e) }));
    const academicTasks = [
      ...document.querySelectorAll(".academic-task-list li > div"),
    ].map((e) => ({
      box: box(e),
      text: textRects(e),
      controls: [...e.parentElement.querySelectorAll(":scope > a")].map(box),
    }));
    const academicSchedule = [
      ...document.querySelectorAll(".academic-today-list li > div"),
    ].map((e) => ({
      box: box(e),
      text: textRects(e),
      neighbors: [
        ...e.parentElement.querySelectorAll(":scope > time,:scope > a"),
      ].map(box),
    }));
    const queues = [
      ...document.querySelectorAll(
        ".operations-queue-link,.records-queue-link",
      ),
    ]
      .map((e) => {
        const copy = e.querySelector(":scope > span:first-child"),
          count = e.querySelector(
            ".operations-queue-count,.records-queue-count",
          );
        return copy && count
          ? { copy: box(copy), text: textRects(copy), count: box(count) }
          : null;
      })
      .filter(Boolean);
    return {
      width: innerWidth,
      height: innerHeight,
      font: parseFloat(getComputedStyle(document.documentElement).fontSize),
      scrollWidth: document.documentElement.scrollWidth,
      titles,
      photos,
      branding,
      academicControls,
      academicTasks,
      academicSchedule,
      queues,
    };
  });
  if (m.scrollWidth > m.width) {
    await p.screenshot({
      path: path.resolve(
        "docs/phase-4/public-demo-release/before-text-fix/enlarged-text-diagnostic.png",
      ),
      fullPage: true,
    });
    console.error(
      JSON.stringify(
        await p.evaluate(() =>
          [...document.querySelectorAll("body *")]
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return r.width && r.right > innerWidth;
            })
            .map((e) => ({
              tag: e.tagName,
              class: e.className,
              right: e.getBoundingClientRect().right,
            })),
        ),
      ),
    );
  }
  assert(m.scrollWidth <= m.width, label + " page overflow");
  assert(
    m.titles.every((t) => t.line >= t.font),
    label + " title overlap",
  );
  for (const p of m.photos) {
    assert(
      p.avatar.right <= p.control.right + 1 &&
        p.avatar.bottom <= p.control.bottom + 1,
      label + " unreserved avatar",
    );
    if (p.copy)
      assert(
        p.copy.left >= p.avatar.right - 1 || p.copy.top >= p.avatar.bottom - 1,
        label + " identity text obscured",
      );
  }
  const within = (r, b) =>
    r.left >= b.left - 1 &&
    r.right <= b.right + 1 &&
    r.top >= b.top - 2 &&
    r.bottom <= b.bottom + 2;
  const apart = (a, b) =>
    a.right <= b.left + 1 ||
    b.right <= a.left + 1 ||
    a.bottom <= b.top + 1 ||
    b.bottom <= a.top + 1;
  if (m.branding) {
    assert(
      m.branding.text.every((r) => within(r, m.branding.box)),
      label + " branding text clipped",
    );
    assert(
      apart(m.branding.box, m.branding.account),
      label + " branding obscured by Account",
    );
    if (m.branding.navigation?.width)
      assert(
        apart(m.branding.box, m.branding.navigation),
        label + " branding obscured by navigation",
      );
  }
  for (const c of m.academicControls) {
    if (!c.text.every((r) => within(r, c.box)))
      console.error(JSON.stringify(c));
    assert(
      c.text.every((r) => within(r, c.box)),
      label + " academic control text outside button",
    );
  }
  for (const t of m.academicTasks) {
    assert(
      t.text.every((r) => within(r, t.box)),
      label + " academic task text outside its column",
    );
    assert(
      t.controls.every((c) => apart(t.box, c)),
      label + " academic task obscured by control",
    );
  }
  for (const t of m.academicSchedule) {
    assert(
      t.text.every((r) => within(r, t.box)),
      label + " academic schedule text outside column",
    );
    assert(
      t.neighbors.every((c) => apart(t.box, c)),
      label + " academic schedule obscured",
    );
  }
  for (const q of m.queues) {
    assert(
      q.text.every((r) => within(r, q.copy)),
      label + " queue description outside column",
    );
    assert(
      apart(q.copy, q.count),
      label + " queue description obscured by count",
    );
  }
  metrics.push({ label, ...m });
}
(async () => {
  browser = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });
  for (const a of manifest.accounts) {
    const c = await browser.newContext(),
      p = await c.newPage();
    assert.equal(
      (
        await c.request.post(base + "/api/portal-login", {
          headers: { origin: base },
          data: {
            email: a.email,
            password: env.AUTH_SEED_PASSWORD,
            portal: a.memberships[0].portal,
          },
        })
      ).status(),
      200,
    );
    await p.goto(base + "/account");
    await settle(p);
    for (const width of [320, 375, 768, 1440, 1920]) {
      await p.setViewportSize({
        width,
        height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
      });
      for (const font of ["100%", "200%"]) {
        await p.evaluate(
          (font) => (document.documentElement.style.fontSize = font),
          font,
        );
        await check(p, a.group + " account " + font);
        if (width === 375 && font === "200%")
          await p.screenshot({
            path: path.join(out, "account-" + a.group + "-text200.png"),
            fullPage: true,
            animations: "disabled",
          });
      }
    }
    await p.setViewportSize({ width: 375, height: 812 });
    await p.evaluate(() => (document.documentElement.style.fontSize = "200%"));
    if (a.group === "student")
      await p.screenshot({
        path: path.join(out, "account-text200.png"),
        fullPage: true,
        animations: "disabled",
      });
    for (const member of a.memberships) {
      const slug =
        member.portal === "ACADEMIC" ? "academic" : member.portal.toLowerCase();
      await p.goto(base + "/" + slug);
      await settle(p);
      for (const width of [320, 375, 768, 1440, 1920]) {
        await p.setViewportSize({
          width,
          height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
        });
        for (const font of ["100%", "200%"]) {
          await p.evaluate(
            (font) => (document.documentElement.style.fontSize = font),
            font,
          );
          await check(
            p,
            a.group + " " + slug + " dashboard " + width + " " + font,
          );
          if (width === 375 && font === "200%")
            await p.screenshot({
              path: path.join(
                out,
                a.group + "-" + slug + "-dashboard-text200.png",
              ),
              fullPage: true,
              animations: "disabled",
            });
          if (width === 320 && font === "200%")
            await p.screenshot({
              path: path.join(
                out,
                a.group + "-" + slug + "-dashboard-320-text200.png",
              ),
              fullPage: true,
              animations: "disabled",
            });
        }
      }
      if (a.group === "student" || a.group === "applicant") {
        await p.goto(base + "/" + slug + "/profile");
        await settle(p);
        for (const width of [320, 375, 768, 1440, 1920]) {
          await p.setViewportSize({
            width,
            height: width < 768 ? 812 : width === 1920 ? 1080 : 900,
          });
          for (const font of ["100%", "200%"]) {
            await p.evaluate(
              (font) => (document.documentElement.style.fontSize = font),
              font,
            );
            await check(p, a.group + " domain profile " + width + " " + font);
            if (width === 375 && font === "200%")
              await p.screenshot({
                path: path.join(out, a.group + "-domain-profile-text200.png"),
                fullPage: true,
                animations: "disabled",
              });
            if (width === 320 && font === "200%")
              await p.screenshot({
                path: path.join(
                  out,
                  a.group + "-domain-profile-320-text200.png",
                ),
                fullPage: true,
                animations: "disabled",
              });
          }
        }
      }
    }
    await c.request.post(base + "/api/auth/sign-out", {
      headers: { origin: base },
    });
    await c.close();
  }
  fs.writeFileSync(
    path.join(out, "text-sizing-verification.json"),
    JSON.stringify(
      {
        measurements: metrics.length,
        accountIdentities: manifest.accounts.length,
        avatarReservation: true,
        identityTextVisible: true,
        headingsDoNotOverlap: true,
        brandingVisible: true,
        academicButtonTextContained: true,
        academicTasksUnobscured: true,
        academicScheduleUnobscured: true,
        queueDescriptionsUnobscured: true,
        demoNoticeTextDoesNotOverlap: true,
        normalGeometryPreserved:
          "Checks cover five widths at normal and enlarged text; narrow academic task groups stack when font-relative space is insufficient.",
        metrics,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log("Enlarged-text overlap regression passed for all nine accounts.");
})().catch(async (error) => {
  if (browser) await browser.close();
  console.error("Enlarged-text overlap regression failed: " + error.message);
  process.exitCode = 1;
});
