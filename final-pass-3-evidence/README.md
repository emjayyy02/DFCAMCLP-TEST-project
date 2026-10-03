# Final pass 3: Recovery and applicant entry

Frontend-only public previews. No authentication, permissions, database, or service changes.

- Recovery: applicant email preview and student/employee support request composer.
- Applicant entry: grouped generic application fields, campus/program/BSBA major controls, local photo preview.
- Preview explanations: accessible info popover with hover, focus, click, Escape, outside-click and focus-dismiss behavior.
- Images: PNG/JPEG/WebP, 1 byte–5 MB, browser decode check, removable blob previews. Never uploaded.
- Preview values: page memory only; edit retains values, reload clears them. Personal/contact fields start empty; campus/program start at Main/BSA. Screenshots contain fictional example data only. Required markers are for generating this demo preview, not institutional requirements.

Browser evidence: `verification.json`; `verify.cjs` uses the installed workstation Playwright and Microsoft Edge. Widths 320/375/768/1440/1920 and 200% text checked. Screenshot names describe route, width, or preview state.

Validation: 78 unit tests and 42 database/auth/access integration tests passed (120 total). Production build and typecheck passed. Lint passed with five existing warnings. Changed-file formatting and git diff checks passed. The mechanical UI detector returned no findings.

Historical pass-2 gallery remains a separate earlier snapshot; this folder contains the current evidence for these two changed routes.
