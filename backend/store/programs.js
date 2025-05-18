/**
 * MongoDB 기반 프로그램 저장소 구현
 */
const Program = require('../models/Program');
const connectDB = require('../config/db');

// 새 프로그램 추가
const addProgram = async (programData) => {
  try {
    await connectDB();
    const newProgram = new Program({
      name: programData.name,
      time: programData.time,
      location: programData.location,
      description: programData.description || '',
      imageUrl: programData.imageUrl || '',
    });
    
    const savedProgram = await newProgram.save();
    return {
      id: savedProgram._id,
      name: savedProgram.name,
      time: savedProgram.time,
      location: savedProgram.location,
      description: savedProgram.description,
      imageUrl: savedProgram.imageUrl
    };
  } catch (error) {
    console.error('프로그램 추가 오류:', error);
    return null;
  }
};

// 모든 프로그램 조회
const getAllPrograms = async () => {
  try {
    await connectDB();
    const programs = await Program.find().sort({ createdAt: -1 });
    
    return programs.map(program => ({
      id: program._id,
      name: program.name,
      time: program.time,
      location: program.location,
      description: program.description,
      imageUrl: program.imageUrl
    }));
  } catch (error) {
    console.error('프로그램 조회 오류:', error);
    return [];
  }
};

// ID로 프로그램 조회
const getProgramById = async (programId) => {
  try {
    await connectDB();
    const program = await Program.findById(programId);
    
    if (!program) {
      return null;
    }
    
    return {
      id: program._id,
      name: program.name,
      time: program.time,
      location: program.location,
      description: program.description,
      imageUrl: program.imageUrl
    };
  } catch (error) {
    console.error('프로그램 조회 오류:', error);
    return null;
  }
};

// 모듈 내보내기
module.exports = {
  addProgram,
  getAllPrograms,
  getProgramById
}; 