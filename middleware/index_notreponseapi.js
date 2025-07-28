const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/api/messages', async (req, res) => {
  const activity = req.body;

  if (activity.type === 'message') {
    const userMessage = activity.text;
    // const replyText = `You said: ${userMessage} oh no`;
    let replyText;

try {
  const response = await axios.post('http://localhost:8000/chat', {
    prompt: userMessage,
    agent: "chat"
  });
  replyText = response.data?.response || "Empty response from backend.";

} catch (error) {
  console.error('Error calling backend:', error.message);
  replyText = "There was an error contacting the backend.";
}


    const reply = {
      type: 'message',
      from: { id: activity.recipient.id, name: activity.recipient.name }, // bot ID
      recipient: { id: activity.from.id, role: 'user' }, // user ID
      text: replyText,
      replyToId: activity.id, // reply to the original message
      channelId: activity.channelId,
      conversation:{id: activity.conversation.id},
      locale: activity.locale
    };


    // const reply = {
    //   type: 'message',
    //   from: { id: activity.recipient.id }, // bot ID
    //   recipient: { id: activity.from.id }, // user ID
    //   text: replyText
    // };

    try {
      const url = `${activity.serviceUrl}/v3/conversations/${activity.conversation.id}/activities`;
      // const url = `${activity.serviceUrl}/v3/conversations/${activity.conversation.id}/activities/${activity.id}/reply`;


      await axios.post(url, reply, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Reply sent to Bot Emulator');
    } catch (error) {
      console.error('Failed to send reply to bot emulator:', error.message);
    }
  }

  res.sendStatus(200); // Always acknowledge receipt
});

app.listen(process.env.PORT || 5055, () => {
  console.log(`Middleware running on port ${process.env.PORT || 5055}`);
});
