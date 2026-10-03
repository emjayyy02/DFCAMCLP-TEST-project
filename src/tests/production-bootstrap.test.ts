import { describe, expect, it } from "vitest";
import { assertProductionEnvironment } from "../../scripts/prod/guards";

const env = {
  APP_ENV: "production",
  APP_URL: "https://demo.vercel.app",
  BETTER_AUTH_URL: "https://demo.vercel.app",
  BETTER_AUTH_SECRET: "a".repeat(64),
  DATABASE_URL:
    "postgres://demo:unused@ep-demo.neon.tech/neondb?sslmode=require",
  DEMO_ACCOUNT_PASSWORD: "synthetic-test-only-password",
  PRODUCTION_DEMO_BOOTSTRAP_CONFIRM: "DFCAMCLP_PUBLIC_DEMO",
};

describe("production demo bootstrap guards", () => {
  it("accepts explicit production Neon configuration", () => {
    expect(() => assertProductionEnvironment(env)).not.toThrow();
  });
  it.each([
    { APP_ENV: "development" },
    { APP_ENV: "test" },
    { APP_ENV: "preview" },
    { PRODUCTION_DEMO_BOOTSTRAP_CONFIRM: "" },
    { PRODUCTION_DEMO_BOOTSTRAP_CONFIRM: "yes" },
    { APP_URL: "http://demo.vercel.app" },
    { BETTER_AUTH_URL: "http://demo.vercel.app" },
    { BETTER_AUTH_URL: "https://other.vercel.app" },
    { APP_URL: "https://localhost", BETTER_AUTH_URL: "https://localhost" },
    { APP_URL: "https://demo.vercel.app/path" },
    { APP_URL: "https://user:password@demo.vercel.app" },
    { DATABASE_URL: "postgres://demo:unused@localhost/neondb?sslmode=require" },
    { DATABASE_URL: "postgres://demo:unused@127.0.0.1/neondb?sslmode=require" },
    { DATABASE_URL: "postgres://demo:unused@[::1]/neondb?sslmode=require" },
    {
      DATABASE_URL:
        "postgres://demo:unused@remote.invalid/neondb?sslmode=require",
    },
    { DATABASE_URL: "postgres://demo:unused@ep-demo.neon.tech/neondb" },
    { DATABASE_URL: env.DATABASE_URL + "&host=localhost" },
    { DEMO_ACCOUNT_PASSWORD: "" },
    { DEMO_ACCOUNT_PASSWORD: "short" },
    { DEMO_ACCOUNT_PASSWORD: "a".repeat(129) },
    { BETTER_AUTH_SECRET: "short" },
  ])("refuses unsafe configuration %#", (override) => {
    expect(() =>
      assertProductionEnvironment({ ...env, ...override }),
    ).toThrow();
  });
  it("accepts no arbitrary identity arguments", () => {
    expect(() =>
      assertProductionEnvironment(env, ["--email=other@example.invalid"]),
    ).toThrow();
  });
  it("does not expose configuration values in failures", () => {
    try {
      assertProductionEnvironment({ ...env, DATABASE_URL: "secret-value" });
    } catch (error) {
      expect(String(error)).not.toContain("secret-value");
    }
  });
});
