# CINE'MO

영화 애호가들을 위한 커뮤니티 웹사이트

## 주요 기능

- 회원가입 및 로그인 시스템
- 영화 심야 상영회 일정
- 아트나인 야외 상영회 정보
- 다양한 영화 프로그램 및 이벤트 정보

## 기술 스택

- **프론트엔드**: HTML, CSS, JavaScript
- **백엔드**: Node.js, Express.js, MongoDB
- **인증**: JWT (JSON Web Tokens)

## 설치 및 실행 방법

### 사전 준비

- Node.js, npm 설치
- MongoDB 설치 및 실행

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/cinemo.git
cd cinemo

# 의존성 설치
npm install
```

### 환경 변수 설정

backend 폴더에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/cinemo
JWT_SECRET=your_secret_key
```

### 실행

```bash
# 개발 서버 실행 (백엔드 + 프론트엔드)
npm run dev

# 백엔드만 실행
npm run server
```

## 개발자

- CINE'MO 개발팀 