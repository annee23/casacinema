const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB URI - 환경 변수에서 가져오기
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://admin:adminPassword@cluster0.mongodb.net/casacinema?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // 오류 발생시 메시지 출력
    console.log('데이터베이스 연결에 실패했습니다. 일부 기능이 작동하지 않을 수 있습니다.');
    return null;
  }
};

module.exports = connectDB; 