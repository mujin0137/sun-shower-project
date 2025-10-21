const express = require("express");
const router = express.Router();
const transportationService = require("../services/transportationService");
const SearchHistory = require("../models/SearchHistory");

// 길찾기 - 경로 검색
router.get("/directions", async (req, res) => {
  try {
    const { origin, destination, mode } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        error: "origin과 destination 파라미터가 필요합니다.",
        example:
          "/api/transportation/directions?origin=서울역&destination=강남역&mode=transit",
      });
    }

    const directions = await transportationService.getDirections({
      origin,
      destination,
      mode: mode || "transit", // transit, driving, walking
    });

    // 검색 기록 저장
    await SearchHistory.create({
      type: "transportation",
      route: {
        origin: {
          name: origin,
          address: directions.routes[0]?.summary?.origin?.name || origin,
        },
        destination: {
          name: destination,
          address:
            directions.routes[0]?.summary?.destination?.name || destination,
        },
      },
    });

    res.json(directions);
  } catch (error) {
    console.error("길찾기 오류:", error);
    res.status(500).json({
      error: "경로 정보를 가져오는데 실패했습니다.",
      message: error.message,
    });
  }
});

// 좌표로 길찾기
router.get("/directions/coordinates", async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng, mode } = req.query;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({
        error: "출발지와 도착지의 위도/경도가 필요합니다.",
        required: ["startLat", "startLng", "endLat", "endLng"],
      });
    }

    const directions = await transportationService.getDirectionsByCoordinates({
      start: { lat: parseFloat(startLat), lng: parseFloat(startLng) },
      end: { lat: parseFloat(endLat), lng: parseFloat(endLng) },
      mode: mode || "transit",
    });

    res.json(directions);
  } catch (error) {
    console.error("좌표 길찾기 오류:", error);
    res.status(500).json({
      error: "경로 정보를 가져오는데 실패했습니다.",
      message: error.message,
    });
  }
});

// 주소 검색 (자동완성용)
router.get("/search", async (req, res) => {
  console.log("🚀 /search 라우터 진입!");
  console.log("📝 받은 쿼리:", req.query);

  try {
    const { query } = req.query;

    if (!query) {
      console.log("❌ query 파라미터 없음");
      return res.status(400).json({
        error: "query 파라미터가 필요합니다.",
      });
    }

    console.log("✅ transportationService.searchPlaces 호출 시작");
    const results = await transportationService.searchPlaces(query);
    console.log("✅ 결과 받음:", results);
    res.json(results);
  } catch (error) {
    console.error("❌ 주소 검색 오류:", error);
    res.status(500).json({
      error: "주소 검색에 실패했습니다.",
      message: error.message,
    });
  }
});

module.exports = router;
