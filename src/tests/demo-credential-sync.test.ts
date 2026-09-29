import { describe, expect, it } from "vitest";
import {
  assertDemoCredentialRows,
  assertDemoSyncEnvironment,
} from "../../scripts/auth/demo-credential-guards.mjs";
import { developmentAuthAccountSeed } from "../server/db/seed/data";

const environment = {
  APP_ENV: "development",
  NODE_ENV: "development",
  DATABASE_URL: "postgres://demo:unused@localhost/portal_dev",
  POSTGRES_USER: "demo",
  POSTGRES_DB: "portal_dev",
  AUTH_SEED_PASSWORD: "synthetic-test-only-password",
};
const rows = () =>
  developmentAuthAccountSeed.map((seed, index) => ({
    email: String(seed.email),
    personId: String(seed.personId),
    userId: `user-${index}`,
    accountId: `user-${index}`,
    credentialId: `credential-${index}`,
    providerId: "credential",
    password: "synthetic-presence-only",
  }));

describe("local demo credential sync safety boundaries", () => {
  it("accepts the configured local development target", () => {
    expect(() => assertDemoSyncEnvironment(environment)).not.toThrow();
    expect(() => assertDemoCredentialRows(rows())).not.toThrow();
  });
  it.each(["production", "preview", "unknown"])(
    "refuses APP_ENV=%s",
    (APP_ENV) => {
      expect(() =>
        assertDemoSyncEnvironment({ ...environment, APP_ENV }),
      ).toThrow();
    },
  );
  it("refuses production NODE_ENV even with development APP_ENV", () => {
    expect(() =>
      assertDemoSyncEnvironment({ ...environment, NODE_ENV: "production" }),
    ).toThrow();
  });
  it("refuses arbitrary account arguments", () => {
    expect(() =>
      assertDemoSyncEnvironment(environment, ["--email=other@example.invalid"]),
    ).toThrow();
  });
  it.each([
    "postgres://demo:unused@remote.invalid/portal_dev",
    "postgres://demo:unused@localhost/other_dev",
    "postgres://other:unused@localhost/portal_dev",
  ])("refuses an unapproved database target", (DATABASE_URL) => {
    expect(() =>
      assertDemoSyncEnvironment({ ...environment, DATABASE_URL }),
    ).toThrow();
  });
  it("refuses a missing seed password", () => {
    expect(() =>
      assertDemoSyncEnvironment({ ...environment, AUTH_SEED_PASSWORD: "" }),
    ).toThrow();
  });
  it("refuses missing, duplicate, unrelated, and incorrectly linked identities", () => {
    expect(() => assertDemoCredentialRows(rows().slice(1))).toThrow();
    const duplicate = rows();
    duplicate[1] = duplicate[0];
    expect(() => assertDemoCredentialRows(duplicate)).toThrow();
    const unrelated = rows();
    unrelated[0].email = "unlisted@example.invalid";
    expect(() => assertDemoCredentialRows(unrelated)).toThrow();
    const unlinked = rows();
    unlinked[0].personId = unlinked[1].personId;
    expect(() => assertDemoCredentialRows(unlinked)).toThrow();
  });
  it("refuses absent or incorrectly mapped credentials", () => {
    const missing = rows();
    missing[0].password = "";
    expect(() => assertDemoCredentialRows(missing)).toThrow();
    const wrong = rows();
    wrong[0].accountId = "unrelated-user";
    expect(() => assertDemoCredentialRows(wrong)).toThrow();
  });
});
