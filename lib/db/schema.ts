import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  varchar,
  unique,
  foreignKey,
  index,
  boolean,
} from "drizzle-orm/pg-core";

// Existing imports and schema definition for users, teams, team_members, team_invitations, feature_items, auth_tokens...

// CRM: Companies
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    website: varchar("website", { length: 255 }),
    industry: varchar("industry", { length: 100 }),
    status: varchar("status", { length: 32 }).notNull(), // "prospect" | "client" | "inactive"
    description: text("description"),
    mainContactId: uuid("main_contact_id").references(() => contacts.id, { onDelete: "set null" }), // optional, circular below
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    nameUnique: unique().on(table.teamId, table.name),
    teamIdx: index().on(table.teamId),
    mainContactIdx: index().on(table.mainContactId),
  })
);

// CRM: Contacts
export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 30 }),
    jobTitle: varchar("job_title", { length: 80 }),
    status: varchar("status", { length: 32 }).notNull(), // "lead" | "customer" | "inactive"
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    nameIdx: index().on(table.teamId, table.lastName, table.firstName),
    emailIdx: index().on(table.teamId, table.email),
    companyIdx: index().on(table.companyId),
  })
);

// CRM: Activities
export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 32 }).notNull(), // "call" | "email" | "meeting" | "note"
    subject: varchar("subject", { length: 160 }).notNull(),
    description: text("description"),
    datetime: timestamp("datetime", { withTimezone: true }).notNull(),
    assignedUserId: uuid("assigned_user_id").references(() => users.id),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    teamIdx: index().on(table.teamId),
    contactIdx: index().on(table.contactId),
    companyIdx: index().on(table.companyId),
    datetimeIdx: index().on(table.datetime),
  })
);

// Ensure circular reference for company.mainContactId to contacts and contacts.companyId to companies (set null on delete)