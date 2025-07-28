// Code built to handle OpenAI Response API format in a Bot Emulator environment.

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const logFilePath = path.join(__dirname, 'middleware.log');

// Helper to append logs to the log file
function logToFile(...messages) {
  const logMessage = `[${new Date().toISOString()}] ${messages.join(' ')}\n`;
  fs.appendFileSync(logFilePath, logMessage);
  console.log(logMessage.trim());
}

//receive and process the message from the Bot Framework
//api endopoint: /api/messages
app.post('/api/messages', async (req, res) => {
  const activity = req.body;

  if (activity.type === 'message') {
    const userMessage = activity.text;
    logToFile('From Bot:', JSON.stringify(activity, null, 2));

    let replyText;

    //prepare backedn request
    const backendRequest = {
      model: "gpt-4.1",
      input: [
        { role: "user", content: userMessage }
      ],
      conversation: "default"
    };

    logToFile('Message Sent to Backend:', JSON.stringify(backendRequest, null, 2));

    //call backend and handle respones
    //v1 responses
    try {
      // Call backend using Response API format
      const response = await axios.post('http://localhost:8000/responses', backendRequest);

      logToFile('Message Returned from Backend:', JSON.stringify(response.data, null, 2));

      // Extract reply from output array
      const outputs = response.data?.output || [];
      replyText = outputs
        .flatMap(item => item.content || [])
        .filter(c => c.type === "text")
        .map(c => c.text)
        .join("\n") || "Empty response from backend.";
    } catch (error) {
      logToFile('Error calling backend:', error.message);
      replyText = "There was an error contacting the backend.";
    }

    //prepare reply to bot emulator
    const reply = {
      type: 'message',
      from: { id: activity.recipient.id, name: activity.recipient.name },
      recipient: { id: activity.from.id, role: 'user' },
      text: replyText,
      replyToId: activity.id,
      channelId: activity.channelId,
      conversation: { id: activity.conversation.id },
      locale: activity.locale
    };

    logToFile('Message Sent Back to Bot:', JSON.stringify(reply, null, 2));

    //respond back to emulator
    try {
      const url = `${activity.serviceUrl}/v3/conversations/${activity.conversation.id}/activities`;
      await axios.post(url, reply, {
        headers: { 'Content-Type': 'application/json' }
      });
      logToFile('Reply sent to Bot Emulator');
    } catch (error) {
      logToFile('Failed to send reply to bot emulator:', error.message);
    }
  }

  res.sendStatus(200);
});

//start server on port 5055
app.listen(process.env.PORT || 5055, () => {
  logToFile(`Middleware running on port ${process.env.PORT || 5055}`);
});
