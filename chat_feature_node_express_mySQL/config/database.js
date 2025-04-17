const mysql = require("mysql2/promise");
const config = require("./env");

// Create MySQL connection pool
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10, // Example limit
  queueLimit: 0,
});

// Test database connection
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Successfully connected to the database");
    return true;
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

// Optional: Initialize database (if needed, e.g., create tables)
async function initializeDatabase() {
  // Example: You might check if tables exist and create them if not.
  // For now, we'll just log. Keep this simple unless needed.
  console.log("Database initialization check complete.");
  // try {
  //   // const connection = await pool.getConnection();
  //   // await connection.query("CREATE TABLE IF NOT EXISTS messages ..."); // Example
  //   // connection.release();
  //   // console.log('Database initialized successfully');
  // } catch (error) {
  //   console.error('Error initializing database:', error);
  //   throw error; // Rethrow to prevent server start if init fails
  // }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
};