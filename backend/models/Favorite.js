const mongoose = require("mongoose");

// 즐겨찾는 장소 스키마
const favoriteSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["location", "route"],
    required: true,
  },
  // 장소 정보
  name: {
    type: String,
    required: true,
  },
  address: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  // 경로 정보 (type이 'route'일 때)
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
  // 메타데이터
  category: {
    type: String,
    enum: ["home", "work", "school", "favorite", "other"],
    default: "other",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Favorite", favoriteSchema);


