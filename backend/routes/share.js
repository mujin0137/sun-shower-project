const express = require('express');
const router = express.Router();
const ShareLink = require('../models/ShareLink');
const Schedule = require('../models/Schedule');
const { verifyToken } = require('../middleware/auth');
const crypto = require('crypto');

// 고유한 공유 코드 생성 함수
const generateShareCode = () => {
  return crypto.randomBytes(6).toString('hex'); // 12자리 랜덤 코드
};

// 공유 링크 생성
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { tripPlan, tripTitle, expiresInDays } = req.body;
    const userId = req.user.userId;

    // 이미 해당 tripPlan에 대한 공유 링크가 있는지 확인
    let shareLink = await ShareLink.findOne({ userId, tripPlan });

    if (shareLink) {
      // 이미 존재하면 기존 링크 반환
      return res.json({
        success: true,
        shareLink: {
          shareCode: shareLink.shareCode,
          url: `${req.protocol}://${req.get('host')}/shared/${shareLink.shareCode}`,
          tripPlan: shareLink.tripPlan,
          tripTitle: shareLink.tripTitle,
          createdAt: shareLink.createdAt,
          expiresAt: shareLink.expiresAt,
          viewCount: shareLink.viewCount
        }
      });
    }

    // 새로운 공유 링크 생성
    const shareCode = generateShareCode();

    // 만료일 설정 (선택)
    let expiresAt = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    shareLink = new ShareLink({
      shareCode,
      userId,
      tripPlan,
      tripTitle: tripTitle || tripPlan,
      expiresAt
    });

    await shareLink.save();

    res.json({
      success: true,
      shareLink: {
        shareCode: shareLink.shareCode,
        url: `${req.protocol}://${req.get('host')}/shared/${shareLink.shareCode}`,
        tripPlan: shareLink.tripPlan,
        tripTitle: shareLink.tripTitle,
        createdAt: shareLink.createdAt,
        expiresAt: shareLink.expiresAt,
        viewCount: shareLink.viewCount
      }
    });
  } catch (error) {
    console.error('공유 링크 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '공유 링크 생성에 실패했습니다'
    });
  }
});

// 공유 링크로 일정 조회 (인증 불필요)
router.get('/:shareCode', async (req, res) => {
  try {
    const { shareCode } = req.params;

    // 공유 링크 찾기
    const shareLink = await ShareLink.findOne({ shareCode });

    if (!shareLink) {
      return res.status(404).json({
        success: false,
        message: '공유 링크를 찾을 수 없습니다'
      });
    }

    // 만료 확인
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return res.status(410).json({
        success: false,
        message: '만료된 공유 링크입니다'
      });
    }

    // 조회수 증가
    shareLink.viewCount += 1;
    await shareLink.save();

    // 해당 tripPlan의 모든 일정 조회
    const schedules = await Schedule.find({
      userId: shareLink.userId,
      tripPlan: shareLink.tripPlan
    }).sort({ scheduleDate: 1, startTime: 1 });

    res.json({
      success: true,
      shareInfo: {
        tripPlan: shareLink.tripPlan,
        tripTitle: shareLink.tripTitle,
        createdAt: shareLink.createdAt,
        viewCount: shareLink.viewCount
      },
      schedules
    });
  } catch (error) {
    console.error('공유 일정 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정을 불러오는데 실패했습니다'
    });
  }
});

// 내가 생성한 공유 링크 목록 조회
router.get('/my/links', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const shareLinks = await ShareLink.find({ userId }).sort({ createdAt: -1 });

    const links = shareLinks.map(link => ({
      shareCode: link.shareCode,
      url: `${req.protocol}://${req.get('host')}/shared/${link.shareCode}`,
      tripPlan: link.tripPlan,
      tripTitle: link.tripTitle,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      viewCount: link.viewCount
    }));

    res.json({
      success: true,
      shareLinks: links
    });
  } catch (error) {
    console.error('공유 링크 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '공유 링크 목록을 불러오는데 실패했습니다'
    });
  }
});

// 공유 링크 삭제
router.delete('/:shareCode', verifyToken, async (req, res) => {
  try {
    const { shareCode } = req.params;
    const userId = req.user.userId;

    const shareLink = await ShareLink.findOne({ shareCode, userId });

    if (!shareLink) {
      return res.status(404).json({
        success: false,
        message: '공유 링크를 찾을 수 없습니다'
      });
    }

    await ShareLink.deleteOne({ _id: shareLink._id });

    res.json({
      success: true,
      message: '공유 링크가 삭제되었습니다'
    });
  } catch (error) {
    console.error('공유 링크 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '공유 링크 삭제에 실패했습니다'
    });
  }
});

module.exports = router;
