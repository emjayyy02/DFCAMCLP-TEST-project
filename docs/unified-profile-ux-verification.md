# Unified profile and authenticated public navigation

Verified locally on 2026-10-04. Hosted deployment and hosted verification are pending.

## Result

All six portal profile routes use `PortalProfile` and `UnifiedProfile`. Profile is the final sidebar item and uses the existing portal-view permission. Portal Account identity and View profile links use the current portal. Existing Student/Applicant domain information is retained; staff information comes from existing identity, employee, role, and membership records. Existing temporary photo/Bio storage is retained, including the 240-character Bio limit.

`/account` redirects to the deterministic authorized primary profile. Authenticated `/login` prefers an authorized requested portal, then falls back to the deterministic primary portal. Public navigation uses the existing server access context; authenticated header, footer, and Home offer authorized portal return/profile links. Public Account uses the same compact menu as the portal shell.

## Browser verification

Real local sessions passed for John Paul Reyes, Juan Dela Cruz, Maria Santos, Jose Garcia, Mark Ramos, Angelo Cruz, Angelica Bautista, Mary Grace Mendoza, and Michael Castro.

- All nine: sidebar and Account profile destinations, profile rendering at 375/768/1440/1920, eight public routes with unchanged server session identity, public Account/profile return, `/account` redirect, authenticated `/login` redirect, explicit sign-out, and rejection/redirect after sign-out.
- Michael: Academic and Technology context, shared photo/Bio, authorized portal switching, authorized requested login portal, and unauthorized Student profile denial without ending his session.
- Student, Applicant, and Technology: 24 profile/public cases with text doubled at the four requested widths, no horizontal overflow, keyboard Account open/close/focus return, reachable public menu controls, Bio edit/save/cancel focus, and reduced-motion context.
- Desktop public Account popover clipping and mobile Escape focus propagation were found and corrected during browser verification.

Browser evidence is stored outside the repository in the task's local visualization directory. These are local checks, not claims of hosted production verification.

## Validation

| Check | Result |
| --- | --- |
| `pnpm test` | PASS, 151 tests |
| `pnpm test:db` | PASS, 13 tests |
| `pnpm test:auth` | PASS, 19 tests |
| `pnpm test:access` | PASS, 21 tests |
| `pnpm lint` | PASS, five pre-existing unused eslint-disable warnings in audit scripts |
| `pnpm typecheck` | PASS |
| `pnpm build` | PASS |
| `git diff --check` | PASS |

Build used an isolated child-process production environment from `.env.production.local` with the development `AUTH_SEED_PASSWORD` excluded. Environment files and auth safety guards were unchanged. The local database service was started for integration verification; no production bootstrap was run.

## Files changed

1. `src/app/[portal]/[[...section]]/page.tsx`
2. `src/app/account/page.tsx`
3. `src/app/forbidden.tsx`
4. `src/app/globals.css`
5. `src/app/login/page.tsx`
6. `src/app/page.tsx`
7. `src/components/portal/app-shell.tsx`
8. `src/components/public/site-header.tsx`
9. `src/components/public/site-shell.tsx`
10. `src/features/applicant/applicant-page.tsx`
11. `src/features/identity/account-profile.tsx`
12. `src/features/identity/account-menu.tsx`
13. `src/features/identity/portal-profile.tsx`
14. `src/features/student/student-page.tsx`
15. `src/server/access-control/navigation.ts`
16. `src/server/access-control/profile-navigation.ts`
17. `src/tests/access-control.integration.test.ts`
18. `src/tests/profile-navigation.test.ts`
19. `src/tests/records-demo.test.ts`
20. `docs/unified-profile-ux-verification.md`

No schema, migrations, credentials, sign-out implementation, temporary presentation provider, or production-bootstrap code changed. No commit, push, or deployment was performed.
