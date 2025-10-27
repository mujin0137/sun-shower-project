const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`⚠️  MongoDB 연결 실패: ${error.message}`);
    console.log(`⚠️  즐겨찾기 기능은 사용할 수 없지만 서버는 계속 실행됩니다`);
    // process.exit(1)을 제거하여 서버가 계속 실행되도록 함
  }
};

module.exports = connectDB;
