/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = async function ({
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
}) {
  const applicant = pages.get("applicant"),
    student = pages.get("student"),
    publicPage = pages.get("public");
  await applicant.setViewportSize({ width: 1440, height: 900 });
  await go(applicant, "/applicant/application");
  await scenario(applicant, "draft");
  await applicant.getByLabel("First name", { exact: false }).fill("");
  await applicant
    .getByRole("button", { name: "Review application", exact: true })
    .click();
  check(
    "Application validation visible",
    await applicant.locator(".applicant-errors").isVisible(),
  );
  await applicant.getByLabel("First name", { exact: false }).fill("Jamie");
  await applicant
    .getByRole("button", { name: "Review application", exact: true })
    .click();
  await applicant
    .getByRole("button", { name: "Submit demo application", exact: true })
    .click();
  check(
    "Application confirmation dialog",
    await applicant.getByRole("dialog").isVisible(),
  );
  await applicant
    .getByRole("button", { name: "Keep reviewing", exact: true })
    .click();
  check(
    "Application confirmation cancel",
    (await applicant.locator("dialog[open]").count()) === 0,
  );
  await capture(
    applicant,
    "F02-review-cancel",
    "applicant",
    "Review retained after cancel",
  );
  await go(applicant, "/applicant/dcat");
  await scenario(applicant, "scheduled");
  await applicant.getByRole("tab", { name: "DCAT form", exact: true }).click();
  await applicant
    .getByRole("button", { name: "Preview DCAT form", exact: true })
    .filter({ visible: true })
    .click();
  await capture(
    applicant,
    "F03-document-preview",
    "applicant",
    "DCAT document open",
  );
  await applicant.keyboard.press("Escape");
  check(
    "Document Escape",
    (await applicant.locator("dialog[open]").count()) === 0,
  );
  const firstTab = applicant.getByRole("tab", {
    name: "Exam schedule",
    exact: true,
  });
  await firstTab.focus();
  await applicant.keyboard.press("End");
  check(
    "Tab End",
    (await applicant
      .getByRole("tab", { name: "Results", exact: true })
      .getAttribute("aria-selected")) === "true",
  );
  await applicant.keyboard.press("Home");
  check("Tab Home", (await firstTab.getAttribute("aria-selected")) === "true");
  await student.setViewportSize({ width: 375, height: 812 });
  await go(student, "/account");
  const posts = [];
  student.on("request", (req) => {
    if (["POST", "PUT", "PATCH"].includes(req.method())) posts.push(req.url());
  });
  await student.getByRole("button", { name: "Edit bio", exact: true }).click();
  check(
    "Bio initial focus",
    await student
      .getByLabel("Your demo bio")
      .evaluate((el) => el === document.activeElement),
  );
  const bio = "Temporary FD6 bio <script>plain text</script>";
  await student.getByLabel("Your demo bio").fill(bio);
  await student
    .getByRole("button", { name: "Apply demo bio", exact: true })
    .click();
  check(
    "Bio plain text",
    (await student.locator(".account-bio-text").innerText()) === bio,
  );
  check(
    "Bio focus return",
    await student
      .getByRole("button", { name: "Edit bio", exact: true })
      .evaluate((el) => el === document.activeElement),
  );
  await student.getByRole("button", { name: "Edit bio", exact: true }).click();
  await student.getByLabel("Your demo bio").fill("Discard this");
  check(
    "Bio 240 limit",
    (await student.getByLabel("Your demo bio").getAttribute("maxlength")) ===
      "240",
  );
  await student.getByRole("button", { name: "Cancel", exact: true }).click();
  check(
    "Bio cancel preserves",
    (await student.locator(".account-bio-text").innerText()) === bio,
  );
  const sharp = require(
    require.resolve("sharp", { paths: [require.resolve("next/package.json")] }),
  );
  const png = {
    name: "fd6-sample.png",
    mimeType: "image/png",
    buffer: await sharp({
      create: { width: 64, height: 64, channels: 3, background: "#0d13cd" },
    })
      .png()
      .toBuffer(),
  };
  async function stage() {
    await student.locator('input[type="file"]').setInputFiles(png);
    await student.waitForFunction(
      () =>
        !document.querySelector(".demo-photo-dialog-actions button:last-child")
          .disabled,
    );
  }
  await student
    .getByRole("button", { name: "Add demo photo", exact: true })
    .click();
  check(
    "Photo initial focus",
    await student
      .getByRole("button", { name: "Choose image", exact: true })
      .evaluate((el) => el === document.activeElement),
  );
  await capture(student, "F08-photo-open", "student", "Initial dialog");
  await stage();
  await capture(student, "F08-photo-preview", "student", "Staged preview");
  await student.getByRole("button", { name: "Cancel", exact: true }).click();
  check(
    "Photo cancel preserves initials",
    (await student
      .locator(".account-profile-identity .demo-photo-control > .avatar img")
      .count()) === 0,
  );
  await student
    .getByRole("button", { name: "Add demo photo", exact: true })
    .click();
  await stage();
  await student.getByRole("button", { name: "Use photo", exact: true }).click();
  check(
    "Photo commit",
    (await student
      .locator(".account-profile-identity .demo-photo-control > .avatar img")
      .count()) === 1,
  );
  check(
    "Photo focus return",
    await student
      .getByRole("button", { name: "Change demo photo", exact: true })
      .evaluate((el) => el === document.activeElement),
  );
  await capture(
    student,
    "F09-account-customized",
    "student",
    "Committed photo and bio",
  );
  await student
    .getByRole("link", { name: "Open Student", exact: true })
    .click();
  await student.getByRole("heading", { level: 1 }).waitFor();
  await student.locator(".account-trigger img").waitFor();
  check(
    "Shell shares account photo",
    (await student.locator(".account-trigger img").count()) === 1,
  );
  await student.locator("summary.account-trigger").click();
  await capture(
    student,
    "F07-account-menu",
    "student",
    "Account menu with temporary photo",
  );
  await student.keyboard.press("Escape");
  check(
    "Account Escape return",
    await student
      .locator("summary.account-trigger")
      .evaluate(
        (el) => el === document.activeElement && !el.parentElement.open,
      ),
  );
  await student.getByRole("button", { name: "Open portal navigation" }).click();
  await student
    .getByRole("dialog")
    .getByRole("link", { name: "Profile", exact: true })
    .click();
  await student
    .getByRole("heading", { name: "Profile", exact: true })
    .waitFor();
  check(
    "Student domain distinct",
    await student
      .locator("main")
      .innerText()
      .then(
        (t) =>
          t.includes("John Paul Reyes") && !t.includes("Temporary FD6 bio"),
      ),
  );
  check(
    "Domain photo distinct",
    (await student.locator(".demo-photo-control > .avatar img").count()) === 0,
  );
  await openAccount(student);
  check(
    "Bio survives navigation",
    (await student.locator(".account-bio-text").innerText()) === bio,
  );
  for (const [name, file, error] of [
    [
      "invalid-type",
      {
        name: "bad.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("invalid"),
      },
      "Choose a JPEG",
    ],
    [
      "oversize",
      {
        name: "large.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
      },
      "up to 2 MB",
    ],
    [
      "decode-failure",
      {
        name: "broken.png",
        mimeType: "image/png",
        buffer: Buffer.from("invalid"),
      },
      "could not be opened",
    ],
  ]) {
    await student
      .getByRole("button", { name: "Change demo photo", exact: true })
      .click();
    await student.locator('input[type="file"]').setInputFiles(file);
    await student.locator(".demo-photo-error").waitFor();
    check(
      "Photo " + name,
      (await student.locator(".demo-photo-error").innerText()).includes(error),
    );
    await capture(student, "F08-" + name, "student", name);
    await student.keyboard.press("Escape");
  }
  await student
    .getByRole("button", { name: "Change demo photo", exact: true })
    .click();
  await student
    .getByRole("button", { name: "Choose image", exact: true })
    .focus();
  await student.keyboard.press("Shift+Tab");
  check(
    "Photo focus containment",
    await student
      .getByRole("button", { name: "Cancel", exact: true })
      .evaluate((el) => el === document.activeElement),
  );
  await student
    .getByRole("button", { name: "Remove photo", exact: true })
    .click();
  check(
    "Photo remove",
    (await student
      .locator(".account-profile-identity .demo-photo-control > .avatar img")
      .count()) === 0,
  );
  check("Photo and bio no mutation requests", posts.length === 0, [...posts]);
  await student.reload({ waitUntil: "networkidle" });
  check(
    "Reload resets",
    (await student.locator(".account-bio-empty").isVisible()) &&
      (await student
        .locator(".account-profile-identity .demo-photo-control > .avatar img")
        .count()) === 0,
  );
  for (const value of ["To clear", ""]) {
    await student
      .getByRole("button", { name: "Edit bio", exact: true })
      .click();
    await student.getByLabel("Your demo bio").fill(value);
    await student
      .getByRole("button", { name: "Apply demo bio", exact: true })
      .click();
  }
  check(
    "Empty applied bio clears",
    await student.locator(".account-bio-empty").isVisible(),
  );
  await student.getByRole("button", { name: "Edit bio", exact: true }).click();
  await student.getByLabel("Your demo bio").fill("Private temporary check");
  await student
    .getByRole("button", { name: "Apply demo bio", exact: true })
    .click();
  const fresh = await contexts.get("student").newPage();
  await go(fresh, "/account");
  check(
    "New tab starts empty",
    await fresh.locator(".account-bio-empty").isVisible(),
  );
  await fresh.close();
  await student.getByRole("button", { name: "Sign out", exact: true }).click();
  await student.waitForURL("**/login");
  await student.goBack({ waitUntil: "networkidle" });
  check(
    "Back after signout no bio",
    !(await student.locator("body").innerText()).includes(
      "Private temporary check",
    ),
  );
  console.log("Account interactions complete");
  const multiAccount = baseline.accounts.find((a) => a.memberships.length > 1),
    multi = pages.get(multiAccount.group);
  await multi.setViewportSize({ width: 1440, height: 900 });
  await go(multi, "/account");
  await multi.getByRole("button", { name: "Edit bio", exact: true }).click();
  await multi.getByLabel("Your demo bio").fill("Cross-portal bio");
  await multi
    .getByRole("button", { name: "Apply demo bio", exact: true })
    .click();
  await multi.locator(".account-memberships a").first().click();
  await multi.locator("summary").filter({ hasText: "Switch portal" }).click();
  const otherPortal = multi
    .locator(".portal-popover a:not([aria-current])")
    .filter({ visible: true })
    .first();
  const destination = await otherPortal.getAttribute("href");
  await otherPortal.click();
  await multi.waitForURL("**" + destination);
  await openAccount(multi);
  check(
    "Portal switch retains bio",
    (await multi.locator(".account-bio-text").innerText()) ===
      "Cross-portal bio",
  );
  await capture(
    multi,
    "F09-multi-portal-bio",
    multiAccount.group,
    "Bio survives authorized switch",
  );
  await applicant.setViewportSize({ width: 375, height: 812 });
  await go(applicant, "/applicant");
  await applicant
    .getByRole("button", { name: "Open portal navigation" })
    .click();
  const drawer = await applicant.locator("dialog[open]").evaluate((el) => ({
    duration: getComputedStyle(el).animationDuration,
    name: getComputedStyle(el).animationName,
    focus: el.contains(document.activeElement),
  }));
  check(
    "Drawer 220ms immediate focus",
    drawer.duration === "0.22s" && drawer.focus,
    drawer,
  );
  await applicant.emulateMedia({ reducedMotion: "reduce" });
  check(
    "Preference change settles drawer",
    await applicant
      .locator("dialog[open]")
      .evaluate(
        (el) =>
          getComputedStyle(el).animationName === "none" &&
          getComputedStyle(el).transform === "none",
      ),
  );
  await capture(
    applicant,
    "F10-reduced-drawer",
    "applicant",
    "Reduced motion drawer",
  );
  await applicant.keyboard.press("Escape");
  check(
    "Drawer Escape focus",
    await applicant
      .getByRole("button", { name: "Open portal navigation" })
      .evaluate((el) => el === document.activeElement),
  );
  await applicant.emulateMedia({ reducedMotion: "no-preference" });
  await go(applicant, "/account");
  await applicant
    .getByRole("button", { name: "Add demo photo", exact: true })
    .click();
  const duration = await applicant
    .locator("dialog[open]")
    .evaluate((el) => getComputedStyle(el).animationDuration);
  check("Photo dialog 180ms", duration === "0.18s", duration);
  await applicant.keyboard.press("Escape");
  const button = applicant.getByRole("button", {
    name: "Edit bio",
    exact: true,
  });
  await button.focus();
  check(
    "Focus visible",
    await button.evaluate(
      (el) =>
        el.matches(":focus-visible") &&
        getComputedStyle(el).outlineStyle === "solid",
    ),
  );
  const rect = await button.boundingBox();
  await applicant.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await applicant.mouse.down();
  const pressed = await button.evaluate((el) => ({
    transform: getComputedStyle(el).transform,
    duration: getComputedStyle(el).transitionDuration,
  }));
  await applicant.mouse.up();
  check(
    "Button press 80ms",
    pressed.duration.split(",").every((s) => s.trim() === "0.08s"),
    pressed,
  );
  const records = pages.get("records");
  await records.setViewportSize({ width: 1440, height: 900 });
  await go(records, "/records/applicants");
  const sort = records.getByRole("button", { name: /Sort by Applicant/ });
  await sort.focus();
  await records.keyboard.press("Enter");
  check(
    "Sort ascending",
    (await records.locator('th[aria-sort="ascending"]').count()) === 1,
  );
  await records.keyboard.press("Enter");
  check(
    "Sort descending",
    (await records.locator('th[aria-sort="descending"]').count()) === 1,
  );
  await capture(records, "F10-sort", "records", "Applicant descending sort");
  for (const [group, route] of [
    ["applicant", "/account"],
    ["applicant", "/applicant/application"],
    ["applicant", "/applicant/profile"],
    ["records", "/records/applicants"],
  ]) {
    const page = pages.get(group);
    await page.setViewportSize({ width: 768, height: 900 });
    await go(page, route);
    await page.evaluate(() => {
      const sizes = [...document.querySelectorAll("main *")]
        .filter((el) => el.children.length === 0 && el.textContent.trim())
        .map((el) => [el, parseFloat(getComputedStyle(el).fontSize)]);
      for (const [el, size] of sizes) {
        el.style.fontSize = size * 2 + "px";
        el.style.lineHeight = "1.5";
      }
    });
    const pass = await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    );
    check("200% text " + route, pass);
    await capture(
      page,
      "F12-text200-" + route.replaceAll("/", "_"),
      group,
      "200% text simulation, not OS scaling",
    );
  }
  const nojs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
    }),
    nojsPage = await nojs.newPage();
  await go(nojsPage, "/");
  check(
    "Public without JS",
    (await nojsPage
      .getByRole("heading", { name: "College established", exact: true })
      .isVisible()) &&
      (await nojsPage
        .getByRole("heading", { name: "Application", exact: true })
        .isVisible()),
  );
  await capture(nojsPage, "F11-no-js", "public", "JS disabled");
  await publicPage.emulateMedia({ reducedMotion: "reduce" });
  await go(publicPage, "/admissions");
  check(
    "Reduced admissions content",
    (await publicPage.locator(".admissions-journey li").count()) === 5,
  );
  await capture(
    publicPage,
    "F11-reduced-admissions",
    "public",
    "Reduced motion",
  );
  await publicPage.emulateMedia({ media: "print" });
  check("Print content visible", await publicPage.locator("main").isVisible());
  result.contrast = await applicant.evaluate(() => {
    const lum = (c) => {
      const a = c
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number)
        .map((v) =>
          (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
        );
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    return [
      ["ink on canvas", "#17233b", "#edf0f4"],
      ["blue on white", "#0d13cd", "#ffffff"],
      ["ink on yellow", "#17233b", "#fcdf00"],
    ].map(([label, a, b]) => {
      const rgb = (h) =>
        "rgb(" +
        [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",") +
        ")";
      const l = lum(rgb(a)),
        r = lum(rgb(b));
      return {
        label,
        ratio: (Math.max(l, r) + 0.05) / (Math.min(l, r) + 0.05),
      };
    });
  });
};
