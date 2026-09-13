import { describe, expect, it } from "vitest";
import { parseServerEnv } from "../lib/env-schema";

const valid = {
  APP_ENV: "test",
  APP_URL: "http://localhost:3000",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: "synthetic-test-secret-at-least-32-characters",
  DATABASE_URL: "postgresql://test:synthetic-value@localhost:5432/test",
};

describe("server environment boundary", () => {
  it("accepts a complete local environment", () => {
    expect(parseServerEnv(valid).APP_ENV).toBe("test");
  });
  it.each([
    "APP_ENV",
    "APP_URL",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
    "DATABASE_URL",
  ])("rejects missing %s", (field) => {
    expect(() => parseServerEnv({ ...valid, [field]: undefined })).toThrow(
      field,
    );
  });
  it("rejects non-PostgreSQL connection strings", () => {
    expect(() =>
      parseServerEnv({ ...valid, DATABASE_URL: "https://example.test" }),
    ).toThrow("DATABASE_URL");
  });
  it("requires HTTPS outside local/test environments", () => {
    expect(() =>
      parseServerEnv({
        ...valid,
        APP_ENV: "production",
        BETTER_AUTH_URL: "https://portal.example.invalid",
      }),
    ).toThrow("APP_URL");
  });
  it("rejects malformed production URLs without throwing raw URL errors", () => {
    expect(() =>
      parseServerEnv({ ...valid, APP_ENV: "production", APP_URL: "invalid" }),
    ).toThrow("APP_URL");
  });
  it("does not include secret input in validation errors", () => {
    const secret = "synthetic-secret-invalid-url";
    try {
      parseServerEnv({ ...valid, DATABASE_URL: secret });
      expect.fail("Expected validation failure");
    } catch (error) {
      expect(String(error)).not.toContain(secret);
      expect(String(error)).toContain("DATABASE_URL");
    }
  });

  it("rejects weak production auth configuration", () => {
    expect(() =>
      parseServerEnv({
        ...valid,
        APP_ENV: "production",
        APP_URL: "https://portal.example.invalid",
        BETTER_AUTH_URL: "http://localhost:3000",
        BETTER_AUTH_SECRET: "local-development-secret-change-me-now",
      }),
    ).toThrow("BETTER_AUTH_URL");
  });

  it("rejects a development seed password in production", () => {
    expect(() =>
      parseServerEnv({
        ...valid,
        APP_ENV: "production",
        APP_URL: "https://portal.example.invalid",
        BETTER_AUTH_URL: "https://portal.example.invalid",
        BETTER_AUTH_SECRET: "production-shaped-synthetic-secret-value",
        AUTH_SEED_PASSWORD: "fake-test-password",
      }),
    ).toThrow("AUTH_SEED_PASSWORD");
  });
});
