# Final pass 3: Four-stage applicant entry and profile polish

Implemented within the frontend/demo boundary. Existing auth semantics, account count, permissions, memberships, credentials and unrelated portal workflows remain unchanged. No database reset, reseed or credential sync.

## Exact files changed in this pass

- `src/app/globals.css`
- `src/app/account/create/applicant/page.tsx`
- `src/components/ui/identity.tsx`
- `src/components/ui/demo-profile-photo.tsx`
- `src/features/identity/account-entry.tsx`
- `src/features/identity/applicant-entry.tsx`
- `src/features/identity/applicant-entry-rules.ts`
- `src/tests/applicant-entry.test.ts`

Evidence and documentation are confined to `final-pass-3-stepper-evidence/`. `manifest.json` lists every authored evidence file and screenshot individually; prior pass-3 and milestone evidence remain historical.

## Entry stages and post-account scope

1. Applicant type and program: Freshman / Transferee / Returnee, DCAT 2027 demo cycle, first choice, optional distinct second choice, conditional BSBA major. Canonical program/campus registry reused. Type changes the illustrative post-account background focus without computing eligibility or inventing document policy.
2. Personal details: required first/last names, birthdate, sex, nationality, photo; optional middle name/suffix. Centered circular silhouette and visible yellow plus reuse the profile photo dialog. No permanent Choose photo strip.
3. Contact and verification: required email/mobile, guardian/emergency contact name/number, city/barangay; optional street address and parent names. Local six-digit code preview is optional, visibly synthetic, sends nothing, and resets when email changes.
4. Review, consent and account generation: all entered facts, Edit per step, privacy and truthfulness declarations, temporary-password concept, and generated SAMPLE-DCAT2027 application number. The completion explicitly says no real sign-in account or school application was created. No password is collected, issued, persisted, or accepted by auth.

School, school address and graduation/year-level fields were removed from public entry. The existing signed-in Applicant application already contains Academic background (school, strand/track, graduation year); completion reframes this as post-account work. Existing physical requirements, DCAT and enrollment areas remain. No academic workflow was changed or moved into registration. LRN, GWA, additional school-address fields and upload functionality remain deferred. No interview or application fee was invented; the canonical project has no interview stage and no verified fee workflow.

## Validation

- Required stage fields and a committed local photo block progression; returning to a later step revalidates earlier edits. Final generation revalidates all three input stages.
- Unicode-letter person names accept spaces, combining marks, apostrophes, hyphens and periods; numeric-only, mixed-digit and symbol junk are rejected for applicant, guardian and optional parent names. Optional names may be empty.
- Birthdate must be a valid calendar date earlier than today; no official age eligibility threshold is invented.
- Valid email; phones accept 7–15 digits with optional country prefix and common punctuation. Nationality must contain words rather than numeric junk.
- City and barangay are required. Numbered barangays are accepted, avoiding an invented address policy.
- First/second choices must use the canonical programs and differ; BSBA requires an existing major.
- Two declarations block final generation. These are demo acknowledgements, not stored legal or institutional consent.
- Shared applicant/profile photo selection: PNG/JPEG/WebP, up to 2 MB, decode validation, staged Use photo/Cancel, replace/remove, object-URL cleanup, no upload. Recovery evidence remains its earlier separate up-to-5-MB preview.

## UI/accessibility and regression results

- All four stages and completion captured at 320/375/768/1440/1920. One-column fields on mobile; no page-level horizontal overflow. Photo area centered; profile plus disk aligns exactly to avatar bottom-right with a 44px hit target.
- Shared profile checked for Student, Applicant and Faculty; Student widths cover all five requested sizes. Existing signed-in names and emails remain unchanged.
- Keyboard/error-summary focus, photo-dialog initial/return focus and Escape, editable review, consent blocking, optional code preview and email-reset behavior passed.
- Heading help supports hover/focus/click/Escape and remains hoverable after opening. Open bounds checked at all five widths plus 375px with 200% text; the panel remains inside viewport margins.
- Reduced-motion and representative 200% root-text simulation passed. This is installed Edge Chromium emulation, not physical device, screen-reader listening, Safari/WebKit or actual OS/browser zoom certification.
- 118 unit tests plus 42 database/auth/access integration tests passed: 160 total. Lint passed with five unchanged historical warnings; typecheck, production build, changed-file formatting and diff check passed. Mechanical UI detector returned no findings.
- No non-GET requests during anonymous entry actions. No real-person form defaults. Browser examples use fictional Juan Dela Cruz and example.invalid addresses. Existing footer author attribution remains legitimate project attribution.

Initial findings: enlarged step labels overflowed and were stacked; heading help clipped and was anchored to the whole heading. Both corrected. The independent review scored the named popover fix resolved and returned ship. Earlier initial fault evidence is labeled historical; it is not represented as a final passing screenshot.

## Deferred boundaries

No real account provisioning, password issuance, application submission, email/OTP service, persistent photo/storage, document uploads or new post-account school fields. Explore Applicant demo continues through the existing authorized demo sign-in; the new sample applicant does not gain a membership or become one of the nine seeded accounts.
