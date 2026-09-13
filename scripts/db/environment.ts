import { loadEnvConfig } from "@next/env";
import { z } from "zod";
import { parseServerEnv } from "../../src/lib/env-schema";

export function loadDatabaseEnvironment() {
  loadEnvConfig(process.cwd());
  return parseServerEnv(process.env);
}

export function loadSafeDevelopmentResetEnvironment() {
  const env = loadDatabaseEnvironment();
  const composeEnv = z
    .object({
      POSTGRES_USER: z.string().min(1),
      POSTGRES_DB: z.string().min(1),
    })
    .parse(process.env);
  const url = new URL(env.DATABASE_URL);
  const databaseName = decodeURIComponent(url.pathname.slice(1));
  const allowedHosts = new Set(["127.0.0.1", "localhost", "::1"]);

  if (env.APP_ENV !== "development") {
    throw new Error("db:reset:dev requires APP_ENV=development.");
  }
  if (!allowedHosts.has(url.hostname)) {
    throw new Error("db:reset:dev only permits a local PostgreSQL host.");
  }
  if (databaseName !== composeEnv.POSTGRES_DB) {
    throw new Error(
      "db:reset:dev requires DATABASE_URL to target POSTGRES_DB.",
    );
  }
  if (url.username !== composeEnv.POSTGRES_USER) {
    throw new Error("db:reset:dev requires DATABASE_URL to use POSTGRES_USER.");
  }
  if (!databaseName.endsWith("_dev")) {
    throw new Error("db:reset:dev requires a database name ending in _dev.");
  }

  return { ...env, databaseName };
}
