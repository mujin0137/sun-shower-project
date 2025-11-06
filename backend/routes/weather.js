const express = require("express");
const router = express.Router();
const weatherService = require("../services/weatherService");
const SearchHistory = require("../models/SearchHistory");
const mongoose = require("mongoose");

// 현재 날씨 조회
router.get("/current", async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat && !lon && !city) {
      return res.status(400).json({
        error: "lat, lon 또는 city 파라미터가 필요합니다.",
      });
    }

    const weatherData = await weatherService.getCurrentWeather({
      lat,
      lon,
      city,
    });

    // 검색 기록 저장 (MongoDB 연결되어 있을 때만)
    if (mongoose.connection.readyState === 1) {
      try {
    await SearchHistory.create({
      type: "weather",
      location: {
        name: city || weatherData.location.name,
        coordinates: {
          lat: lat || weatherData.location.coordinates.lat,
          lng: lon || weatherData.location.coordinates.lng,
        },
      },
    });
      } catch (dbError) {
        console.log("⚠️  검색 기록 저장 실패 (무시됨):", dbError.message);
      }
    }

    res.json(weatherData);
  } catch (error) {
    console.error("날씨 조회 오류:", error);
    res.status(500).json({
      error: "날씨 정보를 가져오는데 실패했습니다.",
      message: error.message,
    });
  }
});

// 5일 예보 조회
router.get("/forecast", async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat && !lon && !city) {
      return res.status(400).json({
        error: "lat, lon 또는 city 파라미터가 필요합니다.",
      });
    }

    const forecastData = await weatherService.getForecast({ lat, lon, city });
    res.json(forecastData);
  } catch (error) {
    console.error("예보 조회 오류:", error);
    res.status(500).json({
      error: "날씨 예보를 가져오는데 실패했습니다.",
      message: error.message,
    });
  }
});

// 여러 도시 날씨 한번에 조회
router.post("/multiple", async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({
        error: "cities 배열이 필요합니다.",
      });
    }

    const weatherPromises = cities.map((city) =>
      weatherService.getCurrentWeather({ city })
    );

    const weatherData = await Promise.all(weatherPromises);
    res.json(weatherData);
  } catch (error) {
    console.error("다중 날씨 조회 오류:", error);
    res.status(500).json({
      error: "날씨 정보를 가져오는데 실패했습니다.",
      message: error.message,
    });
  }
});

module.exports = router;
