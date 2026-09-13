import "server-only";
import { getServerEnv } from "@/lib/env";
import { db } from "@/server/db";
import { createPortalAuth } from "./factory";

const env = getServerEnv();
const alternateLoopbackURL = new URL(env.BETTER_AUTH_URL);
alternateLoopbackURL.hostname =
  alternateLoopbackURL.hostname === "localhost" ? "127.0.0.1" : "localhost";

export const auth = createPortalAuth(db, {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins:
    env.APP_ENV === "development" || env.APP_ENV === "test"
      ? [env.BETTER_AUTH_URL, alternateLoopbackURL.origin]
      : [env.BETTER_AUTH_URL],
});
