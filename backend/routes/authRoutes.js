const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, verifyToken } = require('../config/jwt');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 사용자 이메일 중복 체크
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
    }

    // 새 사용자 생성
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // 토큰 생성
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } else {
      res.status(400).json({ success: false, message: '유효하지 않은 사용자 데이터입니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일로 사용자 찾기
    const user = await User.findOne({ email });

    // 사용자가 존재하고 비밀번호가 일치하는 경우
    if (user && (await user.matchPassword(password))) {
      // 토큰 생성
      const token = generateToken(user._id);

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } else {
      res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token and return user data
// @access  Private
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN 형식에서 TOKEN 추출

    if (!token) {
      return res.status(401).json({ success: false, message: '인증 토큰이 없습니다.' });
    }

    // 토큰 검증
    const decoded = verifyToken(token);

    if (!decoded.success) {
      return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다.' });
    }

    // 사용자 정보 조회
    const user = await User.findById(decoded.data.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 