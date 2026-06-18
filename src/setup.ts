import postgres from "postgres";
import cors from "cors";
import path from "path";
import express, {Express} from "express";
// import {migrate} from "drizzle-orm/postgres-js/migrator";
// import {drizzle} from "drizzle-orm/postgres-js";

import { authRoute } from "./routes/auth.routes.js";

import {
    middlewareLogResponses,
    middlewareErrorHandler
} from "./middleware.js";

import {config} from "./config.js";

const PORT = config.api.port;

// export async function setupMigration() {
//     const migrationClient = postgres(config.db.url, {max: 1});
//     await migrate(drizzle(migrationClient), config.db.migrationConfig);
//     await migrationClient.end();
//     console.log("Migration done.");
// }

export function setupAPI(app: Express) {
    app.use(express.json());
    app.use(cors({
        origin: `http://localhost:${config.api.port}`,
        credentials: true
    }));

    app.use("/auth", authRoute);

    console.log("API routes registered.");
}

export function setupTestPage(app: Express) {
    app.get("/", (req, res) => {
        res.sendFile(path.join(process.cwd(), "devcollab-tester.html"));
    });

    console.log("Test page ready.");
}

export function setupResponseLogs(app: Express) {
    app.use(middlewareLogResponses);
    console.log("Response logs ready.");
}

export function setupErrorHandler(app: Express) {
    app.use(middlewareErrorHandler);
    console.log("Error handler set up.");
}

export function setupServer(app: Express) {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
    console.log("Ready for requests...");
}