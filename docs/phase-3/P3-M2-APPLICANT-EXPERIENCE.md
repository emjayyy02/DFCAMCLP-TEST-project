# P3-M2 — Applicant Experience

Status: **PASS — frontend demo scope**, validated 21 September 2026. Native print output and assistive-technology testing have the limits recorded below. P3-M3 has NOT started. No real admissions workflow backend was implemented.

## Scope and architecture

The existing guarded dynamic portal layout and catch-all route render Applicant content only after the existing server access checks. All six Applicant routes explicitly require `applicant.portal.view`; portal selection and demo scenario selection grant no permissions. Other portals retain their existing shell, routes, and guards.

| Route                      | Experience                                                              |
| -------------------------- | ----------------------------------------------------------------------- |
| `/applicant`               | Next action, appointment, journey, application identity, sample notices |
| `/applicant/application`   | Application form, Requirements, Status tabs                             |
| `/applicant/dcat`          | Exam schedule, DCAT form, Results tabs                                  |
| `/applicant/enrollment`    | Progress, Registrar schedule, COE / COR tabs                            |
| `/applicant/announcements` | Dated sample notices, category filter and empty state                   |
| `/applicant/profile`       | Sample personal/contact/application information and Applicant ID        |

Application query views `requirements` and `status`, and DCAT `results`, support contextual links. Profile is separated visually at the bottom of Applicant navigation. Mobile navigation uses the existing accessible drawer.

`src/features/applicant/demo-data.ts` centralizes synthetic identity, schedules, physical requirements, programs, announcements, and ten journey scenarios. `demo-context.tsx` holds scenario, draft, saved draft, save time, and preparation checkmarks in React memory across Applicant link navigation. Refresh resets them. No local storage, admissions API writes, migrations, or persisted school records are introduced.

## Implemented behavior

- **Dashboard:** prioritizes the next action and meaningful journey stage; no decorative metrics. Appointments include date, Philippine time, campus, and explicitly sample location.
- **Application:** grouped personal, contact, address, academic, and program fields. Campus constrains programs; BSBA exposes its majors. Save records a demo-only snapshot in the current tab. Review validates and focuses a linked error summary or the review heading. Confirmation supports cancellation and Escape. Confirming makes information read-only and switches the sample journey to submitted.
- **Requirements:** physical preparation checklist, appointment, and staff-verification display. Ready checkmarks persist through Applicant navigation. They do not upload documents or confer verification.
- **Status:** ordered progression with completed/current/upcoming text, checkmarks, and `aria-current`; appointment scheduling is not represented as attendance.
- **DCAT:** unavailable/scheduled exam views, sample form, awaiting release, Passed, and Not Qualified. Passed links to enrollment. No raw score, appeal, retake, or interview workflow.
- **Document previews:** native modal dialogs show fake identity and visibly state SAMPLE / NOT VALID FOR OFFICIAL USE. DCAT includes the sample assignment. COE/COR are clearly placeholders. Print / Save as PDF invokes the browser print command; print CSS excludes portal chrome and dialog actions. No official PDF is generated or stored.
- **Enrollment:** unavailable state, qualification and Registrar submission progress, Registrar appointment, COE and COR availability. No Student ID or Student membership is assigned.
- **Announcements:** three fictional dated notices, category filtering, and recoverable empty state.
- **Profile:** Applicant ID, sample name, contact, campus, program, and application status. Submitted corrections remain outside this demo.

## Visual and accessibility review

Skills used: project frontend-design, project find-skills (installed-skill discovery only), and impeccable. No design packages or new skills were installed.

The extension preserves P3-M1 Arial typography, canonical blue, white/cool-gray surfaces, existing control/focus tokens, restrained borders, and flat panels. No replacement design system was introduced. The impeccable detector returned no findings. Independent visual/source finish review returned **SHIP** after inspecting the 24 baseline screenshots and four additional state captures. The review did not independently repeat browser interactions or native printing.

Independent documenter comparison confirmed consistency with `globals.css`, `VISUAL-FOUNDATION.md`, and P3-M1. Existing historical PRODUCT/visual-foundation statements about missing brand assets were identified as stale and left unchanged; no unrelated context repair or new DESIGN.md was introduced.

Accessibility includes labeled controls, fieldsets, associated errors, focusable error summaries, keyboard tab navigation, textual status distinctions, native dialog focus containment, Escape dismissal and focus restoration, and existing skip/navigation patterns. Shared reduced-motion rules and the Applicant override remain present. Screen-reader operation and OS reduced-motion emulation were not independently exercised.

## Rendered evidence and interactions

[Evidence directory](evidence/applicant/) contains viewport screenshots, not full-page captures. The [viewport matrix](evidence/applicant/viewport-checks.json) records all eight views at **375 × 812**, **768 × 900**, and **1440 × 900**: zero horizontal overflow in all 24 checks. Additional mobile captures cover the lower physical checklist, invalid editable form, DCAT preview, and COR preview. These supplement the baseline default-state views; every scenario was not captured at every size.

Executed browser checks:

- Authenticated Applicant entry and six-route navigation.
- Required-name and malformed-email errors; error-summary focus; value retention; save, review, Escape cancellation, confirmation, and read-only submission.
- Main Campus program filtering and BSBA Marketing Management in review.
- Preparation checkmark retained after Dashboard → View requirements navigation.
- Arrow-key tab selection and visible selected panel.
- Mobile drawer opening focus, Escape return, and closing after route selection.
- Scheduled DCAT preview, dialog Escape/focus return, and print button invocation.
- Awaiting result, Passed, Not Qualified, and Passed → Enrollment consistency.
- Registrar sample schedule and issued COR preview; COE/COR availability.
- General announcement empty state and Show all notices recovery.

Earlier malformed screenshot captures were replaced. Preparation state was lifted into the shared Applicant context, checkbox accessible names were made specific, and print isolation was tightened during review.

**Print limitation:** the embedded browser did not expose a native print-preview window after invoking Print / Save as PDF. The command and print stylesheet are implemented, but pagination and an exported PDF were not visually validated. Physical printing, screen-reader testing, and full scenario-by-viewport coverage are not claimed.

## Regression validation

| Check                           | Result                                       |
| ------------------------------- | -------------------------------------------- |
| Environment unit suite          | PASS — 12/12                                 |
| Environment configuration check | PASS — checked without exposing secrets      |
| Database integration            | PASS — 12/12                                 |
| Authentication integration      | PASS — 9/9                                   |
| Access-control integration      | PASS — 20/20                                 |
| ESLint                          | PASS                                         |
| Typecheck                       | PASS                                         |
| Prettier                        | PASS after formatting evidence/documentation |
| Production build                | PASS                                         |

Access tests include all six Applicant paths, unknown paths, unrelated portal denial, and Student denial of Applicant application access. Existing auth/database regression suites remain intact. Integration tests use their existing controlled test-state lifecycle; no database reset was run.

**USER-PERFORMED HOST VALIDATION:** the user started Docker Desktop/PostgreSQL after interruptions. The agent then verified functioning sign-in and ran database-backed regression tests. Docker lifecycle execution is not attributed to the agent.

## Assumptions and deferred work

- **V1 ASSUMPTION Q13:** field requirements and validation are provisional demo checks. Known physical requirements are represented; no upload substitute or invented consent policy.
- **V1 ASSUMPTION Q16:** sample release states expose Passed / Not Qualified only. Real result release/correction authority is deferred.
- **V1 ASSUMPTION Q19:** submitted information is read-only; the real correction service is deferred.
- **V1 ASSUMPTION Q05:** COE → COR → enrollment is represented as sample progression; official formats, signatories, completion authority, and fulfillment are deferred.

No admissions persistence, document verification actions, schedule assignment, exam scoring, result publication, official document issuance, enrollment mutation, Student identity creation, uploads, notifications, audit workflow, or new authorization grants were implemented. All dates, locations, identities, and notices are fictional. No commit, push, or deployment was performed.

## File inventory

Created: six files in `src/features/applicant/` (`applicant-page.tsx`, `application-form.tsx`, `shared.tsx`, `demo-context.tsx`, `demo-data.ts`, `applicant.css`); this milestone document; 28 screenshots and the viewport matrix under `docs/phase-3/evidence/applicant/`.

Modified: `src/app/[portal]/layout.tsx`, `src/app/[portal]/[[...section]]/page.tsx`, `src/components/portal/app-shell.tsx`, `src/server/access-control/navigation.ts`, `src/tests/access-control.integration.test.ts`, `README.md`, and `docs/phase-2/PHASE-2-OVERVIEW.md`.

Stop at P3-M2. P3-M3 Student Experience requires separate authorization.
