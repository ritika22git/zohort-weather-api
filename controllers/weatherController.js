const fetchWithRetry = require("../utils/fetchWithRetry");

const cache = new Map(); // In-memory cache
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

exports.getWeather = async (req, res, next) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: "City query param is required" });
    }

    // Check cache
    const cached = cache.get(city.toLowerCase());
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("Serving from cache");
      return res.json({ source: "cache", data: cached.data });
    }

    // Fetch from API (mocking OpenWeatherMap here)
    const API_KEY = "demo"; // replace with real OpenWeatherMap key if available
    const url = `https://api.open-meteo.com/v1/forecast?latitude=20&longitude=77&current_weather=true`;

    const response = await fetchWithRetry(url);
    const data = await response.json();

    // Save in cache
    cache.set(city.toLowerCase(), { data, timestamp: Date.now() });

    res.json({ source: "api", data });
  } catch (err) {
     console.error("Weather API error:", err.message || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.healthCheck = (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
};
