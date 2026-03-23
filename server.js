require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ── Weather ──────────────────────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    const response = await fetch(url);
    const data = await response.json();
    const current = data.current_condition[0];
    res.json({
      city,
      temp_c: current.temp_C,
      temp_f: current.temp_F,
      description: current.weatherDesc[0].value,
      humidity: current.humidity,
      feels_like_c: current.FeelsLikeC,
      feels_like_f: current.FeelsLikeF,
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch weather' });
  }
});

// ── Rule-based outfit suggestion (no AI needed) ───────────────────────────────
app.post('/api/suggest', async (req, res) => {
  const { wardrobe, weather, occasion } = req.body;
  if (!wardrobe || wardrobe.length === 0)
    return res.status(400).json({ error: 'Wardrobe is empty' });

  const tops = wardrobe.filter(i => i.category === 'Top');
  const bottoms = wardrobe.filter(i => i.category === 'Bottom');
  const dresses = wardrobe.filter(i => i.category === 'Dress');
  const outerwear = wardrobe.filter(i => i.category === 'Outerwear');
  const shoes = wardrobe.filter(i => i.category === 'Shoes');

  const pick = arr => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
  const temp = weather ? parseInt(weather.temp_c) : null;

  let weatherTip = '';
  if (temp !== null) {
    if (temp < 10) weatherTip = "It's cold today — layer up! ";
    else if (temp < 18) weatherTip = "Mild weather today — a light layer works well. ";
    else if (temp < 26) weatherTip = "Nice weather today! ";
    else weatherTip = "It's warm out — keep it light and breezy! ";
  }

  const top = pick(tops);
  const bottom = pick(bottoms);
  const dress = pick(dresses);
  const coat = pick(outerwear);
  const shoe = pick(shoes);

  let suggestion = '';
  if (dress) {
    suggestion = `${weatherTip}Try your ${dress.color} ${dress.name}`;
    if (shoe) suggestion += ` paired with your ${shoe.color} ${shoe.name}`;
    if (temp !== null && temp < 15 && coat) suggestion += `, and throw on your ${coat.color} ${coat.name} to stay warm`;
    suggestion += `. Great for a ${occasion || 'casual'} look!`;
  } else if (top && bottom) {
    suggestion = `${weatherTip}Go with your ${top.color} ${top.name} and ${bottom.color} ${bottom.name}`;
    if (shoe) suggestion += `, finished with your ${shoe.color} ${shoe.name}`;
    if (temp !== null && temp < 15 && coat) suggestion += `. Don't forget your ${coat.color} ${coat.name}!`;
    else suggestion += `. Perfect for ${occasion || 'everyday wear'}!`;
  } else if (top) {
    suggestion = `${weatherTip}Your ${top.color} ${top.name} is a great pick today!`;
    if (shoe) suggestion += ` Pair it with your ${shoe.color} ${shoe.name}.`;
  } else {
    suggestion = `${weatherTip}Mix and match what you have — you've got ${wardrobe.length} item${wardrobe.length > 1 ? 's' : ''} to work with. You've got this! 💪`;
  }

  res.json({ suggestion });
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Out→Fit server running on port ${PORT}`));
