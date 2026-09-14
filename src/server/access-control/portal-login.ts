import { eq } from "drizzle-orm";
import { portalPath, type PortalCode } from "../../lib/portals";
import type { PortalAuth } from "../auth/factory";
import type { Database } from "../db/connection";
import { authSessions } from "../db/schema";
import { getActiveMemberships } from "./service";

type SuccessfulSignIn = {
  token: string;
  user: { id: string };
};

export type PortalLoginResult =
  | { status: "authenticated"; redirectTo: string; setCookie: string | null }
  | { status: "invalid-credentials" }
  | { status: "portal-denied" };

export async function signInToPortal(
  auth: PortalAuth,
  database: Database,
  input: { email: string; password: string; portal: PortalCode },
  requestHeaders: Headers,
): Promise<PortalLoginResult> {
  let response: Response;
  try {
    response = await auth.api.signInEmail({
      body: { email: input.email, password: input.password },
      headers: requestHeaders,
      asResponse: true,
    });
  } catch {
    return { status: "invalid-credentials" };
  }

  if (!response.ok) return { status: "invalid-credentials" };

  const payload = (await response.clone().json()) as SuccessfulSignIn;
  const memberships = await getActiveMemberships(database, payload.user.id);
  const membership = memberships.find(
    (candidate) => candidate.portal === input.portal,
  );
  const requiredPermission = `${input.portal.toLowerCase()}.portal.view`;
  const allowed = membership?.permissions.includes(
    requiredPermission as (typeof membership.permissions)[number],
  );

  if (!allowed) {
    await database
      .delete(authSessions)
      .where(eq(authSessions.token, payload.token));
    return { status: "portal-denied" };
  }

  return {
    status: "authenticated",
    redirectTo: portalPath(input.portal),
    setCookie: response.headers.get("set-cookie"),
  };
}
