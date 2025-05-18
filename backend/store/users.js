/**
 * MongoDB 기반 사용자 저장소 구현
 */
const User = require('../models/User');
const connectDB = require('../config/db');
const jwt = require('jsonwebtoken');

// JWT 비밀 키
const JWT_SECRET = 'cinemo-secret-key';

// 이메일이 이미 존재하는지 확인
const isEmailExists = async (email) => {
  try {
    await connectDB();
    const user = await User.findOne({ email });
    return !!user;
  } catch (error) {
    console.error('이메일 조회 오류:', error);
    return false;
  }
};

// 새 사용자 추가
const addUser = async (userData) => {
  try {
    await connectDB();
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    const savedUser = await newUser.save();
    return {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email
    };
  } catch (error) {
    console.error('사용자 추가 오류:', error);
    return null;
  }
};

// 이메일과 비밀번호로 사용자 찾기 (로그인용)
const findUserByCredentials = async (email, password) => {
  try {
    await connectDB();
    const user = await User.findOne({ email });
    
    if (!user) {
      return null;
    }
    
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return null;
    }
    
    return {
      id: user._id,
      name: user.name,
      email: user.email
    };
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return null;
  }
};

// 사용자 ID로 사용자 찾기
const findUserById = async (id) => {
  try {
    await connectDB();
    const user = await User.findById(id);
    
    if (!user) {
      return null;
    }
    
    return {
      id: user._id,
      name: user.name,
      email: user.email
    };
  } catch (error) {
    console.error('사용자 ID 조회 오류:', error);
    return null;
  }
};

// JWT 토큰 검증
const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      name: user.name,
      email: user.email
    };
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return null;
  }
};

// 토큰 생성
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 모듈 내보내기
module.exports = {
  isEmailExists,
  addUser,
  findUserByCredentials,
  findUserById,
  verifyToken,
  generateToken
}; 