const messageRepository = require("../repositories/messageRepository");

async function createMessage(name, message, userId) {
  if (!name || !message || !userId) {
    throw new Error("Missing required message data");
  }
  const messageId = await messageRepository.save(name, message, userId);
  return {
    id: messageId,
    name,
    message,
    userId, // You might not need to return userId here
    timestamp: new Date().toISOString(), // Generate timestamp here
  };
}

async function getRecentMessages() {
  // Add any logic before fetching if needed
  const messages = await messageRepository.findRecent();
  // Add any logic after fetching if needed (e.g., formatting)
  return messages;
}

module.exports = {
  createMessage,
  getRecentMessages,
};