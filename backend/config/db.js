const mongoose = require('mongoose');

// MongoDB 연결 상태 추적
let isConnected = false;

const connectDB = async () => {
  // 이미 연결되어 있는 경우, 기존 연결 재사용
  if (isConnected) {
    console.log('MongoDB 기존 연결 사용 중');
    return;
  }

  try {
    // MongoDB URI - 환경 변수에서 가져오기
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI가 설정되지 않았습니다.');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
      socketTimeoutMS: 45000, // 소켓 타임아웃
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB 연결 오류: ${error.message}`);
    // Vercel 서버리스 환경에서는 에러를 던지지 않고 로그만 남김
    if (process.env.NODE_ENV === 'production') {
      console.log('배포 환경에서는 DB 연결 실패에도 서비스 계속 제공');
      return null;
    }
    
    // 개발 환경에서는 1초 후 재시도
    console.log('1초 후 MongoDB 연결 재시도...');
    setTimeout(() => {
      connectDB().catch(err => console.error('재연결 실패:', err));
    }, 1000);
    
    return null;
  }
};

module.exports = connectDB; 