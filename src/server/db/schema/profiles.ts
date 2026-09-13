import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { programMajors, programs } from "./institution";
import { people } from "./people";

export const applicantProfileStatus = pgEnum("applicant_profile_status", [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
]);

export const institutionalProfileStatus = pgEnum(
  "institutional_profile_status",
  ["ACTIVE", "INACTIVE"],
);

export const applicantProfiles = pgTable(
  "applicant_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    personId: uuid("person_id")
      .notNull()
      .unique("applicant_profiles_person_unique")
      .references(() => people.id, {
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    applicantNumber: varchar("applicant_number", { length: 64 }).unique(
      "applicant_profiles_number_unique",
    ),
    selectedProgramId: uuid("selected_program_id").references(
      () => programs.id,
      { onDelete: "restrict", onUpdate: "restrict" },
    ),
    selectedMajorId: uuid("selected_major_id"),
    applicationStatus: applicantProfileStatus("application_status")
      .default("DRAFT")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: "applicant_profiles_major_program_fk",
      columns: [table.selectedMajorId, table.selectedProgramId],
      foreignColumns: [programMajors.id, programMajors.programId],
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
    check(
      "applicant_profiles_major_requires_program_check",
      sql`${table.selectedMajorId} is null or ${table.selectedProgramId} is not null`,
    ),
  ],
);

export const studentProfiles = pgTable(
  "student_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    personId: uuid("person_id")
      .notNull()
      .unique("student_profiles_person_unique")
      .references(() => people.id, {
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    studentNumber: varchar("student_number", { length: 64 }).unique(
      "student_profiles_number_unique",
    ),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, {
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    majorId: uuid("major_id"),
    yearLevel: integer("year_level"),
    studentStatus: institutionalProfileStatus("student_status")
      .default("ACTIVE")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: "student_profiles_major_program_fk",
      columns: [table.majorId, table.programId],
      foreignColumns: [programMajors.id, programMajors.programId],
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
    check(
      "student_profiles_year_level_positive_check",
      sql`${table.yearLevel} is null or ${table.yearLevel} > 0`,
    ),
  ],
);

export const employeeProfiles = pgTable("employee_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  personId: uuid("person_id")
    .notNull()
    .unique("employee_profiles_person_unique")
    .references(() => people.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  employeeNumber: varchar("employee_number", { length: 64 }).unique(
    "employee_profiles_number_unique",
  ),
  departmentLabel: varchar("department_label", { length: 160 }),
  positionTitle: varchar("position_title", { length: 160 }),
  employmentStatus: institutionalProfileStatus("employment_status")
    .default("ACTIVE")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
