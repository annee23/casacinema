/**
 * 하드코딩된 프로그램 데이터를 MongoDB로 마이그레이션하는 스크립트
 */
const Program = require('./Program');
const connectDB = require('../config/db');

async function migratePrograms() {
  try {
    // MongoDB 연결
    await connectDB();
    
    // 프로그램 컬렉션 초기화 (기존 데이터 삭제)
    await Program.deleteMany({});
    
    // 하드코딩된 프로그램 데이터
    const defaultPrograms = [
      {
        name: '해피엔드',
        time: '8:30 PM ~ 10:00 PM',
        location: '신도림 롯데시네마',
        description: '마이클 하네케 감독의 대표작 상영회',
        imageUrl: '../../images/test.png'
      },
      {
        name: '그 자연이 네게 뭐라고 하니',
        time: '7:30 PM ~ 9:30 PM',
        location: '아트하우스 모모',
        description: '세월이 흘러도 변하지 않는 자연의 울림',
        imageUrl: '../../images/test2.png'
      },
      {
        name: '상상마당',
        time: '8:00 PM ~ 9:00 PM',
        location: '상상마당 홍대',
        description: '독립영화 상영회 및 감독과의 대화',
        imageUrl: '../../images/test3.png'
      },
      {
        name: '아멜리에',
        time: '9:50 AM ~ 11:50 AM',
        location: '에무시네마',
        description: '장 피에르 주네 감독의 프랑스 로맨틱 코미디',
        imageUrl: '../../images/test4.png'
      }
    ];
    
    // 프로그램 데이터 저장
    const inserted = await Program.insertMany(defaultPrograms);
    
    console.log(`${inserted.length}개의 프로그램이 성공적으로 마이그레이션되었습니다.`);
    
    return {
      success: true,
      count: inserted.length
    };
  } catch (error) {
    console.error('프로그램 마이그레이션 오류:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 모듈 내보내기
module.exports = {
  migratePrograms
}; 