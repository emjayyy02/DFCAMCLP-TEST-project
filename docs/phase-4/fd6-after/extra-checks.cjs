/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = async function ({ pages, go, check, capture, result }) {
  const page = pages.get("applicant"),
    publicPage = pages.get("public");
  await page.addInitScript(() => {
    const active = new Set();
    const create = URL.createObjectURL.bind(URL),
      revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      const url = create(value);
      active.add(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      active.delete(url);
      return revoke(url);
    };
    window.fd6ActiveUrls = active;
  });
  await go(page, "/account");
  const sharp = require(
    require.resolve("sharp", { paths: [require.resolve("next/package.json")] }),
  );
  const png = {
    name: "synthetic-fd6.png",
    mimeType: "image/png",
    buffer: await sharp({
      create: { width: 64, height: 64, channels: 3, background: "#0d13cd" },
    })
      .png()
      .toBuffer(),
  };
  for (const width of [320, 1920]) {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 812 });
    await page
      .getByRole("button", { name: /Add demo photo|Change demo photo/ })
      .click();
    await page.locator('input[type="file"]').setInputFiles(png);
    await page.waitForFunction(
      () =>
        !document.querySelector(".demo-photo-dialog-actions button:last-child")
          .disabled,
    );
    const image = page.locator(".demo-photo-control > .avatar img");
    const old = (await image.count()) ? await image.getAttribute("src") : null;
    await capture(
      page,
      "F08-dialog-" + width,
      "applicant",
      "Valid staged image; responsive actions",
    );
    await page.getByRole("button", { name: "Use photo", exact: true }).click();
    await page.locator(".demo-photo-control > .avatar img").waitFor();
    const current = await page
      .locator(".demo-photo-control > .avatar img")
      .getAttribute("src");
    check("Photo apply/replace " + width, !!current && current !== old);
    check(
      "Committed object URL only " + width,
      (await page.evaluate(() => window.fd6ActiveUrls.size)) === 1,
    );
  }
  await page
    .getByRole("button", { name: "Change demo photo", exact: true })
    .click();
  await page.locator('input[type="file"]').setInputFiles([]);
  check(
    "Empty chooser leaves apply disabled",
    !(await page
      .getByRole("button", { name: "Use photo", exact: true })
      .isEnabled()),
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  check(
    "Chooser cancel retains committed URL",
    (await page.evaluate(() => window.fd6ActiveUrls.size)) === 1,
  );
  await page
    .getByRole("button", { name: "Change demo photo", exact: true })
    .click();
  await page.getByRole("button", { name: "Remove photo", exact: true }).click();
  check(
    "Remove revokes owned URL",
    (await page.evaluate(() => window.fd6ActiveUrls.size)) === 0,
  );
  await page.getByRole("button", { name: "Edit bio", exact: true }).click();
  await page.getByLabel("Your demo bio").fill("x".repeat(260));
  check(
    "Native bio limit enforces 240",
    await page
      .getByLabel("Your demo bio")
      .inputValue()
      .then((v) => v.length === 240),
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("link", { name: "Open Applicant", exact: true }).click();
  await page.waitForURL("**/applicant");
  await page
    .getByRole("link", { name: "Profile", exact: true })
    .filter({ visible: true })
    .click();
  await page.waitForURL("**/applicant/profile");
  await page.waitForFunction(
    () => document.querySelector(".page-header")?.dataset.arrival === "true",
  );
  check(
    "Deliberate portal navigation header emphasis",
    (await page.locator(".page-header").getAttribute("data-arrival")) ===
      "true",
  );
  await page.goBack({ waitUntil: "networkidle" });
  check(
    "Back does not replay header",
    (await page.locator(".page-header").getAttribute("data-arrival")) === null,
  );
  await page.setViewportSize({ width: 320, height: 812 });
  await go(page, "/applicant/enrollment");
  const tab = page.getByRole("tab", { name: "Progress", exact: true });
  await tab.focus();
  await page.keyboard.press("End");
  check(
    "End key scrolls final tab into view",
    await page
      .getByRole("tab", { name: "COE / COR", exact: true })
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= 0 && r.right <= innerWidth;
      }),
  );
  await go(page, "/account");
  result.renderedContrast = await page.evaluate(() => {
    const l = (color) => {
      const v = color
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number)
        .map((n) =>
          (n /= 255) <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4,
        );
      return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
    };
    const body = getComputedStyle(document.body),
      marker = getComputedStyle(
        document.querySelector(".demo-photo-trigger > span"),
      );
    return [
      ["body", body.color, body.backgroundColor],
      ["avatar plus", marker.color, marker.backgroundColor],
      ["plus boundary", marker.borderColor, marker.backgroundColor],
    ].map(([name, foreground, background]) => ({
      name,
      foreground,
      background,
      ratio:
        (Math.max(l(foreground), l(background)) + 0.05) /
        (Math.min(l(foreground), l(background)) + 0.05),
    }));
  });
  await publicPage.emulateMedia({
    media: "screen",
    reducedMotion: "no-preference",
  });
  await publicPage.setViewportSize({ width: 1440, height: 900 });
  await go(publicPage, "/");
  await publicPage.locator(".reveal-journey").scrollIntoViewIfNeeded();
  await publicPage.waitForFunction(
    () => document.querySelector(".reveal-journey")?.dataset.reveal === "true",
  );
  check(
    "Public connector progressive reveal",
    (await publicPage
      .locator(".reveal-journey")
      .getAttribute("data-reveal")) === "true",
  );
  check(
    "Public connector 320ms",
    await publicPage
      .locator(".admissions-journey > li")
      .first()
      .evaluate(
        (el) => getComputedStyle(el, "::after").animationDuration === "0.32s",
      ),
  );
  await capture(
    publicPage,
    "F11-normal-connector",
    "public",
    "Connector after first intersection",
  );
  await publicPage
    .getByRole("link", { name: "Admissions overview", exact: true })
    .click();
  await publicPage.waitForURL("**/admissions");
  await publicPage.goBack({ waitUntil: "networkidle" });
  check(
    "Public Back no reveal replay",
    (await publicPage
      .locator(".reveal-journey")
      .getAttribute("data-reveal")) === null,
  );
  await go(publicPage, "/#history-title");
  check(
    "Fragment history immediately visible",
    await publicPage
      .getByRole("heading", { name: "A brief history", exact: true })
      .isVisible(),
  );
  await publicPage.setViewportSize({ width: 375, height: 812 });
  await go(publicPage, "/");
  await publicPage.getByRole("button", { name: "Menu", exact: true }).click();
  check(
    "Public menu 180ms",
    await publicPage
      .locator(".public-navigation")
      .evaluate((el) => getComputedStyle(el).animationDuration === "0.18s"),
  );
  await publicPage.emulateMedia({ reducedMotion: "reduce" });
  check(
    "Public menu settles on preference change",
    await publicPage
      .locator(".public-navigation")
      .evaluate((el) => getComputedStyle(el).animationName === "none"),
  );
};
