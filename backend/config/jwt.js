const jwt = require('jsonwebtoken');

// JWT 시크릿 키 설정
const JWT_SECRET = process.env.JWT_SECRET;

// 시크릿 키가 없을 경우 경고 출력
if (!JWT_SECRET) {
  console.warn('경고: JWT_SECRET 환경 변수가 설정되지 않았습니다. 보안에 취약할 수 있습니다.');
}

// 토큰 만료 시간 (환경 변수에서 가져오거나 기본값 사용)
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '7d';

/**
 * 사용자 ID로 JWT 토큰 생성
 * @param {string} userId - 사용자 ID
 * @returns {string} JWT 토큰
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET || 'fallback_secret_key', {
    expiresIn: TOKEN_EXPIRE,
  });
};

/**
 * JWT 토큰 검증
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Object} 검증 결과 객체
 */
const verifyToken = (token) => {
  try {
    if (!token) {
      return { success: false, message: '토큰이 제공되지 않았습니다.' };
    }
    
    const decoded = jwt.verify(token, JWT_SECRET || 'fallback_secret_key');
    return { success: true, data: decoded };
  } catch (error) {
    // 토큰 오류 유형에 따른 메시지 설정
    let message = '유효하지 않은 토큰입니다.';
    
    if (error.name === 'TokenExpiredError') {
      message = '토큰이 만료되었습니다. 다시 로그인해주세요.';
    } else if (error.name === 'JsonWebTokenError') {
      message = '잘못된 형식의 토큰입니다.';
    }
    
    return { success: false, message };
  }
};

module.exports = { generateToken, verifyToken }; 