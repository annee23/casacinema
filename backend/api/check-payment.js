// 결제 상태 확인 API 구현
const jwt = require('jsonwebtoken');
const paymentStore = require('../store/payments');
const userStore = require('../store/users');

// JWT 서명 키
const JWT_SECRET = 'cinemo-secret-key';

module.exports = (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET 메서드만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: '허용되지 않는 메서드입니다.' });
  }
  
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '인증이 필요합니다.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 토큰 검증
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: '인증 토큰이 만료되었습니다.' });
        }
        
        return res.status(401).json({ success: false, message: '유효하지 않은 인증 토큰입니다.' });
      }
      
      // 사용자 결제 정보 확인 (메모리 기반 저장소 사용)
      const hasPayment = paymentStore.checkUserPayment(decoded.userId);
      
      return res.status(200).json({
        success: true,
        message: '결제 상태 확인 완료',
        hasPayment,
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name
        }
      });
    });
  } catch (error) {
    console.error('결제 상태 확인 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 