# RC2B final evidence

Fresh local evidence for [the RC2B report](../P4-RC2B-FINAL-DEFECT-FIXES.md), captured 2 October 2026. Previous FD/M7/RC2A evidence is preserved. No password, cookie, session token or individual credential hash is recorded here.

## Results and provenance

- `manifest.json`: 333 raw checks, 325 pass, eight invalid reload assertions, 46/46 responsive measurements, 34 screenshots and zero uncaught page errors. The run resumed once after correcting the portal-switch selector; its continuation is explicitly recorded.
- `refresh-confirmation.json`: all 64 focused checks pass for the same eight Account reload cases; eight new screenshots and zero page errors. This resolves the raw predicates that wrongly looked for a portal trigger in the neutral Account header. It verifies the server-rendered identity and protected Student access instead.
- `doubled-panel-confirmation.json`: 40/40 checks confirm every panel button is visibly reachable with keyboard focus at doubled text on mobile and desktop, and Escape returns focus.
- `release-checks.json`: 16/16 local safety/integrity checks, including 42/42 contextual notice sentinels. Only leak file names/counts and booleans are emitted; no secret values.
- `snapshot-before.json` and `snapshot-after.json`: source SHA-256 inventory, fictional public identity metadata and opaque composite fingerprints. Nine credential records, accounts and memberships match before/after. A composite credential fingerprint is not an exported individual password hash. The starting dirty tree is recorded to distinguish inherited FD8/RC2A work.
- `artifact-checks.json`: final text-artifact and changed-source credential-value scan; results contain counts/paths only.

The 42 PNGs are 34 main captures plus eight reload confirmation captures. Each capture's route, viewport, state and time appear in its manifest. Main legal-focus captures are taken after the H1 assertion and the next Tab; the visible link focus demonstrates forward keyboard navigation. Panel captures show the start of an internally scrollable nine-row list, not an incomplete account set.

Production preview used installed Edge Chromium at `http://localhost:3109`, with `BETTER_AUTH_URL` overridden in that preview process only. It served a fresh successful production build. The existing port-3000 listener and env file were retained. Each identity/fault test used an isolated browser context. Scripts read the existing local test credential at runtime for authorized QA and never print it.

## Preserved harness attempts

`initial-harness-result.json` records 62 passing assertions before an ambiguous legal-link selector stopped the first attempt. `second-harness-result.json` records 220 passing assertions before the portal-switch selector was corrected. Neither failure changed the product. `initial-notice-sentinel-result.json` records false misses caused by JSX line wrapping; the final checker normalizes whitespace and verifies all 42 notices without editing their source.

The raw main result retains its eight false predicates. Use the focused confirmation alongside it; do not describe the main run as 333/333 passing or count preserved attempts as additional independent release evidence.

## Reproduction and boundaries

`verify.cjs`, `refresh-confirmation.cjs`, `doubled-panel-confirmation.cjs`, `release-checks.mjs`, `artifact-checks.mjs` and `snapshot.mjs` use existing installed dependencies. Run from the repository root against the documented isolated preview. `snapshot.mjs --after` compares the baseline; do not rerun its default before mode to replace the baseline. Similarly, completed result files should be archived before any future rerun.

Only local handoff gates are established. Password approval/publication, hosted security/privacy behavior, actual release database isolation, abuse and concurrency checks remain the next milestone. No deployment or credential mutation occurred in RC2B.
