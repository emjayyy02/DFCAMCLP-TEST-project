import "server-only";
import { db } from "@/server/db";
import { disableAccount } from "./account-service";

export async function disableApplicationAccount(authUserId: string) {
  return disableAccount(db, authUserId);
}
