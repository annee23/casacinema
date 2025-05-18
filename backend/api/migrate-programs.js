// 프로그램 마이그레이션 API 구현
const migrationTool = require('../models/Migration');
const userStore = require('../store/users');

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
    
    // 토큰 검증
    const decoded = await userStore.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: '유효하지 않은 인증 토큰입니다.' });
    }
    
    // 프로그램 마이그레이션 실행
    const result = await migrationTool.migratePrograms();
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: `${result.count}개의 프로그램이 성공적으로 마이그레이션되었습니다.`
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: '마이그레이션 중 오류가 발생했습니다.', 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('마이그레이션 API 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 