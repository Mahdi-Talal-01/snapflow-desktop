require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Temporarily allow all origins for testing
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

// Create MySQL connection pool
const con = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "snapflow_db",
  waitForConnections: true,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await con.getConnection();
    console.log("Successfully connected to the database");
    connection.release();
    return true;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return false;
  }
}

// Initialize database
async function initializeDatabase() {
  try {
    const connection = await con.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  // console.log('A user connected:', socket.id);

  // Send a welcome message to the client
  socket.emit("welcome", { message: "Welcome to the chat!" });

  socket.on("chat message", (data) => {
    // console.log('Message received:', data);
    // Save message to database
    const { name, message, userId } = data;
    // console.log('Message received:', name, message, userId);
    const query =
      "INSERT INTO messages (name, message, userId) VALUES (?, ?, ?)";
    con
      .query(query, [name, message, userId])
      .then(([result]) => {
        // Broadcast the message to all connected clients
        // console.log('-------------------------------:', result);
        io.emit("newMessage", {
          id: result.insertId,
          name,
          message,
          timestamp: new Date().toISOString(),
        });
      })
      .catch((error) => {
        // console.error('Error saving message:', error);
        socket.emit("error", { message: "Failed to save message" });
      });
  });

  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", socket.id, "Reason:", reason);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// API endpoint to get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const connection = await con.getConnection();
    const [messages] = await connection.query(
      "SELECT * FROM messages ORDER BY created_at DESC LIMIT 50"
    );
    connection.release();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error(
      "Failed to connect to database. Please check your database configuration."
    );
    process.exit(1);
  }
  await initializeDatabase();
  console.log(`Server running on port ${PORT}`);
});
