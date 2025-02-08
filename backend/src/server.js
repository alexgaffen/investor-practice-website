const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Example endpoint to forward a request to the C++ algo service
app.get('/analyze', async (req, res) => {
  try {
    // Replace with the actual address if running via Docker Compose
    const response = await axios.get('http://cpp-algos:8080/analyze');
    res.json({ signal: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/', (req, res) => res.send('Backend is running'));

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));