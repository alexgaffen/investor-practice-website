// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes (you can adjust settings as needed)
app.use(cors());

// Finnhub API key from environment variable
const FINNHUB_TOKEN = process.env.FINNHUB_API_KEY;

// Endpoint for stock search using Finnhub's search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Missing query parameter" });
    
    const response = await axios.get(`https://finnhub.io/api/v1/search`, {
      params: {
        q: query,
        token: FINNHUB_TOKEN,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error in /api/search:", error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

// Endpoint for getting a stock quote using Finnhub's quote endpoint
app.get('/api/quote', async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Missing symbol parameter" });
    
    const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
      params: {
        symbol: symbol,
        token: FINNHUB_TOKEN,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error in /api/quote:", error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});