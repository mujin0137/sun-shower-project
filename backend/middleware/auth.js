const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT 시크릿 키 (환경변수에서 가져오거나 기본값 사용)
const JWT_SECRET = process.env.JWT_SECRET || "sun-shower-secret-key-2024";

// JWT 토큰 생성
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d", // 7일간 유효
  });
};

// 인증 미들웨어
const protect = async (req, res, next) => {
  let token;

  // Authorization 헤더에서 토큰 확인
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 쿠키에서 토큰 확인
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 토큰이 없으면 에러
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "로그인이 필요합니다.",
    });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);

    // 사용자 정보 조회 (비밀번호 제외)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    next();
  } catch (error) {
    console.error("토큰 검증 오류:", error.message);
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

module.exports = { protect, generateToken };
