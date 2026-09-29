# Final check before UI/UX

Open [index.html](index.html) to browse and filter the collection by account, page, route, or state. Expand a page to see thumbnails and open the original PNGs.

469 captured views; 1602 PNG images; all 35 portal routes plus public and account pages; all 9 seeded demo accounts authenticated successfully.

## Image folders

- desktop-1920x1080/: exact 1920 x 1080 viewport captures.
- mobile-375x812/: exact 375 x 812 viewport captures, using the Phase 4 phone target.
- Each folder is subdivided by demo account, with public pages in public/.
- --viewport.png: screen-sized capture.
- --full-page.png: additional image at the same width, variable height, including content below the fold.
- --dialog-bottom.png: additional screen-sized image for lower content inside scrolling document dialogs.

## Coverage

- public: 20 views.
- applicant: 141 views.
- student: 40 views.
- faculty: 26 views.
- records: 90 views.
- operations: 32 views.
- technology: 17 views.
- coordinator: 36 views.
- school-admin: 34 views.
- faculty-it: 33 views.

Includes role-specific dashboards and navigation, all available detail destinations, Applicant journey scenarios, Student academic views and grade-history terms, sample document previews, search-empty states, review dialogs, and existing 403/404/login-error designs. Equivalent URL/filter combinations may appear more than once because their entry paths differ. Arbitrary combinations of every form value or filter are not enumerated.

## Capture record

- Local site: http://localhost:3000.
- Completed: 2026-09-29T14:17:34.240Z.
- Browser: Microsoft Edge (Chromium), headless, deviceScaleFactor 1. Mobile captures use responsive Chromium; no physical-device or Safari claim.
- Real existing login endpoint and isolated browser sessions were used; no authorization bypass. Session cookies and passwords were not saved in this folder.
- No application source, styles, fixtures, schema, or configuration was edited. All 252 starting files match their original SHA-256 hashes.
- All image files exist, all viewport dimensions are correct, all inventoried portal routes are present, and the local gallery thumbnails/filter were checked.
- No unresolved capture failures.
- These screenshots are evidence for a later design audit. They do not assert that Phase 4 design/accessibility criteria have passed.

manifest.json records the exact account/route/state, PNG paths and dimensions, capture timing, and verification. source-integrity-before.json contains the starting file hashes.
