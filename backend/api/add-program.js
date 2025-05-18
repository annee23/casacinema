// 프로그램 추가 API 구현
const userStore = require('../store/users');
const programStore = require('../store/programs');

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
    
    const { name, time, location, description, imageUrl } = req.body;
    
    // 필수 필드 검증
    if (!name || !time || !location) {
      return res.status(400).json({ success: false, message: '필수 필드가 누락되었습니다.' });
    }
    
    // 프로그램 저장
    const program = await programStore.addProgram({ 
      name, 
      time, 
      location, 
      description: description || '', 
      imageUrl: imageUrl || '' 
    });
    
    if (program) {
      return res.status(201).json({ 
        success: true, 
        message: '프로그램이 성공적으로 추가되었습니다.',
        program
      });
    } else {
      return res.status(500).json({ success: false, message: '프로그램 정보 저장 중 오류가 발생했습니다.' });
    }
  } catch (error) {
    console.error('프로그램 추가 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 