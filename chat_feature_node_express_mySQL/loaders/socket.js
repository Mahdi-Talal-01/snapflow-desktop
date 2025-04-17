// loaders/socket.js
const socketIo = require("socket.io");
const config = require("../config/env");
const registerMessageHandler = require("../sockets/messageHandler");

function loadSocketIo(server) {
  const io = socketIo(server, config.socketOptions);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register handlers for this specific socket
    registerMessageHandler(io, socket); // Pass io and socket

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", socket.id, "Reason:", reason);
    });

    // Handle generic socket errors
    socket.on("error", (error) => {
      console.error("Socket error on", socket.id, ":", error);
    });
  });

  console.log("Socket.IO loaded.");
  return io; // Return the io instance if needed elsewhere (though unlikely now)
}

module.exports = loadSocketIo;