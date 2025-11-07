const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, generateToken } = require("../middleware/auth");

// 회원가입
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 항목 확인
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    // 이미 존재하는 사용자 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "이미 가입된 이메일입니다.",
      });
    }

    // 사용자 생성
    const user = await User.create({
      email,
      password,
    });

    // JWT 토큰 생성
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      token,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({
      success: false,
      message: "회원가입 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 항목 확인
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    // 사용자 찾기 (비밀번호 포함)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    // 비밀번호 확인
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    // JWT 토큰 생성
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "로그인 성공",
      token,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({
      success: false,
      message: "로그인 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  // 클라이언트에서 토큰을 삭제하도록 응답
  res.json({
    success: true,
    message: "로그아웃 되었습니다.",
  });
});

// 현재 사용자 정보 조회 (인증 필요)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "사용자 정보를 가져오는 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

module.exports = router;
