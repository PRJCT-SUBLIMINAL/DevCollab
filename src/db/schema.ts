import { pgTable, timestamp, varchar, uuid, text, boolean } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", {length:256}).notNull().unique(),
    hashedPassword: varchar("hashed_password").notNull().default("unset"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(()=> new Date())
})

export const refreshTokens = pgTable("refresh_tokens", {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    token: text("token").primaryKey().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revokedAt"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(()=> new Date())
})

export type NewUser = typeof users.$inferInsert;