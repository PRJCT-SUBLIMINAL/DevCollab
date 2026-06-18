import express from "express";
import postgres from "postgres";
import cors from "cors";
import path from "path";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import {drizzle} from "drizzle-orm/postgres-js";

import {
    middlewareLogResponses,
    middlewareCreateUser,
    middlewareErrorHandler
} from "./middleware.js";

import {config} from "./config.js";

const migrationClient = postgres(config.db.url, {max: 1});
const PORT = 8080; // Replace with config soon
const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

app.get("/create-user", (req, res) => {
  res.sendFile(path.join(process.cwd(), "devcollab-tester.html"));
});

async function main() {
    await migrate(drizzle(migrationClient), config.db.migrationConfig);

    app.use(middlewareLogResponses);

    app.post("/api/users", middlewareCreateUser);

    app.use(middlewareErrorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
};

main();