import { eq } from "drizzle-orm";
import type { Database } from "../db/connection";
import { applicationAccounts, people } from "../db/schema";
import type { PortalAuth } from "./factory";

export async function getApplicationSession(
  auth: PortalAuth,
  database: Database,
  requestHeaders: Headers,
) {
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return null;

  const [identity] = await database
    .select({
      personId: applicationAccounts.personId,
      status: applicationAccounts.status,
      firstName: people.firstName,
      lastName: people.lastName,
    })
    .from(applicationAccounts)
    .innerJoin(people, eq(people.id, applicationAccounts.personId))
    .where(eq(applicationAccounts.authUserId, session.user.id))
    .limit(1);

  if (!identity || identity.status !== "ACTIVE") return null;

  return { session: session.session, user: session.user, identity };
}
