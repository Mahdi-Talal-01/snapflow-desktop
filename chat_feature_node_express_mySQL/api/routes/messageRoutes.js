const express = require("express");
const messageService = require("../../services/messageService");

const router = express.Router();

// GET /api/messages - Fetch recent messages
router.get("/messages", async (req, res, next) => {
  try {
    const messages = await messageService.getRecentMessages();
    res.json(messages);
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    // Forward error to the central error handler
    next(error); // Pass the error to Express error handling middleware
  }
});

module.exports = router;