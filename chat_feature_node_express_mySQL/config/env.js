require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "snapflow_db",
  },
  cors: {
    origin: "*", // Consider making this more restrictive in production
  },
  socketOptions: {
    cors: {
      origin: "*", // Match the main CORS config or specify differently
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
  },
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL || null,
  }
};