const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// 환경 변수 로드
dotenv.config();

// 환경 변수 확인 (디버깅용)
console.log("📋 환경 변수 확인:");
console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "설정됨" : "❌ 없음");
console.log("- PORT:", process.env.PORT || "기본값 5000");
console.log(
  "- OPENWEATHER_API_KEY:",
  process.env.OPENWEATHER_API_KEY ? "설정됨" : "❌ 없음"
);
console.log(
  "- KAKAO_REST_API_KEY:",
  process.env.KAKAO_REST_API_KEY ? "설정됨" : "❌ 없음"
);
console.log("");

// Express 앱 초기화
const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 모든 요청 로깅 (디버깅용)
app.use((req, res, next) => {
  console.log(`\n📨 요청 받음: ${req.method} ${req.path}`);
  console.log(`📝 Query:`, req.query);
  next();
});

// MongoDB 연결
connectDB();

// 라우트
app.use("/api/weather", require("./routes/weather"));
app.use("/api/transportation", require("./routes/transportation"));
app.use("/api/favorites", require("./routes/favorites"));

// 기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "Sun Shower API Server",
    version: "1.0.0",
    endpoints: {
      weather: "/api/weather",
      transportation: "/api/transportation",
      favorites: "/api/favorites",
    },
  });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
