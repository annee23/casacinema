// 프로그램 목록 조회 API 구현
const programStore = require('../store/programs');

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET 메서드만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: '허용되지 않는 메서드입니다.' });
  }
  
  try {
    // 모든 프로그램 가져오기
    const programs = await programStore.getAllPrograms();
    
    return res.status(200).json({ 
      success: true, 
      programs
    });
  } catch (error) {
    console.error('프로그램 목록 조회 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 