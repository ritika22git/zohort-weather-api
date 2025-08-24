const express = require("express");
const { getWeather, healthCheck } = require("../controllers/weatherController");

const router = express.Router();

router.get("/weather", getWeather);
router.get("/health", healthCheck);

module.exports = router;
