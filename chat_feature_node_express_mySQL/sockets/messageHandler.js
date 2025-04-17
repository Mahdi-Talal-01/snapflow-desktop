// sockets/messageHandler.js
const messageService = require("../services/messageService");
const axios = require('axios');

//production
// const n8nWebhookUrl = 'http://localhost:5678/webhook/28ebf0a3-5620-443d-a32f-1543bc6cf174';
//testing
const n8nWebhookUrl = 'http://localhost:5678/webhook-test/28ebf0a3-5620-443d-a32f-1543bc6cf174';

function registerMessageHandler(io, socket) {
    const handleChatMessage = async (data) => {
        try {
            const { name, message, userId } = data;

            try {
                const n8nPayload = {
                    name: name,
                    message: message,
                    userId: userId,
                };

                const response = await axios.post(n8nWebhookUrl, n8nPayload);
                console.log('Response from n8n webhook:', response.data);

                // Assuming n8n sends back a JSON response like { "isSafe": true } or { "isSafe": false }
                if (response.data && response.data.isSafe === "True") {
                    // Message is safe, save it to the database
                    const newMessage = await messageService.createMessage(
                        name,
                        message,
                        userId
                    );
                    io.emit("newMessage", newMessage); // Broadcast the new message
                } else {
                    // Message contains harmful code, do not save and inform the user
                    console.log('Harmful message detected:', message);
                    socket.emit("harmfulMessageDetected", {
                        message: "Your message contains potentially harmful content and was not saved.",
                    });
                }

            } catch (error) {
                console.error('Error communicating with n8n webhook:', error.message, error.response && error.response.data);
                // Handle potential errors in communication with n8n
                socket.emit("error", {
                    message: "There was an error processing your message.",
                });
            }

        } catch (error) {
            console.error("Error processing chat message:", error);
            socket.emit("error", {
                message: "Failed to process your message. " + error.message,
            });
        }
    };

    socket.on("chat message", handleChatMessage);
}

module.exports = registerMessageHandler;