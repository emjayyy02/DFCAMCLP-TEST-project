import {
  boolean,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const campuses = pgTable("campuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 32 })
    .notNull()
    .unique("campuses_code_unique"),
  name: varchar("name", { length: 160 }).notNull(),
  shortName: varchar("short_name", { length: 100 }),
  locationLabel: varchar("location_label", { length: 160 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const programs = pgTable("programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  campusId: uuid("campus_id")
    .notNull()
    .references(() => campuses.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  code: varchar("code", { length: 32 })
    .notNull()
    .unique("programs_code_unique"),
  name: varchar("name", { length: 200 }).notNull(),
  shortName: varchar("short_name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const programMajors = pgTable(
  "program_majors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, {
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    code: varchar("code", { length: 32 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("program_majors_program_code_unique").on(
      table.programId,
      table.code,
    ),
    unique("program_majors_id_program_unique").on(table.id, table.programId),
  ],
);
