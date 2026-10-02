# Final check before UI/UX

Open [index.html](index.html) to browse and filter screenshots by demo account, page, route, or state. Expand a page to see thumbnails and open the original PNGs.

488 captured views; 6822 PNG images; all 35 portal routes plus public and account pages; all 9 seeded demo accounts authenticated successfully.

## Image folders

- desktop-1920x1080/: 1920 × 1080 viewport capture and full-page capture.
- desktop-1440x900/: 1440 × 900 viewport capture and full-page capture.
- tablet-1024x768/: 1024 × 768 viewport capture.
- tablet-768x900/: 768 × 900 viewport capture.
- mobile-390x844/: 390 × 844 viewport capture.
- mobile-375x812/: 375 × 812 viewport capture.
- mobile-360x800/: 360 × 800 viewport capture.

Each size folder is subdivided by demo account, with public pages in public/. Every view has a --viewport.png; --full-page.png extends to the page bottom where content exceeds the viewport (always included for desktop). --dialog-bottom.png captures lower content inside a scrolling dialog.

## Coverage

- public: 25 views.
- applicant: 146 views.
- student: 45 views.
- faculty: 26 views.
- records: 90 views.
- operations: 32 views.
- technology: 17 views.
- coordinator: 36 views.
- school-admin: 34 views.
- faculty-it: 37 views.

Includes role-specific dashboards and navigation, available detail destinations, applicant journey scenarios, student academic views, document previews, search-empty states, dialogs, and error designs. Equivalent URL and filter combinations may appear more than once because their entry paths differ. Arbitrary combinations of every form value or filter are not enumerated.

## Capture record

- Local site: http://localhost:3000.
- Completed: 2026-10-02T01:30:59.999Z.
- Browser: Microsoft Edge (Chromium), headless, deviceScaleFactor 1. Tablet/mobile captures use responsive Chromium; no physical-device or Safari claim.
- Existing login endpoint and isolated browser sessions were used; no authorization bypass. Session cookies and passwords were not saved in this folder.
- No application source, styles, fixtures, schema, or configuration was edited. All 1413 starting source files match their original SHA-256 hashes.
- Verification passed: all image files exist, all viewport dimensions are correct, all inventoried portal routes and public pages are present, and the gallery thumbnails/filter work. No unresolved capture failures.
- 21 full-page captures at 1024px extend beyond viewport width; these preserve rendered horizontal overflow for audit.
- These screenshots are evidence for a later design audit. They do not assert Phase 4 design/accessibility criteria have passed.

manifest.json records account/route/state, PNG paths and dimensions, capture timing, and verification. source-integrity-before.json contains starting source-file hashes.
