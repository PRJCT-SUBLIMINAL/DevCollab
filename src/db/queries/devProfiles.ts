import {eq} from "drizzle-orm";
import {db} from "../index.js";
import {devProfiles, NewDevProfile} from "../schema.js";
import {UnauthorizedError} from "../../classes.js";

export async function createDevProfile(devProfile: NewDevProfile) {
    const [result] = await db.insert(devProfiles).values(devProfile).onConflictDoNothing().returning();
    return result;
}

export async function getDevProfile(username: string) {
    const [result] = await db.select().from(devProfiles).where(eq(devProfiles.username, username));
    return result;
}

export async function updateDevProfile(userId: string, devProfile: NewDevProfile) {
    const [result] = await db.update(devProfiles).set(devProfile).where(eq(devProfiles.userId, userId)).returning();
    return result;
}

export async function deleteDevProfile(userId: string) {
    const [result] = await db.delete(devProfiles).where(eq(devProfiles.userId, userId)).returning();
    return result;
}

export async function deleteAllDevProfiles() {
    await db.delete(devProfiles);
}