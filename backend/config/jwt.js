const jwt = require('jsonwebtoken');

// 기본 JWT 시크릿 키 설정 (없는 경우 대비)
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_for_development';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { generateToken, verifyToken }; 