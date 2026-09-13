import "server-only";
import { auth } from "./auth";
import { db } from "@/server/db";
import { getApplicationSession } from "./session-core";

export async function getCurrentApplicationSession(requestHeaders: Headers) {
  return getApplicationSession(auth, db, requestHeaders);
}
