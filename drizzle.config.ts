import {defineConfig} from "drizzle-kit";
import {envOrThrow} from "./src/config.js";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",

    dbCredentials: {
        url: envOrThrow("DATABASE_URL")
    }
})