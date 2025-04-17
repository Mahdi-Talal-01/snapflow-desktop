// server.js
const express = require("express");
const http = require("http");

// Loaders
const loadExpress = require("./loaders/express");
const loadSocketIo = require("./loaders/socket");

// Config
const config = require("./config/env");
const db = require("./config/database");

async function startServer() {
  // 1. Test Database Connection
  const dbConnected = await db.testConnection();
  if (!dbConnected) {
    console.error(
      "FATAL: Failed to connect to database. Please check your configuration and database server status."
    );
    process.exit(1); // Exit if DB connection fails on startup
  }

  // 2. Initialize Database (Optional - e.g., create tables if they don't exist)
  try {
    await db.initializeDatabase();
  } catch (initError) {
    console.error("FATAL: Database initialization failed:", initError);
    process.exit(1);
  }

  // 3. Create Express App & HTTP Server
  const app = express();
  const server = http.createServer(app);

  // 4. Load Express Middleware and Routes
  loadExpress(app);

  // 5. Load Socket.IO
  loadSocketIo(server); // Pass the HTTP server

  // 6. Start Listening
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Access API at http://localhost:${config.port}/api`);
  });

  // Graceful shutdown handler (optional but recommended)
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      // Close database pool connections
      db.pool
        .end()
        .then(() => console.log("Database pool closed"))
        .catch((err) => console.error("Error closing database pool:", err))
        .finally(() => process.exit(0));
    });
  });
}

startServer();