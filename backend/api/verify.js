// 토큰 검증 API 구현
const userStore = require('../store/users');

module.exports = async (req, res) => {
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
      return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 토큰 검증
    const decoded = await userStore.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: '유효하지 않은 인증 토큰입니다.' });
    }
    
    // 토큰이 유효한 경우
    return res.status(200).json({
      success: true,
      message: '유효한 인증 토큰입니다.',
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name
      }
    });
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 