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

// Vercel 서버리스 환경 확인
const isVercel = process.env.VERCEL === '1';

// 환경 변수 로깅
console.log('환경 변수 상태:', {
  NODE_ENV: process.env.NODE_ENV || '설정되지 않음',
  VERCEL: process.env.VERCEL || '설정되지 않음',
  MONGODB_URI: process.env.MONGODB_URI ? '설정됨' : '설정되지 않음',
  JWT_SECRET: process.env.JWT_SECRET ? '설정됨' : '설정되지 않음'
});

// MongoDB 연결
const connectDB = require('./config/db');
// Vercel 배포시 DB 연결 실패해도 앱은 실행되도록 비동기로 처리
connectDB().catch(err => console.error('MongoDB 연결 오류:', err));

// 인증 라우트 모듈 불러오기
const authRoutes = require('./routes/authRoutes');

// 기본 미들웨어 설정 (CORS를 먼저 설정)
app.use(cors({
  origin: '*', // 모든 출처 허용 (개발 및 테스트용)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// CORS 프리플라이트 요청 처리
app.options('*', cors());

// 보안 미들웨어 설정
app.use(helmet({ 
  contentSecurityPolicy: false // 개발 단계에서는 CSP 비활성화
}));
app.use(mongoSanitize()); // NoSQL 인젝션 방지

// API 요청 속도 제한
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 1000, // 개발 테스트용으로 높게 설정
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' }
});
app.use('/api', limiter);

// 기본 미들웨어 설정
app.use(express.json({ limit: '1mb' })); // 요청 바디 크기 제한
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('dev')); // 항상 개발 로그 형식 사용
app.use(compression()); // 응답 압축

// 정적 파일 제공 - 루트 디렉토리로 변경
app.use(express.static(path.join(__dirname, '..')));

// 상태 확인 엔드포인트 (인증 불필요)
app.get('/api/health', (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  res.status(200).json({
    success: true,
    message: 'CasaCinema API가 정상 작동 중입니다.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API 라우트 설정
app.use('/api/auth', authRoutes);

// 프로그램 API 라우트
app.get('/api/programs', (req, res) => {
  res.json({
    success: true,
    programs: [
      {
        id: 1,
        name: '해피엔드',
        time: '8:30 PM ~ 10:00 PM',
        location: '신도림 롯데시네마',
        imageUrl: 'images/test.png'
      },
      {
        id: 2,
        name: '그 자연이 네게 뭐라고 하니',
        time: '7:30 PM ~ 9:30 PM',
        location: '아트하우스 모모',
        imageUrl: 'images/test2.png'
      },
      {
        id: 3,
        name: '상상마당',
        time: '8:00 PM ~ 9:00 PM',
        location: '상상마당 홍대',
        imageUrl: 'images/test3.png'
      },
      {
        id: 4,
        name: '아멜리에',
        time: '9:50 AM ~ 11:50 AM',
        location: '에무시네마',
        imageUrl: 'images/test4.png'
      }
    ]
  });
});

// 디버그 엔드포인트
app.get('/api/debug', (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  res.json({
    headers: req.headers,
    env: {
      NODE_ENV: process.env.NODE_ENV || '설정되지 않음',
      VERCEL: process.env.VERCEL || '설정되지 않음',
      MONGODB_URI: process.env.MONGODB_URI ? '설정됨' : '설정되지 않음',
      JWT_SECRET: process.env.JWT_SECRET ? '설정됨' : '설정되지 않음'
    }
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
  console.error('서버 오류:', err);
  
  // MongoDB 연결 오류 처리
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(503).json({ 
      success: false, 
      message: '데이터베이스 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.' 
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined
  });
});

// 서버 포트 설정 및 시작
const PORT = process.env.PORT || 3000;

// Vercel 서버리스 환경이 아닌 경우에만 listen
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT}`);
  });
}

// Vercel 서버리스 환경을 위한 export
module.exports = app; 