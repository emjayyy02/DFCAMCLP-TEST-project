import { parseServerEnv } from "../../src/lib/env-schema";

export function assertProductionEnvironment(
  input: Record<string, string | undefined>,
  args: string[] = [],
) {
  if (args.length)
    throw new Error("Production bootstrap accepts no arguments.");
  if (input.APP_ENV !== "production")
    throw new Error("APP_ENV must be production.");
  if (input.PRODUCTION_DEMO_BOOTSTRAP_CONFIRM !== "DFCAMCLP_PUBLIC_DEMO")
    throw new Error("Explicit production demo confirmation is required.");
  const env = parseServerEnv(input);
  const app = new URL(env.APP_URL);
  const auth = new URL(env.BETTER_AUTH_URL);
  if (
    app.protocol !== "https:" ||
    auth.protocol !== "https:" ||
    app.origin !== auth.origin ||
    app.username ||
    app.password ||
    auth.username ||
    auth.password ||
    app.pathname !== "/" ||
    auth.pathname !== "/" ||
    app.search ||
    auth.search ||
    app.hash ||
    auth.hash ||
    /^(localhost|127\.|\[::1\])/.test(app.hostname) ||
    app.hostname.endsWith(".invalid")
  )
    throw new Error("Same HTTPS production origin required.");
  const db = new URL(env.DATABASE_URL);
  if (
    !db.hostname.endsWith(".neon.tech") ||
    db.searchParams.get("sslmode") !== "require" ||
    [...db.searchParams.keys()].some(
      (key) => key !== "sslmode" && key !== "channel_binding",
    )
  )
    throw new Error("Neon with sslmode=require is required.");
  if (!env.DEMO_ACCOUNT_PASSWORD)
    throw new Error("DEMO_ACCOUNT_PASSWORD is required.");
  return { ...env, DEMO_ACCOUNT_PASSWORD: env.DEMO_ACCOUNT_PASSWORD };
}
