import postgres from "postgres";
import cors from "cors";
import path from "path";
import express, {Express} from "express";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import {drizzle} from "drizzle-orm/postgres-js";

import {
    middlewareLogResponses,
    middlewareCreateUser,
    middlewareErrorHandler
} from "./middleware.js";

import {config} from "./config.js";

const PORT = config.api.port;

export async function setupMigration() {
    const migrationClient = postgres(config.db.url, {max: 1});
    await migrate(drizzle(migrationClient), config.db.migrationConfig);
}

export function setupAPI(app: Express) {
    app.use(express.json());
    app.use(cors({
        origin: true,
        credentials: true
    }));

    app.post("/api/users", middlewareCreateUser);
}

export function setupTestPage(app: Express) {
    app.get("/create-user", (req, res) => {
        res.sendFile(path.join(process.cwd(), "devcollab-tester.html"));
    });
}

export function setupResponseLogs(app: Express) {
    app.use(middlewareLogResponses);
}

export function setupErrorHandler(app: Express) {
    app.use(middlewareErrorHandler);
}

export function setupServer(app: Express) {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}