// middleware converts Bot Framework messages to OpenAI Response API format and sends replies back to the Bot Framework.
// this code is for debugging and testing, it will log all interactions to the console
// index_responseapi.js has code for handling OpenAI Response API format in a Bot Emulator environment with a backend bot

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

//middleware api
app.post('/api/messages', async (req, res) => {
  const activity = req.body;

  console.log("\n=== Incoming from Bot Service ===");
  console.log(JSON.stringify(activity, null, 2));

  if (activity.type === 'message') {
    const userMessage = activity.text;
    console.log(`\nUser (${activity.from.id}): ${userMessage}`);

    // Create OpenAI Response API equivalent payload
    const openAiRequest = {
      model: "gpt-4.1-mini",
      input: [
        { role: "user", content: userMessage }
      ],
      conversation: activity.conversation.id
    };

    console.log("\n=== Translated to OpenAI Response API ===");
    console.log(JSON.stringify(openAiRequest, null, 2));

    // For now, just echo the message
    const replyText = `Echo: ${userMessage}`;

    // Convert back to Bot Framework reply format
    const reply = {
      type: 'message',
      from: { id: activity.recipient.id, name: activity.recipient.name },
      recipient: { id: activity.from.id, role: 'user' },
      text: replyText,
      replyToId: activity.id,
      conversation: { id: activity.conversation.id },
      locale: activity.locale
    };

    console.log("\n=== Replying to Bot Service ===");
    console.log(JSON.stringify(reply, null, 2));

    try {
      // Send response back to Bot Framework
      const axios = require('axios');
      const url = `${activity.serviceUrl}/v3/conversations/${activity.conversation.id}/activities`;
      await axios.post(url, reply, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Reply sent to Bot Emulator.');
    } catch (error) {
      console.error('Failed to send reply to Bot Emulator:', error.message);
    }
  }

  res.sendStatus(200); // Acknowledge receipt of the activity
});

const PORT = process.env.PORT || 5055;
app.listen(PORT, () => {
  console.log(`Middleware running on port ${PORT}`);
});
