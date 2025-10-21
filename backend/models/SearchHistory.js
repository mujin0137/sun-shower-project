const mongoose = require("mongoose");

// 검색 기록 스키마
const searchHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["weather", "transportation"],
    required: true,
  },
  // 날씨 검색
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  // 길찾기 검색
  route: {
    origin: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    destination: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

// 최근 30일 이후 자동 삭제 (선택사항)
searchHistorySchema.index({ searchedAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);


