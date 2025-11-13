const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
  // 공유 링크의 고유 코드 (예: abc123xyz)
  shareCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // 공유한 사용자 ID
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  // 공유할 여행 플랜 (여행일정 1, 여행일정 2, 여행일정 3)
  tripPlan: {
    type: String,
    required: true
  },
  // 여행 제목 (선택)
  tripTitle: {
    type: String,
    default: ''
  },
  // 공유 링크 만료일 (선택, null이면 무제한)
  expiresAt: {
    type: Date,
    default: null
  },
  // 조회수
  viewCount: {
    type: Number,
    default: 0
  },
  // 생성일
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 사용자별 공유 링크 조회를 위한 인덱스
shareLinkSchema.index({ userId: 1, tripPlan: 1 });

module.exports = mongoose.model('ShareLink', shareLinkSchema);
