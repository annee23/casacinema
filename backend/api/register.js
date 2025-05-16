// 간단한 회원가입 API 구현
const userStore = require('../store/users');

module.exports = (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // POST 메서드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '허용되지 않는 메서드입니다.' });
  }
  
  try {
    const { name, email, password } = req.body;
    
    // 필수 필드 검증
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: '유효한 이메일 주소를 입력해주세요.' });
    }
    
    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }
    
    // 이메일 중복 확인
    if (userStore.isEmailExists(email)) {
      return res.status(409).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
    }
    
    // 사용자 저장
    const user = userStore.addUser({ name, email, password });
    
    if (user) {
      return res.status(201).json({ 
        success: true, 
        message: '회원가입이 완료되었습니다.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      return res.status(500).json({ success: false, message: '사용자 정보 저장 중 오류가 발생했습니다.' });
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 