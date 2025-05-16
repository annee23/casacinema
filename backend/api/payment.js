// 결제 정보 저장 API 구현
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// JWT 서명 키
const JWT_SECRET = 'cinemo-secret-key';

// 결제 데이터 저장 파일 경로
const dataFilePath = path.join(__dirname, '..', 'payments.csv');

// 결제 정보 저장 함수
const savePayment = (payment) => {
  // CSV 형식으로 저장 (id,userId,paymentName,amount,program,timestamp)
  const paymentData = `${Date.now()},${payment.userId},${payment.paymentName},${payment.amount},${payment.program},${new Date().toISOString()}\n`;
  
  // 파일에 추가 (없으면 생성)
  try {
    // 파일이 존재하는지 확인
    if (!fs.existsSync(dataFilePath)) {
      // 헤더 추가
      fs.writeFileSync(dataFilePath, 'id,userId,paymentName,amount,program,timestamp\n');
    }
    
    // 결제 데이터 추가
    fs.appendFileSync(dataFilePath, paymentData);
    return true;
  } catch (error) {
    console.error('결제 정보 저장 오류:', error);
    return false;
  }
};

module.exports = (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // POST 메서드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '허용되지 않는 메서드입니다.' });
  }
  
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '인증이 필요합니다.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 요청 본문 확인
    const { paymentName, amount, program } = req.body;
    
    if (!paymentName || !amount || !program) {
      return res.status(400).json({ success: false, message: '필수 필드가 누락되었습니다.' });
    }
    
    // 토큰 검증
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: '인증 토큰이 만료되었습니다.' });
        }
        
        return res.status(401).json({ success: false, message: '유효하지 않은 인증 토큰입니다.' });
      }
      
      // 결제 정보 저장
      const saveResult = savePayment({
        userId: decoded.userId,
        paymentName,
        amount,
        program
      });
      
      if (saveResult) {
        return res.status(200).json({
          success: true,
          message: '결제 정보가 성공적으로 저장되었습니다.'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: '결제 정보 저장 중 오류가 발생했습니다.'
        });
      }
    });
  } catch (error) {
    console.error('결제 정보 처리 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 