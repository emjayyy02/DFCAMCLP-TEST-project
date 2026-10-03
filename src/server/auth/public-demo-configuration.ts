import "server-only";
import { getServerEnv } from "@/lib/env";

// This is the only environment value deliberately passed to the demo panel.
// Never return the server environment object or use a NEXT_PUBLIC env export.
export function getPublicDemoPassword(): string {
  const password = getServerEnv().DEMO_ACCOUNT_PASSWORD;
  if (!password) {
    throw new Error(
      "DEMO_ACCOUNT_PASSWORD is required for the public demo panel.",
    );
  }
  return password;
}
