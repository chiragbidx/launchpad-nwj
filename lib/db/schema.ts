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

// Existing users, teams definitions (not shown for brevity)

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 32 }).notNull(), // 'owner', 'admin', 'member'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    teamUserUnique: unique().on(table.teamId, table.userId),
    teamIdx: index().on(table.teamId),
    userIdx: index().on(table.userId),
  })
);

// ... other exports (teams, users, companies, contacts, activities, invitations, etc.)