import { loadEnvConfig } from "@next/env";
import { parseServerEnv } from "../src/lib/env-schema";

loadEnvConfig(process.cwd());
try {
  parseServerEnv(process.env);
  console.info("Server environment is valid. Values are not displayed.");
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Environment validation failed.",
  );
  process.exitCode = 1;
}
