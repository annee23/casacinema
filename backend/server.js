const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// API 핸들러 모듈 불러오기
const loginHandler = require('./api/login');
const registerHandler = require('./api/register');
const verifyHandler = require('./api/verify');
const paymentHandler = require('./api/payment');
const checkPaymentHandler = require('./api/check-payment');

// Express 애플리케이션 생성
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API 엔드포인트 설정
app.post('/api/login', loginHandler);
app.post('/api/register', registerHandler);
app.get('/api/verify', verifyHandler);
app.post('/api/payment', paymentHandler);
app.get('/api/check-payment', checkPaymentHandler);

// 루트 경로 요청 처리
app.get('/', (req, res) => {
  res.send('CINE\'MO API 서버가 실행 중입니다.');
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
}); 