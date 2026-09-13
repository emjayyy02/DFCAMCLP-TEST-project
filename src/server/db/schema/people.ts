import { date, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const people = pgTable("people", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  suffix: varchar("suffix", { length: 30 }),
  dateOfBirth: date("date_of_birth", { mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
