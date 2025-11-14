const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
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
console.log(
  "- ODSAY_API_KEY:",
  process.env.ODSAY_API_KEY ? "설정됨" : "❌ 없음"
);
console.log(
  "- NAVER_CLIENT_ID:",
  process.env.NAVER_CLIENT_ID ? "설정됨" : "❌ 없음"
);
console.log(
  "- NAVER_CLIENT_SECRET:",
  process.env.NAVER_CLIENT_SECRET ? "설정됨" : "❌ 없음"
);
console.log("");

// Express 앱 초기화
const app = express();

// 미들웨어
app.use(
  cors({
    origin: true, // 모든 origin 허용 (개발용)
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 모든 요청 로깅 (디버깅용)
app.use((req, res, next) => {
  console.log(`\n📨 요청 받음: ${req.method} ${req.path}`);
  console.log(`📝 Query:`, req.query);
  next();
});

// MongoDB 연결 (선택적)
connectDB().catch((err) => {
  console.log("⚠️  MongoDB 연결 실패 - 즐겨찾기 기능은 사용할 수 없습니다");
  console.log("⚠️  날씨/교통 기능은 정상 작동합니다");
});

// 라우트
app.use("/api/auth", require("./routes/auth"));
app.use("/api/weather", require("./routes/weather"));
app.use("/api/transportation", require("./routes/transportation"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/share", require("./routes/share"));

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
    error: "머가 문제냐",
    message: err.message,
  });
});

// 서버 시작
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 가보자 가보자~ ${PORT}`);
  console.log(`🌐 로컬: http://localhost:${PORT}`);
  console.log(`🌐 네트워크: http://192.168.4.218:${PORT}`);
});
