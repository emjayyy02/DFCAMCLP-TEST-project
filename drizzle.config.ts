import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { parseServerEnv } from "./src/lib/env-schema";

loadEnvConfig(process.cwd());
const env = parseServerEnv(process.env);

export default defineConfig({
  schema: "./src/server/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  strict: true,
  verbose: true,
});
