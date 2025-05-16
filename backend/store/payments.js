/**
 * 메모리 기반 결제 정보 저장소 구현
 * 서버리스 환경에서 사용하기 위한 인메모리 DB
 */

// 인메모리 결제 정보 저장소
const payments = [];

// 다음 결제 ID (자동 증가)
let nextId = 1;

/**
 * 새 결제 정보 추가
 * @param {object} paymentData - 결제 정보 데이터
 * @returns {object|null} 추가된 결제 정보 객체 또는 실패 시 null
 */
const addPayment = (paymentData) => {
  try {
    const newPayment = {
      id: nextId++,
      userId: paymentData.userId,
      paymentName: paymentData.paymentName,
      amount: paymentData.amount,
      program: paymentData.program,
      date: new Date().toISOString()
    };
    
    payments.push(newPayment);
    return newPayment;
  } catch (error) {
    console.error('결제 정보 추가 오류:', error);
    return null;
  }
};

/**
 * 사용자 ID로 결제 정보 확인
 * @param {number} userId - 사용자 ID
 * @returns {boolean} 결제 여부
 */
const checkUserPayment = (userId) => {
  return payments.some(payment => payment.userId === userId);
};

/**
 * 사용자 ID로 결제 정보 조회
 * @param {number} userId - 사용자 ID
 * @returns {Array} 결제 정보 목록
 */
const getPaymentsByUserId = (userId) => {
  return payments.filter(payment => payment.userId === userId);
};

// 모듈 내보내기
module.exports = {
  addPayment,
  checkUserPayment,
  getPaymentsByUserId
}; 