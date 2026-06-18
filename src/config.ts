import { EnvironmentError } from "./classes.js";
import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

export function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) throw new EnvironmentError(`Can't find ${key} in .env | Include .env at the root of your folder and initialize your key: ${key}=""`);
    return value;
}

type APIConfig = {
    jwtSecret: string;
    port: number;
}

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

type Config = {
    db: DBConfig;
    api: APIConfig;
};

export const config: Config = {
    db: {
        url: envOrThrow("DATABASE_URL"),
        migrationConfig: {migrationsFolder: "./src/db/migrations"},
    },
    api: {
        jwtSecret: envOrThrow("JWT_SECRET"),
        port: Number(envOrThrow("API_PORT"))
    },
} as const;