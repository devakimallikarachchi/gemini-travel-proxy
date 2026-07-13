// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// This route catches requests from your web app
app.post('/api/generate', async (req, res) => {
  const { destination, duration, vibe } = req.body;
  
  // Gets your secret key safely from the server settings
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Server API Key is missing." });
  }

  const prompt = `You are a stylish travel consultant. Build an aesthetic travel itinerary for ${duration} in ${destination}. Style/Vibe: ${vibe}.
  Format cleanly with markdown bold titles and emoji bullets:
  1. ✨ **Trip Overview**: 1 short aesthetic sentence.
  2. 🗓️ **Day-by-Day Itinerary**: (Morning, Afternoon, Evening).
  3. 🥐 **Must-Try Foods & Cafes**: 3 specific spots/dishes.
  4. 📸 **Photo Spot & Pro-Tip**: 1 photogenic spot and 1 local tip.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error calling Gemini API." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));