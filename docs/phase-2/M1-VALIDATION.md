# P2-M1 validation and handoff

## P2-M1 — PASS / COMPLETE

Finalized on 13 September 2026. All original P2-M1 acceptance criteria are satisfied by the agent-executed checks and the separately attributed user-performed host validation below. This closes only Repository + Stack Bootstrap. P2-M2 has not started; Phase 2 as a whole remains incomplete.

## Agent-executed tests — finalization run

| Command                          | Observed result                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pnpm --version`                 | 11.19.0; no pnpm upgrade performed                                                                           |
| `pnpm install --frozen-lockfile` | Passed, exit 0; already up to date; lockfile consistency confirmed                                           |
| `pnpm lint`                      | Passed, exit 0; no warnings                                                                                  |
| `pnpm typecheck`                 | Passed, exit 0; Next.js route types generated and TypeScript checked                                         |
| `pnpm format:check`              | Passed, exit 0; all matched files conform                                                                    |
| `pnpm test`                      | Passed, exit 0; 1 test file, 8 environment-validation tests                                                  |
| `pnpm build`                     | Passed, exit 0; Next.js 16.3.5 production build, TypeScript, page collection and static generation completed |

These commands were executed by the agent in this finalization run. Formatting was also checked after this validation document was updated. No Docker command was executed by the agent in this run.

## USER-PERFORMED HOST VALIDATION

Evidence source: the user's explicit report of successful manual validation on the host machine. These results were not executed or independently verified by the agent.

Commands executed by the user:

```text
pnpm install
pnpm db:up
```

User-reported observations:

- `pnpm install` completed successfully using pnpm v11.19.0.
- Docker pulled `postgres:17-alpine` successfully.
- Docker Compose created the project network and PostgreSQL data volume.
- PostgreSQL container `dfcamclp-development-postgres-1` started successfully.
- Container health status reported **Healthy**.

This resolves the previous Docker/PostgreSQL startup blocker for M1. The agent's earlier inability to access Docker remains historical execution-environment evidence; it is not a current project blocker after the user-performed host validation. The working Compose configuration was not altered. No image digest was supplied or verified; digest pinning is not an additional M1 acceptance gate.

## Original M1 acceptance mapping

| Acceptance criterion                     | Evidence and attribution                                                                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean install succeeds                   | Earlier agent-executed independent clean installation passed; current agent frozen-lockfile install passed; user host install also passed                             |
| Development app starts                   | Earlier agent `pnpm dev` reached Ready and the localhost page rendered                                                                                                |
| PostgreSQL starts through Docker Compose | USER-PERFORMED HOST VALIDATION: container started and reported Healthy                                                                                                |
| Lint passes                              | Agent finalization run passed                                                                                                                                         |
| Production build passes                  | Agent finalization run passed                                                                                                                                         |
| Environment validation works             | Agent finalization run: all 8 tests passed; earlier environment CLI check passed outside the execution sandbox                                                        |
| Secrets are not committed                | Earlier generated local credentials are in ignored `.env`; no commit or push has been made; earlier client-asset scan found zero matches for the generated credential |
| Setup documented                         | Root README documents runtime prerequisites, local environment configuration, Docker startup and application/check commands                                           |

## Earlier agent-executed M1 evidence retained

These checks belong to the prior bootstrap run and were not all repeated during finalization:

- PRODUCT.md and all ten Phase 1 documents were inspected and preserved.
- Runtime was Node 24.19.0 and pnpm 11.19.0.
- Independent frozen-lockfile installation in a fresh temporary directory, with no node_modules and a separate package store, installed 388 packages and completed approved lifecycle scripts with exit 0.
- `pnpm peers check` reported no peer dependency issues after compatible version pinning.
- `pnpm env:check` passed outside the execution sandbox. The sandboxed tsx attempt failed in Windows `uv_os_get_passwd` with ENOMEM before application validation.
- Development startup and browser review passed at 1440×900 and 375×812. Mobile content reflowed without horizontal overflow; the skip link received keyboard focus and the foundation anchor worked.
- The design detector reported one provisional system-font warning, intentionally retained because M1 does not finalize branding or typography.
- Random local PostgreSQL credentials were generated into ignored `.env`; `git check-ignore .env` confirmed exclusion. Secret values were not printed. A scan of generated client assets found zero matches for the generated credential.
- The initial environment tests found a malformed-URL error-handling defect. Parseability checks and regression coverage corrected it; the current run confirms all eight tests pass.

## Versions and compatibility decision

Installed: Next.js 16.3.5, React/React DOM 19.3.0, TypeScript 5.9.3, Tailwind/PostCSS adapter 4.3.3, Zod 4.6.4, Vitest 5.0.0, ESLint 9.39.5, eslint-config-next 16.3.5, Prettier 3.9.6. Remaining exact versions are in package.json; transitive versions are locked. No dependency versions were changed during this finalization.

The initial latest ESLint 10 and TypeScript 7 versions produced incompatible peers in Next.js's lint dependency chain. `pnpm peers check` showed lint plugins limited to ESLint 9 and typescript-eslint requiring TypeScript below 6.1. The earlier bootstrap pinned ESLint 9 and TypeScript 5.9.3 without replacing the approved architecture. ESLint 9's upstream end-of-support warning remains technical debt: upgrade the lint chain when compatible, without hiding peer failures.

Only esbuild and unrs-resolver lifecycle scripts are approved in pnpm-workspace.yaml. The earlier package-specific minimum-release-age exception for Zod remains unchanged; no global supply-chain check was disabled.

Compose remains on `postgres:17-alpine`. Its successful pull and container health are attributed solely to the user-performed host validation above.

## Files and scope boundary

This finalization updates only `docs/phase-2/M1-VALIDATION.md`. Existing README and Phase 2 overview statements about the previous Docker blocker describe the earlier checkpoint; this dated validation result supersedes those status statements. Phase 1 documentation, application architecture, dependencies, pnpm version and working Docker configuration remain unchanged.

The earlier bootstrap created root package/configuration/lock files, Compose configuration, environment example and ignore rules, README, the landing page and primitive, environment modules/tests, the environment-check script and Phase 2 documentation. Next.js generated AGENTS.md and CLAUDE.md during the earlier development startup.

No M2 schema, migrations or seeds have been introduced. Authentication, authorization, ownership policies, audit infrastructure, portal shells, integration/security regression suites and CI remain their later prescribed milestones. Those tests have not run and are not reported as passing here. No Phase 3 school workflows, commit, push or deployment were introduced.

**Stop at P2-M1 — PASS / COMPLETE. Do not begin P2-M2 in this run.**
