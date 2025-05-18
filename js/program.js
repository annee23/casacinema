// 프로그램 목록을 가져와 화면에 표시하는 기능 구현

document.addEventListener('DOMContentLoaded', () => {
  // 프로그램 목록 컨테이너 요소
  const programListContainer = document.querySelector('.program-list');
  
  // 프로그램 목록이 있는지 확인
  if (programListContainer) {
    // 프로그램 목록 가져오기
    fetchPrograms();
  }
});

// 프로그램 목록 가져오기
async function fetchPrograms() {
  try {
    const response = await fetch('/api/programs');
    const data = await response.json();
    
    if (data.success) {
      // 프로그램 목록 표시
      displayPrograms(data.programs);
    } else {
      console.error('프로그램 목록을 가져오는데 실패했습니다:', data.message);
    }
  } catch (error) {
    console.error('프로그램 목록 조회 중 오류 발생:', error);
    // 오류 발생 시 하드코딩된 예시 데이터 표시
    displayHardcodedPrograms();
  }
}

// 프로그램 목록 표시
function displayPrograms(programs) {
  const programListContainer = document.querySelector('.program-list');
  
  // 컨테이너가 존재하는지 확인
  if (!programListContainer) return;
  
  // 컨테이너 비우기
  programListContainer.innerHTML = '';
  
  // 프로그램 데이터가 없는 경우 하드코딩된 예시 데이터 표시
  if (!programs || programs.length === 0) {
    displayHardcodedPrograms();
    return;
  }
  
  // 프로그램 목록 표시
  programs.forEach(program => {
    const programItem = createProgramItem(program);
    programListContainer.appendChild(programItem);
  });
}

// 프로그램 아이템 HTML 생성
function createProgramItem(program) {
  const programItem = document.createElement('div');
  programItem.className = 'program-item-card';
  
  programItem.innerHTML = `
    <div class="program-image">
      <img src="${program.imageUrl || 'images/test.png'}" alt="${program.name}">
    </div>
    <div class="program-details">
      <h4 class="program-name">${program.name}</h4>
      <p class="program-time">${program.time}</p>
      <p class="program-location">${program.location}</p>
      ${program.description ? `<p class="program-description">${program.description}</p>` : ''}
    </div>
  `;
  
  return programItem;
}

// 하드코딩된 프로그램 목록 표시 (API 장애 시 폴백)
function displayHardcodedPrograms() {
  const programListContainer = document.querySelector('.program-list');
  
  // 컨테이너가 존재하는지 확인
  if (!programListContainer) return;
  
  // 하드코딩된 프로그램 목록
  const hardcodedPrograms = [
    {
      name: '해피엔드',
      time: '8:30 PM ~ 10:00 PM',
      location: '신도림 롯데시네마',
      imageUrl: 'images/test.png'
    },
    {
      name: '그 자연이 네게 뭐라고 하니',
      time: '7:30 PM ~ 9:30 PM',
      location: '아트하우스 모모',
      imageUrl: 'images/test2.png'
    },
    {
      name: '상상마당',
      time: '8:00 PM ~ 9:00 PM',
      location: '상상마당 홍대',
      imageUrl: 'images/test3.png'
    },
    {
      name: '아멜리에',
      time: '9:50 AM ~ 11:50 AM',
      location: '에무시네마',
      imageUrl: 'images/test4.png'
    }
  ];
  
  // 하드코딩된 프로그램 목록 표시
  hardcodedPrograms.forEach(program => {
    const programItem = createProgramItem(program);
    programListContainer.appendChild(programItem);
  });
} 