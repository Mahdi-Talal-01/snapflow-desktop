// services/notificationService.js
const axios = require('axios');
const config = require('../config/env'); // Adjust path if needed

/**
 * Sends a notification payload to the configured n8n webhook URL.
 * @param {object} payload - The JSON payload to send.
 * @param {string} eventType - A description of the event for logging.
 */
async function sendToN8n(payload, eventType = 'Notification') {
  if (!config.n8n.webhookUrl) {
    // Log clearly that the notification is skipped due to missing config
    console.warn(`N8N_WEBHOOK_URL not defined. Skipping n8n notification for: ${eventType}`);
    // Return immediately without erroring
    return;
  }

  try {
    console.log(`Sending ${eventType} to n8n webhook: ${config.n8n.webhookUrl}`);
    const response = await axios.post(config.n8n.webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000, // Timeout after 5 seconds
    });
    console.log(`n8n webhook notification for ${eventType} sent successfully. Status: ${response.status}`);
    // Success: No action needed, the function completes.
  } catch (error) {
    // Log detailed error information but DO NOT throw the error,
    // allowing the main application flow (like saving the message) to continue.
    console.error(`Failed to send ${eventType} notification to n8n webhook:`);
    if (error.response) {
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('Request Error:', error.message);
    } else {
      console.error('Error Message:', error.message);
    }
    // Important: We are not re-throwing the error here.
  }
}

// We only need the generic function for this requirement
module.exports = {
  sendToN8n,
  // notifyN8nServerStarted // This can still be exported if used in server.js
};