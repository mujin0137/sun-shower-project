const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');

// 일정 생성
router.post('/', auth, async (req, res) => {
  try {
    const {
      tripPlan,
      scheduleName,
      scheduleDate,
      startTime,
      endTime,
      scheduleContent,
      placeType,
      placeName,
      contact,
      address
    } = req.body;

    // 필수 필드 검증
    if (!scheduleName || !scheduleDate || !startTime) {
      return res.status(400).json({
        success: false,
        message: '일정 제목, 날짜, 시작 시간은 필수입니다.'
      });
    }

    const schedule = new Schedule({
      userId: req.user.userId,
      tripPlan: tripPlan || '여행일정 1',
      scheduleName,
      scheduleDate,
      startTime,
      endTime,
      scheduleContent,
      placeType,
      placeName,
      contact,
      address
    });

    await schedule.save();

    res.status(201).json({
      success: true,
      message: '일정이 저장되었습니다.',
      schedule
    });
  } catch (error) {
    console.error('일정 저장 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정 저장 중 오류가 발생했습니다.'
    });
  }
});

// 일정 조회 (날짜별 또는 날짜 범위)
router.get('/', auth, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = { userId: req.user.userId };

    if (date) {
      // 특정 날짜의 일정 조회
      query.scheduleDate = date;
    } else if (startDate && endDate) {
      // 날짜 범위의 일정 조회
      query.scheduleDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const schedules = await Schedule.find(query).sort({ scheduleDate: 1, startTime: 1 });

    res.json({
      success: true,
      schedules
    });
  } catch (error) {
    console.error('일정 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정 조회 중 오류가 발생했습니다.'
    });
  }
});

// 일정 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: '일정을 찾을 수 없습니다.'
      });
    }

    const {
      tripPlan,
      scheduleName,
      scheduleDate,
      startTime,
      endTime,
      scheduleContent,
      placeType,
      placeName,
      contact,
      address
    } = req.body;

    // 업데이트할 필드만 변경
    if (tripPlan !== undefined) schedule.tripPlan = tripPlan;
    if (scheduleName !== undefined) schedule.scheduleName = scheduleName;
    if (scheduleDate !== undefined) schedule.scheduleDate = scheduleDate;
    if (startTime !== undefined) schedule.startTime = startTime;
    if (endTime !== undefined) schedule.endTime = endTime;
    if (scheduleContent !== undefined) schedule.scheduleContent = scheduleContent;
    if (placeType !== undefined) schedule.placeType = placeType;
    if (placeName !== undefined) schedule.placeName = placeName;
    if (contact !== undefined) schedule.contact = contact;
    if (address !== undefined) schedule.address = address;

    await schedule.save();

    res.json({
      success: true,
      message: '일정이 수정되었습니다.',
      schedule
    });
  } catch (error) {
    console.error('일정 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정 수정 중 오류가 발생했습니다.'
    });
  }
});

// 일정 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: '일정을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '일정이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('일정 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '일정 삭제 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;

