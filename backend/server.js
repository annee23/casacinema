const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// 환경 변수 설정
dotenv.config();

// 데이터베이스 연결
connectDB();

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// API 라우트
app.use('/api/auth', authRoutes);

// 정적 파일 제공 (프론트엔드 배포용)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 