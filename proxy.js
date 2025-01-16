import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Set up Express
const app = express();
app.use(cors());
app.use(express.json());

// eslint-disable-next-line no-undef
const DATAFORSEO_AUTH = process.env.DATAFORSEO_AUTH;

// Route for DataForSEO proxy
app.post('/proxy/dataforseo', async (req, res) => {
  const { keyword, location_name, language_name } = req.body;

  const payload = [
    {
      keyword,
      location_name,
      language_name,
      device: 'desktop',
      os: 'windows',
      depth: 100,
    },
  ];

  console.log('Received request:', payload);

  try {
    const response = await axios.post(
      'https://api.dataforseo.com/v3/serp/google/organic/live/advanced',
      payload,
      {
        headers: {
          Authorization: `Basic ${DATAFORSEO_AUTH}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('DataForSEO response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching DataForSEO data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch DataForSEO data' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
