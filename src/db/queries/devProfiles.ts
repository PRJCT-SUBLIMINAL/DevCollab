import {eq} from "drizzle-orm";
import {db} from "../index.js";
import {devProfiles, NewDevProfile} from "../schema.js";
import {UnauthorizedError} from "../../classes.js";

export async function createDevProfile(devProfile: NewDevProfile) {
    const [result] = await db.insert(devProfiles).values(devProfile).onConflictDoNothing().returning();
    return result;
}

export async function getDevProfile(userId: string) {
    const [result] = await db.select().from(devProfiles).where(eq(devProfiles.userId, userId));
    return result;
}