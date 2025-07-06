// analyze.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

function formatPredictionLabel(label) {
  if (!label) return "No prediction result.";

  // Əgər label arraydirsə, ilk elementi götür
  if (Array.isArray(label)) {
    label = label[0];
  }

  if (typeof label !== 'string') {
    return "No prediction result.";
  }

  const cleaned = label.replaceAll('___', ' - ').replaceAll('_', ' ').trim();

  if (cleaned.toLowerCase() === 'healthy') {
    return `✅ The plant appears to be healthy.`;
  }

  const parts = cleaned.split(' ');
  if (parts.length < 2) {
    return `⚠️ The plant might be affected by ${cleaned.toLowerCase()}.`;
  }

  const plant = parts[0].toLowerCase();
  const disease = parts.slice(1).join(' ').toLowerCase();

  return `🪴 The plant is a ${plant} and it appears to have ${disease}.`;
}

router.post('/', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    // Prediksiya yaratmaq üçün Replicate API çağırışı
    const createResponse = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: "33eabfb8b9664ec729b58d89d53e7ae8cd4e35979ebd5d27d22d1d95d88f7ee2",
        input: { image }
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const getUrl = createResponse.data.urls.get;
    let output = null;

    const maxAttempts = 50;    // Polling üçün maksimum cəhd sayı
    const intervalMs = 2000;   // 2 saniyə intervalla yoxlama

    for (let i = 0; i < maxAttempts; i++) {
      const getResponse = await axios.get(getUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      console.log(`Polling attempt ${i + 1}, status: ${getResponse.data.status}`);

      if (getResponse.data.status === 'succeeded') {
        output = getResponse.data.output;
        break;
      }

      if (getResponse.data.status === 'failed') {
        return res.status(500).json({ error: 'Prediction failed' });
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    if (!output) return res.status(504).json({ error: 'Prediction timeout' });

    const formatted = formatPredictionLabel(output);

    return res.json({ result: formatted });

  } catch (error) {
    console.error("❌ Replicate error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image analysis failed" });
  }
});

export default router;

