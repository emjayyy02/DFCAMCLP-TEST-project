import {
  boolean,
  foreignKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { portalCodes } from "../../../lib/portals";
import { applicationAccounts } from "./authentication";

export const portalCode = pgEnum("portal_code", portalCodes);

export const portalMemberships = pgTable(
  "portal_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    applicationAccountId: text("application_account_id")
      .notNull()
      .references(() => applicationAccounts.authUserId, {
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    portal: portalCode("portal").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("portal_memberships_account_portal_unique").on(
      table.applicationAccountId,
      table.portal,
    ),
    unique("portal_memberships_id_portal_unique").on(table.id, table.portal),
  ],
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 64 }).notNull().unique("roles_code_unique"),
    label: varchar("label", { length: 100 }).notNull(),
    portal: portalCode("portal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("roles_id_portal_unique").on(table.id, table.portal)],
);

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 100 })
      .notNull()
      .unique("permissions_code_unique"),
    label: varchar("label", { length: 120 }).notNull(),
    portal: portalCode("portal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("permissions_id_portal_unique").on(table.id, table.portal),
  ],
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roleId: uuid("role_id").notNull(),
    permissionId: uuid("permission_id").notNull(),
    portal: portalCode("portal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("role_permissions_role_permission_unique").on(
      table.roleId,
      table.permissionId,
    ),
    foreignKey({
      name: "role_permissions_role_portal_fk",
      columns: [table.roleId, table.portal],
      foreignColumns: [roles.id, roles.portal],
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
    foreignKey({
      name: "role_permissions_permission_portal_fk",
      columns: [table.permissionId, table.portal],
      foreignColumns: [permissions.id, permissions.portal],
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
  ],
);

export const membershipRoles = pgTable(
  "membership_roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    portalMembershipId: uuid("portal_membership_id").notNull(),
    roleId: uuid("role_id").notNull(),
    portal: portalCode("portal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("membership_roles_membership_role_unique").on(
      table.portalMembershipId,
      table.roleId,
    ),
    foreignKey({
      name: "membership_roles_membership_portal_fk",
      columns: [table.portalMembershipId, table.portal],
      foreignColumns: [portalMemberships.id, portalMemberships.portal],
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
    foreignKey({
      name: "membership_roles_role_portal_fk",
      columns: [table.roleId, table.portal],
      foreignColumns: [roles.id, roles.portal],
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
  ],
);
