const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

// 모든 즐겨찾기 조회
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const favorites = await Favorite.find(filter).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error("즐겨찾기 조회 오류:", error);
    res.status(500).json({
      error: "즐겨찾기를 불러오는데 실패했습니다.",
      message: error.message,
    });
  }
});

// 즐겨찾기 추가
router.post("/", async (req, res) => {
  try {
    const favorite = new Favorite(req.body);
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error("즐겨찾기 추가 오류:", error);
    res.status(500).json({
      error: "즐겨찾기 추가에 실패했습니다.",
      message: error.message,
    });
  }
});

// 즐겨찾기 삭제
router.delete("/:id", async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);

    if (!favorite) {
      return res.status(404).json({ error: "즐겨찾기를 찾을 수 없습니다." });
    }

    res.json({ message: "삭제되었습니다.", favorite });
  } catch (error) {
    console.error("즐겨찾기 삭제 오류:", error);
    res.status(500).json({
      error: "즐겨찾기 삭제에 실패했습니다.",
      message: error.message,
    });
  }
});

// 즐겨찾기 수정
router.put("/:id", async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!favorite) {
      return res.status(404).json({ error: "즐겨찾기를 찾을 수 없습니다." });
    }

    res.json(favorite);
  } catch (error) {
    console.error("즐겨찾기 수정 오류:", error);
    res.status(500).json({
      error: "즐겨찾기 수정에 실패했습니다.",
      message: error.message,
    });
  }
});

module.exports = router;


