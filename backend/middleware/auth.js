const jwt = require('jsonwebtoken');

// 토큰 생성 함수
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// 인증 미들웨어 (protect 별칭)
const protect = (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 없습니다.'
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = { id: decoded.userId, userId: decoded.userId };
    next();
  } catch (error) {
    console.error('인증 오류:', error);
    res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.'
    });
  }
};

// auth는 protect의 별칭
const auth = protect;

module.exports = auth;
module.exports.protect = protect;
module.exports.generateToken = generateToken;
module.exports.auth = auth;
module.exports.verifyToken = protect;
