import { eq } from "drizzle-orm";
import type { Database } from "../db/connection";
import { applicationAccounts, authSessions } from "../db/schema";

export async function disableAccount(database: Database, authUserId: string) {
  return database.transaction(async (transaction) => {
    const [account] = await transaction
      .update(applicationAccounts)
      .set({ status: "DISABLED", updatedAt: new Date() })
      .where(eq(applicationAccounts.authUserId, authUserId))
      .returning({ authUserId: applicationAccounts.authUserId });

    if (!account) return null;

    await transaction
      .delete(authSessions)
      .where(eq(authSessions.userId, authUserId));

    return account;
  });
}
