const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config();

// MongoDB 연결
const connectDB = require('./config/db');
connectDB();

// 인증 라우트 모듈 불러오기
const authRoutes = require('./routes/authRoutes');

// Express 애플리케이션 생성
const app = express();

// 보안 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(mongoSanitize()); // NoSQL 인젝션 방지

// API 요청 속도 제한
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 최대 요청 수
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 기본 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression()); // 응답 압축

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../')));

// API 라우트 설정
app.use('/api', authRoutes);

// 모든 GET 요청에 대해 index.html 전송 (SPA 지원)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 404 에러 처리
app.use((req, res) => {
  res.status(404).json({ success: false, message: '요청한 API 엔드포인트를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
});

// 서버 포트 설정 및 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT}`);
}); 