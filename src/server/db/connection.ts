import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function createDatabaseClient(
  connectionString: string,
  options: { max?: number } = {},
) {
  const client = postgres(connectionString, {
    max: options.max ?? 10,
    onnotice: () => undefined,
  });
  const database = drizzle(client, { schema });

  return { client, database };
}

export type Database = ReturnType<typeof createDatabaseClient>["database"];
