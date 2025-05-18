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

// Express 애플리케이션 생성
const app = express();

// MongoDB 연결
const connectDB = require('./config/db');
// Vercel 배포시 DB 연결 실패해도 앱은 실행되도록 비동기로 처리
connectDB().catch(err => console.error('MongoDB 연결 오류:', err));

// 인증 라우트 모듈 불러오기
const authRoutes = require('./routes/authRoutes');

// 보안 미들웨어 설정
app.use(helmet({ 
  contentSecurityPolicy: false 
})); // 보안 헤더 설정
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

// 정적 파일 제공 - 루트 디렉토리로 변경
app.use(express.static(path.join(__dirname, '..')));

// API 라우트 설정
app.use('/api', authRoutes);

// 프로그램 API 라우트
app.get('/api/programs', (req, res) => {
  res.json({
    success: true,
    programs: [
      {
        name: '해피엔드',
        time: '8:30 PM ~ 10:00 PM',
        location: '신도림 롯데시네마',
        imageUrl: 'images/test.png'
      },
      {
        name: '그 자연이 네게 뭐라고 하니',
        time: '7:30 PM ~ 9:30 PM',
        location: '아트하우스 모모',
        imageUrl: 'images/test2.png'
      },
      {
        name: '상상마당',
        time: '8:00 PM ~ 9:00 PM',
        location: '상상마당 홍대',
        imageUrl: 'images/test3.png'
      },
      {
        name: '아멜리에',
        time: '9:50 AM ~ 11:50 AM',
        location: '에무시네마',
        imageUrl: 'images/test4.png'
      }
    ]
  });
});

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

// Vercel 서버리스 환경인 경우 직접 listen하지 않음
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT}`);
  });
}

// Vercel 서버리스 환경을 위한 export
module.exports = app; 