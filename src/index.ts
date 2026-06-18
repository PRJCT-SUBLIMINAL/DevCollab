import express from "express";

import {
    setupMigration,
    setupResponseLogs,
    setupAPI,
    setupTestPage,
    setupErrorHandler,
    setupServer
} from "./setup.js";

const app = express();

async function main() {
    await setupMigration();
    setupResponseLogs(app);
    setupAPI(app);
    setupTestPage(app);
    setupErrorHandler(app);
    setupServer(app);
};

main().catch((err)=>{
    console.error("Failed to start application:\n", err);
    process.exit(1);
});