// 간단한 회원가입 API 구현
const fs = require('fs');
const path = require('path');

// 사용자 데이터 저장 파일 경로
const dataFilePath = path.join(__dirname, '..', 'users.csv');

// 사용자 데이터 저장 함수
const saveUser = (user) => {
  // CSV 형식으로 저장 (id,name,email,password)
  const userData = `${Date.now()},${user.name},${user.email},${user.password}\n`;
  
  // 파일에 추가 (없으면 생성)
  try {
    // 파일이 존재하는지 확인
    if (!fs.existsSync(dataFilePath)) {
      // 헤더 추가
      fs.writeFileSync(dataFilePath, 'id,name,email,password\n');
    }
    
    // 사용자 데이터 추가
    fs.appendFileSync(dataFilePath, userData);
    return true;
  } catch (error) {
    console.error('사용자 저장 오류:', error);
    return false;
  }
};

// 이메일 중복 확인 함수
const isEmailExists = (email) => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return false;
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const lines = data.split('\n');
    
    // 첫 번째 줄은 헤더이므로 건너뜀
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const fields = lines[i].split(',');
      if (fields[2] === email) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    return false;
  }
};

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
    if (isEmailExists(email)) {
      return res.status(409).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
    }
    
    // 사용자 저장
    const saveResult = saveUser({ name, email, password });
    
    if (saveResult) {
      return res.status(201).json({ success: true, message: '회원가입이 완료되었습니다.' });
    } else {
      return res.status(500).json({ success: false, message: '사용자 정보 저장 중 오류가 발생했습니다.' });
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
}; 