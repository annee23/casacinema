/**
 * 메모리 기반 사용자 저장소 구현
 * 서버리스 환경에서 사용하기 위한 인메모리 DB
 */

// 인메모리 사용자 저장소
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'test1234',
    name: '테스트 사용자'
  }
];

// 다음 사용자 ID (자동 증가)
let nextId = 2;

/**
 * 이메일이 이미 존재하는지 확인
 * @param {string} email - 확인할 이메일
 * @returns {boolean} 이메일 존재 여부
 */
const isEmailExists = (email) => {
  return users.some(user => user.email === email);
};

/**
 * 새 사용자 추가
 * @param {object} userData - 사용자 데이터 (이름, 이메일, 비밀번호)
 * @returns {object|null} 추가된 사용자 객체 또는 실패 시 null
 */
const addUser = (userData) => {
  try {
    const newUser = {
      id: nextId++,
      name: userData.name,
      email: userData.email,
      password: userData.password // 실제 프로덕션에서는 반드시 암호화해야 함
    };
    
    users.push(newUser);
    return newUser;
  } catch (error) {
    console.error('사용자 추가 오류:', error);
    return null;
  }
};

/**
 * 이메일과 비밀번호로 사용자 찾기 (로그인용)
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {object|null} 찾은 사용자 객체 또는 없을 경우 null
 */
const findUserByCredentials = (email, password) => {
  return users.find(user => user.email === email && user.password === password) || null;
};

/**
 * 사용자 ID로 사용자 찾기
 * @param {number} id - 사용자 ID
 * @returns {object|null} 찾은 사용자 객체 또는 없을 경우 null
 */
const findUserById = (id) => {
  return users.find(user => user.id === id) || null;
};

// 모듈 내보내기
module.exports = {
  isEmailExists,
  addUser,
  findUserByCredentials,
  findUserById
}; 