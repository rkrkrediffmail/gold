// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gold price API endpoint
app.get('/api/gold-prices', (req, res) => {
  // This is a mock response - replace with real API call later
  const mockData = generateMockGoldData();
  res.json(mockData);
});

// OpenAI API proxy
app.post('/api/openai', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    res.json(completion.choices[0]);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve the HTML file for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper function to generate mock gold price data
function generateMockGoldData() {
  const days = 365;
  const data = [];
  let price = 1800;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const change = (Math.random() - 0.48) * 10;
    price = Math.max(800, price + change);
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 5000
    });
  }

  return data;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
