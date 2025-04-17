const { pool } = require("../config/database");

async function save(name, message, userId) {
  const query =
    "INSERT INTO messages (name, message, userId) VALUES (?, ?, ?)";
  try {
    const [result] = await pool.query(query, [name, message, userId]);
    return result.insertId; // Return the ID of the newly inserted message
  } catch (error) {
    throw new Error("Database error while saving message");
  }
}

async function findRecent(limit = 90) {
  const query = "SELECT * FROM messages ORDER BY created_at DESC LIMIT ?";
  try {
    const [messages] = await pool.query(query, [limit]);
    return messages;
  } catch (error) {
    console.error("Error fetching recent messages from repository:", error);
    throw new Error("Database error while fetching messages");
  }
}

module.exports = {
  save,
  findRecent,
};