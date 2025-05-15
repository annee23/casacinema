const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB URI가 없는 경우 연결하지 않고 메시지만 출력
    if (!process.env.MONGO_URI) {
      console.log('MongoDB URI가 설정되지 않았습니다. 연결을 건너뜁니다.');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // 서버 종료 대신 로그만 출력
    console.log('데이터베이스 연결에 실패했습니다. 일부 기능이 작동하지 않을 수 있습니다.');
  }
};

module.exports = connectDB; 