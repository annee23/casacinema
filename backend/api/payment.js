// 결제 정보 저장 API 구현
const userStore = require('../store/users');
const paymentStore = require('../store/payments');

module.exports = async (req, res) => {
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
    const decoded = await userStore.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: '유효하지 않은 인증 토큰입니다.' });
    }
    
    // 결제 정보 저장 (MongoDB 기반 저장소 사용)
    const savedPayment = await paymentStore.addPayment({
      userId: decoded.userId,
      paymentName,
      amount,
      program
    });
    
    if (savedPayment) {
      return res.status(200).json({
        success: true,
        message: '결제 정보가 성공적으로 저장되었습니다.',
        payment: savedPayment
      });
    } else {
      return res.status(500).json({
        success: false,
        message: '결제 정보 저장 중 오류가 발생했습니다.'
      });
    }
  } catch (error) {
    console.error('결제 정보 처리 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 