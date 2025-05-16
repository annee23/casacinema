/**
 * MongoDB 기반 결제 정보 저장소 구현
 */
const Payment = require('../models/Payment');
const connectDB = require('../config/db');

// 새 결제 정보 추가
const addPayment = async (paymentData) => {
  try {
    await connectDB();
    const newPayment = new Payment({
      userId: paymentData.userId,
      paymentName: paymentData.paymentName,
      amount: paymentData.amount,
      program: paymentData.program,
      status: 'completed'
    });
    
    const savedPayment = await newPayment.save();
    return {
      id: savedPayment._id,
      userId: savedPayment.userId,
      paymentName: savedPayment.paymentName,
      amount: savedPayment.amount,
      program: savedPayment.program,
      date: savedPayment.createdAt
    };
  } catch (error) {
    console.error('결제 정보 추가 오류:', error);
    return null;
  }
};

// 사용자 ID로 결제 정보 확인
const checkUserPayment = async (userId) => {
  try {
    await connectDB();
    const payment = await Payment.findOne({ userId });
    return !!payment;
  } catch (error) {
    console.error('결제 정보 확인 오류:', error);
    return false;
  }
};

// 사용자 ID로 결제 정보 조회
const getPaymentsByUserId = async (userId) => {
  try {
    await connectDB();
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    
    return payments.map(payment => ({
      id: payment._id,
      userId: payment.userId,
      paymentName: payment.paymentName,
      amount: payment.amount,
      program: payment.program,
      date: payment.createdAt,
      status: payment.status
    }));
  } catch (error) {
    console.error('결제 정보 조회 오류:', error);
    return [];
  }
};

// 모듈 내보내기
module.exports = {
  addPayment,
  checkUserPayment,
  getPaymentsByUserId
}; 