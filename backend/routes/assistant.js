// routes/assistant.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages array' });
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || 'No response from Groq';
    res.json({ reply });
  } catch (error) {
    console.error('GROQ API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from Groq' });
  }
});

export default router;

