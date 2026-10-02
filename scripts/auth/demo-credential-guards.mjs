import { developmentAuthAccountSeed } from "../../src/server/db/seed/data.ts";

export class DemoCredentialSyncError extends Error {}

export function assertDemoSyncEnvironment(env, args = []) {
  if (args.length)
    throw new DemoCredentialSyncError("This command accepts no arguments.");
  if (
    !["development", "test"].includes(env.APP_ENV) ||
    env.NODE_ENV === "production"
  ) {
    throw new DemoCredentialSyncError(
      "Demo credential sync requires development or test.",
    );
  }
  let url;
  try {
    url = new URL(env.DATABASE_URL);
  } catch {
    throw new DemoCredentialSyncError("Invalid local database configuration.");
  }
  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    !env.POSTGRES_DB ||
    !env.POSTGRES_USER ||
    decodeURIComponent(url.pathname.slice(1)) !== env.POSTGRES_DB ||
    decodeURIComponent(url.username) !== env.POSTGRES_USER ||
    !/_(dev|test)$/.test(env.POSTGRES_DB)
  )
    throw new DemoCredentialSyncError(
      "Sync requires the configured local development/test database.",
    );
  if (
    typeof env.AUTH_SEED_PASSWORD !== "string" ||
    env.AUTH_SEED_PASSWORD.length < 12 ||
    env.AUTH_SEED_PASSWORD.length > 128
  ) {
    throw new DemoCredentialSyncError(
      "AUTH_SEED_PASSWORD must satisfy the existing password length policy.",
    );
  }
}

export function assertDemoCredentialRows(rows) {
  if (rows.length !== developmentAuthAccountSeed.length) {
    throw new DemoCredentialSyncError(
      "Expected exactly one existing credential per seeded demo account.",
    );
  }
  for (const seed of developmentAuthAccountSeed) {
    const matches = rows.filter((row) => row.personId === seed.personId);
    const row = matches[0];
    if (
      matches.length !== 1 ||
      !seed.email.endsWith("@example.invalid") ||
      !row.email.endsWith("@example.invalid") ||
      row.personId !== seed.personId ||
      row.providerId !== "credential" ||
      row.accountId !== row.userId ||
      !row.credentialId ||
      !row.password
    ) {
      throw new DemoCredentialSyncError(
        "Seeded demo identity or credential is missing, duplicated, or inconsistent.",
      );
    }
  }
}
