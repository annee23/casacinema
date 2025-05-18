document.addEventListener('DOMContentLoaded', function() {
    // 모든 링크 스크롤 함수 정의
    function smoothScroll(targetElement) {
        if (targetElement) {
            // 헤더 높이 계산
            const headerHeight = document.querySelector('header').offsetHeight;
            
            // 모바일에서는 추가 여백 제공
            const isMobile = window.innerWidth <= 768;
            const mobileOffset = isMobile ? 50 : 30;
            
            // 요소의 실제 위치 계산
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight - mobileOffset;
            
            // 스크롤 이동
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // 모바일 메뉴 토글 기능
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // 메뉴 항목 클릭 시 메뉴 닫기
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // 현재 페이지 내 링크인 경우에만 처리
                const targetId = this.getAttribute('href');
                
                if (targetId.startsWith('#') && targetId.length > 1) {
                    e.preventDefault();
                    
                    // 모바일 메뉴 닫기
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    
                    const targetElement = document.querySelector(targetId);
                    
                    // 약간의 지연 후 스크롤 이동 (메뉴 닫힘 애니메이션 후)
                    setTimeout(() => {
                        smoothScroll(targetElement);
                    }, 300);
                } else {
                    // 외부 페이지 링크면 메뉴만 닫기
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('active');
                }
            });
        });
    }
    
    // 스크롤시 헤더 스타일 변경
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 입력 필드 스타일 처리
    const inputFields = document.querySelectorAll('input');
    if (inputFields.length > 0) {
        inputFields.forEach(input => {
            // 초기 배경색 설정
            input.style.backgroundColor = 'var(--dark)';
            input.style.background = 'var(--dark)';
            
            // 입력 및 포커스 이벤트
            ['focus', 'input', 'change', 'blur'].forEach(eventType => {
                input.addEventListener(eventType, function() {
                    this.style.backgroundColor = 'var(--dark)';
                    this.style.background = 'var(--dark)';
                    setTimeout(() => {
                        this.style.backgroundColor = 'var(--dark)';
                        this.style.background = 'var(--dark)';
                    }, 10);
                });
            });
        });
    }
    
    // iOS에서 100vh 문제 해결
    const setVhVariable = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVhVariable();
    window.addEventListener('resize', setVhVariable);
    
    // 탭 기능
    const tabs = document.querySelectorAll('.screening-tab');
    const panels = document.querySelectorAll('.screening-panel');

    if (tabs.length > 0 && panels.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                const target = this.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
    }
    
    // 로그인 모달 기능
    const loginButton = document.getElementById('login-button');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    const closeAndRedirect = document.querySelector('.close-and-redirect');
    
    console.log('모달 요소 확인:', { 
        loginButton: loginButton ? '존재함' : '없음',
        loginModal: loginModal ? '존재함' : '없음',
        closeModal: closeModal ? '존재함' : '없음'
    });
    
    if (loginButton && loginModal) {
        console.log('로그인 버튼에 이벤트 리스너 등록');
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
    
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }
    
    if (closeAndRedirect) {
        closeAndRedirect.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            
            // 현재 페이지가 index.html이면 페이지 내 스크롤, 아니면 socialring.html로 이동
            const redirectTarget = this.getAttribute('href');
            if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                const targetElement = document.querySelector(redirectTarget);
                if (targetElement) {
                    smoothScroll(targetElement);
                }
            } else {
                window.location.href = 'socialring.html' + redirectTarget;
            }
        });
    }
    
    // 회원가입 모달 기능
    const signupModal = document.getElementById('signup-modal');
    const showSignupModal = document.getElementById('show-signup-modal');
    const showLoginModal = document.getElementById('show-login-modal');
    const signupCloseModal = signupModal ? signupModal.querySelector('.close-modal') : null;
    
    // 회원가입 모달 열기
    if (showSignupModal) {
        showSignupModal.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            if (signupModal) signupModal.style.display = 'flex';
        });
    }
    
    // 로그인 모달 열기 (회원가입에서 돌아가기)
    if (showLoginModal) {
        showLoginModal.addEventListener('click', function(e) {
            e.preventDefault();
            if (signupModal) signupModal.style.display = 'none';
            if (loginModal) loginModal.style.display = 'flex';
        });
    }
    
    // 회원가입 모달 닫기
    if (signupCloseModal) {
        signupCloseModal.addEventListener('click', function() {
            signupModal.style.display = 'none';
        });
    }
    
    // 회원가입 모달 외부 클릭시 닫기
    if (signupModal) {
        window.addEventListener('click', function(e) {
            if (e.target === signupModal) {
                signupModal.style.display = 'none';
            }
        });
    }
    
    if (loginModal) {
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }
    
    // 로그아웃 알림 버튼 이벤트 처리
    const logoutCancelBtn = document.getElementById('logout-cancel');
    const logoutConfirmBtn = document.getElementById('logout-confirm');
    const logoutNotification = document.getElementById('logout-notification');
    
    if (logoutCancelBtn && logoutNotification) {
        logoutCancelBtn.addEventListener('click', function() {
            logoutNotification.style.display = 'none';
        });
    }
    
    if (logoutConfirmBtn && logoutNotification) {
        logoutConfirmBtn.addEventListener('click', function() {
            // 로그아웃 처리
            localStorage.removeItem('token');
            localStorage.setItem('isLoggedIn', 'false');
            
            // 알림 닫기
            logoutNotification.style.display = 'none';
            
            // 로그아웃 알림
            alert('로그아웃 되었습니다.');
            
            // UI 업데이트
            updateAuthUI(false, null);
            
            // 페이지 메인으로 이동
            window.location.href = 'index.html';
        });
    }
    
    // 인증 상태에 따른 UI 업데이트
    function updateAuthUI(isLoggedIn, username) {
        console.log('UI 업데이트 시작:', isLoggedIn);
        
        const loginButton = document.getElementById('login-button');
        const footerLoginBtn = document.getElementById('footer-login');
        const authButtonsContainer = document.querySelector('.auth-buttons');
        
        console.log('버튼 요소 확인:', { 
            loginButton: loginButton ? '존재함' : '없음', 
            footerLoginBtn: footerLoginBtn ? '존재함' : '없음',
            authButtonsContainer: authButtonsContainer ? '존재함' : '없음'
        });
        
        if (isLoggedIn) {
            // 마이페이지와 알림 아이콘 추가
            if (authButtonsContainer) {
                // 기존 아이콘이 있다면 모두 제거 (중복 방지)
                const existingIcons = authButtonsContainer.querySelectorAll('.auth-icon');
                existingIcons.forEach(icon => icon.remove());
                
                // 마이페이지 아이콘 생성
                const myPageIcon = document.createElement('a');
                myPageIcon.href = '#';
                myPageIcon.className = 'auth-icon mypage-icon';
                myPageIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                `;
                
                // 마이페이지 클릭 이벤트 추가
                myPageIcon.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('마이페이지 준비 중입니다.');
                });
                
                // 알림 아이콘 생성
                const notificationIcon = document.createElement('a');
                notificationIcon.href = '#';
                notificationIcon.className = 'auth-icon notification-icon';
                notificationIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                `;
                
                // 알림 클릭 이벤트 추가
                notificationIcon.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('알림 기능 준비 중입니다.');
                });
                
                // 아이콘 삽입 (로그인 버튼 앞에)
                if (loginButton) {
                    authButtonsContainer.insertBefore(myPageIcon, loginButton);
                    authButtonsContainer.insertBefore(notificationIcon, loginButton);
                    console.log('아이콘 추가 완료');
                }
                
                // 아이콘에 CSS 스타일 적용 (중복 방지)
                if (!document.getElementById('auth-icons-style')) {
                    const style = document.createElement('style');
                    style.id = 'auth-icons-style';
                    style.textContent = `
                        .auth-buttons {
                            display: flex;
                            align-items: center;
                            gap: 15px;
                        }
                        .auth-icon {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: var(--white);
                            transition: color 0.2s ease;
                        }
                        .auth-icon:hover {
                            color: var(--accent);
                        }
                        @media (max-width: 768px) {
                            .auth-buttons {
                                gap: 10px;
                            }
                            .auth-icon svg {
                                width: 18px;
                                height: 18px;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
            
            // 로그인/로그아웃 버튼 변경
            if (loginButton) {
                console.log('로그인 버튼 텍스트 변경: 로그아웃으로');
                const spanElement = loginButton.querySelector('span');
                if (spanElement) {
                    spanElement.textContent = '로그아웃';
                } else {
                    console.error('span 요소를 찾을 수 없음');
                    loginButton.textContent = '로그아웃';
                }
                
                // 이전 이벤트 리스너 제거 (클론 후 교체 방식으로 확실하게)
                const newButton = loginButton.cloneNode(true);
                loginButton.parentNode.replaceChild(newButton, loginButton);
                
                // 로그아웃 이벤트 리스너 추가
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('로그아웃 버튼 클릭됨');
                    const logoutNotification = document.getElementById('logout-notification');
                    if (logoutNotification) {
                        logoutNotification.style.display = 'flex';
                    } else {
                        console.error('로그아웃 알림 요소를 찾을 수 없음');
                    }
                });
            }
            
            // 푸터 로그인 링크 변경
            if (footerLoginBtn) {
                footerLoginBtn.textContent = '로그아웃';
                
                // 이전 이벤트 리스너 제거
                const newFooterBtn = footerLoginBtn.cloneNode(true);
                footerLoginBtn.parentNode.replaceChild(newFooterBtn, footerLoginBtn);
                
                // 푸터 로그아웃 버튼 클릭 이벤트
                newFooterBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const logoutNotification = document.getElementById('logout-notification');
                    if (logoutNotification) {
                        logoutNotification.style.display = 'flex';
                    }
                });
            }
        } else {
            // 마이페이지와 알림 아이콘 제거
            if (authButtonsContainer) {
                const icons = authButtonsContainer.querySelectorAll('.auth-icon');
                icons.forEach(icon => icon.remove());
            }
            
            // 로그인/로그아웃 버튼 복원
            if (loginButton) {
                console.log('로그인 버튼 텍스트 변경: 로그인으로');
                const spanElement = loginButton.querySelector('span');
                if (spanElement) {
                    spanElement.textContent = '로그인';
                } else {
                    console.error('span 요소를 찾을 수 없음');
                    loginButton.textContent = '로그인';
                }
                
                // 이전 이벤트 리스너 제거 (클론 후 교체 방식으로 확실하게)
                const newButton = loginButton.cloneNode(true);
                loginButton.parentNode.replaceChild(newButton, loginButton);
                
                // 로그인 이벤트 리스너 추가
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('로그인 버튼 클릭됨');
                    const loginModal = document.getElementById('login-modal');
                    if (loginModal) {
                        loginModal.style.display = 'flex';
                    } else {
                        console.error('로그인 모달을 찾을 수 없음');
                    }
                });
            }
            
            // 푸터 로그인 링크 변경
            if (footerLoginBtn) {
                footerLoginBtn.textContent = '로그인';
                
                // 이전 이벤트 리스너 제거
                const newFooterBtn = footerLoginBtn.cloneNode(true);
                footerLoginBtn.parentNode.replaceChild(newFooterBtn, footerLoginBtn);
                
                // 푸터 로그인 버튼 클릭 이벤트
                newFooterBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const loginModal = document.getElementById('login-modal');
                    if (loginModal) {
                        loginModal.style.display = 'flex';
                    }
                });
            }
        }
    }
    
    // 페이지 로드 시 로그인 상태 확인 및 UI 업데이트
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('로그인 상태 확인:', isLoggedIn);
    updateAuthUI(isLoggedIn);
    
    // 로그인 폼 제출 이벤트 처리
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginMessage = document.getElementById('login-message');
            
            // 간단한 유효성 검사
            if (!email || !password) {
                loginMessage.textContent = '이메일과 비밀번호를 모두 입력해주세요.';
                loginMessage.style.color = 'red';
                return;
            }
            
            // 로그인 처리 - 서버 API 호출
            loginMessage.textContent = '로그인 중...';
            loginMessage.style.color = 'blue';
            
            // API 엔드포인트 URL
            const apiUrl = '/api/auth/login';
            
            // API 요청 데이터
            const loginData = {
                email: email,
                password: password
            };
            
            console.log('로그인 요청 전송:', apiUrl);
            
            // Fetch API를 사용하여 서버에 요청
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                console.log('로그인 응답 상태:', response.status);
                // 응답 본문 반환
                return response.json().then(data => {
                    // status와 data를 함께 반환
                    return { status: response.status, data };
                });
            })
            .then(({ status, data }) => {
                console.log('로그인 응답 데이터:', data);
                
                if (status === 200 && data.success) {
                    // 로그인 성공
                    loginMessage.textContent = '로그인 성공!';
                    loginMessage.style.color = 'green';
                    
                    // 토큰 저장
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', data.user.name);
                    localStorage.setItem('userEmail', data.user.email);
                    
                    // UI 업데이트
                    updateAuthUI(true, data.user.name);
                    
                    // 모달 닫기 (1초 후)
                    setTimeout(() => {
                        document.getElementById('login-modal').style.display = 'none';
                        
                        // 페이지 새로고침 (UI 모두 업데이트)
                        window.location.reload();
                    }, 1000);
                } else {
                    // 로그인 실패
                    loginMessage.textContent = data.message || '이메일 또는 비밀번호가 올바르지 않습니다.';
                    loginMessage.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('로그인 처리 오류:', error);
                loginMessage.textContent = '서버 연결 오류가 발생했습니다.';
                loginMessage.style.color = 'red';
            });
        });
    }
    
    // 회원가입 폼 제출 이벤트 처리
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 입력 필드 값 가져오기
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            const signupMessage = document.getElementById('signup-message');
            
            // 간단한 유효성 검사
            if (!name || !email || !password || !confirmPassword) {
                signupMessage.textContent = '모든 필드를 입력해주세요.';
                signupMessage.style.color = 'red';
                return;
            }
            
            if (password !== confirmPassword) {
                signupMessage.textContent = '비밀번호가 일치하지 않습니다.';
                signupMessage.style.color = 'red';
                return;
            }
            
            // 회원가입 처리 - 서버 API 호출
            signupMessage.textContent = '처리 중...';
            signupMessage.style.color = 'blue';
            
            // API 엔드포인트 URL
            const apiUrl = '/api/auth/register';
            
            // API 요청 데이터
            const userData = {
                name: name,
                email: email,
                password: password
            };
            
            console.log('회원가입 요청 전송:', apiUrl);
            
            // Fetch API를 사용하여 서버에 요청
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                console.log('회원가입 응답 상태:', response.status);
                // 응답 본문 반환
                return response.json().then(data => {
                    // status와 data를 함께 반환
                    return { status: response.status, data };
                });
            })
            .then(({ status, data }) => {
                console.log('회원가입 응답 데이터:', data);
                
                if (status === 201 || (status === 200 && data.success)) {
                    // 회원가입 성공
                    signupMessage.textContent = '회원가입 성공! 자동 로그인됩니다.';
                    signupMessage.style.color = 'green';
                    
                    // 토큰 저장
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', data.user.name);
                    localStorage.setItem('userEmail', data.user.email);
                    
                    // UI 업데이트
                    updateAuthUI(true, data.user.name);
                    
                    // 1초 후 메인 페이지로 이동
                    setTimeout(() => {
                        // 현재 페이지가 index.html이면 페이지 새로고침, 아니면 index.html로 이동
                        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                            window.location.reload();
                        } else {
                            window.location.href = 'index.html';
                        }
                    }, 1000);
                } else {
                    // 회원가입 실패
                    signupMessage.textContent = data.message || '회원가입 처리 중 오류가 발생했습니다.';
                    signupMessage.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('회원가입 처리 오류:', error);
                signupMessage.textContent = '서버 연결 오류가 발생했습니다.';
                signupMessage.style.color = 'red';
            });
        });
    }
    
    // 프로젝트 및 컬렉션 이미지 최적화
    const optimizeProjectImages = () => {
        // 프로젝트 이미지 최적화
        const projectImages = document.querySelectorAll('.project-image img');
        if (projectImages.length > 0) {
            projectImages.forEach(img => {
                // 이미지가 로드된 후 처리
                if (img.complete) {
                    handleImageOptimization(img);
                } else {
                    img.addEventListener('load', () => {
                        handleImageOptimization(img);
                    });
                }
            });
        }
        
        // 컬렉션 이미지 최적화
        const collectionImages = document.querySelectorAll('.collection-image img');
        if (collectionImages.length > 0) {
            collectionImages.forEach(img => {
                // 이미지가 로드된 후 처리
                if (img.complete) {
                    handleImageOptimization(img);
                } else {
                    img.addEventListener('load', () => {
                        handleImageOptimization(img);
                    });
                }
            });
        }
    };
    
    // 이미지 최적화 처리 함수
    const handleImageOptimization = (img) => {
        const container = img.parentElement;
        
        // 이미지 비율 유지하면서 컨테이너에 맞추기
        if (img.naturalWidth > img.naturalHeight) {
            // 가로가 더 긴 이미지
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.transform = 'translateY(-25%)';
        } else {
            // 세로가 더 긴 이미지
            img.style.width = 'auto';
            img.style.height = '100%';
            img.style.transform = 'translateX(-25%)';
        }
    };
    
    // 페이지 로드시 이미지 최적화 실행
    optimizeProjectImages();
    
    // 윈도우 리사이즈시 이미지 최적화 다시 실행
    window.addEventListener('resize', optimizeProjectImages);
}); 