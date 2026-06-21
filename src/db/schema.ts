import { pgTable, timestamp, varchar, uuid, text, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", {length:256}).notNull().unique(),
    hashedPassword: varchar("hashed_password").notNull().default("unset"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(()=> new Date())
});

export const refreshTokens = pgTable("refresh_tokens", {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    token: text("token").primaryKey().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(()=> new Date())
});

export const devProfiles = pgTable("dev_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
    username: varchar("username", {length:256}).notNull().unique(),
    bio: text("bio"),
    skills: json("skills").$type<string[]>()
});

export type NewUser = typeof users.$inferInsert;