// loaders/express.js
const express = require("express");
const cors = require("cors");
const config = require("../config/env");
const messageRoutes = require("../api/routes/messageRoutes");

function loadExpress(app) {
  // Setup CORS using the cors middleware
  app.use(cors(config.cors)); // Use config for CORS options

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // --- API Routes ---
  app.use("/api", messageRoutes); // Mount message routes under /api

  // --- Central Error Handling Middleware ---
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: "Internal Server Error",
      message: err.message || "An unexpected error occurred.",
    });
  });

  console.log("Express loaded.");
}

module.exports = loadExpress;