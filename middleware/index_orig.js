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

    console.log(`Received message from user ${activity.from.id}: ${userMessage}`);

    try {
      // Call OpenAI
      
      const openAIResponse = await axios.post(process.env.OPENAI_API_URL, {
        model:"gpt-4o",
        messages:[{role:"user", content:userMessage}]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }   
      });

      console.log(`OpenAI response: ${openAIResponse.data.response}`);

      // Forward to backend
      // await axios.post(process.env.BACKEND_API_URL, {
      //   userId: activity.from.id,
      //   message: openAIResponse.data.response
      // });

      console.log('Successfully handled message');
    } catch (error) {
      console.error('Error processing message', error.message);
    }
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
  console.log(`Middleware running on port ${process.env.PORT}`);
});
// insteaad of building out an emulaotr for backend,, 