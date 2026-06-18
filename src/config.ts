import { EnvironmentError } from "./classes.js";
import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

export function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) throw new EnvironmentError(`Can't find ${key} in .env | Include .env at the root of your folder and initialize your key: ${key}=""`);
    return value;
}

export const config = {
    db: {
        url: envOrThrow("DATABASE_URL"),
        migrationConfig: {migrationsFolder: "./src/db/migrations"} satisfies MigrationConfig,
    },
    api: {
        jwtSecret: envOrThrow("JWT_SECRET"),
        port: 8080
    }
} as const;