import "server-only";
import { getServerEnv } from "@/lib/env";
import { createDatabaseClient } from "./connection";

const globalDatabase = globalThis as typeof globalThis & {
  dfcamclpDatabase?: ReturnType<typeof createDatabaseClient>;
};

const connection =
  globalDatabase.dfcamclpDatabase ??
  createDatabaseClient(getServerEnv().DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalDatabase.dfcamclpDatabase = connection;
}

export const db = connection.database;
export const dbClient = connection.client;
