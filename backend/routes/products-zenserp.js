import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/search', async (req, res) => {
  const { plant = '', soil = '', stage = '' } = req.query;

  const queryParts = [];
  if (plant) queryParts.push(plant);
  if (soil) queryParts.push(soil);
  if (stage) queryParts.push(stage);
  queryParts.push('agriculture product');

  const query = queryParts.join(' ');

  const options = {
    method: 'GET',
    url: 'https://zenserp.p.rapidapi.com/search',
    params: { q: query, hl: 'en', gl: 'us' },
    headers: {
      'X-RapidAPI-Key': process.env.ZEN_SERP_API_KEY,
      'X-RapidAPI-Host': 'zenserp.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const results = response.data.organic?.map(item => ({
      title: item.title,
      link: item.url,
      snippet: item.description
    })) || [];

    res.json({ results });
  } catch (error) {
    console.error('Zenserp API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

export default router;
