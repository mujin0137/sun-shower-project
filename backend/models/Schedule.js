const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  tripPlan: {
    type: String,
    enum: ['여행일정 1', '여행일정 2', '여행일정 3'],
    default: '여행일정 1'
  },
  scheduleName: {
    type: String,
    required: true
  },
  scheduleDate: {
    type: String, // YYYY-MM-DD 형식
    required: true,
    index: true
  },
  startTime: {
    type: String, // HH:00 형식
    required: true
  },
  endTime: {
    type: String, // HH:00 형식
    required: false
  },
  scheduleContent: {
    type: String
  },
  placeType: {
    type: String,
    enum: ['식당', '카페', '숙소', '상가', '아케이드', '교통', '']
  },
  placeName: {
    type: String
  },
  contact: {
    type: String
  },
  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 사용자 + 날짜별로 조회를 위한 복합 인덱스
scheduleSchema.index({ userId: 1, scheduleDate: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);

